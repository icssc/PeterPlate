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
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ALLERGY_MAP,
  type AllergyName,
  PREFERENCE_MAP,
  type PreferenceName,
} from "@/utils/dietary";
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
   * Whether the dish meets the current user's dietary & allergen preferences
   */
  doesNotMeetPreferences?: boolean;
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
      doesNotMeetPreferences,
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

    // const { data: preferences } =
    //   trpc.preference.getDietaryPreferences.useQuery(
    //     { userId: userId ?? "" },
    //     { enabled: !!userId },
    //   );

    // const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    //   { userId: userId ?? "" },
    //   { enabled: !!userId },
    // );

    const averageRating = ratingData?.averageRating ?? 0;
    const ratingCount = ratingData?.ratingCount ?? 0;

    // const caloricInformationAvailable: boolean =
    //   dish.nutritionInfo.calories != null &&
    //   dish.nutritionInfo.calories.length > 0;

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
        servings: 1, // Default to 1 serving (TODO: add ability to manually input servings. Maybe a popup will ask to input a multiple of 0.5)
      });
    };

    const handleFavoriteClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      event.preventDefault();
      event.stopPropagation();

      // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users of
      if (!userId) {
        alert("Login to favorite meals!");
        return;
      }

      if (favoriteDisabled || !onToggleFavorite) return;
      onToggleFavorite(dish.id, Boolean(isFavorited));
    };

    // const doesNotMeetPreferences = React.useMemo(() => {
    //   if (!preferences || !allergies) return false;

    //   const flags = dish.dietRestriction;

    //   const violatesAllergy = allergies.some((allergy) => {
    //     if (!(allergy in ALLERGY_MAP)) return false;
    //     const key = ALLERGY_MAP[allergy as AllergyName];
    //     return flags[key] === true;
    //   });

    //   const violatesPreferences = preferences.some((pref) => {
    //     if (!(pref in PREFERENCE_MAP)) return false;
    //     const key = PREFERENCE_MAP[pref as PreferenceName];
    //     return flags[key] === false;
    //   });

    //   return violatesAllergy || violatesPreferences;
    // }, [preferences, allergies, dish.dietRestriction]);

    if (isSimplified) {
      return (
        <div
          ref={ref}
          {...divProps}
          className={cn("w-full max-w-xs", className)}
        >
          <Card
            className={cn(
              "relative cursor-pointer hover:shadow-lg transition w-full border",
              doesNotMeetPreferences && "opacity-70",
            )}
            sx={{ borderRadius: "12px" }}
          >
            {doesNotMeetPreferences && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow">
                  ⚠ Conflict
                </span>
              </div>
            )}
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
          className={cn(
            "relative cursor-pointer hover:shadow-lg transition w-full border",
            doesNotMeetPreferences && "opacity-70",
          )}
          sx={{ borderRadius: "12px" }}
        >
          {doesNotMeetPreferences && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow">
                ⚠ Conflict
              </span>
            </div>
          )}
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
  /** Optional class name for styling. */
  doesNotMeetPreferences?: boolean;
  className?: string;
}

export default function FoodCard({
  isFavorited = false,
  favoriteIsLoading = false,
  onToggleFavorite,
  isSimplified = false,
  className,
  ...dish
}: FoodCardProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();

  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const doesNotMeetPreferences = React.useMemo(() => {
    if (!preferences || !allergies) return false;

    const flags = dish.dietRestriction;

    const violatesAllergy = allergies.some((allergy) => {
      if (!(allergy in ALLERGY_MAP)) return false;
      const key = ALLERGY_MAP[allergy as AllergyName];
      return flags[key] === true;
    });

    const violatesPreferences = preferences.some((pref) => {
      if (!(pref in PREFERENCE_MAP)) return false;
      const key = PREFERENCE_MAP[pref as PreferenceName];
      return flags[key] === false;
    });

    return violatesAllergy || violatesPreferences;
  }, [preferences, allergies, dish.dietRestriction]);

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
          className={className}
          doesNotMeetPreferences={doesNotMeetPreferences}
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
            doesNotMeetPreferences={doesNotMeetPreferences}
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
          className={className}
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
            doesNotMeetPreferences={doesNotMeetPreferences}
          />
        </Drawer>
      </>
    );
}
