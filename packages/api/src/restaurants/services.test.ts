import { apiTest } from "@api/apiTest";
import { describe } from "vitest";
import { getRestaurantByDate } from "./services";

describe("getRestaurants", () => {
  apiTest(
    "gets brandywine dishes",
    async ({ expect, db }) => {
      const results = await getRestaurantByDate("brandywine", db, new Date());

      expect(results.name).eq("brandywine");
      expect(results.periods.length).gte(1);
    },
    10000,
  );

  apiTest(
    "gets anteatery dishes",
    async ({ expect, db }) => {
      const results = await getRestaurantByDate("anteatery", db, new Date());

      expect(results.name).eq("anteatery");
      expect(results.periods.length).gte(1);
    },
    10000,
  );
});
