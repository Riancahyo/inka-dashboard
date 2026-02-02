import { supabase } from './supabase'

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up new user
export async function signUp({ email, password, name }: SignUpData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error signing up:', error)
    return { success: false, error: error.message }
  }
}

// Sign in existing user
export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error signing in:', error)
    return { success: false, error: error.message }
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error signing out:', error)
    return { success: false, error: error.message }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get session
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) throw error

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}