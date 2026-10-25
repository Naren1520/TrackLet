"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardMetrics } from "@/types/analytics";

interface OverallCompletionChartProps {
  metrics: DashboardMetrics;
}

export function OverallCompletionChart({ metrics }: OverallCompletionChartProps) {
  const {
    gmailCompletedCount,
    githubCompletedCount,
    totalPendingSlots,
    overallCompletionPercentage,
    totalPossibleSlots,
  } = metrics;

  const data = [
    { name: "Gmail Credits Used", value: gmailCompletedCount, color: "#15803d" },
    { name: "GitHub Credits Used", value: githubCompletedCount, color: "#334155" },
    { name: "Pending Slots", value: totalPendingSlots, color: "#cbd5e1" },
  ];

  if (totalPossibleSlots === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500 rounded-xs">
        <span>No accounts recorded yet.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
      {/* Donut Chart with center metric */}
      <div className="relative w-48 h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  return (
                    <div className="border border-neutral-300 bg-white p-2 shadow-sm text-xs rounded-xs">
                      <span className="font-semibold text-neutral-800">{entry.name}: </span>
                      <span className="font-mono tabular-nums">{entry.value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Exact percentage centered inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums">
            {overallCompletionPercentage}%
          </span>
          <span className="text-[10px] text-neutral-500 font-medium uppercase">
            CAPACITY
          </span>
        </div>
      </div>

      {/* Legend & Dual-channel Details */}
      <div className="w-full space-y-2.5">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-700 rounded-none shrink-0" />
            <span className="text-xs font-medium text-neutral-700">Gmail Credits Used</span>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-900 tabular-nums">
            {gmailCompletedCount} / {metrics.totalAccounts * 12}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-700 rounded-none shrink-0" />
            <span className="text-xs font-medium text-neutral-700">GitHub Credits Used</span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-800 tabular-nums">
            {githubCompletedCount} / {metrics.totalAccounts * 12}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-300 rounded-none shrink-0" />
            <span className="text-xs font-medium text-neutral-700">Remaining Pending</span>
          </div>
          <span className="text-xs font-mono font-semibold text-neutral-700 tabular-nums">
            {totalPendingSlots}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 font-mono">
          <span>TOTAL CREDIT SLOTS:</span>
          <span className="tabular-nums font-semibold">{totalPossibleSlots} (12 Gmail + 12 GitHub)</span>
        </div>
      </div>
    </div>
  );
}
