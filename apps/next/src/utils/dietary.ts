export const ALLERGY_MAP = {
  Egg: "containsEggs",
  Fish: "containsFish",
  Milk: "containsMilk",
  Peanuts: "containsPeanuts",
  Sesame: "containsSesame",
  Shellfish: "containsShellfish",
  Soy: "containsSoy",
  "Tree Nuts": "containsTreeNuts",
  Wheat: "containsWheat",
} as const;

export type AllergyName = keyof typeof ALLERGY_MAP;

export const PREFERENCE_MAP = {
  "Gluten Free": "isGlutenFree",
  Halal: "isHalal",
  Kosher: "isKosher",
  "Locally Grown": "isLocallyGrown",
  Organic: "isOrganic",
  Vegan: "isVegan",
  Vegetarian: "isVegetarian",
} as const;

export type PreferenceName = keyof typeof PREFERENCE_MAP;
