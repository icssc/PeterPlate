"use client"; // Need state for toggling nutrient visibility

import { Add, Close, StarBorder } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, IconButton, Typography } from "@mui/material";
import type { RestaurantId } from "@peterplate/db";
import type { DishWithRating } from "@peterplate/validators";
import Image from "next/image";
import { useState } from "react";
import { useDietaryConflicts } from "@/hooks/useDietaryConflicts";
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
import type { OnAddToMealTracker } from "./card/food-card";
import Rating from "./rating";

export default function FoodDrawerContent({
  dish,
  restaurant,
  onAddToMealTracker,
  isAddingToMealTracker = false,
  onClose,
}: {
  dish: DishWithRating;
  restaurant?: RestaurantId;
  onAddToMealTracker?: OnAddToMealTracker;
  isAddingToMealTracker?: boolean;
  onClose?: () => void;
}) {
  const violations = useDietaryConflicts(dish.dietRestriction);
  const [imageError, setImageError] = useState(false);
  const showImage =
    typeof dish.imageUrl === "string" &&
    dish.imageUrl.trim() !== "" &&
    !imageError;

  const ingredientsAvailable: boolean =
    dish.ingredients != null && dish.ingredients.length > 0;

  const caloricInformationAvailable: boolean =
    dish.nutritionInfo.calories != null;

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );
  const averageRating = ratingData?.averageRating ?? 0;

  // State to control nutrient visibility
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
    <Box className="h-full flex flex-col font-poppins min-h-0 dark:bg-[var(--surface-modal)]">
      <Box className="pb-4 shrink-0 relative">
        {onClose && (
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              color: "black",
            }}
          >
            <Close />
          </IconButton>
        )}
        {showImage ? (
          <Image
            src={dish.imageUrl as string}
            alt={formatFoodName(dish.name)}
            width={800}
            height={128}
            className="w-full h-32 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={"/zm-card-header.webp"}
            alt={"An image of PeterPlate's logo."}
            width={1200}
            height={700}
            className="w-full h-32 object-cover"
          />
        )}
        <Box className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Typography
              fontWeight={700}
              color="primary"
              className={cn(
                "text-3xl leading-tight tracking-normal",
                dish.name.length > 10 && "text-2xl",
                dish.name.length > 30 && "text-md",
              )}
            >
              {formatFoodName(dish.name)}
            </Typography>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <span className="whitespace-nowrap flex items-center gap-1">
              <StarBorder
                className="w-4 h-4 stroke-zinc-400"
                strokeWidth={1.5}
              />
              {averageRating.toFixed(1)}
              {restaurant ? ` • ${toTitleCase(restaurant)}` : ""} •{" "}
              {!caloricInformationAvailable
                ? "-"
                : `${Math.round(dish.nutritionInfo.calories ?? 0)} cal`}
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
              {violations &&
                violations.length > 0 &&
                violations.map((v) => (
                  <AllergenBadge
                    key={v}
                    variant="conflict"
                    label={
                      <span className="inline-flex items-center gap-1">
                        <ErrorOutlineIcon sx={{ fontSize: "0.75rem" }} />
                        {`    ${v}`}
                      </span>
                    }
                  />
                ))}
            </div>
          </div>

          {/* Interactive rating stars */}
          {restaurant && (
            <div className="flex gap-2 pt-0.5">
              <Rating dishId={dish.id} restaurant={restaurant} />
            </div>
          )}

          <Typography color="text.primary" className="leading-relaxed">
            {enhanceDescription(dish.name, dish.description)}
          </Typography>
        </Box>
      </Box>

      <Box className="flex-1 min-h-0 overflow-y-auto flex flex-col px-4 pb-4">
        <Typography
          fontWeight={700}
          color="text.primary"
          className="text-2xl mb-2"
        >
          Nutrition Facts
        </Typography>
        <Box
          className="grid grid-cols-2 gap-x-4 w-full px-2 mb-4 auto-rows-max"
          id="nutrient-content"
          sx={{ color: "text.primary" }}
        >
          {caloricInformationAvailable &&
            Object.keys(dish.nutritionInfo)
              .filter((key) => recognizedNutrients.includes(key))
              .map((nutrient) => {
                // Assert that 'nutrient' is a valid key of nutritionInfo
                const nutrientKey = nutrient as keyof typeof dish.nutritionInfo;
                const value = dish.nutritionInfo[nutrientKey]; // Now correctly typed
                const formattedValue = formatNutrientValue(
                  nutrientKey,
                  value?.toString() ?? "",
                );
                return (
                  <div
                    key={nutrientKey}
                    className="grid grid-cols-subgrid col-span-2 py-0.5"
                  >
                    <strong
                      className={cn(
                        "col-span-1 text-left",
                        (nutrientKey === "transFatG" ||
                          nutrientKey === "saturatedFatG") &&
                          "text-gray-500 dark:text-zinc-400 pl-4",
                      )}
                    >
                      {formatNutrientLabel(nutrientKey)}
                    </strong>
                    <span
                      className={cn(
                        "col-span-1 text-right",
                        (nutrientKey === "transFatG" ||
                          nutrientKey === "saturatedFatG") &&
                          "text-gray-500 dark:text-zinc-400",
                      )}
                    >
                      {value == null
                        ? "-"
                        : `${String(formattedValue)} ${nutrientToUnit[nutrientKey]}`}
                    </span>
                  </div>
                );
              })}
        </Box>
        {!caloricInformationAvailable && (
          <h2 className="text-center w-full text-sm text-zinc-600">
            Nutritional information not available.
          </h2>
        )}

        <Box className="flex flex-col gap-2">
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
        </Box>
      </Box>

      {onAddToMealTracker && (
        <Box className="px-4 py-4 shrink-0 border-t border-gray-300 bg-white dark:border-zinc-700 dark:bg-[var(--surface-modal)]">
          <Box
            component="button"
            type="button"
            onClick={onAddToMealTracker}
            disabled={isAddingToMealTracker}
            className="w-full inline-flex h-10 justify-center items-center gap-0.5 rounded-md text-[12px] font-medium leading-[18px] disabled:opacity-60"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              border: "none",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              "&:hover:not(:disabled)": { bgcolor: "primary.dark" },
            }}
          >
            <Add sx={{ fontSize: 18, width: 18, height: 18 }} />
            Add to Meal Tracker
          </Box>
        </Box>
      )}
    </Box>
  );
}
