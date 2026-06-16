import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET doit faire au moins 32 caractères"),
  APP_URL: z.string().url(),
  SESSION_MAX_AGE: z.coerce.number().int().positive().default(28800),
  SESSION_INACTIVITY_TIMEOUT: z.coerce.number().int().positive().default(1800),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    throw new Error(`Configuration invalide: ${message}`);
  }
  return parsed.data;
}

export const env = loadEnv();
