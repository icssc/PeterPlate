"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GridOnIcon from "@mui/icons-material/GridOn";
import Button from "@mui/material/Button";
import type { SelectChangeEvent } from "@mui/material/Select";
import CalendarView from "@/components/ui/calendar-view";
import EventCard, { type EventInfo } from "@/components/ui/card/event-card";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import { HallEnum } from "@/utils/types";

interface DesktopEventsViewProps {
  isDesktop: boolean;
  selectedDiningHall: "both" | "anteatery" | "brandywine";
  handleLocationChange: (
    event: SelectChangeEvent<"both" | "anteatery" | "brandywine">,
  ) => void;
  viewMode: "grid" | "calendar";
  setViewMode: (mode: "grid" | "calendar") => void;
  selectedEventType: "both" | "special" | "celebration";
  setSelectedEventType: (type: "both" | "special" | "celebration") => void;
  isLoading: boolean;
  error: Error | null;
  filteredEvents: EventInfo[];
  calendarEvents: {
    title: string;
    start: Date;
    end: Date;
    resource: EventInfo;
    allDay: boolean;
  }[];
  currentDate: Date;
  selectedEventData: EventInfo | null;
  handleSelectEvent: (calendarEvent: { resource: EventInfo }) => void;
  handleClose: () => void;
  viewPreviousMonthsEvents: () => void;
  viewNextMonthsEvents: () => void;
  now: Date;
}

const DesktopEventsView = ({
  isDesktop,
  selectedDiningHall,
  handleLocationChange,
  viewMode,
  setViewMode,
  selectedEventType,
  setSelectedEventType,
  isLoading,
  error,
  filteredEvents,
  calendarEvents,
  currentDate,
  selectedEventData,
  handleSelectEvent,
  handleClose,
  viewPreviousMonthsEvents,
  viewNextMonthsEvents,
  now,
}: DesktopEventsViewProps) => {
  const _locationFormControlClasses =
    "mt-1.5 w-40 sm:w-[180px] [&_.MuiOutlinedInput-root]:min-h-[38px] [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:text-[0.9rem] [&_.MuiOutlinedInput-root]:text-slate-900 [&_.MuiOutlinedInput-notchedOutline]:border-sky-700 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-sky-800 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-sky-700";
  const _locationSelectClasses =
    "[&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!pl-3 [&_.MuiSelect-select]:!pr-[30px] [&_.MuiSelect-icon]:right-2 [&_.MuiSelect-icon]:text-sky-700";

  return (
    <div className="max-w-full h-screen">
      <div className="fixed top-0 left-0 w-full h-16 bg-sky-700/30 dark:bg-sky-900/40 z-0" />
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <div
          className="flex flex-col gap-4 justify-center w-full p-5 pt-16 sm:px-12 sm:py-8 sm:pt-20"
          id="event-scroll"
        >
          <div>
            <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400">
              Dining Hall Events
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
              Join us for special events and celebrations hosted at your local
              dining halls!
            </p>
            <div className="flex gap-2 mt-3 items-center">
              <span className="text-sm font-medium text-slate-900">View:</span>

              {/* Grid View Button */}
              <Button
                onClick={() => setViewMode("grid")}
                variant="outlined"
                size="small"
                className={`!px-4 !py-1 flex items-center justify-center !normal-case ${
                  viewMode === "grid"
                    ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500"
                    : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700"
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
                    ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500"
                    : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700"
                }`}
              >
                <CalendarTodayIcon className="mr-1" sx={{ fontSize: 18 }} />
                Calendar View
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-8 w-full bg-sky-100 dark:bg-zinc-900/50 border dark:border-zinc-800 rounded-lg p-5 pb-8 mt-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-900 dark:text-zinc-200">
                  Event Type
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedEventType("both")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedEventType === "both"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700"
                    }`}
                  >
                    All Events
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedEventType("special")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedEventType === "special"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500 hover:!text-white"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700 hover:!text-slate-900"
                    }`}
                  >
                    Special Meals
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedEventType("celebration")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedEventType === "celebration"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500 hover:!text-white"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700 hover:!text-slate-900"
                    }`}
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
                    onClick={() =>
                      handleLocationChange({ target: { value: "both" } })
                    }
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "both"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500 hover:!text-white"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700 hover:!text-slate-900"
                    }`}
                  >
                    All Locations
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleLocationChange({ target: { value: "brandywine" } })
                    }
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "brandywine"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500 hover:!text-white"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700 hover:!text-slate-900"
                    }`}
                  >
                    Brandywine
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleLocationChange({ target: { value: "anteatery" } })
                    }
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "anteatery"
                        ? "!bg-sky-700 dark:!bg-sky-400 !text-white !border-sky-700 dark:!border-sky-400 hover:!bg-sky-800 dark:hover:!bg-sky-500 hover:!text-white"
                        : "!bg-white dark:!bg-zinc-800 !border-sky-700 dark:!border-sky-400 !text-slate-900 dark:!text-zinc-100 hover:!bg-sky-50 dark:hover:!bg-zinc-700 hover:!text-slate-900"
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
              <p className="text-sm text-zinc-700 dark:text-zinc-400">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </p>

              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={`${event.title}-${String(event.start)}-${event.restaurantId || event.location}`}
                    name={event.title}
                    imgSrc={event.image || event.imgSrc}
                    alt={`${event.title} promotion image.`}
                    startTime={event.start || event.startTime}
                    endTime={event.end || event.endTime}
                    location={
                      event.restaurantId === "anteatery" ||
                      event.location === HallEnum.ANTEATERY
                        ? HallEnum.ANTEATERY
                        : HallEnum.BRANDYWINE
                    }
                    shortDesc={event.shortDescription}
                    longDesc={event.longDescription}
                    isOngoing={event.start <= now && event.end >= now}
                  />
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <p className="text-center text-zinc-700 py-5">
                  No events found :(
                </p>
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

export default DesktopEventsView;
