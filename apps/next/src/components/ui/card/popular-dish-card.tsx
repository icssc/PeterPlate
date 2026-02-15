import type { DishInfo } from "@api/index";
import { Star } from "@mui/icons-material";
import { Card, Dialog } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { formatFoodName, getFoodIcon, toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import FoodDialogContent from "../food-dialog-content";

export default function PopularDishCard({
  dish,
  hallName,
  stationName,
  compact = false,
}: {
  dish: DishInfo;
  hallName: string;
  stationName: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { data: ratingData } = trpc.dish.getAverageRating.useQuery(
    { dishId: dish.id },
    { staleTime: 5 * 60 * 1000 },
  );

  const IconComponent = getFoodIcon(dish.name);

  const averageRating = ratingData?.averageRating ?? 0;

  const iconSize = compact ? 16 : 24;
  const descSize = compact ? "text-[8px]" : "text-[10px]";

  return (
    <>
      <Card
        className="w-full h-full min-h-[210px] flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-left bg-transparent p-0"
        onClick={() => setOpen(true)}
      >
        {/* Dish image */}
        <div className="relative w-full aspect-[16/9] flex-shrink-0 bg-amber-50 dark:bg-neutral-800">
          {dish.image_url ? (
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="20vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <IconComponent
                style={{ fontSize: 48 }}
                className="text-slate-700"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold text-sky-700 leading-tight line-clamp-2 mb-1">
            {formatFoodName(dish.name)}
          </h3>
          <p
            className={`${descSize} text-neutral-500 dark:text-neutral-400 mb-1`}
          >
            {hallName} • {toTitleCase(stationName)}
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-auto">
            <Star style={{ fontSize: iconSize }} />
            <span>{averageRating > 0 ? averageRating.toFixed(1) : "—"}</span>
          </div>
        </div>
      </Card>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
}
