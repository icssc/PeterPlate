/**
 * Latency benchmark for the restaurant menu path (issue #795).
 *
 * Measures three things for each dining hall:
 *  1. current  – the AAPI call sequence getRestaurantByDate makes today,
 *                with a per-step breakdown (restaurants → restaurantToday → dishes)
 *  2. proposed – restaurants + restaurantToday in parallel, one combined dish batch
 *  3. service  – the real getRestaurantByDate end to end, including DB work
 *
 * Run from the repo root (uses DATABASE_URL from .env for the service timing):
 *   pnpm -F @peterplate/api with-env tsx src/restaurants/services.benchmark.ts [iterations]
 *
 * Keep iterations low; every run hits the public Anteater API.
 */
import { createDrizzle } from "@peterplate/db";
import { AAPI_DINING_ROUTE } from "..";
import { getRestaurantByDate } from "./services";

type PeriodPayload = {
  startTime?: string | null;
  endTime?: string | null;
  stationToDishes: Record<string, string[]>;
};

const RESTAURANTS = ["brandywine", "anteatery"] as const;
const ITERATIONS = Number(process.argv[2] ?? 3);
const date = new Date();
const dateString = date.toLocaleDateString("en-CA", {
  timeZone: "America/Los_Angeles",
});

const getJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};

const validPeriods = (today: {
  data: { periods: Record<string, PeriodPayload> };
}) => Object.values(today.data.periods).filter((p) => p.startTime && p.endTime);

/** Mirrors the call order in getRestaurantByDate / getDishes (AAPI only). */
async function current(id: string) {
  const start = performance.now();
  await getJson(`${AAPI_DINING_ROUTE}/restaurants?id=${id}`);
  const restaurants = performance.now() - start;

  const today = await getJson(
    `${AAPI_DINING_ROUTE}/restaurantToday?id=${id}&date=${dateString}`,
  );
  const restaurantToday = performance.now() - start;

  const periods = validPeriods(today);
  await Promise.all(
    periods.map((p) =>
      getJson(
        `${AAPI_DINING_ROUTE}/dishes/batch?ids=${[...new Set(Object.values(p.stationToDishes).flat())].join()}`,
      ),
    ),
  );

  return {
    restaurants,
    restaurantToday,
    total: performance.now() - start,
    dishCalls: periods.length,
  };
}

/** Independent calls in parallel, one dish batch for all periods. */
async function proposed(id: string) {
  const start = performance.now();
  const [, today] = await Promise.all([
    getJson(`${AAPI_DINING_ROUTE}/restaurants?id=${id}`),
    getJson(`${AAPI_DINING_ROUTE}/restaurantToday?id=${id}&date=${dateString}`),
  ]);

  const ids = [
    ...new Set(
      validPeriods(today).flatMap((p) =>
        Object.values(p.stationToDishes).flat(),
      ),
    ),
  ];
  await getJson(`${AAPI_DINING_ROUTE}/dishes/batch?ids=${ids.join()}`);

  return { total: performance.now() - start, uniqueDishes: ids.length };
}

const ms = (n: number) => `${Math.round(n)}ms`.padStart(7);
const median = (xs: number[]) =>
  [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;

async function main() {
  const db = process.env.DATABASE_URL
    ? createDrizzle({ connectionString: process.env.DATABASE_URL })
    : null;
  if (!db) console.warn("DATABASE_URL not set; skipping service timing.\n");

  console.log(`date=${dateString} iterations=${ITERATIONS}\n`);

  for (const id of RESTAURANTS) {
    const totals = {
      current: [] as number[],
      proposed: [] as number[],
      service: [] as number[],
    };

    for (let i = 0; i < ITERATIONS; i++) {
      const c = await current(id);
      const p = await proposed(id);
      totals.current.push(c.total);
      totals.proposed.push(p.total);

      let serviceText = "";
      if (db) {
        const s = performance.now();
        await getRestaurantByDate(id, db, date);
        const elapsed = performance.now() - s;
        totals.service.push(elapsed);
        serviceText = ` | service (AAPI+DB) ${ms(elapsed)}`;
      }

      console.log(
        `${id.padEnd(10)} #${i + 1} current: restaurants ${ms(c.restaurants)} → today ${ms(c.restaurantToday)} → dishes×${c.dishCalls} ${ms(c.total)}` +
          ` | proposed (${p.uniqueDishes} dishes, 1 batch) ${ms(p.total)}${serviceText}`,
      );
    }

    console.log(
      `${id.padEnd(10)} median  current ${ms(median(totals.current))} | proposed ${ms(median(totals.proposed))}` +
        (db ? ` | service ${ms(median(totals.service))}` : "") +
        "\n",
    );
  }

  await db?.$client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
