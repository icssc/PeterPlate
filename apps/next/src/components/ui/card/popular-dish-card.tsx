import type { DishInfo } from "@api/index";
import { Star } from "@mui/icons-material";
import { Card, Dialog, Drawer } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";
import FoodCard from "./food-card";

interface PopularDishCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  // The dish information to display.
  dish: DishInfo;
  // The dining hall where the dish is served.
  hallName: string;
  // The station where the dish is served.
  stationName: string;
  // Whether to render a compact version of the card.
  isCompact?: boolean;
}

const PopularDishCardContent = React.forwardRef<
  HTMLDivElement,
  PopularDishCardContentProps
>(({ dish, hallName, stationName, isCompact = false, onClick }, ref) => {
  const IconComponent = getFoodIcon(dish.name);
  const iconSize = isCompact ? 16 : 24;
  const descSize = isCompact ? "text-[8px]" : "text-[10px]";

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );
  const averageRating = ratingData?.averageRating ?? 0;

  return (
    <>
      <Card
        className="w-full h-full min-h-[210px] flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent p-0"
        onClick={onClick}
      >
        {/* Dish image */}
        <div className="relative w-full aspect-[16/9] flex-shrink-0 bg-amber-50 dark:bg-neutral-800">
          {dish.image_url ? (
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="20vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <IconComponent
                style={{ fontSize: 48 }}
                className="text-slate-700"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold text-sky-700 leading-tight line-clamp-2 mb-1">
            {formatFoodName(dish.name)}
          </h3>
          <p
            className={`${descSize} text-neutral-500 dark:text-neutral-400 mb-1`}
          >
            {hallName} • {toTitleCase(stationName)}
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-auto">
            <Star style={{ fontSize: iconSize }} />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : "—"}</span>
          </div>
        </div>
      </Card>
    </>
  );
});

export default function PopularDishCard({
  dish,
  hallName,
  stationName,
  isCompact = false,
  onClick,
}: PopularDishCardContentProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();
  const { showSnackbar } = useSnackbarStore();

  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      showSnackbar(`Added ${formatFoodName(dish.name)} to your log`, "success");
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleAddToMealTracker = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      showSnackbar("Login to track meals!", "error");
      return;
    }

    logMealMutation.mutate({
      dishId: dish.id,
      userId,
      dishName: dish.name,
      servings: 1,
    });
  };

  if (isDesktop) {
    return (
      <>
        <PopularDishCardContent
          dish={dish}
          hallName={hallName}
          stationName={stationName}
          isCompact={isCompact}
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
                margin: 2,
                padding: 0,
                overflow: "hidden",
                borderRadius: "16px",
              },
            },
          }}
        >
          <FoodDialogContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <PopularDishCardContent
          dish={dish}
          hallName={hallName}
          stationName={stationName}
          isCompact={isCompact}
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
          <FoodDialogContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Drawer>
      </>
    );
  }
}
