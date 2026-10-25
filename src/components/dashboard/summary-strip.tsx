"use client";

import * as React from "react";
import { DashboardMetrics } from "@/types/analytics";

interface SummaryStripProps {
  metrics: DashboardMetrics;
  selectedYear: number;
}

export function SummaryStrip({ metrics, selectedYear }: SummaryStripProps) {
  const totalGmailPossible = metrics.totalAccounts * 12;
  const totalGithubPossible = metrics.totalAccounts * 12;

  return (
    <div className="w-full border border-neutral-300 bg-white rounded-xs font-sans shadow-xs">
      {/* Top micro-bar showing year context */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50/80 text-xs text-neutral-600">
        <span className="font-semibold text-neutral-800">SUMMARY METRICS ({selectedYear})</span>
        <span className="font-medium text-neutral-500">
          {metrics.totalPossibleSlots} TOTAL AVAILABLE CREDIT SLOTS (GMAIL + GITHUB)
        </span>
      </div>

      {/* Metrics Row: 5 dense columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
        {/* Total Accounts */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tight">
            Account Groups
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
              {metrics.totalAccounts}
            </span>
            <span className="text-xs text-neutral-500 font-medium">pairs</span>
          </div>
        </div>

        {/* Gmail Credits Used */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-emerald-600 inline-block" />
            Gmail Credits
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-800 tabular-nums">
              {metrics.gmailCompletedCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              / {totalGmailPossible} mo
            </span>
          </div>
        </div>

        {/* GitHub Credits Used */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-slate-700 inline-block" />
            GitHub Credits
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-800 tabular-nums">
              {metrics.githubCompletedCount}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              / {totalGithubPossible} mo
            </span>
          </div>
        </div>

        {/* Combined Completion Rate */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tight">
            Overall Completion
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
              {metrics.overallCompletionPercentage}%
            </span>
            <div className="w-20 h-2 bg-neutral-200 rounded-none overflow-hidden self-center ml-1">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, metrics.overallCompletionPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fully Completed Accounts (24/24) */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-tight">
            Fully Used (24/24)
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
              {metrics.fullyCompletedAccounts}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              of {metrics.totalAccounts} accounts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
