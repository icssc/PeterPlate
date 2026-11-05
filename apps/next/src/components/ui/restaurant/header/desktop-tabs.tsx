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
          className="flex w-full overflow-x-auto no-scrollbar !bg-primary-accent/20 dark:!bg-[var(--desktop-tabs-bg)] !rounded-lg !p-2 [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-flexContainer]:gap-2 [&_.MuiTabs-indicator]:hidden"
          variant="scrollable"
          scrollButtons={false}
        >
          {stations.map((station) => (
            <Tab
              key={station.name}
              value={station.name.toLowerCase()}
              label={toTitleCase(station.name)}
              className="!rounded !border !border-transparent !bg-transparent !px-4 !py-1.5 !text-sm !font-medium !text-black dark:!text-white !normal-case !min-h-0 aria-selected:!bg-white dark:aria-selected:!bg-white aria-selected:!text-slate-900 dark:aria-selected:!text-gray-900 aria-selected:!border-slate-200 dark:aria-selected:!border-slate-200 aria-selected:!shadow-sm"
            />
          ))}
        </Tabs>
      )}
    </div>
  );
}
