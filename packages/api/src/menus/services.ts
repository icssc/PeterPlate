import { upsert, upsertBatch } from "@api/utils";
import type { DateList, Drizzle, InsertMenu } from "@peterplate/db";
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

  if (!rows.length) return null;

  return rows.map((r) => toLocalDate(r.date)).filter((d) => d !== null);
}

function toLocalDate(dateString: string | null): Date | null {
  if (!dateString) return null;

  const [y, m, d] = dateString.split("-").map(Number);

  if (!y || !m || !d) return null;

  // Create date at noon UTC to prevent timezone offsets from shifting it to the previous day
  // (e.g. Midnight UTC is 4pm/5pm previous day in PST)
  return new Date(Date.UTC(y, m - 1, d, 12));
}
