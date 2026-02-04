"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart2 } from "lucide-react";
import type { StatusDistItem } from "@/services/analytics.service";

interface StatusDistributionProps {
  data: StatusDistItem[];
}

export function StatusDistribution({ data }: StatusDistributionProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Distribusi Status Laporan</CardTitle>
            <CardDescription>Open, On Progress & Finished</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1">
            <BarChart2 className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-600">Status</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <PieChart data={data} />

            {/* Detail list below pie */}
            <div className="mt-4 space-y-2">
              {data.map((item) => {
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                      <span className="text-xs text-gray-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}

              {/* Total row */}
              <div className="mt-2 border-t border-gray-100 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Total</span>
                <span className="text-sm font-bold text-gray-800">{total}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-60 items-center justify-center text-sm text-gray-400">
            Belum ada data status
          </div>
        )}
      </CardContent>
    </Card>
  );
}