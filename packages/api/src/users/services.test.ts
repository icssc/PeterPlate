import { apiTest } from "@api/apiTest";
import { describe } from "vitest";

import { getUser, upsertUser } from "./services";

describe("upsertUser", () => {
  apiTest("inserts valid user into db", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertUser(trx, testData.user);
        const fetchedUser = await getUser(trx, testData.user.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(testData.user.id);
        expect(fetchedUser?.name).toBe(testData.user.name);
        expect(fetchedUser?.email).toBe(testData.user.email);
        expect(fetchedUser?.emailVerified).toBe(testData.user.emailVerified);
        expect(fetchedUser?.image).toBe(testData.user.image);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates existing user in db", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        await upsertUser(trx, testData.user);
        await upsertUser(trx, {
          ...testData.user,
          name: "Beter",
          email: "newemail@uci.edu",
          emailVerified: true,
          image: "https://example.com/pfp.png",
        });
        const fetchedUser = await getUser(trx, testData.user.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(testData.user.id);
        expect(fetchedUser?.name).toBe("Beter");
        expect(fetchedUser?.email).toBe("newemail@uci.edu");
        expect(fetchedUser?.emailVerified).toBe(true);
        expect(fetchedUser?.image).toBe("https://example.com/pfp.png");
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});

describe("getUser", () => {
  apiTest("gets user", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const _insertedUser = await upsertUser(trx, testData.user);
        const fetchedUser = await getUser(trx, testData.user.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(testData.user.id);
        expect(fetchedUser?.name).toBe(testData.user.name);
        expect(fetchedUser?.email).toBe(testData.user.email);
        expect(fetchedUser?.emailVerified).toBe(testData.user.emailVerified);
        expect(fetchedUser?.image).toBe(testData.user.image);
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest(
    "should return null if user not found",
    async ({ db, expect }) =>
      await expect(getUser(db, "invalid")).rejects.toThrow(),
  );
});
