import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { weekly } from ".";

// TODO: runs too slow, tried it on local db and on test container
describe("weekly", () => {
  apiTest.skip(
    "populates db with menus and events",
    { timeout: 600_000 },
    async ({ expect, db }) => {
      await expect(
        db.transaction(async (trx) => {
          await weekly(trx);
          const menus = await trx.query.menus.findMany();
          expect(menus.length).toBeGreaterThan(0);
          const events = await trx.query.events.findMany();
          expect(events.length).toBeGreaterThan(0);
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback");
    },
  );
});
