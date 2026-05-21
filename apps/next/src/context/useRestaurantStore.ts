import type { FormattedRestaurantInfo } from "@api/index";
import { create } from "zustand";
import { isSameDay, militaryToStandard } from "@/utils/funcs";
import { HallStatusEnum } from "@/utils/types";

interface HallStore {
  hallData?: FormattedRestaurantInfo;
  selectedDate?: Date;
  restaurant?: "anteatery" | "brandywine";
  today: Date;
  /**
   * The current wall-clock time. Updated on an interval (see `useRestaurantPage`)
   * so that the derived open/closed status re-computes while the page is left
   * open across an open→close transition.
   */
  now: Date;
  setNow: (now: Date) => void;
  setInputs: (input: {
    hallData: FormattedRestaurantInfo;
    selectedDate: Date;
    restaurant: "anteatery" | "brandywine";
  }) => void;
}

export const useRestaurantStore = create<HallStore>((set) => ({
  hallData: undefined,
  selectedDate: undefined,
  restaurant: undefined,
  today: new Date(),
  now: new Date(),
  setNow: (now) => set({ now }),
  setInputs: ({ hallData, selectedDate, restaurant }) =>
    set({ hallData, selectedDate, restaurant }),
}));

export const useHallDerived = () =>
  useRestaurantStore((state) => {
    const { hallData, selectedDate, today, now } = state;

    const availablePeriodTimes: Record<string, [Date, Date]> = {};
    let derivedHallStatus = HallStatusEnum.CLOSED;
    let openTime: Date | undefined;
    let closeTime: Date | undefined;

    if (!hallData || !selectedDate) {
      return { availablePeriodTimes, derivedHallStatus, openTime, closeTime };
    }

    let earliestOpen: Date | undefined;
    let latestClose: Date | undefined;

    for (const period of hallData.periods) {
      try {
        const name = period.name.toLowerCase();
        const open = militaryToStandard(period.startTime);
        const close = militaryToStandard(period.endTime);

        if (name === "latenight") {
          open.setDate(open.getDate() + 1);
          close.setDate(close.getDate() + 1);
        } else if (
          selectedDate.getFullYear() === today.getFullYear() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getDate() === today.getDate()
        ) {
          open.setDate(today.getDate());
          close.setDate(today.getDate());
        }

        availablePeriodTimes[name] = [open, close];

        earliestOpen =
          !earliestOpen || open < earliestOpen ? open : earliestOpen;
        latestClose = !latestClose || close > latestClose ? close : latestClose;
      } catch (e) {
        console.error("Error parsing time:", e);
      }
    }

    openTime = earliestOpen ?? undefined;
    closeTime = latestClose ?? undefined;

    // When the user is viewing today's menu, compare against the live `now` so
    // the status flips from Open to Closed (and vice versa) as the clock passes
    // an open/close boundary — even if the page is just left open. For any other
    // selected day, keep using the selected date so the result is unchanged.
    const referenceTime = isSameDay(selectedDate, now) ? now : selectedDate;

    if (!openTime || !closeTime) derivedHallStatus = HallStatusEnum.ERROR;
    else if (today.getDay() !== openTime?.getDay())
      derivedHallStatus = HallStatusEnum.PREVIEW;
    else if (referenceTime >= openTime && referenceTime < closeTime)
      derivedHallStatus = HallStatusEnum.OPEN;
    else derivedHallStatus = HallStatusEnum.CLOSED;

    return { availablePeriodTimes, derivedHallStatus, openTime, closeTime };
  });
