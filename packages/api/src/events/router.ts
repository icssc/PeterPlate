import { createTRPCRouter, publicProcedure } from "@api/trpc";
import type { Event } from "@peterplate/validators";
import { getDiningEventsResponseSchema } from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import { subYears } from "date-fns";
import { AAPI_DINING_ROUTE } from "..";

/** Fetch events for both halls from AAPI.
 *  In the event of a failure on one of the halls, serves the other one only.
 *  In the event of both failing, throws an error.
 */
async function fetchEvents(params = ""): Promise<Event[]> {
  const eventsReq: [Response, Response] = [
    await fetch(`${AAPI_DINING_ROUTE}/events?restaurantId=anteatery${params}`),
    await fetch(`${AAPI_DINING_ROUTE}/events?restaurantId=brandywine${params}`),
  ];

  if (!eventsReq[0].ok) console.warn("Unable to fetch Anteatery events.");
  if (!eventsReq[1].ok) console.warn("Unable to fetch Brandwine events.");

  const availableData = eventsReq.filter((fetchedData) => fetchedData.ok);

  if (availableData.length === 0)
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Could not reach AAPI events endpoint.",
    });

  const eventPromises = availableData.map(async (eventResponse) => {
    const parsedData = getDiningEventsResponseSchema.safeParse(
      await eventResponse.json(),
    );

    if (!parsedData.success)
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: `Could not parse event response: ${parsedData.error}`,
      });

    return parsedData.data.data satisfies Event[];
  });

  const nestedEvents = await Promise.all(eventPromises);
  return nestedEvents.flat();
}

export const eventRouter = createTRPCRouter({
  /** Get all events that are happening today or later. */
  upcoming: publicProcedure.query(() => fetchEvents()),

  /** Get upcoming events plus events from the past year.
   *  AAPI only returns ended events when given a date range.
   */
  upcomingAndPast: publicProcedure.query(() => {
    const after = subYears(new Date(), 1).toLocaleDateString("en-CA", {
      timeZone: "America/Los_Angeles",
    });
    return fetchEvents(`&after=${after}`);
  }),

  /** Get all events that are happening in between two dates **/
  // inBetween: publicProcedure
  //   .input(z.object({ after: z.date(), before: z.date() }))
  //   .query(
  //     async ({ ctx: { db }, input }) =>
  //       await db.query.events.findMany({
  //         where: (event, { and, gte, lte }) =>
  //           and(gte(event.start, input.after), lte(event.end, input.before)),
  //       }),
  //   ),
});
