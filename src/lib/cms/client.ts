import { createClient, type SanityClient } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = import.meta.env.PUBLIC_SANITY_DATASET?.trim();
const token = import.meta.env.SANITY_API_READ_TOKEN?.trim();
const previewDrafts =
  import.meta.env.SANITY_PREVIEW_DRAFTS === "true" && Boolean(token);

const isValidProjectId = (value: string | undefined): value is string =>
  Boolean(value && /^[a-z0-9-]+$/.test(value));

const isValidDataset = (value: string | undefined): value is string =>
  Boolean(value && /^[a-z0-9_-]+$/.test(value));

export const sanityClient: SanityClient | null =
  isValidProjectId(projectId) && isValidDataset(dataset)
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2025-02-19",
        ...(previewDrafts && token ? { token } : {}),
        useCdn: !previewDrafts,
        perspective: previewDrafts ? "drafts" : "published",
      })
    : null;

export const isSanityConfigured = sanityClient !== null;
