"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SummaryStrip } from "@/components/dashboard/summary-strip";
import { UsageSpreadsheet } from "@/components/dashboard/usage-spreadsheet";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { DeleteAccountModal } from "@/components/accounts/delete-account-modal";
import { DashboardData } from "@/types/analytics";
import { AccountWithUsage, UsageChannel } from "@/types/usage";
import { AccountGroup } from "@/types/account";
import {
  Plus,
  Search,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "COMPLETED" | "PENDING">("ALL");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<AccountGroup | null>(null);
  const [deletingAccount, setDeletingAccount] = React.useState<AccountGroup | null>(null);

  const fetchDashboardData = React.useCallback(async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?year=${year}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to load dashboard data");
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
    fetchDashboardData(selectedYear);
  }, [selectedYear, fetchDashboardData]);

  // Handle month toggle with optimistic update
  async function handleToggleMonth(
    accountId: string,
    month: number,
    channel: UsageChannel,
    currentUsed: boolean
  ) {
    if (!data) return;

    const newUsed = !currentUsed;

    // Optimistically update local state
    setData((prev) => {
      if (!prev) return prev;
      const updatedAccounts = prev.accountsWithUsage.map((acc) => {
        if (acc._id !== accountId) return acc;
        const currentMonthUsage = acc.usage[month] || { gmailUsed: false, githubUsed: false };
        const updatedMonthUsage = {
          ...currentMonthUsage,
          [channel === "gmail" ? "gmailUsed" : "githubUsed"]: newUsed,
        };
        const newUsage = { ...acc.usage, [month]: updatedMonthUsage };

        let gmailCount = 0;
        let githubCount = 0;
        for (let m = 1; m <= 12; m++) {
          if (newUsage[m]?.gmailUsed) gmailCount++;
          if (newUsage[m]?.githubUsed) githubCount++;
        }
        const totalCompleted = gmailCount + githubCount;
        return {
          ...acc,
          usage: newUsage,
          gmailCompletedMonths: gmailCount,
          githubCompletedMonths: githubCount,
          totalCompletedSlots: totalCompleted,
          totalPossibleSlots: 24,
          completionPercentage: Math.round((totalCompleted / 24) * 100),
          isFullyCompleted: totalCompleted === 24,
        };
      });

      // Recalculate metrics
      const totalAccounts = updatedAccounts.length;
      const totalPossibleSlots = totalAccounts * 24;
      let totalGmail = 0;
      let totalGithub = 0;
      let fullyCompleted = 0;
      for (const a of updatedAccounts) {
        totalGmail += a.gmailCompletedMonths;
        totalGithub += a.githubCompletedMonths;
        if (a.isFullyCompleted) fullyCompleted++;
      }
      const totalCompletedSlots = totalGmail + totalGithub;
      const totalPendingSlots = totalPossibleSlots - totalCompletedSlots;
      const overallCompletionPercentage =
        totalPossibleSlots > 0 ? Math.round((totalCompletedSlots / totalPossibleSlots) * 100) : 0;

      // Recalculate monthly summaries
      const monthlySummaries = prev.monthlySummaries.map((ms) => {
        if (ms.month !== month) return ms;
        const gComp = updatedAccounts.filter((a) => a.usage[month]?.gmailUsed).length;
        const ghComp = updatedAccounts.filter((a) => a.usage[month]?.githubUsed).length;
        const completed = gComp + ghComp;
        return {
          ...ms,
          gmailCompleted: gComp,
          githubCompleted: ghComp,
          completed,
          pending: totalAccounts * 2 - completed,
        };
      });

      return {
        ...prev,
        accountsWithUsage: updatedAccounts,
        monthlySummaries,
        metrics: {
          totalAccounts,
          gmailCompletedCount: totalGmail,
          githubCompletedCount: totalGithub,
          totalPossibleSlots,
          totalCompletedSlots,
          totalPendingSlots,
          overallCompletionPercentage,
          fullyCompletedAccounts: fullyCompleted,
        },
      };
    });

    try {
      const res = await fetch("/api/usage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          year: selectedYear,
          month,
          channel,
          used: newUsed,
        }),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        fetchDashboardData(selectedYear);
        alert(resJson.error || "Failed to update monthly usage.");
      }
    } catch {
      fetchDashboardData(selectedYear);
      alert("Network error: failed to persist usage change.");
    }
  }

  // Filter accounts
  const filteredAccounts = React.useMemo(() => {
    if (!data?.accountsWithUsage) return [];
    return data.accountsWithUsage.filter((acc) => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        acc.gmail.toLowerCase().includes(q) ||
        acc.githubUsername.toLowerCase().includes(q) ||
        (acc.displayName && acc.displayName.toLowerCase().includes(q));

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "COMPLETED") {
        matchesStatus = acc.isFullyCompleted;
      } else if (statusFilter === "PENDING") {
        matchesStatus = !acc.isFullyCompleted;
      }

      return matchesSearch && matchesStatus;
    });
  }, [data?.accountsWithUsage, searchQuery, statusFilter]);

  const yearOptions = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="space-y-3">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-neutral-200">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Account Usage Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Excel-style monthly credit tracker for Gmail and GitHub account pairs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 border border-neutral-300 bg-white px-2.5 py-1 rounded-xs text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Select tracking year"
              className="bg-transparent text-xs font-mono font-medium text-neutral-900 focus:outline-none cursor-pointer"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="md"
            onClick={() => fetchDashboardData(selectedYear)}
            title="Refresh dashboard data"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {/* Add Account button */}
          <Button
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border border-red-200 bg-red-50 p-3 rounded-xs text-xs text-red-800"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Unable to load data: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {loading && !data && (
        <div className="py-20 flex flex-col items-center justify-center text-xs text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mb-2" />
          <span>Loading dashboard data for {selectedYear}...</span>
        </div>
      )}

      {data && (
        <>
          {/* Summary Strip: Top metrics overview */}
          <SummaryStrip metrics={data.metrics} selectedYear={selectedYear} />

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-neutral-300 bg-white p-2.5 rounded-xs shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by Gmail, GitHub, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 border border-neutral-200 p-0.5 rounded-xs bg-neutral-50 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-neutral-900 border border-neutral-300 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                All ({data.metrics.totalAccounts})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("COMPLETED")}
                className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "COMPLETED"
                    ? "bg-white text-neutral-900 border border-neutral-300 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Completed ({data.metrics.fullyCompletedAccounts})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PENDING")}
                className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "PENDING"
                    ? "bg-white text-neutral-900 border border-neutral-300 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Pending ({data.metrics.totalAccounts - data.metrics.fullyCompletedAccounts})
              </button>
            </div>
          </div>

          {/* Main Excel-style Spreadsheet View */}
          {filteredAccounts.length === 0 ? (
            <div className="border border-neutral-300 bg-white p-12 text-center rounded-xs space-y-3">
              <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-xs bg-neutral-100 text-neutral-400">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-900">
                  {searchQuery || statusFilter !== "ALL"
                    ? "No matching account groups found"
                    : "No account groups registered yet"}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your search query or filter selection."
                    : "Click 'Add Account' to register your first Gmail and GitHub account pair."}
                </p>
              </div>
              {searchQuery || statusFilter !== "ALL" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                  Add First Account
                </Button>
              )}
            </div>
          ) : (
            <UsageSpreadsheet
              accounts={filteredAccounts}
              year={selectedYear}
              onToggleMonth={handleToggleMonth}
              onEdit={(acc) => setEditingAccount(acc)}
              onDelete={(acc) => setDeletingAccount(acc)}
            />
          )}
        </>
      )}

      {/* Add / Edit Account Modal */}
      <AccountFormModal
        isOpen={isAddModalOpen || Boolean(editingAccount)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAccount(null);
        }}
        onSaved={() => fetchDashboardData(selectedYear)}
        initialAccount={editingAccount}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        isOpen={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        onDeleted={() => fetchDashboardData(selectedYear)}
        account={deletingAccount}
      />
    </div>
  );
}
