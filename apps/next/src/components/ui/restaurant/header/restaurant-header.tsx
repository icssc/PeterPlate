import { Typography } from "@mui/material";
import { HallEnum } from "@/utils/types";

interface RestaurantHeaderProps {
  isDesktop: boolean;
  hall: HallEnum;
}

export function RestaurantHeader({ isDesktop, hall }: RestaurantHeaderProps) {
  if (!isDesktop) return null;

  return (
    // Desktop title
    <Typography variant="h4" fontWeight={700} className="text-sky-700">
      {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
    </Typography>
  );
}
