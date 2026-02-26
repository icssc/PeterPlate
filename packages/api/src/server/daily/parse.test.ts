/**
 * Tests parsing functions in new-parse.ts
 *
 * TODO: use testData instead of network calls with vitest mock
 */

import { describe, expect, it } from "vitest";
import {
  getAdobeEcommerceMenuDaily,
  getAdobeEcommerceMenuWeekly,
  getAEMEvents,
  getLocationInformation,
} from "./parse";

describe("AdobeECommerce Parsing Functions", () => {
  it("parses GetLocation response", async () => {
    const result = await getLocationInformation("the-anteatery", "ASC");

    expect(result).toHaveProperty("schedules");
    expect(result.schedules.length).toBeGreaterThan(0);
    expect(result).toHaveProperty("allergenIntoleranceCodes");
    expect(Object.keys(result.allergenIntoleranceCodes).length).toBeGreaterThan(
      0,
    );
    expect(result).toHaveProperty("menuPreferenceCodes");
    expect(Object.keys(result.menuPreferenceCodes).length).toBeGreaterThan(0);
    expect(result).toHaveProperty("stationsInfo");
    expect(Object.keys(result.stationsInfo).length).toBeGreaterThan(0);
  });

  it("parses daily GetLocationRecipes response", async () => {
    const date = new Date();
    console.log(date);
    const result = await getAdobeEcommerceMenuDaily(date, "brandywine", 16);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("stationId");
    expect(result[0]).toHaveProperty("description");
    expect(result[0]).toHaveProperty("category");
    expect(result[0]).toHaveProperty("ingredients");
    expect(result[0]).toHaveProperty("recipeAllergenCodes");
    expect(result[0]).toHaveProperty("recipePreferenceCodes");
  });

  it("parses weekly GetLocationRecipes response", async () => {
    const date = new Date();
    const result = await getAdobeEcommerceMenuWeekly(date, "brandywine", 16);

    if (result == null) {
      console.log(
        "WARNING: GetLocationRecipesWeekly was null, which is possible if the period is not available, skipping...",
      );
      return;
    }

    const resultValues = Array.from(result.values());
    const firstResult = resultValues[0]?.[0];

    expect(resultValues.length).toBeGreaterThan(0);
    expect(firstResult).toHaveProperty("name");
    expect(firstResult).toHaveProperty("stationId");
    expect(firstResult).toHaveProperty("description");
    expect(firstResult).toHaveProperty("category");
    expect(firstResult).toHaveProperty("ingredients");
  });

  it("parses AEMEventList response", async () => {
    const result = await getAEMEvents("Brandywine");

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("restaurantId");
    expect(result[0]).toHaveProperty("longDescription");
    expect(result[0]).toHaveProperty("start");
    expect(result[0]).toHaveProperty("end");
  });
}, 15000);
