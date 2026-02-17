"use client";

import {
  AddCircleOutline,
  FavoriteBorder,
  Restaurant,
  StarBorder,
} from "@mui/icons-material";
import { Card, CardContent, Dialog, Drawer } from "@mui/material";
import type { DishInfo } from "@peterplate/api";
import Image from "next/image";
import React from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
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
   * Whether to render a simplified version of the card.
   */
  isSimplified?: boolean;
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
      isSimplified = false,
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

    const { showSnackbar } = useSnackbarStore();

    // When a user adds a meal to their log, they should be able to adjust the quantity and/or remove the item from their log by clicking the button on the card
    const { data: loggedMeals } = trpc.nutrition.getMealsInLastWeek.useQuery(
      { userId: userId ?? "" },
      { enabled: !!userId, staleTime: 30 * 1000 },
    );

    const loggedMeal = loggedMeals?.find((meal) => meal.dishId === dish.id);
    const isLogged = !!loggedMeal;

    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    // const caloricInformationAvailable: boolean =
    //   dish.nutritionInfo.calories != null &&
    //   dish.nutritionInfo.calories.length > 0;

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

    const _handleLogMeal = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Give the user a proper error when they've not signed in before attempting to add a meal
      if (!userId) {
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
        userId: userId,
        dishName: dish.name,
        servings: 1,
      });
    };

    const handleAdjustQuantity = (newServings: number) => {
      if (!userId || !loggedMeal) return;

      // Servings are multiples of 0.5
      if (newServings < 0.5) {
        showSnackbar("Minimum serving size is 0.5", "error");
        return;
      }

      // Delete and insert again with new servings
      deleteMealMutation.mutate(
        { userId: userId, dishId: dish.id },
        {
          onSuccess: () => {
            logMealMutation.mutate({
              dishId: dish.id,
              userId: userId,
              dishName: dish.name,
              servings: newServings,
            });
          },
        },
      );
    };

    const _handleRemoveMeal = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!userId) return;

      deleteMealMutation.mutate({
        userId: userId,
        dishId: dish.id,
      });
    };

    const _handleIncreaseQuantity = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!loggedMeal) return;
      const newServings = loggedMeal.servings + 0.5;
      handleAdjustQuantity(newServings);
    };

    const _handleDecreaseQuantity = (e: React.MouseEvent) => {
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

      if (!userId) {
        showSnackbar("Login to favorite meals!", "error");
        return;
      }

      if (favoriteDisabled || !onToggleFavorite) return;
      onToggleFavorite(dish.id, Boolean(isFavorited));
    };

    if (isSimplified) {
      return (
        <div
          ref={ref}
          {...divProps}
          className={cn("w-full max-w-xs", className)}
        >
          <Card
            className="cursor-pointer hover:shadow-lg trasnsition w-full border"
            sx={{ borderRadius: "12px" }}
          >
            <CardContent sx={{ padding: "0 !important" }}>
              <div className="flex justify-between items-center h-full p-4">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-base text-sky-700">
                    {formatFoodName(dish.name)}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarBorder
                      className="w-4 h-4 stroke-gray-500"
                      strokeWidth={1.5}
                    />
                    <span className="text-gray-500 text-sm">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  {dish.description && (
                    <p className="text-black text-sm">{dish.description}</p>
                  )}
                </div>
                <div className="flex items-center">
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
                      "rounded-full p-1 transition",
                      favoriteDisabled ? "opacity-60" : "hover:bg-rose-50",
                    )}
                  >
                    <FavoriteBorder
                      className={cn(
                        "w-5 h-5",
                        isFavorited
                          ? "fill-rose-500 stroke-rose-500"
                          : "stroke-zinc-400",
                      )}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        {...divProps}
        className={cn("max-w-xs flex-shrink-0", className)}
      >
        <Card
          className="cursor-pointer hover:shadow-lg transition w-full border"
          sx={{ borderRadius: "12px" }}
        >
          <CardContent sx={{ padding: "0 !important" }}>
            <div className="flex justify-between h-full p-4 gap-4">
              <div className="flex items-center gap-4 w-full">
                {showImage && dish.image_url && !imageError ? (
                  <Image
                    src={dish.image_url}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  IconComponent && (
                    <IconComponent className="w-12 h-12 text-slate-700 flex-shrink-0" />
                  )
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-base text-sky-700">
                    {formatFoodName(dish.name)}
                  </span>
                  <div className="flex gap-2 items-center text-slate-700 text-sm">
                    <div className="text-slate-900 font-normal">
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
                      <span>
                        {averageRating.toFixed(1)} ({ratingCount})
                      </span>
                    </div>
                  </div>
                  {dish.description && (
                    <p className="text-slate-900 text-sm font-normal">
                      {dish.description}
                    </p>
                  )}
                </div>

                {/*//TODO: Add user feedback on clicking button (e.g. changing Icon, making it green) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToMealTracker?.(e);
                  }}
                >
                  <AddCircleOutline />
                </button>
              </div>
              <div className="flex items-center">
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
                    "rounded-full p-1 transition",
                    favoriteDisabled ? "opacity-60" : "hover:bg-rose-50",
                  )}
                >
                  <FavoriteBorder
                    className={cn(
                      "w-5 h-5",
                      isFavorited
                        ? "fill-rose-500 stroke-rose-500"
                        : "stroke-zinc-400",
                    )}
                  />
                </button>
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
  /** Whether to render a simplified version of the card. */
  isSimplified?: boolean;
}

export default function FoodCard({
  isFavorited = false,
  favoriteIsLoading = false,
  onToggleFavorite,
  isSimplified = false,
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
          isSimplified={isSimplified}
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
          isSimplified={isSimplified}
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

// <div ref={ref} {...divProps} className={cn("w-full", className)}>
//   <Card
//     className="cursor-pointer hover:shadow-lg transition w-full border"
//     sx={{ borderRadius: "16px" }}
//   >
//     <CardContent sx={{ padding: "0 !important" }}>
//       <div className="flex justify-between h-full p-6">
//         <div className="flex items-center gap-6 w-full">
//           {IconComponent && (
//             <IconComponent className="w-10 h-10 text-slate-700" />
//           )}
//           <div className="flex flex-col">
//             <strong>{formatFoodName(dish.name)}</strong>
//             <div className="flex gap-2 items-center">
//               <span>
//                 {dish.nutritionInfo.calories == null
//                   ? "-"
//                   : `${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
//               </span>
//               {dish.restaurant && (
//                 <>
//                   <span className="text-zinc-400">•</span>
//                   <span className="text-zinc-500">
//                     {toTitleCase(dish.restaurant)}
//                   </span>
//                 </>
//               )}
//               {/* Average rating display - grey outline star */}
//               <div className="flex gap-1 items-center">
//                 <Star
//                   className="w-4 h-4 stroke-zinc-200"
//                   strokeWidth={1}
//                 />
//                 <span className="text-zinc-400 text-sm">
//                   {averageRating.toFixed(1)} ({ratingCount})
//                 </span>
//               </div>
//             </div>
//           </div>
//           {/*//TODO: Add user feedback on clicking button (e.g. changing Icon, making it green) */}
//           <button onClick={handleLogMeal}>
//             <CirclePlus />
//           </button>
//         </div>
//         <div className="flex items-start">
//           <button
//             type="button"
//             aria-label={
//               isFavorited
//                 ? "Remove meal from favorites"
//                 : "Add meal to favorites"
//             }
//             aria-pressed={isFavorited}
//             disabled={favoriteDisabled}
//             onClick={handleFavoriteClick}
//             className={cn(
//               "rounded-full p-2 transition",
//               favoriteDisabled
//                 ? "opacity-60"
//                 : "hover:bg-rose-50 hover:text-rose-600",
//             )}
//           >
//             <Heart
//               className={cn(
//                 "w-5 h-5",
//                 isFavorited
//                   ? "fill-rose-500 stroke-rose-500"
//                   : "stroke-zinc-500",
//               )}
//             />
//           </button>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// </div>
