import { upsertEvents } from "@api/events/services";
import { logger } from "@api/logger";

import type { Drizzle } from "@zotmeal/db";

import { Octokit } from "@octokit/rest";
import { upsert } from "@api/utils";
import { contributors, InsertContributor } from "@zotmeal/db";
import { getAEMEvents } from "../daily/parse";
import { upsertMenusForWeek } from "./upsert";
import { queryEventImageEndpoint } from "@api/events/images";

/**
 * Query the GraphQL Events Endpoint for both restaurants and upsert them into 
 * the database.
 * @param db The Drizzle database instance to insert into.
 */
export async function eventJob(db: Drizzle): Promise<void> {
  try {
    const [brandywineEvents, anteateryEvents] = await Promise.all([
      getAEMEvents("Brandywine"),
      getAEMEvents("The Anteatery"),
    ]);

    const allEvents = [...brandywineEvents, ...anteateryEvents];
    const eventImages = await queryEventImageEndpoint();

    logger.info(`[weekly] Found images for events ${Array.from(eventImages.keys())}`)
    for (const event of allEvents) {
      const imageURL = eventImages.get(event.title);
      if (imageURL)
        event.image = imageURL;
      else
        logger.info(`[weekly] Could not find image for event ${event.title}.`)
    }

    logger.info(`[weekly] Upserting ${allEvents.length} events...`);
    const upsertedEvents = await upsertEvents(db, allEvents);
    logger.info(`[weekly] Upserted ${upsertedEvents.length} events.`);
  } catch (error) {
    logger.error(error, "[weekly] eventJob(): Failed to fetch or upsert events.");
  }
}


export async function weeklyJob(db: Drizzle): Promise<void> {
  const today = new Date();


  logger.info(`[weekly] Starting Brandywine Menu job...`)
  await upsertMenusForWeek(db, today, "brandywine");
  logger.info(`[weekly] Finished Brandywine Menu job.`)
  logger.info(`[weekly] Starting Anteatery Menu job...`)
  await upsertMenusForWeek(db, today, "anteatery");
  logger.info(`[weekly] Finished Anteatery Menu job.`)
}


/**
 * Query the GitHub API to obtain the contributors to ZotMeal's GH Repo.
 * @param db The Drizzle database instance to insert into.
 */
export async function contributorsJob(db: Drizzle) {
  const octokit = new Octokit();
  let page = 1;
  let hasNextPage = true;
  let baseContributors: any[] = [];

  while (hasNextPage) {
    const { data } = await octokit.rest.repos.listContributors({
      owner: "icssc",
      repo: "ZotMeal",
      per_page: 100,
      page,
    });

    baseContributors = baseContributors.concat(data);
    hasNextPage = data.length === 100;
    page++;
  }

  // Filter out bots 
  const filteredContributors = baseContributors.filter(
    (contributor) =>
      contributor.type !== "Bot"
  );

  // Fetch detailed info for each contributor
  let detailedContributors: InsertContributor[] = await Promise.all(
    filteredContributors.map(async (contributor) => {
      const { data: userDetails } = await octokit.rest.users.getByUsername({
        username: contributor.login,
      });
      return {
        ...contributor,
        name: userDetails.name,
        bio: userDetails.bio,
      };
    })
  );

  logger.info(`[weekly] Upserting ${detailedContributors.length} contributors...`)
  const upsertedContributors = await upsertContributors(db, detailedContributors);
  logger.info(`[weekly] Upserted ${upsertedContributors.length} contributors.`)
}


export async function upsertContributors(
  db: Drizzle,
  contributorsArray : InsertContributor[]
) {
  const upsertContributorsResult = await Promise.allSettled(
    contributorsArray.map(
      async (contributor) =>
        upsert(db, contributors, contributor, {
          target: contributors.login,
          set: contributor
        })
    )
  )

  upsertContributorsResult.forEach((result) => {
    if (result.status === "rejected")
      logger.error(result, "upsertContributors(): ");
  });

  return upsertContributorsResult;
}

export async function weekly(db: Drizzle): Promise<void> {
  await eventJob(db);
  await contributorsJob(db);
  await weeklyJob(db);
}