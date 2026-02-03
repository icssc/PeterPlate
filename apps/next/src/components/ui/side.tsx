"use client"; 

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./shadcn/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shadcn/select";
import { DiningHallStatus } from "./status";
import DishesInfo from "./dishes-info";
import { HallEnum, HallStatusEnum, MealTimeEnum} from "@/utils/types";
import { trpc } from "@/utils/trpc"; // Import tRPC hook
import { RestaurantInfo } from "@zotmeal/api"; // Import types
import { toTitleCase, utcToPacificTime, formatOpenCloseTime, isSameDay, militaryToStandard } from "@/utils/funcs";
import TabsSkeleton from "./skeleton/tabs-skeleton";
import SelectSkeleton from "./skeleton/select-skeleton";
import { useDate } from "@/context/date-context";
import { SyncAlt, Refresh } from "@mui/icons-material"
import { Button } from "./shadcn/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useHallDerived, useHallStore } from "@/context/useHallStore";


/**
 * Props for the {@link Side} component.
 */
interface SideProps {
  /** The specific dining hall to display information for. */
  hall: HallEnum;
  /** A function for toggling between sides on mobile. */
  toggleHall?: () => void;
}

/**
 * `Side` is a client component that displays detailed information for a specific dining hall.
 * It fetches data using tRPC, manages loading and error states, and allows users to select
 * meal periods and stations to view available dishes. It also displays the dining hall's
 * current status (open/closed/preview) and a hero image.
 * @param {SideProps} props - The properties for the Side component.
 * @returns {JSX.Element} The rendered side panel for the specified dining hall.
 */
export default function Side({ hall, toggleHall }: SideProps): JSX.Element {
  const { selectedDate } = useDate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const today = useHallStore(s => s.today);
  const setHallInputs = useHallStore(s => s.setInputs);

  /** Fetch data */
  const { data, isLoading, isError, error } = trpc.zotmeal.useQuery(
    { date: selectedDate! },
    { staleTime: 2 * 60 * 60 * 1000 }
  );

  /** Raw hall data (NOT derived) */
  const hallData: RestaurantInfo | undefined =
    !isLoading && !isError && data
      ? hall === HallEnum.ANTEATERY
        ? data.anteatery
        : data.brandywine
      : undefined;

  /** Push raw inputs into Zustand */
  useEffect(() => {
    if (hallData && selectedDate) {
      setHallInputs({ hallData, selectedDate });
    }
  }, [hallData, selectedDate, setHallInputs]);

  /** Read derived data */
  const {
    availablePeriodTimes,
    derivedHallStatus,
    openTime,
    closeTime,
  } = useHallDerived();

  /** Sort meal periods */
  const periods = Object.keys(availablePeriodTimes).sort((a, b) => {
    return availablePeriodTimes[a][0] <= availablePeriodTimes[b][0] ? -1 : 1;
  });

  /** UI state */
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedStation, setSelectedStation] = useState("");

  /** Sync selectedPeriod with derived periods */
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
  }, [periods, selectedDate, today, availablePeriodTimes]);


  /** Stations */
  const currentMenu = hallData?.menus.find(
    m => m.period.name.toLowerCase() === selectedPeriod.toLowerCase()
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
      s => s.name.toLowerCase() === selectedStation
    );

    if (!isValid) {
      setSelectedStation(first);
    }
  }, [stations, hall]);

  const dishes =
    stations.find(s => s.name.toLowerCase() === selectedStation)?.dishes ?? [];

  /** Hero image */
  const hero =
    hall === HallEnum.ANTEATERY
      ? { src: "/anteatery.webp", alt: "Anteatery dining hall" }
      : { src: "/brandywine.webp", alt: "Brandywine dining hall" };

    return (
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <div className="relative w-full min-h-[20vh] max-h-[30vh] h-2/5">
          <Image 
            className="object-cover object-bottom"
            src={hero.src}
            alt={hero.alt}
            // width={2000}
            // height={2000}
            fill
            priority 
          />
          {!isDesktop && toggleHall && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-[68px] right-3 rounded-full bg-white shadow-md"
              onClick={() => toggleHall()}
            >
              <SyncAlt className="text-black-500 w-5 h-5" />
            </Button>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow h-1" id="side-content"> 
          <div className="flex flex-col gap-4 sm:gap-6 items-center">
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 w-full">
              {isLoading && <SelectSkeleton/>}
              {!isLoading && !isError && 
              <div>
                <Select
                  value={selectedPeriod}
                  onValueChange={(value) => setSelectedPeriod(value || '')}
                >
                  <SelectTrigger className=" w-full sm:w-52">
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
                              &nbsp;({formatOpenCloseTime(periodTimes[0], periodTimes[1])})
                            </span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>}
              {!isLoading && !isError && openTime && closeTime && // Ensure openTime and closeTime are defined
              <div className="flex justify-center sm:justify-start">
                <DiningHallStatus
                  status={derivedHallStatus}
                  openTime={openTime.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                  closeTime={closeTime.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                />
              </div>}
            </div>
            {!isLoading && !isError && stations.length > 0 && (
              <Tabs
                value={selectedStation}
                onValueChange={(value) => setSelectedStation(value || '')}
                className="flex w-full justify-center" 
              >
                <div className="overflow-x-auto">
                  <TabsList className="mx-auto">
                      {stations.map((station => {
                        return (
                          <TabsTrigger key={station.name} value={station.name.toLowerCase()}>
                            {toTitleCase(station.name)}
                          </TabsTrigger>
                        )
                      }))}
                  </TabsList>
                </div>
              </Tabs>
            )}
            {isLoading && <TabsSkeleton/> /* Tab Skeleton */}
            {!isLoading && !isError && stations.length === 0 && selectedPeriod && (
                 <p className="text-center text-gray-500 py-2">No stations found for {toTitleCase(selectedPeriod)}.</p>
            )}
            {!isLoading && !isError && stations.length === 0 && !selectedPeriod && (
                 <p className="text-center text-gray-500 py-2">No stations found.</p>
            )}
          </div>

          <DishesInfo 
            dishes={dishes}
            isLoading={isLoading}
            isError={isError || (!isLoading && !hallData)} 
            errorMessage={error?.message ?? (!isLoading && !hallData ? `Data not available for ${HallEnum[hall]}.` : undefined)}
          />
        </div>
      </div>
    )
}

/**
 * Determines the current meal period based on the selected date and a list of available meal periods with their start and end times.
 * If the selected date falls within a meal period, that period's key (name) is returned.
 * If no period matches, it defaults to the first period in the provided list.
 * @param {Date} selectedDate - The date/time to check against the meal periods.
 * @param {{ [periodName: string]: [Date, Date] }} periods - An object where keys are period names (e.g., "breakfast")
 *                                                            and values are tuples containing the start and end Date objects for that period.
 * @returns {string} The key/name of the current or default meal period.
 */
function getCurrentPeriod(selectedDate: Date, periods: { [periodName: string]: [Date, Date] }): string {
  for (let key in periods) {
    let periodBegin: Date = periods[key][0];
    let periodEnd: Date = periods[key][1];

    if (selectedDate >= periodBegin && selectedDate <= periodEnd)
      return key;

  }

  return Object.keys(periods)[0];
}
