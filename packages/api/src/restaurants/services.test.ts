import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { upsertRestaurant } from "./services";

describe("upsertRestaurant", () => {
  apiTest(
    "inserts a new restaurant",
    async ({ expect, db, testData }) =>
      await expect(
        db.transaction(async (trx) => {
          const fetchedRestaurant = await upsertRestaurant(
            trx,
            testData.brandywine,
          );
          expect(fetchedRestaurant.id).toEqual(testData.brandywine.id);
          expect(fetchedRestaurant.name).toEqual(testData.brandywine.name);
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback"),
  );

  apiTest(
    "updates an existing restaurant",
    async ({ expect, db, testData }) =>
      await expect(
        db.transaction(async (trx) => {
          const insertedRestaurant = await upsertRestaurant(
            trx,
            testData.brandywine,
          );
          const updatedRestaurant = await upsertRestaurant(
            trx,
            testData.brandywine,
          );
          expect(insertedRestaurant.updatedAt).not.toEqual(
            updatedRestaurant.updatedAt,
          );
          trx.rollback();
        }),
      ).rejects.toThrowError("Rollback"),
  );
});
