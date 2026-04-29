"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { getEventType } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import type { EventInfo } from "./card/event-card";
import EventDetailsDrawer from "./event-details-drawer";
import MobileCalendarView from "./mobile-calendar-view";
import MobileListView from "./mobile-list-view";
import MonthPickerDrawer from "./month-picker-drawer";

interface MobileEventsViewProps {
  selectedDiningHall: "both" | "anteatery" | "brandywine";
  handleLocationChange: (
    event: SelectChangeEvent<"both" | "anteatery" | "brandywine">,
  ) => void;
  isLoading: boolean;
  error: Error | null;
  filteredEvents: EventInfo[];
  filteredUpcomingEvents: EventInfo[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedEventData: EventInfo | null;
  handleSelectEvent: (calendarEvent: {
    resource: Record<string, unknown>;
  }) => void;
  handleClose: () => void;
  availableMonths: { year: number; monthIndex: number }[];
}

const MobileEventsView = ({
  selectedDiningHall,
  handleLocationChange,
  isLoading,
  error,
  filteredEvents,
  filteredUpcomingEvents,
  currentDate,
  setCurrentDate,
  selectedEventData,
  handleSelectEvent,
  handleClose,
  availableMonths,
}: MobileEventsViewProps) => {
  const [mobileView, setMobileView] = useState<"calendar" | "list">("calendar");
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<EventInfo[]>([]);

  const locationFormControlClasses =
    "w-36 [&_.MuiOutlinedInput-root]:h-[38px] [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:text-[0.9rem] [&_.MuiOutlinedInput-root]:text-slate-900 [&_.MuiOutlinedInput-notchedOutline]:border-sky-700 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-sky-800 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-sky-700";
  const locationSelectClasses =
    "[&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!pl-3 [&_.MuiSelect-select]:!pr-6 [&_.MuiSelect-icon]:right-1 [&_.MuiSelect-icon]:text-sky-700";

  const handleEventDrawerClose = () => {
    handleClose();
    setSelectedDayEvents([]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950 overflow-hidden font-sans">
      <div className="flex flex-col px-4 pt-12 pb-4 bg-white dark:bg-zinc-950 z-20">
        <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400 mb-4">
          Events
        </h1>
        <div className="flex items-center gap-3">
          <FormControl className={locationFormControlClasses}>
            <Select
              id="mobile-location-select"
              className={locationSelectClasses}
              value={selectedDiningHall}
              onChange={handleLocationChange}
            >
              <MenuItem value="both">All Locations</MenuItem>
              <MenuItem value="brandywine">Brandywine</MenuItem>
              <MenuItem value="anteatery">Anteatery</MenuItem>
            </Select>
          </FormControl>

          <div className="flex bg-white dark:bg-zinc-900 border border-sky-700 dark:border-sky-500 rounded-lg overflow-hidden h-[38px]">
            <button
              type="button"
              onClick={() => setMobileView("calendar")}
              className={`px-3 flex items-center justify-center transition-colors ${
                mobileView === "calendar"
                  ? "bg-sky-700 text-white"
                  : "text-sky-700 hover:bg-sky-50 dark:hover:bg-zinc-800"
              }`}
            >
              <CalendarTodayIcon fontSize="small" />
            </button>
            <div className="w-[1px] bg-sky-700 dark:bg-sky-500 h-full" />
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={`px-3 flex items-center justify-center transition-colors ${
                mobileView === "list"
                  ? "bg-sky-700 text-white"
                  : "text-sky-700 hover:bg-sky-50 dark:hover:bg-zinc-800"
              }`}
            >
              <MenuIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700"></div>
        </div>
      )}
      {error && (
        <div className="flex-1 flex flex-col px-4 text-red-500 text-center justify-center">
          <p>Error loading data: {error.message}</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        (mobileView === "calendar" ? (
          <MobileCalendarView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            filteredEvents={filteredEvents}
            onSelectEventDay={(_date, eventsForDay) => {
              if (eventsForDay.length > 0) {
                const now = new Date();
                const mappedEvents = (
                  eventsForDay as unknown as Record<string, unknown>[]
                ).map(
                  (resource) =>
                    ({
                      name: (resource.title as string) || "",
                      shortDesc: (resource.shortDescription as string) || "",
                      longDesc: (resource.longDescription as string) || "",
                      imgSrc: (resource.image as string) || "",
                      alt: `${(resource.title as string) || ""} promotion image`,
                      startTime: new Date(resource.start),
                      endTime: new Date(resource.end),
                      location:
                        (resource.restaurantId as string) === "anteatery"
                          ? HallEnum.ANTEATERY
                          : HallEnum.BRANDYWINE,
                      isOngoing:
                        new Date(resource.start) <= now &&
                        new Date(resource.end) >= now,
                      type: getEventType((resource.title as string) || ""),
                    }) as EventInfo,
                );
                setSelectedDayEvents(mappedEvents);
              }
            }}
            onOpenMonthPicker={() => setMonthPickerOpen(true)}
          />
        ) : (
          <MobileListView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            filteredEvents={filteredUpcomingEvents}
            onOpenMonthPicker={() => setMonthPickerOpen(true)}
            onSelectEvent={(evtInfo) =>
              handleSelectEvent({ resource: evtInfo })
            }
          />
        ))}

      <MonthPickerDrawer
        open={monthPickerOpen}
        onClose={() => setMonthPickerOpen(false)}
        currentDate={currentDate}
        availableMonths={availableMonths}
        onSelectMonth={(year, monthIndex) => {
          setCurrentDate(new Date(year, monthIndex, 1));
          setMonthPickerOpen(false);
        }}
      />

      <EventDetailsDrawer
        selectedEventData={selectedEventData}
        selectedDayEvents={selectedDayEvents}
        onClose={handleEventDrawerClose}
      />
    </div>
  );
};

export default MobileEventsView;
