import { z } from "zod";

export const toggleUsageSchema = z.object({
  accountId: z.string().trim().min(1, "Account ID is required"),
  year: z.number().int().min(2000, "Year must be 2000 or later").max(2100, "Year must be 2100 or earlier"),
  month: z.number().int().min(1, "Month must be between 1 and 12").max(12, "Month must be between 1 and 12"),
  channel: z.enum(["gmail", "github"]).default("gmail"),
  used: z.boolean(),
});

export const getUsageQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).default(new Date().getFullYear()),
  accountId: z.string().optional(),
});

export type ToggleUsageInput = z.infer<typeof toggleUsageSchema>;
export type GetUsageQuery = z.infer<typeof getUsageQuerySchema>;
