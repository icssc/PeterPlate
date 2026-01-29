"use client";

import { Alert, Snackbar } from "@mui/material";

import type { DishInfo } from "@zotmeal/api";
import {
  Check,
  CirclePlus,
  Heart,
  Minus,
  Plus,
  Star,
  Trash2,
  Utensils,
} from "lucide-react";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession } from "@/utils/auth-client";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";
import { Button } from "../shadcn/button";
import { Card, CardContent } from "../shadcn/card";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";

// TODO: remove this variable and get the currently signed in user through session
const DUMMY_USER_ID = "TEST_USER";

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
      className,
      ...divProps
    },
    ref,
  ) => {
    const IconComponent = getFoodIcon(dish.name) ?? Utensils;

    // check if user is signed in andshow  error if not signed in before attempting to add meal
    const { data: session } = useSession();
    const user = session?.user;

    // snackbar constants and handler
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<
      "success" | "error" | "info" | "warning"
    >("success");

    const showSnackbar = (
      message: string,
      severity: "success" | "error" | "info" | "warning" = "info",
    ) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };

    const handleSnackbarClose = (
      _event?: React.SyntheticEvent | Event,
      reason?: string,
    ) => {
      if (reason === "clickaway") return;
      setSnackbarOpen(false);
    };

    /**
     * Fetches the average rating and rating count for the dish.
     */
    const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
      { dishId: dish.id },
      { staleTime: 5 * 60 * 1000 },
    );
    /**
     * fetch above
     */

    // When a user adds a meal to their log, they should be able to adjust the quantity and/or remove the item from their log by clicking the button on the card
    const { data: loggedMeals } = trpc.nutrition.getMealsInLastWeek.useQuery(
      { userId: user?.id ?? "" },
      { enabled: !!user?.id, staleTime: 30 * 1000 },
    );

    const loggedMeal = loggedMeals?.find((meal) => meal.dishId === dish.id);
    const isLogged = !!loggedMeal;

    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    const caloricInformationAvailable: boolean =
      dish.nutritionInfo.calories != null &&
      dish.nutritionInfo.calories.length > 0;

    const utils = trpc.useUtils();
    const logMealMutation = trpc.nutrition.logMeal.useMutation({
      onSuccess: () => {
        // show Snackbar notification when meal is successfully added to log
        showSnackbar(
          `Added ${formatFoodName(dish.name)} to your log`,
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
      onSuccess: () => {
        showSnackbar(
          `Removed ${formatFoodName(dish.name)} from your log`,
          "success",
        );
        utils.nutrition.invalidate();
      },
      onError: (error) => {
        console.error(error);
        showSnackbar("Failed to remove meal from your log", "error");
      },
    });

    const handleLogMeal = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Give the user a proper error when they've not signed in before attempting to add a meal
      if (!user?.id) {
        showSnackbar(
          "You must be signed in to track meals. Please sign in to continue.",
          "error",
        );
        return;
      }

      // If meal is already logged, the popover will handle the interaction
      if (isLogged) {
        return;
      }

      logMealMutation.mutate({
        dishId: dish.id,
        userId: user.id,
        dishName: dish.name,
        servings: 1,
      });
    };

    const handleAdjustQuantity = (newServings: number) => {
      if (!user?.id || !loggedMeal) return;

      // Servings are multiples of 0.5
      if (newServings < 0.5) {
        showSnackbar("Minimum serving size is 0.5", "error");
        return;
      }

      // Delete and insert again with new servings
      deleteMealMutation.mutate(
        { userId: user.id, dishId: dish.id },
        {
          onSuccess: () => {
            logMealMutation.mutate({
              dishId: dish.id,
              userId: user.id,
              dishName: dish.name,
              servings: newServings,
            });
          },
        },
      );
    };

    const handleRemoveMeal = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user?.id) return;

      deleteMealMutation.mutate({
        userId: user.id,
        dishId: dish.id,
      });
    };

    const handleIncreaseQuantity = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!loggedMeal) return;
      const newServings = loggedMeal.servings + 0.5;
      handleAdjustQuantity(newServings);
    };

    const handleDecreaseQuantity = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!loggedMeal) return;
      const newServings = Math.max(0.5, loggedMeal.servings - 0.5);
      handleAdjustQuantity(newServings);
    };

    const handleFavoriteClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (favoriteDisabled || !onToggleFavorite) return;
      onToggleFavorite(dish.id, Boolean(isFavorited));
    };

    return (
      <div ref={ref} {...divProps} className={cn("w-full", className)}>
        <Card className="cursor-pointer hover:shadow-lg transition w-full">
          <CardContent>
            <div className="flex justify-between h-full pt-6">
              <div className="flex items-center gap-6 w-full">
                {IconComponent && (
                  <IconComponent className="w-10 h-10 text-slate-700" />
                )}
                <div className="flex flex-col">
                  <strong>{formatFoodName(dish.name)}</strong>
                  <div className="flex gap-2 items-center">
                    <span>
                      {dish.nutritionInfo.calories == null
                        ? "-"
                        : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
                    </span>
                    {dish.restaurant && (
                      <>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500">
                          {toTitleCase(dish.restaurant)}
                        </span>
                      </>
                    )}
                    {/* Average rating display - grey outline star */}
                    <div className="flex gap-1 items-center">
                      <Star
                        className="w-4 h-4 stroke-zinc-200"
                        strokeWidth={1}
                      />
                      <span className="text-zinc-400 text-sm">
                        {averageRating.toFixed(1)} ({ratingCount})
                      </span>
                    </div>
                  </div>
                </div>
                {/* Show quantity controls if logged, otherwise show add button */}
                {isLogged && user?.id ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        aria-label="Adjust meal quantity"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {formatFoodName(dish.name)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {loggedMeal.servings} serving
                            {loggedMeal.servings !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDecreaseQuantity}
                            disabled={loggedMeal.servings <= 0.5}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="flex-1 text-center font-medium">
                            {loggedMeal.servings}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleIncreaseQuantity}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveMeal}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove from log
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogMeal}
                    aria-label="Add meal to log"
                    className="hover:text-green-600 transition-colors"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-start">
                <button
                  type="button"
                  aria-label={
                    isFavorited
                      ? "Remove meal from favorites"
                      : "Add meal to favorites"
                  }
                  aria-pressed={isFavorited}
                  disabled={favoriteDisabled}
                  onClick={handleFavoriteClick}
                  className={cn(
                    "rounded-full p-2 transition",
                    favoriteDisabled
                      ? "opacity-60"
                      : "hover:bg-rose-50 hover:text-rose-600",
                  )}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      isFavorited
                        ? "fill-rose-500 stroke-rose-500"
                        : "stroke-zinc-500",
                    )}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
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
}

export default function FoodCard({
  isFavorited = false,
  favoriteIsLoading = false,
  onToggleFavorite,
  ...dish
}: FoodCardProps) {
  //: JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent
            dish={dish}
            isFavorited={isFavorited}
            favoriteDisabled={favoriteIsLoading}
            onToggleFavorite={onToggleFavorite}
          />
        </DialogTrigger>
        <FoodDialogContent {...dish} />
      </Dialog>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <FoodCardContent
            dish={dish}
            isFavorited={isFavorited}
            favoriteDisabled={favoriteIsLoading}
            onToggleFavorite={onToggleFavorite}
          />
        </DrawerTrigger>
        <FoodDrawerContent {...dish} />
      </Drawer>
    );
}
