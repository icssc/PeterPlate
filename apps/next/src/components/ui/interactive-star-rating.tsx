"use client";

import { useState, useEffect } from "react";
import { StarBorder } from "@mui/icons-material";
import { useRatings } from "@/hooks/useRatings";
import { trpc } from "@/utils/trpc";
import { useUserStore } from "@/context/useUserStore";

interface InteractiveStarRatingProps {
  dishId: string;
}

export default function InteractiveStarRating({ dishId }: InteractiveStarRatingProps) {
  const userId = useUserStore((s) => s.userId);
  const [userRating, setUserRating] = useState<number | undefined>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const { rateDish } = useRatings(userId!);

  console.log(userId)

  const { data: existingRating } = trpc.user.getUserRating.useQuery(
    { userId: userId!, dishId },
    {
      enabled: !!userId, 
      staleTime: 5 * 60 * 1000
    },
  );

  useEffect(() => {
    if (existingRating !== undefined) {
      setUserRating(existingRating ?? 0);
    }
  }, [existingRating]);

  const handleStarClick = (stars: number) => {
    // TODO: use [MUI snackbar](https://mui.com/material-ui/react-snackbar/) to warn users. 
    if (!userId) {
      alert("Login to rate meals!");
      return;
    }

    // clicking the same rating gives a 0
    const newRating = stars === userRating ? 0 : stars;
    setUserRating(newRating);
    rateDish(dishId, newRating);
  };

  const displayRating = hoverRating ?? userRating;

  const getStarFillAmount = (starPosition: number): number => {
    if (displayRating == null) return 0;
    const diff = displayRating - starPosition;
    if (diff >= 0) return 1;
    if (diff >= -0.5) return 0.5;
    return 0;
  };

  if (userRating === undefined) {
    return <div className="h-7 w-full" />;
  }

  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((starPosition) => {
        const fillAmount = getStarFillAmount(starPosition);

        return (
          <div
            key={starPosition}
            className="relative flex"
            onMouseLeave={() => setHoverRating(null)}
          >
            <div
              className="w-1/2 h-full absolute left-0 z-10 cursor-pointer"
              onClick={() => handleStarClick(starPosition - 0.5)}
              onMouseEnter={() => setHoverRating(starPosition - 0.5)}
            />
            <div
              className="w-1/2 h-full absolute right-0 z-10 cursor-pointer"
              onClick={() => handleStarClick(starPosition)}
              onMouseEnter={() => setHoverRating(starPosition)}
            />

            {fillAmount === 0 && (
              <StarBorder
                className="w-7 h-7 stroke-zinc-400 hover:stroke-amber-400 transition-colors"
                strokeWidth={1}
              />
            )}
            {fillAmount === 0.5 && (
              <>
                <StarBorder
                  className="w-7 h-7 stroke-amber-400 absolute"
                  strokeWidth={1}
                />
                <div className="overflow-hidden w-1/2">
                  <StarBorder
                    className="w-7 h-7 fill-amber-400 stroke-amber-400"
                    strokeWidth={1}
                  />
                </div>
              </>
            )}
            {fillAmount === 1 && (
              <StarBorder
                className="w-7 h-7 fill-amber-400 stroke-amber-400"
                strokeWidth={1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
