import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/api-response";
import { createAccountSchema } from "@/features/accounts/account.validation";
import { AccountService } from "@/features/accounts/account.service";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const accounts = await AccountService.listAccounts();
    return apiSuccess(accounts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve accounts";
    return apiError(message, 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return apiUnauthorized();
  }

  try {
    const body = await req.json();
    const parseResult = createAccountSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(errorMsg, 400);
    }

    const created = await AccountService.createAccount(parseResult.data);
    return apiSuccess(created, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    // Check duplicate or other business error
    const isConflict = message.toLowerCase().includes("already exists");
    return apiError(message, isConflict ? 409 : 500);
  }
}
