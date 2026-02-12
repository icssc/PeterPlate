import { apiTest } from "@api/apiTest";
import { upsertRestaurant } from "@api/restaurants/services";
import { describe } from "vitest";

import { upsertPeriod } from "./services";

describe("upsertPeriod", () => {
  apiTest("inserts a new period", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        const upsertedPeriod = await upsertPeriod(trx, testData.period);
        expect(upsertedPeriod.id).toEqual(testData.period.id);
        expect(upsertedPeriod.name).toEqual(testData.period.name);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates an existing period", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        const _insertedPeriod = await upsertPeriod(trx, testData.period);
        const _updatedPeriod = await upsertPeriod(trx, testData.period);
        // expect(insertedPeriod.updatedAt).not.toEqual(updatedPeriod.updatedAt);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});
