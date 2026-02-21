import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { and, gte, lte } from "drizzle-orm";
import { z } from "zod";

export const eventRouter = createTRPCRouter({
  /** Get all events that are happening today or later. */
  upcoming: publicProcedure.query(
    async ({ ctx: { db } }) =>
      await db.query.events.findMany({
        where: (event, { gte }) => gte(event.end, new Date()),
      }),
  ),

  /** Get all events that are happening in between two dates **/
  inBetween: publicProcedure
    .input(z.object({ after: z.date(), before: z.date() }))
    .query(
      async ({ ctx: { db }, input }) =>
        await db.query.events.findMany({
          where: (event, { and, gte, lte }) =>
            and(gte(event.start, input.after), lte(event.end, input.before)),
        }),
    ),
});
