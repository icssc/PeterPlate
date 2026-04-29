"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  isToday,
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
      <div className="bg-[#0069A833] dark:bg-sky-950 rounded-2xl px-3 py-4 w-full mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="text-xl sm:text-2xl font-bold text-sky-700 dark:text-sky-400 focus:outline-none flex items-center gap-2"
            onClick={onOpenMonthPicker}
          >
            {format(currentDate, "MMMM yyyy")}{" "}
            <span className="text-xs sm:text-sm">▼</span>
          </button>
          <div className="flex items-center gap-5">
            <ArrowBackIosIcon
              className="cursor-pointer text-slate-500 dark:text-zinc-400"
              fontSize="small"
              onClick={() => onDateChange(subMonths(currentDate, 1))}
            />
            <ArrowForwardIosIcon
              className="cursor-pointer text-slate-500 dark:text-zinc-400"
              fontSize="small"
              onClick={() => onDateChange(addMonths(currentDate, 1))}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-x-1 text-center">
          {weekDays.map((day) => (
            <div
              key={`header-${day}`}
              className="text-xs font-semibold text-slate-800 dark:text-zinc-300"
            >
              {day.slice(0, 1)}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-6 gap-x-1 text-center w-full pb-10">
        {daysList.map((date, _idx) => {
          const eventsOnDay = getEventsForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const hasEvents = eventsOnDay.length > 0;
          const isCurrentDate = isToday(date);

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
              {isCurrentDate && (
                <div className="absolute left-1/2 -translate-x-1/2 top-2 -bottom-6 w-10 rounded-lg bg-[#CCE1EE] dark:bg-sky-950 z-0" />
              )}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  isCurrentDate ? "font-semibold" : ""
                }`}
              >
                {format(date, "d")}
              </div>
              {hasEvents && (
                <div className="absolute z-10 -bottom-3 flex space-x-0.5">
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
