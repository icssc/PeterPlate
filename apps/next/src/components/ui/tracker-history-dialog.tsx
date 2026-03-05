"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MobileCalorieCard from "@/components/ui/mobile-calorie-card";
import MobileNutritionBars from "@/components/ui/mobile-nutrition-bars";
import type { LoggedMealJoinedWithNutrition } from "@/components/ui/nutrition-breakdown";
import TrackerHistoryMealTable from "@/components/ui/tracker-history-meal-table";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  allMeals: LoggedMealJoinedWithNutrition[];
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  userId: string;
}

export default function TrackerHistoryDialog({
  open,
  onClose,
  selectedDate,
  allMeals,
  calorieGoal,
  proteinGoal,
  carbGoal,
  fatGoal,
  userId,
}: Props) {
  const mealsForDay = allMeals.filter((m) =>
    selectedDate
      ? new Date(m.eatenAt).toDateString() === selectedDate.toDateString()
      : false,
  );

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          width: "700px",
          maxWidth: "700px",
        },
      }}
    >
      <DialogTitle className="!font-semibold !text-sky-700">
        What you ate on {dateLabel}
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-row gap-4">
          <MobileCalorieCard
            mealsEaten={mealsForDay}
            calorieGoal={calorieGoal}
            userId={userId}
            hideEditButton
          />
          <MobileNutritionBars
            mealsEaten={mealsForDay}
            proteinGoal={proteinGoal}
            carbGoal={carbGoal}
            fatGoal={fatGoal}
          />
        </div>
        <TrackerHistoryMealTable mealsEaten={mealsForDay} />
      </DialogContent>

      <DialogActions className="!px-6 !pb-4">
        <Button
          onClick={onClose}
          variant="contained"
          className="!bg-sky-700 !text-white !text-sm !font-semibold hover:!bg-sky-800 !rounded-lg !px-3 !py-1 !normal-case"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
