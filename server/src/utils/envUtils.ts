import "dotenv/config";
import * as v from "valibot";

const envSchema = v.object({
  PORT: v.optional(v.pipe(v.unknown(), v.transform(Number))),
  DATABASE_URL: v.pipe(v.string(), v.minLength(1)),
  COOKIE_SECRET: v.pipe(v.string(), v.minLength(16)),
  NODE_ENV: v.pipe(v.string(), v.minLength(1)),
});

function parseEnv(env: unknown) {
  return v.parse(envSchema, env);
}

export const envVars = parseEnv(process.env);

export const isProduction = envVars.NODE_ENV === "production";
