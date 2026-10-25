"use client";

import * as React from "react";
import { AccountRanking } from "@/types/analytics";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface AccountRankingTableProps {
  rankings: AccountRanking[];
}

export function AccountRankingTable({ rankings }: AccountRankingTableProps) {
  if (rankings.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-200 bg-white rounded-xs">
        No accounts registered yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-300 bg-white rounded-xs">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-medium text-neutral-500 uppercase tracking-tight font-mono">
          <tr>
            <th className="py-2 px-3 w-12 text-center">Rank</th>
            <th className="py-2 px-3">Account Group</th>
            <th className="py-2 px-3">GitHub</th>
            <th className="py-2 px-3 text-center">Gmail Credits</th>
            <th className="py-2 px-3 text-center">GitHub Credits</th>
            <th className="py-2 px-3 text-center">Total (24)</th>
            <th className="py-2 px-3 text-right">Progress</th>
            <th className="py-2 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rankings.map((account, index) => {
            const isTop = account.isFullyCompleted;
            const remainingSlots = 24 - account.totalCompleted;

            return (
              <tr
                key={account.id}
                className="hover:bg-neutral-50/80 transition-colors"
              >
                <td className="py-2.5 px-3 text-center font-mono font-medium text-neutral-500 tabular-nums">
                  #{index + 1}
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-medium text-neutral-900 font-mono">
                    {account.gmail}
                  </div>
                  {account.displayName && account.displayName !== account.gmail && (
                    <div className="text-[11px] text-neutral-500">
                      {account.displayName}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-3 font-mono text-neutral-600">
                  @{account.githubUsername}
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-800 tabular-nums">
                  {account.gmailCompleted} / 12
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800 tabular-nums">
                  {account.githubCompleted} / 12
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-900 tabular-nums">
                  {account.totalCompleted} / 24
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                      {account.completionPercentage}%
                    </span>
                    <div className="w-16 h-1.5 bg-neutral-200 rounded-none overflow-hidden shrink-0">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: `${account.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  {isTop ? (
                    <Badge variant="used" className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      24/24 Done
                    </Badge>
                  ) : (
                    <Badge variant="pending" className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {remainingSlots} left
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
