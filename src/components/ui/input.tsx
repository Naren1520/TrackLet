import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={twMerge(
          clsx(
            "flex h-8 w-full rounded-xs border border-neutral-300 bg-white px-2.5 py-1 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
          )
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
