"use client";

import {
  AccessTime,
  CalendarMonth,
  ChevronRight,
  LocationOn,
  Star,
} from "@mui/icons-material";
import { Dialog } from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { EventInfo } from "@/components/ui/card/event-card";
import PopularDishCard from "@/components/ui/card/popular-dish-card";
import UpcomingEventCard from "@/components/ui/card/upcoming-event-card";
import EventDialogContent from "@/components/ui/event-dialog-content";
import FoodDialogContent from "@/components/ui/food-dialog-content";
import Side from "@/components/ui/side";
import { useDate } from "@/context/date-context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  formatFoodName,
  getFoodIcon,
  militaryToStandard,
  timeToString,
  toTitleCase,
} from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { HallEnum, numToMonth } from "@/utils/types";

export default function Home() {
  //const [activeHall, setActiveHall] = useState<HallEnum>(HallEnum.BRANDYWINE);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Desktop layout: new homepage
  if (isDesktop) {
    return <DesktopHome />;
  }

  return <MobileHome />;
  /*
  // Mobile layout: original Side component with toggle
  const toggleHall = () => {
    if (activeHall === HallEnum.BRANDYWINE) setActiveHall(HallEnum.ANTEATERY);
    else setActiveHall(HallEnum.BRANDYWINE);
  };

  return (
    <div className="flex flex-col h-screen">
      {<div className="flex-shrink-0 p-3 flex justify-center gap-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 ">
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
      </div> }
      <div className="flex-grow overflow-y-auto">
        {activeHall === HallEnum.BRANDYWINE && (
          <Side hall={HallEnum.BRANDYWINE} toggleHall={toggleHall} />
        )}
        {activeHall === HallEnum.ANTEATERY && (
          <Side hall={HallEnum.ANTEATERY} toggleHall={toggleHall} />
        )}
      </div>
    </div>
  );*/
}

/* ────────────────────────────── Desktop Home ────────────────────────────── */

