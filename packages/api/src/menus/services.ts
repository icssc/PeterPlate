import type { Drizzle } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";
import { z } from "zod";
import { AAPI_DINING_ROUTE } from "..";
import type { PickableDatesPayload } from "../dining/types";

const retrieveDatesResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    earliest: z.string().date().nullable(),
    latest: z.string().date().nullable(),
  }),
});

type RetrieveDatesResponse = z.infer<typeof retrieveDatesResponseSchema>;

const MENUS_DISABLED_ERROR =
  "Menu upserts are unavailable because dining menu data now comes from AnteaterAPI.";

export async function upsertMenu(_db: Drizzle, _menu: unknown) {
  throw new Error(MENUS_DISABLED_ERROR);
}

export async function upsertMenuBatch(_db: Drizzle, _menuBatch: unknown[]) {
  throw new Error(MENUS_DISABLED_ERROR);
}

/**
 * AnteaterAPI currently describes its Dates route as earliest/latest only.
 * PeterPlate's date picker expects a discrete `Date[]`, so we expand the range
 * into day-sized entries normalized to Noon UTC.
 */
export async function getPickableDates(
  _db: Drizzle,
): Promise<PickableDatesPayload> {
  const response = await fetch(`${AAPI_DINING_ROUTE}/dateRange`);

  if (!response.ok) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Could not reach AnteaterAPI dates endpoint.",
    });
  }

  const result = (await response.json()) as RetrieveDatesResponse;
  const parsedResult = retrieveDatesResponseSchema.safeParse(result);

  if (!parsedResult.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse AnteaterAPI dates response: ${parsedResult.error.message}`,
    });
  }

  const { earliest, latest } = parsedResult.data.data;
  const firstDate = toLocalDate(earliest);
  const lastDate = toLocalDate(latest);

  if (!firstDate || !lastDate) return null;

  const dates: Date[] = [];

  for (
    let current = firstDate;
    current <= lastDate;
    current = addDays(current, 1)
  )
    dates.push(new Date(current));

  return dates;
}

function toLocalDate(dateString: string | null): Date | null {
  if (!dateString) return null;

  const [y, m, d] = dateString.split("-").map(Number);

  if (!y || !m || !d) return null;

  return new Date(Date.UTC(y, m - 1, d, 12));
}
