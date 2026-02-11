import { exec } from "node:child_process";
import { promisify } from "node:util";
import { pool } from "@peterplate/db";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Wait } from "testcontainers";

import { logger } from "./logger";

let teardownHappened = false;

/** Push schema to test container. */
async function pushSchema(connectionString: string) {
  logger.info(`Pushing schema to test container (${process.env.TEST_URL})...`);
  await promisify(exec)(`pnpm drizzle-kit push --config=../db/test-config.ts`, {
    env: {
      ...process.env,
      TEST_URL: connectionString,
    },
  });
  logger.info("Schema pushed to test container.");
}

// Set up postgres container
export default async function () {
  const container = await new PostgreSqlContainer()
    .withWaitStrategy(
      Wait.forLogMessage("database system is ready to accept connections"),
    )
    .start();

  process.env.TEST_URL = container.getConnectionUri();

  logger.info(`postgres container started. TEST_URL: ${process.env.TEST_URL}`);

  await pushSchema(process.env.TEST_URL);

  // teardown
  return async () => {
    if (teardownHappened) throw new Error("teardown called twice");

    teardownHappened = true;
    await pool({ connectionString: process.env.TEST_URL }).end();
    await container.stop();
  };
}
