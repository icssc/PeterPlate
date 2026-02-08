import { logger } from "@api/logger";
import { upsertPeriod } from "@api/periods/services";
import type { Drizzle, RestaurantId } from "@peterplate/db";
import type { MealPeriodWithHours, Schedule } from "@peterplate/validators";

export async function upsertPeriods(
  db: Drizzle,
  restaurantId: RestaurantId,
  dateString: string,
  dayOfWeek: number,
  mealPeriods: MealPeriodWithHours[],
) {
  const periodsResult = await Promise.allSettled(
    mealPeriods.map((period) =>
      upsertPeriod(db, {
        id: period.id.toString(),
        date: dateString,
        restaurantId: restaurantId,
        name: period.name,
        startTime: period.openHours[dayOfWeek] ?? "",
        endTime: period.closeHours[dayOfWeek] ?? "",
      }),
    ),
  );

  for (const period of periodsResult)
    if (period.status === "rejected") {
      const reason = period.reason;
      let periodDetail = "unknown period";
      if (
        reason &&
        typeof reason === "object" &&
        "value" in reason &&
        reason.value &&
        typeof reason.value === "object" &&
        "name" in reason.value &&
        typeof reason.value.name === "string"
      ) {
        periodDetail = `period '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        periodDetail = `Error: ${reason.message}`;
      } else {
        periodDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert period ${periodDetail} for ${restaurantId}.`,
        reason,
      );
    }
}

/**
 * Returns the current schedule, if in a special meal schedule date/week.
 * Otherwise, defaults to standard schedule.
 * @param schedules a list of schedules to search
 * @param date the date of the schedule to get
 */
export function getCurrentSchedule(
  schedules: Schedule[],
  date: Date,
): Schedule {
  return (
    schedules.find((schedule) => {
      if (!(schedule.startDate && schedule.endDate)) return false;
      else return date >= schedule.startDate && date <= schedule.endDate;
    }) ??
    // NOTE: We will assert that a standard schedule will always be returned..
    // if this no longer applies in the future, God help you.
    // biome-ignore lint/style/noNonNullAssertion: See above.
    schedules.find((schedule) => schedule.type === "standard")!
  );
}
