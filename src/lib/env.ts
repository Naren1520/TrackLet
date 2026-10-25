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

export function getEnv(): Env {
  const result = envSchema.safeParse({
    APP_USERNAME: process.env.APP_USERNAME,
    APP_PASSWORD_HASH: process.env.APP_PASSWORD_HASH,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
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
