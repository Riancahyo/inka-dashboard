import { Suspense } from "react";
import { AlertTriangle, CheckCircle, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentIssuesTable } from "@/components/dashboard/RecentIssuesTable";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardStats,
  getWeeklyReportsData,
  getCategoryDistribution,
  getRecentIssues,
} from "@/services/dashboard.service";
import {
  getMonthlyTrend,
  getTopTrains,
  getTechnicianLeaderboard,
  getMaintenanceCalendar,
  getStatusDistribution,
  getComparisonSnapshot,
} from "@/services/analytics.service";
import { ComparisonCards } from "@/components/analytics/ComparisonCards";
import { TrendChart } from "@/components/analytics/TrendChart";
import { TopTrains } from "@/components/analytics/TopTrains";
import { TeknisiLeaderboard } from "@/components/analytics/TeknisiLeaderboard";
import { MaintenanceCalendar } from "@/components/analytics/MaintenanceCalendar";
import { StatusDistribution } from "@/components/analytics/StatusDistribution";

async function DashboardContent() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const [
    stats,
    weeklyData,
    categoryData,
    recentIssues,
    monthlyTrend,
    topTrains,
    leaderboard,
    calendarEvents,
    statusDist,
    currentSnapshot,
    previousSnapshot,
  ] = await Promise.all([
    getDashboardStats(),
    getWeeklyReportsData(),
    getCategoryDistribution(),
    getRecentIssues(5),
    getMonthlyTrend(6),
    getTopTrains(5),
    getTechnicianLeaderboard(5),
    getMaintenanceCalendar(),
    getStatusDistribution(),
    getComparisonSnapshot(thisYear, thisMonth),
    getComparisonSnapshot(lastMonthYear, lastMonth),
  ]);

  return (
    <div className="space-y-6">
      {/* ── 1. Original Stats Cards ─────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Kerusakan Bulan Ini"
          value={stats.totalKerusakanBulanIni}
          icon={AlertTriangle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Kerusakan Berat"
          value={stats.kerusakanBerat}
          description="High & Critical"
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        <StatsCard
          title="Maintenance Completed"
          value={stats.maintenanceCompleted}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Teknisi Aktif"
          value={stats.teknisiAktif}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
      </div>

      {/* ── 2. NEW: Month-over-month Comparison ──────────────────────── */}
      <ComparisonCards current={currentSnapshot} previous={previousSnapshot} />

      {/* ── 3. NEW: Trend Chart (full width) ─────────────────────────── */}
      <TrendChart data={monthlyTrend} />

      {/* ── 4. Original weekly line + NEW Status Dist (side-by-side) ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Kerusakan per Minggu</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <LineChart data={weeklyData} />
            ) : (
              <div className="flex h-70 items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <StatusDistribution data={statusDist} />
      </div>

      {/* ── 5. Top Trains + Teknisi Leaderboard (side-by-side) ───────── */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopTrains data={topTrains} />
        <TeknisiLeaderboard data={leaderboard} />
      </div>

      {/* ── 6. Maintenance Calendar + Original Category Pie (side) ──── */}
      <div className="grid gap-6 md:grid-cols-2">
        <MaintenanceCalendar events={calendarEvents} />

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kerusakan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <PieChart data={categoryData} />
            ) : (
              <div className="flex h-70 items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 7. Recent Issues Table ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentIssuesTable issues={recentIssues} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of train maintenance and issues
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}