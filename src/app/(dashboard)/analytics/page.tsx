"use client";

import * as React from "react";
import { DashboardData } from "@/types/analytics";
import { MonthlyUsageChart } from "@/components/analytics/monthly-usage-chart";
import { OverallCompletionChart } from "@/components/analytics/overall-completion-chart";
import { AccountRankingTable } from "@/components/analytics/account-ranking-table";
import { MonthlyMatrixTable } from "@/components/analytics/monthly-matrix-table";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Loader2, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAnalytics = React.useCallback(async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?year=${year}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to load analytics");
      } else {
        setData(json.data);
      }
    } catch {
      setError("Unable to connect to server. Check database configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics(selectedYear);
  }, [selectedYear, fetchAnalytics]);

  const yearOptions = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Usage Analytics
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Aggregated performance metrics and completion rankings for {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 border border-neutral-300 bg-white px-2 py-1 rounded-xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Select analytics year"
              className="bg-transparent text-xs font-mono font-medium text-neutral-900 focus:outline-none cursor-pointer"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => fetchAnalytics(selectedYear)}
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="border border-red-200 bg-red-50 p-3 rounded-xs text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="py-20 flex flex-col items-center justify-center text-xs text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mb-2" />
          <span>Loading analytics for {selectedYear}...</span>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Monthly Trend Chart */}
            <div className="lg:col-span-2 border border-neutral-300 bg-white p-4 rounded-xs shadow-sm">
              <div className="pb-3 mb-2 border-b border-neutral-200">
                <h2 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  1. Monthly Usage Distribution
                </h2>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Completed vs. Pending account-months per month ({selectedYear})
                </p>
              </div>
              <MonthlyUsageChart
                data={data.monthlySummaries}
                totalAccounts={data.metrics.totalAccounts}
              />
            </div>

            {/* Overall Completion Donut */}
            <div className="border border-neutral-300 bg-white p-4 rounded-xs shadow-sm">
              <div className="pb-3 mb-2 border-b border-neutral-200">
                <h2 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  2. Overall Capacity
                </h2>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Total completed vs pending account-months
                </p>
              </div>
              <OverallCompletionChart metrics={data.metrics} />
            </div>
          </div>

          {/* Account Completion Rankings */}
          <div className="border border-neutral-300 bg-white p-4 rounded-xs space-y-3 shadow-sm">
            <div className="border-b border-neutral-200 pb-2">
              <h2 className="text-xs font-semibold text-neutral-900 tracking-tight">
                3. Account Completion Ranking
              </h2>
              <p className="text-[11px] text-neutral-500 font-mono">
                Accounts ordered by completion percentage for {selectedYear}
              </p>
            </div>
            <AccountRankingTable rankings={data.accountRankings} />
          </div>

          {/* Monthly Account Matrix */}
          <div className="border border-neutral-300 bg-white p-4 rounded-xs space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <div>
                <h2 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  4. Monthly Account Matrix
                </h2>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Full 12-month cross-reference table of all account groups ({selectedYear})
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-none inline-block" /> Used
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-neutral-300 rounded-none inline-block" /> Pending
                </span>
              </div>
            </div>
            <MonthlyMatrixTable
              accounts={data.accountsWithUsage}
              readOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
