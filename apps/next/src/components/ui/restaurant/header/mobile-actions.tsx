import {
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
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { toTitleCase } from "@/utils/funcs";

interface MobileActionsProps {
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  dishes: any[];
  stations: any[];
  menuAnchor: HTMLElement | null;
  setMenuAnchor: (el: HTMLElement | null) => void;
  scheduleAnchor: HTMLElement | null;
  setScheduleAnchor: (el: HTMLElement | null) => void;
  hallEvents: any[];
  isCompactView: boolean;
  setIsCompactView: (isCompact: boolean) => void;
  setSelectedStation: (station: string) => void;
}

export function MobileActions({
  isDesktop,
  isLoading,
  isError,
  dishes,
  stations,
  menuAnchor,
  setMenuAnchor,
  scheduleAnchor,
  setScheduleAnchor,
  hallEvents,
  isCompactView,
  setIsCompactView,
  setSelectedStation,
}: MobileActionsProps) {
  if (isDesktop) return null;

  return (
    <>
      {!isLoading && !isError && dishes.length > 0 && (
        <div className="w-full flex gap-2 mt-2">
          {/* Station menu dropdown */}
          <>
            <Button
              variant="outlined"
              className="!flex-[1] !h-8 !px-1 text-xs !border-sky-700 !text-black hover:bg-sky-100 !flex-nowrap !items-center"
              type="button"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              Menu <MenuIcon className="h-3 w-3 ml-1" />
            </Button>
            <Popover
              open={Boolean(menuAnchor)}
              anchorEl={menuAnchor}
              onClose={() => setMenuAnchor(null)}
              disableScrollLock
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
              disableScrollLock
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
                        className="before:hidden border-b last:border-b-0"
                      >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <div className="flex flex-col w-full pr-2 text-left">
                            <div className="flex justify-between items-center w-full">
                              <Typography variant="body2" fontWeight={700}>
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
              </div>
            </Popover>
          </>

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
              className="!border-sky-700 !px-2 !min-w-0 aria-pressed:!bg-sky-700 aria-pressed:!text-white !bg-white !text-sky-700"
            >
              <MenuIcon className="h-4 w-4" />
            </ToggleButton>
            <ToggleButton
              value="compact"
              className="!border-sky-700 !px-2 !min-w-0 aria-pressed:!bg-sky-700 aria-pressed:!text-white !bg-white !text-sky-700"
            >
              <GridView className="h-4 w-4" />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
    </>
  );
}
