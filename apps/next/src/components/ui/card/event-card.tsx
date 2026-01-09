"use client";

import React from "react";
import { HallEnum } from "@/utils/types";
import { dateToString, toTitleCase } from "@/utils/funcs";
import { Dialog, Card, CardContent, Drawer, Box } from "@mui/material";
import Image from "next/image";
import EventDialogContent from "../event-dialog-content";
import OngoingBadge from "../ongoing-badge";
import { Clock, MapPinned } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import EventDrawerContent from "../event-drawer-content";

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
    <Box ref={ref} {...divProps}>
      <Card
        sx={{
          cursor: "pointer",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
            pt: 3,
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "300px", md: "200px" },
              height: "auto",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Image
              src={props.imgSrc}
              alt={props.alt}
              width={300}
              height={200}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              height: "100%",
              flex: 1,
            }}
            id="event-card-content"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box component="strong" sx={{ fontSize: "1.5rem" }}>
                {props.name}
              </Box>
              {props.isOngoing && <OngoingBadge />}
            </Box>

            <Box
              sx={{
                color: "#a1a1aa",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0.5, sm: 2 },
              }}
              id="event-card-subheader"
            >
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <Clock style={{ stroke: "#a1a1aa" }} size={20} />
                <Box component="p" sx={{ m: 0 }}>
                  {dateToString(props.startTime, props.endTime)}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <MapPinned size={20} />
                <Box component="p" sx={{ m: 0 }}>
                  {toTitleCase(HallEnum[props.location])}
                </Box>
              </Box>
            </Box>

            <Box component="p" sx={{ maxWidth: "36rem", m: 0 }}>
              {props.shortDesc}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
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
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isDesktop)
    return (
      <>
        <EventCardContent props={props} onClick={handleOpen} />
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
          sx={{
            "& .MuiDrawer-paper": {
              maxHeight: "90vh",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <EventDrawerContent {...props} />
        </Drawer>
      </>
    );
}
