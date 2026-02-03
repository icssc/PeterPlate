"use client";

import EventCard from "@/components/ui/card/event-card";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import MealDivider from "@/components/ui/meal-divider";
import MealDividerSkeleton from "@/components/ui/skeleton/meal-divider-skeleton";
import { trpc } from "@/utils/trpc";
import { HallEnum } from "@/utils/types";
import Image from "next/image";

export default function Events() {
  // Destructure the result from useQuery
  const {
    data: upcomingEvents,
    isLoading,
    error,
  } = trpc.event.upcoming.useQuery();

  // Sort events by start time if data is available
  const sortedEvents = upcomingEvents
    ? [...upcomingEvents].sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    })
    : [];

  const now = new Date();
  const endOfWeek = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7;
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  const eventsThisWeek = sortedEvents.filter((event) => {
    const eventStartDate = new Date(event.start);
    return eventStartDate >= now && eventStartDate <= endOfWeek;
  });

  const futureEvents = sortedEvents.filter((event) => {
    const eventStartDate = new Date(event.start);
    return eventStartDate > endOfWeek;
  });

  return (
    <div className="max-w-full h-screen">
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <div className="relative w-full min-h-80 max-h-80">
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-transparent" />
          <Image
            className="object-cover w-full h-full"
            src="/uci.webp"
            alt="An Image of UCI's signage."
            width={2000}
            height={2000}
          />
        </div>
        <div
          className="flex flex-col gap-4 justify-center w-full p-5 sm:px-12 sm:py-8"
          id="event-scroll"
        >
          {/* Show skeletons while loading */}
          {isLoading && (
            <>
              <MealDividerSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <MealDividerSkeleton />
              <EventCardSkeleton />
            </>
          )}
          {error && (
            <p className="text-red-500 w-full text-center">
              Error loading data: {error.message}
            </p>
          )}
          {/* Map over the fetched events once loaded */}
          {!isLoading && !error && (
            <>
              <MealDivider title="This Week's Events" />
              {eventsThisWeek.length > 0 &&
                eventsThisWeek.map((event: any) => (
                  <EventCard
                    key={`${event.title}|${event.start.toISOString()}|${event.restaurantId}`}
                    name={event.title}
                    imgSrc={event.image}
                    alt={`${event.title} promotion image.`}
                    startTime={event.start}
                    endTime={event.end}
                    location={
                      event.restaurantId == 3056
                        ? HallEnum.ANTEATERY
                        : HallEnum.BRANDYWINE
                    }
                    shortDesc={event.shortDescription}
                    longDesc={event.longDescription}
                    isOngoing={event.start <= now && event.end >= now}
                  />
                ))}
              {eventsThisWeek.length == 0 && (
                <p className="text-center text-zinc-700 py-5">
                  No events scheduled for this week :(
                </p>
              )}
              <MealDivider title="Upcoming Events" />
              {futureEvents.length > 0 &&
                futureEvents.map((event: any) => (
                  <EventCard
                    key={`${event.title}|${event.start.toISOString()}|${event.restaurantId}`}
                    name={event.title}
                    imgSrc={event.image}
                    alt={`${event.title} promotion image.`}
                    startTime={event.start}
                    endTime={event.end}
                    location={
                      event.restaurantId == 3056
                        ? HallEnum.ANTEATERY
                        : HallEnum.BRANDYWINE
                    }
                    shortDesc={event.shortDescription}
                    longDesc={event.longDescription}
                    isOngoing={event.start <= now && event.end >= now}
                  />
                ))}
              {futureEvents.length == 0 && (
                <p className="text-center text-zinc-700 py-5">
                  No upcoming events found :(
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
