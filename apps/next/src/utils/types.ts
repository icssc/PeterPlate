import { Drumstick, EggAlt, LucideProps, LocalPizza, Salad, SoupKitchen, LunchDining, Icecream, Cookie, BakeryDining, Cake, Wheat, apple, SetMeal } from "@mui/icons-material";
//import { Drumstick, EggFried, LucideProps, Pizza, Salad, Soup, Sandwich, IceCreamBowl, Dessert, Cookie, Croissant, CakeSlice, Wheat, Apple, FishSymbol} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

/**
 * Defines background color classes for different hall statuses.
 */
enum StatusColors {
    OPEN = "bg-emerald-500",
    CLOSED = "bg-red-500",
    ERROR = "bg-amber-500"
};

/**
 * Represents the operational status of a dining hall.
 */
enum HallStatusEnum {
    OPEN,
    CLOSED,
    ERROR,
    PREVIEW
};

/**
 * Identifies the dining halls.
 */
enum HallEnum {
    ANTEATERY,
    BRANDYWINE
};

/**
 * Represents the different meal periods.
 */
enum MealTimeEnum {
    BREAKFAST,
    LUNCH,
    DINNER,
    LATENIGHT
}

/**
 * Maps nutrient keys (from the API or database) to their common units of measurement.
 * Used for display purposes.
 * Example: `calories` maps to `cal`.
 */
const nutrientToUnit : { [nutrient: string]: string } = {
  "calories": "cal",
  "totalFatG": "g",
  "transFatG": "g",
  "saturatedFatG": "g",
  "cholesterolMg": "mg",
  "sodiumMg": "mg",
  "totalCarbsG": "g",
  "dietaryFiberG": "g",
  "sugarsG": "g",
  "proteinG": "g",
  "vitaminAIU": "% DV",
  "vitaminCIU": "% DV",
  "calciumMg": "mg",
  "ironMg": "mg",
}

/**
 * Maps month numbers (0-indexed, as used by JavaScript's Date object)
 * to their abbreviated string representations.
 */
const numToMonth : {[num: number]: string} = {
  0:  "Jan.",
  1:  "Feb.",
  2:  "Mar.",
  3:  "Apr.",
  4:  "May",
  5:  "Jun.",
  6:  "Jul.",
  7:  "Aug.",
  8:  "Sep.",
  9:  "Oct.",
  10: "Nov.",
  11: "Dec."
};

/**
 * Defines the preferred order for displaying food categories.
 * Categories listed here will appear first and in this specific order.
 * Other categories will be sorted alphabetically after these.
 * NOTE: All category names should be lowercase for consistent matching. */
const preferredCategoryOrder: string[] = [
  'entrées', 
  'hot sandwiches', 
  'cold sandwiches', 
  'pizza',
  'soups',
  'salads', 
  'sides', 
  'protein',
  'cereals',
  'breads',
  'grains',
  'condiments',
  'desserts',
]

/**
 * Keywords associated with meat-based dishes. Used by `getFoodIcon`.
 */
let meatKeywords: Set<string> = new Set<string>([
  'chicken',
  'ham',
  'beef',
  'pork',
  'shawarma',
  'turkey',
  'sausage',
  'meat',
  'bacon',
  'salami',
  'pepperoni',
  'carne'
]);

/**
 * Keywords associated with pastries. Used by `getFoodIcon`.
 */
let pastryKeywords: Set<string> = new Set<string>([
  'cinnamon',
  'pastry',
  'muffin'
]);

/**
 * Keywords associated with fruits. Used by `getFoodIcon`.
 * NOTE: "strawberr" and "cranberr" are partial to catch variations.
 */
let fruitKeywords: Set<string> = new Set<string>([
  'strawberr',
  'orange',
  'cranberr',
  'pineapple',
  'grape',
  'cantaloupe',
  'melon',
  'lemon'
]);

/**
 * Keywords associated with cookies. Used by `getFoodIcon`.
 */
