import type { Station } from "@api/index";
import { Tab, Tabs } from "@mui/material";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { scrollToStation, toTitleCase } from "@/utils/funcs";

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

  if (!isDesktop) return null;

  return (
    <div className="mt-3">
      {!isLoading && !isError && stations.length > 0 && (
        <Tabs
          value={selectedStation || false}
          onChange={(_event, value: string) => {
            const val = value || "";
            scrollToStation(val);
            setSelectedStation(val);
          }}
          variant="scrollable"
          scrollButtons="auto"
          slotProps={{
            startScrollButtonIcon: { fontSize: "medium" },
            endScrollButtonIcon: { fontSize: "medium" },
          }}
          className="h-[52px] w-full rounded-lg bg-primary-accent/20 px-2 dark:bg-[var(--desktop-tabs-bg)] [&_.MuiTabs-flexContainer]:h-full [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-flexContainer]:gap-10 [&_.MuiTabs-indicator]:!bg-sky-700 dark:[&_.MuiTabs-indicator]:!bg-blue-300 [&_.MuiTabScrollButton-root]:!text-slate-600 dark:[&_.MuiTabScrollButton-root]:!text-slate-300 [&_.MuiTabScrollButton-root.Mui-disabled]:!opacity-30"
        >
          {stations.map((station) => (
            <Tab
              key={station.name}
              value={station.name.toLowerCase()}
              label={toTitleCase(station.name)}
              className="!whitespace-nowrap !max-w-none !px-4!text-base !font-medium !text-black dark:!text-white !normal-case !min-h-0 aria-selected:!text-sky-700 dark:aria-selected:!text-blue-300"
            />
          ))}
        </Tabs>
      )}
    </div>
  );
}
