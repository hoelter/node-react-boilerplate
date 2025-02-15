import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().optional(),
  DATABASE_URL: z.string().min(1),
  COOKIE_SECRET: z.string().min(16),
  NODE_ENV: z.string().min(1),
});

function parseEnv(env: any) {
  return envSchema.parse(env);
}

export const envVars = parseEnv(process.env);

export const isProduction = envVars.NODE_ENV === "production";
