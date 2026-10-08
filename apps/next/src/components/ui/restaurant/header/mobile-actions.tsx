import type { Station } from "@api/index";
import {
  Close as CloseIcon,
  ExpandMore,
  GridView,
  Menu as MenuIcon,
  MoreVert,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Drawer,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { DishWithRating, Event } from "@peterplate/validators";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { toTitleCase } from "@/utils/funcs";
import { cn } from "@/utils/tw";

interface MobileActionsProps {
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  dishes: DishWithRating[];
  stations: Station[];
  hallEvents: Event[];
}

export function MobileActions({
  isDesktop,
  isLoading,
  isError,
  dishes,
  stations,
  hallEvents,
}: MobileActionsProps) {
  const isMenuDrawerOpen = useRestaurantUIStore((s) => s.isMenuDrawerOpen);
  const setIsMenuDrawerOpen = useRestaurantUIStore(
    (s) => s.setIsMenuDrawerOpen,
  );
  const isScheduleDrawerOpen = useRestaurantUIStore(
    (s) => s.isScheduleDrawerOpen,
  );
  const setIsScheduleDrawerOpen = useRestaurantUIStore(
    (s) => s.setIsScheduleDrawerOpen,
  );
  const isCompactView = useRestaurantUIStore((s) => s.isCompactView);
  const setIsCompactView = useRestaurantUIStore((s) => s.setIsCompactView);
  const selectedStation = useRestaurantUIStore((s) => s.selectedStation);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);

  if (isDesktop) return null;

  return (
    <>
      {!isLoading && !isError && dishes.length > 0 && (
        <div className="w-full flex gap-2 mt-2">
          {/* Station menu drawer */}
          <Button
            variant="outlined"
            className="!flex-[1] !h-8 !px-1 text-xs !border-sky-700 dark:!border-blue-300 !text-black dark:!text-white hover:bg-sky-100 dark:hover:!bg-zinc-700 !flex-nowrap !items-center"
            type="button"
            onClick={() => setIsMenuDrawerOpen(true)}
          >
            Menu <MenuIcon className="h-3 w-3 ml-1" />
          </Button>
          <Drawer
            anchor="bottom"
            open={isMenuDrawerOpen}
            onClose={() => setIsMenuDrawerOpen(false)}
            slotProps={{
              paper: {
                className:
                  "p-0 overflow-hidden rounded-t-[16px] h-auto max-h-[80vh] flex flex-col min-h-0 bg-white dark:bg-[var(--surface-elevated)] dark:border-t dark:border-blue-300/30",
                sx: { backgroundImage: "none" },
              },
            }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                Stations
              </Typography>
              <IconButton
                onClick={() => setIsMenuDrawerOpen(false)}
                size="small"
                className="!text-gray-500 dark:!text-zinc-400"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <div className="flex flex-col p-2 gap-1 overflow-y-auto">
              {stations.map((station) => {
                const isSelected =
                  selectedStation === station.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={station.name}
                    className={cn(
                      "text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isSelected
                        ? "bg-sky-700 text-white dark:bg-blue-300 dark:text-gray-900"
                        : "text-neutral-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[var(--surface-tinted)]",
                    )}
                    onClick={() => {
                      const val = station.name.toLowerCase();
                      if (isCompactView) {
                        const element = document.getElementById(val);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }
                      setSelectedStation(val);
                      setIsMenuDrawerOpen(false);
                    }}
                  >
                    {toTitleCase(station.name)}
                  </button>
                );
              })}
            </div>
          </Drawer>

          {/* Special schedules drawer */}
          <Button
            variant="outlined"
            className="!flex-[1.5] !h-8 !px-1 text-xs !border-sky-700 dark:!border-blue-300 !text-black dark:!text-white hover:bg-sky-100 dark:hover:!bg-zinc-700 !flex-nowrap !items-center"
            type="button"
            onClick={() => setIsScheduleDrawerOpen(true)}
          >
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Special Schedules
            </span>
            <MoreVert className="h-3 w-3 ml-1 shrink-0" />
          </Button>
          <Drawer
            anchor="bottom"
            open={isScheduleDrawerOpen}
            onClose={() => setIsScheduleDrawerOpen(false)}
            slotProps={{
              paper: {
                className:
                  "p-0 overflow-hidden rounded-t-[16px] h-auto max-h-[85vh] flex flex-col min-h-0 bg-white dark:bg-[var(--surface-elevated)] dark:border-t dark:border-blue-300/30",
                sx: { backgroundImage: "none" },
              },
            }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                Special Schedules
              </Typography>
              <IconButton
                onClick={() => setIsScheduleDrawerOpen(false)}
                size="small"
                className="!text-gray-500 dark:!text-zinc-400"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
            <div className="p-4 overflow-y-auto">
              {hallEvents.length > 0 ? (
                hallEvents.map((event) => {
                  const start = event.start ? new Date(event.start) : null;
                  const end = event.end ? new Date(event.end) : null;
                  const now = new Date();
                  const isActive = start && end && now >= start && now <= end;
                  const dateRange =
                    start && end
                      ? `${start.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                      : "";
                  return (
                    <Accordion
                      key={`${event.title}-${String(event.start)}-${event.restaurantId}`}
                      disableGutters
                      elevation={0}
                      className="before:hidden border-b dark:border-blue-300/30 last:border-b-0 dark:bg-transparent"
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMore className="dark:text-blue-300" />
                        }
                        className="dark:!bg-transparent"
                      >
                        <div className="flex flex-col w-full pr-2 text-left">
                          <div className="flex justify-between items-center w-full">
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="primary"
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
                          <Typography variant="caption" color="text.secondary">
                            {dateRange}
                          </Typography>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails className="pt-0 pb-2">
                        <Typography variant="body2" color="text.secondary">
                          {event.description ?? dateRange}
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
            </div>
          </Drawer>

          {/* Mobile view toggles */}
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
              className="!border-sky-700 dark:!border-blue-300 !px-2 !min-w-0 aria-pressed:!bg-sky-700 dark:aria-pressed:!bg-blue-300 aria-pressed:!text-white dark:aria-pressed:!text-gray-900 !bg-white dark:!bg-transparent !text-sky-700 dark:!text-blue-300"
            >
              <MenuIcon className="h-4 w-4" />
            </ToggleButton>
            <ToggleButton
              value="compact"
              className="!border-sky-700 dark:!border-blue-300 !px-2 !min-w-0 aria-pressed:!bg-sky-700 dark:aria-pressed:!bg-blue-300 aria-pressed:!text-white dark:aria-pressed:!text-gray-900 !bg-white dark:!bg-transparent !text-sky-700 dark:!text-blue-300"
            >
              <GridView className="h-4 w-4" />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
    </>
  );
}
