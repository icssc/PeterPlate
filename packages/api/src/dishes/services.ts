import { upsert } from "@api/utils";

import type { Drizzle, InsertDish } from "@peterplate/db";
import { dishes } from "@peterplate/db";

export async function upsertDish(
  db: Drizzle,
  dishData: InsertDish,
): Promise<InsertDish> {
  try {
    const result = await db.transaction<Omit<InsertDish, "stationId">>(
      async (tx) => {
        const upsertedDish = await upsert(tx, dishes, dishData, {
          target: [dishes.id],
        });
        return upsertedDish;
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
