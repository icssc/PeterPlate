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
): Promise<Array<string>> {
  //check if allergy already in table
  if (!allergies) {
    return null;
  }
  for (const allergy in allergies) {
    const existing_allergy = await db.query.userAllergies.findFirst({
      where: (ua, { eq }) =>
        and(eq(ua.userId, userId), eq(ua.allergy, allergy)),
    });

    if (existing_allergy) {
      return null;
    }

    const newAllergy: InsertAllergy = {
      userId,
      allergy,
    };

    await db.insert(userAllergies).values(newAllergy);
  }
  return allergies;
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
