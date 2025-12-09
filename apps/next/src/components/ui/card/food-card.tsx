"use client";

import React from "react";
import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import FoodDialogContent from "../food-dialog-content";
import { Card, CardContent } from "../shadcn/card";
import { Star, Utensils } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";
import FoodDrawerContent from "../food-drawer-content";
import { trpc } from "@/utils/trpc";

/**
 * Props for the FoodCardContent component.
 */
interface FoodCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The dish information to display.
   */
  dish: DishInfo;
}

/**
 * FoodCardContent component displays the visual representation of a food item within a card.
 * It shows the food's name, icon, calories, and a placeholder rating.
 * This component is intended to be used as a trigger for a dialog showing more details.
 */
const FoodCardContent = React.forwardRef<HTMLDivElement, FoodCardContentProps>(
  ({ dish, ...divProps }, ref) => {
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


  return (
    <div ref={ref} {...divProps} className="w-full"> 
      <Card className="cursor-pointer hover:shadow-lg transition w-full">
        <CardContent>
          <div className="flex justify-between h-full pt-6">
            <div className="flex items-center gap-6">
              {IconComponent && <IconComponent className="w-10 h-10 text-slate-700" />}
              <div className="flex flex-col">
                <strong>{formatFoodName(dish.name)}</strong>
                <div className="flex gap-2 items-center">
                  {caloricInformationAvailable && <span className="text-zinc-600 text-sm">
                    {Math.round(parseFloat(dish.nutritionInfo.calories ?? "0"))} cal
                  </span>}
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
export default function FoodCard(dish: DishInfo): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent dish={dish} />
        </DialogTrigger>
        <FoodDialogContent {...dish} />
      </Dialog>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <FoodCardContent dish={dish} />
        </DrawerTrigger>
        <FoodDrawerContent {...dish} />
      </Drawer>
    );
}
