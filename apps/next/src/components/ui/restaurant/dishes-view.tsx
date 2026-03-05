import type { RestaurantInfo } from "@peterplate/api";
import DishesInfo from "@/components/ui/dishes-info";
import { toTitleCase } from "@/utils/funcs";

interface DishesViewProps {
  isCompactView: boolean;
  stations: any[]; // Ideally typed better, but keeping consistent with usage
  activeStation: any | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  hallData: RestaurantInfo | undefined;
}

export function DishesView({
  isCompactView,
  stations,
  activeStation,
  isLoading,
  isError,
  error,
  hallData,
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
                dishes={station.dishes}
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
                dishes={activeStation.dishes}
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
