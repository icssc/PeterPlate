import { AccessTime, CalendarMonth, LocationOn } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { timeToString, toTitleCase } from "@/utils/funcs";
import { HallEnum, numToMonth } from "@/utils/types";
import EventDialogContent from "../event-dialog-content";
import type { EventInfo } from "./event-card";

/** A compact card for an upcoming event in the horizontal scroll row */
export default function UpcomingEventCard({
  event,
  compact = false,
}: {
  event: {
    title: string;
    image?: string | null;
    shortDescription?: string | null;
    longDescription?: string | null;
    start?: Date | null;
    end?: Date | null;
    restaurantId: string;
  };
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const startDate = event.start ? new Date(event.start) : null;
  const endDate = event.end ? new Date(event.end) : null;

  /*

    Seems to be an error where HallEnum is not properly getting the info

  */
  // Map DB event to EventInfo shape for the dialog component
  const hallEnum =
    event.restaurantId.toLowerCase() === "anteatery"
      ? HallEnum.ANTEATERY
      : HallEnum.BRANDYWINE;

  const eventInfo: EventInfo = {
    name: event.title,
    shortDesc: event.shortDescription ?? "",
    longDesc: event.longDescription ?? "",
    imgSrc: event.image ?? "/zm-card-header.webp",
    alt: `${event.title} event image`,
    startTime: startDate ?? new Date(),
    endTime: endDate ?? new Date(),
    location: hallEnum,
    isOngoing: startDate
      ? startDate <= new Date() && (endDate ? endDate >= new Date() : false)
      : false,
  };

  // alternative sizing depending on mobile/desktop
  const titleSize = compact ? "text-sm" : "text-base";
  const iconSize = compact ? 16 : 24;
  const tagSize = compact ? "text-[8px]" : "text-[10px]";
  const spacing = compact ? "space-y-1" : "space-y-2";

  return (
    <>
      <button
        type="button"
        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent"
        onClick={() => setOpen(true)}
      >
        <div className="flex min-w-[150px] items-start justify-between mb-3">
          <h3
            className={`${titleSize} font-bold text-sky-700 leading-tight pr-2`}
          >
            {event.title}
          </h3>
          <span
            className={`flex-shrink-0 ${tagSize} font-semibold uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 px-2 py-0.5 rounded-full`}
          >
            Celebration
          </span>
        </div>
        <div className={spacing}>
          {startDate && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <CalendarMonth style={{ fontSize: iconSize }} />
                <span>
                  {numToMonth[startDate.getMonth()]} {startDate.getDate()},{" "}
                  {startDate.getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <AccessTime style={{ fontSize: iconSize }} />
                <span>
                  {timeToString(startDate)}
                  {endDate ? ` - ${timeToString(endDate)}` : ""}
                </span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <LocationOn style={{ fontSize: iconSize }} />
            <span>{toTitleCase(event.restaurantId)}</span>
          </div>
        </div>
      </button>
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
        <EventDialogContent {...eventInfo} />
      </Dialog>
    </>
  );
}
