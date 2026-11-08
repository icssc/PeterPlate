"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { format } from "date-fns";
import type { EventWithType } from "@/app/events/page";

interface MobileListEventRowProps {
  event: EventWithType;
  onClick: () => void;
}

const ROW_CLASSES = [
  "flex flex-row items-center gap-3",
  "py-2 text-left w-full",
  "border-b last:border-0 border-slate-200 dark:border-zinc-600",
  "hover:bg-slate-50 dark:hover:bg-zinc-700/40 transition-colors",
].join(" ");

const MobileListEventRow = ({ event, onClick }: MobileListEventRowProps) => {
  const startStr = format(new Date(event.start), "h:mm a");
  const endStr = format(new Date(event.end), "h:mm a");
  const locationLabel =
    event.restaurantId === "anteatery" ? "Anteatery" : "Brandywine";

  return (
    <button type="button" className={ROW_CLASSES} onClick={onClick}>
      <span className="self-stretch w-1 rounded-full bg-sky-700 dark:bg-blue-300" />
      <div className="flex flex-col flex-1">
        <span className="font-medium text-black dark:text-zinc-100">
          {event.title}
        </span>
        <span className="text-gray-500 dark:text-zinc-400 flex items-center mt-0.5">
          <LocationOnIcon sx={{ fontSize: 16 }} className="mr-1" />
          {locationLabel}
        </span>
      </div>
      <div className="flex flex-col items-end text-black dark:text-zinc-100">
        <span>{startStr}</span>
        <span>{endStr}</span>
      </div>
    </button>
  );
};

export default MobileListEventRow;
