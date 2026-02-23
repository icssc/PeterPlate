"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";

interface Props {
  userId: string;
}

export default function NutritionGoals({ userId }: Props) {
  const { data: goals } = trpc.nutrition.getGoals.useQuery({ userId });
  const utils = trpc.useUtils();
  const upsertGoals = trpc.nutrition.upsertGoals.useMutation({
    onSuccess: () => {
      utils.nutrition.invalidate();
    },
  });

  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(75);
  const [carbGoal, setCarbGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(50);

  useEffect(() => {
    if (goals) {
      setCalorieGoal(goals.calorieGoal);
      setProteinGoal(goals.proteinGoal);
      setCarbGoal(goals.carbGoal);
      setFatGoal(goals.fatGoal);
    }
  }, [goals]);

  const handleSave = () => {
    upsertGoals.mutate({ userId, calorieGoal, proteinGoal, carbGoal, fatGoal });
  };

  return (
    <div className="flex items-center gap-20 bg-sky-100 rounded-xl px-8 py-6 mt-6">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
        Calorie Goal
        <input
          type="number"
          value={calorieGoal}
          min={100}
          max={10000}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          className="w-20 border-b border-sky-400 bg-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
        Protein Goal
        <input
          type="number"
          value={proteinGoal}
          min={1}
          max={500}
          onChange={(e) => setProteinGoal(Number(e.target.value))}
          className="w-20 border-b border-sky-400 bg-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
        Carb Goal
        <input
          type="number"
          value={carbGoal}
          min={1}
          max={1000}
          onChange={(e) => setCarbGoal(Number(e.target.value))}
          className="w-20 border-b border-sky-400 bg-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
        Fat Goal
        <input
          type="number"
          value={fatGoal}
          min={1}
          max={500}
          onChange={(e) => setFatGoal(Number(e.target.value))}
          className="w-20 border-b border-sky-400 bg-white rounded px-2 py-1 text-sm"
        />
      </label>
      <button
        type="button"
        onClick={handleSave}
        className="px-4 py-1 bg-sky-700 text-white text-sm rounded-lg hover:bg-sky-800"
      >
        Save
      </button>
    </div>
  );
}
