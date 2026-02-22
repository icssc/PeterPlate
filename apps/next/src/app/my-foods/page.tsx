"use client";

import type { DishInfo } from "@peterplate/api";
import { useMemo, useState } from "react";
import MyFoodsCard from "@/components/ui/card/my-foods-card";
import FoodCardSkeleton from "@/components/ui/skeleton/food-card-skeleton";
import { useUserStore } from "@/context/useUserStore";
import { useFavorites } from "@/hooks/useFavorites";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";

type LocationFilter = "all" | "brandywine" | "anteatery";
type SortOption = "recent" | "oldest" | "az" | "rating";

interface MergedEntry {
  dishId: string;
  dish: DishInfo;
  isFavorited: boolean;
  modifiedAt: Date;
}

const LOCATION_LABELS: Record<LocationFilter, string> = {
  all: "All Locations",
  brandywine: "Brandywine",
  anteatery: "Anteatery",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Date Modified (Recent)" },
  { value: "oldest", label: "Date Modified (Oldest)" },
  { value: "az", label: "Name (A–Z)" },
  { value: "rating", label: "Highest Rated" },
];

export default function MyFoodsPage() {
  const userId = useUserStore((s) => s.userId);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const {
    favorites,
    isLoadingFavorites,
    favoritesError,
    toggleFavorite,
    isFavoritePending,
  } = useFavorites(userId ?? "");

  const {
    data: ratedFoods,
    isLoading: isLoadingRated,
    error: ratedError,
  } = trpc.dish.rated.useQuery({ userId: userId ?? "" }, { enabled: !!userId });

  const mergedEntries = useMemo<MergedEntry[]>(() => {
    const map = new Map<string, MergedEntry>();

    // Process favorites first
    for (const fav of favorites) {
      const ts = fav.updatedAt ?? fav.createdAt;
      map.set(fav.dishId, {
        dishId: fav.dishId,
        dish: fav.dish as unknown as DishInfo,
        isFavorited: true,
        modifiedAt: ts ? new Date(ts) : new Date(0),
      });
    }

    // Merge rated dishes
    for (const rated of ratedFoods ?? []) {
      const ratedAt = rated.ratedAt ? new Date(rated.ratedAt) : new Date(0);
      const existing = map.get(rated.id);
      if (existing) {
        // Keep the most recent timestamp
        if (ratedAt > existing.modifiedAt) {
          existing.modifiedAt = ratedAt;
        }
      } else {
        map.set(rated.id, {
          dishId: rated.id,
          dish: rated as unknown as DishInfo,
          isFavorited: false,
          modifiedAt: ratedAt,
        });
      }
    }

    return Array.from(map.values());
  }, [favorites, ratedFoods]);

  const filteredEntries = useMemo<MergedEntry[]>(() => {
    let result = mergedEntries;

    if (locationFilter !== "all") {
      result = result.filter(
        (e) => e.dish.restaurant?.toLowerCase() === locationFilter,
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.dish.name.toLowerCase().includes(q));
    }

    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "recent":
          return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        case "oldest":
          return a.modifiedAt.getTime() - b.modifiedAt.getTime();
        case "az":
          return a.dish.name.localeCompare(b.dish.name);
        case "rating":
          return (b.dish.numRatings ?? 0) - (a.dish.numRatings ?? 0);
        default:
          return 0;
      }
    });
  }, [mergedEntries, locationFilter, searchQuery, sortOption]);

  const isLoading = isLoadingFavorites || isLoadingRated;
  const hasError = !!favoritesError || !!ratedError;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-20 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl text-sky-700 font-bold tracking-tight">
          My Foods
        </h1>
        <p className="text-sm">
          View all the dishes you have favorited or rated across UCI dining
          halls!
        </p>
      </header>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
        {/* Location buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Location
          </span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LOCATION_LABELS) as LocationFilter[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationFilter(loc)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition",
                  locationFilter === loc
                    ? "bg-sky-700 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50",
                )}
              >
                {LOCATION_LABELS[loc]}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex gap-3 w-full",
            isDesktop ? "ml-auto flex-row items-center" : "flex-col",
          )}
        >
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-200 bg-white focus:ring-2 focus:ring-sky-700 focus:outline-none"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1 sm:gap-0">
            {!isDesktop && (
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                Filter by
              </span>
            )}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 text-sm rounded-xl border border-zinc-200 bg-white focus:ring-2 focus:ring-sky-700 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <div className="rounded-md border border-red-200 bg-red-50/70 px-4 py-3 text-red-700 text-sm">
          We couldn't load your foods. Please try again in a moment.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["sk-0", "sk-1", "sk-2", "sk-3"].map((id) => (
            <FoodCardSkeleton key={id} />
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && !hasError && (
        <>
          <p className="text-sm">
            Showing <span>{filteredEntries.length}</span>{" "}
            {filteredEntries.length === 1 ? "dish" : "dishes"}
          </p>

          {filteredEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-16 text-center shadow-sm">
              <p className="text-lg font-medium text-zinc-800">
                No dishes found
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                {mergedEntries.length === 0
                  ? "You haven't favorited or rated any meals yet. Browse the menus to get started!"
                  : "No dishes match your current filters. Try adjusting your search or location."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredEntries.map((entry) => (
                <MyFoodsCard
                  key={entry.dishId}
                  dish={entry.dish}
                  isFavorited={entry.isFavorited}
                  favoriteDisabled={!!isFavoritePending?.(entry.dishId)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
