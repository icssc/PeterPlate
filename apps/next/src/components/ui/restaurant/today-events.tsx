import { Typography } from "@mui/material";
import type { Event } from "@peterplate/validators";
import { endOfDay, startOfDay } from "date-fns";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/** Cards for this hall's events happening today, shown above the hours. */
export function TodayEvents({ events }: { events: Event[] }) {
  const now = new Date();
  const todayEvents = events
    .map((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      // Some events have no end time (it arrives as the Unix epoch)
      return { event, start, end: end > start ? end : null };
    })
    .filter(
      ({ start, end }) =>
        start <= endOfDay(now) && (end ?? start) >= startOfDay(now),
    );

  if (todayEvents.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {todayEvents.map(({ event, start, end }) => (
        <div
          key={`${event.title}-${String(event.start)}`}
          // Stays light in dark mode too, per the Figma
          className="flex items-center gap-2 rounded-lg bg-pink-100 py-2.5 pl-1.5 pr-3 dark:bg-pink-200"
        >
          <span
            aria-hidden="true"
            className="w-1 self-stretch rounded-full bg-pink-600"
          />
          <Typography
            variant="body2"
            component="span"
            className="shrink-0 rounded-lg bg-pink-300 px-2.5 py-1.5 !text-gray-900"
          >
            Today
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            className="grow !text-gray-900"
          >
            {event.title}
          </Typography>
          <div className="shrink-0 text-right">
            <Typography variant="body2" className="!text-gray-900">
              {formatTime(start)}
            </Typography>
            {end && (
              <Typography variant="body2" className="!text-gray-900">
                {formatTime(end)}
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
