"use client";

import type { FormattedRestaurantInfo, Station } from "@api/index";
import type { DishWithRating, Event } from "@peterplate/validators";
import { useEffect, useMemo, useState } from "react";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useDate } from "@/context/date-context";
import {
  useHallDerived,
  useRestaurantStore,
} from "@/context/useRestaurantStore";
import { isSameDay } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import type { HallStatusEnum } from "@/utils/types";
import { HallEnum } from "@/utils/types";

/**
 * Returns the current meal period key for a given date by checking which period
 * window the date falls within. Falls back to the first period if none match.
 */
function getCurrentPeriod(
  selectedDate: Date,
  periods: Record<string, [Date, Date]>,
): string {
  for (const key in periods) {
    const periodBegin: Date = periods[key][0];
    const periodEnd: Date = periods[key][1];

    if (selectedDate >= periodBegin && selectedDate <= periodEnd) return key;
  }

  return Object.keys(periods)[0];
}

/** All derived state and data needed to render the restaurant page. */
export interface UseRestaurantPageResult {
  // Data / loading
  hallData: FormattedRestaurantInfo | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hallEvents: Event[];

  // Period / station selection
  periods: string[];
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedStation: string;
  setSelectedStation: (station: string) => void;
  activeStation: Station | undefined;
  stations: Station[];
  dishes: DishWithRating[];

  // View toggles
  isCompactView: boolean;
  setIsCompactView: (isCompact: boolean) => void;
  showPreferencesOnly: boolean;
  setShowPreferencesOnly: (show: boolean) => void;

  // Date
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
  calendarRange: CalendarRange | null;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  displayDate: Date;

  // Popover anchors
  menuAnchor: HTMLElement | null;
  setMenuAnchor: (el: HTMLElement | null) => void;
  scheduleAnchor: HTMLElement | null;
  setScheduleAnchor: (el: HTMLElement | null) => void;

  // Derived hall status
  derivedHallStatus: HallStatusEnum;
  openTime: Date | null | undefined;
  closeTime: Date | null | undefined;
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
}

/**
 * Encapsulates all state, data-fetching, and derived values for the restaurant
 * page so that `RestaurantPage` can remain a pure layout component.
 */
