"use client";

import { FavoriteBorder, Restaurant, StarBorder } from "@mui/icons-material";
import { Card, CardContent, Dialog, Drawer } from "@mui/material";
import type { DishInfo } from "@zotmeal/api";
import React from "react";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/tw";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";

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
      isSimplified = false,
      className,
      ...divProps
    },
    ref,
  ) => {
    const userId = useUserStore((state) => state.userId);
    const IconComponent = getFoodIcon(dish.name) ?? Restaurant;

    /**
     * Fetches the average rating and rating count for the dish.
     */
    const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
      { dishId: dish.id },
      { staleTime: 5 * 60 * 1000 },
    );

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
                {IconComponent && (
                  <IconComponent className="w-12 h-12 text-slate-700 flex-shrink-0" />
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
                    <div className="flex gap-1 items-center text-gray-500">
                      <StarBorder
                        className="w-4 h-4 stroke-gray-500"
                        strokeWidth={1.5}
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isDesktop)
    return (
      <>
        <FoodCardContent
          dish={dish}
          isFavorited={isFavorited}
          favoriteDisabled={favoriteIsLoading}
          onToggleFavorite={onToggleFavorite}
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
                margin: 2,
                padding: 0,
                overflow: "hidden",
                borderRadius: "16px",
              },
            },
          }}
        >
          <FoodDialogContent dish={dish} />
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
                margin: 2,
                padding: 0,
                overflow: "hidden",
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
            },
          }}
        >
          <FoodDrawerContent dish={dish} />
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
