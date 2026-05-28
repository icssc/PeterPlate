import type { UserAllergy, UserDietaryPreference } from "@peterplate/db";
import type { DietaryRestrictions } from "@peterplate/validators";

type PreferenceKeys = `is${Capitalize<UserDietaryPreference>}`;
type AllergyKeys = `contains${Capitalize<UserAllergy>}`;

/**
 * Transforms camelCase keys into Title Case sentences.
 * Example: "treeNuts" -> "Tree Nuts", "glutenFree" -> "Gluten Free"
 */
export function formatDietaryKey(key: string): string {
  const result = key.replace(/([A-Z])/g, " $1");
  return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
}

/**
 * Returns true if there exists any conflicts between the dish's flags and the
 * user's prefs and allergies.
 */
export function getDietaryConflicts(
  dishFlags: DietaryRestrictions,
  userPrefs: (UserDietaryPreference | null)[],
  userAllergies: (UserAllergy | null)[],
) {
  const violations: string[] = [];

  for (const allergy of userAllergies) {
    if (!allergy) continue;
    const dishKey =
      `contains${allergy.charAt(0).toUpperCase()}${allergy.slice(1)}` as AllergyKeys;
    if (dishFlags[dishKey] === true)
      violations.push(`Contains ${formatDietaryKey(allergy)}`);
  }

  for (const pref of userPrefs) {
    if (!pref) continue;
    const dishKey =
      `is${pref.charAt(0).toUpperCase()}${pref.slice(1)}` as PreferenceKeys;
    if (dishFlags[dishKey] === false)
      violations.push(`Not ${formatDietaryKey(pref)}`);
  }

  return violations;
}
