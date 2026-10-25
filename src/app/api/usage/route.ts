import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api-response";
import { toggleUsageSchema, getUsageQuerySchema } from "@/features/usage/usage.validation";
import { UsageService } from "@/features/usage/usage.service";
import { AccountService } from "@/features/accounts/account.service";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const url = new URL(req.url);
    const parseResult = getUsageQuerySchema.safeParse({
      year: url.searchParams.get("year") || new Date().getFullYear(),
      accountId: url.searchParams.get("accountId") || undefined,
    });

    if (!parseResult.success) {
      return apiError("Invalid query parameters", 400);
    }

    const { year, accountId } = parseResult.data;

    if (accountId) {
      const records = await UsageService.getUsageByAccountAndYear(accountId, year);
      return apiSuccess(records);
    }

    const records = await UsageService.getUsageByYear(year);
    return apiSuccess(records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve usage data";
    return apiError(message, 500);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const body = await req.json();
    const parseResult = toggleUsageSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Invalid input";
      return apiError(errorMsg, 400);
    }

    const { accountId, year, month, channel, used } = parseResult.data;

    // Verify account exists
    const account = await AccountService.getAccount(accountId);
    if (!account) {
      return apiError("Referenced account does not exist", 404);
    }

    const updated = await UsageService.toggleUsage(accountId, year, month, channel, used);
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update monthly usage";
    return apiError(message, 500);
  }
}
