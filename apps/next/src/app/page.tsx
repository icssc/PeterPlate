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
import EventDialogContent from "@/components/ui/event-dialog-content";
import FoodDialogContent from "@/components/ui/food-dialog-content";
import Side from "@/components/ui/side";
import { useDate } from "@/context/date-context";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  formatFoodName,
  militaryToStandard,
  timeToString,
  toTitleCase,
} from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { HallEnum, numToMonth } from "@/utils/types";

export default function Home() {
  const [activeHall, setActiveHall] = useState<HallEnum>(HallEnum.BRANDYWINE);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Desktop layout: new homepage
  if (isDesktop) {
    return <DesktopHome />;
  }

  // Mobile layout: original Side component with toggle
  const toggleHall = () => {
    if (activeHall === HallEnum.BRANDYWINE) setActiveHall(HallEnum.ANTEATERY);
    else setActiveHall(HallEnum.BRANDYWINE);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto">
        {activeHall === HallEnum.BRANDYWINE && (
          <Side hall={HallEnum.BRANDYWINE} toggleHall={toggleHall} />
        )}
        {activeHall === HallEnum.ANTEATERY && (
          <Side hall={HallEnum.ANTEATERY} toggleHall={toggleHall} />
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────── Desktop Home ────────────────────────────── */

function DesktopHome() {
  const { selectedDate } = useDate();
  const today = selectedDate ?? new Date();

  const { data, isLoading } = trpc.peterplate.useQuery(
    { date: today },
    { staleTime: 2 * 60 * 60 * 1000 },
  );

  const { data: events } = trpc.event.upcoming.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Derive open/close status for each hall
  const getHallStatus = (
    hallData: NonNullable<typeof data>["anteatery"] | undefined,
  ) => {
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
  };

  const brandywineStatus = getHallStatus(data?.brandywine);
  const anteateryStatus = getHallStatus(data?.anteatery);

  // Collect all dishes across both halls for "Popular Today"
  const allDishes = [
    ...(data?.brandywine?.menus ?? []).flatMap((menu) =>
      menu.stations.flatMap((station) =>
        station.dishes.map((dish) => ({
          ...dish,
          hallName: "Brandywine",
          stationName: station.name,
        })),
      ),
    ),
    ...(data?.anteatery?.menus ?? []).flatMap((menu) =>
      menu.stations.flatMap((station) =>
        station.dishes.map((dish) => ({
          ...dish,
          hallName: "Anteatery",
          stationName: station.name,
        })),
      ),
    ),
  ];

  // Take a selection for "Popular Today" – just pick the first ~10 unique dishes
  const seenNames = new Set<string>();
  const popularDishes = allDishes
    .filter((d) => {
      const key = d.name.toLowerCase();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    })
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Hero heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          See what&apos;s on the menu today!
        </h1>

        {/* ── Dining Halls ── */}
        <section>
          <h2 className="text-xl font-bold text-sky-600 mb-4">Dining Halls</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Brandywine Card */}
            <Link href="/brandywine" className="group">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-56">
                  <Image
                    src="/brandywine.webp"
                    alt="Brandywine dining hall"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-sky-600">
                      Brandywine
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <LocationOn className="w-4 h-4" />
                      <span>Middle Earth Community</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <AccessTime className="w-4 h-4" />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : brandywineStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-sky-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
                  <div>
                    <h3 className="text-lg font-semibold text-sky-600">
                      Anteatery
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <LocationOn className="w-4 h-4" />
                      <span>Mesa Court</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <AccessTime className="w-4 h-4" />
                      <span>
                        {isLoading
                          ? "Loading..."
                          : anteateryStatus.statusText || "Hours unavailable"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-sky-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Popular Today ── */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
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
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
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
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              See More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {!events || events.length === 0 ? (
            <p className="text-neutral-500">No upcoming events.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {events.slice(0, 6).map((event, idx) => (
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

/* ────────────────────────────── Sub-components ────────────────────────────── */

/** A small card for a popular dish in the horizontal scroll row (desktop only). */
function PopularDishCard({
  dish,
  hallName,
  stationName,
}: {
  dish: DishInfo;
  hallName: string;
  stationName: string;
}) {
  const [open, setOpen] = useState(false);

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );

  const averageRating = ratingData?.averageRating ?? 0;

  return (
    <>
      <button
        type="button"
        className="flex-shrink-0 w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent p-0"
        onClick={() => setOpen(true)}
      >
        {/* Placeholder food image area */}
        <div className="relative w-full h-28 bg-amber-50 dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-4xl">🍽️</span>
        </div>
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-semibold text-sky-600 leading-tight line-clamp-2">
            {formatFoodName(dish.name)}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {hallName} • {toTitleCase(stationName)}
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Star className="w-3.5 h-3.5" />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : "—"}</span>
          </div>
        </div>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: "460px",
              maxWidth: "90vw",
              margin: 2,
              padding: 0,
              overflow: "hidden",
              borderRadius: "16px",
            },
          },
        }}
      >
        <FoodDialogContent dish={dish} />
      </Dialog>
    </>
  );
}

/** A compact card for an upcoming event in the horizontal scroll row (desktop only). */
function UpcomingEventCard({
  event,
}: {
  event: {
    title: string;
    image?: string | null;
    shortDescription?: string | null;
    longDescription?: string | null;
    start?: Date | null;
    end?: Date | null;
    restaurantId: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const startDate = event.start ? new Date(event.start) : null;
  const endDate = event.end ? new Date(event.end) : null;

  // Map DB event to EventInfo shape for the dialog component
  const hallEnum =
    event.restaurantId.toLowerCase() === "anteatery"
      ? HallEnum.ANTEATERY
      : HallEnum.BRANDYWINE;

  const eventInfo: EventInfo = {
    name: event.title,
    shortDesc: event.shortDescription ?? "",
    longDesc: event.longDescription ?? "",
    imgSrc: event.image ?? "/zm-card-header.webp",
    alt: `${event.title} event image`,
    startTime: startDate ?? new Date(),
    endTime: endDate ?? new Date(),
    location: hallEnum,
    isOngoing: startDate
      ? startDate <= new Date() && (endDate ? endDate >= new Date() : false)
      : false,
  };

  return (
    <>
      <button
        type="button"
        className="flex-shrink-0 w-56 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm hover:shadow-md transition cursor-pointer space-y-2 text-left bg-transparent"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-sky-600 leading-tight">
            {event.title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-full">
            Celebration
          </span>
        </div>
        {startDate && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <CalendarMonth className="w-3.5 h-3.5" />
              <span>
                {numToMonth[startDate.getMonth()]} {startDate.getDate()},{" "}
                {startDate.getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <AccessTime className="w-3.5 h-3.5" />
              <span>
                {timeToString(startDate)}
                {endDate ? `- ${timeToString(endDate)}` : ""}
              </span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <LocationOn className="w-3.5 h-3.5" />
          <span>{toTitleCase(event.restaurantId)}</span>
        </div>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: "460px",
              maxWidth: "90vw",
              margin: 2,
              padding: 0,
              overflow: "hidden",
              borderRadius: "6px",
            },
          },
        }}
      >
        <EventDialogContent {...eventInfo} />
      </Dialog>
    </>
  );
}
