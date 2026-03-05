"use client";

import type { LoggedMealJoinedWithNutrition } from "./nutrition-breakdown";
import { compileMealData } from "./nutrition-breakdown";

interface Props {
  mealsEaten: LoggedMealJoinedWithNutrition[];
}

export default function TrackerHistoryMealTable({ mealsEaten }: Props) {
  const totals = compileMealData(mealsEaten);

  return (
    <div className="w-full mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-800 text-left text-lg">
            <th className="pb-3 font-medium">Food</th>
            <th className="pb-3 font-medium">Calories</th>
            <th className="pb-3 font-medium">Protein</th>
            <th className="pb-3 font-medium">Carbs</th>
            <th className="pb-3 font-medium">Fat</th>
          </tr>
        </thead>
        <tbody>
          {mealsEaten.map((meal) => (
            <tr key={meal.id} className="border-t border-zinc-100">
              <td className="py-3 flex items-center gap-2">
                <span>{meal.dishName}</span>
                <span className="bg-sky-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {meal.servings}
                </span>
              </td>
              <td className="py-3">
                {Math.round(meal.calories * meal.servings)}
              </td>
              <td className="py-3">
                {Math.round(meal.protein * meal.servings)}g
              </td>
              <td className="py-3">
                {Math.round(meal.carbs * meal.servings)}g
              </td>
              <td className="py-3">{Math.round(meal.fat * meal.servings)}g</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-zinc-300 font-semibold">
            <td className="pt-3" />
            <td className="pt-3">{totals.calories}</td>
            <td className="pt-3">{totals.protein_g}g</td>
            <td className="pt-3">{totals.carbs_g}g</td>
            <td className="pt-3">{totals.fat_g}g</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
