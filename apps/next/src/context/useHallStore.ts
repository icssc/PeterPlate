import { militaryToStandard } from "@/utils/funcs";
import { HallStatusEnum } from "@/utils/types";
import { RestaurantInfo } from "@api/index";
import { create } from "zustand";

interface HallStore {
  hallData?: RestaurantInfo
  selectedDate?: Date
  today: Date
  setInputs: (input: {
    hallData: RestaurantInfo
    selectedDate: Date
  }) => void
}

export const useHallStore = create<HallStore>(set => ({
  hallData: undefined,
  selectedDate: undefined,
  today: new Date(),
  setInputs: ({ hallData, selectedDate }) =>
    set({ hallData, selectedDate }),
}));

export const useHallDerived = () =>
  useHallStore(state => {
    const { hallData, selectedDate, today } = state;

    let availablePeriodTimes: Record<string, [Date, Date]> = {};
    let derivedHallStatus = HallStatusEnum.CLOSED;
    let openTime: Date | undefined;
    let closeTime: Date | undefined;

    if (!hallData?.menus?.length || !selectedDate) {
      return { availablePeriodTimes, derivedHallStatus, openTime, closeTime };
    }

    let earliestOpen: Date | undefined;
    let latestClose: Date | undefined;

    for (const menu of hallData.menus) {
      try {
        const name = menu.period.name.toLowerCase();
        const open = militaryToStandard(menu.period.startTime);
        const close = militaryToStandard(menu.period.endTime);

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

        earliestOpen = !earliestOpen || open < earliestOpen ? open : earliestOpen;
        latestClose = !latestClose || close > latestClose ? close : latestClose;
      } catch (e) {
        console.error("Error parsing time:", e);
      }
    }

    openTime = earliestOpen ?? undefined;
    closeTime = latestClose ?? undefined;

    if (!openTime && !closeTime)
      derivedHallStatus = HallStatusEnum.ERROR;
    else if (today.getDay() !== openTime!.getDay())
      derivedHallStatus = HallStatusEnum.PREVIEW;
    else if (selectedDate >= openTime! && selectedDate < closeTime!)
      derivedHallStatus = HallStatusEnum.OPEN;
    else
      derivedHallStatus = HallStatusEnum.CLOSED;

    return { availablePeriodTimes, derivedHallStatus, openTime, closeTime };
  });
