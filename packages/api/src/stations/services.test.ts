import { apiTest } from "@api/apiTest";
import { upsertRestaurant } from "@api/restaurants/services";
import { describe } from "vitest";

import { upsertStation } from "./services";

describe("upsertStation", () => {
  apiTest("inserts a new station", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        const result = await upsertStation(trx, testData.station);
        expect(result.id).toEqual(testData.station.id);
        expect(result.name).toEqual(testData.station.name);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates a station", async ({ expect, db, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        await upsertStation(trx, testData.station);
        const result = await upsertStation(trx, {
          ...testData.station,
          name: "<UPDATED> test-station",
        });
        expect(result.name).not.toEqual(testData.station.name);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});
