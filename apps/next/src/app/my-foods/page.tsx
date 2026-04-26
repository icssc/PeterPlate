"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import MyFoodsCard from "@/components/ui/card/my-foods-card";
import FoodCardSkeleton from "@/components/ui/skeleton/food-card-skeleton";
import { useUserStore } from "@/context/useUserStore";
import { useFavorites } from "@/hooks/useFavorites";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";

type LocationFilter = "all" | "brandywine" | "anteatery";
type SortOption = "recent" | "oldest" | "highest" | "lowest" | "az" | "za";

interface MergedEntry {
  dishId: string;
  dish: DishInfo;
  isFavorited: boolean;
  stationName?: string;
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
  { value: "highest", label: "Rating (Highest)" },
  { value: "lowest", label: "Rating (Lowest)" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

export default function MyFoodsPage() {
  const userId = useUserStore((s) => s.userId);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [showMobileSort, setShowMobileSort] = useState(false);
  const { resolvedTheme } = useTheme();

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
        stationName: (fav.dish as unknown as { stationName?: string })
          .stationName,
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
          stationName: (rated as unknown as { stationName?: string })
            .stationName,
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
        case "highest":
          return (b.dish.numRatings ?? 0) - (a.dish.numRatings ?? 0);
        case "lowest":
          return (a.dish.numRatings ?? 0) - (b.dish.numRatings ?? 0);
        case "az":
          return a.dish.name.localeCompare(b.dish.name);
        case "za":
          return b.dish.name.localeCompare(a.dish.name);
        default:
          return 0;
      }
    });
  }, [mergedEntries, locationFilter, searchQuery, sortOption]);

  const isLoading = isLoadingFavorites || isLoadingRated;
  const hasError = !!favoritesError || !!ratedError;

  return (
    <Box
      className={`mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-8 ${isDesktop ? "pt-20" : ""} sm:px-6 lg:px-8`}
      sx={{ bgcolor: "background.default", minHeight: "100vh" }}
    >
      {/* Header */}
      <header className="space-y-1">
        <Typography color="primary" fontWeight={700} className="text-4xl mb-4">
          My Foods
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="hidden md:block"
        >
          View all the dishes you have favorited or rated across UCI dining
          halls!
        </Typography>
      </header>

      {/* Filter bar */}
      {isDesktop ? (
        /* ── Desktop: single row ── */
        <div className="flex flex-row flex-wrap items-center gap-4 rounded-2xl bg-sky-100 dark:bg-[#434e5d] p-4">
          {/* Location */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Typography variant="body2" fontWeight={500} color="text.primary">
              Location
            </Typography>
            <div className="flex flex-row gap-2">
              {(Object.keys(LOCATION_LABELS) as LocationFilter[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocationFilter(loc)}
                  style={{
                    color:
                      locationFilter === loc
                        ? undefined
                        : resolvedTheme === "dark"
                          ? "white"
                          : "black",
                  }}
                  className={cn(
                    "rounded-lg px-4 py-1.5 h-8 text-sm font-medium transition whitespace-nowrap",
                    locationFilter === loc
                      ? "bg-sky-700 dark:bg-blue-300 text-white dark:text-gray-900 shadow-sm"
                      : "bg-white dark:bg-transparent border border-sky-700 dark:border-blue-300 hover:bg-zinc-100 dark:hover:bg-blue-300/10",
                  )}
                >
                  {LOCATION_LABELS[loc]}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex flex-row flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-zinc-400 pointer-events-none"
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
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-sky-700 dark:border-blue-300 !bg-white dark:!bg-[#323235] dark:!text-white focus:ring-2 focus:ring-sky-700 dark:focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="flex flex-col justify-end">
              <FormControl
                variant="outlined"
                size="small"
                className="!min-w-[220px]"
              >
                <InputLabel
                  id="sort-label"
                  shrink
                  className="!text-sky-700 dark:!text-blue-300 !text-sm !font-semibold [&.Mui-focused]:!text-sky-700 dark:[&.Mui-focused]:!text-blue-300"
                >
                  Filter by
                </InputLabel>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  label="Filter by"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor:
                          resolvedTheme === "dark" ? "#323235" : undefined,
                        backgroundImage: "none",
                        "& .MuiMenuItem-root": {
                          color: resolvedTheme === "dark" ? "white" : undefined,
                        },
                        "& .MuiMenuItem-root:hover": {
                          bgcolor:
                            resolvedTheme === "dark" ? "#434e5d" : undefined,
                        },
                        "& .MuiMenuItem-root.Mui-selected": {
                          bgcolor:
                            resolvedTheme === "dark" ? "#93C5FD" : "#0369a1",
                          color: resolvedTheme === "dark" ? "#111827" : "white",
                        },
                        "& .MuiMenuItem-root.Mui-selected:hover": {
                          bgcolor:
                            resolvedTheme === "dark" ? "#93C5FD" : "#0369a1",
                        },
                      },
                    },
                  }}
                  className="!h-9 !text-sm !rounded-xl !bg-white dark:!bg-[#323235] dark:!text-white [&_.MuiOutlinedInput-notchedOutline]:!border-sky-700 dark:[&_.MuiOutlinedInput-notchedOutline]:!border-blue-300 [&:hover_.MuiOutlinedInput-notchedOutline]:!border-sky-700 dark:[&:hover_.MuiOutlinedInput-notchedOutline]:!border-blue-300 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-sky-700 dark:[&.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-blue-300 [&_.MuiSelect-select]:!py-1.5"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      ) : (
        /* ── Mobile: stacked layout ── */
        <div className="flex flex-col gap-3 rounded-2xl bg-sky-100 dark:bg-[#434e5d] p-4">
          {/* Location buttons — no label */}
          <div className="flex flex-row gap-2">
            {(Object.keys(LOCATION_LABELS) as LocationFilter[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationFilter(loc)}
                className={cn(
                  "rounded-lg px-2 py-1.5 h-8 text-sm font-medium transition whitespace-nowrap flex-1 min-w-0 truncate",
                  locationFilter === loc
                    ? "bg-sky-700 dark:bg-blue-300 text-white dark:text-gray-900 shadow-sm"
                    : "bg-white dark:bg-transparent border border-sky-700 dark:border-blue-300 hover:bg-zinc-100 dark:hover:bg-blue-300/10",
                )}
              >
                {LOCATION_LABELS[loc]}
              </button>
            ))}
          </div>

          {/* Search + filter icon */}
          <div className="flex flex-row gap-2 items-center">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-zinc-400 pointer-events-none"
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
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-sky-700 dark:border-blue-300 !bg-white dark:!bg-[#323235] dark:!text-white focus:ring-2 focus:ring-sky-700 dark:focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* Filter icon button */}
            <button
              type="button"
              aria-label="Toggle sort options"
              onClick={() => setShowMobileSort((v) => !v)}
              className={cn(
                "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border transition",
                showMobileSort
                  ? "bg-sky-700 dark:bg-blue-300 border-sky-700 dark:border-blue-300 text-white dark:text-gray-900"
                  : "bg-white dark:bg-transparent border-sky-700 dark:border-blue-300 hover:bg-sky-50 dark:hover:bg-blue-300/10",
              )}
            >
              {/* Filter / funnel icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
              </svg>
            </button>
          </div>

          {/* Collapsible sort options as buttons */}
          {showMobileSort && (
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortOption(value)}
                  style={{
                    color:
                      sortOption === value
                        ? undefined
                        : resolvedTheme === "dark"
                          ? "white"
                          : "black",
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition whitespace-nowrap border",
                    sortOption === value
                      ? "bg-sky-700 dark:bg-blue-300 text-white dark:text-gray-900 border-sky-700 dark:border-blue-300 shadow-sm"
                      : "bg-white dark:bg-transparent border-sky-700 dark:border-blue-300 hover:bg-sky-50 dark:hover:bg-blue-300/10",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
          <Typography variant="body2" color="text.primary">
            Showing <span>{filteredEntries.length}</span>{" "}
            {filteredEntries.length === 1 ? "dish" : "dishes"}
          </Typography>

          {filteredEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-600 bg-white/60 dark:bg-[#323235] px-6 py-16 text-center shadow-sm">
              <Typography variant="body1" fontWeight={500} color="text.primary">
                No dishes found
              </Typography>
              <Typography
                variant="body2"
                className="mt-2 text-zinc-500 dark:text-zinc-400"
              >
                {mergedEntries.length === 0
                  ? "You haven't favorited or rated any meals yet. Browse the menus to get started!"
                  : "No dishes match your current filters. Try adjusting your search or location."}
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
              {filteredEntries.map((entry) => (
                <MyFoodsCard
                  key={entry.dishId}
                  dish={entry.dish}
                  isFavorited={entry.isFavorited}
                  stationName={entry.stationName}
                  favoriteDisabled={!!isFavoritePending?.(entry.dishId)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Box>
  );
}
