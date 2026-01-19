import { PanelRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconButton, Drawer } from "@mui/material";
import { useDate } from "@/context/date-context";
import { trpc } from "@/utils/trpc";
import type { DateList } from "../../../../../packages/db/src/schema";
import { DatePicker } from "./shadcn/date-picker";
import SidebarContent from "./sidebar/sidebar-content";

export type CalendarRange = {
  earliest: Date;
  latest: Date;
};

export default function Toolbar(): JSX.Element {
  const { selectedDate, setSelectedDate } = useDate();
  const [enabledDates, setEnabledDates] = useState<DateList>([new Date()]);
  const [calendarRange, setCalendarRange] = useState<CalendarRange>({
    earliest: new Date(),
    latest: new Date(),
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: dateRes } = trpc.pickableDates.useQuery();

  useEffect(() => {
    if (dateRes) {
      console.log("Pickable Dates (Front):", dateRes);
      setEnabledDates(dateRes);
      setCalendarRange({
        earliest: dateRes[0],
        latest: dateRes[dateRes.length - 1],
      });
    }
  }, [dateRes]);

  const handleDateSelect = (newDateFromPicker: Date | undefined) => {
    if (newDateFromPicker) {
      const today = new Date();
      if (
        newDateFromPicker.getFullYear() === today.getFullYear() &&
        newDateFromPicker.getMonth() === today.getMonth() &&
        newDateFromPicker.getDate() === today.getDate()
      ) {
        setSelectedDate(new Date());
      } else {
        setSelectedDate(newDateFromPicker);
      }
    } else {
      setSelectedDate(undefined);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="w-full h-18 absolute flex items-center justify-between px-4 py-2 bg-zinc-50 bg-opacity-45 backdrop-blur-md z-10">
      <Link href="/">
        <Image
          className="rounded-full cursor-pointer"
          src="/Zotmeal-Logo.webp"
          alt="Zotmeal's Logo: a beige anteater with a bushy tail sitting next to an anthill."
          width={40}
          height={40}
        />
      </Link>
      <div className="flex gap-4 items-center">
        <DatePicker
          date={selectedDate}
          onSelect={handleDateSelect}
          enabledDates={enabledDates}
          range={calendarRange}
        />
        <IconButton
          onClick={toggleDrawer}
          className="!text-[#1f2937] hover:!bg-[rgba(0,0,0,0.04)]"
          aria-label="Open sidebar"
        >
          <PanelRight />
        </IconButton>
      </div>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <SidebarContent />
      </Drawer>
    </div>
  );
}
