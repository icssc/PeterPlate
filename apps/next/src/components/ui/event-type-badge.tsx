import { Typography } from "@mui/material";
import type { EventCategory } from "@/utils/classifyEvent";

export default function EventTypeBadge({ type }: { type: EventCategory }) {
  return (
    <Typography
      className={`absolute bottom-3 right-3 text-sm font-medium px-4 py-1.5 
        rounded-2xl border-button-primary-bg dark:border-2 bg-button-primary-bg`}
      color="primary"
    >
      {type}
    </Typography>
  );
}
