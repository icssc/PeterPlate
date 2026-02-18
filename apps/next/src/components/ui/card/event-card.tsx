"use client";

import { AccessTime, PinDrop } from "@mui/icons-material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Card, CardContent, Dialog, Drawer } from "@mui/material";
import Image from "next/image";
import React from "react";
import EventTypeBadge from "@/components/ui/event-type-badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { dateToString, timeToString, toTitleCase } from "@/utils/funcs";
import { HallEnum } from "@/utils/types";
import EventDialogContent from "../event-dialog-content";
import EventDrawerContent from "../event-drawer-content";
import OngoingBadge from "../ongoing-badge";

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
      <Card
        className="cursor-pointer hover:shadow-lg transition h-full dark:bg-zinc-900 dark:border-zinc-800"
        sx={{ borderRadius: "6px" }}
      >
        <div className="p-7 pb-2 relative">
          <Image
            src={props.imgSrc}
            alt={props.alt}
            width={400}
            height={300}
            className="w-full object-contain"
          />
          <EventTypeBadge title={props.name} />
        </div>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-400">
              {props.name}
            </h3>
            {props.isOngoing && <OngoingBadge />}
          </div>
          <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            <div className="flex gap-3 items-center">
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
              <span>
                {props.startTime.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <AccessTime sx={{ fontSize: 16 }} />
              <span>
                {timeToString(props.startTime)} – {timeToString(props.endTime)}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <PinDrop sx={{ fontSize: 16 }} />
              <span>{toTitleCase(HallEnum[props.location])}</span>
            </div>
          </div>
          <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-2">
            {props.longDesc}
          </p>
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
export default function EventCard(props: EventInfo): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isDesktop)
    return (
      <>
        <EventCardContent props={props} onClick={handleOpen} />
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "background.paper",
                width: "570px",
                maxWidth: "90vw",
                margin: 2,
                padding: 0,
                overflow: "hidden",
                borderRadius: "6px",
              },
            },
          }}
        >
          <EventDialogContent {...props} />
        </Dialog>
      </>
    );
  else
    return (
      <>
        <EventCardContent props={props} onClick={handleOpen} />
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "background.paper",
                maxWidth: "100vw", // ✅ Full width on mobile
                margin: 0, // ✅ Remove side margins
                overflow: "hidden",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            },
          }}
          sx={{
            "& .MuiDrawer-paper": {
              bgcolor: "background.paper",
              maxHeight: "90vh", // ✅ Don't take full screen
              height: "auto",
            },
          }}
        >
          <EventDrawerContent {...props} />
        </Drawer>
      </>
    );
}
