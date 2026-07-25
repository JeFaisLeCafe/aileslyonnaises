import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";
import { singletonDocumentActions, structure } from "./structure";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Définissez SANITY_STUDIO_PROJECT_ID et SANITY_STUDIO_DATASET (ou leurs équivalents PUBLIC_SANITY_*).",
  );
}

export default defineConfig({
  name: "ailes-lyonnaises",
  title: "Les Ailes Lyonnaises",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  document: { actions: singletonDocumentActions },
});
