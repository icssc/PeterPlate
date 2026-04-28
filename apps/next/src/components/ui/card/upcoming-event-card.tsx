import { AccessTime, CalendarMonth, LocationOn } from "@mui/icons-material";
import { Card, Dialog } from "@mui/material";
import type { Event } from "@peterplate/validators";
import { useState } from "react";
import { timeToString, toTitleCase } from "@/utils/funcs";
import EventDialogContent from "../event-dialog-content";

/** A compact card for an upcoming event in the horizontal scroll row */
export default function UpcomingEventCard({
  event,
  compact = false,
}: {
  event: Event;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // alternative sizing depending on mobile/desktop
  const titleSize = compact ? "text-sm" : "text-base";
  const iconSize = compact ? 16 : 24;
  const tagSize = compact ? "text-[8px]" : "text-[10px]";
  const spacing = compact ? "space-y-1" : "space-y-2";

  return (
    <>
      <Card
        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent"
        onClick={() => setOpen(true)}
      >
        <div className="mb-3 flex items-start gap-2 min-w-0">
          <h3
            className={`${titleSize} line-clamp-2 min-w-0 flex-1 whitespace-normal break-normal font-bold leading-tight text-sky-700`}
          >
            {event.title}
          </h3>
          {/*           <span
            className={`flex-shrink-0 ${tagSize} font-semibold uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-full`}
          >
            Celebration
          </span> */}
        </div>
        <div className={spacing}>
          {event.start && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <CalendarMonth style={{ fontSize: iconSize }} />
                <span>{event.start.toLocaleDateString("en-US")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <AccessTime style={{ fontSize: iconSize }} />
                <span>
                  {timeToString(event.start)}
                  {event.end.getDate() ? ` - ${timeToString(event.end)}` : ""}
                </span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <LocationOn style={{ fontSize: iconSize }} />
            <span>{toTitleCase(event.restaurantId)}</span>
          </div>
        </div>
      </Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: "460px",
              maxWidth: "90vw",
              margin: 2,
              padding: 0,
              overflow: "hidden",
              borderRadius: "6px",
            },
          },
        }}
      >
        <EventDialogContent {...event} />
      </Dialog>
    </>
  );
}
