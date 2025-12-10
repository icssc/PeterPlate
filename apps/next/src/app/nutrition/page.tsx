'use client';

import { trpc } from "@/utils/trpc";
import { useEffect, useMemo, useState } from "react";
import NutritionBreakdown from "@/components/ui/nutrition-breakdown";
import { SelectLoggedMeal } from "@zotmeal/db";

const DUMMY_USER_ID = "TEST_USER";

export default function Nutrition() {
  const { data: meals, isLoading, error } = trpc.nutrition.getMealsInLastWeek.useQuery({ userId: DUMMY_USER_ID });
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

  const selectedDay = activeDayIndex !== null ? mealsGroupedByDay[activeDayIndex] : null;

  return (
    <div className="cols-container h-screen flex">
      <div className="mt-12 w-[300px] border-r p-4 flex flex-col gap-2">
        {mealsGroupedByDay.map((day, index) => (
          <button 
             key={day.dateLabel} 
             onClick={() => setActiveDayIndex(index)}
             className={`text-left p-2 hover:bg-gray-100 ${activeDayIndex === index ? 'font-bold bg-gray-200' : ''}`}
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
            mealsEaten={selectedDay.items}
          />
        )}
      </div>
    </div>
  );
}