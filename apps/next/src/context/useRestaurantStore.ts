import type { FormattedRestaurantInfo } from "@api/index";
import { create } from "zustand";
import { militaryToStandard } from "@/utils/funcs";
import { HallStatusEnum } from "@/utils/types";

interface HallStore {
  hallData?: FormattedRestaurantInfo;
  selectedDate?: Date;
  restaurant?: "anteatery" | "brandywine";
  today: Date;
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
  setInputs: ({ hallData, selectedDate, restaurant }) =>
    set({ hallData, selectedDate, restaurant }),
}));

export const useHallDerived = () =>
  useRestaurantStore((state) => {
    const { hallData, selectedDate, today } = state;

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

    if (!openTime || !closeTime) derivedHallStatus = HallStatusEnum.ERROR;
    else if (today.getDay() !== openTime?.getDay())
      derivedHallStatus = HallStatusEnum.PREVIEW;
    else if (selectedDate >= openTime && selectedDate < closeTime)
      derivedHallStatus = HallStatusEnum.OPEN;
    else derivedHallStatus = HallStatusEnum.CLOSED;

    return { availablePeriodTimes, derivedHallStatus, openTime, closeTime };
  });
