import { NextRequest } from "next/server";
import { loginSchema } from "@/features/auth/auth.validation";
import { AuthService } from "@/features/auth/auth.service";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Invalid input";
      return apiError(errorMsg, 400);
    }

    // Extract client IP for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const authResult = await AuthService.authenticate(parseResult.data, clientIp);

    if (!authResult.success) {
      const status = authResult.retryAfter ? 429 : 401;
      return apiError(authResult.error || "Authentication failed", status);
    }

    return apiSuccess({ message: "Authenticated successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal authentication error";
    return apiError(message, 500);
  }
}
