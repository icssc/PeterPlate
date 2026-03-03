"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TrackedMealCard from "@/components/ui/card/tracked-meal-card";
import MobileCalorieCard from "@/components/ui/mobile-calorie-card";
import MobileNutritionBars from "@/components/ui/mobile-nutrition-bars";
import NutritionBreakdown from "@/components/ui/nutrition-breakdown";
import NutritionGoals from "@/components/ui/nutrition-goals";
import TrackerHistory from "@/components/ui/tracker-history";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { trpc } from "@/utils/trpc";

export default function MealTracker() {
  const router = useRouter();
  const { userId, isInitialized } = useUserStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!userId) {
      showSnackbar("Login to track meals!", "error");
      router.push("/");
    }
  }, [userId, isInitialized, router, showSnackbar]);

  const {
    data: meals,
    isLoading,
    error,
  } = trpc.nutrition.getMealsInLastWeek.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const { data: goals } = trpc.nutrition.getGoals.useQuery({
    userId: userId ?? "",
  });

  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  // Diet plan toggle
  const [dietPlanByMealId, setDietPlanByMealId] = useState<
    Record<string, boolean>
  >({});

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

  const selectedDay =
    activeDayIndex !== null ? mealsGroupedByDay[activeDayIndex] : null;

  const toNum = (v: string | null) => {
    const n = v == null ? 0 : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Checks dish availability
  const { data: hallData } = trpc.peterplate.useQuery(
    { date: selectedDay?.rawDate ?? new Date() },
    { enabled: Boolean(selectedDay) },
  );

  const availableDishIds = useMemo(() => {
    const set = new Set<string>();
    const halls = [hallData?.anteatery, hallData?.brandywine].filter(Boolean);

    for (const hall of halls) {
      for (const menu of hall?.menus ?? []) {
        for (const station of menu.stations ?? []) {
          for (const dish of station.dishes ?? []) {
            set.add(dish.id);
          }
        }
      }
    }
    return set;
  }, [hallData]);

  const isUnavailable = (dishId: string) =>
    Boolean(hallData) && !availableDishIds.has(dishId);

  // remove dish from tracker if unavailable AND diet plan toggle off
  const visibleMeals = useMemo(() => {
    const items = selectedDay?.items ?? [];

    return items.filter((m) => {
      const unavailable = Boolean(hallData) && !availableDishIds.has(m.dishId);

      const dietOn = Boolean(dietPlanByMealId[m.id]);

      return !(unavailable && !dietOn);
    });
  }, [selectedDay, availableDishIds, dietPlanByMealId, hallData]);

  const countedMeals = visibleMeals.filter(
    (m) => (m.servings ?? 0) > 0 && !isUnavailable(m.dishId),
  );

  const uncountedMeals = visibleMeals.filter((m) => {
    const unavailable = isUnavailable(m.dishId);
    const dietOn = Boolean(dietPlanByMealId[m.id]);
    return (m.servings ?? 0) === 0 || (unavailable && dietOn);
  });

  if (isLoading) return <div>Loading meals...</div>;
  if (error) return <div>Error loading meals</div>;

  return (
    <div className="min-h-screen p-8 mt-12">
      <div className="px-4 md:px-8">
        <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-400">
          Tracker
          {selectedDay && (
            <span className="ml-3 font-semibold">
              -{" "}
              {selectedDay.rawDate.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "2-digit",
              })}
            </span>
          )}
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

        {/* Desktop: NutritionBreakdown */}
        <div className="hidden md:flex items-start gap-4">
          {mealsGroupedByDay.length === 0 ? (
            <div>No meals logged recently.</div>
          ) : (
            <NutritionBreakdown
              mealsEaten={countedMeals.map((m) => ({
                ...m,
                calories: toNum(m.calories),
                protein: toNum(m.protein),
                carbs: toNum(m.carbs),
                fat: toNum(m.fat),
              }))}
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

        {/* Mobile: MobileCalorieCard + MobileNutritionBars */}
        <div className="flex md:hidden flex-col gap-4 mt-4 px-2">
          <MobileCalorieCard
            mealsEaten={countedMeals.map((m) => ({
              ...m,
              calories: toNum(m.calories),
              protein: toNum(m.protein),
              carbs: toNum(m.carbs),
              fat: toNum(m.fat),
            }))}
            calorieGoal={goals?.calorieGoal ?? 2000}
          />
          <MobileNutritionBars
            mealsEaten={countedMeals.map((m) => ({
              ...m,
              calories: toNum(m.calories),
              protein: toNum(m.protein),
              carbs: toNum(m.carbs),
              fat: toNum(m.fat),
            }))}
            proteinGoal={goals?.proteinGoal ?? 75}
            carbGoal={goals?.carbGoal ?? 250}
            fatGoal={goals?.fatGoal ?? 50}
          />
        </div>

        {/* Counted Foods */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Counted Foods
          </h2>
          {countedMeals.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No counted foods.</p>
          ) : (
            <div className="flex flex-wrap gap-4 mt-4">
              {countedMeals.map((meal) => (
                <TrackedMealCard
                  key={meal.id}
                  isUnavailable={isUnavailable(meal.dishId)}
                  dietPlanActive={Boolean(dietPlanByMealId[meal.id])}
                  onToggleDietPlan={() =>
                    setDietPlanByMealId((prev) => ({
                      ...prev,
                      [meal.id]: !prev[meal.id],
                    }))
                  }
                  meal={{
                    ...meal,
                    calories: toNum(meal.calories),
                    protein: toNum(meal.protein),
                    carbs: toNum(meal.carbs),
                    fat: toNum(meal.fat),
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Uncounted Foods */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Uncounted Foods
          </h2>
          {uncountedMeals.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No uncounted foods.</p>
          ) : (
            <div className="flex flex-wrap gap-4 mt-4">
              {uncountedMeals.map((meal) => (
                <TrackedMealCard
                  key={meal.id}
                  isUnavailable={isUnavailable(meal.dishId)}
                  dietPlanActive={Boolean(dietPlanByMealId[meal.id])}
                  onToggleDietPlan={() =>
                    setDietPlanByMealId((prev) => ({
                      ...prev,
                      [meal.id]: !prev[meal.id],
                    }))
                  }
                  meal={{
                    ...meal,
                    calories: toNum(meal.calories),
                    protein: toNum(meal.protein),
                    carbs: toNum(meal.carbs),
                    fat: toNum(meal.fat),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
