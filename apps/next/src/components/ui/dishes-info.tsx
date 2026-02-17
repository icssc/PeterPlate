"use client";

import type { DishInfo } from "@peterplate/api";
import type React from "react";
import { useUserStore } from "@/context/useUserStore";
import { useFavorites } from "@/hooks/useFavorites";
import FoodCard from "./card/food-card";
import FoodCardSkeleton from "./skeleton/food-card-skeleton";

/**
 * Props for the {@link DishesInfo} component.
 */
interface DishesInfoProps {
  /**
   * An array of `DishInfo` objects to be displayed.
   */
  dishes: DishInfo[];
  /**
   * A boolean indicating whether the data is currently being loaded.
   * If true, skeleton loaders will be displayed.
   */
  isLoading: boolean;
  /**
   * A boolean indicating whether an error occurred while fetching data.
   * If true, an error message will be displayed.
   */
  isError: boolean;
  /**
   * An optional error message string to display if `isError` is true.
   */
  errorMessage?: string;
  /**
   * Whether to display dishes in compact/simplified view.
   */
  isCompactView?: boolean;
}

/**
 * `DishesInfo` is a client component responsible for rendering a list of dishes,
 * grouped by category. It handles loading states by showing skeletons, error states
 * by displaying an error message, and an empty state if no dishes are available.
 * @param {DishesInfoProps} props - The properties for the DishesInfo component.
 * @returns {JSX.Element} The rendered list of dishes, or corresponding state UI (loading, error, empty).
 */
export default function DishesInfo({
  dishes,
  isLoading,
  isError,
  errorMessage,
  isCompactView = false,
}: DishesInfoProps): React.JSX.Element {
  const userId = useUserStore((s) => s.userId);

  const { favoriteIds, isLoadingFavorites, toggleFavorite, isFavoritePending } =
    useFavorites(userId ?? "");

  const favoriteDishIds = favoriteIds ?? [];
  const onToggleFavorite = toggleFavorite;
  const isFavoritesLoading = isLoadingFavorites;

  return (
    <div
      className="flex flex-col gap-6 mt-6 px-2 overflow-y-auto 
      flex-grow h-1"
      id="food-scroll"
    >
      {isLoading && (
        <>
          <FoodCardSkeleton />
          <FoodCardSkeleton />
          <FoodCardSkeleton />
        </>
      )}

      {isError && (
        <p className="text-red-500 w-full text-center">
          Error loading data: {errorMessage}
        </p>
      )}

      {!isLoading &&
        !isError &&
        (dishes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No dishes available for this selection.
          </p>
        ) : isCompactView ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
            {dishes.map((dish) => (
              <FoodCard
                key={dish.id}
                className="max-w-none"
                {...dish}
                isFavorited={favoriteDishIds?.includes(dish.id)}
                favoriteIsLoading={
                  !!isFavoritesLoading || !!isFavoritePending?.(dish.id)
                }
                onToggleFavorite={onToggleFavorite}
                isSimplified={isCompactView}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {dishes.map((dish) => (
              <FoodCard
                key={dish.id}
                {...dish}
                isFavorited={favoriteDishIds?.includes(dish.id)}
                favoriteIsLoading={
                  !!isFavoritesLoading || !!isFavoritePending?.(dish.id)
                }
                onToggleFavorite={onToggleFavorite}
                isSimplified={isCompactView}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
