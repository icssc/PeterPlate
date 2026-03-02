"use client";

import {
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  LibraryBooksOutlined,
  Restaurant,
} from "@mui/icons-material";
import { Card, CardContent, Dialog, Drawer } from "@mui/material";
import type { SelectLoggedMeal } from "@peterplate/db";
import Image from "next/image";
import React from "react";
import FoodDialogContent from "@/components/ui/food-dialog-content";
import FoodDrawerContent from "@/components/ui/food-drawer-content";
import { useDate } from "@/context/date-context";
import { useHallStore } from "@/context/useHallStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";

type LoggedMealJoinedWithNutrition = SelectLoggedMeal & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface Props {
  meal: LoggedMealJoinedWithNutrition;
}

interface TrackedMealCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  meal: LoggedMealJoinedWithNutrition;
  dishNameForIcon?: string;
  imageUrl?: string;
  dietPlanActive?: boolean;
  onToggleDietPlan?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  servingsDraft: number;
  onChangeServings: (next: number) => void;
  servingsDisabled?: boolean;
}

const TrackedMealCardContent = React.forwardRef<
  HTMLDivElement,
  TrackedMealCardContentProps
>(
  (
    {
      meal,
      dishNameForIcon,
      imageUrl,
      dietPlanActive = false,
      onToggleDietPlan,
      onDelete,
      deleteDisabled,
      servingsDraft,
      onChangeServings,
      servingsDisabled,
      className,
      ...divProps
    },
    ref,
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const showImage =
      typeof imageUrl === "string" && imageUrl.trim() !== "" && !imageError;

    const IconComponent =
      (dishNameForIcon ? getFoodIcon(dishNameForIcon) : undefined) ??
      Restaurant;

    return (
      <div ref={ref} {...divProps} className={cn("w-72", className)}>
        <Card
          className="cursor-pointer hover:shadow-lg transition w-full border bg-white"
          sx={{ borderRadius: "12px" }}
        >
          <CardContent sx={{ padding: "0 !important" }}>
            <div className="h-40 p-4 flex justify-between gap-3 text-left">
              <div className="min-w-0 flex flex-col justify-between flex-1">
                <div className="flex items-center gap-3 min-w-0">
                  {showImage && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded flex-shrink-0"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <IconComponent className="w-12 h-12 text-slate-700 flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sky-700 font-semibold text-lg truncate">
                      {meal.dishName}
                    </h3>

                    {/* Edit Servings */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <div className="inline-flex items-stretch rounded-md bg-sky-100 ring-1 ring-sky-200">
                        <div className="w-8 px-2 py-1 text-slate-900 tabular-nums leading-none flex items-center justify-center">
                          {servingsDraft}
                        </div>

                        <div className="flex flex-col border-l border-sky-200 w-6 min-w-6 shrink-0">
                          <button
                            type="button"
                            className="h-4 w-6 flex items-center justify-center hover:bg-sky-200/60 transition disabled:opacity-50 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const next =
                                Math.round((servingsDraft + 0.5) * 2) / 2;
                              onChangeServings(next);
                            }}
                            aria-label="Increase servings"
                            disabled={servingsDisabled}
                          >
                            <ArrowDropUp
                              sx={{ fontSize: 18 }}
                              className="text-sky-700"
                            />
                          </button>

                          <button
                            type="button"
                            className="h-4 w-6 flex items-center justify-center hover:bg-sky-200/60 transition disabled:opacity-50 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = Math.max(
                                0.5,
                                Math.round((servingsDraft - 0.5) * 2) / 2,
                              );
                              onChangeServings(next);
                            }}
                            aria-label="Decrease servings"
                            disabled={servingsDisabled}
                          >
                            <ArrowDropDown
                              sx={{ fontSize: 18 }}
                              className="text-sky-700"
                            />
                          </button>
                        </div>
                      </div>

                      <span className="whitespace-nowrap">
                        serving{servingsDraft !== 1 ? "s" : ""}/bowl
                        {servingsDraft !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-zinc-600">
                  <span>{Math.round(meal.calories * servingsDraft)} cal</span>
                  <span>
                    {Math.round(meal.protein * servingsDraft)}g protein
                  </span>
                  <span>{Math.round(meal.carbs * servingsDraft)}g carbs</span>
                  <span>{Math.round(meal.fat * servingsDraft)}g fat</span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                {/* Diet Plan button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDietPlan?.();
                  }}
                  className={cn(
                    "shrink-0 rounded-lg border-2 p-1 transition mt-5",
                    dietPlanActive
                      ? "bg-green-700 border-green-700 text-white"
                      : "bg-white border-green-700 text-green-700 hover:bg-green-700/20",
                  )}
                  aria-label="View nutrition details"
                >
                  <LibraryBooksOutlined fontSize="small" />
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="shrink-0 p-2 text-zinc-500 hover:text-red-500 transition"
                  aria-label="Delete logged meal"
                  disabled={deleteDisabled}
                >
                  <Delete fontSize="small" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);
TrackedMealCardContent.displayName = "TrackedMealCardContent";

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

  /* Handle Edit Servings/Bowls */
  const [servingsDraft, setServingsDraft] = React.useState(meal.servings);
  React.useEffect(() => {
    setServingsDraft(meal.servings);
  }, [meal.servings]);

  const updateServings = trpc.nutrition.updateLoggedMealServings.useMutation({
    onSuccess: async () => {
      await utils.nutrition.invalidate();
    },
    onError: (err) => {
      console.error(err.message);
      setServingsDraft(meal.servings);
    },
  });

  const handleChangeServings = (next: number) => {
    setServingsDraft(next);
    updateServings.mutate({ id: meal.id, servings: next });
  };

  /* Handle Diet Plan Button */
  const [dietPlanActive, setDietPlanActive] = React.useState(false);
  //TODO : Implement diet plan logic

  /* Handle Delete Button */
  const deleteLoggedMeal = trpc.nutrition.deleteLoggedMeal.useMutation({
    onSuccess: async () => {
      await utils.nutrition.invalidate();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const handleDelete = () => {
    deleteLoggedMeal.mutate({
      userId: meal.userId,
      dishId: meal.dishId,
    });
  };

  const imageUrl = dish?.image_url;
  const dishNameForIcon = dish?.name ?? meal.dishName;

  if (isDesktop)
    return (
      <>
        <TrackedMealCardContent
          meal={meal}
          dishNameForIcon={dishNameForIcon}
          imageUrl={typeof imageUrl === "string" ? imageUrl : undefined}
          servingsDraft={servingsDraft}
          onChangeServings={handleChangeServings}
          servingsDisabled={updateServings.isPending}
          dietPlanActive={dietPlanActive}
          onToggleDietPlan={() => setDietPlanActive((v) => !v)}
          onDelete={handleDelete}
          deleteDisabled={deleteLoggedMeal.isPending}
          onClick={handleOpen}
        />

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
      </>
    );

  return (
    <>
      <TrackedMealCardContent
        meal={meal}
        dishNameForIcon={dishNameForIcon}
        imageUrl={typeof imageUrl === "string" ? imageUrl : undefined}
        servingsDraft={servingsDraft}
        onChangeServings={handleChangeServings}
        servingsDisabled={updateServings.isPending}
        dietPlanActive={dietPlanActive}
        onToggleDietPlan={() => setDietPlanActive((v) => !v)}
        onDelete={handleDelete}
        deleteDisabled={deleteLoggedMeal.isPending}
        onClick={handleOpen}
      />

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
    </>
  );
}
