import { z } from "zod";

const envSchema = z.object({
  APP_USERNAME: z.string().min(1, "APP_USERNAME is required"),
  APP_PASSWORD_HASH: z.string().min(1, "APP_PASSWORD_HASH is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("tracklet"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function cleanEnv(val: string | undefined): string | undefined {
  if (!val) return val;
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

function cleanHash(val: string | undefined): string | undefined {
  const cleaned = cleanEnv(val);
  if (!cleaned) return cleaned;
  // Remove backslashes used to escape $ in .env files (e.g., \$2a\$10 -> $2a$10)
  return cleaned.replace(/\\/g, "");
}

export function getEnv(): Env {
  const result = envSchema.safeParse({
    APP_USERNAME: cleanEnv(process.env.APP_USERNAME),
    APP_PASSWORD_HASH: cleanHash(process.env.APP_PASSWORD_HASH),
    SESSION_SECRET: cleanEnv(process.env.SESSION_SECRET),
    MONGODB_URI: cleanEnv(process.env.MONGODB_URI),
    MONGODB_DB_NAME: cleanEnv(process.env.MONGODB_DB_NAME),
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`[TrackLet] Invalid Environment Configuration: ${errorDetails}`);
  }

  return result.data;
}
