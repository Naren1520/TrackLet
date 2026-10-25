import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export const createAccountSchema = z.object({
  gmail: z
    .string()
    .trim()
    .min(1, "Gmail address is required")
    .regex(emailRegex, "Please enter a valid email address"),
  githubUsername: z
    .string()
    .trim()
    .min(1, "GitHub username is required")
    .max(39, "GitHub username cannot exceed 39 characters")
    .regex(
      githubUsernameRegex,
      "GitHub username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    ),
  displayName: z.string().trim().max(100, "Display name cannot exceed 100 characters").optional(),
  notes: z.string().trim().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export const updateAccountSchema = z.object({
  gmail: z
    .string()
    .trim()
    .min(1, "Gmail address is required")
    .regex(emailRegex, "Please enter a valid email address")
    .optional(),
  githubUsername: z
    .string()
    .trim()
    .min(1, "GitHub username is required")
    .max(39, "GitHub username cannot exceed 39 characters")
    .regex(
      githubUsernameRegex,
      "GitHub username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    )
    .optional(),
  displayName: z.string().trim().max(100, "Display name cannot exceed 100 characters").optional(),
  notes: z.string().trim().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
