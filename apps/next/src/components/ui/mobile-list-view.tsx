"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { format, isSameDay, startOfDay } from "date-fns";
import { useMemo, useRef } from "react";
import type { EventInfo } from "./card/event-card";
import MobileListEventRow from "./mobile-list-event-row";

interface MobileListViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  filteredEvents: EventInfo[];
  onOpenMonthPicker: () => void;
  onSelectEvent: (event: EventInfo) => void;
}

interface DayGroup {
  date: Date;
  events: EventInfo[];
}

interface MonthGroup {
  key: string;
  date: Date;
  days: DayGroup[];
}

const MobileListView = ({
  filteredEvents,
  onOpenMonthPicker,
  onSelectEvent,
}: MobileListViewProps) => {
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const monthGroups = useMemo<MonthGroup[]>(() => {
    const sorted = [...filteredEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    const months: Record<string, MonthGroup> = {};
    sorted.forEach((event) => {
      const start = new Date(event.start);
      const monthKey = format(start, "yyyy-MM");
      if (!months[monthKey]) {
        months[monthKey] = { key: monthKey, date: start, days: [] };
      }
      const dayKey = format(startOfDay(start), "yyyy-MM-dd");
      const existingDay = months[monthKey].days.find(
        (d) => format(d.date, "yyyy-MM-dd") === dayKey,
      );
      if (existingDay) {
        existingDay.events.push(event);
      } else {
        months[monthKey].days.push({ date: start, events: [event] });
      }
    });

    return Object.values(months).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [filteredEvents]);

  const scrollToMonth = (offset: number) => (currentKey: string) => {
    const idx = monthGroups.findIndex((m) => m.key === currentKey);
    const target = monthGroups[idx + offset];
    if (target) {
      monthRefs.current[target.key]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goPrev = scrollToMonth(-1);
  const goNext = scrollToMonth(1);

  return (
    <div className="flex flex-col flex-1 px-4 mt-2 mb-20 overflow-y-auto">
      {monthGroups.length === 0 ? (
        <p className="text-center text-zinc-500 py-10">No upcoming events.</p>
      ) : (
        monthGroups.map((month) => (
          <div
            key={month.key}
            ref={(el) => {
              monthRefs.current[month.key] = el;
            }}
            className="flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 py-2">
              <div className="bg-[#CCE1EE] dark:bg-sky-950 rounded-2xl px-4 py-4 w-full mx-auto">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-xl sm:text-2xl font-bold text-sky-700 dark:text-sky-400 focus:outline-none flex items-center gap-2"
                    onClick={onOpenMonthPicker}
                  >
                    {format(month.date, "MMMM yyyy")}{" "}
                    <span className="text-xs sm:text-sm">▼</span>
                  </button>
                  <div className="flex items-center gap-5">
                    <ArrowBackIosIcon
                      className="cursor-pointer text-slate-500 dark:text-zinc-400 focus:outline-none"
                      fontSize="small"
                      onClick={() => goPrev(month.key)}
                    />
                    <ArrowForwardIosIcon
                      className="cursor-pointer text-slate-500 dark:text-zinc-400 focus:outline-none"
                      fontSize="small"
                      onClick={() => goNext(month.key)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-2 mb-4">
              {month.days.map((day) => {
                const isToday = isSameDay(day.date, new Date());
                return (
                  <div
                    key={day.date.toISOString()}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-black dark:text-zinc-100">
                        {format(day.date, "EEEE - MMMM d, yyyy")}
                      </h3>
                      {isToday && (
                        <span className="bg-sky-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0 border-l-[3px] border-sky-700 dark:border-sky-500 ml-1">
                      {day.events.map((event, idx) => (
                        <MobileListEventRow
                          key={`${event.title}-${String(event.start)}-${event.restaurantId || idx}`}
                          event={event}
                          onClick={() => onSelectEvent(event)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MobileListView;
