"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import type { EventInfo } from "./card/event-card";

interface MobileCalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  filteredEvents: EventInfo[];
  onSelectEventDay: (date: Date, events: EventInfo[]) => void;
  onOpenMonthPicker: () => void;
}

const MobileCalendarView = ({
  currentDate,
  onDateChange,
  filteredEvents,
  onSelectEventDay,
  onOpenMonthPicker,
}: MobileCalendarViewProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onDateChange(addMonths(currentDate, 1));
    }
    if (isRightSwipe) {
      onDateChange(subMonths(currentDate, 1));
    }
  };

  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);

  const daysList = Array.from({ length: 42 }).map((_, index) =>
    addDays(startDate, index),
  );

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter((event) => {
      return isSameDay(new Date(event.start), date);
    });
  };

  return (
    <div
      className="flex flex-col flex-1 px-4 mt-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between mb-6 px-2 w-full max-w-sm mx-auto">
        <ArrowBackIosIcon
          className="cursor-pointer text-slate-800 dark:text-zinc-200"
          fontSize="small"
          onClick={() => onDateChange(subMonths(currentDate, 1))}
        />
        <button
          type="button"
          className="text-2xl font-bold text-sky-700 dark:text-sky-400 focus:outline-none"
          onClick={onOpenMonthPicker}
        >
          {format(currentDate, "MMMM yyyy")} <span className="text-sm">▼</span>
        </button>
        <ArrowForwardIosIcon
          className="cursor-pointer text-slate-800 dark:text-zinc-200"
          fontSize="small"
          onClick={() => onDateChange(addMonths(currentDate, 1))}
        />
      </div>

      <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center w-full max-w-sm mx-auto pb-10">
        {weekDays.map((day) => (
          <div
            key={`header-${day}`}
            className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2"
          >
            {day.slice(0, 1)}
          </div>
        ))}
        {daysList.map((date, _idx) => {
          const eventsOnDay = getEventsForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const hasEvents = eventsOnDay.length > 0;

          return (
            <button
              type="button"
              key={`day-${date.toISOString()}`}
              onClick={() => {
                if (hasEvents) {
                  onSelectEventDay(date, eventsOnDay);
                }
              }}
              className={`flex flex-col items-center relative aspect-square justify-center text-sm ${
                isCurrentMonth
                  ? "text-slate-900 dark:text-zinc-100"
                  : "text-slate-300 dark:text-zinc-600"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  hasEvents ? "bg-sky-100 dark:bg-sky-900" : ""
                }`}
              >
                {format(date, "d")}
              </div>
              {hasEvents && (
                <div className="absolute -bottom-3 flex space-x-0.5">
                  {eventsOnDay.slice(0, 3).map((event) => (
                    <div
                      key={`${event.title}-${String(event.start)}-${event.restaurantId || event.location}`}
                      className="w-1.5 h-1.5 rounded-full bg-sky-700 dark:bg-sky-400"
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCalendarView;
