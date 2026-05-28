"use client";

import { AccessTime, ChevronRight, LocationOn } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import PopularDishCard from "@/components/ui/card/popular-dish-card";
import UpcomingEventCard from "@/components/ui/card/upcoming-event-card";
import OnboardingDialog from "@/components/ui/onboarding";
import { useDate } from "@/context/date-context";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession } from "@/utils/auth-client";
import { getHallStatus, getPopularDishes, sortedEvents } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";

type DishDataRestaurantStation = DishWithRating & {
  restaurant: "brandywine" | "anteatery";
  stationName: string;
};

interface DiningHallCardProps {
  href: string;
  src: string;
  alt: string;
  name: string;
  location: string;
  statusText: string | null | undefined;
  isLoading: boolean;
  compact?: boolean;
  imageClassName?: string;
}

function DiningHallCard({
  href,
  src,
  alt,
  name,
  location,
  statusText,
  isLoading,
  compact = false,
  imageClassName = "object-cover",
}: DiningHallCardProps): React.JSX.Element {
  return (
    <Link href={href} className={`group${compact ? " block" : ""}`}>
      <Box
        className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition dark:bg-surface-elevated"
        sx={{ border: 1, borderColor: "divider" }}
      >
        <div className={`relative w-full ${compact ? "h-24" : "h-56"}`}>
          <Image src={src} alt={alt} fill className={imageClassName} priority />
        </div>
        <div
          className={`relative flex items-center justify-between ${
            compact ? "p-3" : "p-4"
          }`}
        >
          <div className={`space-y-${compact ? "1" : "1.5"}`}>
            <Typography
              className={`${compact ? "text-sm" : "text-lg"} font-semibold`}
              color="primary"
            >
              {name}
            </Typography>
            <Box className="flex items-center gap-1.5">
              <LocationOn
                {...(compact
                  ? { style: { fontSize: 16 } }
                  : { fontSize: "small" })}
              />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
            <Box className="flex items-center gap-1.5">
              <AccessTime
                {...(compact
                  ? { style: { fontSize: 16 } }
                  : { fontSize: "small" })}
              />
              <Typography variant="body2" color="text.secondary">
                {isLoading ? "Loading..." : statusText || "Hours unavailable"}
              </Typography>
            </Box>
          </div>
          <ChevronRight
            color="primary"
            {...(compact
              ? { className: "absolute top-3 right-3", style: { fontSize: 16 } }
              : { className: "w-6 h-6" })}
          />
        </div>
      </Box>
    </Link>
  );
}

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Onboarding logic
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { data: session, isPending } = useSession();
  const _hasOnboardedStore = useUserStore((state) => state.hasOnboarded);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const hasOnboarded = _hasOnboardedStore || session?.user?.hasOnboarded;
  const showOnboardDialog = hasMounted && !isPending && !hasOnboarded;

  return (
    <>
      {showOnboardDialog && <OnboardingDialog />}
      {isDesktop ? <DesktopHome /> : <MobileHome />}
    </>
  );
}

