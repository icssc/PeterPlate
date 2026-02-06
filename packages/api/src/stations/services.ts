import { upsert } from "@api/utils";

import type { Drizzle, InsertStation, RestaurantId } from "@zotmeal/db";
import { stations } from "@zotmeal/db";
import { DiningHallInformation } from "@zotmeal/validators";
import { logger } from "@api/logger";

export const upsertStation = async (db: Drizzle, station: InsertStation) =>
  await upsert(db, stations, station, {
    target: stations.id,
    set: station,
  });


/**
 * Upserts all stations present within `stationsInfo`.
 */
export async function upsertAllStations(
  db: Drizzle,
  restaurantId: RestaurantId,
  restaurantInfo: DiningHallInformation,
): Promise<void> {
  const stationsResult = await Promise.allSettled(
    Object.keys(restaurantInfo.stationsInfo).map(id => {
      upsertStation(db, {
        id,
        restaurantId,
        name: restaurantInfo.stationsInfo[id] ?? "UNKNOWN STATION",
      })
    })
  );

  for (const station of stationsResult)
    if (station.status === "rejected") {
      const reason = station.reason;
      let stationDetail = "unknown station";
      if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        stationDetail = `station '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        stationDetail = `Error: ${reason.message}`;
      } else {
        stationDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert station ${stationDetail} for ${restaurantId}.`,
        reason,
      );
    }
 

}
