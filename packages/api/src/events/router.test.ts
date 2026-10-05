import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

describe("getEvents", () => {
  apiTest(
    "gets all events that are happening today or later",
    async ({ api, expect }) => {
      const results = await api.event.upcoming();

      expect(results.length).gte(1);
    },
  );

  apiTest.todo("gets no events if no events are happening today or later");
});
