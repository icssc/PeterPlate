import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { upsertUser } from "./services";

describe("upsertUserProcedure", () => {
  apiTest("inserts a user", async ({ api, expect, testData }) => {
    const user = await api.user.upsert(testData.user);
    expect(user).toBeDefined();
  });

  apiTest("updates a user", async ({ api, expect, db, testData }) => {
    const insertedUser = await upsertUser(db, testData.user);
    const updatedUser = await api.user.upsert({
      ...testData.user,
      name: "Beter",
    });
    expect(updatedUser.updatedAt).not.toBe(insertedUser.updatedAt);
    expect(updatedUser.name).toBe("Beter");
  });

  // Maybe not necessary
  apiTest("should not upsert an invalid user", async ({ api, expect }) => {
    await expect(
      api.user.upsert({
        id: 1 as unknown as string,
        name: "Peter",
        email: "panteater@uci.edu",
        emailVerified: false,
        image: "",
      }),
    ).rejects.toThrow();
  });
});

describe("getUserProcedure", () => {
  apiTest("gets a user", async ({ api, expect, testData, db }) => {
    const insertedUser = await upsertUser(db, testData.user);
    console.log("insertedUser:", insertedUser);
    const user = await api.user.get({ id: testData.user.id });
    expect(user).toBeDefined();
  });

  apiTest(
    "should not get an invalid user",
    async ({ api, expect }) =>
      await expect(api.user.get({ id: "invalid" })).rejects.toThrow(),
  );
});
