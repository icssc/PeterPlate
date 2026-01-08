"use client"; // Need state for toggling nutrient visibility

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./shadcn/dialog";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./shadcn/button";
import { cn } from "@/utils/tw";
import { nutrientToUnit } from "@/utils/types";
import {
  formatFoodName,
  formatNutrientLabel,
  formatNutrientValue,
} from "@/utils/funcs";
import { DishInfo } from "@zotmeal/api";
import { toTitleCase, enhanceDescription } from "@/utils/funcs";
import { AllergenBadge } from "./allergen-badge";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import IngredientsDialog from "../ingredients-dialog";
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
export default function FoodDialogContent({ dish, userId } : {
  dish: DishInfo; userId?: string
}) {
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

  const ingredientsAvailable: boolean = dish.ingredients != null 
    && dish.ingredients.length > 0;
  const caloricInformationAvailable: boolean = dish.nutritionInfo.calories != null
    && dish.nutritionInfo.calories.length > 0;

  return (
    <DialogContent>
      <DialogHeader>
        <div className="flex flex-col gap-6">
          <Image
            src={"/zm-card-header.webp"}
            alt={"An image of zotmeal logo."}
            width={1200}
            height={700}
            className="w-full h-48 object-cover"
          />
          <div className="flex flex-col gap-2">
            <div
              className="flex justify-between px-4 items-center"
              id="food-header-info"
            >
              <div className="flex gap-3 items-center">
                <DialogTitle className="text-3xl">
                  {formatFoodName(dish.name)}
                </DialogTitle>
                {/* <Pin className="stroke-zinc-500"/> */}
              </div>
              {/* Interactive rating stars - right aligned */}
              <InteractiveStarRating dishId={dish.id} userId={userId} />
            </div>
            <div className="px-4 flex items-center gap-2 text-zinc-500">
              <span>{!caloricInformationAvailable ? "-" : `${Math.round(parseFloat(dish.nutritionInfo.calories ?? "0"))} cal`} • {toTitleCase(dish.restaurant)}</span>
              {dish.dietRestriction.isVegetarian && <AllergenBadge variant={"vegetarian"}/>}
              {dish.dietRestriction.isVegan && <AllergenBadge variant={"vegan"}/>}
              {dish.dietRestriction.isGlutenFree && <AllergenBadge variant={"gluten_free"}/>}
              {dish.dietRestriction.isKosher && <AllergenBadge variant={"kosher"}/>}
            </div>
            <DialogDescription className="text-black px-4">
              {enhanceDescription(dish.name, dish.description)}
            </DialogDescription>
            <div>
              <h1 className="px-4 text-2xl font-bold">Nutrients</h1>
              <div className="grid grid-cols-2 gap-x-4 w-full px-4 text-black mb-4" id="nutrient-content">
                {caloricInformationAvailable && Object.keys(dish.nutritionInfo)
                  .filter(key => recognizedNutrients.includes(key))
                  .map(nutrient => {
                    // Assert that 'nutrient' is a valid key of nutritionInfo
                    const nutrientKey =
                      nutrient as keyof typeof dish.nutritionInfo;
                    const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                    const formattedValue = formatNutrientValue(
                      nutrientKey,
                      value,
                    );
                    const isInitial = initialNutrients.includes(nutrientKey); // Use nutrientKey here too for consistency
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
                        <strong className="col-span-1">
                          {formatNutrientLabel(nutrientKey)}
                        </strong>
                        <span className="col-span-1 text-right">
                          {value == null
                            ? "-"
                            : `${String(formattedValue)} ${nutrientToUnit[nutrientKey]}`}
                        </span>
                      </div>
                    );
                  })
                }
              </div>
              {!caloricInformationAvailable &&
                <h2 className="text-center w-full my-10 text-sm text-zinc-600">
                  Nutritional information not available.
                </h2> 
              }
              <div className="px-4 flex flex-col gap-2">

                {caloricInformationAvailable &&
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAllNutrients(!showAllNutrients)}
                  >
                  {showAllNutrients ? "Show Less" : "Show More Nutrients"}
                  </Button>
                }
                {ingredientsAvailable &&
                  <IngredientsDialog name={dish.name} ingredients={dish.ingredients!}/>
                }
                {!ingredientsAvailable &&
                  <Button variant="deactivated">Ingredients Not Available</Button>
                }
              </div>
            </div>
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
