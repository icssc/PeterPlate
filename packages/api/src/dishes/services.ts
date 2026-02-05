import { upsert } from "@api/utils";

import type { DishToMenu, Drizzle, InsertDishWithRelations } from "@zotmeal/db";
import {
  dietRestrictions,
  dishes,
  dishesToMenus,
  nutritionInfos,
} from "@zotmeal/db";

export async function upsertDish(
  db: Drizzle,
  { dietRestriction, nutritionInfo, ...dishData }: InsertDishWithRelations,
): Promise<Omit<InsertDishWithRelations, "menuId" | "stationId">> {
  try {
    const result = await db.transaction<
      Omit<InsertDishWithRelations, "menuId" | "stationId">
    >(async (tx) => {
      // Only update image_url when the incoming value is a valid string; do not overwrite existing with null
      const dishSet = { ...dishData };
      if (
        dishSet.image_url == null ||
        typeof dishSet.image_url !== "string" ||
        dishSet.image_url.trim() === ""
      ) {
        delete dishSet.image_url;
      }
      const upsertedDish = await upsert(tx, dishes, dishData, {
        target: [dishes.id],
        set: dishSet,
      });

      const upsertedDietRestriction = await upsert(
        tx,
        dietRestrictions,
        dietRestriction,
        {
          target: dietRestrictions.dishId,
          set: dietRestriction,
        },
      );

      const upsertedNutritionInfo = await upsert(
        tx,
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