let cookieKeywords: Set<string> = new Set<string>([
  'cookie'
]);

/**
 * Keywords associated with croissants. Used by `getFoodIcon`.
 */
let croissantKeywords: Set<string> = new Set<string>([
  'croissant'
]);

/**
 * Keywords associated with cakes. Used by `getFoodIcon`.
 */
let cakeKeywords: Set<string> = new Set<string>([
  'cake'
]);

/**
 * Keywords associated with sandwiches and burgers. Used by `getFoodIcon`.
 */
let sandwichKeywords: Set<string> = new Set<string>([
  'sandwich',
  'melt',
  'burger',
  'dog',      // Intended for "hot dog"
  'panini'
]);

let pizzaKeywords: Set<string> = new Set<string>([
  'pizza',
  'flatbread',
  'stromboli'
]);

/**
 * Keywords associated with egg-based dishes. Used by `getFoodIcon`.
 */
let eggKeywords: Set<string> = new Set<string>([
  'egg',
  'omelette'
]);

/**
 * Keywords associated with salads and vegetables. Used by `getFoodIcon`.
 */
let saladKeywords: Set<string> = new Set<string>([
  'tomato',
  'lettuce',
  'onion',
  'greens',
  'coleslaw',
  'kale',
  'olive',
  'pepper',
  'kale',
  'salad',
  'cucumber',
  'spinach',
  'carrot',
  'bean',
  'lentil',
  'tofu',
  'vegetable',
  'potato',
]);

/**
 * Keywords associated with grains and breads. Used by `getFoodIcon`.
 */
let grainAndBreadKeywords: Set<string> = new Set<string>([
  'bread',
  'farro',
  'crouton',
  'quinoa',
  'oats',
  'granola',
  'bagel'
]);

/**
 * Keywords associated with soups, cereals, and pasta dishes. Used by `getFoodIcon`.
 */
let soupKeywords: Set<string> = new Set<string>([
  'oatmeal',
  'soup',
  'cereal',
  'mac',
  'rice',
  'noodle',
  'penne',
  'pasta',
  'cavatappi'
]);

/**
 * Keywords associated with ice cream and similar desserts. Used by `getFoodIcon`.
 */
let iceCreamKeywords: Set<string> = new Set<string>([
  'cream',
  'yogurt',
  'sorbet',
  'parfait',
]);

/**
 * Keywords associated with fish and seafood. Used by `getFoodIcon`.
 */
let fishKeywords: Set<string> = new Set<string>([
  'fish',
  'tilapia',
  'tuna',
  'salmon'
]);

/**
 * An array of keyword sets used by `getFoodIcon` to determine the appropriate food icon.
 * The order of sets in this array is crucial for matching specificity.
 * More specific keyword sets (e.g., `cakeKeywords`) should appear before more
 * general ones (e.g., `meatKeywords`) to ensure, for instance, that a "hamburger"
 * gets a sandwich/burger icon rather than a generic meat icon.
 */
let foodIconKeywords: Set<string>[] = [
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
]

/**
 * Represents a Lucide React icon component.
 * This type is used for icon components imported from the `lucide-react` library.
 */
export type LucideIconComponent = 
  ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

/**
 * An array of Lucide React icon components. The order of icons in this array
 * directly corresponds to the order of `foodIconKeywords` sets.
 * `getFoodIcon` uses this array to return the matched icon component.
 */
let foodIcons: LucideIconComponent[] = [
  Cake,
  BakeryDining,
  Cookie,
  Dessert,
  Icecream,
  Apple,
  SoupKitchen,
  EggAlt,
  LocalPizza,
  LunchDining,
  Salad,
  Drumstick,
  Wheat,
  SetMeal
];


export {StatusColors, 
        HallStatusEnum, 
        HallEnum, 
        MealTimeEnum, 
        nutrientToUnit,
        numToMonth,
        preferredCategoryOrder,
        foodIconKeywords,
        foodIcons,
        };