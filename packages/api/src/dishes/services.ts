import { upsert } from "@api/utils";

import type {
  DishToMenu,
  Drizzle,
  InsertDishWithRelations,
} from "@peterplate/db";
import {
  dietRestrictions,
  dishes,
  dishesToMenus,
  nutritionInfos,
} from "@peterplate/db";

export async function upsertDish(
  db: Drizzle,
  { dietRestriction, nutritionInfo, ...dishData }: InsertDishWithRelations,
): Promise<Omit<InsertDishWithRelations, "stationId">> {
  try {
    const result = await db.transaction<
      Omit<InsertDishWithRelations, "stationId">
    >(async (tx) => {
      const txDb = tx as unknown as Drizzle;

      const upsertedDish = await upsert(txDb, dishes, dishData, {
        target: [dishes.id],
        set: dishData,
      });

      const upsertedDietRestriction = await upsert(
        txDb,
        dietRestrictions,
        dietRestriction,
        {
          target: dietRestrictions.dishId,
          set: dietRestriction,
        },
      );

      const upsertedNutritionInfo = await upsert(
        txDb,
        nutritionInfos,
        nutritionInfo,
        {
          target: nutritionInfos.dishId,
          set: nutritionInfo,
        },
      );

      return {
        ...upsertedDish,
        dietRestriction: upsertedDietRestriction,
        nutritionInfo: upsertedNutritionInfo,
      };
    });

    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const upsertDishToMenu = async (db: Drizzle, dishToMenu: DishToMenu) =>
  await upsert(db, dishesToMenus, dishToMenu, {
    target: [dishesToMenus.dishId, dishesToMenus.menuId],
    set: dishToMenu,
  });
