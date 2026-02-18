"use client"; // Need state for toggling nutrient visibility

import { Box, Button } from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import Image from "next/image";
import { useState } from "react";
import {
  enhanceDescription,
  formatFoodName,
  formatNutrientLabel,
  formatNutrientValue,
  toTitleCase,
} from "@/utils/funcs";
import { cn } from "@/utils/tw";
import { nutrientToUnit } from "@/utils/types";
import { AllergenBadge } from "./allergen-badge";
import InteractiveStarRating from "./interactive-star-rating";

export default function FoodDrawerContent({ dish }: { dish: DishInfo }) {
  const [imageError, setImageError] = useState(false);
  const showImage =
    typeof dish.image_url === "string" &&
    dish.image_url.trim() !== "" &&
    !imageError;
  // const ingredientsAvailable: boolean =
  //   dish.ingredients != null && dish.ingredients.length > 0;
  const caloricInformationAvailable: boolean =
    dish.nutritionInfo.calories != null &&
    dish.nutritionInfo.calories.length > 0;

  // State to control nutrient visibility
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

  return (
    <Box className="max-h-[95vh] flex flex-col">
      <Box className="pb-4">
        {showImage ? (
          <Image
            src={dish.image_url as string}
            alt={formatFoodName(dish.name)}
            width={800}
            height={128}
            className="w-full h-32 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={"/zm-card-header.webp"}
            alt={"An image of peterplate logo."}
            width={1200}
            height={700}
            className="w-full h-32 object-cover"
          />
        )}
        <Box className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2
              className={cn(
                "text-3xl font-bold leading-tight tracking-normal",
                "text-sky-700 dark:text-sky-600",
                dish.name.length > 10 && "text-2xl",
                dish.name.length > 30 && "text-md",
              )}
            >
              {formatFoodName(dish.name)}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-zinc-500">
            <span className="whitespace-nowrap">
              {toTitleCase(dish.restaurant)} •{" "}
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

          {/* Interactive rating stars */}
          <div className="flex gap-2 pt-0.5">
            <InteractiveStarRating dishId={dish.id} />
          </div>

          <p className="text-black leading-relaxed">
            {enhanceDescription(dish.name, dish.description)}
          </p>
        </Box>
      </Box>

      <Box className="px-4 flex-1 min-h-0 flex flex-col">
        <h1 className="text-2xl text-left font-bold mb-2">Nutrients</h1>
        <div
          className="flex-1 grid grid-cols-2 gap-x-4 w-full px-2 text-black mb-4 overflow-y-auto auto-rows-max"
          id="nutrient-content"
        >
          {caloricInformationAvailable &&
            Object.keys(dish.nutritionInfo)
              .filter((key) => recognizedNutrients.includes(key))
              .map((nutrient) => {
                // Assert that 'nutrient' is a valid key of nutritionInfo
                const nutrientKey = nutrient as keyof typeof dish.nutritionInfo;
                const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                const formattedValue = formatNutrientValue(nutrientKey, value);
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
                    <strong
                      className={cn(
                        "col-span-1 text-left",
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
      </Box>
      {!caloricInformationAvailable && (
        <h2 className="text-center w-full text-sm text-zinc-600">
          Nutritional information not available.
        </h2>
      )}

      <Box className="px-4 pb-6">
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
      </Box>
    </Box>
  );
}
