import { Star } from "@mui/icons-material";
import { Box, Card, Dialog, Drawer, Typography } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import Image from "next/image";
import React, { useState } from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";

interface PopularDishCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  dish: DishWithRating;
  stationName: string;
  compact?: boolean;
  restaurant: "anteatery" | "brandywine";
}

const PopularDishCardContent = React.forwardRef<
  HTMLDivElement,
  PopularDishCardContentProps
>(({ dish, restaurant, stationName, compact = false, onClick }, ref) => {
  const IconComponent = getFoodIcon(dish.name);
  const iconSize = compact ? 16 : 24;
  const descSize = compact ? "text-[8px]" : "text-[10px]";

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );
  const averageRating = ratingData?.averageRating ?? 0;

  return (
    <Card
      className="w-full h-full min-h-[210px] flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent p-0"
      onClick={onClick}
      ref={ref}
    >
      {/* Dish image */}
      <Box
        className="relative w-full aspect-[16/9] flex-shrink-0"
        sx={{ bgcolor: "background.paper" }}
      >
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="20vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <IconComponent style={{ fontSize: 48 }} color="primary" />
          </div>
        )}
      </Box>
      <Box className="flex flex-col flex-1 p-4">
        <Typography
          className="text-sm font-semibold leading-tight line-clamp-2 mb-1"
          color="primary"
        >
          {formatFoodName(dish.name)}
        </Typography>
        <Typography className={`${descSize} mb-1`} color="text.secondary">
          {toTitleCase(restaurant)} • {toTitleCase(stationName)}
        </Typography>
        <Box
          className="flex items-center gap-1 mt-auto"
          sx={{ color: "text.secondary" }}
        >
          <Star style={{ fontSize: iconSize }} />
          <Typography variant="caption">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
});

export default function PopularDishCard({
  dish,
  restaurant,
  stationName,
  compact = false,
  onClick,
}: PopularDishCardContentProps): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();
  const { showSnackbar } = useSnackbarStore();

  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      showSnackbar(`Added ${formatFoodName(dish.name)} to your log`, "success");
      utils.nutrition.invalidate();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleAddToMealTracker = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      showSnackbar("Login to track meals!", "error");
      return;
    }

    logMealMutation.mutate({
      dishId: dish.id,
      userId,
      dishName: dish.name,
      servings: 1,
    });
  };

  if (isDesktop) {
    return (
      <>
        {/* ...When you could do this! */}
        <PopularDishCardContent
          {...{ dish, restaurant, stationName, compact }}
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
          <FoodDialogContent
            dish={dish}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <PopularDishCardContent
          {...{ dish, restaurant, compact, stationName }}
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
}
