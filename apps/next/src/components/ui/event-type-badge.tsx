import { Typography } from "@mui/material";
import type { EventCategory } from "@/utils/classifyEvent";

export default function EventTypeBadge({ type }: { type: EventCategory }) {
  return (
    <Typography
      className={`absolute bottom-3 right-2 text-sm font-medium px-4 py-1.5
        rounded-2xl bg-white text-black
        dark:bg-[#313136] dark:text-white`}
    >
      {type}
    </Typography>
  );
}
