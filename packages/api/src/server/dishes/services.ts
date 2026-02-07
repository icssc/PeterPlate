import { upsertDish, upsertDishToMenu } from "@api/dishes/services";
import type { Drizzle, InsertDishWithRelations } from "@peterplate/db";
import {
  AllergenKeys,
  type DiningHallInformation,
  PreferenceKeys,
} from "@peterplate/validators";
import type { InsertDishWithModifiedRelations } from "../daily/parse";

type BaseDietRestriction = Omit<
  InsertDishWithRelations["dietRestriction"],
  "dishId" | "createdAt" | "updatedAt"
>;

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
  const baseDietRestriction = {} as BaseDietRestriction;

  // Parse available allergens and add to diet restriction if present
  AllergenKeys.forEach((key) => {
    const containsKey =
      `contains${key.replaceAll(" ", "")}` as keyof typeof baseDietRestriction;
    const allergenCode: number =
      restaurantInfo.allergenIntoleranceCodes[key] ?? -1;

    baseDietRestriction[containsKey] =
      dish.recipeAllergenCodes.has(allergenCode);
  });

  // Parse available preferences and add to diet restriction if present
  PreferenceKeys.forEach((key) => {
    const isKey =
      `is${key.replaceAll(" ", "")}` as keyof typeof baseDietRestriction;
    const preferenceCode: number =
      restaurantInfo.menuPreferenceCodes[key] ?? -1;

    baseDietRestriction[isKey] = dish.recipePreferenceCodes.has(preferenceCode);
  });

  // Compile diet restriction with dish ID
  const dietRestriction: InsertDishWithRelations["dietRestriction"] = {
    dishId: dish.id,
    ...baseDietRestriction,
  };

  // Remove sets from dish before upserting
  const { recipeAllergenCodes, recipePreferenceCodes, ...currentDish } = dish;

  await upsertDish(db, {
    ...currentDish,
    dietRestriction,
    nutritionInfo: dish.nutritionInfo,
  });

  await upsertDishToMenu(db, {
    dishId: dish.id,
    menuId: menuIdHash,
  });
}
