import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Box, Button, DialogContent, Typography } from "@mui/material";
import type { Event } from "@peterplate/validators";
import Image from "next/image";
import type React from "react";
import EventTypeBadge from "@/components/ui/event-type-badge";
import type { EventCategory } from "@/utils/classifyEvent";
import {
  dateToString,
  generateGCalLink,
  timeToString,
  toTitleCase,
} from "@/utils/funcs";
import { HallEnum } from "@/utils/types";

/**
 * `EventDialogContent` renders the detailed view of an event within a dialog.
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Dialog` triggered by an {@link EventCard}.
 * @param {Event} props - The event data to display. See {@link Event} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event dialog.
 */
// TODO: Add buttons to add to Google (see generateGCalLink), Apple Calendar, stream for calendar
export default function EventDialogContent(
  props: Event & { type: EventCategory },
): React.JSX.Element {
  return (
    <Box className="dark:bg-[#303035]">
      <div className="relative">
        <Image
          src={props.image}
          alt={`An image for an event "${props.title}" at ${props.restaurantId}.`}
          width={600}
          height={600}
          className="w-full object-contain"
        />
        <EventTypeBadge type={props.type} />
      </div>
      <DialogContent
        sx={{ padding: "20px 24px 24px !important" }}
        className="flex flex-col gap-2 dark:bg-zinc-800 dark:text-zinc-400"
      >
        <Typography
          fontWeight={600}
          color="primary"
          className="leading-tight tracking-normal text-left"
          sx={{ fontSize: "1.875rem" }}
        >
          {props.title}
        </Typography>
        <Box
          className="flex flex-wrap gap-x-2 gap-y-1 items-center text-zinc-500 dark:text-zinc-400"
          id="event-card-subheader"
        >
          <div className="flex gap-1 items-center whitespace-nowrap">
            <AccessTimeOutlinedIcon fontSize="small" />
            <p>{dateToString(props.start, props.end)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {timeToString(props.start)} - {timeToString(props.end)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <PinDropOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{toTitleCase(props.restaurantId)}</span>
          </div>
        </Box>
        <Typography
          variant="body2"
          className="leading-relaxed mt-2"
          color="text.primary"
        >
          {props.description}
        </Typography>
        <div className="w-full flex items-center justify-center pt-4">
          <a
            href={generateGCalLink(
              props.title,
              props.description,
              props.restaurantId === "brandywine"
                ? HallEnum.BRANDYWINE
                : HallEnum.ANTEATERY,
              props.start,
            )}
            rel="noreferrer"
            target="_blank"
          >
            <Button
              variant="contained"
              className="[&_svg]:size-5 whitespace-nowrap"
              startIcon={<CalendarTodayOutlinedIcon />}
            >
              Add to Google Calendar
            </Button>
          </a>
        </div>
      </DialogContent>
    </Box>
  );
}
