/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Will fix when using MUI.*/
/** biome-ignore-all lint/a11y/noStaticElementInteractions: Will fix when using MUI. */
/** biome-ignore-all lint/a11y/useSemanticElements: Will fix when using MUI. */
/** biome-ignore-all lint/a11y/useFocusableInteractive: Will fix when using MUI. */

"use client";

import { Rating as MUIRating, Tooltip } from "@mui/material";
import { useUserStore } from "@/context/useUserStore";
import { useRatings } from "@/hooks/useRatings";

export default function Rating({ dishId }: { dishId: string }) {
  const userId = useUserStore((s) => s.userId);

  const { rateDish } = useRatings(userId ?? "");

  if (userId == null)
    return (
      <Tooltip
        title="Login to rate dishes!"
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
    />
  );
}
