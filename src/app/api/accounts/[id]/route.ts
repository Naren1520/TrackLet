import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from "@/lib/api-response";
import { updateAccountSchema } from "@/features/accounts/account.validation";
import { AccountService } from "@/features/accounts/account.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const { id } = await params;
    const account = await AccountService.getAccount(id);
    if (!account) return apiNotFound("Account group not found");

    return apiSuccess(account);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error finding account";
    return apiError(message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const parseResult = updateAccountSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(errorMsg, 400);
    }

    const updated = await AccountService.updateAccount(id, parseResult.data);
    return apiSuccess(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update account";
    const isConflict = message.toLowerCase().includes("already exists");
    return apiError(message, isConflict ? 409 : 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getCurrentSession();
  if (!session) return apiUnauthorized();

  try {
    const { id } = await params;
    await AccountService.deleteAccount(id);
    return apiSuccess({ message: "Account group deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete account";
    return apiError(message, 500);
  }
}
