import {
  DeleteOutline,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import type React from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { formatFoodName } from "@/utils/funcs";
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
  userId: string;
}

const NutritionBreakdown = ({ dateString, mealsEaten }: Props) => {
  const { showSnackbar } = useSnackbarStore();
  const nutrition: NutritionData = compileMealData(mealsEaten);

  const utils = trpc.useUtils();

  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: (data) => {
      showSnackbar(
        `Added ${formatFoodName(data.dishName)} to your log`,
        "success",
      );
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error);
      showSnackbar("Failed to add meal to your log", "error");
    },
  });

  const deleteMealMutation = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: (data) => {
      showSnackbar(
        `Removed ${formatFoodName(data.dishName)} from your log`,
        "success",
      );
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error);
      showSnackbar("Failed to remove meal from your log", "error");
    },
  });

  const handleAdjustQuantity = (
    meal: LoggedMealJoinedWithNutrition,
    newServings: number,
  ) => {
    if (newServings < 0.5) {
      showSnackbar("Minimum serving size is 0.5", "error");
      return;
    }

    logMealMutation.mutate({
      dishId: meal.dishId,
      userId: meal.userId,
      dishName: meal.dishName,
      servings: newServings,
    });
  };

  const handleIncreaseQuantity = (
    e: React.MouseEvent,
    meal: LoggedMealJoinedWithNutrition,
  ) => {
    e.stopPropagation();
    const newServings = meal.servings + 0.5;
    handleAdjustQuantity(meal, newServings);
  };

  const handleDecreaseQuantity = (
    e: React.MouseEvent,
    meal: LoggedMealJoinedWithNutrition,
  ) => {
    e.stopPropagation();
    const newServings = Math.max(0.5, meal.servings - 0.5);
    handleAdjustQuantity(meal, newServings);
  };

  const removeBtnOnClick = (
    e: React.MouseEvent,
    userId: string | null,
    dishId: string | null,
  ) => {
    e.preventDefault();
    if (!userId || !dishId) return;

    deleteMealMutation.mutate({ userId, dishId });
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
            <div className="flex flex-col flex-1">
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

            <Stack direction="column" spacing={0.5}>
              <IconButton
                size="small"
                onClick={(e) => handleIncreaseQuantity(e, meal)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "4px",
                  padding: "2px",
                }}
              >
                <KeyboardArrowUp fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => handleDecreaseQuantity(e, meal)}
                disabled={meal.servings <= 0.5}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "4px",
                  padding: "2px",
                }}
              >
                <KeyboardArrowDown fontSize="small" />
              </IconButton>
            </Stack>

            <IconButton
              aria-label="delete"
              size="small"
              color="error"
              onClick={(e) => removeBtnOnClick(e, meal.userId, meal.dishId)}
              sx={{
                border: "1px solid",
                borderColor: "error.main",
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionBreakdown;
