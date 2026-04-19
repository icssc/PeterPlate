import { upsert, upsertBatch } from "@api/utils";
import type { Drizzle, InsertPreference } from "@peterplate/db";
import { userDietaryPreferences } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

/**
 * Get all user dietary preferences for a given user ID.
 * Returns empty array if the user has no listed preferences.
 */
export async function getDietaryPreferences(db: Drizzle, userId: string) {
  const preferences = await db.query.userDietaryPreferences.findMany({
    where: (ud, { eq }) => eq(ud.userId, userId),
  });
  // Return each preference string
  return preferences.map((p) => p.preference);
}

export async function addDietaryPreferences(
  db: Drizzle,
  userId: string,
  preferences: Array<string>,
): Promise<void> {
  try {
    const upsertPromises = preferences.map((pref) =>
      upsert(
        db,
        userDietaryPreferences,
        { userId, preference: pref },
        {
          target: [
            userDietaryPreferences.userId,
            userDietaryPreferences.preference,
          ],
          set: { preference: pref },
        },
      ),
    );

    const results = await Promise.all(upsertPromises);
    console.log(`Successfully synced ${results.length} preferences.`);
  } catch (error) {
    console.error("Failed to save dietary preferences.");
  }
}

export async function deletePreference(
  db: Drizzle,
  userId: string,
  preference: string,
): Promise<void> {
  await db
    .delete(userDietaryPreferences)
    .where(
      and(
        eq(userDietaryPreferences.userId, userId),
        eq(userDietaryPreferences.preference, preference),
      ),
    );
}
