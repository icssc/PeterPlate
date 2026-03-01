import { trpc } from "@/utils/trpc";
import type { SelectLoggedMeal } from "../../../../../packages/db/src/schema";
import { ProgressDonut } from "../progress-donut";

interface NutritionData {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function compileMealData(
  meals: LoggedMealJoinedWithNutrition[],
): NutritionData {
  const data = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  };

  for (const meal of meals) {
    const servings = meal.servings;
    data.calories += meal.calories * servings;
    data.protein_g += meal.protein * servings;
    data.carbs_g += meal.carbs * servings;
    data.fat_g += meal.fat * servings;
  }

  data.calories = Math.round(data.calories);
  data.protein_g = Math.round(data.protein_g);
  data.carbs_g = Math.round(data.carbs_g);
  data.fat_g = Math.round(data.fat_g);

  return data;
}

interface Props {
  mealsEaten: LoggedMealJoinedWithNutrition[];
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

const NutritionBreakdown = ({
  mealsEaten,
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
}: Props) => {
  const nutrition: NutritionData = compileMealData(mealsEaten);

  const utils = trpc.useUtils();
  const deleteLoggedMealMutation = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: () => {
      //TODO: Replace this with a shad/cn sonner or equivalent.
      alert(`Removed dish from your log`);
      utils.nutrition.invalidate();
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  const removeBtnOnClick = (
    e: React.MouseEvent,
    userId: string | null,
    dishId: string | null,
  ) => {
    e.preventDefault();
    if (!userId || !dishId) return;

    deleteLoggedMealMutation.mutate({ userId, dishId });
  };

  return (
    <div className="flex flex-row gap-6 mt-6">
      <div className="bg-sky-100 rounded-xl px-4 flex flex-row items-center justify-between w-80 h-36">
        <span className="text-3xl text-sky-700 font-medium pl-3">Calories</span>
        <ProgressDonut
          progress_value={nutrition.calories}
          max_value={calorieGoal}
          display_unit=""
          trackColor="#0084D1"
          progressColor="#00BCFF"
        />
      </div>
      <div className="bg-sky-100 rounded-xl px-4 flex flex-row items-center justify-between w-80 h-36">
        <span className="text-3xl text-sky-700 font-medium pl-3">Protein</span>
        <ProgressDonut
          progress_value={nutrition.protein_g}
          max_value={proteinGoal}
          display_unit="g"
        />
      </div>
      <div className="bg-sky-100 rounded-xl px-4  flex flex-row items-center justify-between w-80 h-36">
        <span className="text-3xl text-sky-700 font-medium pl-3">Carbs</span>
        <ProgressDonut
          progress_value={nutrition.carbs_g}
          max_value={carbGoal}
          display_unit="g"
        />
      </div>
      <div className="bg-sky-100 rounded-xl px-4 flex flex-row items-center justify-between w-80 h-36">
        <span className="text-3xl text-sky-700 font-medium pl-3">Fat</span>
        <ProgressDonut
          progress_value={nutrition.fat_g}
          max_value={fatGoal}
          display_unit="g"
        />
      </div>
    </div>
  );
};

export default NutritionBreakdown;
