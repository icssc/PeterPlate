"use client";

import EditIcon from "@mui/icons-material/Edit";
import { Button, Drawer } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";

interface Props {
  userId: string;
  date?: string;
}

export default function NutritionGoals({ userId, date }: Props) {
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

  useEffect(() => {
    if (goals) {
      setCalorieGoal(goals.calorieGoal);
      setProteinGoal(goals.proteinGoal);
      setCarbGoal(goals.carbGoal);
      setFatGoal(goals.fatGoal);
    }
  }, [goals]);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  const handleUpdate = (updates: {
    calorieGoal?: number;
    proteinGoal?: number;
    carbGoal?: number;
    fatGoal?: number;
  }) => {
    const merged = {
      calorieGoal,
      proteinGoal,
      carbGoal,
      fatGoal,
      ...updates,
    };
    if (date) {
      upsertGoalsByDay.mutate({ userId, date, ...merged });
    } else {
      upsertGoals.mutate({ userId, ...merged });
    }
  };

  const inputs = (
    <>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
        Calorie Goal
        <input
          type="number"
          value={calorieGoal === 0 ? "" : calorieGoal}
          min={100}
          max={10000}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setCalorieGoal(0);
              return;
            }
            const val = Number(raw);
            setCalorieGoal(val);
            handleUpdate({ calorieGoal: val });
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setCalorieGoal(calorieGoal);
            }
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
        Protein Goal
        <input
          type="number"
          value={proteinGoal === 0 ? "" : proteinGoal}
          min={1}
          max={500}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setProteinGoal(0);
              return;
            }
            const val = Number(raw);
            setProteinGoal(val);
            handleUpdate({ proteinGoal: val });
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setProteinGoal(proteinGoal);
            }
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
        Carb Goal
        <input
          type="number"
          value={carbGoal === 0 ? "" : carbGoal}
          min={1}
          max={1000}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setCarbGoal(0);
              return;
            }
            const val = Number(raw);
            setCarbGoal(val);
            handleUpdate({ carbGoal: val });
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setCarbGoal(carbGoal);
            }
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-900">
        Fat Goal
        <input
          type="number"
          value={fatGoal === 0 ? "" : fatGoal}
          min={1}
          max={500}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setFatGoal(0);
              return;
            }
            const val = Number(raw);
            setFatGoal(val);
            handleUpdate({ fatGoal: val });
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setFatGoal(fatGoal);
            }
          }}
          className="w-24 border-b border-sky-400 bg-sky-100 rounded px-2 py-1 text-sm"
        />
      </label>
    </>
  );

  return (
    <div className="relative mt-4" ref={containerRef}>
      <Button
        onClick={() => setOpen(!open)}
        variant="contained"
        className="!bg-sky-700 !text-white hover:!bg-sky-800 !rounded-lg !min-w-0 !p-1 md:!p-2"
      >
        <EditIcon />
      </Button>

      {isMobile ? (
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
          <div className="p-6 flex flex-col gap-4">{inputs}</div>
        </Drawer>
      ) : (
        open && (
          <div className="absolute top-0 right-full mr-2 z-50 bg-white rounded-xl border border-sky-700/30 p-6 flex flex-col gap-4 shadow-md w-72">
            {inputs}
          </div>
        )
      )}
    </div>
  );
}
