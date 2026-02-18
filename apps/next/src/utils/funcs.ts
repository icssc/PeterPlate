import { Restaurant } from "@mui/icons-material";
import {
  foodIconKeywords,
  foodIcons,
  HallEnum,
  numToMonth,
  preferredCategoryOrder,
} from "./types";

const BWINE_ADDY: string = "557+E+Peltason Dr%2C+Irvine%2C+CA%2C+92617";
const ANTEAT_ADDY: string = "4001+Mesa+Rd%2C+Irvine%2C+CA%2C+92617";

/**
 * Converts a string to title case (e.g., "hello world" -> "Hello World").
 * @param str The string to convert.
 * @returns The title-cased string.
 */
function toTitleCase(str: string): string {
  if (!str) return ""; // Return empty string if undefined/null
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

// Internal keyword lists for enhanceDescription function.
const fruitKeywords = [
  "strawberry",
  "strawberries",
  "banana",
  "apple",
  "orange",
  "grapes",
  "melon",
  "berries",
  "cantaloupe",
  "pineapple",
  "peach",
  "pear",
];
const preparedFruitKeywords = ["cubed", "sliced", "diced fruit", "medley"];
const healthyKeywords = [
  "oats",
  "chia",
  "yogurt",
  "quinoa",
  "salad",
  "vegetable",
  "tofu",
  "bean",
  "lentil",
  "oatmeal",
  "cream of wheat",
  "kale",
  "farro",
];
const comfortingKeywords = [
  "soup",
  "stew",
  "pasta",
  "rice bowl",
  "mashed potatoes",
  "casserole",
  "curry",
  "chicken",
  "bacon",
  "sausage",
  "egg roll",
  "burger",
];
const bakeryKeywords = [
  "muffin",
  "croissant",
  "scone",
  "bagel",
  "bread",
  "fries",
  "pizza",
  "cake",
  "cookie",
  "pastry",
];
const toppingKeywords = [
  "lettuce",
  "carrots",
  "croutons",
  "spinach",
  "bell peppers",
  "cucumbers",
  "beans",
  "tomato",
  "cheese",
  "onion",
  "pickle",
  "olive",
  "mushroom",
];

/**
 * Enhances a dish description with more engaging text based on keywords.
 * If the provided description is empty, it defaults to the dish name.
 * @param dish The name of the dish.
 * @param description The original description of the dish (can be null or undefined).
 * @returns An enhanced description string.
 */
function enhanceDescription(
  dish: string,
  description: string | null | undefined,
): string {
  if (!description || description.trim() === "") {
    description = dish;
  }

  let lowerDesc = description.toLowerCase();
  const lowerDish = dish.toLowerCase();

  if (
    fruitKeywords.some(
      (keyword) => lowerDesc === keyword || lowerDesc === `${keyword}s`,
    )
  ) {
    return `Fresh and simple ${lowerDesc}. A light and healthy choice.`;
  }

  if (
    preparedFruitKeywords.some((keyword) => lowerDesc.includes(keyword)) &&
    fruitKeywords.some((keyword) => lowerDesc.includes(keyword))
  ) {
    return `Refreshing ${lowerDesc}. Perfect for a quick energy boost.`;
  }

  if (bakeryKeywords.some((keyword) => lowerDish.includes(keyword))) {
    const addPrefix: boolean = !lowerDesc.includes("freshly baked");
    if (addPrefix) lowerDesc = `Freshly prepared ${lowerDesc}`;
    else lowerDesc = `${lowerDesc[0].toUpperCase()}${lowerDesc.slice(1)}`;

    return `${lowerDesc}. A perfect treat.`;
  }

  if (comfortingKeywords.some((keyword) => lowerDish.includes(keyword))) {
    return `Warm and comforting ${lowerDesc}. A satisfying classic.`;
  }

  if (healthyKeywords.some((keyword) => lowerDish.includes(keyword))) {
    return `A nutritious choice: ${lowerDesc}. Packed with wholesome ingredients.`;
  }

  if (toppingKeywords.some((keyword) => lowerDish.includes(keyword))) {
    return `Enjoy ${lowerDesc} as a tasty topping or by itself.`;
  }

  if (description.length < 40) {
    return `Enjoy this classic dish: ${lowerDesc}.`;
  }

  // Return original if no rules match or it's already reasonably descriptive
  return description.endsWith(".") ? description : `${description}.`;
}

/**
 * Appends the correct ordinal suffix to a day number (e.g., 1 -> "1st", 2 -> "2nd").
 * @param day The day of the month (1-31).
 * @returns The day number with its ordinal suffix.
 */
function getDayWithSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}th`; // for 4th to 20th
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/**
 * Formats a date range into a string like "Jan. 1st, 10:00am-2:00pm".
 * @param startDate The start date and time.
 * @param endDate The end date and time.
 * @returns A formatted string representing the date and time range.
 */
function dateToString(startDate: Date, endDate: Date): string {
  const dayWithSuffix = getDayWithSuffix(startDate.getDate());
  return `${numToMonth[startDate.getMonth()]} ${dayWithSuffix}, ${timeToString(startDate)}-${timeToString(endDate)}`;
}

/**
 * Pads a number with a leading zero if it's less than 10.
 * Used for formatting minutes.
 * @param minutes The number of minutes.
 * @returns A string representation of the minutes, padded with a zero if needed.
 */
function padMinutes(minutes: number): string {
  let str: string = `${minutes}`;
  while (str.length < 2) str = `0${str}`;
  return str;
}

/**
 * Converts a Date object to a time string in "h:mma" or "h:mmam" format (e.g., "10:00am", "1:30pm").
 * @param date The Date object.
 * @returns A formatted time string.
 */
function timeToString(date: Date): string {
  const hours: number = date.getHours();
  const isAfterNoon: boolean = hours > 12;

  return `${isAfterNoon ? hours - 12 : hours}:${padMinutes(date.getMinutes())}${isAfterNoon ? "pm" : "am"} `;
}

/**
 * Generates a Google Calendar event link.
 * @param title The title of the event (usually the dish name).
 * @param desc The description for the event.
 * @param location The dining hall location (Anteatery or Brandywine).
 * @param time The date and time of the event.
 * @returns A URL string for creating a Google Calendar event.
 */
function generateGCalLink(
  title: string,
  desc: string,
  location: HallEnum,
  time: Date,
): string {
  const date: string = `${time.getFullYear()}${(time.getUTCMonth() + 1).toString().padStart(2, "0")}${time.getUTCDate().toString().padStart(2, "0")}T${time.getUTCHours().toString().padStart(2, "0")}${time.getUTCMinutes().toString().padStart(2, "0")}${time.getUTCSeconds().toString().padStart(2, "0")} Z`;

  const link: string =
    `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=${location === HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}:+${title.replace(/\s+/g, "+")}` +
    `&details=${desc.replace(/\s+/g, "+")}` +
    `&location=${location === HallEnum.ANTEATERY ? ANTEAT_ADDY : BWINE_ADDY}` +
    `&dates=${date}/${date}`;

  return link;
}

/**
 * Converts a UTC time string (HH:MM:SS) to a Date object in Pacific Time.
 * The date part of the returned Date object will be the current date.
 * @param utcTimeString The UTC time string in "HH:MM:SS" format.
 * @returns A Date object representing the converted time in America/Los_Angeles timezone.
 */
function utcToPacificTime(utcTimeString: string): Date {
  const [hours, minutes, seconds] = utcTimeString.split(":").map(Number);
  const utcDate = new Date();
  utcDate.setUTCHours(hours);
  utcDate.setUTCMinutes(minutes);
  utcDate.setUTCSeconds(seconds);
  utcDate.setMilliseconds(0);

  const pacificDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  );

  return pacificDate;
}

/**
 * Converts a military time string (HH:MM:SS)
 * in 24-hr clock format to a Date object in Pacific Time.
 * The date part of the returned Date object will be the current date.
 * @param militaryTime The 24-hr time string in "HH:MM:SS" format.
 * @returns A Date object representing the converted time in America/Los_Angeles timezone.
 */
function militaryToStandard(militaryTime: string): Date {
  const [hrs, mins, secs] = militaryTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hrs, mins, secs, 0);
  return date;
}

/**
 * Formats a time range from two Date objects into a string like "10:00am-2:30pm".
 * @param openTime The start time.
 * @param closeTime The end time.
 * @returns A formatted string representing the time range.
 */
function formatOpenCloseTime(openTime: Date, closeTime: Date): string {
  const openTimeIsAfternoon: boolean = openTime.getHours() > 12;
  const closeTimeIsAfternoon: boolean = closeTime.getHours() > 12;

  const openTimeHours: number = openTimeIsAfternoon
    ? openTime.getHours() - 12
    : openTime.getHours();
  const closeTimeHours: number = closeTimeIsAfternoon
    ? closeTime.getHours() - 12
    : closeTime.getHours();
  const openTimeMinutes: string = padMinutes(openTime.getMinutes());
  const closeTimeMinutes: string = padMinutes(closeTime.getMinutes());

  return `${openTimeHours}:${openTimeMinutes}${openTimeIsAfternoon ? "pm" : "am"}-${closeTimeHours}:${closeTimeMinutes}${closeTimeIsAfternoon ? "pm" : "am"}`;
}

/**
 * Formats a nutrient key (e.g., "totalFatG", "vitaminAIU") into a human-readable label (e.g., "Total Fat", "Vitamin A").
 * @param nutrient The nutrient key string.
 * @returns A formatted, human-readable nutrient label.
 */
const formatNutrientLabel = (nutrient: string) => {
  const label = nutrient.replace(/(Mg|G)$/, "");
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

/**
 * Formats a nutrient value by rounding decimal places
 * or returning "< #" for applicable nutrient fields
 * @param field The nutrient key string.
 * @param valueRaw The nutrient value as a string.
 * @returns A formatted nutrient value.
 */
const formatNutrientValue = (field: string, valueRaw: string | Date | null) => {
  if (valueRaw == null || valueRaw instanceof Date) return valueRaw;
  const value = parseFloat(valueRaw);

  switch (field) {
    case "calories":
      return Math.round(value);

    case "totalFatG":
    case "saturatedFatG":
    case "transFatG":
    case "totalCarbsG":
    case "sugarsG":
    case "dietaryFiberG":
      return value < 0.5 ? "<0.5" : value.toFixed(1);

    case "proteinG":
      return value < 1 ? "<1" : value.toFixed(1);

    case "sodiumMg":
    case "cholesterolMg":
      return value < 5 ? "<5" : Math.round(value);

    case "vitaminAIU":
    case "vitaminCIU":
      return Math.round(value);

    case "calciumMg":
    case "ironMg":
      return value < 0.1 ? "<0.1" : value.toFixed(1);

    default:
      return valueRaw;
  }
};

/**
 * Formats a food name for display.
 * This includes converting to title case, handling hyphens, apostrophes,
 * and specific abbreviations like "Ozw" to "Oz".
 * @param name The raw food name string.
 * @returns A formatted food name string.
 */
const formatFoodName = (name: string): string => {
  if (!name) return "";

  let formattedName = name.replace(/(®)([a-zA-Z])/g, "$1 $2");
  formattedName = toTitleCase(formattedName);
  formattedName = formattedName.replace(
    /-(\w)/g,
    (_match, char) => `-${char.toUpperCase()}`,
  );
  formattedName = formattedName.replace(/'(\w)/g, (match, char) => {
    if (char.toLowerCase() === "s") return match;
    return `'${char.toUpperCase()}`;
  });
  formattedName = formattedName.replace(/Ozw/g, "Oz");
  formattedName = formattedName.replace(/\(\s+/g, "(");
  formattedName = formattedName.replace(/\s+\)/g, ")");

  return formattedName;
};

