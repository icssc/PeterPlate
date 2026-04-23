import { apiTest } from "@api/apiTest";
import { upsertUser } from "@api/users/services";
import { describe } from "vitest";
import { upsertDishesIfMissing } from "./services";

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

describe("dish.rate", () => {
  apiTest("rates a dish", async ({ api, expect, testData, db }) => {
    await upsertDishesIfMissing(db, [
      {
        id: testData.dish.id,
        numRatings: 0,
        totalRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await upsertUser(db, testData.user);
    const result = await api.dish.rate({
      ...testData.rating,
      dishId: testData.dish.id,
    });
    const fetchedDishes = await api.dish.get({
      ids: [testData.dish.id],
    });
    expect(result.averageRating).toEqual(fetchedDishes[0]?.totalRating);
    expect(fetchedDishes[0]?.numRatings).toEqual(1);
  });

  apiTest("updates existing rating", async ({ api, expect, testData, db }) => {
    await upsertDishesIfMissing(db, [
      {
        id: testData.dish.id,
        numRatings: 0,
        totalRating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await upsertUser(db, testData.user);
    await api.dish.rate({
      ...testData.rating,
    });
    await api.dish.rate({
      ...testData.rating,
      rating: testData.rating.rating + 2,
    });
    const fetchedDish = await api.dish.get({
      ids: [testData.dish.id],
    });
    expect(fetchedDish.at(0)?.numRatings).toEqual(1);
    expect(fetchedDish.at(0)?.totalRating).toEqual(testData.rating.rating + 2);

    await api.dish.rate({
      ...testData.rating,
    });

    const fetchedDish2 = await api.dish.get({
      ids: [testData.dish.id],
    });
    expect(fetchedDish2.at(0)?.numRatings).toEqual(1);
    expect(fetchedDish2.at(0)?.totalRating).toEqual(testData.rating.rating);
  });

  apiTest("fails on invalid params", async ({ api, expect, testData }) => {
    await expect(
      api.dish.rate({
        ...testData.rating,
        dishId: 1 as unknown as "1",
      }),
    ).rejects.toThrow();
  });
});
