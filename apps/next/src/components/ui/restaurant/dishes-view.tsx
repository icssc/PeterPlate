import type { AppRouter, FormattedRestaurantInfo, Station } from "@api/index";
import { Typography } from "@mui/material";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useEffect, useMemo } from "react";
import DishesInfo from "@/components/ui/dishes-info";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { useUserStore } from "@/context/useUserStore";
import { getDietaryConflicts } from "@/utils/dietary";
import { toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";

interface DishesViewProps {
  stations: Station[];
  activeStation: Station | undefined;
  isDesktop: boolean;
  isLoading: boolean;
  isError: boolean;
  error: TRPCClientErrorLike<AppRouter> | null;
  hallData: FormattedRestaurantInfo | undefined;
}

export function DishesView({
  stations,
  activeStation,
  isDesktop,
  isLoading,
  isError,
  error,
  hallData,
}: DishesViewProps) {
  const isCompactView = useRestaurantUIStore((s) => s.isCompactView);
  const setSelectedStation = useRestaurantUIStore((s) => s.setSelectedStation);
  const showPreferencesOnly = useRestaurantUIStore(
    (s) => s.showPreferencesOnly,
  );
  const showAllStations = isDesktop;

  const errorMessage =
    error?.message ??
    (!isLoading && !hallData ? "Data not available for this hall." : undefined);

  const userId = useUserStore((s) => s.userId);
  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery({
    userId: userId ?? "",
  });
  const { data: allergies } = trpc.allergy.getAllergies.useQuery({
    userId: userId ?? "",
  });

  // Pre-compute filtered dishes for every station so view-mode toggles don't
  // recompute getDietaryConflicts for every dish on each render.
  const filteredDishesMap = useMemo(() => {
    return new Map(
      stations.map((station) => [
        station.id,
        showPreferencesOnly && allergies && preferences
          ? station.dishes.filter(
              (dish) =>
                getDietaryConflicts(
                  dish.dietRestriction,
                  preferences,
                  allergies,
                ).length === 0,
            )
          : station.dishes,
      ]),
    );
  }, [stations, showPreferencesOnly, preferences, allergies]);

  useEffect(() => {
    if (!showAllStations || stations.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleStation = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          ?.target.getAttribute("data-station");

        if (visibleStation) {
          setSelectedStation(visibleStation);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const station of stations) {
      const element = document.getElementById(`station-${station.id}`);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [showAllStations, stations, setSelectedStation]);

  return (
    <div className="w-full">
      {showAllStations
        ? // Desktop view: render all stations in toolbar order.
          stations.map((station) => (
            <div
              key={station.id}
              id={`station-${station.id}`}
              data-station={station.id}
              className="mb-4 scroll-mt-14"
            >
              <div className="mb-3 rounded-[6px] bg-[#CDE2F1] px-3 py-1.5 dark:bg-[#46566a]">
                <Typography
                  variant="h5"
                  color="primary"
                  className="!font-poppins !text-[24px] !font-bold !leading-[30px]"
                >
                  {toTitleCase(station.name)}
                </Typography>
              </div>
              <DishesInfo
                dishes={filteredDishesMap.get(station.id) ?? station.dishes}
                isLoading={isLoading}
                isError={isError || (!isLoading && !hallData)}
                errorMessage={errorMessage}
                isCompactView={isCompactView}
                restaurant={hallData?.name ?? "brandywine"}
              />
            </div>
          ))
        : // Normal View: Render active station
          activeStation && (
            <div>
              <div className="mb-3 rounded-[6px] bg-[#CDE2F1] px-3 py-1.5 dark:bg-[#46566a]">
                <Typography
                  variant="h5"
                  color="primary"
                  className="!font-poppins !text-[24px] !font-bold !leading-[30px]"
                >
                  {toTitleCase(activeStation.name)}
                </Typography>
              </div>
              <DishesInfo
                dishes={
                  filteredDishesMap.get(activeStation.id) ??
                  activeStation.dishes
                }
                isLoading={isLoading}
                isError={isError || (!isLoading && !hallData)}
                errorMessage={errorMessage}
                restaurant={hallData?.name ?? "brandywine"}
                isCompactView={isCompactView}
              />
            </div>
          )}
    </div>
  );
}
