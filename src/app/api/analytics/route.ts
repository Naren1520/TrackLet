import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api-response";
import { AnalyticsService } from "@/features/analytics/analytics.service";
import { z } from "zod";

const querySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).default(new Date().getFullYear()),
});

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      year: url.searchParams.get("year") || new Date().getFullYear(),
    });

    if (!parsed.success) {
      return apiError("Invalid year parameter", 400);
    }

    const data = await AnalyticsService.getDashboardData(parsed.data.year);
    return apiSuccess(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load analytics";
    return apiError(message, 500);
  }
}
