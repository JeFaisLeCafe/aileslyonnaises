#!/usr/bin/env node
/**
 * Publishes launch news and Les Elles Lyonnaises stories into Sanity.
 *
 *   npm exec --prefix studio -- sanity exec ../scripts/seed-launch-content.mjs --with-user-token
 */

import { createReadStream, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { getCliClient } from "sanity/cli";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fallbacks = JSON.parse(
  readFileSync(resolve(root, "src/data/cms-fallbacks.json"), "utf8"),
);
const client = getCliClient({ apiVersion: "2025-02-19" });
const publishedAt = "2026-09-01T00:00:00.000Z";

const imageFiles = {
  "marie-marvingt": "public/images/stories/marie-marvingt.webp",
  "elisabeth-boselli": "public/images/stories/elisabeth-boselli.webp",
  "reine-givord": "public/images/stories/reine-givord.webp",
};

const uploadImage = async (slug, alt) => {
  const relative = imageFiles[slug];
  if (!relative) return undefined;
  const asset = await client.assets.upload(
    "image",
    createReadStream(resolve(root, relative)),
    { filename: `${slug}.webp`, contentType: "image/webp" },
  );
  return {
    _type: "accessibleImage",
    alt,
    asset: { _type: "reference", _ref: asset._id },
  };
};

const toSanityBlocks = (blocks) =>
  blocks.map((block) => ({
    ...block,
    _type: "block",
  }));

for (const story of fallbacks.stories.filter(
  (item) => item.category === "elles",
)) {
  const image = await uploadImage(story.slug, story.image?.alt ?? story.title);
  await client.createOrReplace({
    _id: story.id,
    _type: "story",
    title: story.title,
    slug: { _type: "slug", current: story.slug },
    excerpt: story.excerpt,
    category: story.category,
    body: toSanityBlocks(story.body),
    ...(image ? { image } : {}),
    enabled: true,
    order: story.order,
    publishedAt,
  });
  console.log(`Upserted story ${story.slug}`);
}

for (const article of fallbacks.newsArticles) {
  await client.createOrReplace({
    _id: article.id,
    _type: "newsArticle",
    title: article.title,
    slug: { _type: "slug", current: article.slug },
    excerpt: article.excerpt,
    body: toSanityBlocks(article.body),
    enabled: true,
    order: article.order,
    publishedAt: article.publishedAt,
  });
  console.log(`Upserted news ${article.slug}`);
}

console.log("Launch content seeded.");
