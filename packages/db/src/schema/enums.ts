import { pgEnum } from "drizzle-orm/pg-core";

export const restaurantIdEnum = pgEnum("restaurant_id_enum", [
  "anteatery",
  "brandywine",
]);
export const restaurantNameEnum = pgEnum("restaurant_name_enum", [
  "anteatery",
  "brandywine",
]);

export const restaurantIds = restaurantIdEnum.enumValues;
export const restaurantNames = restaurantNameEnum.enumValues;

export type RestaurantId = (typeof restaurantIds)[number];
export type RestaurantName = (typeof restaurantNames)[number];

export const getRestaurantId = (name: RestaurantName): RestaurantId => name;
export const getRestaurantNameById = (id: RestaurantId): RestaurantName => id;
