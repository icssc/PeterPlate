"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GridOnIcon from "@mui/icons-material/GridOn";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { Event } from "@peterplate/validators";
import { addMonths, subMonths } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import CalendarView from "@/components/ui/calendar-view";
import EventCard from "@/components/ui/card/event-card";
import MobileEventsView from "@/components/ui/mobile-events-view";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  classifyEvent,
  EVENT_CATEGORIES,
  type EventCategory,
} from "@/utils/classifyEvent";
import { trpc } from "@/utils/trpc";
import "react-big-calendar/lib/css/react-big-calendar.css";

/** An event plus the category we derive from its title and description. */
export type EventWithType = Event & { eventType: EventCategory };

const Events = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState<
    "both" | "anteatery" | "brandywine"
  >("both");
  const [selectedEventType, setSelectedEventType] = useState<
    "both" | EventCategory
  >("both");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedEventData, setSelectedEventData] =
    useState<EventWithType | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: events, isLoading, error } = trpc.event.upcoming.useQuery();

  const eventsWithType = useMemo<EventWithType[]>(
    () =>
      [...(events ?? [])]
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((event) => ({
          ...event,
          eventType: classifyEvent(event.title, event.description),
        })),
    [events],
  );

  const matchesFilters = useCallback(
    (event: EventWithType) => {
      const matchesDiningHall =
        selectedDiningHall === "both" ||
        event.restaurantId === selectedDiningHall;
      const matchesEventType =
        selectedEventType === "both" || event.eventType === selectedEventType;
      return matchesDiningHall && matchesEventType;
    },
    [selectedDiningHall, selectedEventType],
  );

  const filteredEvents = useMemo(
    () => eventsWithType.filter(matchesFilters),
    [eventsWithType, matchesFilters],
  );

  // Months that have at least one event, so the mobile month picker only
  // offers months the views can actually show something for.
  const availableMonths = useMemo(() => {
    const seen = new Set<string>();
    const months: { year: number; monthIndex: number }[] = [];
    for (const event of filteredEvents) {
      const year = event.start.getFullYear();
      const monthIndex = event.start.getMonth();
      const key = `${year}-${monthIndex}`;
      if (seen.has(key)) continue;
      seen.add(key);
      months.push({ year, monthIndex });
    }
    return months.sort(
      (a, b) => a.year - b.year || a.monthIndex - b.monthIndex,
    );
  }, [filteredEvents]);

  const calendarEvents = useMemo(
    () =>
      filteredEvents.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        resource: event,
        allDay: true,
      })),
    [filteredEvents],
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleLocationChange = (
    event: SelectChangeEvent<"both" | "anteatery" | "brandywine">,
  ) => {
    setSelectedDiningHall(
      event.target.value as "both" | "anteatery" | "brandywine",
    );
  };

  const handleSelectEvent = (calendarEvent: { resource: EventWithType }) => {
    setSelectedEventData(calendarEvent.resource);
  };

  const handleClose = () => setSelectedEventData(null);

  const viewNextMonthsEvents = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const viewPreviousMonthsEvents = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  if (isDesktop === null) {
    return null; // Return null on initial render until media query state is determined
  }

  if (!isDesktop) {
    return (
      <MobileEventsView
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        selectedDiningHall={selectedDiningHall}
        filteredEvents={filteredEvents}
        filteredUpcomingEvents={filteredEvents}
        selectedEventData={selectedEventData}
        isLoading={isLoading}
        error={error}
        handleLocationChange={handleLocationChange}
        handleSelectEvent={handleSelectEvent}
        handleClose={handleClose}
        availableMonths={availableMonths}
      />
    );
  }

  return (
    <div className="max-w-full h-screen ">
      <div className="fixed top-0 left-0 w-full h-16 bg-sky-700/30 dark:bg-sky-900/40 z-0" />
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
            <div className="flex flex-wrap gap-8 w-full bg-[var(--calendar-today-bg)] dark:bg-[var(--surface-tinted)] border dark:border-zinc-700 rounded-lg p-5 pb-8 mt-4">
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
                {filteredEvents.map((event) => (
                  <EventCard
                    key={`${event.title}-${event.start}-${event.restaurantId}`}
                    {...event}
                    type={event.eventType}
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
              calendarEvents={calendarEvents}
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
