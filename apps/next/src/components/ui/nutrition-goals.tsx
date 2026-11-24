"use client";

import EditIcon from "@mui/icons-material/Edit";
import { Button, Drawer } from "@mui/material";
import { NutritionGoalsSchema } from "@peterplate/validators";
import { useEffect, useRef, useState } from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";

interface Props {
  userId: string;
  date?: string;
  tourId?: string;
}

/* Macros scaling so that macros and calories add up when changed */
const calculateCalories = (carbs: number, protein: number, fat: number) =>
  carbs * 4 + protein * 4 + fat * 9;

const scaleMacros = (
  targetCalories: number,
  carbs: number,
  protein: number,
  fat: number,
) => {
  const currentCalories = calculateCalories(carbs, protein, fat);

  if (currentCalories <= 0) return null;

  const ratio = targetCalories / currentCalories;

  return {
    carbGoal: Math.round(carbs * ratio),
    proteinGoal: Math.round(protein * ratio),
    fatGoal: Math.round(fat * ratio),
  };
};

export default function NutritionGoals({ userId, date, tourId }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const utils = trpc.useUtils();

  const { data: defaultGoals } = trpc.nutrition.getGoals.useQuery({ userId });
  const { data: dayGoals } = trpc.nutrition.getGoalsByDay.useQuery(
    { userId, date: date ?? "" },
    { enabled: !!date },
  );
  const goals = dayGoals ?? defaultGoals;

  const upsertGoals = trpc.nutrition.upsertGoals.useMutation({
    onSuccess: () => utils.nutrition.invalidate(),
  });

  const upsertGoalsByDay = trpc.nutrition.upsertGoalsByDay.useMutation({
    onSuccess: () => utils.nutrition.invalidate(),
  });

  const [open, setOpen] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(100);
  const [carbGoal, setCarbGoal] = useState(250);
  const [fatGoal, setFatGoal] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showSnackbar } = useSnackbarStore();

  const handleUpdate = (
    field: "calorieGoal" | "proteinGoal" | "carbGoal" | "fatGoal",
    value: number,
  ) => {
    const updated = {
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal,
      [field]: value,
    };

    // Scaling calories/macros so all values add up correctly
    if (field === "calorieGoal") {
      const macros = scaleMacros(value, carbGoal, proteinGoal, fatGoal);

      if (!macros) return false;

      Object.assign(updated, macros);
    } else {
      updated.calorieGoal = calculateCalories(
        updated.carbGoal,
        updated.proteinGoal,
        updated.fatGoal,
      );
    }

    // Confirm if values are still in range
    const result = NutritionGoalsSchema.safeParse(updated);
    if (!result.success) {
      showSnackbar(result.error.issues[0].message, "error");
      return false;
    }

    // Update React state
    setCalorieGoal(updated.calorieGoal);
    setProteinGoal(updated.proteinGoal);
    setCarbGoal(updated.carbGoal);
    setFatGoal(updated.fatGoal);

    // Save to database
    if (date) {
      upsertGoalsByDay.mutate({ userId, date, ...updated });
    } else {
      upsertGoals.mutate({ userId, ...updated });
    }

    return true;
  };

  useEffect(() => {
    if (goals && !open) {
      setCalorieGoal(goals.calorieGoal);
      setProteinGoal(goals.proteinGoal);
      setCarbGoal(goals.carbGoal);
      setFatGoal(goals.fatGoal);
    }
  }, [goals, open]);

  useEffect(() => {
    if (isMobile || !open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, isMobile]);

  const inputs = (
    <>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900 dark:text-white">
        Calorie Goal
        <input
          key={calorieGoal}
          type="number"
          defaultValue={calorieGoal}
          min={100}
          max={10000}
          onBlur={(e) => {
            const input = e.currentTarget;
            const raw = input.value;

            if (raw === "") {
              input.value = String(calorieGoal);
              return;
            }
            if (Number(raw) === calorieGoal) return;

            if (!handleUpdate("calorieGoal", Number(raw))) {
              input.value = String(calorieGoal);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 dark:border-blue-300 dark:bg-[#8EC5FF33] dark:text-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900 dark:text-white">
        Protein Goal
        <input
          key={proteinGoal}
          type="number"
          defaultValue={proteinGoal}
          min={1}
          max={500}
          onBlur={(e) => {
            const input = e.currentTarget;
            const raw = input.value;

            if (raw === "") {
              input.value = String(proteinGoal);
              return;
            }
            if (Number(raw) === proteinGoal) return;

            if (!handleUpdate("proteinGoal", Number(raw))) {
              input.value = String(proteinGoal);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 dark:border-blue-300 dark:bg-[#8EC5FF33] dark:text-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900 dark:text-white">
        Carb Goal
        <input
          key={carbGoal}
          type="number"
          defaultValue={carbGoal}
          min={1}
          max={1000}
          onBlur={(e) => {
            const input = e.currentTarget;
            const raw = input.value;

            if (raw === "") {
              input.value = String(carbGoal);
              return;
            }
            if (Number(raw) === carbGoal) return;

            if (!handleUpdate("carbGoal", Number(raw))) {
              input.value = String(carbGoal);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 dark:border-blue-300 dark:bg-[#8EC5FF33] dark:text-white rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900 dark:text-white">
        Fat Goal
        <input
          key={fatGoal}
          type="number"
          defaultValue={fatGoal}
          min={1}
          max={500}
          onBlur={(e) => {
            const input = e.currentTarget;
            const raw = input.value;

            if (raw === "") {
              input.value = String(fatGoal);
              return;
            }

            if (Number(raw) === fatGoal) return;

            if (!handleUpdate("fatGoal", Number(raw))) {
              input.value = String(fatGoal);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 dark:border-blue-300 dark:bg-[#8EC5FF33] dark:text-white rounded px-2 py-1 text-sm"
        />
      </label>
    </>
  );

  return (
    <div className="relative mt-4" ref={containerRef}>
      <Button
        id={tourId}
        onClick={() => setOpen(!open)}
        variant="contained"
        className="!bg-sky-700 !text-white hover:!bg-sky-800 !rounded-lg !min-w-0 !p-1 md:!p-2 dark:!bg-blue-300 dark:!text-gray-900 dark:hover:!bg-blue-400"
      >
        <EditIcon />
      </Button>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            ".dark & .MuiDrawer-paper": {
              backgroundImage: "none",
              backgroundColor: "var(--surface-elevated)",
            },
          }}
        >
          <div className="p-6 flex flex-col gap-4">{inputs}</div>
        </Drawer>
      ) : (
        open && (
          <div className="absolute top-0 right-full mr-2 z-50 bg-white dark:bg-[var(--surface-elevated)] rounded-xl border border-sky-700/30 dark:border-blue-300/50 p-6 flex flex-col gap-4 shadow-md w-72">
            {inputs}
          </div>
        )
      )}
    </div>
  );
}
