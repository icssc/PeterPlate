"use client";

import { Star } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Card, Typography } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import Image from "next/image";
import React from "react";
import { useUserStore } from "@/context/useUserStore";
import { getDietaryConflicts } from "@/utils/dietary";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodCardShell from "./food-card-shell";

interface PopularDishCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dish: DishWithRating;
  stationName: string;
  compact?: boolean;
  restaurant: "anteatery" | "brandywine";
}

const PopularDishCardContent = React.forwardRef<
  HTMLDivElement,
  PopularDishCardContentProps
>(({ dish, restaurant, stationName, compact = false, onClick }, ref) => {
  const IconComponent = getFoodIcon(dish.name);
  const iconSize = compact ? 16 : 24;
  const descSize = compact ? "text-[8px]" : "text-[10px]";

  const { userId } = useUserStore();

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );
  const averageRating = ratingData?.averageRating ?? 0;

  const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    { userId: userId ?? "" },
    { staleTime: Infinity },
  );

  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery(
    { userId: userId ?? "" },
    { staleTime: Infinity },
  );

  const violations = getDietaryConflicts(
    dish.dietRestriction,
    preferences ?? [],
    allergies ?? [],
  );
  const conflictsWithUserPrefs = violations.length > 0;

  return (
    <Card
      className={`w-full h-full min-h-[210px] flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent p-0 ${conflictsWithUserPrefs ? "opacity-70" : ""}`}
      onClick={onClick}
      ref={ref}
    >
      {/* Dish image */}
      <Box
        className="relative w-full aspect-[16/9] flex-shrink-0"
        sx={{ bgcolor: "background.paper" }}
      >
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <IconComponent style={{ fontSize: 48 }} color="primary" />
          </div>
        )}
      </Box>
      <Box className="flex flex-col flex-1 p-4">
        <Typography
          className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
          color="primary"
        >
          {formatFoodName(dish.name)}
          {conflictsWithUserPrefs && (
            <ErrorOutlineIcon
              fontSize="inherit"
              className="ml-1 text-red-600 align-[-0.125em]"
            />
          )}
        </Typography>
        <Typography className={`${descSize} mb-1`} color="text.secondary">
          {toTitleCase(restaurant)} • {toTitleCase(stationName)}
        </Typography>
        <Box
          className="flex items-center gap-1 mt-auto"
          sx={{ color: "text.secondary" }}
        >
          <Star style={{ fontSize: iconSize }} />
          <Typography variant="caption">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
});

export default function PopularDishCard({
  dish,
  restaurant,
  stationName,
  compact = false,
}: PopularDishCardContentProps): React.JSX.Element {
  return (
    <FoodCardShell dish={dish} restaurant={restaurant}>
      {(handleOpen) => (
        <PopularDishCardContent
          {...{ dish, restaurant, stationName, compact }}
          onClick={handleOpen}
        />
      )}
    </FoodCardShell>
  );
}