export function useRestaurantPage(hall: HallEnum): UseRestaurantPageResult {
  const { selectedDate, setSelectedDate } = useDate();
  const today = useRestaurantStore((s) => s.today);
  const setHallInputs = useRestaurantStore((s) => s.setInputs);

  // --- UI state ---
  const [showPreferencesOnly, setShowPreferencesOnly] = useState(false);
  const [calendarRange, setCalendarRange] = useState<CalendarRange | null>(
    null,
  );
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [isCompactView, setIsCompactView] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [scheduleAnchor, setScheduleAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // --- Calendar range ---
  const { data: dateRes } = trpc.pickableDates.useQuery();
  useEffect(() => {
    if (dateRes) {
      setCalendarRange(dateRes);
    }
  }, [dateRes]);

  const handleDateSelect = (newDateFromPicker: Date | undefined) => {
    if (newDateFromPicker) {
      const todayLocal = new Date();
      if (
        newDateFromPicker.getFullYear() === todayLocal.getFullYear() &&
        newDateFromPicker.getMonth() === todayLocal.getMonth() &&
        newDateFromPicker.getDate() === todayLocal.getDate()
      ) {
        setSelectedDate(new Date());
      } else {
        setSelectedDate(newDateFromPicker);
      }
    } else {
      setSelectedDate(undefined);
    }
  };

  // --- Restaurant data ---
  const restaurantId = hall === HallEnum.ANTEATERY ? "anteatery" : "brandywine";
  const { data, isLoading, isError, error } = trpc.restaurant.useQuery(
    { date: selectedDate ?? today, restaurant: restaurantId },
    { staleTime: 2 * 60 * 60 * 1000 },
  );

  // Normalise to undefined when loading or errored
  const hallData: FormattedRestaurantInfo | undefined =
    !isLoading && !isError ? data : undefined;

  // --- Sync hall inputs to store ---
  useEffect(() => {
    if (hallData && selectedDate) {
      setHallInputs({ hallData, selectedDate, restaurant: restaurantId });
    }
  }, [hallData, selectedDate, setHallInputs, restaurantId]);

  // --- Upcoming events filtered to this hall ---
  const { data: upcomingEvents = [] } = trpc.event.upcoming.useQuery();
  const hallEvents = useMemo(
    () =>
      [...upcomingEvents]
        .filter((e) => e.restaurantId === restaurantId)
        .sort(
          (a, b) =>
            (a.start ? new Date(a.start).getTime() : 0) -
            (b.start ? new Date(b.start).getTime() : 0),
        ),
    [upcomingEvents, restaurantId],
  );

  // --- Hall status / open-close times ---
  const { availablePeriodTimes, derivedHallStatus, openTime, closeTime } =
    useHallDerived();

  // --- Period list (sorted by start time) ---
  const periods = useMemo(() => {
    const times = availablePeriodTimes ?? {};
    return Object.keys(times).sort((a, b) => {
      const startA = times[a]?.[0];
      const startB = times[b]?.[0];
      if (startA == null && startB == null) return 0;
      if (startA == null) return 1;
      if (startB == null) return -1;
      return startA <= startB ? -1 : 1;
    });
  }, [availablePeriodTimes]);

  // --- Auto-select period ---
  useEffect(() => {
    if (!selectedDate || periods.length === 0) {
      if (selectedPeriod !== "") {
        setSelectedPeriod("");
      }
      return;
    }

    const isValid = periods.includes(selectedPeriod);

    if (!isSameDay(selectedDate, today) && !selectedPeriod) {
      setSelectedPeriod(periods[0]);
      return;
    }

    if (!isValid) {
      const current = getCurrentPeriod(
        selectedDate,
        (availablePeriodTimes ?? {}) as Record<string, [Date, Date]>,
      );
      if (current !== selectedPeriod) {
        setSelectedPeriod(current);
      }
    }
  }, [availablePeriodTimes, periods, selectedDate, selectedPeriod, today]);

  // --- Derived menu / stations / dishes ---
  const currentMenu = useMemo(
    () =>
      hallData?.periods.find(
        (period) => period.name.toLowerCase() === selectedPeriod.toLowerCase(),
      ) ?? null,
    [hallData, selectedPeriod],
  );

  const stations: Station[] = currentMenu?.stations ?? [];

  // --- Auto-select station ---
  useEffect(() => {
    if (stations.length === 0) {
      if (selectedStation !== "") {
        setSelectedStation("");
      }
      return;
    }

    const firstStation = stations[0].name.toLowerCase();
    const isValid = stations.some(
      (s) => s.name.toLowerCase() === selectedStation,
    );

    if (!isValid) setSelectedStation(firstStation);
  }, [selectedStation, stations]);

  const activeStation =
    stations.find((s) => s.name.toLowerCase() === selectedStation) ??
    stations[0];

  const dishes: DishWithRating[] = activeStation?.dishes ?? [];

  return {
    hallData,
    isLoading,
    isError,
    error,
    hallEvents,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    selectedStation,
    setSelectedStation,
    activeStation,
    stations,
    dishes,
    isCompactView,
    setIsCompactView,
    showPreferencesOnly,
    setShowPreferencesOnly,
    selectedDate,
    handleDateSelect,
    calendarRange,
    isDatePickerOpen,
    setIsDatePickerOpen,
    displayDate: selectedDate ?? today,
    menuAnchor,
    setMenuAnchor,
    scheduleAnchor,
    setScheduleAnchor,
    derivedHallStatus,
    openTime,
    closeTime,
    availablePeriodTimes,
  };
}
