import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Box, Button, DialogContent, Typography } from "@mui/material";
import Image from "next/image";
import type React from "react";
import EventTypeBadge from "@/components/ui/event-type-badge";
import { generateGCalLink, dateToString, timeToString, toTitleCase } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import type { EventInfo } from "./card/event-card";

/**
 * `EventDialogContent` renders the detailed view of an event within a dialog.
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Dialog` triggered by an {@link EventCard}.
 * @param {EventInfo} props - The event data to display. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event dialog.
 */
export default function EventDialogContent(
  props: EventInfo,
): React.JSX.Element {
  return (
    <Box className="dark:bg-[#303035]">
      <div className="relative">
        <Image
          src={props.imgSrc}
          alt={props.alt}
          width={600}
          height={600}
          className="w-full object-contain"
        />
        <EventTypeBadge title={props.name} />
      </div>
      <DialogContent
        sx={{ padding: "20px 24px 24px !important" }}
        className="flex flex-col gap-2"
      >
        <Typography
          fontWeight={600}
          color="primary"
          className="leading-tight tracking-normal text-left"
          sx={{ fontSize: "1.875rem" }}
        >
          {props.name}
        </Typography>
        <Box
          className="flex flex-wrap gap-x-2 gap-y-1 items-center text-zinc-500 dark:text-zinc-400"
          id="event-card-subheader"
        >
          <div className="flex gap-1 items-center whitespace-nowrap">
            <AccessTimeOutlinedIcon fontSize="small" />
            <p>{dateToString(props.startTime, props.endTime)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {timeToString(props.startTime)} – {timeToString(props.endTime)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <PinDropOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{toTitleCase(HallEnum[props.location])}</span>
          </div>
        </Box>
        <Typography
          variant="body2"
          className="leading-relaxed mt-2"
          color="text.primary"
        >
          {props.longDesc}
        </Typography>
        <div className="w-full flex items-center justify-center pt-4">
          <a
            href={generateGCalLink(
              props.name,
              props.longDesc,
              props.location,
              props.startTime,
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
