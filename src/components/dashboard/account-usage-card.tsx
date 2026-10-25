"use client";

import * as React from "react";
import { AccountWithUsage, UsageChannel } from "@/types/usage";
import { MonthToggle } from "./month-toggle";
import { Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AccountUsageCardProps {
  account: AccountWithUsage;
  year: number;
  onToggleMonth: (accountId: string, month: number, channel: UsageChannel, currentUsed: boolean) => Promise<void>;
  onEdit: (account: AccountWithUsage) => void;
  onDelete: (account: AccountWithUsage) => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function AccountUsageCard({
  account,
  year,
  onToggleMonth,
  onEdit,
  onDelete,
}: AccountUsageCardProps) {
  const [updating, setUpdating] = React.useState<{ month: number; channel: UsageChannel } | null>(null);

  async function handleToggle(month: number, channel: UsageChannel, currentUsed: boolean) {
    setUpdating({ month, channel });
    try {
      await onToggleMonth(account._id, month, channel, currentUsed);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="border border-neutral-300 bg-white rounded-xs p-4 space-y-3.5 transition-colors hover:border-neutral-400">
      {/* Top Header: Account Info & Channel Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-neutral-900 font-mono text-xs">
              {account.gmail}
            </span>
            <span className="text-neutral-400 text-xs">&bull;</span>
            <span className="text-neutral-600 font-mono text-xs">
              @{account.githubUsername}
            </span>
            {account.isFullyCompleted && (
              <Badge variant="used" className="ml-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                24/24 Used
              </Badge>
            )}
          </div>
          {account.displayName && (
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {account.displayName}
            </div>
          )}
          {account.notes && (
            <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1 italic">
              Note: {account.notes}
            </div>
          )}
        </div>

        {/* Dual Channel Stats & Actions */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          {/* Channel stats badges */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Gmail Credits</span>
              <span className="font-semibold text-emerald-800 tabular-nums">
                {account.gmailCompletedMonths}/12
              </span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">GitHub Credits</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {account.githubCompletedMonths}/12
              </span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Overall ({year})</span>
              <span className="font-bold text-neutral-900 tabular-nums">
                {account.completionPercentage}%
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-neutral-200" />

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(account)}
              title="Edit account group"
              aria-label="Edit account group"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(account)}
              title="Delete account group"
              aria-label="Delete account group"
              className="p-1.5 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 12-Month Dual-Channel Interactive Grid */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono uppercase mb-1.5">
          <span>Monthly Credit Tracker ({year}) &bull; Gmail &amp; GitHub</span>
          <span>Click either channel to toggle</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {MONTH_NAMES.map((name, index) => {
            const monthNum = index + 1;
            const monthUsage = account.usage[monthNum] || { gmailUsed: false, githubUsed: false };
            const isUpdatingThisMonth = updating?.month === monthNum;

            return (
              <MonthToggle
                key={monthNum}
                month={monthNum}
                monthName={name}
                usage={monthUsage}
                disabledChannel={isUpdatingThisMonth ? updating.channel : null}
                onToggle={handleToggle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
