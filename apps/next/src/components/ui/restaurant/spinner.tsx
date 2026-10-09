"use client";
// spinner.tsx
// A loading spinner for the restaurant page.

import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Loading menu",
  "Asking Peter what the best dishes are",
  "Waiting in line at Brandywine",
  "Eating ants",
  "Checking events",
];

export default function RestaurantSpinner() {
  const [loadMessageIdx, setLoadMessageIdx] = useState(0);

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      let selectedIdx = Math.floor(Math.random() * MESSAGES.length);
      selectedIdx =
        selectedIdx === loadMessageIdx
          ? (selectedIdx + 1) % MESSAGES.length
          : selectedIdx;

      setLoadMessageIdx(selectedIdx);
    }, 3000);

    return () => clearTimeout(messageTimer);
  }, [loadMessageIdx]);

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center mt-12">
      <CircularProgress
        enableTrackSlot
        variant="indeterminate"
        color="primary"
        size="5rem"
        sx={{ circle: { strokeLinecap: "round" } }}
      />
      <Typography color="primary" className="md:text-xl text-md font-bold">
        {MESSAGES[loadMessageIdx]}...
      </Typography>
      <Typography
        color="textPrimary"
        className="md:text-md text-sm text-black/60 dark:text-white/40"
      >
        Please wait while we fetch today's dishes.
      </Typography>
    </div>
  );
}
