"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchMealCard from "@/components/ui/card/search-meal-card";
import TrackedMealCard from "@/components/ui/card/tracked-meal-card";
import MobileCalorieCard from "@/components/ui/mobile-calorie-card";
import MobileNutritionBars from "@/components/ui/mobile-nutrition-bars";
import NutritionBreakdown from "@/components/ui/nutrition-breakdown";
import NutritionGoals from "@/components/ui/nutrition-goals";
import TrackerHistory from "@/components/ui/tracker-history";
import TrackerHistoryDialog from "@/components/ui/tracker-history-dialog";
import TrackerHistoryDrawer from "@/components/ui/tracker-history-drawer";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";

export default function MealTracker() {
  const utils = trpc.useUtils();
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

  const today = new Date().toISOString().split("T")[0];

  const { data: defaultGoals } = trpc.nutrition.getGoals.useQuery({
    userId: userId ?? "",
  });
  const { data: dayGoals } = trpc.nutrition.getGoalsByDay.useQuery(
    { userId: userId ?? "", date: today },
    { enabled: !!userId },
  );
  const goals = dayGoals ?? defaultGoals;

  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyDate, setHistoryDate] = useState<Date | null>(null);

  const historyDateStr = historyDate
    ? historyDate.toISOString().split("T")[0]
    : today;

  const { data: historyDayGoals } = trpc.nutrition.getGoalsByDay.useQuery(
    { userId: userId ?? "", date: historyDateStr },
    { enabled: !!userId && !!historyDate },
  );
  const historyGoals = historyDayGoals ?? defaultGoals;

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

  const activeDayIndex = mealsGroupedByDay.length > 0 ? 0 : null;
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

  // suggested meals memo
  const suggestedMeals = useMemo(() => {
    if (!meals) return [];
    const servingCounts: Record<string, number> = {};
    const latestByDish: Record<string, (typeof meals)[0]> = {};

    for (const meal of meals) {
      if (!meal.dishId) continue;
      servingCounts[meal.dishId] =
        (servingCounts[meal.dishId] ?? 0) + (meal.servings ?? 1);
      if (!latestByDish[meal.dishId]) latestByDish[meal.dishId] = meal;
    }

    return Object.entries(servingCounts)
      .filter(([, total]) => total >= 5)
      .sort(([, a], [, b]) => b - a)
      .map(([dishId]) => {
        const meal = latestByDish[dishId]!;
        return {
          ...meal,
          calories: Number(meal.calories ?? 0),
          protein: Number(meal.protein ?? 0),
          carbs: Number(meal.carbs ?? 0),
          fat: Number(meal.fat ?? 0),
          servings: 1,
        };
      });
  }, [meals]);

  // logmeal mutation
  const logMeal = trpc.nutrition.logMeal.useMutation({
    onSuccess: async () => {
      await utils.nutrition.invalidate();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  // remove dish from tracker if unavailable
  const visibleMeals = selectedDay?.items ?? [];

  const countedMeals = visibleMeals.filter(
    (m) => (m.servings ?? 0) > 0 && !isUnavailable(m.dishId),
  );

  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) return <div>Loading meals...</div>;
  if (error) return <div>Error loading meals</div>;

  return (
    <div className="min-h-screen p-8 mt-12">
      <div className="px-2 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-700 dark:text-sky-400 flex items-center justify-between">
          <span className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
            Tracker
            {selectedDay && (
              <span className="font-semibold">
                -{" "}
                {selectedDay.rawDate.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "2-digit",
                })}
              </span>
            )}
          </span>
          {/* History button - mobile only */}
          <div className="flex md:hidden">
            {userId && (
              <TrackerHistory
                onDateSelect={() => {}}
                onDayClick={(date) => {
                  setHistoryDate(date);
                  setHistoryDialogOpen(true);
                }}
              />
            )}
          </div>
        </h1>

        {/* Subheading + History - desktop only */}
        <div className="hidden md:flex items-center justify-between mt-1">
          <p className="text-zinc-800 dark:text-zinc-400">
            Keep track of your health using our Nutrition Tracker! Add dishes to
            count them towards your totals!
          </p>
          {userId && (
            <TrackerHistory
              onDateSelect={() => {}}
              onDayClick={(date) => {
                setHistoryDate(date);
                setHistoryDialogOpen(true);
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
            {userId && (
              <NutritionGoals
                userId={userId}
                date={new Date().toISOString().split("T")[0]}
              />
            )}
          </div>
        </div>

        {/* Mobile: MobileCalorieCard + MobileNutritionBars */}
        <div className="flex md:hidden flex-col gap-4 mt-4 w-full">
          <MobileCalorieCard
            mealsEaten={countedMeals.map((m) => ({
              ...m,
              calories: toNum(m.calories),
              protein: toNum(m.protein),
              carbs: toNum(m.carbs),
              fat: toNum(m.fat),
            }))}
            calorieGoal={goals?.calorieGoal ?? 2000}
            userId={userId ?? ""}
            date={new Date().toISOString().split("T")[0]}
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

        {isMobile ? (
          <TrackerHistoryDrawer
            open={historyDialogOpen}
            onClose={() => setHistoryDialogOpen(false)}
            selectedDate={historyDate}
            allMeals={
              meals?.map((m) => ({
                ...m,
                calories: toNum(m.calories),
                protein: toNum(m.protein),
                carbs: toNum(m.carbs),
                fat: toNum(m.fat),
              })) ?? []
            }
            calorieGoal={historyGoals?.calorieGoal ?? 2000}
            proteinGoal={historyGoals?.proteinGoal ?? 100}
            carbGoal={historyGoals?.carbGoal ?? 250}
            fatGoal={historyGoals?.fatGoal ?? 50}
            userId={userId ?? ""}
          />
        ) : (
          <TrackerHistoryDialog
            open={historyDialogOpen}
            onClose={() => setHistoryDialogOpen(false)}
            selectedDate={historyDate}
            allMeals={
              meals?.map((m) => ({
                ...m,
                calories: toNum(m.calories),
                protein: toNum(m.protein),
                carbs: toNum(m.carbs),
                fat: toNum(m.fat),
              })) ?? []
            }
            calorieGoal={historyGoals?.calorieGoal ?? 2000}
            proteinGoal={historyGoals?.proteinGoal ?? 100}
            carbGoal={historyGoals?.carbGoal ?? 250}
            fatGoal={historyGoals?.fatGoal ?? 50}
            userId={userId ?? ""}
          />
        )}

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

          {/* Suggested Foods */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Suggested Foods
            </h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {suggestedMeals.length === 0 ? (
                <p className="mt-2 text-zinc-500 text-sm">
                  Dishes from the past week logged 5+ times will appear here
                </p>
              ) : (
                suggestedMeals.map((meal) => (
                  <SearchMealCard
                    key={meal.dishId}
                    meal={meal}
                    onAdd={(meal, servings) =>
                      logMeal.mutate({
                        userId: userId!,
                        dishId: meal.dishId ?? "",
                        dishName: meal.dishName ?? "",
                        servings,
                        eatenAt: new Date(),
                      })
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
