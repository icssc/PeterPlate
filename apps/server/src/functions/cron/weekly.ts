import { logger } from "logger";

import { weekly } from "@zotmeal/api";
import { createDrizzle, pool } from "@zotmeal/db";

import { env } from "../env";

const connectionString = env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    logger.info(`Starting weekly job...`);
    const db = createDrizzle({ connectionString });
    await weekly(db);
  } catch (error) {
    logger.error(error, "Failed to execute weekly task.");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info(`Finished get weekly job.`);
  }
};
