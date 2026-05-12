"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_USER_ID } from "@/config/user";
import { trpc } from "@/utils/trpc";

/**
 * A custom React hook that manages a user's favorited dishes through the tRPC API.
 *
 * It retrieves the user's favorites and exposes optimistic helpers so the UI
 * reacts instantly when a dish is favorited or unfavorited. Internally we
 * track pending adds/deletes in local state and merge them with the cached
 * server data, then reconcile once the mutation settles.
 */

export function useFavorites(userId: string = DEFAULT_USER_ID) {
  const utils = trpc.useUtils();

  const favoritesQuery = trpc.favorite.getFavorites.useQuery(
    { userId },
    {
      enabled: Boolean(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  type FavoriteEntry = NonNullable<typeof favoritesQuery.data>[number];
  const serverFavorites: FavoriteEntry[] = favoritesQuery.data ?? [];

  // Optimistic state for in-flight toggles. Sets are keyed by dishId.
  const [optimisticAdds, setOptimisticAdds] = useState<Set<string>>(new Set());
  const [optimisticDeletes, setOptimisticDeletes] = useState<Set<string>>(
    new Set(),
  );

  const removeFromSet = (dishId: string) => (prev: Set<string>) => {
    if (!prev.has(dishId)) return prev;
    const next = new Set(prev);
    next.delete(dishId);
    return next;
  };

  const addToSet = (dishId: string) => (prev: Set<string>) => {
    if (prev.has(dishId)) return prev;
    const next = new Set(prev);
    next.add(dishId);
    return next;
  };

  const invalidateFavorites = useCallback(
    () =>
      utils.favorite.getFavorites.invalidate({
        userId,
      }),
    [userId, utils.favorite.getFavorites],
  );

  const addFavoriteMutation = trpc.favorite.addFavorite.useMutation({
    onMutate: ({ dishId }) => {
      setOptimisticDeletes(removeFromSet(dishId));
      setOptimisticAdds(addToSet(dishId));
    },
    onError: (_err, { dishId }) => {
      setOptimisticAdds(removeFromSet(dishId));
    },
    onSettled: async (_data, _err, { dishId }) => {
      await invalidateFavorites();
      setOptimisticAdds(removeFromSet(dishId));
    },
  });

  const deleteFavoriteMutation = trpc.favorite.deleteFavorite.useMutation({
    onMutate: ({ dishId }) => {
      setOptimisticAdds(removeFromSet(dishId));
      setOptimisticDeletes(addToSet(dishId));
    },
    onError: (_err, { dishId }) => {
      setOptimisticDeletes(removeFromSet(dishId));
    },
    onSettled: async (_data, _err, { dishId }) => {
      await invalidateFavorites();
      setOptimisticDeletes(removeFromSet(dishId));
    },
  });

  // Server data filtered by optimistic deletes so consumers that render the
  // raw favorites list (e.g. my-favorites) hide removed entries immediately.
  const favorites = useMemo(
    () => serverFavorites.filter((f) => !optimisticDeletes.has(f.dishId)),
    [serverFavorites, optimisticDeletes],
  );

  // Effective set of favorited dish IDs after applying optimistic add/delete.
  const favoriteIdSet = useMemo(() => {
    const ids = new Set<string>();
    for (const f of serverFavorites) ids.add(f.dishId);
    for (const id of optimisticDeletes) ids.delete(id);
    for (const id of optimisticAdds) ids.add(id);
    return ids;
  }, [serverFavorites, optimisticAdds, optimisticDeletes]);

  const favoriteIds = useMemo(() => Array.from(favoriteIdSet), [favoriteIdSet]);

  const isFavorited = useCallback(
    (dishId: string) => favoriteIdSet.has(dishId),
    [favoriteIdSet],
  );

  const toggleFavorite = useCallback(
    (
      dishId: string,
      currentlyFavorite: boolean,
      restaurant: "anteatery" | "brandywine",
    ) => {
      if (currentlyFavorite) {
        deleteFavoriteMutation.mutate({
          userId,
          dishId,
        });
      } else {
        addFavoriteMutation.mutate({
          userId,
          dishId,
          restaurant,
        });
      }
    },
    [addFavoriteMutation, deleteFavoriteMutation, userId],
  );

  // True while a dish has an in-flight add or delete so callers can render
  // a loading affordance even though the UI already reflects the change.
  const isFavoritePending = useCallback(
    (dishId: string) =>
      optimisticAdds.has(dishId) || optimisticDeletes.has(dishId),
    [optimisticAdds, optimisticDeletes],
  );

  return {
    favorites,
    favoriteIds,
    isFavorited,
    isLoadingFavorites: favoritesQuery.isLoading,
    toggleFavorite,
    isFavoritePending,
    favoritesError: favoritesQuery.error,
  };
}
