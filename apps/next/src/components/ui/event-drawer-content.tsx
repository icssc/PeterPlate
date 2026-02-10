import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Box } from "@mui/material";
import Image from "next/image";
import EventTypeBadge from "@/components/ui/event-type-badge";
import { timeToString, toTitleCase } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import type { EventInfo } from "./card/event-card";

/**
 * `EventDrawerContent` renders the detailed view of an event within a drawer (mobile view).
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Drawer` triggered by an {@link EventCard} on mobile.
 * @param {EventInfo} props - The event data to display. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event drawer.
 */
export default function EventDrawerContent(
  props: EventInfo,
): React.JSX.Element {
  return (
    <Box>
      <div className="relative">
        <Image
          src={props.imgSrc}
          alt={props.alt}
          width={600}
          height={600}
          className="w-full h-56 object-cover object-top"
        />
        <EventTypeBadge title={props.name} />
      </div>
      <Box sx={{ padding: "20px 24px 24px" }} className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-sky-700 leading-tight">
          {props.name}
        </h2>
        <div className="flex flex-col gap-2 text-sm text-zinc-500 mt-1">
          <div className="flex gap-2 items-center">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {props.startTime.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
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
        </div>
        <p className="text-sm leading-relaxed mt-2">
          {props.longDesc?.replace(/\u00A0+/g, " ")}
        </p>
      </Box>
    </Box>
  );
}
