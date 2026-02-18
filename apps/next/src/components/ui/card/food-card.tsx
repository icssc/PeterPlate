"use client";

import { Restaurant, StarBorder } from "@mui/icons-material";
import { Card, CardContent, Dialog, Drawer, Typography } from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import Image from "next/image";
import React from "react";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
import Favorite from "../favorite";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";

/** Handler for "Add to meal tracker" used by card, dialog, and drawer. */
export type OnAddToMealTracker = (e: React.MouseEvent) => void;

/**
 * Props for the FoodCardContent component.
 */
interface FoodCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The dish information to display.
   */
  dish: DishInfo;
  /**
   * Whether the dish is currently marked as favorite.
   */
  isFavorited?: boolean;
  /**
   * Whether the favorite toggle button should be disabled.
   */
  favoriteDisabled?: boolean;
  /**
   * Handler invoked when a user toggles the favorite button.
   */
  onToggleFavorite?: (dishId: string, currentlyFavorite: boolean) => void;
  /**
   * Handler invoked when a user clicks "Add to meal tracker" (card, dialog, or drawer).
   */
  onAddToMealTracker?: OnAddToMealTracker;

  /**
   * Whether to render a compact version of the card.
   */
  isCompact?: boolean;
}

/**
 * FoodCardContent component displays the visual representation of a food item within a card.
 * It shows the food's name, icon, calories, and a placeholder rating.
 * This component is intended to be used as a trigger for a dialog showing more details.
 */
const FoodCardContent = React.forwardRef<HTMLDivElement, FoodCardContentProps>(
  (
    {
      dish,
      isFavorited,
      favoriteDisabled,
      onToggleFavorite,
      onAddToMealTracker,
      isCompact = false,
      className,
      ...divProps
    },
    ref,
  ) => {
    const userId = useUserStore((state) => state.userId);
    const IconComponent = getFoodIcon(dish.name) ?? Restaurant;
    const [imageError, setImageError] = React.useState(false);
    const showImage =
      typeof dish.image_url === "string" &&
      dish.image_url.trim() !== "" &&
      !imageError;

    /**
     * Fetches the average rating and rating count for the dish.
     */
    const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
      { dishId: dish.id },
      { staleTime: 5 * 60 * 1000 },
    );

    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    const utils = trpc.useUtils();
    const logMealMutation = trpc.nutrition.logMeal.useMutation({
      onSuccess: () => {
        //TODO: Replace this with a shad/cn sonner or equivalent.
        alert(`Added ${formatFoodName(dish.name)} to your log`);
        utils.nutrition.invalidate();
      },
      onError: (error) => {
        console.error(error.message);
      },
    });

    const _handleLogMeal = (e: React.MouseEvent) => {
      e.stopPropagation();

      // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users.
      if (!userId) {
        alert("Login to track meals!");
        return;
      }

      logMealMutation.mutate({
        dishId: dish.id,
        userId: userId,
        dishName: dish.name,
        // TODO: add ability to manually input servings. Maybe a popup to ask
        //       for an input of a multiple of 0.5
        servings: 1,
      });
    };

    return (
      <div
        ref={ref}
        {...divProps}
        className={cn("w-xs flex-shrink-0", className)}
      >
        <Card
          className="cursor-pointer hover:shadow-lg transition w-full border"
          sx={{ borderRadius: "12px" }}
        >
          <CardContent
            sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}
          >
            <div className="flex justify-between h-full p-4 gap-4">
              <div className="flex items-center gap-4 w-full">
                {!isCompact && showImage && dish.image_url && !imageError && (
                  <Image
                    src={dish.image_url}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded"
                    onError={() => setImageError(true)}
                  />
                )}
                {!isCompact && !showImage && IconComponent && (
                  <IconComponent className="w-12 h-12 text-zinc-700 dark:text-zinc-400 flex-shrink-0" />
                )}
                <div className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "font-semibold text-base text-sky-700 dark:text-sky-600",
                      isCompact && "font-bold",
                    )}
                  >
                    {formatFoodName(dish.name)}
                  </span>
                  <div className="flex gap-2 items-center text-zinc-700 text-sm">
                    <div className="text-zinc-900 dark:text-zinc-300 font-normal">
                      <span>
                        {dish.nutritionInfo.calories == null
                          ? "-"
                          : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center text-zinc-500">
                      <StarBorder
                        className="w-4 h-4 stroke-zinc-500"
                        strokeWidth={0.15}
                      />
                      <p>
                        {averageRating.toFixed(1)}&nbsp;
                        {!isCompact && <span>({ratingCount})</span>}
                      </p>
                    </div>
                  </div>
                  {dish.description && (
                    <Typography
                      noWrap
                      className="text-zinc-900 text-sm font-normal dark:text-zinc-300 md:w-72"
                    >
                      {dish.description}
                    </Typography>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <Favorite
                  dishId={dish.id}
                  {...{ isFavorited, favoriteDisabled }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);
FoodCardContent.displayName = "FoodCardContent";

/**
 * A Client Component that renders an interactive food card.
 * Clicking the card opens a dialog with full dish details.
 *
 * This component combines an `FoodCardContent` (the visual card) with a
 * `Dialog` and {@link FoodDialogContent} (the full dish details dialog).
 *
 * @param {DishInfo} dish - The dish information to display and pass to the dialog.
 * @returns {JSX.Element} A React component representing a food card.
 */
interface FoodCardProps extends DishInfo {
  /** Whether this dish is currently favorited. */
  isFavorited?: boolean;
  /** Loading state for favorite toggles. */
  favoriteIsLoading?: boolean;
  /** Handler to toggle the favorite state. */
  onToggleFavorite?: (dishId: string, currentlyFavorite: boolean) => void;
  /** Whether to render a compact version of the card. */
  isCompact?: boolean;
}

export default function FoodCard({
  isFavorited = false,
  favoriteIsLoading = false,
  onToggleFavorite,
  isCompact = false,
  ...dish
}: FoodCardProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();
  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      // TODO: Replace with shadcn sonner or equivalent
      alert(`Added ${formatFoodName(dish.name)} to your log`);
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddToMealTracker = (e: React.MouseEvent) => {
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

  if (isDesktop)
    return (
      <>
        <FoodCardContent
          dish={dish}
          isFavorited={isFavorited}
          favoriteDisabled={favoriteIsLoading}
          onToggleFavorite={onToggleFavorite}
          onAddToMealTracker={handleAddToMealTracker}
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
          <FoodDialogContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Dialog>
      </>
    );
  else
    return (
      <>
        <FoodCardContent
          dish={dish}
          isFavorited={isFavorited}
          favoriteDisabled={favoriteIsLoading}
          onToggleFavorite={onToggleFavorite}
          onAddToMealTracker={handleAddToMealTracker}
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
          <FoodDrawerContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Drawer>
      </>
    );
}
