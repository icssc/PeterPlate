import {
  contributors,
  type Drizzle,
  type SelectContributor,
} from "@peterplate/db";

/**
 * Gets all rows from the contributors table. Fetches all of the contributors
 * that have been pulled from the weekly job. Sorts by contributions, with
 * username as a backup.
 */
export async function getContributors(
  db: Drizzle,
): Promise<SelectContributor[]> {
  return (await db.select().from(contributors)).sort((a, b) => {
    if (a.contributions > b.contributions) return -1;
    else if (a.contributions < b.contributions) return 1;
    else if (a.login < b.login) return -1;

    return 1;
  });
}
