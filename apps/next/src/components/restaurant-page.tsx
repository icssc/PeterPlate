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
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Popover,
  Select,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
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
import { DiningHallStatus } from "@/components/ui/status";
import type { CalendarRange } from "@/components/ui/toolbar";
import { useDate } from "@/context/date-context";
import { useHallDerived, useHallStore } from "@/context/useHallStore";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatOpenCloseTime, isSameDay, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import {
  ANTEATERY_MAP_EMBED_URL,
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_EMBED_URL,
  BRANDYWINE_MAP_LINK_URL,
  HallEnum,
  HallStatusEnum,
} from "@/utils/types";

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
      <div className="relative w-full h-[200px] md:h-[350px]">
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
            {/* Header title & controls row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2 flex-wrap md:flex-nowrap">
              {/* Desktop title */}
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

                {/* Meal & date selectors */}
                <div
                  className={
                    isDesktop ? "flex gap-2" : "grid grid-cols-2 gap-2 w-full"
                  }
                >
                  <div className={isDesktop ? "w-52" : "w-full"}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel
                        id="meal-select-label"
                        className="!text-sky-700 [&.Mui-focused]:!text-sky-700"
                      >
                        Meal
                      </InputLabel>
                      <Select
                        labelId="meal-select-label"
                        value={selectedPeriod}
                        label="Meal"
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        IconComponent={ArrowDropDownRounded}
                        className="bg-white [&_fieldset]:!border-sky-700 [&:hover_fieldset]:!border-sky-700 [&_.Mui-focused_fieldset]:!border-sky-700 [&_.MuiSvgIcon-root]:!text-sky-700"
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          PaperProps: {
                            style: {
                              minWidth: "280px",
                            },
                          },
                        }}
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
                          open={isDatePickerOpen}
                          onOpen={() => setIsDatePickerOpen(true)}
                          onClose={() => setIsDatePickerOpen(false)}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              onClick: () => setIsDatePickerOpen(true),
                              InputLabelProps: {
                                className: "!text-sky-700",
                              },
                              inputProps: {
                                readOnly: true,
                                className: "!cursor-pointer",
                              },
                              className:
                                "bg-white [&_fieldset]:!border-sky-700 [&:hover_fieldset]:!border-sky-700 [&_.Mui-focused_fieldset]:!border-sky-700 [&_.MuiSvgIcon-root]:!text-sky-700 !cursor-pointer",
                            },
                            openPickerIcon: {
                              className: "!text-sky-700",
                            },
                            popper: {
                              placement: "bottom-end",
                              className: "[&_.MuiPaper-root]:mt-1",
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
                      isDesktop ? "flex gap-2" : "w-full flex gap-2 mt-2"
                    }
                  >
                    {/* Mobile-only dropdowns */}
                    {!isDesktop && (
                      <>
                        {/* Station menu dropdown */}
                        <>
                          <Button
                            variant="outlined"
                            className="!flex-[1] !h-8 !px-1 text-xs !border-sky-700 !text-black hover:bg-sky-100 !flex-nowrap !items-center"
                            type="button"
                            onClick={(e) => setMenuAnchor(e.currentTarget)}
                          >
                            Menu <Menu className="h-3 w-3 ml-1" />
                          </Button>
                          <Popover
                            open={Boolean(menuAnchor)}
                            anchorEl={menuAnchor}
                            onClose={() => setMenuAnchor(null)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            slotProps={{
                              paper: {
                                className: "w-[200px] p-2 mt-1",
                              },
                            }}
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
                                    setMenuAnchor(null);
                                  }}
                                >
                                  {toTitleCase(station.name)}
                                </button>
                              ))}
                            </div>
                          </Popover>
                        </>

                        {/* Special schedules dropdown */}
                        <>
                          <Button
                            variant="outlined"
                            className="!flex-[1.5] !h-8 !px-1 text-xs !border-sky-700 !text-black hover:bg-sky-100 !flex-nowrap !items-center"
                            type="button"
                            onClick={(e) => setScheduleAnchor(e.currentTarget)}
                          >
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              Special Schedules
                            </span>
                            <MoreVert className="h-3 w-3 ml-1 shrink-0" />
                          </Button>
                          <Popover
                            open={Boolean(scheduleAnchor)}
                            anchorEl={scheduleAnchor}
                            onClose={() => setScheduleAnchor(null)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            slotProps={{
                              paper: {
                                className: "w-[300px] p-0 mt-1",
                              },
                            }}
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
                                              fontWeight={700}
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
                          </Popover>
                        </>
                      </>
                    )}

                    {/* Mobile view toggles */}
                    {!isDesktop && (
                      <ToggleButtonGroup
                        value={isCompactView ? "compact" : "card"}
                        exclusive
                        onChange={(_event, newValue) => {
                          if (newValue !== null) {
                            setIsCompactView(newValue === "compact");
                          }
                        }}
                        size="small"
                        className="!h-8"
                      >
                        <ToggleButton
                          value="card"
                          className="!border-sky-700 !px-2 !min-w-0 aria-pressed:!bg-sky-700 aria-pressed:!text-white !bg-white !text-sky-700"
                        >
                          <Menu className="h-4 w-4" />
                        </ToggleButton>
                        <ToggleButton
                          value="compact"
                          className="!border-sky-700 !px-2 !min-w-0 aria-pressed:!bg-sky-700 aria-pressed:!text-white !bg-white !text-sky-700"
                        >
                          <GridView className="h-4 w-4" />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop station tabs & view toggles */}
            {isDesktop && (
              <div className="mt-3">
                {!isLoading && !isError && stations.length > 0 && (
                  <Tabs
                    value={selectedStation || false}
                    onChange={(_event, value: string) => {
                      const val = value || "";
                      if (isCompactView) {
                        const element = document.getElementById(val);
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
                    className="flex w-full overflow-x-auto no-scrollbar !bg-sky-700/40 !rounded-lg !p-2 [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-flexContainer]:gap-2 [&_.MuiTabs-indicator]:hidden"
                    variant="scrollable"
                    scrollButtons={false}
                  >
                    {stations.map((station) => (
                      <Tab
                        key={station.name}
                        value={station.name.toLowerCase()}
                        label={toTitleCase(station.name)}
                        className="!rounded !border !border-transparent !bg-transparent !px-4 !py-1.5 !text-sm !font-medium !text-slate-700 !normal-case !min-h-0 aria-selected:!bg-white aria-selected:!text-slate-900 aria-selected:!border-slate-200 aria-selected:!shadow-sm"
                      />
                    ))}
                  </Tabs>
                )}
                {/* Card/compact view toggles */}
                <div className="flex justify-end mt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      type="button"
                      onClick={() => setIsCompactView(false)}
                      className={`!border-sky-700 !normal-case ${!isCompactView ? "!bg-sky-700 !text-white hover:!bg-sky-700" : "!bg-white !text-sky-700 hover:!bg-sky-50"}`}
                      startIcon={<Menu className="h-4 w-4" />}
                    >
                      Card View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      type="button"
                      onClick={() => setIsCompactView(true)}
                      className={`!border-sky-700 !normal-case ${isCompactView ? "!bg-sky-700 !text-white hover:!bg-sky-700" : "!bg-white !text-sky-700 hover:!bg-sky-50"}`}
                      startIcon={<GridView className="h-4 w-4" />}
                    >
                      Compact View
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Dishes display area */}
            <div className="w-full">
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

          {/* Right column: hours & location (desktop only) */}
          {isDesktop && (
            <div className="w-full md:basis-[325px] md:max-w-[325px] md:min-h-[740px]">
              {/* Hours of operation card */}
              <Paper elevation={1} className="mb-4 overflow-hidden">
                <div className="bg-sky-500/20 px-4 py-3 border-b-2 border-sky-700">
                  <Typography
                    variant="h6"
                    className="!text-sky-700 !font-bold !text-center"
                  >
                    Hours of Operation
                  </Typography>
                </div>
                <div className="p-4">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    className="mb-3 pb-2"
                  >
                    Today (
                    {displayDate.toLocaleDateString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                    )
                  </Typography>
                  {periods.length > 0 ? (
                    <div className="space-y-2">
                      {periods.map((periodKey) => {
                        const periodTimes = availablePeriodTimes?.[periodKey];
                        const periodName = toTitleCase(periodKey);
                        const hasTimes = periodTimes && periodTimes.length >= 2;

                        return (
                          <div
                            key={periodKey}
                            className="flex justify-between items-center"
                          >
                            <Typography variant="body2">
                              {periodName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="!text-right"
                            >
                              {hasTimes
                                ? formatOpenCloseTime(
                                    periodTimes[0],
                                    periodTimes[1],
                                  )
                                : "Closed"}
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hours data for this date.
                    </Typography>
                  )}
                </div>
              </Paper>

              {/* Location card */}
              <Paper elevation={1} className="mb-4 overflow-hidden">
                <div className="bg-sky-500/20 px-4 py-3 border-b-2 border-sky-600">
                  <Typography
                    variant="h6"
                    className="!text-sky-700 !font-bold !text-center"
                  >
                    Location
                  </Typography>
                </div>
                <div className="p-4">
                  <Typography variant="body2" className="mb-3 pb-2">
                    {hall === HallEnum.ANTEATERY
                      ? "4001 Mesa Rd, Irvine, CA 92617"
                      : "Middle Earth Community Irvine, CA 92697"}
                  </Typography>
                  <div className="w-full h-[150px] rounded overflow-hidden mb-3">
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
                          ? ANTEATERY_MAP_EMBED_URL
                          : BRANDYWINE_MAP_EMBED_URL
                      }
                    />
                  </div>
                  <Link
                    href={
                      hall === HallEnum.ANTEATERY
                        ? ANTEATERY_MAP_LINK_URL
                        : BRANDYWINE_MAP_LINK_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="always"
                    className="!text-sm"
                  >
                    Directions
                  </Link>
                </div>
              </Paper>

              {/* Special Schedules card */}
              <Paper elevation={1} className="overflow-hidden">
                <div className="bg-sky-500/20 px-4 py-3 border-b-2 border-sky-600">
                  <Typography
                    variant="h6"
                    className="!text-sky-700 !font-bold !text-center"
                  >
                    Special Schedules
                  </Typography>
                </div>
                <div className="p-4">
                  {hallEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hallEvents.map((event) => {
                        const start = event.start
                          ? new Date(event.start)
                          : null;
                        const end = event.end ? new Date(event.end) : null;
                        const now = new Date();
                        const isActive =
                          start && end && now >= start && now <= end;
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
                            className="!border !border-sky-200 !rounded-lg !shadow-none before:!hidden"
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMore className="!text-sky-600" />
                              }
                              className="!min-h-0 !py-2"
                            >
                              <div className="flex flex-col w-full pr-2">
                                <div className="flex justify-between items-center w-full gap-2">
                                  <Typography
                                    variant="body2"
                                    className="!text-sky-700 !font-semibold"
                                  >
                                    {event.title}
                                  </Typography>
                                  {isActive && (
                                    <Chip
                                      label="ACTIVE"
                                      size="small"
                                      className="!h-5 !text-[0.65rem] !font-bold !bg-sky-600 !text-white !rounded-full"
                                    />
                                  )}
                                </div>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  className="!text-xs !mt-0.5"
                                >
                                  {dateRange}
                                </Typography>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails className="!pt-0 !pb-2">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {event.shortDescription ?? dateRange}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No special schedules.
                    </Typography>
                  )}
                </div>
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
