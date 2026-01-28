import type { Drizzle, InsertDishWithRelations } from "@zotmeal/db";
import { AllergenKeys, type DiningHallInformation, PreferenceKeys } from "@zotmeal/validators";
import { InsertDishWithModifiedRelations } from "../daily/parse";
import { upsertDish, upsertDishToMenu } from "@api/dishes/services";

type BaseDietRestriction = Omit<InsertDishWithRelations["dietRestriction"], "dishId" | "createdAt" | "updatedAt">;

/**
 * Parses the dish's allergen and preference codes, transforming the codes into 
 * a boolean-based format for ease-of-use, before upserting the dish finally.
 * @param db Drizzle db instance
 * @param restaurantInfo restaurantInfo for preference and allergen codes
 * @param dish dish to upsert
 * @param menuIdHash hash of menu to upsert dish into
 */
export async function parseAndUpsertDish(
  db: Drizzle,
  restaurantInfo: DiningHallInformation,
  dish: InsertDishWithModifiedRelations,
  menuIdHash: string,
) {
  let baseDietRestriction = {} as BaseDietRestriction;

  // Parse available allergens and add to diet restriction if present
  AllergenKeys.forEach(key => {
    const containsKey = 
      `contains${key.replaceAll(" ", "")}` as keyof typeof baseDietRestriction;
    const allergenCode: number 
      = restaurantInfo.allergenIntoleranceCodes[key] ?? -1;

    baseDietRestriction[containsKey] = dish.recipeAllergenCodes.has(allergenCode);
  });

  // Parse available preferences and add to diet restriction if present
  PreferenceKeys.forEach(key => {
    const isKey = 
      `is${key.replaceAll(" ", "")}` as keyof typeof baseDietRestriction;
    const preferenceCode: number 
      = restaurantInfo.menuPreferenceCodes[key] ?? -1;

    baseDietRestriction[isKey] = dish.recipePreferenceCodes.has(preferenceCode);
  });

  // Compile diet restriction with dish ID
  let dietRestriction: InsertDishWithRelations["dietRestriction"] = {
    dishId: dish.id,
    ...baseDietRestriction
  };

  // Remove sets from dish before upserting
  const { recipeAllergenCodes, recipePreferenceCodes, ...currentDish } = dish;
  
  await upsertDish(db, {
    ...currentDish,
    dietRestriction,
    nutritionInfo: dish.nutritionInfo,
  })

  await upsertDishToMenu(db, {
    dishId: dish.id,
    menuId: menuIdHash
  })
}