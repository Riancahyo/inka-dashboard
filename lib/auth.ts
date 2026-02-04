"use server";

import { createClient } from "@/lib/supabase-server";
import { UserProfile, UserRole } from "@/types/roles";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, name }: SignUpData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error && error.message !== "User ID not available after signup") {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function signIn({ email, password }: SignInData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user;
}

export async function getSession() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getSession();

  if (error) return null;
  return data.session;
}

export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const uid = userId || (await getCurrentUser())?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) return null;

  return data as UserProfile;
}

export async function getUserRole(): Promise<UserRole> {
  const profile = await getUserProfile();
  return profile?.role || "viewer";
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];

  return data as UserProfile[];
}
