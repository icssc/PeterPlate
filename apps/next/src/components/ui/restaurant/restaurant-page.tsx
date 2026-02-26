"use client";

import { LocationOn } from "@mui/icons-material";
import { Container, Link, Typography } from "@mui/material";
import type { RestaurantInfo } from "@peterplate/api";
import type { DateList } from "@peterplate/db";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DiningHallStatus } from "@/components/ui/status";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useDate } from "@/context/date-context";
import { useHallDerived, useHallStore } from "@/context/useHallStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { isSameDay } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import {
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_LINK_URL,
  HallEnum,
  HallStatusEnum,
} from "@/utils/types";
import { DishesView } from "./dishes-view";
import { RestaurantControls } from "./restaurant-controls";
import { Sidebar } from "./sidebar";

interface RestaurantPageProps {
  hall: HallEnum;
}

export function RestaurantPage({
  hall,
}: RestaurantPageProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { selectedDate, setSelectedDate } = useDate();
  const today = useHallStore((s) => s.today);
  const setHallInputs = useHallStore((s) => s.setInputs);

  const [enabledDates, setEnabledDates] = useState<DateList>(null);
  const [calendarRange, setCalendarRange] = useState<CalendarRange | null>(
    null,
  );

  const { data: dateRes } = trpc.pickableDates.useQuery();

  useEffect(() => {
    if (dateRes && dateRes.length > 0) {
      setEnabledDates(dateRes);
      setCalendarRange({
        earliest: dateRes[0],
        latest: dateRes[dateRes.length - 1],
      });
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

  const { data, isLoading, isError, error } = trpc.peterplate.useQuery(
    { date: selectedDate ?? today },
    { staleTime: 2 * 60 * 60 * 1000 },
  );

  const { data: upcomingEvents = [] } = trpc.event.upcoming.useQuery();
  const restaurantId = hall === HallEnum.ANTEATERY ? "anteatery" : "brandywine";
  const hallEvents = useMemo(
    () => [...upcomingEvents].filter((e) => e.restaurantId === restaurantId),
    [upcomingEvents, restaurantId],
  );

  const hallData: RestaurantInfo | undefined = useMemo(() => {
    if (isLoading || isError || !data) return undefined;
    return hall === HallEnum.ANTEATERY ? data.anteatery : data.brandywine;
  }, [data, hall, isError, isLoading]);

  useEffect(() => {
    if (hallData && selectedDate) {
      setHallInputs({ hallData, selectedDate });
    }
  }, [hallData, selectedDate, setHallInputs]);

  const { availablePeriodTimes, derivedHallStatus, openTime, closeTime } =
    useHallDerived();

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

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [isCompactView, setIsCompactView] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [scheduleAnchor, setScheduleAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
      const current = getCurrentPeriod(selectedDate, availablePeriodTimes);
      if (current !== selectedPeriod) {
        setSelectedPeriod(current);
      }
    }
  }, [availablePeriodTimes, periods, selectedDate, selectedPeriod, today]);

  const currentMenu = useMemo(
    () =>
      (hallData?.menus ?? []).find(
        (m) => m.period.name.toLowerCase() === selectedPeriod.toLowerCase(),
      ),
    [hallData, selectedPeriod],
  );

  const stations = currentMenu?.stations ?? [];

  useEffect(() => {
    if (stations.length === 0) {
      if (selectedStation !== "") {
        setSelectedStation("");
      }
      return;
    }

    const first = stations[0].name.toLowerCase();
    const isValid = stations.some(
      (s) => s.name.toLowerCase() === selectedStation,
    );

    if (!isValid) {
      setSelectedStation(first);
    }
  }, [selectedStation, stations]);

  const activeStation = stations.find(
    (s) => s.name.toLowerCase() === selectedStation,
  );

  const dishes = activeStation?.dishes ?? [];

  const hero =
    hall === HallEnum.ANTEATERY
      ? { src: "/anteatery.webp", alt: "Anteatery dining hall" }
      : { src: "/brandywine.webp", alt: "Brandywine dining hall" };

  const displayDate = selectedDate ?? today;

  return (
    <div>
      {/* Hero image & mobile header */}
      <div className="relative w-full h-[200px] md:h-[250px]">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
        {/* Mobile Header Overlay */}
        {!isDesktop && (
          <div className="absolute bottom-0 left-0 p-4 w-full text-white">
            <div className="flex items-center gap-2">
              <Typography
                variant="h4"
                fontWeight={700}
                className="mb-1 text-white"
              >
                {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
              </Typography>
              <div className="flex items-center gap-2 pl-1 text-md font-small text-white">
                {openTime && closeTime ? (
                  <>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${derivedHallStatus === HallStatusEnum.OPEN ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>
                      {derivedHallStatus === HallStatusEnum.OPEN
                        ? "Open"
                        : "Closed"}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <Link
              href={
                hall === HallEnum.ANTEATERY
                  ? ANTEATERY_MAP_LINK_URL
                  : BRANDYWINE_MAP_LINK_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="!text-xs !text-gray-200 flex items-center gap-1 underline-offset-2 !underline !decoration-white"
            >
              <LocationOn className="text-[14px]" />
              {hall === HallEnum.ANTEATERY
                ? "4001 Mesa Rd, Irvine, CA 92617"
                : "Middle Earth Community Irvine, CA 92697"}
            </Link>
          </div>
        )}
      </div>

      {/* Main content container */}
      <Container
        maxWidth={false}
        disableGutters
        className="mt-4 pb-[50px] mx-auto w-full max-w-[1600px] px-2 md:px-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-3">
          {/* Left column: menu controls & dishes */}
          <div className="w-full flex-1 md:min-h-[740px] min-w-0">
            <RestaurantControls
              hall={hall}
              isDesktop={isDesktop}
              derivedHallStatus={derivedHallStatus}
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
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
            />

            <div className="w-full">
              <DishesView
                isCompactView={isCompactView}
                stations={stations}
                activeStation={activeStation}
                isLoading={isLoading}
                isError={isError}
                error={error}
                hallData={hallData}
              />
            </div>
          </div>

          {/* Right column: hours & location (desktop only) */}
          {isDesktop && (
            <Sidebar
              displayDate={displayDate}
              periods={periods}
              availablePeriodTimes={availablePeriodTimes}
              hall={hall}
              hallEvents={hallEvents}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

function getCurrentPeriod(
  selectedDate: Date,
  periods: { [periodName: string]: [Date, Date] },
): string {
  for (const key in periods) {
    const periodBegin: Date = periods[key][0];
    const periodEnd: Date = periods[key][1];

    if (selectedDate >= periodBegin && selectedDate <= periodEnd) return key;
  }

  return Object.keys(periods)[0];
}
