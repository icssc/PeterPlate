import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Box } from "@mui/material";
import type { Event } from "@peterplate/validators";
import Image from "next/image";
import EventTypeBadge from "@/components/ui/event-type-badge";
import { timeToString, toTitleCase } from "@/utils/funcs";

/**
 * `EventDrawerContent` renders the detailed view of an event within a drawer (mobile view).
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Drawer` triggered by an {@link EventCard} on mobile.
 * @param {EventInfo} props - The event data to display. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event drawer.
 */
export default function EventDrawerContent(props: Event): React.JSX.Element {
  return (
    <Box>
      <div className="relative">
        <Image
          src={props.image}
          alt={`An image for an event "${props.title}" at ${props.restaurantId}.`}
          width={600}
          height={600}
          className="w-full object-contain"
        />
        <EventTypeBadge title={props.title} />
      </div>
      <Box sx={{ padding: "20px 24px 24px" }} className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-sky-700 leading-tight">
          {props.title}
        </h2>
        <div className="flex flex-col gap-2 text-sm text-zinc-500 mt-1">
          <div className="flex gap-2 items-center">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {props.start.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>
              {timeToString(props.start)} – {timeToString(props.end)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <PinDropOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{toTitleCase(props.restaurantId)}</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-2">
          {props.description.replace(/\u00A0+/g, " ")}
        </p>
      </Box>
    </Box>
  );
}
