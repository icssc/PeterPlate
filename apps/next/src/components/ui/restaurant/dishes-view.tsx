import { Typography } from "@mui/material";
import type { RestaurantInfo } from "@peterplate/api";
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

interface DishesViewProps {
  isCompactView: boolean;
  stations: any[]; // Ideally typed better, but keeping consistent with usage
  activeStation: any | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  hallData: RestaurantInfo | undefined;
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

  const enrichedStations = useMemo(() => {
    if (!stations) return [];

    return stations.map((station) => ({
      ...station,
      dishes: station.dishes.map((dish: any) => {
        if (!preferences || !allergies) {
          return { ...dish, doesNotMeetPreferences: false };
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
          doesNotMeetPreferences: violatesAllergy || violatesPreferences,
        };
      }),
    }));
  }, [stations, preferences, allergies]);

  const getFilteredDishes = (dishes: any[]) => {
    // console.log("running filtered dishes function")
    if (!showPreferencesOnly) return dishes;
    console.log("showprefs only is true");
    console.log(
      "Preferences: ",
      dishes.map((d) => d.doesNotMeetPreferences),
    );
    console.log(dishes.filter((d) => !d.doesNotMeetPreferences));
    return dishes.filter((d) => !d.doesNotMeetPreferences);
  };
  const enrichedActiveStation = enrichedStations.find(
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
              />
            </div>
          ))
        : // Normal View: Render active station logic
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
                dishes={getFilteredDishes(enrichedActiveStation?.dishes ?? [])}
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
