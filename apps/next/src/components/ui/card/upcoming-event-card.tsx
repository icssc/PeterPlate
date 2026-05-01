import { AccessTime, CalendarMonth, LocationOn } from "@mui/icons-material";
import { Box, Card, Dialog, Typography } from "@mui/material";
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
      <Card
        className="w-full rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent"
        sx={{ border: 1, borderColor: "divider" }}
        onClick={() => setOpen(true)}
      >
        <div className="mb-3 flex items-start gap-2 min-w-0">
          <Typography
            className={`${titleSize} font-bold leading-tight pr-2 line-clamp-2 min-w-0 flex-1 whitespace-normal break-normal`}
            color="primary"
          >
            {event.title}
          </Typography>
          <span
            className={`flex-shrink-0 ${tagSize} font-semibold tracking-wider bg-sky-100 text-sky-700 dark:bg-transparent dark:border dark:border-blue-300 dark:text-blue-300 px-2 py-0.5 rounded-full`}
          >
            Celebration
          </span>
        </div>
        <div className={spacing}>
          {startDate && (
            <>
              <Box className="flex items-center gap-1.5">
                <CalendarMonth style={{ fontSize: iconSize }} />
                <Typography variant="caption" color="text.secondary">
                  {numToMonth[startDate.getMonth()]} {startDate.getDate()},{" "}
                  {startDate.getFullYear()}
                </Typography>
              </Box>
              <Box className="flex items-center gap-1.5">
                <AccessTime style={{ fontSize: iconSize }} />
                <Typography variant="caption" color="text.secondary">
                  {timeToString(startDate)}
                  {endDate ? ` - ${timeToString(endDate)}` : ""}
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
        <EventDialogContent {...eventInfo} />
      </Dialog>
    </>
  );
}
