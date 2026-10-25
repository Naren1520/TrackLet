import { AuthService } from "@/features/auth/auth.service";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
  await AuthService.logout();
  return apiSuccess({ message: "Logged out successfully" });
}
