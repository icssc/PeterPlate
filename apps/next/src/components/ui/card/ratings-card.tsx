"use client";

import { Delete, Restaurant } from "@mui/icons-material";
import type { DishInfo } from "@zotmeal/api";
import React from "react";
import { formatFoodName, getFoodIcon } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";
import InteractiveStarRating from "../interactive-star-rating";
import { Card, CardContent, Dialog, IconButton } from "@mui/material";
import { useUserStore } from "@/context/useUserStore";
import { cn } from "@/utils/tw";

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
>(({ food, handleDelete, deleteLoading, className, ...divProps }, ref) => {
  const IconComponent = getFoodIcon(food.name) ?? Restaurant;

  return (
    <div ref={ref} {...divProps} className={cn("w-full", className)}>
      <Card
        className="cursor-pointer hover:shadow-lg transition w-full border"
        sx={{ borderRadius: "16px" }}
      >
        <CardContent sx={{ padding: "0 !important" }}>
          <div className="flex justify-between items-center h-full p-6">
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
              onClick={(e) => e.stopPropagation()} 
            >
              <InteractiveStarRating dishId={food.id} />
              <IconButton
                onClick={handleDelete}
                disabled={deleteLoading}
                title="Delete Rating"
                size="small"
                className={cn(
                  "text-gray-400 hover:text-red-500 transition",
                  deleteLoading && "opacity-60",
                )}
              >
                <Delete className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
RatingsCardContent.displayName = "RatingsCardContent";

export default function RatingsCard({ food }: RatingsCardProps) {
  const userId = useUserStore((s) => s.userId);
  const [open, setOpen] = React.useState(false);
  const utils = trpc.useUtils();
  
  const deleteRatingMutation = trpc.dish.deleteRating.useMutation({
    onSuccess: () => {
      utils.dish.rated.invalidate();
      utils.dish.getAverageRating.invalidate({ dishId: food.id });
    },
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Replace this with a MUI dialog instead of relying on browser window.
    if (window.confirm("Delete this rating?")) {
      await deleteRatingMutation.mutateAsync({ 
        userId: userId ?? "default-user", 
        dishId: food.id 
      });
    }
  };

  const handleOpen = () => setOpen(true); // no dialog trigger component in MUI so handling manually
  const handleClose = () => setOpen(false);

  return (
    <>
      <RatingsCardContent
        food={food}
        handleDelete={handleDelete}
        // NOTE: Why is this property here? We don't do the delete async, so there should be no loading, nor a way to show that.
        deleteLoading={false}
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
              borderRadius: "6px",
            },
          },
        }}
      >
        <FoodDialogContent dish={food} />
      </Dialog>
    </>
  );
}
