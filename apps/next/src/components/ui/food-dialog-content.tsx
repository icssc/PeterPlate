"use client"; // Need state for toggling nutrient visibility

import { StarBorder } from "@mui/icons-material";
import { Button, DialogContent } from "@mui/material";
import type { DishInfo } from "@zotmeal/api";
import Image from "next/image";
import { useState } from "react";
import {
  enhanceDescription,
  formatFoodName,
  formatNutrientLabel,
  formatNutrientValue,
  toTitleCase,
} from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
import { nutrientToUnit } from "@/utils/types";
import IngredientsDialog from "../ingredients-dialog";
import { AllergenBadge } from "./allergen-badge";
import InteractiveStarRating from "./interactive-star-rating";

/**
 * `FoodDialogContent` renders the detailed view of a food item (dish) within a dialog.
 * It displays the dish's image (placeholder for now), name, calories, restaurant,
 * dietary restriction badges (e.g., vegetarian, vegan), a description,
 * and a collapsible list of nutritional information.
 *
 * Users can toggle the visibility of the full nutrient list.
 *
 * This component is typically used as the content for a `Dialog` triggered by a {@link FoodCard}.
 *
 * @param {DishInfo} dish - The dish data to display. See {@link DishInfo} (from `@zotmeal/api`) for detailed property descriptions.
 * @returns {JSX.Element} The rendered content for the food item dialog.
 */
export default function FoodDialogContent({ dish }: { dish: DishInfo }) {
  const [showAllNutrients, setShowAllNutrients] = useState(false);
  const initialNutrients = [
    "calories",
    "totalFatG",
    "totalCarbsG",
    "proteinG",
    "sugarsG",
  ]; // Define which nutrients to show initially
  const recognizedNutrients = initialNutrients.concat([
    "transFatG",
    "saturatedFatG",
    "cholesterolMg",
    "sodiumMg",
    "calciumMg",
    "ironMg",
  ]);

  const ingredientsAvailable: boolean =
    dish.ingredients != null && dish.ingredients.length > 0;
  const caloricInformationAvailable: boolean =
    dish.nutritionInfo.calories != null &&
    dish.nutritionInfo.calories.length > 0;

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );
  const averageRating = ratingData?.averageRating ?? 0;
  // const ratingCount = ratingData?.ratingCount ?? 0;

  return (
    <div className="font-poppins">
      <Image
        src={"/zm-card-header.webp"}
        alt={"An image of zotmeal logo."}
        width={1200}
        height={700}
        className="w-full h-40 object-cover"
      />
      <div className="max-w-lg mx-auto w-full">
        <DialogContent sx={{ padding: "0 16px !important" }}>
          <div className="flex flex-col gap-6 pb-6 pt-4">
            <div className="flex flex-col gap-2">
              <div
                className="flex justify-between px-4 items-center"
                id="food-header-info"
              >
                <div className="flex gap-3 items-center">
                  <h2 className="text-3xl font-bold leading-tight tracking-normal text-sky-700">
                    {formatFoodName(dish.name)}
                  </h2>
                  {/* <Pin className="stroke-zinc-500"/> */}
                </div>
                <InteractiveStarRating dishId={dish.id} />
              </div>
              <div className="px-4 flex flex-wrap items-center gap-2 text-zinc-500">
                <span className="whitespace-nowrap flex items-center gap-1">
                  <StarBorder
                    className="w-4 h-4 stroke-zinc-400"
                    strokeWidth={1.5}
                  />
                  {averageRating.toFixed(1)} • {toTitleCase(dish.restaurant)} •{" "}
                  {!caloricInformationAvailable
                    ? "-"
                    : `${Math.round(parseFloat(dish.nutritionInfo.calories ?? "0"))} cal`}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {dish.dietRestriction.isVegetarian && (
                    <AllergenBadge variant={"vegetarian"} />
                  )}
                  {dish.dietRestriction.isVegan && (
                    <AllergenBadge variant={"vegan"} />
                  )}
                  {dish.dietRestriction.isGlutenFree && (
                    <AllergenBadge variant={"gluten_free"} />
                  )}
                  {dish.dietRestriction.isKosher && (
                    <AllergenBadge variant={"kosher"} />
                  )}
                </div>
              </div>
              <p className="text-black px-4 leading-relaxed">
                {enhanceDescription(dish.name, dish.description)}
              </p>
              <div>
                <h1 className="px-4 text-2xl font-bold">Nutrients</h1>
                <div
                  className="grid grid-cols-2 gap-x-4 w-full px-4 text-black mb-4 max-h-64 overflow-y-auto"
                  id="nutrient-content"
                >
                  {caloricInformationAvailable &&
                    Object.keys(dish.nutritionInfo)
                      .filter((key) => recognizedNutrients.includes(key))
                      .map((nutrient) => {
                        // Assert that 'nutrient' is a valid key of nutritionInfo
                        const nutrientKey =
                          nutrient as keyof typeof dish.nutritionInfo;
                        const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                        const formattedValue = formatNutrientValue(
                          nutrientKey,
                          value,
                        );
                        const isInitial =
                          initialNutrients.includes(nutrientKey); // Use nutrientKey here too for consistency
                        return (
                          <div
                            key={nutrientKey}
                            className={cn(
                              "grid grid-cols-subgrid col-span-2 transition-all duration-500 ease-in-out overflow-hidden", // Base styles for transition
                              !isInitial && !showAllNutrients
                                ? "max-h-0 opacity-0 py-0"
                                : "max-h-8 opacity-100 py-0.5", // Conditional styles for collapse/expand
                            )}
                          >
                            <strong
                              className={cn(
                                "col-span-1",
                                (nutrientKey === "transFatG" ||
                                  nutrientKey === "saturatedFatG") &&
                                  "text-gray-500 pl-4",
                              )}
                            >
                              {formatNutrientLabel(nutrientKey)}
                            </strong>
                            <span
                              className={cn(
                                "col-span-1 text-right",
                                (nutrientKey === "transFatG" ||
                                  nutrientKey === "saturatedFatG") &&
                                  "text-gray-500",
                              )}
                            >
                              {value == null
                                ? "-"
                                : `${String(formattedValue)} ${nutrientToUnit[nutrientKey]}`}
                            </span>
                          </div>
                        );
                      })}
                </div>
                {!caloricInformationAvailable && (
                  <h2 className="text-center w-full my-10 text-sm text-zinc-600">
                    Nutritional information not available.
                  </h2>
                )}
                <div className="px-4 flex flex-col gap-2">
                  {caloricInformationAvailable && (
                    <Button
                      variant="outlined"
                      size="small"
                      className="w-full whitespace-nowrap border-input hover:bg-accent hover:text-accent-foreground text-sm font-medium h-8 rounded-md normal-case"
                      sx={{
                        borderColor: "hsl(var(--input))",
                        color: "inherit",
                        "&:hover": {
                          borderColor: "hsl(var(--input))",
                          backgroundColor: "hsl(var(--accent))",
                        },
                      }}
                      onClick={() => setShowAllNutrients(!showAllNutrients)}
                    >
                      {showAllNutrients ? "Show Less" : "Show More Nutrients"}
                    </Button>
                  )}
                  {ingredientsAvailable && (
                    <IngredientsDialog
                      name={dish.name}
                      ingredients={dish.ingredients ?? ""}
                    />
                  )}
                  {!ingredientsAvailable && (
                    <Button
                      variant="outlined"
                      disabled
                      className="w-full whitespace-nowrap"
                    >
                      Ingredients Not Available
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  );
}
