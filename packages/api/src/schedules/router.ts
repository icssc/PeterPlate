import { createTRPCRouter, publicProcedure } from "@api/trpc";
import type { DiningSchedule } from "@peterplate/validators";
import { getDiningSchedulesResponseSchema } from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AAPI_DINING_ROUTE } from "..";

/** Fetch the special (date-ranged) schedules for one dining hall from AAPI.
 *  AAPI leaves out schedules that ended before today, so this returns current
 *  and upcoming schedules only, sorted by start date.
 */
async function fetchSpecialSchedules(
  restaurant: "anteatery" | "brandywine",
): Promise<DiningSchedule[]> {
  const res = await fetch(
    `${AAPI_DINING_ROUTE}/schedules?restaurantId=${restaurant}`,
  );

  if (!res.ok)
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: `Could not reach AAPI schedules endpoint: ${res.statusText}`,
    });

  const parsed = getDiningSchedulesResponseSchema.safeParse(await res.json());

  if (!parsed.success)
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse schedules response: ${parsed.error}`,
    });

  return parsed.data.data
    .filter((schedule) => schedule.type === "special")
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}

export const scheduleRouter = createTRPCRouter({
  /** Get current and upcoming special schedules for a dining hall. */
  special: publicProcedure
    .input(z.object({ restaurant: z.enum(["anteatery", "brandywine"]) }))
    .query(({ input }) => fetchSpecialSchedules(input.restaurant)),
});