/**
 * Sorts an array of category keys based on a predefined preferred order.
 * Categories not in the preferred order are sorted alphabetically at the end.
 * @param keys An array of category name strings.
 * @returns A new array with category keys sorted according to the preferred order and then alphabetically.
 */
function sortCategoryKeys(keys: string[]): string[] {
  return keys.sort((a, b) => {
    const aLower = a.toLowerCase().trim();
    const bLower = b.toLowerCase().trim();

    const aIdx = preferredCategoryOrder.indexOf(aLower);
    const bIdx = preferredCategoryOrder.indexOf(bLower);

    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return aIdx;
    if (bIdx !== -1) return bIdx;

    // If neither in order, use alphabetic order
    return aLower.localeCompare(bLower);
  });
}

/**
 * Returns a Lucide food icon component based on the dish name.
 * It iterates through predefined keyword sets to find the most appropriate icon.
 * The order of `foodIconKeywords` in `types.ts` is important for specificity.
 * @param dishName The name of the dish.
 * @returns A LucideIconComponent (e.g., Soup, Pizza) or a default icon component (Utensils).
 */
function getFoodIcon(dishName: string) {
  const defaultFoodIcon = Restaurant;

  if (!dishName || dishName.trim() === "") {
    return defaultFoodIcon;
  }

  const lowerDish = dishName.toLowerCase();

  for (let i = 0; i < foodIconKeywords.length; ++i)
    for (const keyword of foodIconKeywords[i])
      if (lowerDish.includes(keyword)) return foodIcons[i];

  return defaultFoodIcon;
}

/**
 *  Returns whether or not a and b fall on the same calendar day.
 * @param a a date to compare
 * @param b the other date to compare
 * @returns a boolean
 */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export {
  toTitleCase,
  dateToString,
  generateGCalLink,
  timeToString,
  enhanceDescription,
  utcToPacificTime,
  militaryToStandard,
  formatOpenCloseTime,
  formatNutrientLabel,
  formatNutrientValue,
  formatFoodName,
  sortCategoryKeys,
  getFoodIcon,
  isSameDay,
};
