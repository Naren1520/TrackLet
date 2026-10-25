"use client";

import * as React from "react";
import { AccountWithUsage, UsageChannel } from "@/types/usage";
import { Check, Minus, Edit2, Trash2 } from "lucide-react";
import clsx from "clsx";

interface UsageSpreadsheetProps {
  accounts: AccountWithUsage[];
  year: number;
  onToggleMonth: (accountId: string, month: number, channel: UsageChannel, currentUsed: boolean) => Promise<void>;
  onEdit: (account: AccountWithUsage) => void;
  onDelete: (account: AccountWithUsage) => void;
}

const MONTHS = [
  { num: 1, name: "JAN" },
  { num: 2, name: "FEB" },
  { num: 3, name: "MAR" },
  { num: 4, name: "APR" },
  { num: 5, name: "MAY" },
  { num: 6, name: "JUN" },
  { num: 7, name: "JUL" },
  { num: 8, name: "AUG" },
  { num: 9, name: "SEP" },
  { num: 10, name: "OCT" },
  { num: 11, name: "NOV" },
  { num: 12, name: "DEC" },
];

export function UsageSpreadsheet({
  accounts,
  year,
  onToggleMonth,
  onEdit,
  onDelete,
}: UsageSpreadsheetProps) {
  const [updating, setUpdating] = React.useState<{ accountId: string; month: number; channel: UsageChannel } | null>(null);

  async function handleCellClick(accountId: string, month: number, channel: UsageChannel, currentUsed: boolean) {
    setUpdating({ accountId, month, channel });
    try {
      await onToggleMonth(accountId, month, channel, currentUsed);
    } finally {
      setUpdating(null);
    }
  }

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="w-full border border-neutral-300 bg-white rounded-xs shadow-xs overflow-hidden flex flex-col font-sans">
      {/* Spreadsheet Header Micro-bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100/90 border-b border-neutral-300 text-xs font-medium text-neutral-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-900 tracking-tight">TRACKLET SPREADSHEET &bull; {year}</span>
          <span className="text-neutral-400">|</span>
          <span>{accounts.length} Accounts</span>
          <span className="text-neutral-400">|</span>
          <span>24 Credit Slots per Row</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-emerald-600 inline-block" /> Gmail: Used
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-slate-700 inline-block" /> GitHub: Used
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-none bg-neutral-200 border border-neutral-300 inline-block" /> Pending
          </span>
        </div>
      </div>

      {/* Spreadsheet Grid Container with Horizontal & Vertical Scrolling */}
      <div className="overflow-x-auto max-h-[72vh] relative">
        <table className="w-full border-collapse text-left">
          {/* Sticky Excel Table Header */}
          <thead className="sticky top-0 z-20 bg-neutral-50 shadow-xs select-none">
            {/* Row 1: Month Super-headers */}
            <tr className="border-b border-neutral-300">
              {/* Account Column (Sticky Left) */}
              <th
                rowSpan={2}
                className="sticky left-0 z-30 bg-neutral-100 border-r border-b border-neutral-300 px-3 py-2 text-xs font-bold text-neutral-900 uppercase tracking-tight min-w-[180px] max-w-[220px]"
              >
                Account / Email ID
              </th>

              {/* 12 Months spanning 2 sub-columns each */}
              {MONTHS.map((m) => (
                <th
                  key={m.num}
                  colSpan={2}
                  className="border-r border-neutral-300 px-1 py-1.5 text-center text-xs font-bold text-neutral-800 bg-neutral-100/70 tracking-wide"
                >
                  {m.name}
                </th>
              ))}

              {/* Summary Columns */}
              <th
                colSpan={3}
                className="border-r border-neutral-300 px-2 py-1.5 text-center text-xs font-bold text-neutral-900 bg-neutral-100/70 tracking-tight"
              >
                Annual Summary
              </th>

              {/* Actions Header */}
              <th
                rowSpan={2}
                className="border-b border-neutral-300 px-1.5 py-2 text-center text-xs font-bold text-neutral-700 uppercase min-w-[55px] w-[55px]"
              >
                Actions
              </th>
            </tr>

            {/* Row 2: Sub-columns (Gmail / GitHub under each month) */}
            <tr className="border-b border-neutral-300 bg-neutral-50 text-[10px] font-semibold text-neutral-600">
              {MONTHS.map((m) => (
                <React.Fragment key={`sub-${m.num}`}>
                  <th
                    className="border-r border-neutral-200 px-0.5 py-1 text-center w-[34px] sm:w-[38px] min-w-[32px] bg-emerald-50/60 text-emerald-900 font-bold text-[9.5px]"
                    title={`${m.name} Gmail Credits`}
                  >
                    Gmail
                  </th>
                  <th
                    className="border-r border-neutral-300 px-0.5 py-1 text-center w-[34px] sm:w-[38px] min-w-[32px] bg-slate-50 text-slate-800 font-bold text-[9.5px]"
                    title={`${m.name} GitHub Credits`}
                  >
                    GitHub
                  </th>
                </React.Fragment>
              ))}

              {/* Summary sub-headers */}
              <th className="border-r border-neutral-200 px-1 py-1 text-center w-11 text-emerald-900 font-bold text-[9.5px]">
                Gmail
              </th>
              <th className="border-r border-neutral-200 px-1 py-1 text-center w-11 text-slate-900 font-bold text-[9.5px]">
                GitHub
              </th>
              <th className="border-r border-neutral-300 px-1 py-1 text-center w-12 font-bold text-neutral-900 text-[9.5px]">
                Rate %
              </th>
            </tr>
          </thead>

          {/* Table Body: Rows of Email IDs */}
          <tbody className="divide-y divide-neutral-200 text-sm">
            {accounts.map((acc, rowIndex) => {
              const isEven = rowIndex % 2 === 0;

              return (
                <tr
                  key={acc._id}
                  className={clsx(
                    "transition-colors hover:bg-neutral-100/70 group",
                    isEven ? "bg-white" : "bg-neutral-50/50"
                  )}
                >
                  {/* Sticky Account Info Cell */}
                  <td
                    className={clsx(
                      "sticky left-0 z-10 border-r border-neutral-300 px-3 py-2 transition-colors",
                      isEven ? "bg-white group-hover:bg-neutral-100" : "bg-neutral-50 group-hover:bg-neutral-100"
                    )}
                  >
                    <div className="font-semibold text-neutral-900 text-sm truncate max-w-[210px]" title={acc.gmail}>
                      {acc.gmail}
                    </div>
                    <div className="text-xs text-neutral-500 truncate max-w-[210px] mt-0.5" title={`@${acc.githubUsername}`}>
                      @{acc.githubUsername}
                      {acc.displayName && (
                        <span className="text-neutral-400 ml-1.5 font-normal">&bull; {acc.displayName}</span>
                      )}
                    </div>
                  </td>

                  {/* 12 Months × 2 Sub-columns = 24 Interactive Cells */}
                  {MONTHS.map((m) => {
                    const monthUsage = acc.usage[m.num] || { gmailUsed: false, githubUsed: false };
                    const { gmailUsed, githubUsed } = monthUsage;

                    const isUpdatingGmail =
                      updating?.accountId === acc._id &&
                      updating?.month === m.num &&
                      updating?.channel === "gmail";

                    const isUpdatingGithub =
                      updating?.accountId === acc._id &&
                      updating?.month === m.num &&
                      updating?.channel === "github";

                    return (
                      <React.Fragment key={`${acc._id}-${m.num}`}>
                        {/* Gmail Cell */}
                        <td
                          onClick={() => !isUpdatingGmail && handleCellClick(acc._id, m.num, "gmail", gmailUsed)}
                          className={clsx(
                            "border-r border-neutral-200 p-0 text-center cursor-pointer transition-colors select-none",
                            gmailUsed
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                              : "hover:bg-neutral-100 text-neutral-300"
                          )}
                          title={`${acc.gmail} - ${m.name} Gmail Credits: ${gmailUsed ? "Used (Click to mark Pending)" : "Pending (Click to mark Used)"}`}
                        >
                          <div className="w-full h-8 flex items-center justify-center">
                            {isUpdatingGmail ? (
                              <span className="w-2.5 h-2.5 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                            ) : gmailUsed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                            ) : (
                              <Minus className="w-3 h-3 text-neutral-300 group-hover:text-neutral-400" />
                            )}
                          </div>
                        </td>

                        {/* GitHub Cell */}
                        <td
                          onClick={() => !isUpdatingGithub && handleCellClick(acc._id, m.num, "github", githubUsed)}
                          className={clsx(
                            "border-r border-neutral-300 p-0 text-center cursor-pointer transition-colors select-none",
                            githubUsed
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              : "hover:bg-neutral-100 text-neutral-300"
                          )}
                          title={`${acc.gmail} - ${m.name} GitHub Credits: ${githubUsed ? "Used (Click to mark Pending)" : "Pending (Click to mark Used)"}`}
                        >
                          <div className="w-full h-8 flex items-center justify-center">
                            {isUpdatingGithub ? (
                              <span className="w-2.5 h-2.5 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                            ) : githubUsed ? (
                              <Check className="w-3.5 h-3.5 text-slate-800 stroke-[2.5]" />
                            ) : (
                              <Minus className="w-3 h-3 text-neutral-300 group-hover:text-neutral-400" />
                            )}
                          </div>
                        </td>
                      </React.Fragment>
                    );
                  })}

                  {/* Summary Totals */}
                  <td className="border-r border-neutral-200 px-1.5 py-1.5 text-center text-xs font-semibold text-emerald-900 bg-emerald-50/20 tabular-nums">
                    {acc.gmailCompletedMonths}
                    <span className="text-[10px] text-neutral-400 font-normal">/12</span>
                  </td>
                  <td className="border-r border-neutral-200 px-1.5 py-1.5 text-center text-xs font-semibold text-slate-900 bg-slate-50/30 tabular-nums">
                    {acc.githubCompletedMonths}
                    <span className="text-[10px] text-neutral-400 font-normal">/12</span>
                  </td>
                  <td className="border-r border-neutral-300 px-2 py-1.5 text-right tabular-nums">
                    <span className="text-xs font-bold text-neutral-900">
                      {acc.completionPercentage}%
                    </span>
                    <div className="text-[10px] text-neutral-400 font-medium">
                      {acc.totalCompletedSlots}/24
                    </div>
                  </td>

                  {/* Action buttons */}
                  <td className="px-2 py-1 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEdit(acc)}
                        title="Edit account group"
                        aria-label="Edit account group"
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 rounded-xs transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(acc)}
                        title="Delete account group"
                        aria-label="Delete account group"
                        className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Bottom Status Bar */}
      <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
        <div className="flex items-center gap-3">
          <span>Row count: <strong className="text-neutral-800">{accounts.length}</strong></span>
          <span>&bull;</span>
          <span>Click any cell to toggle credit usage</span>
          <span>&bull;</span>
          <span>Changes save instantly to MongoDB Atlas</span>
        </div>
        <div className="text-xs text-neutral-700 font-semibold">
          Tracking Year: {year}
        </div>
      </div>
    </div>
  );
}
