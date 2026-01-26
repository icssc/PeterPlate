"use client";

import FoodCard from "@/components/ui/card/food-card";
import FoodCardSkeleton from "@/components/ui/skeleton/food-card-skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { useSession } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type FavoriteEntry = ReturnType<typeof useFavorites>["favorites"][number];

export default function MyFavoritesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users.
    if (!isPending && !user?.id) {
      alert("You must be logged in to track meals");
      router.push("/");
    }
  }, [user]);

  const {
    favorites,
    isLoadingFavorites,
    favoritesError,
    toggleFavorite,
    isFavoritePending,
  } = useFavorites(user?.id);

  const hasFavorites = favorites.length > 0;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">My Favorites</h1>
        <p className="text-sm text-zinc-500">
          Meals you have saved across Anteatery and Brandywine. Tap the heart on
          any card to add or remove items.
        </p>
      </header>

      {favoritesError && (
        <div className="rounded-md border border-red-200 bg-red-50/70 px-4 py-3 text-red-700">
          We couldn&apos;t load your favorites. Please try again in a moment.
        </div>
      )}

      {isLoadingFavorites && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FoodCardSkeleton key={`favorite-skeleton-${index}`} />
          ))}
        </div>
      )}

      {!isLoadingFavorites && !favoritesError && (
        <>
          {hasFavorites ? (
            <div className="space-y-4">
              {favorites.map((favorite: FavoriteEntry) => (
                <FoodCard
                  key={favorite.dishId}
                  {...favorite.dish}
                  isFavorited
                  favoriteIsLoading={isFavoritePending?.(favorite.dishId)}
                  onToggleFavorite={toggleFavorite}
                  userid={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-16 text-center shadow-sm">
              <p className="text-lg font-medium text-zinc-800">
                You haven&apos;t saved any meals yet
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Browse today&apos;s menus and tap the heart icon to build your
                favorites list.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}


