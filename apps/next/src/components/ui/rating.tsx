"use client";

import { Rating as MUIRating, Tooltip } from "@mui/material";
import { useUserStore } from "@/context/useUserStore";
import { useRatings } from "@/hooks/useRatings";
import { trpc } from "@/utils/trpc";

export default function Rating({ dishId }: { dishId: string }) {
  const userId = useUserStore((s) => s.userId);

  const { rateDish } = useRatings(userId ?? "");

  const { data: userRating } = trpc.user.getUserRating.useQuery(
    { userId: userId ?? "", dishId },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    },
  );

  if (userId == null)
    return (
      <Tooltip
        title="Log in to rate dishes!"
        placement="top"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -10],
                },
              },
            ],
          },
        }}
      >
        <span>
          <MUIRating size="large" disabled={true} />
        </span>
      </Tooltip>
    );

  return (
    <MUIRating
      size="large"
      onChange={(_, value) => {
        if (value == null) return;
        rateDish(dishId, value);
      }}
      value={userRating ?? 0}
    />
  );
}
