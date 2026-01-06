import { daily } from "@zotmeal/api";
import { createDrizzle, pool, restaurantNames } from "@zotmeal/db";

import { logger } from "../../../logger";
import { env } from "../env";

const connectionString = env.DATABASE_URL;

export const main = async (_event, _context) => {
  try {
    logger.info("Start update daily job...");
    const db = createDrizzle({ connectionString });

    const results = await Promise.allSettled(
      restaurantNames.map((restaurant) => daily(db, new Date(), restaurant)),
    );

    // log errors if any
    results.forEach((result) => {
      if (result.status === "rejected")
        logger.error(result.reason, "daily() failed:");
    });
  } catch (error) {
    logger.error(error, "Failed to execute daily task");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info("Finished update daily job.");
  }
};
