"use client";

import type { SelectLoggedMeal } from "@peterplate/db";

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface Props {
  meal: LoggedMealJoinedWithNutrition;
}

export default function TrackedMealCard({ meal }: Props) {
  return (
    <div className="w-72 h-40 rounded-xl border p-4 flex flex-col justify-between">
      <h3 className="text-sky-700 font-semibold text-lg">{meal.dishName}</h3>
      <p className="text-sm text-zinc-500">
        {meal.servings} serving{meal.servings !== 1 ? "s" : ""}
      </p>
      <div className="flex gap-4 text-sm text-zinc-600">
        <span>{Math.round(meal.calories * meal.servings)} cal</span>
        <span>{Math.round(meal.protein * meal.servings)}g protein</span>
        <span>{Math.round(meal.carbs * meal.servings)}g carbs</span>
        <span>{Math.round(meal.fat * meal.servings)}g fat</span>
      </div>
    </div>
  );
}
