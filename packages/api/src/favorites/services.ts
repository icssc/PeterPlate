import { upsert } from "@api/utils";
import type { Drizzle, InsertFavorite, SelectFavorite } from "@peterplate/db";
import { dishes, favorites, users } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

/**
 * Get all favorites for a given user ID.
 * Returns empty array if the user has no favorites.
 */
export async function getFavorites(db: Drizzle, userId: string) {
  const userFavorites = await db.query.favorites.findMany({
    where: (favorites, { eq }) => eq(favorites.userId, userId),
    with: {
      dish: {
        with: {
          dietRestriction: true,
          nutritionInfo: true,
          station: {
            with: {
              restaurant: true,
            },
          },
        },
      },
    },
  });

  // Transform the data to include restaurant name on each dish, matching the format
  // used in the normal menu view (RestaurantInfo)
  return userFavorites.map((favorite) => {
    const { station, ...dishWithoutStation } = favorite.dish;
    const restaurantName = station?.restaurant?.name;
    if (!restaurantName) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Restaurant not found for dish ${favorite.dish.id}`,
      });
    }
    return {
      ...favorite,
      dish: {
        ...dishWithoutStation,
        restaurant: restaurantName,
      },
    };
  });
}

/**
 * Add a favorite for a given dish ID and user ID.
 * If a favorite already exists, no change is made (idempotent).
 */
export async function addFavorite(
  db: Drizzle,
  userId: string,
  dishId: string,
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
