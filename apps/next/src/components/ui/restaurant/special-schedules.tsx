"use client";

import { ExpandMore } from "@mui/icons-material";
import { Collapse, Typography } from "@mui/material";
import type { DiningSchedule } from "@peterplate/validators";
import { useId, useMemo, useState } from "react";
import {
  formatScheduleDateRange,
  getScheduleDayGroups,
  isScheduleActive,
} from "@/utils/schedules";
import { cn } from "@/utils/tw";

interface SpecialSchedulesProps {
  schedules: DiningSchedule[];
  isLoading: boolean;
  isError: boolean;
}

/** Expandable list of a dining hall's current and upcoming special schedules. */
export function SpecialSchedules({
  schedules,
  isLoading,
  isError,
}: SpecialSchedulesProps) {
  if (isLoading || isError || schedules.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {isLoading
          ? "Loading special schedules..."
          : isError
            ? "Couldn't load special schedules."
            : "No special schedules."}
      </Typography>
    );
  }

  return (
    <div className="space-y-2">
      {schedules.map((schedule) => (
        <SpecialScheduleItem
          key={`${schedule.upstreamId}-${schedule.startDate}`}
          schedule={schedule}
        />
      ))}
    </div>
  );
}

function SpecialScheduleItem({ schedule }: { schedule: DiningSchedule }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const dayGroups = useMemo(() => getScheduleDayGroups(schedule), [schedule]);
  const isActive = isScheduleActive(schedule);
  const dateRange =
    schedule.startDate && schedule.endDate
      ? formatScheduleDateRange(schedule.startDate, schedule.endDate)
      : "";

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center gap-2 rounded-md border border-sky-700 bg-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-sky-50 dark:border-blue-300 dark:hover:bg-white/5"
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex flex-wrap items-center gap-x-1.5">
            <span className="text-sm font-semibold text-sky-700 dark:text-blue-300">
              {schedule.name}
            </span>
            {isActive && (
              <span className="rounded-full bg-sky-700 px-1.5 text-[0.65rem] font-semibold leading-4 text-white dark:bg-blue-300 dark:text-gray-900">
                Active
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            {dateRange}
          </span>
        </span>
        <ExpandMore
          fontSize="small"
          className={cn(
            "shrink-0 text-sky-700 transition-transform dark:text-blue-300",
            expanded && "rotate-180",
          )}
        />
      </button>

      <Collapse in={expanded} id={detailsId}>
        <div className="mt-1 space-y-2 rounded-md bg-slate-100 px-2.5 py-2 text-xs text-gray-700 dark:bg-[var(--surface-tinted)] dark:text-zinc-200">
          {dayGroups.map((group) => (
            <div key={group.label ?? "all-days"} className="space-y-0.5">
              {group.label && (
                <div className="flex justify-between gap-2 font-semibold text-sky-700 dark:text-blue-300">
                  <span>{group.label}</span>
                  {group.closed && (
                    <span className="font-normal text-gray-700 dark:text-zinc-200">
                      Closed
                    </span>
                  )}
                </div>
              )}
              {group.closed
                ? !group.label && <div>Closed</div>
                : group.rows.map((row) => (
                    <div
                      key={row.period}
                      className="flex justify-between gap-2"
                    >
                      <span>{row.period}</span>
                      <span className="text-right">
                        {row.hours ?? "Closed"}
                      </span>
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