function DesktopHome(): React.JSX.Element {
  const { selectedDate } = useDate();
  const today = selectedDate ?? new Date();

  const { data: brandywineData, isLoading: brandywineIsLoading } =
    trpc.restaurant.useQuery(
      { date: today, restaurant: "brandywine" },
      { staleTime: 2 * 60 * 60 * 1000 },
    );

  const { data: anteateryData, isLoading: anteateryIsLoading } =
    trpc.restaurant.useQuery(
      { date: today, restaurant: "anteatery" },
      { staleTime: 2 * 60 * 60 * 1000 },
    );

  const isLoading = brandywineIsLoading || anteateryIsLoading;

  const { data: events } = trpc.event.upcoming.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Get hall information
  const brandywineStatus = getHallStatus(brandywineData?.periods ?? []);
  const anteateryStatus = getHallStatus(anteateryData?.periods ?? []);

  const brandywineDishes =
    brandywineData?.periods.flatMap((period) =>
      period.stations.flatMap((station) =>
        station.dishes.map(
          (dish) =>
            ({
              ...dish,
              restaurant: "brandywine",
              stationName: station.name,
            }) satisfies DishDataRestaurantStation as DishDataRestaurantStation,
        ),
      ),
    ) ?? [];

  const anteateryDishes =
    anteateryData?.periods.flatMap((period) =>
      period.stations.flatMap((station) =>
        station.dishes.map(
          (dish) =>
            ({
              ...dish,
              restaurant: "anteatery",
              stationName: station.name,
            }) satisfies DishDataRestaurantStation as DishDataRestaurantStation,
        ),
      ),
    ) ?? [];

  // Popular Today
  const allDishes = [...brandywineDishes, ...anteateryDishes];
  const popularDishes = getPopularDishes(allDishes, 5);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Typography className="text-2xl sm:text-3xl font-bold" gutterBottom>
          See what's on the menu today!
        </Typography>

        {/* ── Dining Halls ── */}
        <section>
          <Typography className="text-2xl font-bold mb-4" color="primary">
            Dining Halls
          </Typography>
          <div className="grid grid-cols-2 gap-12">
            <DiningHallCard
              href="/brandywine"
              src="/brandywine.webp"
              alt="Brandywine dining hall"
              name="Brandywine"
              location="Middle Earth Community"
              statusText={brandywineStatus.statusText}
              isLoading={isLoading}
              imageClassName="object-cover object-bottom"
            />
            <DiningHallCard
              href="/anteatery"
              src="/anteatery.webp"
              alt="Anteatery dining hall"
              name="Anteatery"
              location="Mesa Court"
              statusText={anteateryStatus.statusText}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* ── Popular Today ── */}
        <section>
          <Typography className="text-xl font-bold mb-4" color="primary">
            Popular Today
          </Typography>
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                <Box
                  key={key}
                  className="flex-shrink-0 w-44 h-52 rounded-xl animate-pulse bg-zinc-100 dark:bg-zinc-700"
                />
              ))}
            </div>
          ) : popularDishes.length === 0 ? (
            <Typography color="text.secondary">
              No dishes available today.
            </Typography>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {popularDishes.map((dish, idx) => (
                <PopularDishCard
                  key={`${dish.id}-${idx}`}
                  dish={dish}
                  restaurant={dish.restaurant}
                  stationName={dish.stationName}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Upcoming Events ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Typography className="text-xl font-bold" color="primary">
              Upcoming Events
            </Typography>
            <Link href="/events" className="flex items-center gap-1">
              <Typography variant="body2" color="primary">
                See More
              </Typography>
              <ChevronRight color="primary" className="w-4 h-4" />
            </Link>
          </div>
          {isLoading && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["s1", "s2", "s3", "s4"].map((key) => (
                <Box
                  key={key}
                  className="flex-shrink-0 w-64 h-48 rounded-xl animate-pulse bg-zinc-100 dark:bg-zinc-700"
                  sx={{ bgcolor: "background.paper" }}
                />
              ))}
            </div>
          )}
          {!isLoading && events && events.length === 0 && (
            <Typography color="text.secondary">No upcoming events.</Typography>
          )}
          {events && events.length > 0 && (
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
    </Box>
  );
}

function MobileHome(): React.JSX.Element {
  const { selectedDate } = useDate();
  const today = selectedDate ?? new Date();

  const { data: brandywineData, isLoading: brandywineIsLoading } =
    trpc.restaurant.useQuery(
      { date: today, restaurant: "brandywine" },
      { staleTime: 2 * 60 * 60 * 1000 },
    );

  const { data: anteateryData, isLoading: anteateryIsLoading } =
    trpc.restaurant.useQuery(
      { date: today, restaurant: "anteatery" },
      { staleTime: 2 * 60 * 60 * 1000 },
    );

  const isLoading = brandywineIsLoading || anteateryIsLoading;

  const { data: events } = trpc.event.upcoming.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Get hall information
  const brandywineStatus = getHallStatus(brandywineData?.periods);
  const anteateryStatus = getHallStatus(anteateryData?.periods);

  const brandywineDishes =
    brandywineData?.periods.flatMap((period) =>
      period.stations.flatMap((station) =>
        station.dishes.map(
          (dish) =>
            ({
              ...dish,
              restaurant: "brandywine",
              stationName: station.name,
            }) satisfies DishDataRestaurantStation as DishDataRestaurantStation,
        ),
      ),
    ) ?? [];

  const anteateryDishes =
    anteateryData?.periods.flatMap((period) =>
      period.stations.flatMap((station) =>
        station.dishes.map(
          (dish) =>
            ({
              ...dish,
              restaurant: "anteatery",
              stationName: station.name,
            }) satisfies DishDataRestaurantStation as DishDataRestaurantStation,
        ),
      ),
    ) ?? [];

  // Popular Today
  const allDishes = [...brandywineDishes, ...anteateryDishes];
  const popularDishes = getPopularDishes(allDishes, 3);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {/* ── Dining Halls ── */}
        <section>
          <Typography className="text-1xl font-bold mb-2" color="primary">
            Dining Halls
          </Typography>
          <div className="space-y-3">
            <DiningHallCard
              href="/brandywine"
              src="/brandywine.webp"
              alt="Brandywine dining hall"
              name="Brandywine"
              location="Middle Earth Community"
              statusText={brandywineStatus.statusText}
              isLoading={isLoading}
              compact
              imageClassName="object-cover object-bottom"
            />
            <DiningHallCard
              href="/anteatery"
              src="/anteatery.webp"
              alt="Anteatery dining hall"
              name="Anteatery"
              location="Mesa Court"
              statusText={anteateryStatus.statusText}
              isLoading={isLoading}
              compact
            />
          </div>
        </section>

        {/* Popular Today */}
        <section>
          <Typography
            className="text-1xl sm:text-3xl font-bold"
            color="primary"
          >
            Popular Today
          </Typography>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                <Box
                  key={key}
                  className="flex-shrink-0 w-44 h-52 rounded-xl animate-pulse"
                  sx={{ bgcolor: "background.paper" }}
                />
              ))}
            </div>
          ) : popularDishes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No dishes available today.
            </Typography>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {popularDishes.map((dish, idx) => (
                <PopularDishCard
                  key={`${dish.id}-${idx}`}
                  dish={dish}
                  stationName={dish.stationName}
                  restaurant={dish.restaurant}
                  compact={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Typography
              className="text-1xl sm:text-3xl font-bold"
              color="primary"
            >
              Upcoming Events
            </Typography>
            <Link href="/events" className="flex items-center gap-1">
              <Typography variant="body2" color="primary">
                See More
              </Typography>
              <ChevronRight color="primary" style={{ fontSize: 16 }} />
            </Link>
          </div>
          {!events || events.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No upcoming events.
            </Typography>
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
    </Box>
  );
}
