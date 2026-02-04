"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import type { LeaderboardItem } from "@/services/analytics.service";

interface TeknisiLeaderboardProps {
  data: LeaderboardItem[];
}

const RANK_STYLE: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-700",   
  1: "bg-gray-200 text-gray-600",       
  2: "bg-orange-100 text-orange-600",   
};

function scoreBadge(score: number) {
  if (score >= 80) return { label: "Excellent", cls: "bg-green-100 text-green-700" };
  if (score >= 60) return { label: "Good", cls: "bg-blue-100 text-blue-700" };
  if (score >= 40) return { label: "Fair", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "Poor", cls: "bg-red-100 text-red-700" };
}

export function TeknisiLeaderboard({ data }: TeknisiLeaderboardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Leaderboard Teknisi</CardTitle>
            <CardDescription>Peringkat berdasarkan tingkat penyelesaian</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-yellow-50 px-2.5 py-1">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">Ranking</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((tech, i) => {
              const badge = scoreBadge(tech.performanceScore);
              return (
                <div key={tech.id} className="flex items-center gap-3">
                  {/* Rank badge */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      RANK_STYLE[i] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tech.name}</p>
                      <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <Progress value={tech.performanceScore} className="mt-1.5 h-2" />
                    <div className="mt-1 flex gap-3">
                      <span className="text-xs text-gray-500">
                        Selesai: <strong className="text-gray-700">{tech.completed}</strong>/{tech.totalAssigned}
                      </span>
                      <span className="text-xs text-gray-500">
                        Aktif: <strong className="text-blue-600">{tech.active}</strong>
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: <strong className="text-gray-700">{tech.performanceScore}%</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-50 items-center justify-center text-sm text-gray-400">
            Belum ada data teknisi
          </div>
        )}
      </CardContent>
    </Card>
  );
}