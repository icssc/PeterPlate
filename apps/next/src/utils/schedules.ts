import type { DiningSchedule } from "@peterplate/validators";

type Weekday = keyof DiningSchedule["mealPeriods"][number]["hours"];

/** Indexed like `Date.getDay()`. */
const WEEKDAYS: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Monday-first order used when a schedule is summarized by weekday. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

const MAX_DAYS_LISTED_BY_DATE = 7;

/**
 * Parses an AAPI "YYYY-MM-DD" date as a local calendar date. `new Date(str)`
 * would read it as UTC midnight, which is the previous day in Pacific time.
 */
function parseCalendarDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "07:30:00" -> "7:30AM", "16:30:00" -> "4:30PM". */
export function formatScheduleTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")}${suffix}`;
}

/**
 * "Nov 25 - Nov 29, 2026", or "Dec 12, 2026 - Jan 2, 2027" across years, or
 * "Jan 3, 2027" for a single day.
 */
export function formatScheduleDateRange(
  startDate: string,
  endDate: string,
): string {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  const withYear = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as const;
  const endLabel = end.toLocaleDateString("en-US", withYear);

  if (startDate === endDate) return endLabel;

  const startLabel =
    start.getFullYear() === end.getFullYear()
      ? start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : start.toLocaleDateString("en-US", withYear);

  return `${startLabel} - ${endLabel}`;
}

/** True when today (in Pacific time) falls within the schedule's dates. */
export function isScheduleActive(
  schedule: Pick<DiningSchedule, "startDate" | "endDate">,
  now: Date = new Date(),
): boolean {
  if (!schedule.startDate || !schedule.endDate) return false;
  const today = now.toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });
  return schedule.startDate <= today && today <= schedule.endDate;
}

export interface ScheduleHoursRow {
  period: string;
  /** e.g. "7:30AM-11:00AM", or null when the period isn't served that day. */
  hours: string | null;
}

export interface ScheduleDayGroup {
  /** e.g. "Wed, Nov 25" or "Mon - Fri"; null when every day has the same hours. */
  label: string | null;
  rows: ScheduleHoursRow[];
  /** True when no meal period is served on these days. */
  closed: boolean;
}

/**
 * Splits a special schedule's hours into runs of consecutive days that share
 * the same hours. Short schedules are described date by date; longer ones
 * repeat weekly, so they are described by weekday instead.
 */
export function getScheduleDayGroups(
  schedule: DiningSchedule,
): ScheduleDayGroup[] {
  // Only list meal periods served at some point during the schedule.
  const periods = [...schedule.mealPeriods]
    .filter((period) =>
      WEEKDAYS.some((day) => period.hours[day].open && period.hours[day].close),
    )
    .sort((a, b) => a.position - b.position);

  const rowsFor = (weekday: Weekday): ScheduleHoursRow[] =>
    periods.map((period) => {
      const { open, close } = period.hours[weekday];
      return {
        period: period.name,
        hours:
          open && close
            ? `${formatScheduleTime(open)}-${formatScheduleTime(close)}`
            : null,
      };
    });

  const days: { label: string; rows: ScheduleHoursRow[] }[] = [];
  const start = schedule.startDate && parseCalendarDate(schedule.startDate);
  const end = schedule.endDate && parseCalendarDate(schedule.endDate);
  const dayCount =
    start && end
      ? Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
      : Number.POSITIVE_INFINITY;

  if (start && end && dayCount <= MAX_DAYS_LISTED_BY_DATE) {
    for (const date = new Date(start); date <= end; ) {
      days.push({
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        rows: rowsFor(WEEKDAYS[date.getDay()]),
      });
      date.setDate(date.getDate() + 1);
    }
  } else {
    for (const dayIndex of WEEK_ORDER) {
      days.push({
        label: WEEKDAY_LABELS[dayIndex],
        rows: rowsFor(WEEKDAYS[dayIndex]),
      });
    }
  }

  // Merge consecutive days with identical hours.
  const runs: { first: string; last: string; rows: ScheduleHoursRow[] }[] = [];
  for (const day of days) {
    const previous = runs[runs.length - 1];
    if (
      previous &&
      JSON.stringify(previous.rows) === JSON.stringify(day.rows)
    ) {
      previous.last = day.label;
    } else {
      runs.push({ first: day.label, last: day.label, rows: day.rows });
    }
  }

  return runs.map((run) => ({
    label:
      runs.length === 1
        ? null
        : run.first === run.last
          ? run.first
          : `${run.first} - ${run.last}`,
    rows: run.rows,
    closed: run.rows.every((row) => row.hours === null),
  }));
}
