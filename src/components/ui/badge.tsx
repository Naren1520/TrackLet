import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "used" | "pending" | "neutral" | "danger";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    used: "bg-emerald-50 text-emerald-800 border-emerald-300",
    pending: "bg-neutral-100 text-neutral-600 border-neutral-200",
    neutral: "bg-neutral-50 text-neutral-700 border-neutral-300",
    danger: "bg-red-50 text-red-700 border-red-300",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 text-[10px] font-medium tracking-tight select-none",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
