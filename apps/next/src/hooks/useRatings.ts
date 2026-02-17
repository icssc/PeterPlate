"use client";

import { useCallback } from "react";
import { trpc } from "@/utils/trpc";

export function useRatings(userId: string) {
  const utils = trpc.useUtils();

  const rateDishMutation = trpc.dish.rate.useMutation({
    onSuccess: (
      _data: unknown,
      variables: { userId: string; dishId: string; rating: number },
    ) => {
      utils.dish.getAverageRating.invalidate({ dishId: variables.dishId });
      utils.user.getUserRating.invalidate({
        userId: variables.userId,
        dishId: variables.dishId,
      });
      utils.dish.rated.invalidate({ userId: variables.userId });
    },
  });

  const rateDish = useCallback(
    (dishId: string, rating: number) => {
      rateDishMutation.mutate({
        userId,
        dishId,
        rating,
      });
    },
    [rateDishMutation, userId],
  );

  return {
    rateDish,
    isRatingPending: rateDishMutation.isPending,
    ratingError: rateDishMutation.error,
  };
}
