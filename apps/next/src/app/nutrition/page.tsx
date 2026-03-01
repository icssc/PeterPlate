"use client";

import type { SelectLoggedMeal } from "@peterplate/db";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TrackedMealCard from "@/components/ui/card/tracked-meal-card";
import NutritionBreakdown from "@/components/ui/nutrition-breakdown";
import NutritionGoals from "@/components/ui/nutrition-goals";
import TrackerHistory from "@/components/ui/tracker-history";
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
  } = trpc.nutrition.getMealsInLastWeek.useQuery({ userId: userId ?? "" });

  const { data: goals } = trpc.nutrition.getGoals.useQuery({
    userId: userId ?? "",
  });

  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  const mealsGroupedByDay = useMemo(() => {
    if (!meals) return [];
    const groups: Record<string, typeof meals> = {};

    meals.forEach((meal: SelectLoggedMeal) => {
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

  return (
    <div className="min-h-screen p-8 mt-12">
      <div className="pl-8">
        <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400">
          Tracker
        </h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-zinc-800 dark:text-zinc-400">
            Keep track of your health using our Nutrition Tracker! Add dishes to
            count them towards your totals!
          </p>
          {userId && (
            <TrackerHistory
              onDateSelect={(date) => {
                const index = mealsGroupedByDay.findIndex(
                  (day) => day.rawDate.toDateString() === date.toDateString(),
                );
                if (index !== -1) setActiveDayIndex(index);
              }}
            />
          )}
        </div>

        <div className="flex items-start gap-4">
          {mealsGroupedByDay.length === 0 ? (
            <div>No meals logged recently.</div>
          ) : (
            <NutritionBreakdown
              mealsEaten={mealsGroupedByDay[activeDayIndex ?? 0]?.items ?? []}
              calorieGoal={goals?.calorieGoal ?? 2000}
              proteinGoal={goals?.proteinGoal ?? 75}
              carbGoal={goals?.carbGoal ?? 250}
              fatGoal={goals?.fatGoal ?? 50}
            />
          )}
          <div className="relative mt-4 ml-auto">
            {userId && <NutritionGoals userId={userId} />}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {selectedDay?.items.map((meal) => (
            <TrackedMealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