function DesktopHome(): React.JSX.Element {
  const { selectedDate } = useDate();
  const today = selectedDate ?? new Date();

  const { data, isLoading } = trpc.peterplate.useQuery(
    { date: today },
    { staleTime: 2 * 60 * 60 * 1000 },
  );

  const { data: events } = trpc.event.upcoming.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Get hall information
  const brandywine = getHallDishData(data?.brandywine, "Brandywine");
  const anteatery = getHallDishData(data?.anteatery, "Anteatery");

  const brandywineStatus = brandywine.status;
  const anteateryStatus = anteatery.status;

  const brandywineDishes = brandywine.dishes;
  const anteateryDishes = anteatery.dishes;

  // Popular Today
  const allDishes = [...brandywineDishes, ...anteateryDishes];
  const popularDishes = getPopularDishes(allDishes, 5);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          See what's on the menu today!
        </h1>

        {/* ── Dining Halls ── */}
        <section>
          <h2 className="text-2xl font-bold text-sky-700 mb-4">Dining Halls</h2>
          <div className="grid grid-cols-2 gap-12">
            {/* Brandywine Card */}
            <Link href="/brandywine" className="group">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-56">
                  <Image
                    src="/brandywine.webp"
                    alt="Brandywine dining hall"
                    fill
                    className="object-cover object-bottom"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-sky-700">
                      Brandywine
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                      <LocationOn className="w-4 h-4" />
                      <span>Middle Earth Community</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                      <AccessTime className="w-4 h-4" />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : brandywineStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-sky-700 w-6 h-6" />
                </div>
              </div>
            </Link>

            {/* Anteatery Card */}
            <Link href="/anteatery" className="group">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-56">
                  <Image
                    src="/anteatery.webp"
                    alt="Anteatery dining hall"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-sky-700">
                      Anteatery
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                      <LocationOn className="w-4 h-4" />
                      <span>Mesa Court</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                      <AccessTime className="w-4 h-4" />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : anteateryStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-sky-700 w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Popular Today ── */}
        <section>
          <h2 className="text-xl font-bold text-sky-700 dark:text-neutral-100 mb-4">
            Popular Today
          </h2>
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                <div
                  key={key}
                  className="flex-shrink-0 w-44 h-52 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
                />
              ))}
            </div>
          ) : popularDishes.length === 0 ? (
            <p className="text-neutral-500">No dishes available today.</p>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {popularDishes.map((dish, idx) => (
                <PopularDishCard
                  key={`${dish.id}-${idx}`}
                  dish={dish}
                  hallName={dish.hallName}
                  stationName={dish.stationName}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Upcoming Events ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-sky-700 dark:text-neutral-100">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-sky-700 flex items-center gap-1"
            >
              See More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {!events || events.length === 0 ? (
            <p className="text-neutral-500">No upcoming events.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {sortedEvents(events, 4).map((event, idx) => (
                <UpcomingEventCard
                  key={`${event.title}-${idx}`}
                  event={event}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ────────────────────────────── Mobile Home ────────────────────────────── */
function MobileHome(): React.JSX.Element {
  const { selectedDate } = useDate();
  const today = selectedDate ?? new Date();

  const { data, isLoading } = trpc.peterplate.useQuery(
    { date: today },
    { staleTime: 2 * 60 * 60 * 1000 },
  );

  const { data: events } = trpc.event.upcoming.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Get hall information
  const brandywine = getHallDishData(data?.brandywine, "Brandywine");
  const anteatery = getHallDishData(data?.anteatery, "Anteatery");

  const brandywineStatus = brandywine.status;
  const anteateryStatus = anteatery.status;

  const brandywineDishes = brandywine.dishes;
  const anteateryDishes = anteatery.dishes;

  // Popular Today
  const allDishes = [...brandywineDishes, ...anteateryDishes];
  const popularDishes = getPopularDishes(allDishes, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        <h1 className="text-1xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome back, Peter!
        </h1>

        {/* ── Dining Halls ── */}
        <section>
          <h2 className="text-1xl font-bold text-sky-600 mb-2">Dining Halls</h2>
          <div className="space-y-3">
            {/* Brandywine Card */}
            <Link href="/brandywine" className="group block">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-24">
                  <Image
                    src="/brandywine.webp"
                    alt="Brandywine dining hall"
                    fill
                    className="object-cover object-bottom"
                    priority
                  />
                </div>
                <div className="relative flex items-center justify-between p-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-sky-600">
                      Brandywine
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <LocationOn style={{ fontSize: 16 }} />
                      <span>Middle Earth Community</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <AccessTime style={{ fontSize: 16 }} />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : brandywineStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className="absolute top-3 right-3 text-sky-600"
                    style={{ fontSize: 16 }}
                  />
                </div>
              </div>
            </Link>

            {/* Anteatery Card */}
            <Link href="/anteatery" className="group block">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-24">
                  <Image
                    src="/anteatery.webp"
                    alt="Anteatery dining hall"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="relative flex items-center justify-between p-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-sky-600">
                      Anteatery
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <LocationOn style={{ fontSize: 16 }} />
                      <span>Mesa Court</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <AccessTime style={{ fontSize: 16 }} />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : anteateryStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className="absolute top-3 right-3 text-sky-600"
                    style={{ fontSize: 16 }}
                  />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Popular Today */}
        <section>
          <h2 className="text-1xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Popular Today
          </h2>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                <div
                  key={key}
                  className="flex-shrink-0 w-44 h-52 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
                />
              ))}
            </div>
          ) : popularDishes.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No dishes available today.
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {popularDishes.map((dish, idx) => (
                <PopularDishCard
                  key={`${dish.id}-${idx}`}
                  dish={dish}
                  hallName={dish.hallName}
                  stationName={dish.stationName}
                  compact={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-1xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              See More{" "}
              <ChevronRight className="text-sky-600" style={{ fontSize: 16 }} />
            </Link>
          </div>
          {!events || events.length === 0 ? (
            <p className="text-sm text-neutral-500">No upcoming events.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sortedEvents(events, 3).map((event, idx) => (
                <UpcomingEventCard
                  key={`${event.title}-${idx}`}
                  event={event}
                  compact={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ────────────────────────────── Sub-components ────────────────────────────── */
// Handles getting hall data for easier access to dishes and status
type HallInput =
  | {
      menus?: {
        period: { startTime: string; endTime: string };
        stations: {
          name: string;
          dishes: Array<Record<string, any>>;
        }[];
      }[];
    }
  | undefined;

export function getHallDishData<TDish extends Record<string, any>>(
  hallData:
    | (Omit<NonNullable<HallInput>, "menus"> & {
        menus?: {
          period: { startTime: string; endTime: string };
          stations: { name: string; dishes: TDish[] }[];
        }[];
      })
    | undefined,
  hallName: string,
) {
  const status = getHallStatus(hallData);
  const menus = hallData?.menus ?? [];

  const dishes = menus.flatMap((menu) =>
    menu.stations.flatMap((station) =>
      station.dishes.map((dish) => ({
        ...dish,
        hallName,
        stationName: station.name,
      })),
    ),
  );

  return { status, dishes };
}

// Handles Popular Today: gets top unique dishes sorted by average rating (descending)
type DishRatings = {
  name: string;
  numRatings: number;
  totalRating: number;
};

export function getPopularDishes<T extends DishRatings>(
  allDishes: T[] | null | undefined,
  numCards: number,
): T[] {
  const seenNames = new Set<string>();

  return (allDishes ?? [])
    .filter((dish) => {
      const key = dish.name.toLowerCase();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    })
    .sort((a, b) => {
      const avgA = a.numRatings > 0 ? a.totalRating / a.numRatings : 0;
      const avgB = b.numRatings > 0 ? b.totalRating / b.numRatings : 0;
      return avgB - avgA;
    })
    .slice(0, numCards);
}

// Handles Upcoming Events: gets top upcoming events sorted by start time (ascending)
type EventItem = {
  start?: string | Date | null;
};

export function sortedEvents<T extends EventItem>(
  events: T[] | null | undefined,
  numCards: number,
): T[] {
  return [...(events ?? [])]
    .sort((event, nextEvent) => {
      const eventStartTime = event.start ? new Date(event.start).getTime() : 0;
      const nextEventStartTime = nextEvent.start
        ? new Date(nextEvent.start).getTime()
        : 0;

      return eventStartTime - nextEventStartTime;
    })
    .slice(0, numCards);
}

// Get open/close status for each hall
type HallData =
  | {
      menus?: {
        period: {
          startTime: string;
          endTime: string;
        };
      }[];
    }
  | undefined;

export function getHallStatus(hallData: HallData) {
  if (!hallData?.menus?.length) return { isOpen: false, statusText: "" };
  let earliestOpen: Date | undefined;
  let latestClose: Date | undefined;
  for (const menu of hallData.menus) {
    try {
      const open = militaryToStandard(menu.period.startTime);
      const close = militaryToStandard(menu.period.endTime);
      if (!earliestOpen || open < earliestOpen) earliestOpen = open;
      if (!latestClose || close > latestClose) latestClose = close;
    } catch {
      /* skip */
    }
  }
  if (earliestOpen && latestClose) {
    const now = new Date();
    const isOpen = now >= earliestOpen && now <= latestClose;
    return {
      isOpen,
      statusText: isOpen
        ? `Open until ${latestClose.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
        : `Closed`,
    };
  }
  return { isOpen: false, statusText: "" };
}
