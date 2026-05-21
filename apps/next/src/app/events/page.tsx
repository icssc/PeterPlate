"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GridOnIcon from "@mui/icons-material/GridOn";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
// @ts-expect-error: big-calendar import error always, for some reason
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Event } from "@peterplate/validators";
import { addMonths, subMonths } from "date-fns";
import CalendarView from "@/components/ui/calendar-view";
import EventCard from "@/components/ui/card/event-card";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  classifyEvent,
  EVENT_CATEGORIES,
  type EventCategory,
} from "@/utils/classifyEvent";

const Events = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState<
    "both" | "anteatery" | "brandywine"
  >("both");
  const [selectedEventType, setSelectedEventType] = useState<
    "both" | EventCategory
  >("both");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedEventData, setSelectedEventData] = useState<Event | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: events, isLoading, error } = trpc.event.upcoming.useQuery();
  // TODO: Add inBetween here when route is complete
  // } = trpc.event.inBetween.useQuery({
  //   after: startOfMonth(currentDate),
  //   before: endOfMonth(currentDate),
  // });

  const sortedEvents =
    (events?.length ?? -1 > 0)
      ? events?.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
      : [];

  const eventsWithType =
    sortedEvents?.map((event) => ({
      ...event,
      eventType: classifyEvent(event.title, event.description),
    })) ?? [];

  const filteredEvents = eventsWithType.filter((event) => {
    const matchesDiningHall =
      selectedDiningHall === "both" ||
      (selectedDiningHall === "anteatery" &&
        event.restaurantId === "anteatery") ||
      (selectedDiningHall === "brandywine" &&
        event.restaurantId === "brandywine");
    const matchesEventType =
      selectedEventType === "both" || event.eventType === selectedEventType;
    return matchesDiningHall && matchesEventType;
  });

  const calendarEvents = filteredEvents?.map((event) => ({
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    resource: event,
    allDay: true,
  }));

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSelectEvent = (calendarEvent: any) => {
    const resource = calendarEvent.resource;
    setSelectedEventData({
      ...resource,
    });
  };

  const handleClose = () => setSelectedEventData(null);

  const viewNextMonthsEvents = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const viewPreviousMonthsEvents = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="max-w-full h-screen ">
      <div className="fixed top-0 left-0 w-full h-16 bg-sky-700/30 dark:bg-blue-900/40 z-0" />
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <div
          className="flex flex-col gap-4 justify-center w-full p-5 pt-16 sm:px-12 sm:py-8 sm:pt-20"
          id="event-scroll"
        >
          <div>
            <Typography className="text-4xl font-bold" color="primary">
              Dining Hall Events
            </Typography>
            <Typography color="text.primary" className="mt-1 font-medium">
              Join us for special events and celebrations hosted at your local
              dining halls!
            </Typography>
            <div className="flex gap-2 mt-3 items-center">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                View:
              </span>

              {/* Grid View Button */}
              <Button
                onClick={() => setViewMode("grid")}
                variant="outlined"
                size="small"
                className={`!px-4 !py-1 flex items-center justify-center !normal-case ${
                  viewMode === "grid"
                    ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                    : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
                }`}
              >
                <GridOnIcon className="mr-1" sx={{ fontSize: 18 }} />
                Grid View
              </Button>

              {/* Calendar View Button */}
              <Button
                onClick={() => setViewMode("calendar")}
                variant="outlined"
                size="small"
                className={`!px-4 !py-1 flex items-center justify-center !normal-case ${
                  viewMode === "calendar"
                    ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                    : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
                }`}
              >
                <CalendarTodayIcon className="mr-1" sx={{ fontSize: 18 }} />
                Calendar View
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-8 w-full bg-[#cce1ee] dark:bg-[#434e5d] border dark:border-zinc-700 rounded-lg p-5 pb-8 mt-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Event Type
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedEventType("both")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedEventType === "both"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
                    }`}
                  >
                    All Events
                  </Button>
                  {EVENT_CATEGORIES.map((category) => {
                    const isSelected = selectedEventType === category;

                    return (
                      <Button
                        key={category}
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedEventType(category)}
                        className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                          isSelected
                            ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500"
                            : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700"
                        }`}
                      >
                        {category}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Location
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDiningHall("both")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "both"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
                    }`}
                  >
                    All Locations
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDiningHall("brandywine")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "brandywine"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
                    }`}
                  >
                    Brandywine
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDiningHall("anteatery")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "anteatery"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 dark:!bg-blue-300 dark:!text-gray-900 dark:!border-blue-300 dark:hover:!bg-blue-400"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 dark:!bg-transparent dark:!border-blue-300 dark:!text-white dark:hover:!bg-zinc-700"
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
          {/* GRID DISPLAY: Map over the fetched events once loaded */}
          {!isLoading && !error && viewMode === "grid" && (
            <>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </Typography>

              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                {filteredEvents?.map((event) => (
                  <EventCard
                    key={`${event.title}-${event.start}-${event.restaurantId}`}
                    {...event}
                  />
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  className="text-center py-5"
                >
                  No events found :(
                </Typography>
              )}
            </>
          )}

          {/* CALENDAR DISPLAY */}
          {!isLoading && !error && viewMode === "calendar" && (
            <CalendarView
              isDesktop={isDesktop}
              viewMode={viewMode}
              isLoading={isLoading}
              error={error}
              currentDate={currentDate}
              calendarEvents={calendarEvents ?? []}
              selectedEventData={selectedEventData}
              onPreviousMonth={viewPreviousMonthsEvents}
              onNextMonth={viewNextMonthsEvents}
              onSelectEvent={handleSelectEvent}
              onCloseDetails={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
