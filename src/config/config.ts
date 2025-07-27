import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: "./.env",
});

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
});

const createEnv = (env: NodeJS.ProcessEnv) => {

    const validateResult = envSchema.safeParse(envSchema)

    if(validateResult?.error){  

    }

    return validateResult?.data

};

export const env = createEnv(process.env);
