#!/usr/bin/env node
/**
 * Uploads unique aircraft photos and instructor records into Sanity.
 *
 *   cd studio && npx sanity exec ../scripts/sync-sanity-content.mjs --with-user-token
 */

import { execFileSync } from "node:child_process";
import { createReadStream, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { getCliClient } from "sanity/cli";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zip =
  "/Users/pierre-etiennesoury/Downloads/GT refonte 2026-20260725T113033Z-1-001.zip";
const workDir = resolve(root, ".scratch/sanity-assets");
const publishedAt = "2026-07-25T00:00:00.000Z";
const client = getCliClient({ apiVersion: "2025-02-19" });

const aircraftPhotos = [
  {
    id: "aircraft-f-hsmb",
    registration: "F-HSMB",
    zipPath: "GT refonte 2026/Photos/B23/350A2480.jpeg",
    fileName: "f-hsmb.jpg",
    alt: "Bristell B23 F-HSMB des Ailes Lyonnaises sur le tarmac",
    publicWebp: "public/images/aircraft/bristell-b23.webp",
  },
  {
    id: "aircraft-f-hlyo",
    registration: "F-HLYO",
    zipPath: "GT refonte 2026/Photos/DR400 YO/350A2439.jpeg",
    fileName: "f-hlyo.jpg",
    alt: "Robin DR401 F-HLYO de profil sur le tarmac de Lyon-Bron",
    publicWebp: "public/images/aircraft/dr401-hlyo.webp",
  },
  {
    id: "aircraft-f-gxge",
    registration: "F-GXGE",
    zipPath: "GT refonte 2026/Photos/DR400 GE/350A2431.jpeg",
    fileName: "f-gxge.jpg",
    alt: "Robin DR400 F-GXGE des Ailes Lyonnaises",
    publicWebp: "public/images/aircraft/dr400-gxge.webp",
  },
  {
    id: "aircraft-f-gjqt",
    registration: "F-GJQT",
    zipPath: "GT refonte 2026/Photos/DR400 QT/350A2457.jpeg",
    fileName: "f-gjqt.jpg",
    alt: "Robin DR400 F-GJQT des Ailes Lyonnaises",
    publicWebp: "public/images/aircraft/dr400-gjqt.webp",
  },
  {
    id: "aircraft-f-gypg",
    registration: "F-GYPG",
    zipPath: "GT refonte 2026/Photos/DR400 GE/350A2430.jpeg",
    fileName: "f-gypg.jpg",
    alt: "Robin DR400 F-GYPG des Ailes Lyonnaises",
    publicWebp: "public/images/aircraft/dr400-gypg.webp",
    note: "No GYPG-labeled folder in archive; verify this GE frame in Studio.",
  },
];

const instructors = [
  {
    _id: "person-fabien-cochard",
    _type: "person",
    name: "Fabien Cochard",
    title: "Chef instructeur",
    roles: ["chiefInstructor", "instructor"],
    summary:
      "Chef instructeur de l’école de pilotage. Il coordonne le parcours pédagogique et accompagne les élèves du premier vol au test.",
    biography: [
      {
        _type: "block",
        _key: "fabien-bio",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "fabien-bio-span",
            marks: [],
            text: "Portrait et biographie détaillée à compléter avec l’accord de l’intéressé.",
          },
        ],
      },
    ],
    enabled: true,
    order: 10,
    publishedAt,
  },
  {
    _id: "person-antoine-guerra",
    _type: "person",
    name: "Antoine Guerra",
    title: "FI",
    roles: ["instructor"],
    summary:
      "Instructeur de vol (FI). Il forme les élèves sur le parcours pratique, du circuit d’aérodrome aux navigations.",
    biography: [
      {
        _type: "block",
        _key: "antoine-bio",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "antoine-bio-span",
            marks: [],
            text: "Portrait et biographie détaillée à compléter avec l’accord de l’intéressé.",
          },
        ],
      },
    ],
    enabled: true,
    order: 20,
    publishedAt,
  },
];

mkdirSync(workDir, { recursive: true });

for (const photo of aircraftPhotos) {
  const localJpg = resolve(workDir, photo.fileName);
  execFileSync(
    "sh",
    [
      "-c",
      `unzip -p "$1" "$2" > "$3"`,
      "extract",
      zip,
      photo.zipPath,
      localJpg,
    ],
    { stdio: "inherit" },
  );

  const publicPath = resolve(root, photo.publicWebp);
  mkdirSync(dirname(publicPath), { recursive: true });
  await sharp(localJpg)
    .resize({ width: 2200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(publicPath);

  const asset = await client.assets.upload(
    "image",
    createReadStream(localJpg),
    {
      filename: photo.fileName,
      contentType: "image/jpeg",
    },
  );

  await client
    .patch(photo.id)
    .set({
      image: {
        _type: "accessibleImage",
        alt: photo.alt,
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log(
    `Linked ${photo.registration} → ${asset._id}${photo.note ? ` (${photo.note})` : ""}`,
  );
}

for (const person of instructors) {
  await client.createOrReplace(person);
  console.log(`Upserted ${person.name}`);
}

console.log("Done.");
