"use client";

import {
  AreaChart as RechArtsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataKey {
  key: string;
  color: string;
  label: string;
}

interface AreaChartProps {
  data: Record<string, any>[];
  xKey: string;
  dataKeys: DataKey[];
  height?: number;
}

export function AreaChart({ data, xKey, dataKeys, height = 280 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechArtsArea data={data}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient key={dk.key} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dk.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={dk.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontSize: "13px",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
        />
        {dataKeys.map((dk) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.label}
            stroke={dk.color}
            strokeWidth={2}
            fill={`url(#grad-${dk.key})`}
          />
        ))}
      </RechArtsArea>
    </ResponsiveContainer>
  );
}