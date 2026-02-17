"use client";

import {
  ArrowDropDownRounded,
  ExpandMore,
  GridView,
  LocationOn,
  Menu,
  MoreVert,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { RestaurantInfo } from "@peterplate/api";
import type { DateList } from "@peterplate/db";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import DishesInfo from "@/components/ui/dishes-info";
import { Button } from "@/components/ui/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { DiningHallStatus } from "@/components/ui/status";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useDate } from "@/context/date-context";
import { useHallDerived, useHallStore } from "@/context/useHallStore";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatOpenCloseTime, isSameDay, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { HallEnum, HallStatusEnum } from "@/utils/types";

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
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
        {/* Mobile Header Overlay */}
        {!isDesktop && (
          <div className="absolute bottom-0 left-0 p-4 w-full text-white">
            <Typography
              variant="h3"
              fontWeight={700}
              className="mb-1 text-blue-500"
            >
              {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
            </Typography>
            <div className="flex items-center gap-2 text-sm font-medium mb-1 text-blue-590">
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
            <p className="text-xs text-gray-200 flex items-center gap-1">
              <LocationOn className="text-[14px]" />
              {hall === HallEnum.ANTEATERY
                ? "4001 Mesa Rd, Irvine, CA 92617"
                : "Middle Earth Community Irvine, CA 92697"}
            </p>
          </div>
        )}
      </div>

      <Container
        maxWidth={false}
        disableGutters
        className="mt-4 pb-[50px] mx-auto w-full max-w-[1400px] px-2 md:px-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-3">
          <div className="w-full flex-1 md:min-h-[740px] min-w-0">
            {/* Desktop Header Title - Hidden on Mobile */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2 flex-wrap md:flex-nowrap">
              {isDesktop && (
                <Typography
                  variant="h4"
                  fontWeight={700}
                  className="text-sky-700"
                >
                  {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
                </Typography>
              )}

              <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:justify-end">
                {/* Desktop Status */}
                {isDesktop && (
                  <div>
                    <DiningHallStatus status={derivedHallStatus} />
                  </div>
                )}

                {/* Shared Controls (Meal & Date) */}
                <div
                  className={
                    isDesktop ? "flex gap-2" : "grid grid-cols-2 gap-2 w-full"
                  }
                >
                  <div className={isDesktop ? "w-52" : "w-full"}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel
                        id="meal-select-label"
                        className="!text-blue-500 [&.Mui-focused]:!text-blue-500"
                      >
                        Meal
                      </InputLabel>
                      <Select
                        labelId="meal-select-label"
                        value={selectedPeriod}
                        label="Meal"
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        IconComponent={ArrowDropDownRounded}
                        className="bg-white [&_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&:hover_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&_.MuiSelect-select]:!py-[8px] [&_.MuiSelect-select]:!px-[12px] [&_.MuiSvgIcon-root]:!text-blue-500"
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Select Meal</em>;
                          }
                          return toTitleCase(selected);
                        }}
                      >
                        {periods.length === 0 ? (
                          <MenuItem value="" disabled>
                            Select Meal
                          </MenuItem>
                        ) : (
                          periods.map((time) => {
                            const mealTimeKey = time.toLowerCase();
                            const periodTimes = availablePeriodTimes?.[time];
                            const hasTimes =
                              periodTimes && periodTimes.length >= 2;
                            const timeString = hasTimes
                              ? formatOpenCloseTime(
                                  periodTimes[0],
                                  periodTimes[1],
                                )
                              : "Closed";

                            return (
                              <MenuItem
                                key={time}
                                value={mealTimeKey}
                                className="!flex !justify-between !items-center !gap-4"
                              >
                                <span>{toTitleCase(time)}</span>
                                <span className="text-gray-500 text-sm">
                                  {timeString}
                                </span>
                              </MenuItem>
                            );
                          })
                        )}
                      </Select>
                    </FormControl>
                  </div>

                  {calendarRange && enabledDates && (
                    <div className={isDesktop ? "w-[240px]" : "w-full"}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Select date"
                          value={selectedDate || null}
                          onChange={(newValue) =>
                            handleDateSelect(newValue || undefined)
                          }
                          minDate={calendarRange.earliest}
                          maxDate={calendarRange.latest}
                          shouldDisableDate={(date) =>
                            !enabledDates.some((enabledDate) =>
                              isSameDay(date, enabledDate),
                            )
                          }
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputLabelProps: {
                                className: "!text-blue-500",
                              },
                              className:
                                "bg-white [&_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&:hover_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&_.MuiSvgIcon-root]:!text-blue-500",
                            },
                            openPickerIcon: {
                              className: "!text-blue-500",
                            },
                            popper: {
                              placement: "bottom-end",
                              modifiers: [
                                {
                                  name: "flip",
                                  enabled: true,
                                  options: {
                                    altBoundary: true,
                                    rootBoundary: "document",
                                    padding: 8,
                                  },
                                },
                                {
                                  name: "preventOverflow",
                                  enabled: true,
                                  options: {
                                    altAxis: true,
                                    altBoundary: true,
                                    tether: true,
                                    rootBoundary: "document",
                                    padding: 8,
                                  },
                                },
                              ],
                              sx: {
                                "& .MuiPaper-root": {
                                  marginTop: "4px",
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>

                {/* Toggles & Mobile Dropdowns */}
                {!isLoading && !isError && dishes.length > 0 && (
                  <div
                    className={
                      isDesktop ? "flex gap-2" : "w-full flex gap-1 mt-2"
                    }
                  >
                    {!isDesktop && (
                      <>
                        {/* Mobile Menu Dropdown */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-between h-8 px-2 text-xs"
                              type="button"
                            >
                              Menu <Menu className="h-3 w-3 ml-1" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-2"
                            align="start"
                          >
                            <div className="flex flex-col gap-1">
                              {stations.map((station) => (
                                <button
                                  type="button"
                                  key={station.name}
                                  className="text-left px-2 py-1.5 text-sm font-medium rounded-sm hover:bg-slate-100 transition-colors"
                                  onClick={() => {
                                    const val = station.name.toLowerCase();
                                    if (isCompactView) {
                                      const element =
                                        document.getElementById(val);
                                      if (element) {
                                        element.scrollIntoView({
                                          behavior: "smooth",
                                          block: "start",
                                        });
                                      }
                                      setSelectedStation(val);
                                    } else {
                                      setSelectedStation(val);
                                    }
                                  }}
                                >
                                  {toTitleCase(station.name)}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Mobile Special Schedules Dropdown */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-[1.5] justify-between h-8 px-2 text-xs"
                              type="button"
                            >
                              Special Schedules{" "}
                              <MoreVert className="h-3 w-3 ml-1" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0"
                            align="start"
                          >
                            <div className="p-4 max-h-[400px] overflow-y-auto">
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                className="mb-2"
                              >
                                Special Schedules
                              </Typography>
                              {hallEvents.length > 0 ? (
                                hallEvents.map((event) => {
                                  const start = event.start
                                    ? new Date(event.start)
                                    : null;
                                  const end = event.end
                                    ? new Date(event.end)
                                    : null;
                                  const now = new Date();
                                  const isActive =
                                    start && end && now >= start && now <= end;
                                  const dateRange =
                                    start && end
                                      ? `${start.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                                      : "";
                                  return (
                                    <Accordion
                                      key={`${event.title}-${String(event.start)}-${event.restaurantId}`}
                                      disableGutters
                                      elevation={0}
                                      className="before:hidden border-b last:border-b-0"
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                      >
                                        <div className="flex flex-col w-full pr-2 text-left">
                                          <div className="flex justify-between items-center w-full">
                                            <Typography
                                              variant="body2"
                                              fontWeight={500}
                                            >
                                              {event.title}
                                            </Typography>
                                            {isActive && (
                                              <Chip
                                                label="Active"
                                                size="small"
                                                color="primary"
                                                className="h-5 text-[0.7rem] ml-2"
                                              />
                                            )}
                                          </div>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            {dateRange}
                                          </Typography>
                                        </div>
                                      </AccordionSummary>
                                      <AccordionDetails className="pt-0 pb-2">
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {event.shortDescription ?? dateRange}
                                        </Typography>
                                      </AccordionDetails>
                                    </Accordion>
                                  );
                                })
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  No special schedules.
                                </Typography>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </>
                    )}

                    {/* View Toggles */}
                    <div
                      className={`flex rounded-md border border-slate-200 bg-white p-1 shrink-0 ${isDesktop ? "" : "h-8 items-center"}`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => setIsCompactView(false)}
                        className={`${isDesktop ? "h-8 px-3" : "h-6 px-2"} ${!isCompactView ? "bg-slate-100 text-slate-900 font-semibold shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        <Menu className={isDesktop ? "h-4 w-4" : "h-3 w-3"} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => setIsCompactView(true)}
                        className={`${isDesktop ? "h-8 px-3" : "h-6 px-2"} ${isCompactView ? "bg-slate-100 text-slate-900 font-semibold shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        <GridView
                          className={isDesktop ? "h-4 w-4" : "h-3 w-3"}
                        />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isDesktop && (
              <div className="mt-3">
                {!isLoading && !isError && stations.length > 0 && (
                  <Tabs
                    value={selectedStation}
                    onValueChange={(value) => {
                      const val = value || "";
                      if (isCompactView) {
                        const element = document.getElementById(val);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start", // Adjust alignment
                          });
                        }
                        setSelectedStation(val);
                      } else {
                        setSelectedStation(val);
                      }
                    }}
                    className="flex w-full justify-start overflow-x-auto no-scrollbar"
                  >
                    <TabsList className="bg-transparent p-0 gap-2 h-auto flex-nowrap justify-start">
                      {stations.map((station) => (
                        <TabsTrigger
                          key={station.name}
                          value={station.name.toLowerCase()}
                          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none"
                        >
                          {toTitleCase(station.name)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </div>
            )}

            {/* Removed the Separate Buttons block as it's moved up */}

            <div className="mt-3">
              {isCompactView
                ? // Compact View: Render ALL stations
                  stations.map((station) => (
                    <div
                      key={station.name}
                      id={station.name.toLowerCase()}
                      className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible mb-8 scroll-mt-4"
                    >
                      <div className="border-b-2 mb-4">
                        <h1 className="font-bold text-3xl">
                          {toTitleCase(station.name)}
                        </h1>
                      </div>
                      <DishesInfo
                        dishes={station.dishes}
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
                  ))
                : // Normal View: Render active station logic
                  activeStation && (
                    <div className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible">
                      <div className="border-b-2 mb-4">
                        <h1 className="font-bold text-3xl">
                          {toTitleCase(activeStation.name)}
                        </h1>
                      </div>
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

          {isDesktop && (
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
                            ? formatOpenCloseTime(
                                periodTimes[0],
                                periodTimes[1],
                              )
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
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  className="mb-2"
                >
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
