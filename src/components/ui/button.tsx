import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-xs border text-xs tracking-tight";

    const variantClasses = {
      primary: "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800",
      secondary: "bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200",
      destructive: "bg-red-700 text-white border-red-800 hover:bg-red-800",
      outline: "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900",
      ghost: "bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100 hover:text-neutral-900",
    };

    const sizeClasses = {
      sm: "h-7 px-2.5 text-[11px]",
      md: "h-8 px-3 text-xs",
      lg: "h-9 px-4 text-xs",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(clsx(baseClasses, variantClasses[variant], sizeClasses[size], className))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
