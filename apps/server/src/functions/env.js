import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "development") {
  dotenv.config({
    path: resolve(__dirname, "../../../../.env"),
  });
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
});
const env = envSchema.parse(process.env);

export { env };
