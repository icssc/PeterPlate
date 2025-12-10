import { upsert, upsertBatch } from "@api/utils";
import type { Drizzle, InsertMenu } from "@peterplate/db";
import { menus } from "@peterplate/db";
import { sql } from "drizzle-orm";

export const upsertMenu = async (db: Drizzle, menu: InsertMenu) =>
  await upsert(db, menus, menu, {
    target: menus.id,
    set: menu,
  });

export const upsertMenuBatch = async (db: Drizzle, menuBatch: InsertMenu[]) =>
  await upsertBatch(db, menus, menuBatch, {
    target: menus.id,
    set: {
      periodId: sql`excluded.period_id`,
      date: sql`excluded.date`,
      price: sql`excluded.price`,
    },
  });

/* 
 * Returns an object with the earliest
 * and latest dates present in the menus table.
*/
export async function getPickableDates(db: Drizzle): Promise<DateList> {
  const rows = await db
    .selectDistinct({ date: menus.date })
    .from(menus)
    .orderBy(menus.date);
  
  if (!rows.length)
    return null;
  
  return rows
    .map((r) => toLocalDate(r.date))
    .filter((d) => d !== null);
}

function toLocalDate(dateString: string | null): Date | null {
  if (!dateString)
    return null

  const [y, m, d] = dateString.split("-").map(Number);

  if (!y || !m || !d)
    return null
  
  return new Date(y, m-1, d);
}
