import { upsert } from "@api/utils";
import type { Drizzle, InsertAllergy, SelectAllergy } from "@peterplate/db";
import { userAllergies, users } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

/**
 * Get all user allergies for a given user ID.
 * Returns empty array if the user has no listed allergies.
 */
export async function getAllergies(db: Drizzle, userId: string) {
  const allergies = await db.query.userAllergies.findMany({
    where: (ua, { eq }) => eq(ua.userId, userId),
  });
  //Return each allergy string
  return allergies.map((a) => a.allergy);
}

export async function addAllergies(
  db: Drizzle,
  userId: string,
  allergies: Array<string>,
): Promise<void> {
  try {
    const upsertPromises = allergies.map((a) =>
      upsert(
        db,
        userAllergies,
        { userId, allergy: a },
        {
          target: [userAllergies.userId, userAllergies.allergy],
          set: { allergy: a },
        },
      ),
    );

    const results = await Promise.all(upsertPromises);
    console.log(`Successfully synced ${results.length} preferences.`);
  } catch (error) {
    console.error("Failed to save dietary preferences.");
  }
}

export async function deleteAllergy(
  db: Drizzle,
  userId: string,
  allergy: string,
): Promise<void> {
  await db
    .delete(userAllergies)
    .where(
      and(eq(userAllergies.userId, userId), eq(userAllergies.allergy, allergy)),
    );
}
