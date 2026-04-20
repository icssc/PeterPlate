"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuIcon from "@mui/icons-material/Menu";
import { FormControl, MenuItem, Select } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import { HallEnum } from "@/utils/types";
import type { EventInfo } from "./card/event-card";
import EventDrawerContent from "./event-drawer-content";
import MobileCalendarView from "./mobile-calendar-view";
import MobileListView from "./mobile-list-view";
import MonthPickerDrawer from "./month-picker-drawer";

interface MobileEventsViewProps {
  selectedDiningHall: "both" | "anteatery" | "brandywine";
  handleLocationChange: (event: unknown) => void;
  isLoading: boolean;
  error: Error | null;
  filteredEvents: EventInfo[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedEventData: EventInfo | null;
  handleSelectEvent: (calendarEvent: { resource: EventInfo }) => void;
  handleClose: () => void;
}

const MobileEventsView = ({
  selectedDiningHall,
  handleLocationChange,
  isLoading,
  error,
  filteredEvents,
  currentDate,
  setCurrentDate,
  selectedEventData,
  handleSelectEvent,
  handleClose,
}: MobileEventsViewProps) => {
  const [mobileView, setMobileView] = useState<"calendar" | "list">("calendar");
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const locationFormControlClasses =
    "w-36 [&_.MuiOutlinedInput-root]:h-[38px] [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:text-[0.9rem] [&_.MuiOutlinedInput-root]:text-slate-900 [&_.MuiOutlinedInput-notchedOutline]:border-sky-700 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-sky-800 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-2 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-sky-700";
  const locationSelectClasses =
    "[&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!pl-3 [&_.MuiSelect-select]:!pr-6 [&_.MuiSelect-icon]:right-1 [&_.MuiSelect-icon]:text-sky-700";

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-zinc-950 overflow-hidden font-sans">
      {/* HEADER */}
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

          {/* View Toggle */}
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

      {/* CONTENT */}
      {!isLoading &&
        !error &&
        (mobileView === "calendar" ? (
          <MobileCalendarView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            filteredEvents={filteredEvents}
            onSelectEventDay={(_date, eventsForDay) => {
              // Expand day behavior could either show list or directly a drawer if 1 item.
              // Assuming it jumps to list view mapped to that day, or opens a modal.
              // For now we pass the first event to the standard details drawer logic.
              if (eventsForDay.length > 0) {
                // Re-wrap to expected resource structure
                const evt = { resource: eventsForDay[0] };
                handleSelectEvent(evt);
              }
            }}
            onOpenMonthPicker={() => setMonthPickerOpen(true)}
          />
        ) : (
          <MobileListView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            filteredEvents={filteredEvents}
            onOpenMonthPicker={() => setMonthPickerOpen(true)}
            onSelectEvent={(evtInfo) =>
              handleSelectEvent({ resource: evtInfo })
            }
          />
        ))}

      {/* Month Picker Drawer */}
      <MonthPickerDrawer
        open={monthPickerOpen}
        onClose={() => setMonthPickerOpen(false)}
        currentDate={currentDate}
        onSelectMonth={(year, monthIndex) => {
          setCurrentDate(new Date(year, monthIndex, 1));
          setMonthPickerOpen(false);
        }}
      />

      {/* Event Details Drawer */}
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
        {selectedEventData && <EventDrawerContent {...selectedEventData} />}
      </Drawer>
    </div>
  );
};

export default MobileEventsView;
