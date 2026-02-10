"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import NutritionBreakdown from "@/components/ui/nutrition-breakdown";
import { useUserStore } from "@/context/useUserStore";
import { trpc } from "@/utils/trpc";

export default function MealTracker() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users of issue
    if (!userId) {
      alert("Login to track meals!");
      router.push("/");
    }
  }, [userId, router.push]);

  const {
    data: meals,
    isLoading,
    error,
  } = trpc.nutrition.getMealsInLastWeek.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  const mealsGroupedByDay = useMemo(() => {
    if (!meals) return [];
    const groups: Record<string, typeof meals> = {};

    meals.forEach((meal) => {
      const dateKey = new Date(meal.eatenAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(meal);
    });

    const result = Object.keys(groups).map((dateKey) => ({
      dateLabel: dateKey,
      items: groups[dateKey],
      rawDate: new Date(dateKey),
    }));

    return result.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  }, [meals]);

  useEffect(() => {
    if (mealsGroupedByDay.length > 0 && activeDayIndex === null) {
      setActiveDayIndex(0);
    }
  }, [mealsGroupedByDay, activeDayIndex]);

  if (isLoading) return <div>Loading meals...</div>;
  if (error) return <div>Error loading meals</div>;

  const selectedDay =
    activeDayIndex !== null ? mealsGroupedByDay[activeDayIndex] : null;

  const toNum = (v: string | null) => {
    const n = v == null ? 0 : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <div className="cols-container min-h-screen flex">
      <div className="mt-12 w-[300px] border-r p-4 flex flex-col gap-2">
        {mealsGroupedByDay.map((day, index) => (
          <button
            type="button"
            key={day.dateLabel}
            onClick={() => setActiveDayIndex(index)}
            className={`text-left p-2 hover:bg-gray-100 ${activeDayIndex === index ? "font-bold bg-gray-200" : ""}`}
          >
            {day.dateLabel}
          </button>
        ))}
        {mealsGroupedByDay.length === 0 && <div>No meals logged recently.</div>}
      </div>

      <div className="mt-12 p-4">
        {selectedDay && (
          <NutritionBreakdown
            dateString={selectedDay.dateLabel}
            mealsEaten={selectedDay.items.map((m) => ({
              ...m,
              calories: toNum(m.calories),
              protein: toNum(m.protein),
              carbs: toNum(m.carbs),
              fat: toNum(m.fat),
            }))}
          />
        )}
      </div>
    </div>
  );
}
