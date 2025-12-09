"use client";

import React from "react";

import { DishInfo } from "@zotmeal/api";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { cn } from "@/utils/tw";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import FoodDialogContent from "../food-dialog-content"
import { Card, CardContent } from "../shadcn/card"; 
import { CirclePlus, Heart, Star, Utensils } from "lucide-react";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";
import FoodDrawerContent from "../food-drawer-content";
import { trpc } from "@/utils/trpc";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
const FoodCardContent = React.forwardRef<
  HTMLDivElement,
  FoodCardContentProps
>(({ dish, isFavorited, favoriteDisabled, onToggleFavorite, className, ...divProps }, ref) => {
    const IconComponent = getFoodIcon(dish.name) ?? Utensils;
  
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

    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    const caloricInformationAvailable: boolean = dish.nutritionInfo.calories != null
      && dish.nutritionInfo.calories.length > 0;


  const utils = trpc.useUtils();
  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      //TODO: Replace this with a shad/cn sonner or equivalent.
      alert(`Added ${formatFoodName(dish.name)} to your log`);
      utils.nutrition.invalidate();
    },
    onError: (error: Error) => {
      console.error(error.message);
    }
  });

  const handleLogMeal = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (!DUMMY_USER_ID) {
      //TODO: Replace this with a shad/cn sonner or equivalent.
      alert("You must be logged in to track meals");
      return;
    }

    logMealMutation.mutate({
      dishId: dish.id,
      userId: DUMMY_USER_ID,
      dishName: dish.name,
      servings: 1, // Default to 1 serving (TODO: add ability to manually input servings. Maybe a popup will ask to input a multiple of 0.5)
    });
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
              {IconComponent && <IconComponent className="w-10 h-10 text-slate-700" />}
              <div className="flex flex-col">
                <strong>{formatFoodName(dish.name)}</strong>
                <div className="flex gap-2 items-center">
                  <span>{dish.nutritionInfo.calories == null ? "-" : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}</span>
                  {dish.restaurant && (
                    <>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">{toTitleCase(dish.restaurant)}</span>
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
              {/*//TODO: Add user feedback on clicking button (e.g. changing Icon, making it green) */}
              <button onClick={handleLogMeal}>
                <CirclePlus/>
              </button>
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
    </div>
  );
});
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
}: FoodCardProps): JSX.Element {
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
