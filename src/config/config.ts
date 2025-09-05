import dotenv from "dotenv";
import { z } from "zod";
import { ApiError } from "../utils";

dotenv.config({
  path: "./.env",
});

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_KEY: z.string(),
  REFRESH_TOKEN_KEY: z.string(),
  ACCESS_TOKEN_KEY_EXPIRY: z.string(),
  REFRESH_TOKEN_KEY_EXPIRY: z.string(),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const validateResult = envSchema.safeParse(env);

  if (validateResult?.error) {
    throw new ApiError(
      400,
      `envSchema validation error ${validateResult.error}`,
    );
  }

  return validateResult?.data;
};

export const env = createEnv(process.env);
