import { Link, Paper, Typography } from "@mui/material";
import type { DiningSchedule } from "@peterplate/validators";
import type React from "react";
import { formatOpenCloseTime, toTitleCase } from "@/utils/funcs";
import {
  ANTEATERY_MAP_EMBED_URL,
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_EMBED_URL,
  BRANDYWINE_MAP_LINK_URL,
  HallEnum,
} from "@/utils/types";
import { SpecialSchedules } from "./special-schedules";
import { TodayEvents } from "./today-events";

interface SidebarProps {
  displayDate: Date;
  periods: string[];
  availablePeriodTimes: Record<string, [Date, Date] | null> | undefined;
  hall: HallEnum;
  hallEvents: any[]; // Using any for now as the type wasn't explicitly exported in the original file, or I need to import it if available.
  specialSchedules: DiningSchedule[];
  isSpecialSchedulesLoading: boolean;
  isSpecialSchedulesError: boolean;
}

function SidebarSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      id={id}
      elevation={0}
      className="mb-4 overflow-hidden dark:bg-[var(--surface-modal)]"
      sx={{ border: 1, borderColor: "divider" }}
    >
      <div className="bg-primary-accent/20 px-4 py-3">
        <Typography
          variant="h6"
          className="font-bold text-center text-sky-700 dark:text-blue-300"
        >
          {title}
        </Typography>
      </div>
      <div className="p-4">{children}</div>
    </Paper>
  );
}

export function Sidebar({
  displayDate,
  periods,
  availablePeriodTimes,
  hall,
  hallEvents,
  specialSchedules,
  isSpecialSchedulesLoading,
  isSpecialSchedulesError,
}: SidebarProps) {
  return (
    <div className="w-full md:basis-[325px] md:max-w-[325px] md:min-h-[740px]">
      <TodayEvents events={hallEvents} />

      {/* Hours of operation card */}
      <SidebarSection title={"Hours of Operation"}>
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
      </SidebarSection>

      {/* Location card */}
      <SidebarSection title="Location">
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
      </SidebarSection>

      {/* Special Schedules card */}
      <SidebarSection title="Special Schedules" id="tour-special-schedules">
        <SpecialSchedules
          schedules={specialSchedules}
          isLoading={isSpecialSchedulesLoading}
          isError={isSpecialSchedulesError}
        />
      </SidebarSection>
    </div>
  );
}
