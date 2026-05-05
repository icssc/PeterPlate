"use client";

import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Restaurant,
} from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import type { SelectLoggedMeal } from "@peterplate/db";
import Image from "next/image";
import React from "react";
import { getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface Props {
  meal: LoggedMealJoinedWithNutrition;
  isUnavailable?: boolean;
  /** Called when the user clicks "+". Receives the meal*/
  onAdd?: (meal: LoggedMealJoinedWithNutrition, servings: number) => void;
}

export default function SearchMealCard({ meal, isUnavailable, onAdd }: Props) {
  const [servingsDraft, setServingsDraft] = React.useState(meal.servings ?? 1);
  const [imageError, setImageError] = React.useState(false);

  // fetch dish detail for image URL + icon
  const { data } = trpc.peterplate.useQuery(
    { date: new Date(meal.eatenAt) },
    { enabled: !!meal.dishId },
  );

  const dish = React.useMemo(() => {
    const halls = [data?.anteatery, data?.brandywine].filter(Boolean);
    for (const hall of halls) {
      for (const menu of hall?.menus ?? []) {
        for (const station of menu.stations ?? []) {
          const found = station.dishes?.find((d) => d.id === meal.dishId);
          if (found) return found;
        }
      }
    }
    return undefined;
  }, [data, meal.dishId]);

  const imageUrl = dish?.image_url;
  const dishNameForIcon = dish?.name ?? meal.dishName;
  const showImage =
    typeof imageUrl === "string" && imageUrl.trim() !== "" && !imageError;
  const IconComponent = getFoodIcon(dishNameForIcon ?? "") ?? Restaurant;

  return (
    <div className={cn("w-full md:w-72")}>
      <Card
        className={cn(
          "cursor-pointer transition w-full border",
          isUnavailable
            ? "bg-zinc-200/90 dark:bg-zinc-700"
            : "bg-white dark:bg-[#303035] hover:shadow-lg",
        )}
        sx={{ borderRadius: "12px", backgroundImage: "none" }}
      >
        <CardContent sx={{ padding: "0 !important" }}>
          <div className="h-auto p-3 md:h-40 md:p-4 flex justify-between gap-3 text-left">
            <div className="min-w-0 flex flex-col justify-between gap-3 flex-1">
              <div className="flex items-center gap-3 min-w-0">
                {showImage && imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <IconComponent className="w-12 h-12 text-slate-700 dark:text-blue-300 flex-shrink-0" />
                )}

                <div className="min-w-0">
                  <Typography
                    color="primary"
                    fontWeight={600}
                    className="text-lg truncate"
                  >
                    {meal.dishName}
                  </Typography>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-white">
                    <div
                      className={cn(
                        "inline-flex items-stretch rounded-md ring-1",
                        isUnavailable
                          ? "bg-sky-200/70 ring-sky-300/70"
                          : "bg-sky-100 ring-sky-200",
                      )}
                    >
                      <div className="w-8 px-2 py-1 text-slate-900 tabular-nums leading-none flex items-center justify-center">
                        {servingsDraft}
                      </div>

                      <div className="flex flex-col border-l border-sky-200 w-6 min-w-6 shrink-0">
                        <button
                          type="button"
                          className={cn(
                            "h-4 w-6 flex items-center justify-center transition p-0",
                            isUnavailable
                              ? "hover:bg-sky-300/60"
                              : "hover:bg-sky-200/60",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setServingsDraft(
                              Math.round((servingsDraft + 0.5) * 2) / 2,
                            );
                          }}
                          aria-label="Increase servings"
                        >
                          <ArrowDropUp
                            sx={{ fontSize: 18 }}
                            className="text-sky-700"
                          />
                        </button>

                        <button
                          type="button"
                          className={cn(
                            "h-4 w-6 flex items-center justify-center transition p-0",
                            isUnavailable
                              ? "hover:bg-sky-300/60"
                              : "hover:bg-sky-200/60",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setServingsDraft(
                              Math.max(
                                0.5,
                                Math.round((servingsDraft - 0.5) * 2) / 2,
                              ),
                            );
                          }}
                          aria-label="Decrease servings"
                        >
                          <ArrowDropDown
                            sx={{ fontSize: 18 }}
                            className="text-sky-700"
                          />
                        </button>
                      </div>
                    </div>

                    <span className="whitespace-nowrap">
                      serving{servingsDraft !== 1 ? "s" : ""}/bowl
                      {servingsDraft !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrition content */}
              <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{Math.round(meal.calories * servingsDraft)} cal</span>
                <span>{Math.round(meal.protein * servingsDraft)}g protein</span>
                <span>{Math.round(meal.carbs * servingsDraft)}g carbs</span>
                <span>{Math.round(meal.fat * servingsDraft)}g fat</span>
              </div>
            </div>

            {/* "+"" button instead of trash one */}
            <div className="flex flex-col justify-between items-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUnavailable) {
                    onAdd?.(meal, servingsDraft);
                  }
                }}
                className="shrink-0 p-2 text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-zinc-300 transition"
                aria-label={`Add ${meal.dishName} to tracker`}
              >
                <Add fontSize="small" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
