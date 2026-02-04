"use client";

import {
  BarChart as RechBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface HorizontalBarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
}

const BAR_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

export function HorizontalBarChart({ data, height = 240 }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechBar data={data} layout="vertical" margin={{ top: 0, right: 24, left: 60, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </RechBar>
    </ResponsiveContainer>
  );
}