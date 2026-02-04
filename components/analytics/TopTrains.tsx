"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { AlertTriangle } from "lucide-react";
import type { TopTrainItem } from "@/services/analytics.service";

interface TopTrainsProps {
  data: TopTrainItem[];
}

export function TopTrains({ data }: TopTrainsProps) {
  const chartData = data.map((t) => ({
    name: t.train_code,
    value: t.count,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Top 5 Kereta Bermasalah</CardTitle>
            <CardDescription>Berdasarkan jumlah laporan kerusakan</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-orange-50 px-2.5 py-1">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600">Top 5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <HorizontalBarChart data={chartData} />
            {/* Detail list below chart */}
            <div className="mt-4 space-y-2">
              {data.map((train, i) => (
                <div key={train.train_id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{train.train_code}</span>
                      <span className="ml-2 text-xs text-gray-500">{train.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{train.type}</span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      {train.count} laporan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-60 items-center justify-center text-sm text-gray-400">
            Belum ada data kerusakan
          </div>
        )}
      </CardContent>
    </Card>
  );
}