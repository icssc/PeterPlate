"use client";

import React from "react";
import { Card, CardContent } from "../shadcn/card";
import { Utensils, Trash2 } from "lucide-react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import InteractiveStarRating from "../interactive-star-rating";
import { DishInfo } from "@zotmeal/api";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import { Drawer, DrawerTrigger } from "../shadcn/drawer";
import FoodDrawerContent from "../food-drawer-content";
import FoodDialogContent from "../food-dialog-content";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface RatingsCardProps {
  food: DishInfo & {
    rating: number;
    ratedAt: string | Date;
  };
  userId?: string;
}

const RatingsCardContent = React.forwardRef<
  HTMLDivElement,
  {
    food: RatingsCardProps["food"];
    handleDelete: (e: React.MouseEvent) => Promise<void>;
    deleteLoading: boolean;
    userId?: string
  } & React.HTMLAttributes<HTMLDivElement>
>(({ food, handleDelete, deleteLoading, userId, ...divProps }, ref) => {
  const IconComponent = getFoodIcon(food.name) ?? Utensils;

  return (
    <div ref={ref} {...divProps} className="w-full"> {}
      <Card className="cursor-pointer hover:shadow-lg transition w-full">
        <CardContent>
          <div className="flex justify-between items-center h-full pt-6">
            <div className="flex items-center gap-6">
              <IconComponent className="w-10 h-10 text-foreground" />
              <div className="flex flex-col">
                <strong>{formatFoodName(food.name)}</strong>
                <span className="text-muted-foreground text-xs mt-1">
                  Rated {new Date(food.ratedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div
              className="flex flex-row items-center ml-4 gap-4"
              onClick={(e) => e.stopPropagation()} // keep stars/delete interactive
            >
              <InteractiveStarRating dishId={food.id} userId={userId} />
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                title="Delete Rating"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-rose-500" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
RatingsCardContent.displayName = "RatingsCardContent";

export default function RatingsCard({ food, userId }: RatingsCardProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const utils = trpc.useUtils();
  
  const deleteRatingMutation = trpc.dish.deleteRating.useMutation({
    onSuccess: () => {
      utils.dish.rated.invalidate();
      utils.dish.getUserRating.invalidate({ userId, dishId: food.id });
      utils.dish.getAverageRating.invalidate({ dishId: food.id });
    },
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this rating?")) {
      await deleteRatingMutation.mutateAsync({ userId, dishId: food.id });
    }
  };

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <RatingsCardContent
            food={food}
            handleDelete={handleDelete}
            deleteLoading={deleteRatingMutation.isLoading}
            userId={userId}
          />
        </DialogTrigger>
        <FoodDialogContent dish={food} userId={userId} />
      </Dialog>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <RatingsCardContent
            food={food}
            handleDelete={handleDelete}
            deleteLoading={deleteRatingMutation.isLoading}
            userId={userId}
          />
        </DrawerTrigger>
        <FoodDrawerContent dish={food} userId={userId} />
      </Drawer>
    );
}
