"use client";

import { useCallback, useMemo } from "react";

import { DEFAULT_USER_ID } from "@/config/user";
import { trpc } from "@/utils/trpc";

/**
 * A custom React hook that manages a user's favorited dishes through the tRPC API.
 *
 * It retrieves the user's favorites, exposes derived values such as a list of
 * favorite dish IDs, and provides helper functions to add or remove favorites.
 * Cached favorites are automatically invalidated after mutations to ensure the
 * UI reflects the most recent data. The hook also exposes per-dish mutation
 * state so components can render loading indicators for individual items.
 *
 * @param {string} [userId=DEFAULT_USER_ID] - The ID of the user whose favorites
 *                                            should be retrieved. Defaults to
 *                                            the configured `DEFAULT_USER_ID`.
 *
 * @returns {{
 *   favorites: Array<unknown>,
 *   favoriteIds: string[],
 *   isLoadingFavorites: boolean,
 *   toggleFavorite: (dishId: string, currentlyFavorite: boolean) => void,
 *   isFavoritePending: (dishId: string) => boolean,
 *   favoritesError: unknown
 * }} The user's favorites, derived ID list, loading and error state, and
 *     helper functions for updating and checking favorite status.
 */

export function useFavorites(userId: string = DEFAULT_USER_ID) {
  const utils = trpc.useUtils();

  // Retrieves all favorites for the specified user. Data is cached and treated
  // as fresh for 5 minutes to minimize redundant network calls.
  const favoritesQuery = trpc.favorite.getFavorites.useQuery(
    { userId },
    {
      enabled: Boolean(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Invalidates the favorites query so the UI stays in sync after a mutation.
  const invalidateFavorites = useCallback(
    () =>
      utils.favorite.getFavorites.invalidate({
        userId,
      }),
    [userId, utils.favorite.getFavorites],
  );
  const addFavoriteMutation = trpc.favorite.addFavorite.useMutation({
    onSuccess: invalidateFavorites,
  });
  const deleteFavoriteMutation = trpc.favorite.deleteFavorite.useMutation({
    onSuccess: invalidateFavorites,
  });

  // Get the raw data
  type FavoriteEntry = NonNullable<typeof favoritesQuery.data>[number];
  const favorites: FavoriteEntry[] = favoritesQuery.data ?? [];

  // Memoized list of favorited unique dish IDs.
  const favoriteIds = useMemo(
    () => favorites.map((f) => f.dishId),
    [favorites],
  );

  // Determines whether a dish should be added or removed, then triggers the
  // appropriate mutation.
  const toggleFavorite = useCallback(
    (dishId: string, currentlyFavorite: boolean) => {
      if (currentlyFavorite) {
        deleteFavoriteMutation.mutate({
          userId,
          dishId,
        });
      } else {
        addFavoriteMutation.mutate({
          userId,
          dishId,
        });
      }
    },
    [addFavoriteMutation, deleteFavoriteMutation, userId],
  );

  // Tracks the dish IDs associated with currently running add/remove mutations.
  const addMutationDishId = addFavoriteMutation.variables?.dishId;
  const deleteMutationDishId = deleteFavoriteMutation.variables?.dishId;

  // Indicates whether a specific dish is currently undergoing a favorite or
  // unfavorite mutation, enabling per-item loading indicators in the UI.
  const isFavoritePending = useCallback(
    (dishId: string) =>
      (addFavoriteMutation.isPending && addMutationDishId === dishId) ||
      (deleteFavoriteMutation.isPending && deleteMutationDishId === dishId),
    [
      addFavoriteMutation.isPending,
      addMutationDishId,
      deleteFavoriteMutation.isPending,
      deleteMutationDishId,
    ],
  );

  return {
    favorites,
    favoriteIds,
    isLoadingFavorites: favoritesQuery.isLoading,
    toggleFavorite,
    isFavoritePending,
    favoritesError: favoritesQuery.error,
  };
}
