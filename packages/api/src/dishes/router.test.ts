import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

describe("dish.get", () => {
  apiTest(
    "gets a dish, upserts if missing",
    async ({ api, db, expect, testData }) => {
      const result = await api.dish.get({
        ids: [testData.dishIds.at(0) ?? ""],
      });

      const dbResult = await db.query.dishes.findFirst({
        where: (dishes, { eq }) => eq(dishes.id, testData.dishIds.at(0) ?? ""),
      });

      expect(result.at(0)).not.toBe(undefined);
      expect(dbResult).not.toBe(undefined);
    },
  );

  apiTest(
    "gets multiple dishes, upserts if missing",
    async ({ api, db, expect, testData }) => {
      const result = await api.dish.get({
        ids: testData.dishIds,
      });

      const dbResult = await db.query.dishes.findMany({
        where: (dishes, { inArray }) => inArray(dishes.id, testData.dishIds),
      });

      expect(result.length).toBeGreaterThan(1);
      expect(result.length).eq(dbResult.length);
      result.forEach((dish) => {
        expect(dish).not.toBe(undefined);
      });
    },
  );

  apiTest("fails on invalid params", async ({ api, expect }) => {
    const result = await api.dish.get({
      ids: ["1"],
    });

    expect(result.length).eq(0);
  });
});

// describe("dish.rate", () => {
//   const dishId = `${testData.dish.id}2` as const; // TODO: temporary workaround since db is dirtied between tests. should clear db after procedure tests
//   apiTest("rates a dish", async ({ api, expect, testData, db }) => {
//     // await upsertRestaurant(db, testData.brandywine);
//     // await upsertStation(db, testData.station);
//     await upsertPeriod(db, testData.period);
//     await upsertMenu(db, testData.menu);
//     await upsertDish(db, {
//       ...testData.dish,
//       id: dishId,
//     });
//     await upsertUser(db, testData.user);
//     const result = await api.dish.rate({
//       ...testData.rating,
//       dishId: testData.dish.id,
//     });
//     const fetchedDish = await api.dish.get({
//       id: testData.dish.id,
//     });
//     expect(result.averageRating).toEqual(fetchedDish.totalRating);
//     expect(fetchedDish.numRatings).toEqual(1);
//   });

//   apiTest("updates existing rating", async ({ api, expect, testData, db }) => {
//     await upsertPeriod(db, testData.period);
//     await upsertMenu(db, testData.menu);
//     await upsertDish(db, {
//       ...testData.dish,
//       id: dishId,
//     });
//     await upsertUser(db, testData.user);
//     await api.dish.rate({
//       ...testData.rating,
//       dishId,
//     });
//     await api.dish.rate({
//       ...testData.rating,
//       dishId,
//       rating: testData.rating.rating + 2,
//     });
//     const fetchedDish = await api.dish.get({
//       id: dishId,
//     });
//     expect(fetchedDish.numRatings).toEqual(1);
//     expect(fetchedDish.totalRating).toEqual(testData.rating.rating + 2);

//     await api.dish.rate({
//       ...testData.rating,
//       dishId,
//     });

//     const fetchedDish2 = await api.dish.get({
//       id: dishId,
//     });
//     expect(fetchedDish2.numRatings).toEqual(1);
//     expect(fetchedDish2.totalRating).toEqual(fetchedDish.totalRating - 2);
//   });

//   apiTest("fails on invalid params", async ({ api, expect, testData }) => {
//     await expect(
//       api.dish.rate({
//         ...testData.rating,
//         dishId: 1 as unknown as "1",
//       }),
//     ).rejects.toThrow();
//   });
// });
