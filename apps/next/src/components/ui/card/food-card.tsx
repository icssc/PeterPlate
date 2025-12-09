"use client";

import React from "react";
import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import FoodDialogContent from "../food-dialog-content"
import { Card, CardContent } from "../shadcn/card"; 
import { CirclePlus, Star, Utensils } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
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
}

/**
 * FoodCardContent component displays the visual representation of a food item within a card.
 * It shows the food's name, icon, calories, and a placeholder for rating.
 * This component is intended to be used as a trigger for a dialog showing more details.
 */
const FoodCardContent = React.forwardRef<
  HTMLDivElement,
  FoodCardContentProps
>(({ dish, ...divProps }, ref) => {
  const IconComponent = getFoodIcon(dish.name) ?? Utensils;

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

  return (
    <div ref={ref} {...divProps} className="w-full"> 
      <Card className="cursor-pointer hover:shadow-lg transition w-full">
        <CardContent>
          <div className="flex justify-between h-full pt-6">
            <div className="flex items-center gap-6 w-full">
              {IconComponent && <IconComponent className="w-10 h-10 text-slate-700" />}
              <div className="flex flex-col h-full">
                <strong>{formatFoodName(dish.name)}</strong>
                <div className="flex gap-2 items-center">
                  <span>{dish.nutritionInfo.calories == null
                    ? "-"
                    :`${Math.round(parseFloat(dish.nutritionInfo.calories))} cal`}
                  </span>
                  {/* <div className="flex gap-1 items-center">
                    <Star className="w-4 stroke-zinc-400 stroke-2"></Star>
                    <span className="text-zinc-400 text-sm text-center">
                      {4.5} ({100})
                    </span>
                  </div> */}
                </div>
              </div>
              {/*//TODO: Add user feedback on clicking button (e.g. changing Icon, making it green) */}
              <button onClick={handleLogMeal}>
                <CirclePlus/>
              </button>
            </div>
            {/* <div className="flex flex-col justify-center">
              <Star className="w-8 h-8 stroke-zinc-400"></Star>
            </div> */}
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
export default function FoodCard(dish: DishInfo): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FoodCardContent dish={dish}/>
        </DialogTrigger>
        <FoodDialogContent {... dish}/>
      </Dialog>
    );
  else 
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <FoodCardContent dish={dish}/>
        </DrawerTrigger>
        <FoodDrawerContent {... dish}/>
      </Drawer>
    );
}