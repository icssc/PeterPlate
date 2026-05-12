import type { Station } from "@api/index";
import type { DishWithRating, Event } from "@peterplate/validators";
import { DiningHallStatus } from "@/components/ui/status";
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
  // Period list & times — derived from hall data, not user state
  periods: string[];
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
  // Date selection — owned by date-context, not the UI store
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
  calendarRange: CalendarRange | null;
  // Loading / data for conditional rendering
  isLoading: boolean;
  isError: boolean;
  dishes: DishWithRating[];
  stations: Station[];
  hallEvents: Event[];
}

export function RestaurantControls({
  hall,
  isDesktop,
  derivedHallStatus,
  periods,
  availablePeriodTimes,
  selectedDate,
  handleDateSelect,
  calendarRange,
  isLoading,
  isError,
  dishes,
  stations,
  hallEvents,
}: RestaurantControlsProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2 flex-wrap md:flex-nowrap">
        {/* Desktop title */}
        <RestaurantHeader isDesktop={isDesktop} hall={hall} />

        <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:justify-end">
          {/* Status badge — desktop only, shown next to filters */}
          {isDesktop && (
            <div>
              <DiningHallStatus status={derivedHallStatus} />
            </div>
          )}

          {/*
            Meal & date selectors.
            selectedPeriod / setSelectedPeriod / showPreferencesOnly /
            isDatePickerOpen are read from useRestaurantUIStore inside.
          */}
          <RestaurantFilters
            isDesktop={isDesktop}
            periods={periods}
            availablePeriodTimes={availablePeriodTimes}
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            calendarRange={calendarRange}
          />

          {/*
            Menu / schedule popovers & view-toggle (mobile only).
            isCompactView / menuAnchor / scheduleAnchor are read from
            useRestaurantUIStore inside.
          */}
          <MobileActions
            isDesktop={isDesktop}
            isLoading={isLoading}
            isError={isError}
            dishes={dishes}
            stations={stations}
            hallEvents={hallEvents}
          />
        </div>
      </div>

      {/*
        Station tabs & card/compact view toggles (desktop only).
        selectedStation / isCompactView are read from useRestaurantUIStore inside.
      */}
      <DesktopTabs
        isDesktop={isDesktop}
        isLoading={isLoading}
        isError={isError}
        stations={stations}
      />
    </>
  );
}
