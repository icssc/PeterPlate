"use client";

import { Restaurant, StarBorder } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Card, CardContent, Dialog, Drawer, Typography } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import Image from "next/image";
import React from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getDietaryConflicts } from "@/utils/dietary";
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
  dish: DishWithRating;
  /**
   * The restaurant at which this dish is present.
   */
  restaurant: "brandywine" | "anteatery";
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
  onToggleFavorite?: (
    dishId: string,
    currentlyFavorite: boolean,
    restaurant: "anteatery" | "brandywine",
  ) => void;
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
      restaurant,
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
    const { userId } = useUserStore();
    const IconComponent = getFoodIcon(dish.name) ?? Restaurant;
    const [imageError, setImageError] = React.useState(false);
    const showImage =
      typeof dish.imageUrl === "string" &&
      dish.imageUrl.trim() !== "" &&
      !imageError;

    const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
      { dishId: dish.id },
      { staleTime: 5 * 60 * 1000 },
    );

    const { data: allergies } = trpc.allergy.getAllergies.useQuery(
      { userId: userId ?? "" },
      { staleTime: Infinity },
    );

    const { data: preferences } =
      trpc.preference.getDietaryPreferences.useQuery(
        { userId: userId ?? "" },
        { staleTime: Infinity },
      );

    const violations = getDietaryConflicts(
      dish.dietRestriction,
      preferences ?? [],
      allergies ?? [],
    );

    const conflictsWithUserPrefs = violations.length > 0;
    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    return (
      <Card
        ref={ref}
        {...divProps}
        className={cn(
          "relative cursor-pointer hover:shadow-lg transition w-full border",
          conflictsWithUserPrefs && "opacity-70",
        )}
        sx={{ borderRadius: "12px" }}
      >
        <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
          <div className="flex justify-between h-full w-full p-4 gap-4">
            <div
              className={cn(
                "flex items-center gap-4 w-full",
                isCompact && "justify-between",
              )}
            >
              {!isCompact && showImage && dish.imageUrl && !imageError && (
                <Image
                  src={dish.imageUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                  onError={() => setImageError(true)}
                />
              )}
              {!isCompact && !showImage && IconComponent && (
                <IconComponent className="w-12 h-12 text-zinc-700 dark:text-zinc-400 flex-shrink-0" />
              )}
              <div
                className={cn(
                  "flex flex-col gap-1 w-3/5",
                  isCompact && "w-3/4",
                  !isCompact && "md:w-full",
                )}
              >
                <Typography
                  className={cn(
                    "font-semibold text-base text-sky-700 dark:text-sky-600",
                    isCompact && "font-bold",
                  )}
                  noWrap
                >
                  {formatFoodName(dish.name)}
                  {conflictsWithUserPrefs && (
                    <ErrorOutlineIcon
                      fontSize="inherit"
                      className="ml-1 text-red-600 align-[-0.125em]"
                    />
                  )}
                </Typography>
                <div className="flex gap-2 items-center text-zinc-700 text-sm w-fit flex-shrink">
                  <Typography
                    noWrap
                    className="text-zinc-900 dark:text-zinc-300 font-normal"
                  >
                    {dish.nutritionInfo.calories == null
                      ? "-"
                      : `${Math.round(dish.nutritionInfo.calories)} cal`}
                  </Typography>
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
                <Typography
                  noWrap
                  className={cn(
                    "text-zinc-900 text-sm font-normal dark:text-zinc-300",
                    !dish.description && "italic text-zinc-700",
                  )}
                >
                  {dish.description
                    ? dish.description
                    : "No description available."}
                </Typography>
              </div>
              <Favorite
                dishId={dish.id}
                {...{
                  isFavorited,
                  favoriteDisabled,
                  onToggleFavorite,
                  restaurant,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
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
 * @param {DishWithRating} dish - The dish information to display and pass to the dialog.
 * @returns {JSX.Element} A React component representing a food card.
 */
interface FoodCardProps extends DishWithRating {
  /** Whether this dish is currently favorited. */
  isFavorited?: boolean;
  /** Loading state for favorite toggles. */
  favoriteIsLoading?: boolean;
  /** Handler to toggle the favorite state. */
  onToggleFavorite?: (
    dishId: string,
    currentlyFavorite: boolean,
    restaurant: "anteatery" | "brandywine",
  ) => void;
  /** Whether to render a compact version of the card. */
  isCompact?: boolean;
  /** Optional class name for styling. */
  className?: string;
  /** Restaurant */
  restaurant: "anteatery" | "brandywine";
}

export default function FoodCard({
  isFavorited = false,
  favoriteIsLoading = false,
  onToggleFavorite,
  restaurant,
  isCompact = false,
  className,
  ...dish
}: FoodCardProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  if (isDesktop)
    return (
      <>
        <FoodCardContent
          {...{
            dish,
            restaurant,
            isFavorited,
            onToggleFavorite,
            isCompact,
            className,
          }}
          favoriteDisabled={favoriteIsLoading}
          onAddToMealTracker={handleAddToMealTracker}
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
            {...{ dish, restaurant }}
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
          {...{
            dish,
            restaurant,
            isFavorited,
            onToggleFavorite,
            isCompact,
            className,
          }}
          favoriteDisabled={favoriteIsLoading}
          onAddToMealTracker={handleAddToMealTracker}
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
            {...{ dish, restaurant }}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Drawer>
      </>
    );
}
