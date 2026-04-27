import { getDishes } from "@api/dishes/services";
import { upsert } from "@api/utils";
import type { Drizzle, InsertRating } from "@peterplate/db";
import { dishes, ratings } from "@peterplate/db";
import { and, avg, count, eq, sum } from "drizzle-orm";

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
    const allRatings = await db.query.ratings.findMany({
      where: (ratings, { eq }) => eq(ratings.userId, userId),
      orderBy: (ratings, { desc }) => [desc(ratings.updatedAt)],
    });

    if (allRatings.length === 0) return [];

    const dishes = await getDishes(
      allRatings.map((rating) => rating.dishId),
      db,
    );
    const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));

    return allRatings
      .map((rating) => {
        const dish = dishesById.get(rating.dishId);
        if (!dish) return null;

        // Ratings stay local, but dish content now comes from AAPI.
        return {
          ...dish,
          restaurant: rating.restaurant,
          rating: rating.rating,
          ratedAt: rating.updatedAt ?? rating.createdAt,
        };
      })
      .filter((dish) => dish !== null);
  } catch (error) {
    console.error("Error fetching rated dishes:", error);
    return [];
  }
};
