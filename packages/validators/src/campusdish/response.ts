import { z } from "zod";

import { restaurantIds } from "@peterplate/db";

import { MenuProductSchema, MenuStationSchema } from "./models";

export const CampusDishMenuSchema = z.object({
  LocationId: z.enum(restaurantIds),
  Date: z.string().min(1),
  SelectedPeriodId: z
    .string({
      message: `Expected a string for SelectedPeriodId, restaurant may be closed or API might have changed`,
    })
    .min(1),
  Menu: z.object({
    MenuPeriods: z.array(
      z.object({
        PeriodId: z.string().min(1),
        Name: z.string().min(1),
      }),
    ),
    MenuProducts: z.array(MenuProductSchema),
    MenuStations: z.array(MenuStationSchema),
  }),
});

export type CampusDishMenu = z.infer<typeof CampusDishMenuSchema>;
