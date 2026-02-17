import { useSnackbarStore } from "@/context/useSnackbar";
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
  dateString: string;
  mealsEaten: LoggedMealJoinedWithNutrition[];
}

const NutritionBreakdown = ({ dateString, mealsEaten }: Props) => {
  const { showSnackbar } = useSnackbarStore();
  const nutrition: NutritionData = compileMealData(mealsEaten);

  const utils = trpc.useUtils();
  const deleteLoggedMealMutation = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: () => {
      showSnackbar("Removed dish from your log", "success");
      utils.nutrition.invalidate();
    },
    onError: (error) => {
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
    <div>
      <center className="text-[2rem] font-bold">{dateString}</center>
      <div className="flex align-items mt-4">
        <div className="flex flex-col">
          <center className="text-[2rem] font-bold">Calories</center>
          <ProgressDonut
            progress_value={nutrition.calories}
            max_value={2000}
            display_unit=""
          />
        </div>
        <div className="flex flex-col">
          <center className="text-[2rem] font-bold">Protein</center>
          <ProgressDonut
            progress_value={nutrition.protein_g}
            max_value={75}
            display_unit="g"
          />
        </div>
        <div className="flex flex-col">
          <center className="text-[2rem] font-bold">Carbs</center>
          <ProgressDonut
            progress_value={nutrition.carbs_g}
            max_value={250}
            display_unit="g"
          />
        </div>
        <div className="flex flex-col">
          <center className="text-[2rem] font-bold">Fat</center>
          <ProgressDonut
            progress_value={nutrition.fat_g}
            max_value={50}
            display_unit="g"
          />
        </div>
      </div>
      <div className="meal-history">
        {mealsEaten?.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-4 mb-3"
          >
            <div className="flex flex-col">
              <h3 className="font-medium">
                {meal.servings} serving{meal.servings > 1 ? "s" : ""} of{" "}
                {meal.dishName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(meal.calories * meal.servings)} calories |&nbsp;
                {Math.round(meal.protein * meal.servings)}g protein |&nbsp;
                {Math.round(meal.carbs * meal.servings)}g carbs |&nbsp;
                {Math.round(meal.fat * meal.servings)}g fat
              </p>
            </div>

            <button
              type="button"
              className="h-8 rounded-md border px-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => removeBtnOnClick(e, meal.userId, meal.dishId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionBreakdown;
