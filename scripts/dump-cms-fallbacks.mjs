#!/usr/bin/env node
/**
 * Dumps live Sanity content into src/data/cms-fallbacks.json (domain shape).
 *
 * Usage:
 *   npm run cms:dump-fallbacks
 *
 * Needs PUBLIC_SANITY_PROJECT_ID + PUBLIC_SANITY_DATASET (optional
 * SANITY_API_READ_TOKEN). Loads .env from the repo root when present.
 */

import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  mapAircraft,
  mapNews,
  mapPeople,
  mapPriceGroups,
  mapSiteData,
  mapStories,
  mapTrainingPrograms,
} from "../src/lib/cms/mappers.ts";
import {
  aircraftQuery,
  newsQuery,
  peopleQuery,
  priceGroupsQuery,
  siteDataQuery,
  storiesQuery,
  trainingProgramsQuery,
} from "../src/lib/cms/queries.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/data/cms-fallbacks.json");

const loadDotEnv = () => {
  try {
    const text = readFileSync(resolve(root, ".env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator <= 0) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional when variables are already exported.
  }
};

loadDotEnv();

const projectId =
  process.env.PUBLIC_SANITY_PROJECT_ID?.trim() ||
  process.env.SANITY_STUDIO_PROJECT_ID?.trim();
const dataset =
  process.env.PUBLIC_SANITY_DATASET?.trim() ||
  process.env.SANITY_STUDIO_DATASET?.trim() ||
  "production";
const token = process.env.SANITY_API_READ_TOKEN?.trim();

if (!projectId) {
  console.error(
    "Missing PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "published",
  ...(token ? { token } : {}),
});

const now = new Date();

const [
  aircraftRaw,
  peopleRaw,
  priceGroupsRaw,
  trainingProgramsRaw,
  storiesRaw,
  newsRaw,
  siteDataRaw,
] = await Promise.all([
  client.fetch(aircraftQuery),
  client.fetch(peopleQuery),
  client.fetch(priceGroupsQuery),
  client.fetch(trainingProgramsQuery),
  client.fetch(storiesQuery),
  client.fetch(newsQuery),
  client.fetch(siteDataQuery),
]);

if (!siteDataRaw) {
  console.error("Sanity returned no published siteSettings document.");
  process.exit(1);
}

const snapshot = {
  dumpedAt: now.toISOString(),
  source: `sanity:${projectId}/${dataset}`,
  aircraft: mapAircraft(aircraftRaw, now),
  people: mapPeople(peopleRaw, now),
  priceGroups: mapPriceGroups(priceGroupsRaw, now),
  trainingPrograms: mapTrainingPrograms(trainingProgramsRaw, now),
  stories: mapStories(storiesRaw, now),
  newsArticles: mapNews(newsRaw, now),
  siteData: mapSiteData(siteDataRaw),
};

writeFileSync(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(
  `Wrote fallbacks from ${snapshot.source} → ${outFile.replace(`${root}/`, "")}`,
);
console.log(
  [
    `${String(snapshot.aircraft.length)} aircraft`,
    `${String(snapshot.people.length)} people`,
    `${String(snapshot.priceGroups.length)} price groups`,
    `${String(snapshot.trainingPrograms.length)} training programs`,
    `${String(snapshot.stories.length)} stories`,
    `${String(snapshot.newsArticles.length)} news`,
  ].join(", "),
);
