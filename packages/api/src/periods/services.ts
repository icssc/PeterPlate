import { upsert } from "@api/utils";

import type { Drizzle, InsertPeriod } from "@peterplate/db";
import { periods } from "@peterplate/db";

export const upsertPeriod = async (db: Drizzle, period: InsertPeriod) =>
  await upsert(db, periods, period, {
    target: [periods.id, periods.date, periods.restaurantId],
    set: period,
  });
