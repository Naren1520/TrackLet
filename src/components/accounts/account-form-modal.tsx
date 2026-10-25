"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountGroup } from "@/types/account";
import { AlertCircle, Loader2 } from "lucide-react";

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialAccount?: AccountGroup | null;
}

export function AccountFormModal({
  isOpen,
  onClose,
  onSaved,
  initialAccount,
}: AccountFormModalProps) {
  const isEditing = Boolean(initialAccount);
  const [gmail, setGmail] = React.useState("");
  const [githubUsername, setGithubUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialAccount) {
      setGmail(initialAccount.gmail);
      setGithubUsername(initialAccount.githubUsername);
      setDisplayName(initialAccount.displayName || "");
      setNotes(initialAccount.notes || "");
    } else {
      setGmail("");
      setGithubUsername("");
      setDisplayName("");
      setNotes("");
    }
    setError(null);
  }, [initialAccount, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!gmail.trim()) {
      setError("Please provide a Gmail address.");
      return;
    }
    if (!githubUsername.trim()) {
      setError("Please provide a GitHub username.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        gmail: gmail.trim(),
        githubUsername: githubUsername.trim(),
        displayName: displayName.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const url = isEditing && initialAccount
        ? `/api/accounts/${initialAccount._id}`
        : "/api/accounts";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save account group.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onSaved();
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
      title={isEditing ? "Edit Account Group" : "Add Account Group"}
      description={
        isEditing
          ? "Update Gmail address, GitHub username, or account metadata."
          : "Register a new Gmail and GitHub account pair for tracking."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 border border-red-200 bg-red-50 p-2.5 rounded-xs text-xs text-red-800"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="modal-gmail" className="block text-xs font-medium text-neutral-700 mb-1">
            Gmail Address <span className="text-red-600">*</span>
          </label>
          <Input
            id="modal-gmail"
            name="gmail"
            type="email"
            required
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            placeholder="developer@gmail.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="modal-github" className="block text-xs font-medium text-neutral-700 mb-1">
            GitHub Username <span className="text-red-600">*</span>
          </label>
          <Input
            id="modal-github"
            name="githubUsername"
            type="text"
            required
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="octocat"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="modal-display" className="block text-xs font-medium text-neutral-700 mb-1">
            Display Name <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <Input
            id="modal-display"
            name="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Primary Dev Account"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="modal-notes" className="block text-xs font-medium text-neutral-700 mb-1">
            Notes <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="modal-notes"
            name="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional context or purpose for this account pair..."
            disabled={loading}
            className="flex w-full rounded-xs border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 transition-colors resize-none"
          />
        </div>

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
            type="submit"
            size="md"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Account Group"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
