"use client";

import * as React from "react";
import { AccountWithUsage } from "@/types/usage";
import { Check, Minus } from "lucide-react";
import clsx from "clsx";

interface MonthlyMatrixTableProps {
  accounts: AccountWithUsage[];
  readOnly?: boolean;
}

const MONTH_HEADERS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function MonthlyMatrixTable({
  accounts,
}: MonthlyMatrixTableProps) {
  if (accounts.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-200 bg-white rounded-xs">
        No accounts registered yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-300 bg-white rounded-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-medium text-neutral-600 font-mono">
          <tr>
            <th className="py-2.5 px-3 uppercase tracking-tight min-w-[200px]">
              Account Group
            </th>
            {MONTH_HEADERS.map((name) => (
              <th
                key={name}
                className="py-2.5 px-1.5 text-center font-medium text-neutral-600 w-14 uppercase"
              >
                {name}
              </th>
            ))}
            <th className="py-2.5 px-3 text-right uppercase tracking-tight min-w-[100px]">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {accounts.map((account) => {
            return (
              <tr
                key={account._id}
                className="hover:bg-neutral-50/70 transition-colors"
              >
                <td className="py-2.5 px-3">
                  <div className="font-mono font-medium text-neutral-900 text-xs truncate max-w-[240px]">
                    {account.gmail}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 truncate max-w-[240px]">
                    @{account.githubUsername}
                    {account.displayName && ` &bull; ${account.displayName}`}
                  </div>
                </td>

                {MONTH_HEADERS.map((name, index) => {
                  const monthNum = index + 1;
                  const monthData = account.usage[monthNum] || { gmailUsed: false, githubUsed: false };
                  const { gmailUsed, githubUsed } = monthData;

                  return (
                    <td
                      key={monthNum}
                      className="py-1.5 px-1 text-center"
                    >
                      <div className="flex flex-col gap-1 items-center justify-center">
                        {/* Gmail Status */}
                        <div
                          className={clsx(
                            "w-11 h-4 flex items-center justify-between px-1 rounded-xs border text-[9px] font-mono",
                            gmailUsed
                              ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold"
                              : "bg-neutral-50 border-neutral-200 text-neutral-400"
                          )}
                          title={`${name} Gmail: ${gmailUsed ? "Used" : "Pending"}`}
                        >
                          <span>G</span>
                          {gmailUsed ? (
                            <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[2.5]" />
                          ) : (
                            <Minus className="w-2.5 h-2.5 text-neutral-300" />
                          )}
                        </div>

                        {/* GitHub Status */}
                        <div
                          className={clsx(
                            "w-11 h-4 flex items-center justify-between px-1 rounded-xs border text-[9px] font-mono",
                            githubUsed
                              ? "bg-slate-100 border-slate-400 text-slate-900 font-semibold"
                              : "bg-neutral-50 border-neutral-200 text-neutral-400"
                          )}
                          title={`${name} GitHub: ${githubUsed ? "Used" : "Pending"}`}
                        >
                          <span>GH</span>
                          {githubUsed ? (
                            <Check className="w-2.5 h-2.5 text-slate-800 stroke-[2.5]" />
                          ) : (
                            <Minus className="w-2.5 h-2.5 text-neutral-300" />
                          )}
                        </div>
                      </div>
                    </td>
                  );
                })}

                <td className="py-2.5 px-3 text-right font-mono">
                  <div className="text-xs font-semibold text-neutral-900 tabular-nums">
                    {account.totalCompletedSlots} <span className="text-neutral-400 font-normal">/ 24</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center justify-end gap-1.5">
                    <span className="text-emerald-800">G: {account.gmailCompletedMonths}</span>
                    <span>&bull;</span>
                    <span className="text-slate-800">GH: {account.githubCompletedMonths}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
