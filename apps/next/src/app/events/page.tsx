"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GridOnIcon from "@mui/icons-material/GridOn";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { trpc } from "@/utils/trpc";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, Drawer } from "@mui/material";
import moment from "moment";
import EventCard, { type EventInfo } from "@/components/ui/card/event-card";
import EventDialogContent from "@/components/ui/event-dialog-content";
import EventDrawerContent from "@/components/ui/event-drawer-content";
import EventCardSkeleton from "@/components/ui/skeleton/event-card-skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getEventType } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";

const Events = () => {
  const localizer = momentLocalizer(moment);
  const [selectedDiningHall, setSelectedDiningHall] = useState<
    "both" | "anteatery" | "brandywine"
  >("both");
  const [selectedEventType, setSelectedEventType] = useState<
    "both" | "special" | "celebration"
  >("both");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const now = new Date();

  const {
    data: upcomingEvents,
    isLoading,
    error,
  } = trpc.event.upcoming.useQuery();

  // Sort events by start date
  const sortedEvents =
    upcomingEvents?.length > 0
      ? upcomingEvents.sort(
          (a: any, b: any) =>
            new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
      : [];

  const filteredEvents = sortedEvents.filter((event: any) => {
    const matchesDiningHall =
      selectedDiningHall === "both" ||
      (selectedDiningHall === "anteatery" &&
        event.restaurantId === "anteatery") ||
      (selectedDiningHall === "brandywine" &&
        event.restaurantId === "brandywine");
    const matchesEventType =
      selectedEventType === "both" ||
      getEventType(event.title) === selectedEventType;
    return matchesDiningHall && matchesEventType;
  });

  const calendarEvents = filteredEvents.map((event: any) => ({
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    resource: event,
    allDay: true,
  }));

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedEventData, setSelectedEventData] = useState<EventInfo | null>(
    null,
  );

  const handleSelectEvent = (calendarEvent: any) => {
    const resource = calendarEvent.resource;
    setSelectedEventData({
      name: resource.title,
      shortDesc: resource.shortDescription,
      longDesc: resource.longDescription,
      imgSrc: resource.image,
      alt: resource.title + " promotion image",
      startTime: resource.start,
      endTime: resource.end,
      location: resource.restaurantId,
      isOngoing: resource.start <= now && resource.end >= now,
    });
  };

  const handleClose = () => setSelectedEventData(null);

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
            <p className="text-zinc-600 mt-1 font-medium">
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
                    ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800"
                    : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50"
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
                    ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800"
                    : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50"
                }`}
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
                    onClick={() => setSelectedEventType("both")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedEventType === "both"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
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
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
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
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
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
                    onClick={() => setSelectedDiningHall("both")}
                    className={`!px-4 !py-1 flex items-center justify-center !normal-case !text-sm !font-thin ${
                      selectedDiningHall === "both"
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
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
                        ? "!bg-sky-700 !text-white !border-sky-700 hover:!bg-sky-800 hover:!text-white"
                        : "!bg-white !border-sky-700 !text-slate-900 hover:!bg-sky-50 hover:!text-slate-900"
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
          {/* GRID DISPLAY: Map over the fetched events once loaded */}
          {!isLoading && !error && viewMode === "grid" && (
            <>
              <p className="text-sm text-zinc-700">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 max-w-10xl">
                {filteredEvents.map((event: any): any => (
                  <EventCard
                    key={`${event.title}|${event.start.toISOString()}|${event.restaurantId}`}
                    name={event.title}
                    imgSrc={event.image}
                    alt={`${event.title} promotion image.`}
                    startTime={event.start}
                    endTime={event.end}
                    location={
                      event.restaurantId === "anteatery"
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

          {/* CALENDAR DISPLAY: Map over the fetched events once loaded */}
          {!isLoading && !error && viewMode === "calendar" && (
            <div className="border-2 border-sky-700 p-4 rounded-lg">
              <div className="text-center">
                <span className="inline-block mb-6 text-3xl text-sky-700 font-medium">
                  February 2026
                </span>
              </div>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                date={now}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                defaultView="month"
                views={["month"]}
                toolbar={false}
                selectable
                onSelectEvent={handleSelectEvent}
              />
            </div>
          )}

          {/* DESKTOP MODAL */}
          {isDesktop && (
            <Dialog
              open={Boolean(selectedEventData)}
              onClose={handleClose}
              maxWidth={false}
              slotProps={{
                paper: {
                  sx: {
                    width: "570px",
                    maxWidth: "90vw",
                    borderRadius: "6px",
                    overflow: "hidden",
                  },
                },
              }}
            >
              {selectedEventData && (
                <EventDialogContent
                  alt={selectedEventData.alt}
                  imgSrc={selectedEventData.imgSrc}
                  startTime={selectedEventData.startTime}
                  endTime={selectedEventData.endTime}
                  name={selectedEventData.name}
                  location={selectedEventData.location}
                  longDesc={selectedEventData.longDesc}
                  shortDesc={selectedEventData.shortDesc}
                  key={
                    selectedEventData.startTime +
                    "|" +
                    selectedEventData.endTime
                  }
                  isOngoing={selectedEventData.isOngoing}
                />
              )}
            </Dialog>
          )}

          {/* MOBILE DRAWER */}
          {!isDesktop && (
            <Drawer
              anchor="bottom"
              open={Boolean(selectedEventData)}
              onClose={handleClose}
              sx={{
                "& .MuiDrawer-paper": {
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  height: "auto",
                },
              }}
            >
              {selectedEventData && (
                <EventDrawerContent {...selectedEventData} />
              )}
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
