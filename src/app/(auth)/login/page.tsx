"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("Naren");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Check your credentials.");
        setLoading(false);
        return;
      }

      // Success: redirect to dashboard
      router.push("/");
      router.refresh();
    } catch {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#fbfbfb]">
      <div className="w-full max-w-sm">
        {/* Header / Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-neutral-800 bg-neutral-900 text-white font-bold text-base mb-3 shadow-xs">
            TL
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            TrackLet
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Sign in to access your personal account tracker
          </p>
          <div className="mt-1 text-[11px] font-medium text-neutral-400">
            Developed by Naren &bull; Personal Use
          </div>
        </div>

        {/* Form Container */}
        <div className="border border-neutral-300 bg-white p-6 rounded-xs shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label
                htmlFor="username"
                className="block text-xs font-medium text-neutral-700 mb-1"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-neutral-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={loading}
                  className="pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              Secure single-user session
            </span>
            <span className="font-mono text-neutral-400">v1.0</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-4 text-center text-[11px] text-neutral-400">
          Personal account tracker for Gmail and GitHub usage
        </p>
      </div>
    </div>
  );
}
