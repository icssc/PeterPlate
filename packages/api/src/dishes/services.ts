import type { Drizzle, InsertDish } from "@peterplate/db";
import { dishes } from "@peterplate/db";

export async function upsertDishesIfMissing(
  db: Drizzle,
  dishData: InsertDish[],
): Promise<InsertDish[]> {
  if (dishData.length === 0) return [];

  try {
    const results = db
      .insert(dishes)
      .values(dishData)
      .onConflictDoNothing()
      .returning();
    return results;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
