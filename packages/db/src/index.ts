import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


import * as schema from "./schema";
export const pool = (config: PoolConfig): Pool => new Pool(config);

/**
 * Create a drizzle instance with a connection string (add ssl or enable logs if needed)
 *
 * @example
 * const db = createDrizzle({ connectionString });
 *
 * Caller must do `pool.end()` when finished with db.
 *
 * TODO: change logs destination. @see https://orm.drizzle.team/docs/goodies#logging
 *
 */
export const createDrizzle = (config: PoolConfig, logger?: boolean) =>
  drizzle(pool({ ...config }), { schema, logger });

export type Drizzle = ReturnType<typeof createDrizzle>;
export * from "./schema";

export const db = createDrizzle({
  connectionString: process.env.DATABASE_URL,
});