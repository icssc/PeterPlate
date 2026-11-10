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
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { isSameDay, isUpcomingEvent } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import type { HallStatusEnum } from "@/utils/types";
import { HallEnum } from "@/utils/types";

const normalizeStationName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Stations that don't rotate; shown after the rotating ones. */
const NON_ROTATING_STATIONS: Record<"anteatery" | "brandywine", Set<string>> = {
  // Names as returned by CampusDish, normalized.
  brandywine: new Set(
    ["Hearth/Pizza", "Ember/Grill", "Honeycakes/Bakery"].map(
      normalizeStationName,
    ),
  ),
  anteatery: new Set(
    ["Sizzle Grill", "Bakery", "Oven"].map(normalizeStationName),
  ),
};

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
  hallData: FormattedRestaurantInfo | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hallEvents: Event[];
  periods: string[];
  activeStation: Station | undefined;
  stations: Station[];
  dishes: DishWithRating[];
  calendarRange: CalendarRange | null;
  displayDate: Date;
  derivedHallStatus: HallStatusEnum;
  openTime: Date | null | undefined;
  closeTime: Date | null | undefined;
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
  selectedDate: Date | undefined;
  handleDateSelect: (date: Date | undefined) => void;
}

/**
 * Encapsulates all state, data-fetching, and derived values for the restaurant
 * page so that `RestaurantPage` can remain a pure layout component.
 */
export function useRestaurantPage(hall: HallEnum): UseRestaurantPageResult {
  const { selectedDate, setSelectedDate } = useDate();
  const today = useRestaurantStore((s) => s.today);
  const setHallInputs = useRestaurantStore((s) => s.setInputs);

  // Read period/station from the shared UI store (written by auto-selection
  // effects below; also written directly by sub-components on user interaction)
  const selectedPeriod = useRestaurantUIStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useRestaurantUIStore((s) => s.setSelectedPeriod);
  const selectedStation = useRestaurantUIStore((s) => s.selectedStation);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);

  // calendarRange is query-derived config, not user state — kept local
  const [calendarRange, setCalendarRange] = useState<CalendarRange | null>(
    null,
  );
  const { data: dateRes } = trpc.pickableDates.useQuery();
  useEffect(() => {
    if (dateRes) setCalendarRange(dateRes);
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

  const hallData: FormattedRestaurantInfo | undefined =
    !isLoading && !isError ? data : undefined;

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
        .filter((e) => e.restaurantId === restaurantId && isUpcomingEvent(e))
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
      if (selectedPeriod !== "") setSelectedPeriod("");
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
      if (current !== selectedPeriod) setSelectedPeriod(current);
    }
  }, [
    availablePeriodTimes,
    periods,
    selectedDate,
    selectedPeriod,
    today,
    setSelectedPeriod,
  ]);

  // --- Derived menu / stations / dishes ---
  const currentMenu = useMemo(
    () =>
      hallData?.periods.find(
        (period) => period.name.toLowerCase() === selectedPeriod.toLowerCase(),
      ) ?? null,
    [hallData, selectedPeriod],
  );

  // Rotating stations come first; the fixed (non-rotating) ones go last.
  const stations: Station[] = useMemo(() => {
    const all = currentMenu?.stations ?? [];
    const fixed = NON_ROTATING_STATIONS[restaurantId];
    const isFixed = (s: Station) => fixed.has(normalizeStationName(s.name));
    return [...all.filter((s) => !isFixed(s)), ...all.filter(isFixed)];
  }, [currentMenu, restaurantId]);

  // --- Auto-select station ---
  useEffect(() => {
    if (stations.length === 0) {
      if (selectedStation !== "") setSelectedStation("");
      return;
    }

    const isValid = stations.some(
      (s) => s.name.toLowerCase() === selectedStation,
    );

    if (!isValid) setSelectedStation(stations[0].name.toLowerCase());
  }, [selectedStation, stations, setSelectedStation]);

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
    activeStation,
    stations,
    dishes,
    calendarRange,
    displayDate: selectedDate ?? today,
    derivedHallStatus,
    openTime,
    closeTime,
    availablePeriodTimes,
    selectedDate,
    handleDateSelect,
  };
}
