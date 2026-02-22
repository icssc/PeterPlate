"use client";

import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  StarBorder,
} from "@mui/icons-material";
import { Card, CardContent, Dialog, Drawer } from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import Image from "next/image";
import React from "react";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";
import type { OnAddToMealTracker } from "./food-card";

// Compact read-only star display for the card footer
function UserRatingDisplay({ dishId }: { dishId: string }) {
  const userId = useUserStore((s) => s.userId);
  const { data: userRating } = trpc.user.getUserRating.useQuery(
    { userId: userId ?? "", dishId },
    { enabled: !!userId, staleTime: 5 * 60 * 1000 },
  );

  if (!userId || userRating == null) {
    return <span className="text-xs">Not rated yet</span>;
  }

  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarBorder
          key={n}
          className={cn(
            "w-3.5 h-3.5",
            n <= userRating
              ? "fill-amber-400 stroke-amber-400 text-amber-400"
              : "stroke-gray-400 text-gray-400",
          )}
          strokeWidth={n <= userRating ? 0 : 1}
        />
      ))}
    </div>
  );
}

interface MyFoodsCardProps {
  dish: DishInfo;
  isFavorited: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite?: (dishId: string, currentlyFavorite: boolean) => void;
  className?: string;
}

const MyFoodsCardContent = React.forwardRef<
  HTMLDivElement,
  MyFoodsCardProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      dish,
      isFavorited,
      favoriteDisabled,
      onToggleFavorite,
      className,
      ...divProps
    },
    ref,
  ) => {
    const userId = useUserStore((s) => s.userId);
    const IconComponent = getFoodIcon(dish.name);
    const [imageError, setImageError] = React.useState(false);
    const showImage =
      typeof dish.image_url === "string" &&
      dish.image_url.trim() !== "" &&
      !imageError;

    const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
      { dishId: dish.id },
      { staleTime: 5 * 60 * 1000 },
    );
    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!userId) {
        alert("Login to favorite meals!");
        return;
      }
      if (favoriteDisabled || !onToggleFavorite) return;
      onToggleFavorite(dish.id, Boolean(isFavorited));
    };

    return (
      <div ref={ref} {...divProps} className={cn("w-full", className)}>
        <Card
          className="cursor-pointer hover:shadow-lg transition w-full border"
          sx={{ borderRadius: "16px" }}
        >
          <CardContent sx={{ padding: "0 !important" }}>
            <div className="flex flex-col">
              <div className="flex items-start gap-3 p-4 pb-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-[84px] h-[84px] rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                  {showImage ? (
                    <Image
                      src={dish.image_url}
                      alt={formatFoodName(dish.name)}
                      width={84}
                      height={84}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : IconComponent ? (
                    <IconComponent className="w-10 h-10 text-slate-500" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 rounded" />
                  )}
                </div>

                {/* Info column */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {/* Name row and heart */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-base text-sky-700 leading-snug">
                      {formatFoodName(dish.name)}
                    </span>
                    <button
                      type="button"
                      aria-label={
                        isFavorited
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorited}
                      disabled={favoriteDisabled}
                      onClick={handleFavoriteClick}
                      className={cn(
                        "flex-shrink-0 rounded-full p-1 transition",
                        favoriteDisabled ? "opacity-60" : "hover:bg-rose-50",
                      )}
                    >
                      {isFavorited ? (
                        <Favorite className="w-5 h-5 text-rose-500" />
                      ) : (
                        <FavoriteBorder className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Calories and average rating */}
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-slate-900 font-normal">
                      {dish.nutritionInfo.calories == null
                        ? "-"
                        : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
                    </span>
                    <div className="flex items-center gap-0.5 text-zinc-500">
                      <StarBorder
                        className="w-3.5 h-3.5 stroke-zinc-500"
                        strokeWidth={0.15}
                      />
                      <span>
                        {averageRating.toFixed(1)} ({ratingCount})
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {dish.description && (
                    <p className="text-slate-700 text-sm line-clamp-2 leading-snug">
                      {dish.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-sky-700 mx-4" />

              {/* Location and user rating */}
              <div className="flex items-center justify-between px-4 py-2.5 gap-2">
                <div className="flex items-center gap-1 text-gray-500 text-xs min-w-0">
                  <LocationOn className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {toTitleCase(dish.restaurant)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs whitespace-nowrap">
                    Your rating:
                  </span>
                  <UserRatingDisplay dishId={dish.id} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);
MyFoodsCardContent.displayName = "MyFoodsCardContent";

export default function MyFoodsCard({
  dish,
  isFavorited,
  favoriteDisabled,
  onToggleFavorite,
  className,
}: MyFoodsCardProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();

  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      alert(`Added ${formatFoodName(dish.name)} to your log`);
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleAddToMealTracker: OnAddToMealTracker = (e) => {
    e.stopPropagation();
    if (!userId) {
      alert("Login to track meals!");
      return;
    }
    logMealMutation.mutate({
      dishId: dish.id,
      userId,
      dishName: dish.name,
      servings: 1,
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dialogSlotProps = {
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
  };

  return (
    <>
      <MyFoodsCardContent
        dish={dish}
        isFavorited={isFavorited}
        favoriteDisabled={favoriteDisabled}
        onToggleFavorite={onToggleFavorite}
        onClick={handleOpen}
        className={className}
      />

      {isDesktop ? (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          slotProps={dialogSlotProps}
        >
          <FoodDialogContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          slotProps={dialogSlotProps}
        >
          <FoodDrawerContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Drawer>
      )}
    </>
  );
}
