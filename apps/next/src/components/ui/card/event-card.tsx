"use client";

import { Clock, MapPinned } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { dateToString, toTitleCase } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import Image from "next/image";
import EventDialogContent from "../event-dialog-content";
import EventDrawerContent from "../event-drawer-content";
import OngoingBadge from "../ongoing-badge";
import { Card, CardContent } from "../shadcn/card";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";

/**
 * Defines the structure for event information used by event-related components.
 */
export interface EventInfo {
  /** The name or title of the event. */
  name: string;
  /** A brief, one-sentence description of the event, displayed on the card. */
  shortDesc: string;
  /** A detailed description of the event, displayed in the full dialog. */
  longDesc: string;
  /** The URL or path to the event's image, used on the card. */
  imgSrc: string;
  /** The alt text for the event's image, for accessibility. */
  alt: string;
  /** The start date and time of the event. */
  startTime: Date;
  /** The end date and time of the event. */
  endTime: Date;
  /** The physical location of the event, from {@link HallEnum}. */
  location: HallEnum;
  /** If true, indicates the event is currently ongoing and displays a badge. */
  isOngoing: boolean;
}

/**
 * Props for the {@link EventCardContent} component.
 */
interface EventCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The event data object ({@link EventInfo}) to display within the card. */
  props: EventInfo;
}

/**
 * `EventCardContent` is an internal component that renders the visual content of an event card.
 * It's designed to be wrapped by a `DialogTrigger` to open the full event details.
 *
 * This component displays the event's image, name, a short description, and its time and location.
 * It also conditionally renders an {@link OngoingBadge}.
 *
 * @private
 * @param {EventCardContentProps} componentProps - The properties object passed to the component.
 * @param {EventInfo} componentProps.props - The core event data ({@link EventInfo}), nested under the 'props' key of `componentProps`.
 * @param {React.Ref<HTMLDivElement>} ref - A ref forwarded to the root `div` element,
 * allowing {@link DialogTrigger} to correctly attach its behavior.
 * @returns {JSX.Element} The rendered event card content.
 */
const EventCardContent = React.forwardRef<
  HTMLDivElement,
  EventCardContentProps
>(({ props, ...divProps }, ref) => {
  return (
    <div ref={ref} {...divProps}>
      <Card className="cursor-pointer hover:shadow-lg transition">
        <CardContent className="flex items-center h-full w-full pt-6 gap-3 flex-wrap">
          <Image
            src={props.imgSrc}
            alt={props.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full sm:w-[300px] md:w-[200px] h-auto rounded-sm"
          />
          <div className="flex flex-col gap-1 h-full" id="event-card-content">
            <div className="flex flex-row gap-2">
              <strong className="text-2xl">{props.name}</strong>
              {props.isOngoing && <OngoingBadge />}
            </div>
            <div
              className="text-zinc-400 flex flex-col sm:flex-row gap-x-4 gap-y-1"
              id="event-card-subheader"
            >
              <div className="flex gap-1">
                <Clock className="stroke-zinc-400" />
                <p>{dateToString(props.startTime, props.endTime)}</p>
              </div>
              <div className="flex gap-1">
                <MapPinned />
                <p>{toTitleCase(HallEnum[props.location])}</p>
              </div>
            </div>
            <p className="max-w-xl">{props.shortDesc}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

EventCardContent.displayName = "EventCardContent";

/**
 * A Client Component that renders an interactive event card.
 * Clicking the card opens a dialog with full event details.
 *
 * This component combines an `EventCardContent` (the visual card) with a
 * `Dialog` and {@link EventDialogContent} (the full event details dialog).
 *
 * @param {EventInfo} props - The event data to be displayed. See {@link EventInfo} for detailed property descriptions.
 * @returns {JSX.Element} A React component representing an event card.
 */
export default function EventCard(props: EventInfo): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <EventCardContent props={props} />
        </DialogTrigger>
        <EventDialogContent {...props} />
      </Dialog>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <EventCardContent props={props} />
        </DrawerTrigger>
        <EventDrawerContent {...props} />
      </Drawer>
    );
}
