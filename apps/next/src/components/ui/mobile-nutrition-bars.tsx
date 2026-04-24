"use client";

import {
  compileMealData,
  type LoggedMealJoinedWithNutrition,
} from "@/components/ui/nutrition-breakdown";

interface MacroBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
}

function MacroBar({ label, value, max, unit }: MacroBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-4">
      <span className="text-sky-700 font-semibold w-16">{label}</span>
      <div className="flex-1 bg-white rounded-full h-3">
        <div
          className="h-3 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: "#0084D1" }}
        />
      </div>
      <span className="text-sm text-zinc-500 w-24 text-right">
        {Math.round(value)}
        {unit} / {max}
        {unit}
      </span>
    </div>
  );
}

interface Props {
  mealsEaten: LoggedMealJoinedWithNutrition[];
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

export default function MobileNutritionBars({
  mealsEaten,
  proteinGoal,
  carbGoal,
  fatGoal,
}: Props) {
  const nutrition = compileMealData(mealsEaten);

  return (
    <div className="bg-sky-100 rounded-xl p-4 flex flex-col gap-4 w-full">
      <MacroBar
        label="Protein"
        value={nutrition.protein_g}
        max={proteinGoal}
        unit="g"
      />
      <MacroBar
        label="Carbs"
        value={nutrition.carbs_g}
        max={carbGoal}
        unit="g"
      />
      <MacroBar label="Fat" value={nutrition.fat_g} max={fatGoal} unit="g" />
    </div>
  );
}
