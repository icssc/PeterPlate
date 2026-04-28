import type { AppRouter, FormattedRestaurantInfo, Station } from "@api/index";
import type { DishWithRating } from "@peterplate/validators";
import type { TRPCClientErrorLike } from "@trpc/client";
import DishesInfo from "@/components/ui/dishes-info";
import { useUserStore } from "@/context/useUserStore";
import { getDietaryConflicts } from "@/utils/dietary";
import { toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";

interface DishesViewProps {
  isCompactView: boolean;
  stations: Station[];
  activeStation: Station;
  isLoading: boolean;
  isError: boolean;
  error: TRPCClientErrorLike<AppRouter> | null;
  hallData: FormattedRestaurantInfo | undefined;
  showPreferencesOnly: boolean;
}

export function DishesView({
  isCompactView,
  stations,
  activeStation,
  isLoading,
  isError,
  error,
  hallData,
  showPreferencesOnly,
}: DishesViewProps) {
  // Helper to extract error message logic
  const getErrorMessage = () => {
    return (
      error?.message ??
      (!isLoading && !hallData
        ? "Data not available for this hall."
        : undefined)
    );
  };

  const errorMessage = getErrorMessage();

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
              <div className="border-b-2 mb-4">
                <h1 className="font-bold text-3xl">
                  {toTitleCase(station.name)}
                </h1>
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
        : // Normal View: Render active station logic
          activeStation && (
            <div className="[&_#food-scroll]:h-auto [&_#food-scroll]:overflow-y-visible">
              <div className="border-b-2 mb-4">
                <h1 className="font-bold text-3xl">
                  {toTitleCase(activeStation.name)}
                </h1>
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
