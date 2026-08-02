#!/usr/bin/env node
/**
 * Builds NDJSON seed documents from CMS fallbacks and imports them into Sanity.
 *
 * Usage:
 *   node scripts/seed-sanity.mjs              # write studio/seed/production.ndjson
 *   node scripts/seed-sanity.mjs --import     # also import (needs login or SANITY_API_WRITE_TOKEN)
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  fallbackAircraft,
  fallbackPriceGroups,
  fallbackSiteData,
  fallbackStories,
  fallbackTrainingPrograms,
} from "../src/data/cmsFallbacks.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "studio/seed/production.ndjson");
const shouldImport = process.argv.includes("--import");

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  "v6vpuuua";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.PUBLIC_SANITY_DATASET ??
  "production";

const asPortableText = (blocks) =>
  blocks.map((block) => ({
    _type: "block",
    _key: block._key,
    style: block.style ?? "normal",
    markDefs: block.markDefs ?? [],
    children: block.children.map((child) => ({
      _type: "span",
      _key: child._key,
      marks: child.marks ?? [],
      text: child.text,
    })),
  }));

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    ...fallbackSiteData,
    enabled: true,
    publishedAt: "2026-07-25T00:00:00.000Z",
  },
  ...fallbackAircraft.map((aircraft) => ({
    _id: `aircraft-${aircraft.registration.toLowerCase()}`,
    _type: "aircraft",
    name: aircraft.name,
    model: aircraft.model,
    registration: aircraft.registration,
    summary: aircraft.summary,
    details: asPortableText(aircraft.details),
    uses: aircraft.uses,
    features: aircraft.features,
    enabled: aircraft.enabled,
    order: aircraft.order,
    publishedAt: aircraft.publishedAt,
  })),
  ...fallbackPriceGroups.map((group) => ({
    _id: group.id.replace(/^fallback-/, "priceGroup-"),
    _type: "priceGroup",
    title: group.title,
    description: group.description,
    items: group.items.map((item) => ({
      _type: "priceItem",
      _key: item.id,
      label: item.label,
      amount: item.amount,
      unit: item.unit,
      ...(item.audience ? { audience: item.audience } : {}),
      ...(item.note ? { note: item.note } : {}),
      enabled: item.enabled,
      order: item.order,
    })),
    disclaimer: group.disclaimer,
    enabled: group.enabled,
    order: group.order,
    publishedAt: group.publishedAt,
  })),
  ...fallbackTrainingPrograms.map((program) => ({
    _id: `trainingProgram-${program.slug}`,
    _type: "trainingProgram",
    title: program.title,
    slug: { _type: "slug", current: program.slug },
    summary: program.summary,
    details: asPortableText(program.details),
    ...(program.minimumFlightHours !== undefined
      ? { minimumFlightHours: program.minimumFlightHours }
      : {}),
    prerequisites: program.prerequisites,
    availability: program.availability,
    enabled: program.enabled,
    order: program.order,
    publishedAt: program.publishedAt,
  })),
  ...fallbackStories.map((story) => ({
    _id: `story-${story.slug}`,
    _type: "story",
    title: story.title,
    slug: { _type: "slug", current: story.slug },
    excerpt: story.excerpt,
    category: story.category,
    body: asPortableText(story.body),
    enabled: story.enabled,
    order: story.order,
    publishedAt: story.publishedAt,
  })),
];

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`,
);

console.log(
  `Wrote ${String(documents.length)} documents to ${outFile.replace(`${root}/`, "")}`,
);

if (!shouldImport) {
  console.log("Run with --import after Sanity login or with SANITY_API_WRITE_TOKEN set.");
  process.exit(0);
}

const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_IMPORT_TOKEN;
const args = [
  "sanity",
  "dataset",
  "import",
  outFile,
  "--dataset",
  dataset,
  "--project-id",
  projectId,
  "--replace",
];

if (token) {
  args.push("--token", token);
}

const result = spawnSync("npx", args, {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
