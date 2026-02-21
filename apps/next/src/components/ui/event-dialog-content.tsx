import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Button, DialogContent } from "@mui/material";
import Image from "next/image";
import type React from "react";
import EventTypeBadge from "@/components/ui/event-type-badge";
import { generateGCalLink, timeToString, toTitleCase } from "@/utils/funcs";
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
    <>
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
        className="flex flex-col gap-2 dark:bg-zinc-800 dark:text-zinc-400"
      >
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
        <p className="text-sm leading-relaxed mt-2">{props.longDesc}</p>
      </DialogContent>
    </>
  );
}
