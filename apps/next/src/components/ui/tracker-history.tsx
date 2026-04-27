"use client";

import RestoreIcon from "@mui/icons-material/Restore";
import { Button, Drawer } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
  onDateSelect: (date: Date) => void;
  onDayClick: (date: Date) => void;
  loggedDates: Date[];
}

export default function TrackerHistory({
  onDateSelect,
  onDayClick,
  loggedDates,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile || !open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideDialog = document
        .querySelector(".MuiDialog-root")
        ?.contains(target);
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !isInsideDialog
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  const calendar = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date ?? null);
          if (date) {
            onDateSelect(date);
            onDayClick(date);
          }
        }}
        shouldDisableDate={(date) =>
          !loggedDates.some((d) => d.toDateString() === date.toDateString())
        }
        displayStaticWrapperAs="desktop"
        slotProps={{
          actionBar: { actions: [] },
          layout: {
            sx: {
              backgroundColor: "var(--mui-palette-background-paper)",
              backgroundImage: "none",
              ".dark &": { backgroundColor: "#323235" },
            },
          },
        }}
        sx={{ "& .MuiDateCalendar-root": { height: "300px" } }}
      />
    </LocalizationProvider>
  );

  return (
    <div className="relative" ref={containerRef}>
      <Button
        onClick={() => setOpen(!open)}
        variant="contained"
        className="!bg-sky-700 !text-white !text-sm !font-semibold hover:!bg-sky-800 !rounded-lg !px-3 !py-1 !normal-case dark:!bg-blue-300 dark:!text-gray-900 dark:hover:!bg-blue-400"
        endIcon={<RestoreIcon fontSize="small" />}
      >
        History
      </Button>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            ".dark & .MuiDrawer-paper": {
              backgroundImage: "none",
              backgroundColor: "#323235",
            },
          }}
        >
          <div className="p-4">{calendar}</div>
        </Drawer>
      ) : (
        open && (
          <div className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-[#323235] rounded-xl border border-sky-700 dark:border-blue-300 p-4 shadow-md">
            {calendar}
          </div>
        )
      )}
    </div>
  );
}
