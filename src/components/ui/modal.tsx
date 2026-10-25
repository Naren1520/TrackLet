"use client";

import * as React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: Solid dark neutral overlay with opacity */}
      <div
        className="fixed inset-0 bg-neutral-900/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box: Clean, square/subtly-rounded with clear thin border */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md border border-neutral-300 bg-white p-5 shadow-lg rounded-xs"
      >
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
          <div>
            <h2 id="modal-title" className="text-sm font-semibold text-neutral-900 tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-xs text-neutral-500 leading-normal">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer p-0.5 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
