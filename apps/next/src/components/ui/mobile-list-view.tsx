"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { addMonths, format, isSameDay, startOfDay, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import type { EventInfo } from "./card/event-card";

interface MobileListViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  filteredEvents: EventInfo[];
  onOpenMonthPicker: () => void;
  onSelectEvent: (event: EventInfo) => void;
}

const MobileListView = ({
  currentDate,
  onDateChange,
  filteredEvents,
  onOpenMonthPicker,
  onSelectEvent,
}: MobileListViewProps) => {
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

  const groupedEvents = useMemo(() => {
    // Sort events just in case
    const sorted = [...filteredEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    const groups: { [key: string]: { date: Date; events: EventInfo[] } } = {};
    sorted.forEach((event) => {
      const dateKey = format(startOfDay(new Date(event.start)), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = { date: new Date(event.start), events: [] };
      }
      groups[dateKey].events.push(event);
    });

    // Extract grouped arrays, sort chronologically
    return Object.values(groups).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [filteredEvents]);

  const monthLabel = format(currentDate, "MMMM yyyy");

  return (
    <div
      className="flex flex-col flex-1 px-4 mt-2 mb-20 overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Scrollable Month Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur py-2">
        <div className="bg-[#CCE1EE] dark:bg-sky-950 rounded-2xl px-4 py-4 w-full mx-auto">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xl sm:text-2xl font-bold text-sky-700 dark:text-sky-400 focus:outline-none flex items-center gap-2"
              onClick={onOpenMonthPicker}
            >
              {monthLabel} <span className="text-xs sm:text-sm">▼</span>
            </button>
            <div className="flex items-center gap-5">
              <ArrowBackIosIcon
                className="cursor-pointer text-slate-500 dark:text-zinc-400 focus:outline-none"
                fontSize="small"
                onClick={() => onDateChange(subMonths(currentDate, 1))}
              />
              <ArrowForwardIosIcon
                className="cursor-pointer text-slate-500 dark:text-zinc-400 focus:outline-none"
                fontSize="small"
                onClick={() => onDateChange(addMonths(currentDate, 1))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {groupedEvents.length === 0 ? (
          <p className="text-center text-zinc-500 py-10">
            No events this month.
          </p>
        ) : (
          groupedEvents.map((group) => {
            const isToday = isSameDay(group.date, new Date());

            return (
              <div
                key={group.date.toISOString()}
                className="flex flex-col gap-3"
              >
                {/* Date Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-black dark:text-zinc-100">
                    {format(group.date, "EEEE - MMMM d, yyyy")}
                  </h3>
                  {isToday && (
                    <span className="bg-sky-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </div>

                {/* Day's Events */}
                <div className="flex flex-col gap-0 border-l-[3px] border-sky-700 dark:border-sky-500 ml-1">
                  {group.events.map((event, idx) => {
                    const startStr = format(new Date(event.start), "h:mm a");
                    const endStr = format(new Date(event.end), "h:mm a");
                    const locationLabel =
                      event.restaurantId === "anteatery"
                        ? "Anteatery"
                        : "Brandywine";

                    return (
                      <button
                        type="button"
                        key={`${event.title}-${String(event.start)}-${event.restaurantId || idx}`}
                        className="flex flex-row justify-between items-center py-2 px-3 text-left hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors border-b last:border-0 border-slate-100 dark:border-zinc-800 w-full"
                        onClick={() => onSelectEvent(event)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-black dark:text-zinc-200">
                            {event.title}
                          </span>
                          <span className="text-gray-500 flex items-center mt-0.5">
                            <LocationOnOutlinedIcon
                              sx={{ fontSize: 14 }}
                              className="mr-0.5"
                            />
                            {locationLabel}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-sm text-black dark:text-zinc-400">
                          <span>{startStr}</span>
                          <span>{endStr}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MobileListView;
