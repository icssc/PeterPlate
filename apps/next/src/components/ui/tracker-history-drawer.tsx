"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, Typography } from "@mui/material";
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

export default function TrackerHistoryDrawer({
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
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          maxHeight: "85vh",
        },
        ".dark & .MuiDrawer-paper": {
          backgroundImage: "none",
          backgroundColor: "#303035",
        },
      }}
    >
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Typography fontWeight={600} color="primary" fontSize="1.125rem">
            What you ate on {dateLabel}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

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

        <TrackerHistoryMealTable mealsEaten={mealsForDay} />
      </div>
    </Drawer>
  );
}
