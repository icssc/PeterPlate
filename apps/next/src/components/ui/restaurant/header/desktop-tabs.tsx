import { GridView, Menu as MenuIcon } from "@mui/icons-material";
import { Button, Tab, Tabs } from "@mui/material";
import { toTitleCase } from "@/utils/funcs";

interface DesktopTabsProps {
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  stations: any[];
  selectedStation: string;
  setSelectedStation: (station: string) => void;
  isCompactView: boolean;
  setIsCompactView: (isCompact: boolean) => void;
}

export function DesktopTabs({
  isDesktop,
  isLoading,
  isError,
  stations,
  selectedStation,
  setSelectedStation,
  isCompactView,
  setIsCompactView,
}: DesktopTabsProps) {
  if (!isDesktop) return null;

  return (
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
            startIcon={<MenuIcon className="h-4 w-4" />}
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
  );
}
