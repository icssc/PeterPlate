"use client";

import RestoreIcon from "@mui/icons-material/Restore";
import { Button } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { useState } from "react";

interface Props {
  onDateSelect: (date: Date) => void;
}

export default function TrackerHistory({ onDateSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        variant="contained"
        className="!bg-sky-700 !text-white !text-sm !font-semibold hover:!bg-sky-800 !rounded-lg !px-3 !py-1 !normal-case"
        endIcon={<RestoreIcon fontSize="small" />}
      >
        History
      </Button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl border border-sky-700/30 p-4 shadow-md">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date ?? null);
                if (date) onDateSelect(date);
              }}
              onAccept={() => setOpen(false)}
              displayStaticWrapperAs="desktop"
              slotProps={{
                actionBar: { actions: [] },
              }}
              sx={{
                "& .MuiDateCalendar-root": {
                  height: "300px",
                },
              }}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
}
