"use client";

import { ExpandMore, GridView, Menu } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
    <Box>
      <Box position="relative" width="100%" height={{ xs: 200, md: 260 }}>
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          className="object-cover object-bottom"
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)",
          }}
        />
      </Box>

      <Container
        maxWidth={false}
        sx={{ mt: 4, mb: 6, mx: "auto", width: "100%", maxWidth: 1292 }}
      >
        <Box
          display="flex"
          flexDirection={isDesktop ? "row" : "column"}
          alignItems="flex-start"
          gap={3}
        >
          <Box
            sx={{
              flexBasis: isDesktop ? 968 : "100%",
              maxWidth: isDesktop ? 968 : "100%",
              width: isDesktop ? 300 : "100%",
              minHeight: isDesktop ? 740 : "auto",
            }}
          >
            <Box
              display="flex"
              flexDirection={isDesktop ? "row" : "column"}
              alignItems={isDesktop ? "center" : "flex-start"}
              justifyContent="space-between"
              gap={2}
              mb={2}
              sx={{ flexWrap: isDesktop ? "nowrap" : "wrap" }}
            >
              <Typography variant="h4" fontWeight={700}>
                {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
              </Typography>

              <Box
                display="flex"
                gap={2}
                alignItems="center"
                justifyContent={isDesktop ? "flex-end" : "flex-start"}
                sx={{ flexWrap: isDesktop ? "nowrap" : "wrap" }}
              >
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
                  <Box sx={{ width: 240 }}>
                    <DatePicker
                      date={selectedDate}
                      enabledDates={enabledDates}
                      range={calendarRange}
                      onSelect={handleDateSelect}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box mt={3}>
              {!isLoading && !isError && stations.length > 0 && (
                <Tabs
                  value={selectedStation}
                  onValueChange={(value) => setSelectedStation(value || "")}
                  className="flex w-full justify-center"
                >
                  <div className="overflow-x-auto">
                    <TabsList className="mx-auto">
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
            </Box>

            {!isLoading && !isError && dishes.length > 0 && (
              <Box
                mt={2}
                display="flex"
                justifyContent="flex-end"
                className="w-full"
              >
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
              </Box>
            )}

            <Box mt={3}>
              {activeStation && (
                <Box
                  sx={{
                    "& #food-scroll": {
                      height: "auto",
                      overflowY: "visible",
                    },
                  }}
                >
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
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              flexBasis: isDesktop ? 300 : "100%",
              maxWidth: isDesktop ? 300 : "100%",
              width: "100%",
              minHeight: isDesktop ? 740 : "auto",
            }}
          >
            <Paper elevation={1} sx={{ p: 2, mb: 2, height: "fit-content" }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Hours of Operation
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 1 }}
              >
                Today (
                {displayDate.toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
                )
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {periods.length > 0 ? (
                periods.map((periodKey) => {
                  const periodTimes = availablePeriodTimes?.[periodKey];
                  const periodName = toTitleCase(periodKey);
                  const hasTimes = periodTimes && periodTimes.length >= 2;

                  return (
                    <Box
                      key={periodKey}
                      display="flex"
                      justifyContent="space-between"
                      mb={0.5}
                    >
                      <Typography variant="body2">{periodName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hasTimes
                          ? formatOpenCloseTime(periodTimes[0], periodTimes[1])
                          : "Closed"}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hours data for this date.
                </Typography>
              )}
            </Paper>

            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Location
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                Middle Earth Community Irvine, CA 92697
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 150,
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 1,
                }}
              >
                <iframe
                  title="Campus map location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.123456789!2d-117.8441234!3d33.6467890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM4JzQ4LjQiTiAxMTfCsDUwJzM4LjgiVw!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                />
              </Box>
              <Link
                href="https://www.google.com/maps/dir/?api=1&destination=557+E+Peltason+Dr+Irvine+CA+92617"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: "0.875rem" }}
              >
                Directions
              </Link>
            </Paper>

            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
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
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                          pr={1}
                        >
                          <Typography variant="body2">{event.title}</Typography>
                          <Box display="flex" gap={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {dateRange}
                            </Typography>
                            {isActive && (
                              <Chip
                                label="Active"
                                size="small"
                                color="primary"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                        </Box>
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
          </Box>
        </Box>
      </Container>
    </Box>
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
