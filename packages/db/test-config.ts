import { defineConfig } from "drizzle-kit";

if (!process.env.TEST_URL) throw new Error("TEST_URL is not set");

export default defineConfig({
  dialect: "postgresql",
  schema: "../db/src/schema",
  dbCredentials: { url: process.env.TEST_URL },
});
