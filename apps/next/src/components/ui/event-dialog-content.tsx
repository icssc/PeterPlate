import { DialogContent, Button } from "@mui/material";
import { EventInfo } from "./card/event-card";
import Image from "next/image";
import { CalendarPlus, Clock, MapPinned } from "lucide-react";
import { HallEnum } from "@/utils/types";
import { toTitleCase, dateToString, generateGCalLink } from "@/utils/funcs";
import React from "react";

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
      <Image
        src={props.imgSrc}
        alt={props.alt}
        width={600}
        height={600}
        className="w-full h-auto max-h-64 object-cover"
      />
      <DialogContent
        sx={{ padding: "20px 24px 24px !important" }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-semibold leading-tight tracking-normal text-left">
          {props.name}
        </h2>
        <div
          className="flex flex-wrap gap-x-2 gap-y-1 text-zinc-400 items-center"
          id="event-card-subheader"
        >
          <div className="flex gap-1 items-center whitespace-nowrap">
            <Clock className="stroke-zinc-400" size={20} />
            <p>{dateToString(props.startTime, props.endTime)}</p>
          </div>
          <div className="flex gap-1 items-center whitespace-nowrap">
            <MapPinned className="stroke-zinc-400" size={20} />
            <p>{toTitleCase(HallEnum[props.location])}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-2">{props.longDesc}</p>
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
              startIcon={<CalendarPlus />}
            >
              Add to Google Calendar
            </Button>
          </a>
        </div>
      </DialogContent>
    </>
  );
}
