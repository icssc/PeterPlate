"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Drawer } from "@mui/material";
import Button from "@mui/material/Button";
import { useMemo } from "react";

interface MonthPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectMonth: (year: number, monthIndex: number) => void;
  /** Months that have at least one event, used to populate the picker. */
  availableMonths: { year: number; monthIndex: number }[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthPickerDrawer = ({
  open,
  onClose,
  currentDate,
  onSelectMonth,
  availableMonths,
}: MonthPickerDrawerProps) => {
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  // Group available months by year, keep months sorted within each year.
  const monthsByYear = useMemo(() => {
    const byYear = new Map<number, Set<number>>();
    for (const { year, monthIndex } of availableMonths) {
      if (!byYear.has(year)) byYear.set(year, new Set());
      byYear.get(year)?.add(monthIndex);
    }
    return Array.from(byYear.entries())
      .map(([year, months]) => ({
        year,
        months: Array.from(months).sort((a, b) => a - b),
      }))
      .sort((a, b) => a.year - b.year);
  }, [availableMonths]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          height: "auto",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
        },
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-zinc-950 p-5 rounded-t-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-800 dark:text-zinc-200"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="flex-1 overflow-y-auto mt-2 hide-scrollbar pb-24">
          {monthsByYear.length === 0 ? (
            <p className="text-center text-zinc-500 py-10">
              No upcoming events.
            </p>
          ) : (
            monthsByYear.map(({ year, months }) => (
              <div key={year} className="mb-6 last:mb-0">
                <div className="font-bold text-xl text-sky-700 mb-4">
                  {year}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {months.map((monthIndex) => {
                    const isSelected =
                      year === currentYear && monthIndex === currentMonthIndex;
                    return (
                      <button
                        type="button"
                        key={`${year}-${monthIndex}`}
                        onClick={() => onSelectMonth(year, monthIndex)}
                        className={`py-3 px-1 rounded-lg border text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-sky-100 border-sky-600 text-sky-700"
                            : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {MONTHS[monthIndex]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Button
            variant="outlined"
            onClick={onClose}
            className="flex-1 !normal-case !text-slate-800 !border-slate-300 !rounded-lg !py-3 dark:!text-zinc-200 dark:!border-zinc-700"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            className="flex-1 !normal-case !bg-sky-700 !text-white !rounded-lg !py-3"
          >
            Jump
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default MonthPickerDrawer;
