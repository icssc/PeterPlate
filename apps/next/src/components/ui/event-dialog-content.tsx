import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import Image from "next/image";
import type { JSX } from "react/jsx-runtime";
import { dateToString, generateGCalLink, toTitleCase } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import type { EventInfo } from "./card/event-card";
import { Button } from "./shadcn/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./shadcn/dialog";

/**
 * `EventDialogContent` renders the detailed view of an event within a dialog.
 * It displays the event's image, name, date/time, location, a long description,
 * and a button to add the event to Google Calendar.
 *
 * This component is typically used as the content for a `Dialog` triggered by an {@link EventCard}.
 * @param {EventInfo} props - The event data to display. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the event dialog.
 */
export default function EventDialogContent(props: EventInfo): JSX.Element {
  return (
    <DialogContent>
      <DialogHeader>
        <Image
          src={props.imgSrc}
          alt={props.alt}
          width={600}
          height={600}
          className="w-full h-48 object-cover"
        />
      </DialogHeader>
      <div className="px-6">
        <DialogTitle className="mb-1">{props.name}</DialogTitle>
        <div
          className="flex gap-2 text-zinc-400 items-center mb-2"
          id="event-card-subheader"
        >
          <AccessTimeOutlinedIcon fontSize="small" />
          <p>{dateToString(props.startTime, props.endTime)}</p>
          <PinDropOutlinedIcon fontSize="small" />
          <p>{toTitleCase(HallEnum[props.location])}</p>
        </div>
        <DialogDescription className="mb-8">{props.longDesc}</DialogDescription>
        <div className="w-full flex items-center justify-center">
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
            <Button className="[&_svg]:size-5">
              <CalendarTodayOutlinedIcon />
              Add to Google Calendar
            </Button>
          </a>
        </div>
      </div>
    </DialogContent>
  );
}
