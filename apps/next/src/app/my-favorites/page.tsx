"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FoodCard from "@/components/ui/card/food-card";
import FoodCardSkeleton from "@/components/ui/skeleton/food-card-skeleton";
import { useUserStore } from "@/context/useUserStore";
import { useFavorites } from "@/hooks/useFavorites";

type FavoriteEntry = ReturnType<typeof useFavorites>["favorites"][number];

export default function MyFavoritesPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users.
    if (!userId) {
      alert("Login to favorite meals!");
      router.push("/");
    }
  }, [userId, router.push]);

  const {
    favorites,
    isLoadingFavorites,
    favoritesError,
    toggleFavorite,
    isFavoritePending,
  } = useFavorites(userId ?? "");

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
          {["one", "two", "three"].map((id) => (
            <FoodCardSkeleton key={`favorite-skeleton-${id}`} />
          ))}
        </div>
      )}
      {!isLoadingFavorites &&
        !favoritesError &&
        (hasFavorites ? (
          <div className="space-y-4">
            {favorites.map((favorite: FavoriteEntry) => (
              <FoodCard
                key={favorite.dishId}
                menuId="favorite-menu"
                {...favorite.dish}
                isFavorited
                favoriteIsLoading={isFavoritePending?.(favorite.dishId)}
                onToggleFavorite={toggleFavorite}
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
        ))}{" "}
    </div>
  );
}
