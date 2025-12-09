import Image from "next/image";
import Link from "next/link";
import { PanelRight } from "lucide-react";
import { Button } from "./shadcn/button";
import { Sheet, SheetTrigger } from "./shadcn/sheet";
import SidebarContent from "./sidebar/sidebar-content";
import { DatePicker } from "./shadcn/date-picker";
import { useDate } from "@/context/date-context";
import { trpc } from "@/utils/trpc"; // Import tRPC hook
import { useEffect, useState } from "react";
import { DateList } from "../../../../../packages/db/src/schema";

/** Dates to restrict calendar navigation. */
export type CalendarRange = {
  earliest: Date,
  latest: Date,
}

/**
 * Renders the main toolbar for the application.
 *
 * The toolbar includes:
 * - A clickable application logo (`Image`) wrapped in a `Link` that navigates to the homepage ("/").
 * - A `DatePicker` component to allow users to select a specific date. The selected date
 *   is managed via the `useDate` context.
 * - A `SheetTrigger` (styled as a `Button` with an icon) to open a `Sheet`
 *   which contains the `SidebarContent`.
 *
 * It leverages the `useDate` custom hook to access and update the globally selected date.
 * @returns {JSX.Element} The rendered toolbar component.
 */
export default function Toolbar(): JSX.Element {
  const { selectedDate, setSelectedDate } = useDate();
  const [enabledDates, setEnabledDates] = useState<DateList>([new Date()]);  // default: enable today
  const [calendarRange, setCalendarRange] = useState<CalendarRange>({
    earliest: new Date(),
    latest: new Date(),
  });  // default: restrict to today

  const { data: dateRes } = trpc.pickableDates.useQuery()
  
  useEffect(() => {
    if (dateRes) {
      setEnabledDates(dateRes);
      setCalendarRange({
        earliest: dateRes[0],
        latest: dateRes[dateRes.length-1]
      });
    }
  }, [dateRes])

  /**
   * Handles the date selection event from the `DatePicker` component.
   *
   * This function updates the `selectedDate` in the `DateContext`.
   * - If the `newDateFromPicker` is the current calendar day ("today"),
   *   `selectedDate` is set to the current date and time (i.e., `new Date()`).
   *   This ensures that any application logic relying on the current time of day
   *   (e.g., determining if a dining hall is currently open) operates correctly.
   * - If `newDateFromPicker` is a day other than today (past or future),
   *   `selectedDate` is set to `newDateFromPicker` directly. Typically, date pickers
   *   return a date set to the beginning of the day (00:00:00), which is suitable
   *   for viewing schedules or data for an entire specific day.
   * - If `newDateFromPicker` is `undefined` (e.g., the date selection was cleared),
   *   `selectedDate` is set to `undefined`.
   *
   * @param {Date | undefined} newDateFromPicker - The date selected by the user in the
   *   `DatePicker`, or `undefined` if the selection was cleared.
   */
  const handleDateSelect = (newDateFromPicker: Date | undefined) => {
    if (newDateFromPicker) {
      const today = new Date();
      // Compare year, month, and day. newDateFromPicker is likely at 00:00:00.
      if (
        newDateFromPicker.getFullYear() === today.getFullYear() &&
        newDateFromPicker.getMonth() === today.getMonth() &&
        newDateFromPicker.getDate() === today.getDate()
      ) {
        // It's today. Create a new Date object for "now" to get current time.
        setSelectedDate(new Date());
      } else {
        // It's another day. Use the date from picker (which is at 00:00:00).
        setSelectedDate(newDateFromPicker);
      }
    } else {
      // Date was cleared in the picker
      setSelectedDate(undefined);
    }
  };

    return (
      <div 
        className="w-full h-18 absolute flex items-center justify-between px-4 py-2 
          bg-zinc-50 bg-opacity-45 backdrop-blur-md z-10">
        <Link href="/">
          <Image
            className="rounded-full cursor-pointer"
            src="/Zotmeal-Logo.webp" 
            alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
            width={40}
            height={40}
          />
        </Link>
        <Sheet>
          <div className="flex gap-4 items-center">
            <DatePicker
              date={selectedDate}
              onSelect={handleDateSelect}
              enabledDates={enabledDates}
              range={calendarRange}
            />
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelRight />
              </Button>
            </SheetTrigger>
            <SidebarContent />
          </div>
        </Sheet>
      </div>
    )
}
