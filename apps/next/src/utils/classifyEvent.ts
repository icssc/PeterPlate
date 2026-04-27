// utils/classifyEvent.ts

export const EVENT_CATEGORIES = [
  "Cultural & Heritage",
  "Campus Life",
  "Dessert Spotlight",
  "Special Meal",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

const CULTURAL_KEYWORDS = [
  "heritage",
  "festival",
  "lunar",
  "diwali",
  "mardi gras",
  "st. patrick",
  "cinco de mayo",
  "friendsgiving",
  "k-pop",
  "pacific islander",
  "filipino",
  "lunar new year",
  "taste of hawaii",
  "celebration of",
  "festival of lights",
];

const CAMPUS_KEYWORDS = [
  "athletics",
  "rivalry",
  "senior night",
  "senior day",
  "finals",
  "study break",
  "dietitian",
  "wellness",
  "awareness",
  "uc irvine athletics",
  "collaboration with uc irvine",
  "spirit day",
  "mental health",
  "breast cancer",
  "fuel up",
  "back-to-school",
  "back to school",
  "game with",
  "quarterfinal",
  "battle of the chefs",
  "senior",
  "men's vb",
];

const DESSERT_MAIN_KEYWORDS = [
  "cookie",
  "brownie",
  "boba",
  "milkshake",
  "ice cream",
  "cupcake",
  "cream puff",
  "antzookie",
  "rice krispie",
  "tiramisu",
  "beignet",
  "cannoli",
  "chocoflan",
  "poptart",
  "chocolate-dipped",
  "dessert",
  "sweet treat",
  "fudgy",
  "creamy milk tea",
  "caramelized brown sugar",
];

// These indicate dessert is incidental, not the main event
const DESSERT_INCIDENTAL_PATTERNS = [
  /feast.*with/i,
  /menu.*includes/i,
  /and more/i,
  /topped with/i,
  /finish with/i,
  /sweet ending/i,
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

function isDessertMain(text: string): boolean {
  if (!matchesAny(text, DESSERT_MAIN_KEYWORDS)) return false;
  // If the description broadly describes a meal with dessert as a side, don't classify as dessert
  if (DESSERT_INCIDENTAL_PATTERNS.some((re) => re.test(text))) return false;
  // If there are many non-dessert food nouns alongside the dessert, it's likely a Special Meal
  const mealNouns = [
    "chicken",
    "rice",
    "steak",
    "pasta",
    "burger",
    "tacos",
    "bowl",
    "sandwich",
    "salad",
  ];
  const mealCount = mealNouns.filter((n) => text.includes(n)).length;
  if (mealCount >= 2) return false;
  return true;
}

export function classifyEvent(longDesc: string): EventCategory {
  console.log(`Description: ${longDesc}`);
  const text = normalize(longDesc);

  if (matchesAny(text, CULTURAL_KEYWORDS)) return "Cultural & Heritage";
  if (matchesAny(text, CAMPUS_KEYWORDS)) return "Campus Life";
  if (isDessertMain(text)) return "Dessert Spotlight";
  return "Special Meal";
}
