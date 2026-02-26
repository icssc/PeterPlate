import { apiTest } from "@api/apiTest";
import { upsertMenu } from "@api/menus/services";
import { upsertPeriod } from "@api/periods/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import { describe } from "vitest";
import { upsertDish } from "./services";

describe("upsertDish", () => {
  apiTest("inserts a dish", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        await upsertStation(trx, testData.station);
        await upsertPeriod(trx, testData.period);
        await upsertMenu(trx, testData.menu);
        const result = await upsertDish(trx, testData.dish);
        expect(result.id).toEqual(testData.dish.id);
        expect(result.dietRestriction).toBeDefined();
        expect(result.nutritionInfo).toBeDefined();
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates a dish", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertRestaurant(trx, testData.brandywine);
        await upsertStation(trx, testData.station);
        await upsertPeriod(trx, testData.period);
        await upsertMenu(trx, testData.menu);
        const insertResult = await upsertDish(trx, testData.dish);
        const updateResult = await upsertDish(trx, {
          ...testData.dish,
          name: "New dish name",
        });
        expect(updateResult.updatedAt).not.toEqual(insertResult.updatedAt);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});
