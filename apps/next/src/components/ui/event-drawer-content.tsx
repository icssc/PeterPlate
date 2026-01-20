import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import Image from "next/image";
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
            <AccessTimeOutlinedIcon />
            <p>{dateToString(props.startTime, props.endTime)}</p>
          </div>
          <div className="flex gap-1">
            <PinDropOutlinedIcon />
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
              <CalendarTodayOutlinedIcon />
              Add to Google Calendar
            </Button>
          </a>
        </div>
      </div>
    </DrawerContent>
  );
}
