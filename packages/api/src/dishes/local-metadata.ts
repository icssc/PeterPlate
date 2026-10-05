import { upsert } from "@api/utils";
import type { Drizzle } from "@peterplate/db";
import { dishes } from "@peterplate/db";

export async function ensureDishMetadataRow(db: Drizzle, dishId: string) {
  await upsert(
    db,
    dishes,
    { id: dishId },
    {
      target: [dishes.id],
      set: { id: dishId },
    },
  );
}
