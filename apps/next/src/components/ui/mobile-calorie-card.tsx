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
  hideEditButton?: boolean;
  date?: string;
}

export default function MobileCalorieCard({
  mealsEaten,
  calorieGoal,
  userId,
  hideEditButton = false,
  date,
}: Props) {
  const nutrition = compileMealData(mealsEaten);

  return (
    <div className="bg-sky-100 dark:bg-[#8EC5FF33] rounded-xl px-4 flex flex-row items-center justify-between h-36 w-full relative">
      <div className="absolute top-0 right-4">
        {!hideEditButton && <NutritionGoals userId={userId} date={date} />}
      </div>
      <span className="text-3xl text-sky-700 dark:text-blue-300 font-medium pr-3">
        Calories
      </span>
      <div className="flex items-center gap-2 pr-6">
        <ProgressDonut
          progress_value={nutrition.calories}
          max_value={calorieGoal}
          display_unit=""
          trackColor="var(--donut-calories-track)"
          progressColor="var(--donut-calories-progress)"
          valueColor="var(--donut-calories-value)"
        />
      </div>
    </div>
  );
}
