import type { InsertRating, InsertUser } from "@peterplate/db";
import type { Dish } from "@peterplate/validators";

const dishId = "1821_122168_M40780_1_25617";
const userId = "user1";

const dish = {
  id: "1821_122168_M40780_1_25617",
  stationId: "1887",
  name: "Grilled Indian-Spiced Chicken",
  description:
    "Juicy chicken breast seasoned with a flavorful blend of toasted cumin, cinnamon and turmeric",
  ingredients: "Chicken Breast, Canola Oil, Turmeric, Cinnamon, Cumin",
  category: "Grilled",
  imageUrl: null,
  updatedAt: new Date("2026-04-23"),
  dietRestriction: {
    containsEggs: true,
    containsFish: true,
    containsMilk: true,
    containsPeanuts: true,
    containsSesame: true,
    containsShellfish: true,
    containsSoy: true,
    containsTreeNuts: true,
    containsWheat: true,
    isGlutenFree: true,
    isHalal: true,
    isKosher: true,
    isLocallyGrown: true,
    isOrganic: true,
    isVegan: true,
    isVegetarian: true,
  },
  nutritionInfo: {
    servingSize: "1",
    servingUnit: "serving",
    calories: null,
    totalFatG: null,
    transFatG: null,
    saturatedFatG: null,
    cholesterolMg: null,
    sodiumMg: null,
    totalCarbsG: null,
    dietaryFiberG: null,
    sugarsG: null,
    proteinG: null,
    calciumMg: null,
    ironMg: null,
    vitaminAIU: null,
    vitaminCIU: null,
  },
} as const satisfies Dish;

const dishIds: string[] = [
  "1923_101628_M8095_1_16627",
  "1923_101628_M8321_1_32333",
  "1923_101628_M8170_1_36590",
  "1923_101628_L248459_1_482650",
  "1923_101628_M10094_1_19163",
  "1923_101628_M21942_1_5331",
  "1923_101628_M34422_1_35949",
  "1923_101628_M34462_1_32347",
  "1923_101628_M40406_1_35861",
  "1923_101628_M40447_1_33641",
  "1923_101628_M40482_1_33322",
  "1923_101628_M7941_1_36678",
] as const satisfies string[];

const user = {
  id: userId,
  name: "Peter",
  email: "panteater@uci.edu",
  emailVerified: false,
  image: "",
} as const satisfies InsertUser;

const rating = {
  dishId,
  userId,
  rating: 1,
  restaurant: "anteatery",
} as const satisfies InsertRating;

export const testData = {
  dish,
  dishIds,
  user,
  rating,
} as const;
