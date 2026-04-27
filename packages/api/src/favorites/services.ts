import { getDishes } from "@api/dishes/services";
import { upsert } from "@api/utils";
import type { Drizzle, RestaurantId, SelectFavorite } from "@peterplate/db";
import { favorites } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

/**
 * Get all favorites for a given user ID.
 * Returns empty array if the user has no favorites.
 */
export async function getFavorites(db: Drizzle, userId: string) {
  const userFavorites = await db.query.favorites.findMany({
    where: (favorites, { eq }) => eq(favorites.userId, userId),
  });

  if (userFavorites.length === 0) return [];

  const dishes = await getDishes(
    userFavorites.map((favorite) => favorite.dishId),
    db,
  );
  const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));

  return userFavorites
    .map((favorite) => {
      const dish = dishesById.get(favorite.dishId);
      if (!dish) return null;

      return {
        ...favorite,
        dish,
      };
    })
    .filter((favorite) => favorite !== null);
}

/**
 * Add a favorite for a given dish ID, user ID, and restaurant.
 * If a favorite already exists, no change is made (idempotent).
 */
export async function addFavorite(
  db: Drizzle,
  userId: string,
  dishId: string,
  restaurant: RestaurantId,
): Promise<SelectFavorite> {
  // Check if dish exists
  const dish = await db.query.dishes.findFirst({
    where: (dishes, { eq }) => eq(dishes.id, dishId),
  });

  if (!dish) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "dish not found",
    });
  }

  // Upsert the favorite (idempotent - if exists, no change)
  const favorite = await upsert(
    db,
    favorites,
    {
      userId,
      dishId,
      restaurant,
    },
    {
      target: [favorites.userId, favorites.dishId],
      set: {
        userId,
        dishId,
      },
    },
  );

  return favorite;
}

/**
 * Delete a favorite for a given dish ID and user ID.
 * If the favorite does not exist, no change is made (idempotent).
 */
export async function deleteFavorite(
  db: Drizzle,
  userId: string,
  dishId: string,
): Promise<void> {
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.dishId, dishId)));
}
