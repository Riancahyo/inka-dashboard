import { supabase } from "@/lib/supabase";
import { TrainInsert, TrainUpdate } from "@/types/kereta";

export interface TrainData {
  id: string;
  train_code: string;
  name: string;
  type: string;
  year: number;
  created_at: string;
  crash_report?: Array<{ count: number }>;
  maintenance?: Array<{ count: number }>;
}

export interface TrainWithStats {
  id: string;
  train_code: string;
  name: string;
  type: string;
  year: number;
  created_at: string;
  total_laporan?: number;
  total_laporan_open?: number;
  total_maintenance?: number;
  last_maintenance?: string | null;
  kondisi?: "Layak" | "Perbaikan" | "Maintenance";
}

export interface TrainFilters {
  search?: string;
  type?: string;
  kondisi?: string;
}

export async function getAllTrains(filters?: TrainFilters) {
  try {
    const query = supabase
      .from("trains")
      .select(
        `
        *,
        crash_report(count),
        maintenance(count)
      `,
      )
      .order("train_code", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching trains:", error);
      throw error;
    }

    const trainsWithStats: TrainWithStats[] = await Promise.all(
      (data || []).map(async (train: TrainData) => {
        const { count: openReports } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("train_id", train.id)
          .in("status", ["Open", "On Progress"]);

        const { data: lastMaintenance } = await supabase
          .from("maintenance")
          .select("schedule_date")
          .eq("train_id", train.id)
          .order("schedule_date", { ascending: false })
          .limit(1)
          .single();

        let kondisi: "Layak" | "Perbaikan" | "Maintenance" = "Layak";
        if (openReports && openReports > 0) {
          kondisi = "Perbaikan";
        }

        return {
          ...train,
          total_laporan: train.crash_report?.[0]?.count || 0,
          total_laporan_open: openReports || 0,
          total_maintenance: train.maintenance?.[0]?.count || 0,
          last_maintenance: lastMaintenance?.schedule_date || null,
          kondisi,
        };
      }),
    );

    let result = trainsWithStats;

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (train) =>
          train.train_code.toLowerCase().includes(searchLower) ||
          train.name.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.type) {
      result = result.filter((train) => train.type === filters.type);
    }

    if (filters?.kondisi) {
      result = result.filter((train) => train.kondisi === filters.kondisi);
    }

    return result;
  } catch (error) {
    console.error("Error fetching trains:", error);
    return [];
  }
}

export async function getTrainById(id: string) {
  try {
    console.log("Fetching train with ID:", id);

    const { data: train, error } = await supabase
      .from("trains")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!train) {
      console.error("No train found for ID:", id);
      return null;
    }

    const { data: crashReports, error: crashError } = await supabase
      .from("crash_report")
      .select(
        `
        id,
        severity,
        status,
        description,
        reported_date,
        technicians (
          name,
          expertise
        )
      `,
      )
      .eq("train_id", id)
      .order("reported_date", { ascending: false });

    if (crashError) {
      console.error("Error fetching crash reports:", crashError);
    }

    const { data: maintenanceList, error: maintenanceError } = await supabase
      .from("maintenance")
      .select("*")
      .eq("train_id", id)
      .order("schedule_date", { ascending: false });

    if (maintenanceError) {
      console.error("Error fetching maintenance:", maintenanceError);
    }

    const { data: inspections, error: inspectionsError } = await supabase
      .from("inspections")
      .select("*")
      .eq("train_id", id)
      .order("date", { ascending: false });

    if (inspectionsError) {
      console.error("Error fetching inspections:", inspectionsError);
    }

    console.log("Successfully fetched train with details");

    return {
      ...train,
      crash_reports: crashReports || [],
      maintenance: maintenanceList || [],
      inspections: inspections || [],
    };
  } catch (error: any) {
    console.error("Error in getTrainById:", error);
    return null;
  }
}

export async function createTrain(train: TrainInsert) {
  try {
    const { data, error } = await supabase
      .from("trains")
      .insert(train as any)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating train:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTrain(id: string, updates: TrainUpdate) {
  try {
    const { data, error } = await supabase
      .from("trains")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating train:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTrain(id: string) {
  try {
    const { error } = await supabase.from("trains").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting train:", error);
    return { success: false, error: error.message };
  }
}

export async function getTrainTypes() {
  try {
    const { data, error } = await supabase
      .from("trains")
      .select("type")
      .order("type", { ascending: true });

    if (error) throw error;

    const uniqueTypes = [...new Set(data?.map((t) => t.type) || [])];
    return uniqueTypes;
  } catch (error) {
    console.error("Error fetching train types:", error);
    return [];
  }
}
