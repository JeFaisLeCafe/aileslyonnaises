import { z } from "zod";

import {
  aircraftSchema,
  newsArticleSchema,
  personSchema,
  priceGroupSchema,
  siteDataSchema,
  storySchema,
  trainingProgramSchema,
} from "../lib/cms/mappers";
import type {
  Aircraft,
  NewsArticle,
  Person,
  PriceGroup,
  SiteData,
  Story,
  TrainingProgram,
} from "../lib/cms/types";

import raw from "./cms-fallbacks.json";

const cmsFallbacksSchema = z.object({
  dumpedAt: z.string().optional(),
  source: z.string().optional(),
  aircraft: z.array(aircraftSchema),
  people: z.array(personSchema).default([]),
  priceGroups: z.array(priceGroupSchema),
  trainingPrograms: z.array(trainingProgramSchema),
  stories: z.array(storySchema),
  newsArticles: z.array(newsArticleSchema).default([]),
  siteData: siteDataSchema,
});

const snapshot = cmsFallbacksSchema.parse(raw);

export const fallbackAircraft: Aircraft[] = snapshot.aircraft;
export const fallbackPeople: Person[] = snapshot.people;
export const fallbackPriceGroups: PriceGroup[] = snapshot.priceGroups;
export const fallbackTrainingPrograms: TrainingProgram[] =
  snapshot.trainingPrograms;
export const fallbackStories: Story[] = snapshot.stories;
export const fallbackNews: NewsArticle[] = snapshot.newsArticles;
export const fallbackSiteData: SiteData = snapshot.siteData;
