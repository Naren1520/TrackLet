"use client";

import * as React from "react";
import { AccountGroup } from "@/types/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { DeleteAccountModal } from "@/components/accounts/delete-account-modal";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  FolderOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function AccountsPage() {
  const [accounts, setAccounts] = React.useState<AccountGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<AccountGroup | null>(null);
  const [deletingAccount, setDeletingAccount] = React.useState<AccountGroup | null>(null);

  const fetchAccounts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/accounts");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to load accounts");
      } else {
        setAccounts(json.data);
      }
    } catch {
      setError("Unable to connect to server. Check database configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const filteredAccounts = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return accounts;
    return accounts.filter(
      (acc) =>
        acc.gmail.toLowerCase().includes(q) ||
        acc.githubUsername.toLowerCase().includes(q) ||
        (acc.displayName && acc.displayName.toLowerCase().includes(q))
    );
  }, [accounts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Account Groups
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your registered Gmail and GitHub account pairs
          </p>
        </div>

        <Button
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Account Group</span>
        </Button>
      </div>

      {/* Search and Count Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-neutral-300 bg-white p-2.5 rounded-xs shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by Gmail, GitHub, or display name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="text-xs text-neutral-500 font-mono self-end sm:self-auto">
          {filteredAccounts.length} of {accounts.length} account groups
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="border border-red-200 bg-red-50 p-3 rounded-xs text-xs text-red-800">
          <span className="font-semibold">Error: </span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-xs text-neutral-500">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400 mb-2" />
          <span>Loading account groups...</span>
        </div>
      ) : filteredAccounts.length === 0 ? (
        /* Empty state */
        <div className="border border-neutral-300 bg-white p-12 text-center rounded-xs space-y-3 shadow-sm">
          <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-xs bg-neutral-100 text-neutral-400">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-neutral-900">
              {searchQuery ? "No matching accounts found" : "No account groups configured"}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Add your first Gmail and GitHub account pair to begin tracking monthly usage."}
            </p>
          </div>
          {searchQuery ? (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              Add Account Group
            </Button>
          )}
        </div>
      ) : (
        /* Data Table */
        <div className="overflow-x-auto border border-neutral-300 bg-white rounded-xs shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-medium text-neutral-500 uppercase tracking-tight font-mono">
              <tr>
                <th className="py-2.5 px-3">Gmail Address</th>
                <th className="py-2.5 px-3">GitHub Username</th>
                <th className="py-2.5 px-3">Display Name</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredAccounts.map((account) => (
                <tr key={account._id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-neutral-900">
                    {account.gmail}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-700">
                    @{account.githubUsername}
                  </td>
                  <td className="py-3 px-3 text-neutral-700">
                    {account.displayName || (
                      <span className="text-neutral-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 max-w-xs truncate">
                    {account.notes || (
                      <span className="text-neutral-400 italic">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/?search=${encodeURIComponent(account.gmail)}`}
                        title="View monthly checklist"
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setEditingAccount(account)}
                        title="Edit account group"
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingAccount(account)}
                        title="Delete account group"
                        className="p-1.5 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Account Modal */}
      <AccountFormModal
        isOpen={isAddModalOpen || Boolean(editingAccount)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAccount(null);
        }}
        onSaved={fetchAccounts}
        initialAccount={editingAccount}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        isOpen={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        onDeleted={fetchAccounts}
        account={deletingAccount}
      />
    </div>
  );
}
