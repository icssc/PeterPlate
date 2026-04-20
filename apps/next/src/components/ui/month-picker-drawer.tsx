"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Drawer } from "@mui/material";
import Button from "@mui/material/Button";

interface MonthPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectMonth: (year: number, monthIndex: number) => void;
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
}: MonthPickerDrawerProps) => {
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

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
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-800 dark:text-zinc-200"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mt-2 hide-scrollbar pb-24">
          <div className="font-bold text-xl text-sky-700 mb-4">
            {currentYear}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {MONTHS.map((monthName, index) => {
              const isSelected = index === currentMonthIndex;
              return (
                <button
                  type="button"
                  key={`cur-${monthName}`}
                  onClick={() => onSelectMonth(currentYear, index)}
                  className={`py-3 px-1 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-sky-100 border-sky-600 text-sky-700"
                      : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {monthName}
                </button>
              );
            })}
          </div>

          <div className="font-bold text-xl text-sky-700 mb-4">
            {currentYear + 1}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MONTHS.map((monthName, index) => {
              return (
                <button
                  type="button"
                  key={`next-${monthName}`}
                  onClick={() => onSelectMonth(currentYear + 1, index)}
                  className="py-3 px-1 rounded-lg border bg-white border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-50 transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer Buttons */}
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
