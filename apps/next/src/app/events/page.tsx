"use client";

import type { SelectChangeEvent } from "@mui/material/Select";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";
import type { EventInfo } from "@/components/ui/card/event-card";
import DesktopEventsView from "@/components/ui/desktop-events-view";
import MobileEventsView from "@/components/ui/mobile-events-view";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getEventType } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { HallEnum } from "@/utils/types";

const Events = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState<
    "both" | "anteatery" | "brandywine"
  >("both");
  const [selectedEventType, setSelectedEventType] = useState<
    "both" | "special" | "celebration"
  >("both");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedEventData, setSelectedEventData] = useState<EventInfo | null>(
    null,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const now = new Date();

  const _locationFormControlClasses =
    "mt-1.5 w-40 sm:w-[180px] [&_.MuiOutlinedInput-root]:min-h-[38px] [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:text-[0.9rem] [&_.MuiOutlinedInput-root]:text-slate-900 [&_.MuiOutlinedInput-notchedOutline]:border-sky-700 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-sky-800 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-sky-700";
  const _locationSelectClasses =
    "[&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!pl-3 [&_.MuiSelect-select]:!pr-[30px] [&_.MuiSelect-icon]:right-2 [&_.MuiSelect-icon]:text-sky-700";

  const {
    data: events,
    isLoading,
    error,
  } = trpc.event.inBetween.useQuery({
    after: startOfMonth(currentDate),
    before: endOfMonth(currentDate),
  });

  const sortedEvents =
    events?.length > 0
      ? [...events].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
      : [];

  const filteredEvents = sortedEvents.filter((event) => {
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

  const calendarEvents = filteredEvents.map((event) => ({
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    resource: event,
    allDay: true,
  }));

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleLocationChange = (
    event: SelectChangeEvent<"both" | "anteatery" | "brandywine">,
  ) => {
    setSelectedDiningHall(
      event.target.value as "both" | "anteatery" | "brandywine",
    );
  };

  const handleSelectEvent = (calendarEvent: {
    resource: Record<string, unknown>;
  }) => {
    const resource = calendarEvent.resource;
    setSelectedEventData({
      name: (resource.title as string) || "",
      shortDesc: (resource.shortDescription as string) || "",
      longDesc: (resource.longDescription as string) || "",
      imgSrc: (resource.image as string) || "",
      alt: `${(resource.title as string) || ""} promotion image`,
      startTime: resource.start as Date,
      endTime: resource.end as Date,
      location:
        (resource.restaurantId as string) === "anteatery"
          ? HallEnum.ANTEATERY
          : HallEnum.BRANDYWINE,
      isOngoing:
        (resource.start as Date) <= now && (resource.end as Date) >= now,
      type: getEventType((resource.title as string) || ""),
    });
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

  return isDesktop ? (
    <DesktopEventsView
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      selectedDiningHall={selectedDiningHall}
      setSelectedDiningHall={setSelectedDiningHall}
      selectedEventType={selectedEventType}
      setSelectedEventType={setSelectedEventType}
      viewMode={viewMode}
      setViewMode={setViewMode}
      filteredEvents={filteredEvents}
      calendarEvents={calendarEvents}
      isLoading={isLoading}
      error={error}
      selectedEventData={selectedEventData}
      handleSelectEvent={handleSelectEvent}
      handleClose={handleClose}
      now={now}
      handleLocationChange={handleLocationChange}
      viewNextMonthsEvents={viewNextMonthsEvents}
      viewPreviousMonthsEvents={viewPreviousMonthsEvents}
    />
  ) : (
    <MobileEventsView
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      selectedDiningHall={selectedDiningHall}
      setSelectedDiningHall={setSelectedDiningHall}
      filteredEvents={filteredEvents}
      selectedEventData={selectedEventData}
      isLoading={isLoading}
      error={error}
      handleLocationChange={handleLocationChange}
      viewMode={viewMode}
      setViewMode={setViewMode}
      handleSelectEvent={handleSelectEvent}
      handleClose={handleClose}
      now={now}
    />
  );
};

export default Events;
