import type { DateList } from "@peterplate/db";
import type { CalendarRange } from "@/components/ui/toolbar";
import type { HallEnum, HallStatusEnum } from "@/utils/types";
import { DesktopTabs } from "./header/desktop-tabs";
import { MobileActions } from "./header/mobile-actions";
import { RestaurantFilters } from "./header/restaurant-filters";
import { RestaurantHeader } from "./header/restaurant-header";

interface RestaurantControlsProps {
  hall: HallEnum;
  isDesktop: boolean;
  derivedHallStatus: HallStatusEnum;
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
  isLoading: boolean;
  isError: boolean;
  dishes: any[];
  stations: any[];
  menuAnchor: HTMLElement | null;
  setMenuAnchor: (el: HTMLElement | null) => void;
  scheduleAnchor: HTMLElement | null;
  setScheduleAnchor: (el: HTMLElement | null) => void;
  hallEvents: any[];
  isCompactView: boolean;
  setIsCompactView: (isCompact: boolean) => void;
  selectedStation: string;
  setSelectedStation: (station: string) => void;
}

export function RestaurantControls({
  hall,
  isDesktop,
  derivedHallStatus,
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
  isLoading,
  isError,
  dishes,
  stations,
  menuAnchor,
  setMenuAnchor,
  scheduleAnchor,
  setScheduleAnchor,
  hallEvents,
  isCompactView,
  setIsCompactView,
  selectedStation,
  setSelectedStation,
}: RestaurantControlsProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2 flex-wrap md:flex-nowrap">
        {/* Desktop title & status (Header) */}
        <RestaurantHeader
          isDesktop={isDesktop}
          hall={hall}
          derivedHallStatus={derivedHallStatus}
        />

        <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:justify-end">
          {/* Meal & date selectors (Filters) */}
          <RestaurantFilters
            isDesktop={isDesktop}
            periods={periods}
            availablePeriodTimes={availablePeriodTimes}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            calendarRange={calendarRange}
            enabledDates={enabledDates}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
          />

          {/* Mobile Actions */}
          <MobileActions
            isDesktop={isDesktop}
            isLoading={isLoading}
            isError={isError}
            dishes={dishes}
            stations={stations}
            menuAnchor={menuAnchor}
            setMenuAnchor={setMenuAnchor}
            scheduleAnchor={scheduleAnchor}
            setScheduleAnchor={setScheduleAnchor}
            hallEvents={hallEvents}
            isCompactView={isCompactView}
            setIsCompactView={setIsCompactView}
            setSelectedStation={setSelectedStation}
          />
        </div>
      </div>

      {/* Desktop Tabs */}
      <DesktopTabs
        isDesktop={isDesktop}
        isLoading={isLoading}
        isError={isError}
        stations={stations}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        isCompactView={isCompactView}
        setIsCompactView={setIsCompactView}
      />
    </>
  );
}
