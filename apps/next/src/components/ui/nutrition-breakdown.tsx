"use client";

import type React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";
import type { SelectLoggedMeal } from "../../../../../packages/db/src/schema";
import { ProgressDonut } from "../progress-donut";

interface NutritionData {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function compileMealData(
  meals: LoggedMealJoinedWithNutrition[],
): NutritionData {
  const data = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

  for (const meal of meals) {
    const servings = meal.servings;
    data.calories += meal.calories * servings;
    data.protein_g += meal.protein * servings;
    data.carbs_g += meal.carbs * servings;
    data.fat_g += meal.fat * servings;
  }

  data.calories = Math.round(data.calories);
  data.protein_g = Math.round(data.protein_g);
  data.carbs_g = Math.round(data.carbs_g);
  data.fat_g = Math.round(data.fat_g);

  return data;
}

interface Props {
  mealsEaten: LoggedMealJoinedWithNutrition[];
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

const NutritionBreakdown = ({
  mealsEaten,
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
}: Props) => {
  const nutrition = compileMealData(mealsEaten);

  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  const utils = trpc.useUtils();
  const deleteLoggedMealMutation = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: () => {
      alert(`Removed dish from your log`);
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const cols = isXl ? 4 : isLg ? 2 : 1;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: "24px",
    width: "100%",
  };

  const cardBase =
    "bg-sky-100 rounded-xl px-4 flex flex-row items-center justify-between h-36 min-w-0";

  const labelBase = "text-3xl text-sky-700 font-medium pl-3 truncate min-w-0";

  return (
    <div style={gridStyle} className="mt-6">
      <div className={cardBase}>
        <span className={labelBase}>Calories</span>
        <div className="shrink-0">
          <ProgressDonut
            progress_value={nutrition.calories}
            max_value={calorieGoal}
            display_unit=""
            trackColor="#0084D1"
            progressColor="#00BCFF"
          />
        </div>
      </div>

      <div className={cardBase}>
        <span className={labelBase}>Protein</span>
        <div className="shrink-0">
          <ProgressDonut
            progress_value={nutrition.protein_g}
            max_value={proteinGoal}
            display_unit="g"
          />
        </div>
      </div>

      <div className={cardBase}>
        <span className={labelBase}>Carbs</span>
        <div className="shrink-0">
          <ProgressDonut
            progress_value={nutrition.carbs_g}
            max_value={carbGoal}
            display_unit="g"
          />
        </div>
      </div>

      <div className={cardBase}>
        <span className={labelBase}>Fat</span>
        <div className="shrink-0">
          <ProgressDonut
            progress_value={nutrition.fat_g}
            max_value={fatGoal}
            display_unit="g"
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionBreakdown;
