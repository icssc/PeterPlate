import type { Station } from "@api/index";
import {
  ChevronLeft,
  ChevronRight,
  GridView,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Button, IconButton, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { scrollToStation, toTitleCase } from "@/utils/funcs";

/** Max stations shown on the bar at once; arrows page through the rest. */
const VISIBLE_STATIONS = 5;

interface DesktopTabsProps {
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  stations: Station[];
}

export function DesktopTabs({
  isDesktop,
  isLoading,
  isError,
  stations,
}: DesktopTabsProps) {
  const selectedStation = useRestaurantUIStore((s) => s.selectedStation);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);
  const isCompactView = useRestaurantUIStore((s) => s.isCompactView);
  const setIsCompactView = useRestaurantUIStore((s) => s.setIsCompactView);

  const [windowStart, setWindowStart] = useState(0);
  const maxStart = Math.max(0, stations.length - VISIBLE_STATIONS);

  // Keep the window in range and make sure the selected station is visible.
  useEffect(() => {
    const idx = stations.findIndex(
      (s) => s.name.toLowerCase() === selectedStation,
    );
    setWindowStart((start) => {
      let next = Math.min(start, maxStart);
      if (idx !== -1) {
        if (idx < next) next = idx;
        else if (idx >= next + VISIBLE_STATIONS)
          next = idx - VISIBLE_STATIONS + 1;
      }
      return Math.max(0, Math.min(next, maxStart));
    });
  }, [selectedStation, stations, maxStart]);

  if (!isDesktop) return null;

  const visibleStations = stations.slice(
    windowStart,
    windowStart + VISIBLE_STATIONS,
  );
  const canGoBack = windowStart > 0;
  const canGoForward = windowStart < maxStart;
  const showArrows = stations.length > VISIBLE_STATIONS;

  return (
    <div className="mt-3">
      {!isLoading && !isError && stations.length > 0 && (
        <div className="flex h-[52px] w-full flex-row items-stretch rounded-lg bg-primary-accent/20 px-2 dark:bg-[var(--desktop-tabs-bg)]">
          {showArrows && (
            <IconButton
              aria-label="Previous stations"
              disabled={!canGoBack}
              onClick={() => setWindowStart((s) => Math.max(0, s - 1))}
              className="!self-center !h-9 !w-9 !text-slate-500 disabled:!opacity-30"
            >
              <ChevronLeft />
            </IconButton>
          )}
          <Tabs
            value={
              visibleStations.some(
                (s) => s.name.toLowerCase() === selectedStation,
              )
                ? selectedStation
                : false
            }
            onChange={(_event, value: string) => {
              const val = value || "";
              scrollToStation(val);
              setSelectedStation(val);
            }}
            className="flex h-full min-h-0 min-w-0 flex-1 [&_.MuiTabs-flexContainer]:h-full [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-indicator]:!h-0.5 [&_.MuiTabs-indicator]:!bg-sky-700 dark:[&_.MuiTabs-indicator]:!bg-blue-300"
          >
            {visibleStations.map((station) => (
              <Tab
                key={station.name}
                value={station.name.toLowerCase()}
                label={toTitleCase(station.name)}
                className="!flex-auto !whitespace-nowrap !max-w-none !px-3 !text-base !font-medium !text-black dark:!text-white !normal-case !min-h-0 aria-selected:!text-sky-700 dark:aria-selected:!text-blue-300"
              />
            ))}
          </Tabs>
          {showArrows && (
            <IconButton
              aria-label="Next stations"
              disabled={!canGoForward}
              onClick={() => setWindowStart((s) => Math.min(maxStart, s + 1))}
              className="!self-center !h-9 !w-9 !text-slate-500 disabled:!opacity-30"
            >
              <ChevronRight />
            </IconButton>
          )}
        </div>
      )}
      {/* Card / compact view toggles */}
      <div className="flex justify-end mt-2">
        <div id="tour-view-toggle-desktop" className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            type="button"
            onClick={() => setIsCompactView(false)}
            className={`!min-w-0 !w-10 !h-10 !p-0 !border-sky-700 dark:!border-blue-300 !normal-case ${!isCompactView ? "!bg-sky-700 !text-white hover:!bg-sky-700 dark:!bg-blue-300 dark:!text-gray-900" : "!bg-white !text-sky-700 hover:!bg-sky-50 dark:!bg-transparent dark:!text-white"}`}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            type="button"
            onClick={() => setIsCompactView(true)}
            className={`!min-w-0 !w-10 !h-10 !p-0 !border-sky-700 dark:!border-blue-300 !normal-case ${isCompactView ? "!bg-sky-700 !text-white hover:!bg-sky-700 dark:!bg-blue-300 dark:!text-gray-900" : "!bg-white !text-sky-700 hover:!bg-sky-50 dark:!bg-transparent dark:!text-white"}`}
          >
            <GridView className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
