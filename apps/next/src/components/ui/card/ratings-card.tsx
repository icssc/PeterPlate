"use client";

import { Delete, Restaurant } from "@mui/icons-material";
import type { DishInfo } from "@zotmeal/api";
import React from "react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";
import InteractiveStarRating from "../interactive-star-rating";
import { Card, CardContent } from "../shadcn/card";
import { Dialog, DialogTrigger } from "../shadcn/dialog"; // use shadcn Dialog

interface RatingsCardProps {
  food: DishInfo & {
    rating: number;
    ratedAt: string | Date;
  };
}

const RatingsCardContent = React.forwardRef<
  HTMLDivElement,
  {
    food: RatingsCardProps["food"];
    handleDelete: (e: React.MouseEvent) => Promise<void>;
    deleteLoading: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ food, handleDelete, deleteLoading, ...divProps }, ref) => {
  const IconComponent = getFoodIcon(food.name) ?? Restaurant;

  return (
    <div ref={ref} {...divProps} className="w-full">
      {" "}
      {}
      <Card className="cursor-pointer hover:shadow-lg transition w-full">
        <CardContent>
          <div className="flex justify-between items-center h-full pt-6">
            <div className="flex items-center gap-6">
              <IconComponent className="w-10 h-10 text-slate-700" />
              <div className="flex flex-col">
                <strong>{formatFoodName(food.name)}</strong>
                <span className="text-zinc-400 text-xs mt-1">
                  Rated {new Date(food.ratedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div
              className="flex flex-row items-center ml-4 gap-4"
              onClick={(e) => e.stopPropagation()} // keep stars/delete interactive
            >
              <InteractiveStarRating dishId={food.id} />
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                title="Delete Rating"
              >
                <Delete className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
RatingsCardContent.displayName = "RatingsCardContent";

export default function RatingsCard({ food }: RatingsCardProps) {
  const utils = trpc.useUtils();
  const deleteRatingMutation = trpc.dish.deleteRating.useMutation({
    onSuccess: () => {
      utils.dish.rated.invalidate();
      utils.dish.getUserRating.invalidate({
        userId: "default-user",
        dishId: food.id,
      });
      utils.dish.getAverageRating.invalidate({ dishId: food.id });
    },
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this rating?")) {
      await deleteRatingMutation.mutateAsync({
        userId: "default-user",
        dishId: food.id,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <RatingsCardContent
          food={food}
          handleDelete={handleDelete}
          deleteLoading={deleteRatingMutation.isLoading}
        />
      </DialogTrigger>
      <FoodDialogContent {...food} />
    </Dialog>
  );
}
