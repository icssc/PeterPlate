import { test } from "vitest";

import type { Drizzle } from "@peterplate/db";
import { createDrizzle } from "@peterplate/db";

import { createCaller, createTRPCContext } from ".";
import { testData } from "./testData";

const connectionString = process.env.TEST_URL;

if (!connectionString)
  throw new Error(
    "Missing env var TEST_URL which should have been set during global setup. Check globalSetup.ts",
  );

interface ApiFixtures {
  db: Drizzle;
  ctx: ReturnType<typeof createTRPCContext>;
  api: ReturnType<typeof createCaller>;
  testData: typeof testData;
}

/**
 * {@linkcode apiTest} contains fixtures for testing the service and api layers.
 * Enable db logger to see queries.
 */
export const apiTest = test.extend<ApiFixtures>({
  db: createDrizzle({ connectionString }, !process.env.CI),
  ctx: createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "vitest",
    }),
    connectionString,
  }),
  api: ({ ctx }, use) => use(createCaller(ctx)),
  testData,
});
