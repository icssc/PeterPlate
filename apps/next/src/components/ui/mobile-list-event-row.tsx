"use client";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { format } from "date-fns";
import type { EventInfo } from "./card/event-card";

interface MobileListEventRowProps {
  event: EventInfo;
  onClick: () => void;
}

const ROW_CLASSES = [
  "flex flex-row justify-between items-center",
  "py-2 px-3 text-left w-full",
  "border-b last:border-0 border-slate-100 dark:border-zinc-800",
  "hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors",
].join(" ");

const MobileListEventRow = ({ event, onClick }: MobileListEventRowProps) => {
  const startStr = format(new Date(event.start), "h:mm a");
  const endStr = format(new Date(event.end), "h:mm a");
  const locationLabel =
    event.restaurantId === "anteatery" ? "Anteatery" : "Brandywine";

  return (
    <button type="button" className={ROW_CLASSES} onClick={onClick}>
      <div className="flex flex-col">
        <span className="font-medium text-black dark:text-zinc-200">
          {event.title}
        </span>
        <span className="text-gray-500 flex items-center mt-0.5">
          <LocationOnOutlinedIcon sx={{ fontSize: 14 }} className="mr-0.5" />
          {locationLabel}
        </span>
      </div>
      <div className="flex flex-col items-end text-sm text-black dark:text-zinc-400">
        <span>{startStr}</span>
        <span>{endStr}</span>
      </div>
    </button>
  );
};

export default MobileListEventRow;
