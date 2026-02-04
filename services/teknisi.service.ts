import { supabase } from "@/lib/supabase";
import { TechnicianInsert, TechnicianUpdate } from "@/types/teknisi";

export interface TechnicianWithStats {
  id: string;
  name: string;
  expertise: string;
  contact: string;
  created_at: string;
  total_assigned?: number;
  active_reports?: number;
  completed_reports?: number;
  performance_score?: number;
}

export interface TechnicianFilters {
  search?: string;
  expertise?: string;
}

export async function getAllTechnicians(filters?: TechnicianFilters) {
  try {
    const query = supabase
      .from("technicians")
      .select("*")
      .order("name", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching technicians:", error);
      throw error;
    }

    const techniciansWithStats: TechnicianWithStats[] = await Promise.all(
      (data || []).map(async (tech: any) => {
        const { count: totalAssigned } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id);
        const { count: activeReports } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id)
          .in("status", ["Open", "On Progress"]);

        const { count: completedReports } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id)
          .eq("status", "Finished");

        const performanceScore =
          totalAssigned && totalAssigned > 0
            ? Math.round(((completedReports || 0) / totalAssigned) * 100)
            : 0;

        return {
          ...tech,
          total_assigned: totalAssigned || 0,
          active_reports: activeReports || 0,
          completed_reports: completedReports || 0,
          performance_score: performanceScore,
        };
      }),
    );

    let result = techniciansWithStats;

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.name.toLowerCase().includes(searchLower) ||
          tech.expertise.toLowerCase().includes(searchLower) ||
          tech.contact.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.expertise) {
      result = result.filter((tech) => tech.expertise === filters.expertise);
    }

    return result;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
}

export async function getTechnicianById(id: string) {
  try {
    console.log("Fetching technician with ID:", id);

    const { data: technician, error } = await supabase
      .from("technicians")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!technician) {
      console.error("No technician found for ID:", id);
      return null;
    }
    interface CrashReport {
      id: string;
      severity: string;
      status: string;
      description: string;
      reported_date: string;
      trains: {
        train_code: string;
        name: string;
        type: string;
      };
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
        trains (
          train_code,
          name,
          type
        )
      `,
      )
      .eq("technician_id", id)
      .order("reported_date", { ascending: false });

    if (crashError) {
      console.error("Error fetching crash reports:", crashError);
    }

    const typedCrashReports = (crashReports || []) as CrashReport[];
    const totalAssigned = typedCrashReports.length || 0;
    const activeReports =
      typedCrashReports.filter((r) =>
        ["Open", "On Progress"].includes(r.status),
      ).length || 0;
    const completedReports =
      typedCrashReports.filter((r) => r.status === "Finished").length || 0;
    const performanceScore =
      totalAssigned > 0
        ? Math.round((completedReports / totalAssigned) * 100)
        : 0;

    console.log("Successfully fetched technician with details");

    return {
      ...technician,
      crash_reports: crashReports || [],
      stats: {
        total_assigned: totalAssigned,
        active_reports: activeReports,
        completed_reports: completedReports,
        performance_score: performanceScore,
      },
    };
  } catch (error: any) {
    console.error("Error in getTechnicianById:", error);
    return null;
  }
}

export async function createTechnician(technician: TechnicianInsert) {
  try {
    const { data, error } = await supabase
      .from("technicians")
      .insert(technician as any)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating technician:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTechnician(id: string, updates: TechnicianUpdate) {
  try {
    const { data, error } = await supabase
      .from("technicians")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating technician:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTechnician(id: string) {
  try {
    const { error } = await supabase.from("technicians").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting technician:", error);
    return { success: false, error: error.message };
  }
}

export async function getTechnicianExpertise() {
  try {
    const { data, error } = await supabase
      .from("technicians")
      .select("expertise")
      .order("expertise", { ascending: true });

    if (error) throw error;

    const uniqueExpertise = [...new Set(data?.map((t) => t.expertise) || [])];
    return uniqueExpertise;
  } catch (error) {
    console.error("Error fetching expertise:", error);
    return [];
  }
}

export async function getTechnicianStats() {
  try {
    const { count: totalTechnicians } = await supabase
      .from("technicians")
      .select("*", { count: "exact", head: true });

    const { data: activeData } = await supabase
      .from("crash_report")
      .select("technician_id")
      .in("status", ["Open", "On Progress"])
      .not("technician_id", "is", null);

    const activeTechnicians = new Set(activeData?.map((r) => r.technician_id))
      .size;

    const { count: totalAssigned } = await supabase
      .from("crash_report")
      .select("*", { count: "exact", head: true })
      .not("technician_id", "is", null);

    const { count: completedReports } = await supabase
      .from("crash_report")
      .select("*", { count: "exact", head: true })
      .eq("status", "Finished")
      .not("technician_id", "is", null);

    return {
      totalTechnicians: totalTechnicians || 0,
      activeTechnicians: activeTechnicians || 0,
      totalAssigned: totalAssigned || 0,
      completedReports: completedReports || 0,
    };
  } catch (error) {
    console.error("Error fetching technician stats:", error);
    return {
      totalTechnicians: 0,
      activeTechnicians: 0,
      totalAssigned: 0,
      completedReports: 0,
    };
  }
}
