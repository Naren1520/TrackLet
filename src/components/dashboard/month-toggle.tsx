"use client";

import * as React from "react";
import clsx from "clsx";
import { Check, Minus } from "lucide-react";
import { UsageChannel, MonthChannelUsage } from "@/types/usage";

interface MonthToggleProps {
  month: number;
  monthName: string;
  usage: MonthChannelUsage;
  disabledChannel?: UsageChannel | null;
  onToggle: (month: number, channel: UsageChannel, currentUsed: boolean) => void;
}

export function MonthToggle({
  month,
  monthName,
  usage,
  disabledChannel,
  onToggle,
}: MonthToggleProps) {
  const { gmailUsed, githubUsed } = usage;

  return (
    <div className="flex flex-col rounded-xs border border-neutral-200 bg-white p-1 text-[11px] select-none hover:border-neutral-300 transition-colors">
      {/* Month Label */}
      <div className="text-[10px] font-mono font-medium text-neutral-600 text-center pb-1 border-b border-neutral-100">
        {monthName}
      </div>

      {/* Dual Channel Toggles */}
      <div className="flex flex-col gap-1 pt-1">
        {/* Gmail Toggle */}
        <button
          type="button"
          role="checkbox"
          aria-checked={gmailUsed}
          aria-label={`${monthName} Gmail: ${gmailUsed ? "Used" : "Pending"}`}
          disabled={disabledChannel === "gmail"}
          onClick={() => onToggle(month, "gmail", gmailUsed)}
          className={clsx(
            "flex items-center justify-between px-1.5 py-0.5 rounded-xs border text-[10px] font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:opacity-50",
            gmailUsed
              ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold hover:bg-emerald-100"
              : "bg-neutral-50/70 border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800 hover:bg-neutral-100"
          )}
          title={`Gmail Credits for ${monthName}: Click to mark as ${gmailUsed ? "Pending" : "Used"}`}
        >
          <span className="font-semibold">Gmail</span>
          {gmailUsed ? (
            <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[2.5]" />
          ) : (
            <Minus className="w-2.5 h-2.5 text-neutral-300" />
          )}
        </button>

        {/* GitHub Toggle */}
        <button
          type="button"
          role="checkbox"
          aria-checked={githubUsed}
          aria-label={`${monthName} GitHub: ${githubUsed ? "Used" : "Pending"}`}
          disabled={disabledChannel === "github"}
          onClick={() => onToggle(month, "github", githubUsed)}
          className={clsx(
            "flex items-center justify-between px-1.5 py-0.5 rounded-xs border text-[10px] font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:opacity-50",
            githubUsed
              ? "bg-slate-100 border-slate-400 text-slate-900 font-semibold hover:bg-slate-200"
              : "bg-neutral-50/70 border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800 hover:bg-neutral-100"
          )}
          title={`GitHub Credits for ${monthName}: Click to mark as ${githubUsed ? "Pending" : "Used"}`}
        >
          <span className="font-semibold">GitHub</span>
          {githubUsed ? (
            <Check className="w-2.5 h-2.5 text-slate-800 stroke-[2.5]" />
          ) : (
            <Minus className="w-2.5 h-2.5 text-neutral-300" />
          )}
        </button>
      </div>
    </div>
  );
}
