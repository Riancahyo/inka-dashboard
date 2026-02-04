import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalKerusakanBulanIni: number;
  kerusakanBerat: number;
  maintenanceCompleted: number;
  teknisiAktif: number;
}

export interface WeeklyData {
  name: string;
  value: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface RecentIssue {
  id: string;
  train_code: string;
  train_name: string;
  severity: string;
  status: string;
  reported_date: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayString = firstDayOfMonth.toISOString();

    const { count: totalKerusakan } = await supabase
      .from("crash_report")
      .select("*", { count: "exact", head: true })
      .gte("reported_date", firstDayString);

    const { count: kerusakanBerat } = await supabase
      .from("crash_report")
      .select("*", { count: "exact", head: true })
      .in("severity", ["High", "Critical"])
      .eq("status", "Open");

    const { count: maintenanceCompleted } = await supabase
      .from("maintenance")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed")
      .gte("schedule_date", firstDayString);

    const { data: teknisiAktif } = await supabase
      .from("crash_report")
      .select("technician_id")
      .eq("status", "On Progress")
      .not("technician_id", "is", null);

    type TechnicianData = { technician_id: string };
    const typedTekhnisiAktif = teknisiAktif as TechnicianData[] | null;

    const uniqueTechnicians = new Set(
      typedTekhnisiAktif?.map((item) => item.technician_id) || [],
    );

    return {
      totalKerusakanBulanIni: totalKerusakan || 0,
      kerusakanBerat: kerusakanBerat || 0,
      maintenanceCompleted: maintenanceCompleted || 0,
      teknisiAktif: uniqueTechnicians.size,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalKerusakanBulanIni: 0,
      kerusakanBerat: 0,
      maintenanceCompleted: 0,
      teknisiAktif: 0,
    };
  }
}

export async function getWeeklyReportsData(): Promise<WeeklyData[]> {
  try {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const { data, error } = await supabase
      .from("crash_report")
      .select("reported_date")
      .gte("reported_date", fourWeeksAgo.toISOString())
      .order("reported_date", { ascending: true });

    if (error) throw error;

    const weeklyData: Record<string, number> = {};

    const typedData = data as Array<{ reported_date: string }> | null;

    typedData?.forEach((item) => {
      const date = new Date(item.reported_date);
      const weekNumber = Math.floor(
        (date.getTime() - fourWeeksAgo.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      const weekLabel = `Week ${weekNumber + 1}`;

      weeklyData[weekLabel] = (weeklyData[weekLabel] || 0) + 1;
    });

    return Object.entries(weeklyData).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return [];
  }
}

export async function getCategoryDistribution(): Promise<CategoryData[]> {
  try {
    const { data, error } = await supabase
      .from("crash_report")
      .select("severity");

    if (error) throw error;

    const severityCounts: Record<string, number> = {};

    const typedData = data as Array<{ severity: string }> | null;

    typedData?.forEach((item) => {
      severityCounts[item.severity] = (severityCounts[item.severity] || 0) + 1;
    });

    return Object.entries(severityCounts).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return [];
  }
}

export async function getRecentIssues(
  limit: number = 5,
): Promise<RecentIssue[]> {
  try {
    const { data, error } = await supabase
      .from("crash_report")
      .select(
        `
        id,
        severity,
        status,
        reported_date,
        trains!inner (
          train_code,
          name
        )
      `,
      )
      .order("reported_date", { ascending: false })
      .limit(limit);

    if (error) throw error;

    type QueryResult = {
      id: string;
      severity: string;
      status: string;
      reported_date: string;
      trains: {
        train_code: string;
        name: string;
      } | null;
    };

    const typedData = data as QueryResult[] | null;

    return (
      typedData?.map((item) => ({
        id: item.id,
        train_code: item.trains?.train_code || "N/A",
        train_name: item.trains?.name || "Unknown",
        severity: item.severity,
        status: item.status,
        reported_date: item.reported_date,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching recent issues:", error);
    return [];
  }
}
