"use client";

import { CalendarToday } from "@mui/icons-material";
import { format } from "date-fns";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { isSameDay } from "@/utils/funcs";
import { cn } from "@/utils/tw";
import type { DateList } from "../../../../../../packages/db/src/schema";
import type { CalendarRange } from "../toolbar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({
  date,
  enabledDates,
  range,
  onSelect,
}: {
  date: Date | undefined;
  enabledDates: DateList;
  range: CalendarRange;
  onSelect: (newDateFromPicker: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between font-normal border border-[rgba(0,0,0,0.23)] rounded-md h-9 px-3 text-left",
            !date && "text-muted-foreground",
          )}
        >
          <span>{date ? format(date, "PPP") : "Pick a date"}</span>
          <CalendarToday className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          fromDate={range.earliest}
          toDate={range.latest}
          disabled={(d) =>
            (date ? isSameDay(d, date) : true) ||
            !enabledDates?.some((ed) => isSameDay(ed, d))
          }
        />
      </PopoverContent>
    </Popover>
  );
}
