import { logger } from "@api/logger";
import { upsert } from "@api/utils";
import type { RestEndpointMethodTypes } from "@octokit/rest";
import { Octokit } from "@octokit/rest";
import type { Drizzle } from "@peterplate/db";
import { contributors, type InsertContributor } from "@peterplate/db";

type ContributorsList =
  RestEndpointMethodTypes["repos"]["listContributors"]["response"]["data"];
/**
 * Query the GitHub API to obtain the contributors to PeterPlate's GH Repo.
 * @param db The Drizzle database instance to insert into.
 */
export async function contributorsJob(db: Drizzle) {
  const octokit = new Octokit();
  let page = 1;
  let hasNextPage = true;
  let baseContributors: ContributorsList = [];

  while (hasNextPage) {
    const { data } = await octokit.rest.repos.listContributors({
      owner: "icssc",
      repo: "PeterPlate",
      per_page: 100,
      page,
    });

    baseContributors = baseContributors.concat(data);
    hasNextPage = data.length === 100;
    page++;
  }

  // Filter out bots
  const filteredContributors = baseContributors.filter(
    (contributor) => contributor.type !== "Bot",
  );

  // Fetch detailed info for each contributor
  const detailedContributors = (
    await Promise.all(
      filteredContributors.map(
        async (contributor): Promise<InsertContributor | null> => {
          if (!contributor.login) return null;

          const { data: userDetails } = await octokit.rest.users.getByUsername({
            username: contributor.login,
          });

          return {
            login: contributor.login,
            avatar_url: contributor.avatar_url ?? "",
            contributions: contributor.contributions,
            name: userDetails.name ?? null,
            bio: userDetails.bio ?? null,
          };
        },
      ),
    )
  ).filter((c): c is InsertContributor => c !== null);

  logger.info(
    `[weekly] Upserting ${detailedContributors.length} contributors...`,
  );
  const upsertedContributors = await upsertContributors(
    db,
    detailedContributors,
  );
  logger.info(`[weekly] Upserted ${upsertedContributors.length} contributors.`);
}

export async function upsertContributors(
  db: Drizzle,
  contributorsArray: InsertContributor[],
) {
  const upsertContributorsResult = await Promise.allSettled(
    contributorsArray.map(async (contributor) =>
      upsert(db, contributors, contributor, {
        target: contributors.login,
        set: contributor,
      }),
    ),
  );

  upsertContributorsResult.forEach((result) => {
    if (result.status === "rejected")
      logger.error(result, "upsertContributors(): ");
  });

  return upsertContributorsResult;
}

export async function weekly(db: Drizzle): Promise<void> {
  const results = await Promise.allSettled([contributorsJob(db)]);

  results.forEach((result) => {
    if (result.status === "rejected") {
      logger.error(result.reason, "weekly() failed:");
    }
  });
}
