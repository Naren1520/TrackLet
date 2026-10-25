"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users, BarChart3, Menu, X, User } from "lucide-react";
import clsx from "clsx";

interface HeaderProps {
  username?: string;
}

export function Header({ username = "Naren" }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Accounts", href: "/accounts", icon: Users },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-300 bg-white shadow-xs font-sans">
      <div className="w-full flex h-16 items-center justify-between px-2 sm:px-3">
        {/* Brand & Circle Logo */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Circle Logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-sm tracking-tight border-2 border-neutral-700 shadow-xs transition-transform group-hover:scale-105">
              TL
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-neutral-900 group-hover:text-black">
                  TrackLet
                </span>
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                  Personal
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline-block leading-tight">
                Account &amp; Credit Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold rounded-xs transition-colors",
                    isActive
                      ? "bg-neutral-100 text-neutral-900 border border-neutral-300 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4 text-neutral-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3.5">
          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-xs border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span>User:</span>
            <span className="font-bold text-neutral-900">{username}</span>
          </div>

          <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            className="flex items-center gap-1.5 rounded-xs border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Leaving..." : "Log out"}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xs",
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
