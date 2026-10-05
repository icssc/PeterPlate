"use client";

import { Dialog, Drawer } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import { useState } from "react";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatFoodName } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";
import FoodDrawerContent from "../food-drawer-content";

interface FoodCardShellProps {
  dish: DishWithRating;
  restaurant?: "anteatery" | "brandywine";
  children: (
    handleOpen: () => void,
    handleAddToMealTracker: (e: React.MouseEvent) => void,
    isPending: boolean,
  ) => React.ReactNode;
}

export default function FoodCardShell({
  dish,
  restaurant,
  children,
}: FoodCardShellProps) {
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

  const sharedSx = {
    width: "460px",
    maxWidth: "90vw",
    margin: 2,
    padding: 0,
    overflow: "hidden",
    borderRadius: "16px",
  };

  return (
    <>
      {children(handleOpen, handleAddToMealTracker, logMealMutation.isPending)}
      {isDesktop ? (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          slotProps={{
            paper: {
              sx: {
                ...sharedSx,
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              },
            },
          }}
        >
          <FoodDialogContent
            dish={dish}
            restaurant={restaurant}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                ...sharedSx,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
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
            restaurant={restaurant}
            onAddToMealTracker={handleAddToMealTracker}
            isAddingToMealTracker={logMealMutation.isPending}
          />
        </Drawer>
      )}
    </>
  );
}
