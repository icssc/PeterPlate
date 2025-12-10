"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { cn } from "@/utils/tw";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/utils/tw"
import { Button } from "@/components/ui/shadcn/button"
import { Calendar } from "@/components/ui/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import type { CalendarRange } from "../toolbar"
import { isSameDay } from "@/utils/funcs"
import { DateList } from "../../../../../../packages/db/src/schema"

export function DatePicker({date, enabledDates, range, onSelect} : {
    date: Date | undefined,
    enabledDates: DateList,
    range: CalendarRange,
    onSelect: (newDateFromPicker : Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            (date ? isSameDay(d, date) : true)
            || !enabledDates?.some(
              ed => ed.getTime() === d.getTime()
          )}
        />
      </PopoverContent>
    </Popover>
  );
}
