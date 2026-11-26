import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

describe("schedule.special", () => {
  apiTest(
    "returns only special schedules for the requested hall, sorted by start date",
    async ({ api, expect }) => {
      const results = await api.schedule.special({ restaurant: "anteatery" });

      for (const schedule of results) {
        expect(schedule.type).toBe("special");
        expect(schedule.restaurantId).toBe("anteatery");
        expect(schedule.startDate).not.toBeNull();
        expect(schedule.endDate).not.toBeNull();
      }

      const startDates = results.map((schedule) => schedule.startDate ?? "");
      expect(startDates).toEqual([...startDates].sort());
    },
  );
});
