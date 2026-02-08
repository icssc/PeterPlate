/**
 * Tests Zod schemas for AdobeEcommerce responses when 
 * querying GetLocation, GetLocationRecipes, AEMEventList
 */

import {
  GetLocationSchema,
  GetLocationRecipesDailySchema,
  GetLocationRecipesWeeklySchema,
  AEMEventListSchema,
} from "@peterplate/validators";
import { describe, it } from "vitest";

import getLocation from "./testData/getLocation.json";
import getLocationRecipesDaily from "./testData/getLocationRecipesDaily.json"
import getLocationRecipesWeekly from "./testData/getLocationRecipesWeekly.json"
import AEMEventList from "./testData/AEM_eventList.json"

describe("Validates AdobeECommerce Responses", () => {
  it("parses getLocation response", ({ expect }) => {
    expect(() => GetLocationSchema.parse(getLocation)).not.toThrow();
  });

  it("validates getLocationRecipesDaily response", ({ expect }) => {
    expect(() => GetLocationRecipesDailySchema.parse(getLocationRecipesDaily)).not.toThrow();
  });

  it("validates getLocationRecipesWeekly response", ({ expect }) => {
    expect(() => GetLocationRecipesWeeklySchema.parse(getLocationRecipesWeekly)).not.toThrow();
  });

  it("validates AEMEventList response", ({ expect }) => {
    expect(() => AEMEventListSchema.parse(AEMEventList)).not.toThrow();
  });
});
