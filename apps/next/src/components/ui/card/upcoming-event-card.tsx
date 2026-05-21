import { AccessTime, CalendarMonth, LocationOn } from "@mui/icons-material";
import { Box, Card, Dialog, Typography } from "@mui/material";
import type { Event } from "@peterplate/validators";
import { useState } from "react";
import { classifyEvent } from "@/utils/classifyEvent";
import { timeToString, toTitleCase } from "@/utils/funcs";
import { numToMonth } from "@/utils/types";
import EventDialogContent from "../event-dialog-content";
import EventTypeBadge from "../event-type-badge";

/** A compact card for an upcoming event in the horizontal scroll row */
export default function UpcomingEventCard({
  event,
  compact = false,
}: {
  event: Event;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const eventType = classifyEvent(event.title, event.description);

  // alternative sizing depending on mobile/desktop
  const titleSize = compact ? "text-sm" : "text-base";
  const iconSize = compact ? 16 : 24;
  const spacing = compact ? "space-y-1" : "space-y-2";

  return (
    <>
      <Card
        className="relative w-full rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent"
        onClick={() => setOpen(true)}
      >
        <div className="absolute top-2 right-0 h-14 w-48 scale-75 origin-top-right">
          <div className="hidden md:block [&>span]:!bg-sky-100 [&>span]:!text-sky-700 [&>span]:!shadow-sm dark:[&>span]:!bg-blue-300/20 dark:[&>span]:!text-blue-300">
            <EventTypeBadge type={eventType} />
          </div>
        </div>
        <div className="mb-3 flex items-start gap-2 min-w-0 pr-0 md:pr-28">
          <h3
            className={`${titleSize} line-clamp-2 min-w-0 flex-1 whitespace-normal break-words font-bold leading-tight text-sky-700 dark:text-blue-300`}
          >
            {event.title}
          </h3>
        </div>
        <div className={spacing}>
          {event.start && (
            <>
              <Box className="flex items-center gap-1.5">
                <CalendarMonth style={{ fontSize: iconSize }} />
                <Typography variant="caption" color="text.secondary">
                  {numToMonth[event.start.getMonth()]} {event.start.getDate()},{" "}
                  {event.start.getFullYear()}
                </Typography>
              </Box>
              <Box className="flex items-center gap-1.5">
                <AccessTime style={{ fontSize: iconSize }} />
                <Typography variant="caption" color="text.secondary">
                  {timeToString(event.end)}
                  {event.end ? ` - ${timeToString(event.end)}` : ""}
                </Typography>
              </Box>
            </>
          )}
          <Box className="flex items-center gap-1.5">
            <LocationOn style={{ fontSize: iconSize }} />
            <Typography variant="caption" color="text.secondary">
              {toTitleCase(event.restaurantId)}
            </Typography>
          </Box>
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
