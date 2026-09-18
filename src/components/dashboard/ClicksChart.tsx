"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ClicksChartProps {
  data: { date: string; clicks: number }[];
}

export default function ClicksChart({ data }: ClicksChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-warm-gray text-sm font-body">
        No data yet. Clicks will appear here once customers start tapping.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4332" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1B4332" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#8B8680" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#8B8680" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFDF9",
            border: "1px solid #E8E2D9",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "var(--font-inter)",
          }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#1B4332"
          strokeWidth={2}
          fill="url(#clicksGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
