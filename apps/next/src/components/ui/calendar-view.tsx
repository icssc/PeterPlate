"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import type { Event } from "@peterplate/validators";
import {
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar,
  type DateHeaderProps,
  dateFnsLocalizer,
} from "react-big-calendar";
import EventDialogContent from "./event-dialog-content";
import EventDrawerContent from "./event-drawer-content";
// @ts-expect-error
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TODAY_CLASSES =
  "rounded-full bg-sky-700 text-white dark:bg-blue-300 dark:text-gray-900";

/** The date number in each cell. Today also gets a "Today" pill. */
const DateHeader = ({ date, label, onDrillDown }: DateHeaderProps) => {
  const today = isToday(date);

  return (
    <div className={today ? "flex items-center justify-between" : ""}>
      {today && (
        <span
          className={`${TODAY_CLASSES} px-2.5 text-xs font-semibold leading-5`}
        >
          Today
        </span>
      )}
      <button
        type="button"
        className={`rbc-button-link ${today ? `${TODAY_CLASSES} size-6` : ""}`}
        onClick={onDrillDown}
      >
        {label}
      </button>
    </div>
  );
};

interface CalendarViewProps {
  isDesktop: boolean;
  viewMode: string;
  isLoading?: boolean;
  error?: any;
  currentDate: Date;
  availableMonths: { year: number; monthIndex: number }[];
  calendarEvents: any[];
  selectedEventData: any | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectEvent: (event: any) => void;
  onCloseDetails: () => void;
}

const CalendarView = ({
  isDesktop,
  viewMode,
  isLoading,
  error,
  currentDate,
  availableMonths,
  calendarEvents,
  selectedEventData,
  onPreviousMonth,
  onNextMonth,
  onSelectEvent,
  onCloseDetails,
}: CalendarViewProps) => {
  if (isLoading || error || viewMode !== "calendar") return null;

  // Tracks the days that have events so that the events tour can point to one
  const eventDays = new Set(
    calendarEvents.map((event) => event.start.toDateString()),
  );
  const dayPropGetter = (date: Date) =>
    eventDays.has(date.toDateString()) ? { className: "tour-event-day" } : {};
  const eventPropGetter = (event: Pick<Event, "start" | "end">) =>
    isSameDay(event.start, event.end) ? {} : { className: "multi-day-event" };

  // Only page between the first and last months that have events
  const monthStart = startOfMonth(currentDate);
  const firstMonth = availableMonths[0];
  const lastMonth = availableMonths[availableMonths.length - 1];
  const atFirstMonth =
    !firstMonth ||
    !isAfter(monthStart, new Date(firstMonth.year, firstMonth.monthIndex));
  const atLastMonth =
    !lastMonth ||
    !isBefore(monthStart, new Date(lastMonth.year, lastMonth.monthIndex));

  return (
    <div className="border border-sky-700 dark:border-blue-300 p-4 rounded-lg bg-white dark:bg-surface-scroll transition-colors events-calendar-wrapper">
      {/* CUSTOM TOOLBAR */}
      <div className="flex items-center justify-center">
        <div className="text-center flex items-center justify-center text-sky-700 dark:text-blue-300 font-medium">
          <ArrowBackIosIcon
            className={`mb-6 mr-4 ${
              atFirstMonth ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={atFirstMonth ? undefined : onPreviousMonth}
          />
          <span className="inline-block mb-6 text-3xl">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <ArrowForwardIosIcon
            className={`mb-6 ml-4 ${
              atLastMonth ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={atLastMonth ? undefined : onNextMonth}
          />
        </div>
      </div>

      {/* MAIN CALENDAR */}
      <div className="dark:[&_.rbc-header]:!border-zinc-700">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          date={currentDate}
          onNavigate={() => {}}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView="month"
          views={["month"]}
          toolbar={false}
          selectable
          onSelectEvent={onSelectEvent}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          formats={{ dateFormat: "d" }}
          components={{ month: { dateHeader: DateHeader } }}
        />
      </div>

      {/* DESKTOP MODAL */}
      {isDesktop && (
        <Dialog
          open={Boolean(selectedEventData)}
          onClose={onCloseDetails}
          maxWidth="sm"
          PaperProps={{
            sx: {
              bgcolor: "background.paper",
              width: "570px",
              maxWidth: "90vw",
              margin: 2,
              padding: 0,
              borderRadius: "6px",
              overflow: "hidden",
            },
          }}
        >
          {selectedEventData && (
            <EventDialogContent
              {...selectedEventData}
              key={`${selectedEventData.startTime}|${selectedEventData.endTime}`}
              onClose={onCloseDetails}
            />
          )}
        </Dialog>
      )}

      {/* MOBILE DRAWER */}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={Boolean(selectedEventData)}
          onClose={onCloseDetails}
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
      )}
    </div>
  );
};

export default CalendarView;
