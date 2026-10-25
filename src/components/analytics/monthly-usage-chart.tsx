"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { MonthlyUsageSummary } from "@/types/analytics";

interface MonthlyUsageChartProps {
  data: MonthlyUsageSummary[];
  totalAccounts: number;
}

export function MonthlyUsageChart({ data, totalAccounts }: MonthlyUsageChartProps) {
  if (totalAccounts === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500 rounded-xs">
        <span>No account groups registered yet.</span>
        <span className="mt-1 text-neutral-400">Add account groups to visualize monthly credit metrics.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          barSize={16}
        >
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="monthName"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, Math.max(1, totalAccounts)]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const gmailVal = Number(payload.find((p) => p.dataKey === "gmailCompleted")?.value || 0);
                const githubVal = Number(payload.find((p) => p.dataKey === "githubCompleted")?.value || 0);
                const totalUsed = gmailVal + githubVal;
                const totalPossible = totalAccounts * 2;
                const pct = totalPossible > 0 ? Math.round((totalUsed / totalPossible) * 100) : 0;

                return (
                  <div className="border border-neutral-300 bg-white p-2.5 shadow-sm text-xs rounded-xs">
                    <p className="font-semibold text-neutral-900 border-b border-neutral-200 pb-1 mb-1.5 font-mono">
                      {label} Credits ({pct}% Used)
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-emerald-800 font-medium">Gmail Credits:</span>
                        <span className="font-mono tabular-nums font-semibold text-emerald-900">
                          {gmailVal} / {totalAccounts}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-800 font-medium">GitHub Credits:</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {githubVal} / {totalAccounts}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-100 text-[11px] text-neutral-500">
                        <span>Combined:</span>
                        <span className="font-mono tabular-nums font-semibold text-neutral-900">
                          {totalUsed} / {totalPossible}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingBottom: "8px" }}
          />
          <Bar
            dataKey="gmailCompleted"
            name="Gmail Credits"
            fill="#15803d"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="githubCompleted"
            name="GitHub Credits"
            fill="#334155"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
