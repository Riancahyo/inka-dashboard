"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ComparisonSnapshot } from "@/services/analytics.service";

interface ComparisonCardsProps {
  current: ComparisonSnapshot;   
  previous: ComparisonSnapshot;  
}

interface MetricDef {
  label: string;
  currentKey: keyof ComparisonSnapshot;
  icon: string; 
  positiveIsUp: boolean;
}

const METRICS: MetricDef[] = [
  { label: "Total Laporan",      currentKey: "totalReports",          icon: "📋", positiveIsUp: false },
  { label: "Critical",           currentKey: "criticalReports",       icon: "🔴", positiveIsUp: false },
  { label: "Selesai",            currentKey: "completedReports",      icon: "✅", positiveIsUp: true  },
  { label: "Maintenance Done",   currentKey: "maintenanceCompleted",  icon: "🔧", positiveIsUp: true  },
];

function DeltaBadge({ current, previous, positiveIsUp }: { current: number; previous: number; positiveIsUp: boolean }) {
  const diff = current - previous;

  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }

  const pct = previous !== 0 ? Math.round(Math.abs(diff / previous) * 100) : 100;
  const isGood = positiveIsUp ? diff > 0 : diff < 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {pct}%
    </span>
  );
}

export function ComparisonCards({ current, previous }: ComparisonCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {METRICS.map((m) => {
        const cur = current[m.currentKey];
        const prev = previous[m.currentKey];
        return (
          <div key={m.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg">{m.icon}</span>
              <DeltaBadge current={cur} previous={prev} positiveIsUp={m.positiveIsUp} />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{cur}</p>
            <p className="text-xs font-medium text-gray-500">{m.label}</p>
            <p className="mt-1 text-xs text-gray-400">Bulan lalu: <strong>{prev}</strong></p>
          </div>
        );
      })}
    </div>
  );
}