import { apiTest } from "@api/apiTest";
import { upsertDish } from "@api/dishes/services";
import { upsertMenu } from "@api/menus/services";
import { upsertPeriod } from "@api/periods/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertStation } from "@api/stations/services";
import { upsertUser } from "@api/users/services";
import { describe } from "vitest";
import { upsertRating } from "./services";

describe("upsertRating", () => {
  apiTest("inserts a rating", async ({ expect, db, testData }) => {
    await expect(
      async () =>
        await db.transaction(async (trx) => {
          await upsertRestaurant(trx, testData.brandywine);
          await upsertStation(trx, testData.station);
          await upsertPeriod(trx, testData.period);
          await upsertMenu(trx, testData.menu);
          await upsertDish(trx, testData.dish);
          await upsertUser(trx, testData.user);
          const result = await upsertRating(trx, testData.rating);
          expect(result.rating).toEqual(testData.rating.rating);
          trx.rollback();
        }),
    ).rejects.toThrowError("Rollback");
  });

  apiTest("updates a rating", async ({ expect, db, testData }) => {
    await expect(
      async () =>
        await db.transaction(async (trx) => {
          await upsertRestaurant(trx, testData.brandywine);
          await upsertStation(trx, testData.station);
          await upsertPeriod(trx, testData.period);
          await upsertMenu(trx, testData.menu);
          await upsertDish(trx, testData.dish);
          await upsertUser(trx, testData.user);
          const insertedRating = await upsertRating(trx, testData.rating);
          const newRating = await upsertRating(trx, {
            ...testData.rating,
            rating: testData.rating.rating + 1,
          });
          expect(newRating.rating).not.toEqual(insertedRating.rating);
          trx.rollback();
        }),
    ).rejects.toThrowError("Rollback");
  });
});

// describe("getNumRatingsByDishId", () => {
//   apiTest(
//     "returns the number of ratings for a dish",
//     async ({ expect, db }) => {
//       await expect(
//         async () =>
//           await db.transaction(async (trx) => {
//             await upsertDish(trx, dish);
//             await upsertUser(trx, user);
//             await upsertUser(trx, {
//               ...user,
//               id: "1",
//             });
//             await upsertUser(trx, {
//               ...user,
//               id: "2",
//             });

//             let numRatings = await getNumRatingsByDishId(trx, dish.id);
//             expect(numRatings).toEqual(0);
//             const result = await upsertRating(trx, rating);
//             numRatings = await getNumRatingsByDishId(trx, result.dishId);
//             expect(numRatings).toEqual(1);

// await upsertRating(trx, {
//   ...rating,
//   userId: "1",
// });

// await upsertRating(trx, {
//   ...rating,
//   userId: "2",
// });

// numRatings = await getNumRatingsByDishId(trx, result.dishId);
// expect(numRatings).toEqual(3);
//             trx.rollback();
//           }),
//       ).rejects.toThrowError("Rollback");
//     },
//   );
// });

// describe("getTotalRatingByDishId", () => {
//   apiTest("returns the total rating for a dish", async ({ expect, db }) => {
//     await expect(
//       async () =>
//         await db.transaction(async (trx) => {
//           await upsertDish(trx, dish);
//           await upsertUser(trx, user);
//           await upsertUser(trx, {
//             id: "2",
//             name: "User 1",
//           });
//           await upsertRating(trx, rating);
//           await upsertRating(trx, {
//             ...rating,
//             userId: "2",
//           });
//           let totalRating = await getTotalRatingByDishId(trx, rating.dishId);
//           expect(totalRating).toEqual(10);
//           await upsertRating(trx, {
//             ...rating,
//             rating: 1,
//           });
//           totalRating = await getTotalRatingByDishId(trx, rating.dishId);
//           expect(totalRating).toEqual(6);
//           trx.rollback();
//         }),
//     ).rejects.toThrowError("Rollback");
//   });
// });
