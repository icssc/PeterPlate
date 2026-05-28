import type { DietaryRestrictions } from "@peterplate/validators";
import { useMemo } from "react";
import { useUserStore } from "@/context/useUserStore";
import { getDietaryConflicts } from "@/utils/dietary";
import { trpc } from "@/utils/trpc";

/**
 * Determines whether a dish with `dishFlags` violates the user's preferences.
 * @returns A list of violation strings.
 * */
export function useDietaryConflicts(
  dishFlags: DietaryRestrictions | undefined,
): string[] {
  const userId = useUserStore((s) => s.userId);

  const { data: preferences } = trpc.preference.getDietaryPreferences.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId, staleTime: Infinity },
  );

  const { data: allergies } = trpc.allergy.getAllergies.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId, staleTime: Infinity },
  );

  return useMemo(() => {
    if (!preferences || !allergies || !dishFlags) {
      return [];
    }

    return getDietaryConflicts(dishFlags, preferences, allergies);
  }, [preferences, allergies, dishFlags]);
}
