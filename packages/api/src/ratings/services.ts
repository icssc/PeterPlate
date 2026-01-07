import { upsert } from "@api/utils";
import type { Drizzle, InsertRating } from "@zotmeal/db";
import { dishes, ratings } from "@zotmeal/db";
import { and, avg, count, desc, eq, sum } from "drizzle-orm";

const updateDishStats = async (db: Drizzle, dishId: string) => {
  const result = await db
    .select({
      totalRating: sum(ratings.rating),
      numRatings: count(ratings.rating),
    })
    .from(ratings)
    .where(eq(ratings.dishId, dishId));

  const stats = result[0] ?? { totalRating: 0, numRatings: 0 };
  const total = stats.totalRating ? Number(stats.totalRating) : 0;
  const num = stats.numRatings ?? 0;

  await db
    .update(dishes)
    .set({ totalRating: total, numRatings: num })
    .where(eq(dishes.id, dishId));
};

export const upsertRating = async (db: Drizzle, rating: InsertRating) => {
  const result = await upsert(db, ratings, rating, {
    target: [ratings.userId, ratings.dishId],
    set: rating,
  });
  await updateDishStats(db, rating.dishId);
  return result;
};

export const getAverageRating = async (db: Drizzle, dishId: string) => {
  const result = await db
    .select({
      averageRating: avg(ratings.rating),
      ratingCount: count(ratings.rating),
    })
    .from(ratings)
    .where(eq(ratings.dishId, dishId));

  return {
    averageRating: result[0]?.averageRating
      ? Number(result[0].averageRating)
      : 0,
    ratingCount: result[0]?.ratingCount ?? 0,
  };
};

export const getUserRating = async (
  db: Drizzle,
  userId: string,
  dishId: string,
) => {
  const result = await db
    .select({ rating: ratings.rating })
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.dishId, dishId)))
    .limit(1);

  return result[0]?.rating ?? null;
};

export const deleteRating = async (
  db: Drizzle,
  userId: string,
  dishId: string,
) => {
  const result = await db
    .delete(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.dishId, dishId)))
    .returning({ dishId: ratings.dishId }); // Returns [{ dishId: '...' }]

  if (result.length === 0) {
    console.warn(
      `No rating found to delete for dish ${dishId} by user ${userId}.`,
    );
  } else {
    console.log(`Rating for dish ${dishId} by user ${userId} deleted.`);
    await updateDishStats(db, dishId);
  }

  return { success: true, deletedDishId: dishId }; // Return a consistent object
};

export const getUserRatedDishes = async (db: Drizzle, userId: string) => {
  try {
    // Step 1: Get all ratings for this user
    const allRatings = await db.query.ratings.findMany({
      where: (ratings, { eq }) => eq(ratings.userId, userId),
      orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)],
    });

    // Step 2: For each rating, fetch the full dish info
    const enrichedResults = await Promise.all(
      allRatings.map(async (rating) => {
        const dish = await db.query.dishes.findFirst({
          where: (dishes, { eq }) => eq(dishes.id, rating.dishId),
          with: {
            nutritionInfo: true,
            dietRestriction: true,
            station: {
              with: {
                restaurant: true, // Fetch the restaurant from station
              },
            },
          },
        });

        if (!dish) {
          console.warn(`Dish not found for rating: ${rating.dishId}`);
          return null;
        }

        // Add the restaurant field to match DishInfo type
        return {
          ...dish,
          restaurant: dish.station?.restaurant?.name || "Unknown Restaurant",
          rating: rating.rating,
          ratedAt: rating.updatedAt,
        };
      }),
    );

    const result = enrichedResults.filter((item) => item !== null);
    return result;
  } catch (error) {
    console.error("Error fetching rated dishes:", error);
    return [];
  }
};
