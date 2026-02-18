import { Typography } from "@mui/material";
import { DiningHallStatus } from "@/components/ui/status";
import type { HallStatusEnum } from "@/utils/types";
import { HallEnum } from "@/utils/types";

interface RestaurantHeaderProps {
  isDesktop: boolean;
  hall: HallEnum;
  derivedHallStatus: HallStatusEnum;
}

export function RestaurantHeader({
  isDesktop,
  hall,
  derivedHallStatus,
}: RestaurantHeaderProps) {
  if (!isDesktop) return null;

  return (
    <>
      {/* Desktop title */}
      <Typography variant="h4" fontWeight={700} className="text-sky-700">
        {hall === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}
      </Typography>

      {/* Desktop Status */}
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:justify-end">
        <div>
          <DiningHallStatus status={derivedHallStatus} />
        </div>
      </div>
    </>
  );
}
