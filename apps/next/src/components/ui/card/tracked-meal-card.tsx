"use client";

import { Delete, LibraryBooksOutlined } from "@mui/icons-material";
import { Dialog, Drawer } from "@mui/material";
import type { SelectLoggedMeal } from "@peterplate/db";
import React from "react";
import FoodDialogContent from "@/components/ui/food-dialog-content";
import FoodDrawerContent from "@/components/ui/food-drawer-content";
import { useDate } from "@/context/date-context";
import { useHallStore } from "@/context/useHallStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trpc } from "@/utils/trpc";

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface Props {
  meal: LoggedMealJoinedWithNutrition;
}

export default function TrackedMealCard({ meal }: Props) {
  /* Handle Display Food Card Info */
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { selectedDate } = useDate();
  const today = useHallStore((s) => s.today);

  const { data, isLoading } = trpc.peterplate.useQuery(
    { date: selectedDate ?? today },
    { enabled: open },
  );

  const dish = React.useMemo(() => {
    const halls = [data?.anteatery, data?.brandywine].filter(Boolean);
    for (const hall of halls) {
      for (const menu of hall?.menus ?? []) {
        for (const station of menu.stations ?? []) {
          const found = station.dishes?.find((d) => d.id === meal.dishId);
          if (found) return found;
        }
      }
    }
    return undefined;
  }, [data, meal.dishId]);

  const utils = trpc.useUtils();

  /* Handle Diet Plan Button */
  const [dietPlanActive, setDietPlanActive] = React.useState(false);
  // TODO: implement diet plan functionality

  /* Handle Delete Button */
  const deleteLoggedMeal = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: async () => {
      await utils.nutrition.invalidate();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-72 h-40 rounded-xl border p-4 cursor-pointer hover:shadow-lg transition bg-white"
      >
        <div className="flex h-full justify-between gap-3">
          <div className="min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-sky-700 font-semibold text-lg truncate">
                {meal.dishName}
              </h3>
              <p className="text-sm text-zinc-500">
                {meal.servings} serving{meal.servings !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex gap-4 text-sm text-zinc-600">
              <span>{Math.round(meal.calories * meal.servings)} cal</span>
              <span>{Math.round(meal.protein * meal.servings)}g protein</span>
              <span>{Math.round(meal.carbs * meal.servings)}g carbs</span>
              <span>{Math.round(meal.fat * meal.servings)}g fat</span>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end">
            {/* Diet Plan button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDietPlanActive((v) => !v);
                // TODO: implement diet plan functionality
              }}
              className={`shrink-0 rounded-lg border-2 p-1 transition mt-5 ${
                dietPlanActive
                  ? "bg-green-700 border-green-700 text-white"
                  : "bg-white border-green-700 text-green-700 hover:bg-green-700/20"
              }`}
              aria-label="View nutrition details"
            >
              <LibraryBooksOutlined fontSize="small" />
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteLoggedMeal.mutate({
                  userId: meal.userId,
                  dishId: meal.dishId,
                });
              }}
              className="shrink-0 p-2 text-zinc-500 hover:text-red-500 transition"
              aria-label="Delete logged meal"
              disabled={deleteLoggedMeal.isPending}
            >
              <Delete fontSize="small" />
            </button>
          </div>
        </div>
      </button>

      {isDesktop ? (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          slotProps={{
            paper: {
              sx: {
                width: "460px",
                maxWidth: "90vw",
                maxHeight: "90vh",
                margin: 2,
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
              },
            },
          }}
        >
          {dish ? (
            <FoodDialogContent dish={dish} />
          ) : (
            <div className="p-4">
              {isLoading ? "Loading..." : "Dish not found"}
            </div>
          )}
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                width: "460px",
                maxWidth: "90vw",
                maxHeight: "85vh",
                margin: 2,
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
              },
            },
          }}
          sx={{
            "& .MuiDrawer-paper": {
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              marginTop: "96px",
              height: "auto",
              maxHeight: "85vh",
            },
          }}
        >
          {dish ? (
            <FoodDrawerContent dish={dish} />
          ) : (
            <div className="p-4">
              {isLoading ? "Loading..." : "Dish not found"}
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
