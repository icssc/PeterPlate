import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { formatOpenCloseTime, toTitleCase } from "@/utils/funcs";
import {
  ANTEATERY_MAP_EMBED_URL,
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_EMBED_URL,
  BRANDYWINE_MAP_LINK_URL,
  HallEnum,
} from "@/utils/types";

interface SidebarProps {
  displayDate: Date;
  periods: string[];
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
  hall: HallEnum;
  hallEvents: any[]; // Using any for now as the type wasn't explicitly exported in the original file, or I need to import it if available.
}

export function Sidebar({
  displayDate,
  periods,
  availablePeriodTimes,
  hall,
  hallEvents,
}: SidebarProps) {
  return (
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
          <Typography variant="body2" fontWeight={600} className="mb-3 pb-2">
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
                    <Typography variant="body2">{periodName}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="!text-right"
                    >
                      {hasTimes
                        ? formatOpenCloseTime(
                            periodTimes[0], // These are definitely defined if hasTimes is true
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
                    className="!border !border-sky-200 !rounded-lg !shadow-none before:!hidden"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore className="!text-sky-600" />}
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
                      <Typography variant="body2" color="text.secondary">
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
  );
}
