import bcrypt from "bcryptjs";
import { getEnv } from "@/lib/env";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/session";
import { LoginInput } from "./auth.validation";

// Basic sliding-window in-memory rate limiter for login attempts
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function resetRateLimit(key: string): void {
  loginAttempts.delete(key);
}

export class AuthService {
  static async authenticate(input: LoginInput, clientIp: string): Promise<{ success: boolean; error?: string; retryAfter?: number }> {
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        retryAfter: rateLimit.retryAfterSeconds,
      };
    }

    const env = getEnv();

    const isUsernameMatch = input.username.trim().toLowerCase() === env.APP_USERNAME.trim().toLowerCase();
    if (!isUsernameMatch) {
      return { success: false, error: "Invalid username or password" };
    }

    const isPasswordMatch = await bcrypt.compare(input.password, env.APP_PASSWORD_HASH);
    if (!isPasswordMatch) {
      return { success: false, error: "Invalid username or password" };
    }

    // Login succeeded; reset rate limit for this IP
    resetRateLimit(clientIp);

    const token = await createSessionToken(env.APP_USERNAME);
    await setSessionCookie(token);

    return { success: true };
  }

  static async logout(): Promise<void> {
    await clearSessionCookie();
  }
}
