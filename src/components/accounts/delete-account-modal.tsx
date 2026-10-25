"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AccountGroup } from "@/types/account";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  account: AccountGroup | null;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onDeleted,
  account,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [isOpen]);

  if (!account) return null;

  async function handleDelete() {
    if (!account) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/accounts/${account._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete account group.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onDeleted();
      onClose();
    } catch {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account Group"
      description="This action cannot be undone. All associated monthly usage history will be permanently deleted."
    >
      <div className="space-y-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 border border-red-200 bg-red-50 p-2.5 rounded-xs text-xs text-red-800"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <div className="border border-neutral-200 bg-neutral-50 p-3 rounded-xs text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">Gmail:</span>
            <span className="font-medium text-neutral-900 font-mono">{account.gmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">GitHub:</span>
            <span className="font-medium text-neutral-900 font-mono">@{account.githubUsername}</span>
          </div>
          {account.displayName && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Display Name:</span>
              <span className="text-neutral-900">{account.displayName}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-600 leading-normal">
          Are you sure you want to permanently delete this account group and its monthly records?
        </p>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Deletion"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
