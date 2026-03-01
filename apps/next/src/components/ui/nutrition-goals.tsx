"use client";

import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
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

  const [open, setOpen] = useState(false);
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

  const handleUpdate = (updates: Partial<typeof upsertGoals.variables>) => {
    upsertGoals.mutate({
      userId,
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal,
      ...updates,
    });
  };

  return (
    <div className="relative mt-4">
      <Button
        onClick={() => setOpen(!open)}
        variant="contained"
        className="!bg-sky-700 !text-white hover:!bg-sky-800 !rounded-lg !min-w-0 !p-2"
      >
        <EditIcon />
      </Button>

      {open && (
        <div className="absolute top-0 right-full mr-2 z-50 bg-white rounded-xl border border-sky-700/30 p-6 flex flex-col gap-4 shadow-md w-72 h-50">
          <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
            Calorie Goal
            <input
              type="number"
              value={calorieGoal}
              min={100}
              max={10000}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                handleUpdate({ calorieGoal: val });
              }}
              className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
            Protein Goal
            <input
              type="number"
              value={proteinGoal}
              min={1}
              max={500}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                handleUpdate({ calorieGoal: val });
              }}
              className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
            Carb Goal
            <input
              type="number"
              value={carbGoal}
              min={1}
              max={1000}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                handleUpdate({ calorieGoal: val });
              }}
              className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
            Fat Goal
            <input
              type="number"
              value={fatGoal}
              min={1}
              max={500}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalorieGoal(val);
                handleUpdate({ calorieGoal: val });
              }}
              className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
            />
          </label>
        </div>
      )}
    </div>
  );
}
