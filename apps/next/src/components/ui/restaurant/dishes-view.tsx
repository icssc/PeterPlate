import type { AppRouter, FormattedRestaurantInfo, Station } from "@api/index";
import { Typography } from "@mui/material";
import type { DishWithRating } from "@peterplate/validators";
import type { TRPCClientErrorLike } from "@trpc/client";
import DishesInfo from "@/components/ui/dishes-info";
import { useRestaurantUIStore } from "@/context/useRestaurantUIStore";
import { useUserStore } from "@/context/useUserStore";
import { getDietaryConflicts } from "@/utils/dietary";
import { toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";

interface DishesViewProps {
  stations: Station[];
  activeStation: Station | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TRPCClientErrorLike<AppRouter> | null;
  hallData: FormattedRestaurantInfo | undefined;
}

export function DishesView({
  stations,
  activeStation,
  isLoading,
  isError,
  error,
  hallData,
}: DishesViewProps) {
  const isCompactView = useRestaurantUIStore((s) => s.isCompactView);
  const showPreferencesOnly = useRestaurantUIStore(
    (s) => s.showPreferencesOnly,
  );

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

  const getFilteredDishes = (dishes: DishWithRating[]) => {
    if (!showPreferencesOnly || !allergies || !preferences) return dishes;
    return dishes.filter(
      (dish) =>
        getDietaryConflicts(dish.dietRestriction, preferences, allergies)
          .length > 0,
    );
  };

  return (
    <div className="w-full">
      {isCompactView
        ? // Compact View: Render ALL stations
          stations.map((station) => (
            <div
              key={station.name}
              id={station.name.toLowerCase()}
              className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible mb-8 scroll-mt-4"
            >
              <div className="mb-4">
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ fontSize: "1.875rem" }}
                >
                  {toTitleCase(station.name)}
                </Typography>
              </div>
              <DishesInfo
                dishes={getFilteredDishes(station.dishes)}
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
            <div className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible">
              <div className="mb-4">
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ fontSize: "1.875rem" }}
                >
                  {toTitleCase(activeStation.name)}
                </Typography>
              </div>
              <DishesInfo
                dishes={getFilteredDishes(activeStation?.dishes ?? [])}
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
