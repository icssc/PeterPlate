"use client";

import { ExpandMore, GridView, Menu } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Container,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import type { RestaurantInfo } from "@peterplate/api";
import type { DateList } from "@peterplate/db";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import DishesInfo from "@/components/ui/dishes-info";
import { Button } from "@/components/ui/shadcn/button";
import { DatePicker } from "@/components/ui/shadcn/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { DiningHallStatus } from "@/components/ui/status";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useDate } from "@/context/date-context";
import { useHallDerived, useHallStore } from "@/context/useHallStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatOpenCloseTime, isSameDay, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { HallEnum } from "@/utils/types";

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
      <div className="relative w-full h-[200px] md:h-[260px]">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-transparent" />
      </div>

      <Container
        maxWidth={false}
        className="mt-4 pb-[50px] mx-auto w-full max-w-[1400px]"
      >
        <div className="flex flex-col md:flex-row items-start gap-3">
          <div className="w-full flex-1 md:min-h-[740px] min-w-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2 flex-wrap md:flex-nowrap">
              <Typography variant="h4" fontWeight={700}>
                {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
              </Typography>

              <div className="flex gap-2 items-center justify-start md:justify-end flex-wrap md:flex-nowrap">
                {openTime && closeTime ? (
                  <DiningHallStatus
                    status={derivedHallStatus}
                    openTime={openTime.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    closeTime={closeTime.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                ) : (
                  <DiningHallStatus status={derivedHallStatus} />
                )}

                <Select
                  value={selectedPeriod}
                  onValueChange={(value) => setSelectedPeriod(value || "")}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select Meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((time) => {
                      const mealTimeKey = time.toLowerCase();
                      const periodTimes = availablePeriodTimes[mealTimeKey];

                      return (
                        <SelectItem key={time} value={mealTimeKey}>
                          {toTitleCase(time)}&nbsp;
                          {periodTimes && (
                            <span className="text-zinc-500 text-sm">
                              &nbsp;(
                              {formatOpenCloseTime(
                                periodTimes[0],
                                periodTimes[1],
                              )}
                              )
                            </span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {calendarRange && enabledDates && (
                  <div className="w-[240px]">
                    <DatePicker
                      date={selectedDate}
                      enabledDates={enabledDates}
                      range={calendarRange}
                      onSelect={handleDateSelect}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3">
              {!isLoading && !isError && stations.length > 0 && (
                <Tabs
                  value={selectedStation}
                  onValueChange={(value) => setSelectedStation(value || "")}
                  className="flex w-full justify-center"
                >
                  <div className="overflow-x-auto">
                    <TabsList className={isDesktop ? "mx-auto" : ""}>
                      {stations.map((station) => (
                        <TabsTrigger
                          key={station.name}
                          value={station.name.toLowerCase()}
                        >
                          {toTitleCase(station.name)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </Tabs>
              )}
            </div>

            {!isLoading && !isError && dishes.length > 0 && (
              <div className="mt-2 flex justify-end w-full">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCompactView(false)}
                    className={`px-4 py-1 flex items-center justify-center ${
                      !isCompactView
                        ? "bg-sky-700 text-white border-sky-700 hover:bg-sky-700 hover:text-white"
                        : "border-sky-700 text-slate-900 hover:bg-sky-50 hover:text-slate-900"
                    }`}
                  >
                    <Menu className="mr-1" />
                    Card View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCompactView(true)}
                    className={`px-4 py-1 flex items-center justify-center ${
                      isCompactView
                        ? "bg-sky-700 text-white border-sky-700 hover:bg-sky-700 hover:text-white"
                        : "border-sky-700 text-slate-900 hover:bg-sky-50 hover:text-slate-900"
                    }`}
                  >
                    <GridView className="mr-1" />
                    Compact View
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-3">
              {activeStation && (
                <div className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible">
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {toTitleCase(activeStation.name)}
                  </Typography>
                  <DishesInfo
                    dishes={dishes}
                    isLoading={isLoading}
                    isError={isError || (!isLoading && !hallData)}
                    errorMessage={
                      error?.message ??
                      (!isLoading && !hallData
                        ? "Data not available for this hall."
                        : undefined)
                    }
                    isCompactView={isCompactView}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:basis-[325px] md:max-w-[325px] md:min-h-[740px]">
            <Paper elevation={1} className="p-4 mb-4 h-fit">
              <Typography variant="subtitle1" fontWeight={700}>
                Hours of Operation
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="mt-0.5 mb-2"
              >
                Today (
                {displayDate.toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                )
              </Typography>
              <Divider className="mb-2" />
              {periods.length > 0 ? (
                periods.map((periodKey) => {
                  const periodTimes = availablePeriodTimes?.[periodKey];
                  const periodName = toTitleCase(periodKey);
                  const hasTimes = periodTimes && periodTimes.length >= 2;

                  return (
                    <div
                      key={periodKey}
                      className="flex justify-between mb-0.5"
                    >
                      <Typography variant="body2">{periodName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hasTimes
                          ? formatOpenCloseTime(periodTimes[0], periodTimes[1])
                          : "Closed"}
                      </Typography>
                    </div>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hours data for this date.
                </Typography>
              )}
            </Paper>

            <Paper elevation={1} className="p-4 mb-4">
              <Typography variant="subtitle1" fontWeight={700}>
                Location
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="my-2"
              >
                {hall === HallEnum.ANTEATERY
                  ? "4001 Mesa Rd, Irvine, CA 92617"
                  : "Middle Earth Community Irvine, CA 92697"}
              </Typography>
              <div className="w-full h-[150px] rounded overflow-hidden mb-2">
                <iframe
                  title="Campus map location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                    hall === HallEnum.ANTEATERY
                      ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.2343796515447!2d-117.84751608771703!3d33.651088373199414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcde12deb776f1%3A0x766314500f8813c2!2sThe%20Anteatery!5e0!3m2!1sen!2sus!4v1770860208235!5m2!1sen!2sus"
                      : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3429.7763637757234!2d-117.84095176884651!3d33.64518667561823!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcde0f35ca653d%3A0xf33e49e0efd9eea5!2sBrandywine%20Commons!5e0!3m2!1sen!2sus!4v1770858688774!5m2!1sen!2sus"
                  }
                />
              </div>
              <Link
                href={
                  hall === HallEnum.ANTEATERY
                    ? "https://maps.app.goo.gl/f6KDnq227caCRyoBA"
                    : "https://maps.app.goo.gl/vTiuJzbKSwtZwZgi9"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                Directions
              </Link>
            </Paper>

            <Paper elevation={1} className="p-4">
              <Typography variant="subtitle1" fontWeight={700} className="mb-2">
                Special Schedules
              </Typography>
              {hallEvents.length > 0 ? (
                hallEvents.map((event) => {
                  const start = event.start ? new Date(event.start) : null;
                  const end = event.end ? new Date(event.end) : null;
                  const now = new Date();
                  const isActive = start && end && now >= start && now <= end;
                  const dateRange =
                    start && end
                      ? `${start.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} - ${end.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "";

                  return (
                    <Accordion
                      key={`${event.title}-${String(event.start)}-${event.restaurantId}`}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <div className="flex flex-col w-full pr-2">
                          <div className="flex justify-between items-center w-full">
                            <Typography variant="body2">
                              {event.title}
                            </Typography>
                            {isActive && (
                              <Chip
                                label="Active"
                                size="small"
                                color="primary"
                                className="h-5 text-[0.7rem]"
                              />
                            )}
                          </div>
                          <Typography variant="body2" color="text.secondary">
                            {dateRange}
                          </Typography>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">
                          {event.shortDescription ?? dateRange}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No special schedules.
                </Typography>
              )}
            </Paper>
          </div>
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
