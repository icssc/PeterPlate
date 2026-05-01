"use client";

import { ArrowDropDownRounded } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { DateList } from "@peterplate/db";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useUserStore } from "@/context/useUserStore";
import { formatOpenCloseTime, isSameDay, toTitleCase } from "@/utils/funcs";
import { cn } from "@/utils/tw";

interface RestaurantFiltersProps {
  isDesktop: boolean;
  periods: string[];
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
  calendarRange: CalendarRange | null;
  enabledDates: DateList;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  showPreferencesOnly: boolean;
  setShowPreferencesOnly: (isSet: boolean) => void;
}

export function RestaurantFilters({
  isDesktop,
  periods,
  availablePeriodTimes,
  selectedPeriod,
  setSelectedPeriod,
  selectedDate,
  handleDateSelect,
  calendarRange,
  enabledDates,
  isDatePickerOpen,
  setIsDatePickerOpen,
  showPreferencesOnly,
  setShowPreferencesOnly,
}: RestaurantFiltersProps) {
  const { userId } = useUserStore();
  const ShowPrefsButton = (
    <button
      type="button"
      onClick={() => setShowPreferencesOnly(!showPreferencesOnly)}
      disabled={userId === null}
      className={cn(
        "h-[40px] rounded-md border text-sm font-medium transition-all duration-200 w-full",
        userId === null && "text-black/50 border-sky-700/50",
        isDesktop && "w-[240px]",
        showPreferencesOnly && "bg-sky-700 text-white border-sky-700 shadow-md",
        !showPreferencesOnly &&
          "bg-white text-sky-700 border-sky-700 hover:bg-sky-50",
      )}
    >
      Show Preferences Only
    </button>
  );

  return (
    <div className={isDesktop ? "flex gap-2" : "grid grid-cols-2 gap-2 w-full"}>
      <div className={isDesktop ? "w-52" : "w-full"}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel
            id="meal-select-label"
            className="!text-sky-700 [&.Mui-focused]:!text-sky-700"
          >
            Meal
          </InputLabel>
          <Select
            labelId="meal-select-label"
            value={selectedPeriod}
            label="Meal"
            onChange={(e) => setSelectedPeriod(e.target.value)}
            IconComponent={ArrowDropDownRounded}
            className="bg-white [&_fieldset]:!border-sky-700 [&:hover_fieldset]:!border-sky-700 [&_.Mui-focused_fieldset]:!border-sky-700 [&_.MuiSvgIcon-root]:!text-sky-700"
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              disableScrollLock: true,
              PaperProps: {
                style: {
                  minWidth: "280px",
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected) {
                return <em>Select Meal</em>;
              }
              return toTitleCase(selected);
            }}
          >
            {periods.length === 0 ? (
              <MenuItem value="" disabled>
                Select Meal
              </MenuItem>
            ) : (
              periods.map((time) => {
                const mealTimeKey = time.toLowerCase();
                const periodTimes = availablePeriodTimes?.[time];
                const hasTimes = periodTimes && periodTimes.length >= 2;
                const timeString = hasTimes
                  ? formatOpenCloseTime(periodTimes[0], periodTimes[1])
                  : "Closed";

                return (
                  <MenuItem
                    key={time}
                    value={mealTimeKey}
                    className="!flex !justify-between !items-center !gap-4"
                  >
                    <span>{toTitleCase(time)}</span>
                    <span className="text-gray-500 text-sm">{timeString}</span>
                  </MenuItem>
                );
              })
            )}
          </Select>
        </FormControl>
      </div>

      {calendarRange && enabledDates && (
        <div className={isDesktop ? "w-[240px]" : "w-full"}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select date"
              value={selectedDate || null}
              onChange={(newValue) => handleDateSelect(newValue || undefined)}
              minDate={calendarRange.earliest}
              maxDate={calendarRange.latest}
              shouldDisableDate={(date) =>
                !enabledDates.some((enabledDate) =>
                  isSameDay(date, enabledDate),
                )
              }
              open={isDatePickerOpen}
              onOpen={() => setIsDatePickerOpen(true)}
              onClose={() => setIsDatePickerOpen(false)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  onClick: () => setIsDatePickerOpen(true),
                  InputLabelProps: {
                    className: "!text-sky-700",
                  },
                  inputProps: {
                    readOnly: true,
                    className: "!cursor-pointer",
                  },
                  className:
                    "bg-white [&_fieldset]:!border-sky-700 [&:hover_fieldset]:!border-sky-700 [&_.Mui-focused_fieldset]:!border-sky-700 [&_.MuiSvgIcon-root]:!text-sky-700 !cursor-pointer",
                },
                openPickerIcon: {
                  className: "!text-sky-700",
                },
                dialog: {
                  disableScrollLock: true,
                },
                popper: {
                  placement: "bottom-end",
                  className: "[&_.MuiPaper-root]:mt-1",
                  modifiers: [
                    {
                      name: "flip",
                      enabled: true,
                      options: {
                        altBoundary: true,
                        rootBoundary: "document",
                        padding: 8,
                      },
                    },
                    {
                      name: "preventOverflow",
                      enabled: true,
                      options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: "document",
                        padding: 8,
                      },
                    },
                  ],
                },
              }}
            />
          </LocalizationProvider>
        </div>
      )}

      <div>
        {!userId && (
          <Tooltip title="Log in to filter by preferences!" placement="top">
            {ShowPrefsButton}
          </Tooltip>
        )}
        {userId && ShowPrefsButton}
      </div>
    </div>
  );
}
