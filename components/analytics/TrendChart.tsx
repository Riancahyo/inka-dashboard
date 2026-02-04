"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart } from "@/components/charts/AreaChart";
import { TrendingUp } from "lucide-react";
import type { MonthlyTrendItem } from "@/services/analytics.service";

interface TrendChartProps {
  data: MonthlyTrendItem[];
}

const DATA_KEYS = [
  { key: "total", color: "#3b82f6", label: "Total" },
  { key: "critical", color: "#ef4444", label: "Critical" },
  { key: "high", color: "#f97316", label: "High" },
];

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Tren Kerusakan 6 Bulan</CardTitle>
            <CardDescription>Total, Critical & High per bulan</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">Trend</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <AreaChart data={data} xKey="month" dataKeys={DATA_KEYS} />
        ) : (
          <div className="flex h-70 items-center justify-center text-sm text-gray-400">
            Belum ada data trend
          </div>
        )}
      </CardContent>
    </Card>
  );
}