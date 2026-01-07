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
        });
        const fetchedUser = await getUser(trx, testData.user.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(testData.user.id);
        expect(fetchedUser?.name).toBe("Beter");
        trx.rollback();
      }),
    ).rejects.toThrowError("Rollback");
  });
});

describe("getUser", () => {
  apiTest("gets user", async ({ db, expect, testData }) => {
    await expect(
      db.transaction(async (trx) => {
        const insertedUser = await upsertUser(trx, testData.user);
        const fetchedUser = await getUser(trx, testData.user.id);
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(testData.user.id);
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
