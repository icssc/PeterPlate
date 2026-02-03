"use client"; // Need state for toggling nutrient visibility

<<<<<<< HEAD
import { PinDrop, StarBorder } from "@mui/icons-material";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./shadcn/dialog";
=======
import { Button, Box } from "@mui/material";
import { Pin } from "lucide-react";
>>>>>>> dev
import Image from "next/image";
import React, { useState } from "react";
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
import InteractiveStarRating from "./interactive-star-rating";

export default function FoodDrawerContent({ dish }: { dish: DishInfo }) {

  const ingredientsAvailable: boolean = dish.ingredients != null 
    && dish.ingredients.length > 0;
  const caloricInformationAvailable: boolean = dish.nutritionInfo.calories != null
    && dish.nutritionInfo.calories.length > 0;

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
<<<<<<< HEAD
    <DrawerContent className="max-h-[95vh] flex flex-col">
      <DrawerHeader>
        <div className="flex flex-col gap-3">
          <Image
            src={"/zm-card-header.webp"}
            alt={"An image of zotmeal logo."}
            width={1200}
            height={700}
            className="w-full h-20 object-cover"
          />
          <div className="flex flex-col gap-1">
            <div className="flex gap-12 px-1" id="food-header-info">
              <div className="flex w-full items-center justify-between">
                <DrawerTitle className="text-3xl">
                  {formatFoodName(dish.name)}
                </DrawerTitle>
                <PinDrop className="stroke-zinc-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 px-1">
              <span>{caloricInformationAvailable &&
                `${Math.round(parseFloat(dish.nutritionInfo.calories ?? "0"))} cal • `} {toTitleCase(dish.restaurant)}
              </span>
              {dish.dietRestriction.isVegetarian && <AllergenBadge variant={"vegetarian"}/>}
              {dish.dietRestriction.isVegan && <AllergenBadge variant={"vegan"}/>}
              {dish.dietRestriction.isGlutenFree && <AllergenBadge variant={"gluten_free"}/>}
              {dish.dietRestriction.isKosher && <AllergenBadge variant={"kosher"}/>}
            </div>
            {/* Interactive rating stars */}
            <div className="flex gap-2 ml-1 pt-0.5">
              <InteractiveStarRating dishId={dish.id} />
            </div>
            <DrawerDescription className="text-black text-left px-1 py-2 ">
              {enhanceDescription(dish.name, dish.description)}
            </DrawerDescription>
=======
    <Box className="max-h-[95vh] flex flex-col">
      <Box className="pb-4">
        <Image
          src={"/zm-card-header.webp"}
          alt={"An image of zotmeal logo."}
          width={1200}
          height={700}
          className="w-full h-32 object-cover"
        />
        <Box className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold leading-tight tracking-normal">
              {formatFoodName(dish.name)}
            </h2>
            <Pin className="stroke-zinc-500" />
>>>>>>> dev
          </div>

          <div className="flex flex-wrap items-center gap-2 text-zinc-500">
            <span className="whitespace-nowrap">
              {!caloricInformationAvailable
                ? "-"
                : `${Math.round(parseFloat(dish.nutritionInfo.calories ?? "0"))} cal`}{" "}
              • {toTitleCase(dish.restaurant)}
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
                    <strong className="col-span-1 text-left">
                      {formatNutrientLabel(nutrientKey)}
                    </strong>
                    <span className="col-span-1 text-right">
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
