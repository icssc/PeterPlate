import type { SvgIconComponent } from "@mui/icons-material";
import {
  Apple,
  BakeryDining,
  Cake,
  Cookie,
  EggAlt,
  Grass,
  Icecream,
  KebabDining,
  LocalPizza,
  LunchDining,
  SetMeal,
  SoupKitchen,
} from "@mui/icons-material";

/**
 * Defines background color classes for different hall statuses.
 */
enum StatusColors {
  OPEN = "bg-emerald-500",
  CLOSED = "bg-red-500",
  ERROR = "bg-amber-500",
}

/**
 * Represents the operational status of a dining hall.
 */
enum HallStatusEnum {
  OPEN,
  CLOSED,
  ERROR,
  PREVIEW,
}

/**
 * Identifies the dining halls.
 */
enum HallEnum {
  ANTEATERY,
  BRANDYWINE,
}

/**
 * Represents the different meal periods.
 */
enum MealTimeEnum {
  BREAKFAST,
  LUNCH,
  DINNER,
  LATENIGHT,
}

/**
 * Maps nutrient keys (from the API or database) to their common units of measurement.
 * Used for display purposes.
 * Example: `calories` maps to `cal`.
 */
const nutrientToUnit: { [nutrient: string]: string } = {
  calories: "cal",
  totalFatG: "g",
  transFatG: "g",
  saturatedFatG: "g",
  cholesterolMg: "mg",
  sodiumMg: "mg",
  totalCarbsG: "g",
  dietaryFiberG: "g",
  sugarsG: "g",
  proteinG: "g",
  vitaminAIU: "% DV",
  vitaminCIU: "% DV",
  calciumMg: "mg",
  ironMg: "mg",
};

/**
 * Maps month numbers (0-indexed, as used by JavaScript's Date object)
 * to their abbreviated string representations.
 */
const numToMonth: { [num: number]: string } = {
  0: "Jan.",
  1: "Feb.",
  2: "Mar.",
  3: "Apr.",
  4: "May",
  5: "Jun.",
  6: "Jul.",
  7: "Aug.",
  8: "Sep.",
  9: "Oct.",
  10: "Nov.",
  11: "Dec.",
};

/**
 * Google Maps embed URLs for dining hall locations.
 * Used for displaying embedded maps in the location card.
 */
const ANTEATERY_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.2343796515447!2d-117.84751608771703!3d33.651088373199414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcde12deb776f1%3A0x766314500f8813c2!2sThe%20Anteatery!5e0!3m2!1sen!2sus!4v1770860208235!5m2!1sen!2sus";

const BRANDYWINE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3429.7763637757234!2d-117.84095176884651!3d33.64518667561823!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcde0f35ca653d%3A0xf33e49e0efd9eea5!2sBrandywine%20Commons!5e0!3m2!1sen!2sus!4v1770858688774!5m2!1sen!2sus";

/**
 * Google Maps link URLs for dining hall locations.
 * Used for "Open in Google Maps" links.
 */
const ANTEATERY_MAP_LINK_URL = "https://maps.app.goo.gl/f6KDnq227caCRyoBA";

const BRANDYWINE_MAP_LINK_URL = "https://maps.app.goo.gl/vTiuJzbKSwtZwZgi9";

/**
 * Defines the preferred order for displaying food categories.
 * Categories listed here will appear first and in this specific order.
 * Other categories will be sorted alphabetically after these.
 * NOTE: All category names should be lowercase for consistent matching. */
const preferredCategoryOrder: string[] = [
  "entrées",
  "hot sandwiches",
  "cold sandwiches",
  "pizza",
  "soups",
  "salads",
  "sides",
  "protein",
  "cereals",
  "breads",
  "grains",
  "condiments",
  "desserts",
];

/**
 * Keywords associated with meat-based dishes. Used by `getFoodIcon`.
 */
const meatKeywords: Set<string> = new Set<string>([
  "chicken",
  "ham",
  "beef",
  "pork",
  "shawarma",
  "turkey",
  "sausage",
  "meat",
  "bacon",
  "salami",
  "pepperoni",
  "carne",
]);

/**
 * Keywords associated with pastries. Used by `getFoodIcon`.
 */
const pastryKeywords: Set<string> = new Set<string>([
  "cinnamon",
  "pastry",
  "muffin",
]);

/**
 * Keywords associated with fruits. Used by `getFoodIcon`.
 * NOTE: "strawberr" and "cranberr" are partial to catch variations.
 */
