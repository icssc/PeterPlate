"use client";

import { ProgressDonut } from "../progress-donut";
import {
  compileMealData,
  type LoggedMealJoinedWithNutrition,
} from "./nutrition-breakdown";
import NutritionGoals from "./nutrition-goals";

interface Props {
  mealsEaten: LoggedMealJoinedWithNutrition[];
  calorieGoal: number;
  userId: string;
}

export default function MobileCalorieCard({
  mealsEaten,
  calorieGoal,
  userId,
}: Props) {
  const nutrition = compileMealData(mealsEaten);

  return (
    <div className="bg-sky-100 rounded-xl px-4 flex flex-row items-center justify-between h-36 w-full relative">
      <div className="absolute bottom-2 left-3">
        <NutritionGoals userId={userId} />
      </div>
      <span className="text-3xl text-sky-700 font-medium pl-3">Calories</span>
      <div className="flex items-center gap-2">
        <ProgressDonut
          progress_value={nutrition.calories}
          max_value={calorieGoal}
          display_unit=""
          trackColor="#0084D1"
          progressColor="#00BCFF"
        />
      </div>
    </div>
  );
}
