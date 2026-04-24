import type { Dish } from "@peterplate/validators";

export type DiningHallId = "anteatery" | "brandywine";

/** Dates enabled in the dining hall picker. */
export type PickableDatesPayload = Date[] | null;

/** Date bounds for the picker UI. */
export interface DiningDateRange {
  earliest: Date;
  latest: Date;
}

/** Event shape used by PeterPlate. */
export interface DiningEventPayload {
  title: string;
  restaurantId: DiningHallId;
  image: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  start: Date | string | null;
  end: Date | string | null;
}

/** Period times used for hall status and selection. */
export interface DiningPeriodPayload {
  name: string;
  startTime: string;
  endTime: string;
}

/** Nutrient fields used in the meal tracker UI. */
export interface DiningNutrientsPayload {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

/** Dish data plus PeterPlate-specific fields. */
export interface DiningDishPayload extends Dish {
  menuId?: string;
  restaurant?: string;
  totalRating: number;
  numRatings?: number;
  image_url?: string | null;
  category?: string | null;
  ingredients?: string | null;
  dietRestriction?: Record<string, unknown> | null;
  nutritionInfo?: Record<string, unknown> | null;
}

/** Station grouping used by the dining hall page. */
export interface DiningStationPayload {
  id?: string;
  name: string;
  dishes: DiningDishPayload[];
}

/** Menu-like wrapper kept for frontend compatibility. */
export interface DiningMenuPayload {
  id?: string;
  date?: string;
  period: DiningPeriodPayload;
  stations: DiningStationPayload[];
  price?: string | null;
}

/** Dining hall payload used by the frontend. */
export interface DiningRestaurantPayload {
  id: DiningHallId | string;
  name: string;
  events: DiningEventPayload[];
  menus: DiningMenuPayload[];
}

/** Top-level dining response. */
export interface PeterPlateDiningPayload {
  anteatery: DiningRestaurantPayload;
  brandywine: DiningRestaurantPayload;
}
