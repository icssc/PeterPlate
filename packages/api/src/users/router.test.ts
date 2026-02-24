import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { upsertUser } from "./services";

describe("upsertUserProcedure", () => {
  apiTest("inserts a user", async ({ api, expect, testData }) => {
    const user = await api.user.upsert(testData.user);
    expect(user).toBeDefined();
    expect(user.id).toBe(testData.user.id);
    expect(user.name).toBe(testData.user.name);
    expect(user.email).toBe(testData.user.email);
    expect(user.emailVerified).toBe(testData.user.emailVerified);
    expect(user.image).toBe(testData.user.image);
  });

  apiTest("updates a user", async ({ api, expect, db, testData }) => {
    const insertedUser = await upsertUser(db, testData.user);
    const updatedUser = await api.user.upsert({
      ...testData.user,
      name: "Beter",
      email: "newemail@uci.edu",
      emailVerified: true,
      image: "https://example.com/pfp.png",
    });

    expect(insertedUser.updatedAt).not.toBeNull();
    expect(updatedUser.updatedAt).not.toBeNull();
    expect(updatedUser.updatedAt).not.toBe(insertedUser.updatedAt);
    expect(updatedUser.name).toBe("Beter");
    expect(updatedUser.id).toBe(testData.user.id);
    expect(updatedUser.email).toBe("newemail@uci.edu");
    expect(updatedUser.emailVerified).toBe(true);
    expect(updatedUser.image).toBe("https://example.com/pfp.png");
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
    const user = await api.user.get({ id: testData.user.id });
    expect(user).toBeDefined();
    expect(user.id).toBe(testData.user.id);
    expect(user.name).toBe(testData.user.name);
    expect(user.email).toBe(testData.user.email);
    expect(user.emailVerified).toBe(testData.user.emailVerified);
    expect(user.image).toBe(testData.user.image);
  });

  apiTest(
    "should not get an invalid user",
    async ({ api, expect }) =>
      await expect(api.user.get({ id: "invalid" })).rejects.toThrow(),
  );
});
