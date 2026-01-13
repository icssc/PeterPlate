import { DialogContent } from "./shadcn/dialog";
import { EventInfo } from "./card/event-card";
import { DialogHeader, DialogTitle, DialogDescription } from "./shadcn/dialog";
import Image from "next/image";
import { CalendarPlus, Clock, MapPinned } from "lucide-react";
import { Button } from "./shadcn/button";
import { HallEnum } from "@/utils/types";
import { toTitleCase, dateToString, generateGCalLink } from "@/utils/funcs";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./shadcn/drawer";

export default function EventDrawerContent(props: EventInfo) {
  return (
    <DrawerContent>
      <DrawerHeader>
        <Image
          src={props.imgSrc}
          alt={props.alt}
          width={600}
          height={600}
          className="w-full h-48 object-cover"
        />
      </DrawerHeader>
      <div className="px-6">
        <DrawerTitle className="mb-1 text-2xl">{props.name}</DrawerTitle>
        <div
          className="text-zinc-400 flex flex-col sm:flex-row gap-x-4 gap-y-1 pb-4"
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
        <DrawerDescription className="mb-8 whitespace-normal">
          {props.longDesc?.replace(/\u00A0+/g, " ")}
        </DrawerDescription>
        <div className="w-full flex items-center justify-center pb-6">
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
              <CalendarPlus />
              Add to Google Calendar
            </Button>
          </a>
        </div>
      </div>
    </DrawerContent>
  );
}
