"use client";

import { useCallback } from "react";
import { trpc } from "@/utils/trpc";

/**
 * Manages a user's rating mutations through the tRPC API with optimistic
 * updates. The user's own rating cache is patched immediately so star UIs
 * react instantly, then reconciled with the server on settle.
 */
export function useRatings(userId: string) {
  const utils = trpc.useUtils();

  const rateDishMutation = trpc.dish.rate.useMutation({
    onMutate: async ({
      userId: uid,
      dishId,
      rating,
    }: {
      userId: string;
      dishId: string;
      rating: number;
    }) => {
      await utils.user.getUserRating.cancel({ userId: uid, dishId });

      const prevUserRating = utils.user.getUserRating.getData({
        userId: uid,
        dishId,
      });

      utils.user.getUserRating.setData({ userId: uid, dishId }, rating);

      return { prevUserRating };
    },
    onError: (
      _err,
      { userId: uid, dishId }: { userId: string; dishId: string },
      ctx,
    ) => {
      if (ctx) {
        utils.user.getUserRating.setData(
          { userId: uid, dishId },
          ctx.prevUserRating,
        );
      }
    },
    onSettled: (
      _data,
      _err,
      { userId: uid, dishId }: { userId: string; dishId: string },
    ) => {
      utils.dish.getAverageRating.invalidate({ dishId });
      utils.user.getUserRating.invalidate({ userId: uid, dishId });
      utils.dish.rated.invalidate({ userId: uid });
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
