import { supabase } from "@/lib/supabase";

export interface MonthlyTrendItem {
  month: string; 
  total: number;
  critical: number;
  high: number;
}

export interface TopTrainItem {
  train_id: string;
  train_code: string;
  name: string;
  type: string;
  count: number;
}

export interface LeaderboardItem {
  id: string;
  name: string;
  expertise: string;
  totalAssigned: number;
  completed: number;
  active: number;
  performanceScore: number; 
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  urgency: string;
  status: string;
  train_code: string;
}

export interface ComparisonSnapshot {
  totalReports: number;
  criticalReports: number;
  completedReports: number;
  maintenanceCompleted: number;
}

export interface StatusDistItem {
  name: string;
  value: number;
  color: string; 
}

const MONTH_LABELS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export async function getMonthlyTrend(months: number = 6): Promise<MonthlyTrendItem[]> {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const { data, error } = await supabase
      .from("crash_report")
      .select("reported_date, severity")
      .gte("reported_date", startDate.toISOString())
      .order("reported_date", { ascending: true });

    if (error) throw error;

    const buckets: Record<string, MonthlyTrendItem> = {};
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets[key] = {
        month: MONTH_LABELS[d.getMonth()],
        total: 0,
        critical: 0,
        high: 0,
      };
    }

    (data as Array<{ reported_date: string; severity: string }>).forEach((row) => {
      const d = new Date(row.reported_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets[key];
      if (!bucket) return;
      bucket.total++;
      if (row.severity === "Critical") bucket.critical++;
      if (row.severity === "High") bucket.high++;
    });

    return Object.values(buckets);
  } catch (err) {
    console.error("getMonthlyTrend:", err);
    return [];
  }
}

export async function getTopTrains(limit: number = 5): Promise<TopTrainItem[]> {
  try {
    const { data, error } = await supabase
      .from("crash_report")
      .select(`
        train_id,
        trains (
          train_code,
          name,
          type
        )
      `);

    if (error) throw error;

    type Row = {
      train_id: string;
      trains: { train_code: string; name: string; type: string } | null;
    };

    const map = new Map<string, TopTrainItem>();

    (data as Row[]).forEach((row) => {
      if (!row.trains) return;
      const prev = map.get(row.train_id);
      if (prev) {
        prev.count++;
      } else {
        map.set(row.train_id, {
          train_id: row.train_id,
          train_code: row.trains.train_code,
          name: row.trains.name,
          type: row.trains.type,
          count: 1,
        });
      }
    });

    return [...map.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (err) {
    console.error("getTopTrains:", err);
    return [];
  }
}

export async function getTechnicianLeaderboard(limit: number = 5): Promise<LeaderboardItem[]> {
  try {
    const { data: technicians, error } = await supabase
      .from("technicians")
      .select("id, name, expertise");

    if (error) throw error;

    const results: LeaderboardItem[] = await Promise.all(
      (technicians as Array<{ id: string; name: string; expertise: string }>).map(async (tech) => {
        const { count: totalAssigned } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id);

        const { count: completed } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id)
          .eq("status", "Finished");

        const { count: active } = await supabase
          .from("crash_report")
          .select("*", { count: "exact", head: true })
          .eq("technician_id", tech.id)
          .in("status", ["Open", "On Progress"]);

        const total = totalAssigned || 0;
        const done = completed || 0;

        return {
          id: tech.id,
          name: tech.name,
          expertise: tech.expertise,
          totalAssigned: total,
          completed: done,
          active: active || 0,
          performanceScore: total > 0 ? Math.round((done / total) * 100) : 0,
        };
      })
    );

    return results
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, limit);
  } catch (err) {
    console.error("getTechnicianLeaderboard:", err);
    return [];
  }
}

export async function getMaintenanceCalendar(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from("maintenance")
      .select(`
        id,
        maintenance_type,
        urgency,
        status,
        schedule_date,
        trains (
          train_code
        )
      `)
      .order("schedule_date", { ascending: true });

    if (error) throw error;

    type Row = {
      id: string;
      maintenance_type: string;
      urgency: string;
      status: string;
      schedule_date: string;
      trains: { train_code: string } | null;
    };

    return (data as Row[]).map((row) => ({
      id: row.id,
      title: `${row.trains?.train_code || "?"} – ${row.maintenance_type}`,
      date: row.schedule_date,
      urgency: row.urgency,
      status: row.status,
      train_code: row.trains?.train_code || "",
    }));
  } catch (err) {
    console.error("getMaintenanceCalendar:", err);
    return [];
  }
}

export async function getStatusDistribution(): Promise<StatusDistItem[]> {
  try {
    const { data, error } = await supabase
      .from("crash_report")
      .select("status");

    if (error) throw error;

    const counts: Record<string, number> = {};
    (data as Array<{ status: string }>).forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1;
    });

    const COLOR_MAP: Record<string, string> = {
      Open: "#9ca3af",
      "On Progress": "#3b82f6",
      Finished: "#22c55e",
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COLOR_MAP[name] || "#6b7280",
    }));
  } catch (err) {
    console.error("getStatusDistribution:", err);
    return [];
  }
}

export async function getComparisonSnapshot(
  year: number,
  month: number 
): Promise<ComparisonSnapshot> {
  try {
    const firstDay = new Date(year, month, 1).toISOString();
    const firstDayNext = new Date(year, month + 1, 1).toISOString();

    const [totalRes, criticalRes, completedRes, maintRes] = await Promise.all([
      supabase
        .from("crash_report")
        .select("*", { count: "exact", head: true })
        .gte("reported_date", firstDay)
        .lt("reported_date", firstDayNext),

      supabase
        .from("crash_report")
        .select("*", { count: "exact", head: true })
        .eq("severity", "Critical")
        .gte("reported_date", firstDay)
        .lt("reported_date", firstDayNext),

      supabase
        .from("crash_report")
        .select("*", { count: "exact", head: true })
        .eq("status", "Finished")
        .gte("reported_date", firstDay)
        .lt("reported_date", firstDayNext),

      supabase
        .from("maintenance")
        .select("*", { count: "exact", head: true })
        .eq("status", "Completed")
        .gte("schedule_date", firstDay)
        .lt("schedule_date", firstDayNext),
    ]);

    return {
      totalReports: totalRes.count || 0,
      criticalReports: criticalRes.count || 0,
      completedReports: completedRes.count || 0,
      maintenanceCompleted: maintRes.count || 0,
    };
  } catch (err) {
    console.error("getComparisonSnapshot:", err);
    return { totalReports: 0, criticalReports: 0, completedReports: 0, maintenanceCompleted: 0 };
  }
}