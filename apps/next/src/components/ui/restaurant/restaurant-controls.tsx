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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-x-3 mb-2 flex-wrap">
        {/* Desktop title & status. Its large grow factor soaks up spare space
            so the filters keep their natural width on one line, but fill the
            column when they wrap below the title on narrower screens. */}
        {isDesktop && (
          <div className="flex items-center gap-2 grow-[999]">
            <RestaurantHeader isDesktop={isDesktop} hall={hall} />
            <DiningHallStatus status={derivedHallStatus} />
          </div>
        )}

        <div className="flex flex-col gap-3 w-full md:w-auto md:grow md:flex-row md:items-center md:justify-end">
          {/* Meal & date selectors */}
          <RestaurantFilters
            isDesktop={isDesktop}
            periods={periods}
            availablePeriodTimes={availablePeriodTimes}
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            calendarRange={calendarRange}
          />

          {/* Menu / schedule popovers & view-toggle (mobile only) */}
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

      {/* Station tabs & card/compact view toggles (desktop only) */}
      <DesktopTabs
        isDesktop={isDesktop}
        isLoading={isLoading}
        isError={isError}
        stations={stations}
      />
    </>
  );
}