const fruitKeywords: Set<string> = new Set<string>([
  "strawberr",
  "orange",
  "cranberr",
  "pineapple",
  "grape",
  "cantaloupe",
  "melon",
  "lemon",
]);

/**
 * Keywords associated with cookies. Used by `getFoodIcon`.
 */
const cookieKeywords: Set<string> = new Set<string>(["cookie"]);

/**
 * Keywords associated with croissants. Used by `getFoodIcon`.
 */
const croissantKeywords: Set<string> = new Set<string>(["croissant"]);

/**
 * Keywords associated with cakes. Used by `getFoodIcon`.
 */
const cakeKeywords: Set<string> = new Set<string>(["cake"]);

/**
 * Keywords associated with sandwiches and burgers. Used by `getFoodIcon`.
 */
const sandwichKeywords: Set<string> = new Set<string>([
  "sandwich",
  "melt",
  "burger",
  "dog", // Intended for "hot dog"
  "panini",
]);

const pizzaKeywords: Set<string> = new Set<string>([
  "pizza",
  "flatbread",
  "stromboli",
]);

/**
 * Keywords associated with egg-based dishes. Used by `getFoodIcon`.
 */
const eggKeywords: Set<string> = new Set<string>(["egg", "omeconstte"]);

/**
 * Keywords associated with salads and vegetables. Used by `getFoodIcon`.
 */
const saladKeywords: Set<string> = new Set<string>([
  "tomato",
  "consttuce",
  "onion",
  "greens",
  "coleslaw",
  "kale",
  "olive",
  "pepper",
  "kale",
  "salad",
  "cucumber",
  "spinach",
  "carrot",
  "bean",
  "lentil",
  "tofu",
  "vegetable",
  "potato",
]);

/**
 * Keywords associated with grains and breads. Used by `getFoodIcon`.
 */
const grainAndBreadKeywords: Set<string> = new Set<string>([
  "bread",
  "farro",
  "crouton",
  "quinoa",
  "oats",
  "granola",
  "bagel",
]);

/**
 * Keywords associated with soups, cereals, and pasta dishes. Used by `getFoodIcon`.
 */
const soupKeywords: Set<string> = new Set<string>([
  "oatmeal",
  "soup",
  "cereal",
  "mac",
  "rice",
  "noodle",
  "penne",
  "pasta",
  "cavatappi",
]);

/**
 * Keywords associated with ice cream and similar desserts. Used by `getFoodIcon`.
 */
const iceCreamKeywords: Set<string> = new Set<string>([
  "cream",
  "yogurt",
  "sorbet",
  "parfait",
]);

/**
 * Keywords associated with fish and seafood. Used by `getFoodIcon`.
 */
const fishKeywords: Set<string> = new Set<string>([
  "fish",
  "tilapia",
  "tuna",
  "salmon",
]);

/**
 * An array of keyword sets used by `getFoodIcon` to determine the appropriate food icon.
 * The order of sets in this array is crucial for matching specificity.
 * More specific keyword sets (e.g., `cakeKeywords`) should appear before more
 * general ones (e.g., `meatKeywords`) to ensure, for instance, that a "hamburger"
 * gets a sandwich/burger icon rather than a generic meat icon.
 */
const foodIconKeywords: Set<string>[] = [
  cakeKeywords,
  croissantKeywords,
  cookieKeywords,
  pastryKeywords,
  iceCreamKeywords,
  fruitKeywords,
  soupKeywords,
  eggKeywords,
  pizzaKeywords,
  sandwichKeywords,
  saladKeywords,
  meatKeywords,
  grainAndBreadKeywords,
  fishKeywords,
];

/**
 * An array of Icon components. The order of icons in this array
 * directly corresponds to the order of `foodIconKeywords` sets.
 * `getFoodIcon` uses this array to return the matched icon component.
 */
const foodIcons: SvgIconComponent[] = [
  Cake,
  BakeryDining,
  Cookie,
  BakeryDining,
  Icecream,
  Apple,
  SoupKitchen,
  EggAlt,
  LocalPizza,
  LunchDining,
  Grass,
  KebabDining,
  Grass,
  SetMeal,
];

export {
  StatusColors,
  HallStatusEnum,
  HallEnum,
  MealTimeEnum,
  nutrientToUnit,
  numToMonth,
  ANTEATERY_MAP_EMBED_URL,
  BRANDYWINE_MAP_EMBED_URL,
  ANTEATERY_MAP_LINK_URL,
  BRANDYWINE_MAP_LINK_URL,
  preferredCategoryOrder,
  foodIconKeywords,
  foodIcons,
};
