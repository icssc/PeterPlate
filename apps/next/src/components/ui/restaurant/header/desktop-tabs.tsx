import type { Station } from "@api/index";
import { GridView, Menu as MenuIcon } from "@mui/icons-material";
import { Button, Tab, Tabs } from "@mui/material";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { toTitleCase } from "@/utils/funcs";

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

  if (!isDesktop) return null;

  return (
    <div className="mt-3">
      {!isLoading && !isError && stations.length > 0 && (
        <Tabs
          value={selectedStation || false}
          onChange={(_event, value: string) => {
            const val = value || "";
            const element = document.getElementById(`station-${val}`);
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
            setSelectedStation(val);
          }}
          className="flex w-full overflow-x-auto no-scrollbar !rounded-[6px] !bg-[#CDE2F1] !p-1 dark:!bg-[#46566a] [&_.MuiTabs-flexContainer]:w-full [&_.MuiTabs-flexContainer]:justify-between [&_.MuiTabs-flexContainer]:gap-1 [&_.MuiTabs-indicator]:hidden"
          variant="scrollable"
          scrollButtons={false}
        >
          {stations.map((station) => (
            <Tab
              key={station.id}
              value={station.id}
              label={toTitleCase(station.name)}
              className="!min-h-0 !flex-1 !rounded-[5px] !border !border-transparent !px-4 !py-2 !font-poppins !text-[13px] !font-semibold !normal-case !leading-none !text-slate-900 dark:!text-white aria-selected:!border-white aria-selected:!bg-white aria-selected:!text-slate-900 aria-selected:!shadow-sm dark:aria-selected:!border-white dark:aria-selected:!bg-white dark:aria-selected:!text-slate-900"
            />
          ))}
        </Tabs>
      )}
      {/* Card / compact view toggles */}
      <div className="flex justify-end mt-2">
        <div className="flex gap-2">
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
