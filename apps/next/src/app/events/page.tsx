"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GridOnIcon from "@mui/icons-material/GridOn";
import Button from "@mui/material/Button";
import { useState } from "react";
import EventCard from "@/components/ui/card/event-card";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import { trpc } from "@/utils/trpc";
import { HallEnum } from "@/utils/types";

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

  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredEvents = sortedEvents.filter((event) => {
    if (selectedLocation === "all") return true;
    if (selectedLocation === "anteatery") return event.restaurantId === "3056";
    if (selectedLocation === "brandywine") return event.restaurantId === "3314";
    return true;
  });

  return (
    <div className="max-w-full h-screen">
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <div
          className="flex flex-col gap-4 justify-center w-full p-5 pt-16 sm:px-12 sm:py-8 sm:pt-20"
          id="event-scroll"
        >
          <div>
            <h1 className="text-4xl font-bold text-sky-700">
              Dining Hall Events
            </h1>
            <p className="text-zinc-600 mt-1">
              Join us for special events and celebrations hosted at your local
              dining halls!
            </p>
            <div className="flex gap-2 mt-3 items-center">
              <span className="text-sm font-medium text-slate-900">View:</span>
              <Button
                variant="outlined"
                size="small"
                className="!px-4 !py-1 flex items-center justify-center !bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white !normal-case"
              >
                <GridOnIcon className="mr-1" sx={{ fontSize: 18 }} />
                Grid View
              </Button>
              <Button
                variant="outlined"
                size="small"
                className="!px-4 !py-1 flex items-center justify-center !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900 !normal-case"
              >
                <CalendarTodayIcon className="mr-1" sx={{ fontSize: 18 }} />
                Calendar View
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-8 w-full bg-sky-100 rounded-lg p-5 pb-8 mt-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-900">
                  Event Type
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    size="small"
                    className="!px-4 !py-1 flex items-center justify-center !bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white !normal-case !text-sm !font-thin"
                  >
                    All Events
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className="!px-4 !py-1 flex items-center justify-center !bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900 !normal-case !text-sm !font-thin"
                  >
                    Special Meals
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className="!px-4 !py-1 flex items-center justify-center !bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900 !normal-case !text-sm !font-thin"
                  >
                    Celebration
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-900">
                  Location
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedLocation("all")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedLocation === "all"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
                    }`}
                  >
                    All Locations
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedLocation("brandywine")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedLocation === "brandywine"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
                    }`}
                  >
                    Brandywine
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedLocation("anteatery")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedLocation === "anteatery"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
                    }`}
                  >
                    Anteatery
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Show skeletons while loading */}
          {isLoading && (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
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
              <p className="text-sm text-zinc-700">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 max-w-10xl">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={`${event.title}|${event.start.toISOString()}|${event.restaurantId}`}
                    name={event.title}
                    imgSrc={event.image}
                    alt={`${event.title} promotion image.`}
                    startTime={event.start}
                    endTime={event.end}
                    location={
                      event.restaurantId === "3056"
                        ? HallEnum.ANTEATERY
                        : HallEnum.BRANDYWINE
                    }
                    shortDesc={event.shortDescription}
                    longDesc={event.longDescription}
                    isOngoing={event.start <= now && event.end >= now}
                  />
                ))}
              </div>
              {sortedEvents.length === 0 && (
                <p className="text-center text-zinc-700 py-5">
                  No events found :(
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
