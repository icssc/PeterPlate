import { upsert } from "@api/utils";
import type { Drizzle, InsertAllergy, SelectAllergy } from "@peterplate/db";
import { userDietaryPreferences, users } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import type { InsertPreference } from "@zotmeal/db/src/schema/userDietaryPreferences";
import { and, eq } from "drizzle-orm";

/**
 * Get all user dietary preferences for a given user ID.
 * Returns empty array if the user has no listed preferences.
 */
export async function getDietaryPreferences(db: Drizzle, userId: string) {
  const preferences = await db.query.userDietaryPreferences.findMany({
    where: (ud, { eq }) => eq(ud.userId, userId),
  });
  //Return each allergy string
  return preferences.map((p) => p.preference);
}

export async function addDietaryPreferences(
  db: Drizzle,
  userId: string,
  preferences: Array<string>,
): Promise<Array<string>> {
  if (!preferences) {
    return null;
  }

  for (const preference in preferences) {
    const already_existing_preference =
      await db.query.userDietaryPreferences.findFirst({
        where: (ud, { eq }) =>
          and(eq(ud.userId, userId), eq(ud.preference, preference)),
      });
    if (already_existing_preference) {
      continue;
    }
    const newPreference: InsertPreference = {
      userId,
      preference,
    };
    await db.insert(userDietaryPreferences).values(newPreference);
  }
  return preferences;

  //check if allergy already in table
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
