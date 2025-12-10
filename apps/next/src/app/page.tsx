"use client";

import { useState } from "react";

import Side from "@/components/ui/side";
import { DEFAULT_USER_ID } from "@/config/user";
import { useFavorites } from "@/hooks/useFavorites";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HallEnum } from "@/utils/types";

export default function Home() {
  const [activeHall, setActiveHall] = useState<HallEnum>(HallEnum.BRANDYWINE);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind's `md` breakpoint

  const {
    favoriteIds,
    isLoadingFavorites,
    toggleFavorite,
    isFavoritePending,
  } = useFavorites(DEFAULT_USER_ID);

  const favoriteProps = {
    favoriteDishIds: favoriteIds,
    isFavoritesLoading: isLoadingFavorites,
    onToggleFavorite: toggleFavorite,
    isFavoritePending,
  };

  // Desktop layout: two Side components side-by-side
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 h-screen">
        <Side hall={HallEnum.BRANDYWINE} {...favoriteProps} />
        <Side hall={HallEnum.ANTEATERY} {...favoriteProps} />
      </div>
    );
  }

  const toggleHall = () => {
    if (activeHall === HallEnum.BRANDYWINE) setActiveHall(HallEnum.ANTEATERY);
    else setActiveHall(HallEnum.BRANDYWINE);
  };

  // Mobile layout: one Side component at a time with switcher
  return (
    <div className="flex flex-col h-screen">
      {/* <div className="flex-shrink-0 p-3 flex justify-center gap-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 ">
        <button
          onClick={() => setActiveHall(HallEnum.BRANDYWINE)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeHall === HallEnum.BRANDYWINE
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
        >
          Brandywine
        </button>
        <button
          onClick={() => setActiveHall(HallEnum.ANTEATERY)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeHall === HallEnum.ANTEATERY
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
        >
          Anteatery
        </button>
      </div> */}
      <div className="flex-grow overflow-y-auto">
        {activeHall === HallEnum.BRANDYWINE && (
          <Side
            hall={HallEnum.BRANDYWINE}
            toggleHall={toggleHall}
            {...favoriteProps}
          />
        )}
        {activeHall === HallEnum.ANTEATERY && (
          <Side
            hall={HallEnum.ANTEATERY}
            toggleHall={toggleHall}
            {...favoriteProps}
          />
        )}
      </div>
    </div>
  );
}
