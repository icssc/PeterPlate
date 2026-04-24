import type { AppRouter, FormattedRestaurantInfo, Station } from "@api/index";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useMemo } from "react";
import DishesInfo from "@/components/ui/dishes-info";
import { useUserStore } from "@/context/useUserStore";
import {
  ALLERGY_MAP,
  type AllergyName,
  PREFERENCE_MAP,
  type PreferenceName,
} from "@/utils/dietary";
import { toTitleCase } from "@/utils/funcs";
import { trpc } from "@/utils/trpc";
import type { DishWithRating } from "../../../../../../packages/validators/src/anteater-api";

export type DishWithPreference = DishWithRating & { meetsPreferences: boolean };
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

  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  type EnrichedStation = {
    name: string;
    dishes: DishWithPreference[];
  };

  const enrichedStations: EnrichedStation[] = useMemo(() => {
    if (!stations) return [];

    return stations.map((station) => ({
      ...station,
      dishes: station.dishes.map((dish) => {
        if (!preferences || !allergies) {
          return { ...dish, meetsPreferences: true };
        }

        const flags = dish.dietRestriction;

        const violatesAllergy = allergies.some((allergy) => {
          if (!(allergy in ALLERGY_MAP)) return false;
          const key = ALLERGY_MAP[allergy as AllergyName];
          return flags?.[key] === true;
        });

        const violatesPreferences = preferences.some((pref) => {
          if (!(pref in PREFERENCE_MAP)) return false;
          const key = PREFERENCE_MAP[pref as PreferenceName];
          return flags?.[key] === false;
        });

        return {
          ...dish,
          meetsPreferences: !violatesAllergy && !violatesPreferences,
        };
      }),
    }));
  }, [stations, preferences, allergies]);

  const getFilteredDishes = (dishes: DishWithPreference[]) => {
    if (!showPreferencesOnly) return dishes;
    return dishes.filter((d) => !d.meetsPreferences);
  };

  const activeEnrichedStation = enrichedStations.find(
    (s) => s.name === activeStation?.name,
  );

  return (
    <div className="w-full">
      {isCompactView
        ? // Compact View: Render ALL stations
          enrichedStations.map((station) => (
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
                dishes={getFilteredDishes(activeEnrichedStation?.dishes ?? [])}
                isLoading={isLoading}
                isError={isError || (!isLoading && !hallData)}
                errorMessage={errorMessage}
                isCompactView={isCompactView}
              />
            </div>
          )}
    </div>
  );
}
