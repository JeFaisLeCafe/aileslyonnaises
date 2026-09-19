import { z } from "zod";

import type {
  Aircraft,
  NewsArticle,
  Person,
  PriceGroup,
  SiteData,
  Story,
  TrainingProgram,
} from "./types";

const portableTextSpanSchema = z.object({
  _key: z.string(),
  _type: z.literal("span"),
  marks: z.array(z.string()).default([]),
  text: z.string(),
});

const portableTextBlockSchema = z.object({
  _key: z.string(),
  _type: z.literal("block"),
  children: z.array(portableTextSpanSchema),
  markDefs: z.array(z.record(z.string(), z.string())).default([]),
  style: z.enum(["normal", "h2", "h3", "blockquote"]).default("normal"),
});

const imageSchema = z.object({
  alt: z.string().min(3),
  url: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith("/") || URL.canParse(value),
      "URL d’image invalide",
    ),
});

const publicationSchema = z.object({
  enabled: z.boolean(),
  order: z.number().int().nonnegative(),
  publishedAt: z.iso.datetime({ offset: true }),
});

export const aircraftSchema = publicationSchema.extend({
  id: z.string(),
  name: z.string(),
  model: z.string(),
  registration: z.string(),
  summary: z.string(),
  details: z
    .array(portableTextBlockSchema)
    .nullish()
    .transform((value) => value ?? []),
  image: imageSchema.nullish().transform((value) => value ?? undefined),
  uses: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  features: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
});

export const personSchema = publicationSchema.extend({
  id: z.string(),
  name: z.string(),
  title: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  roles: z.array(
    z.enum([
      "instructor",
      "chiefInstructor",
      "president",
      "vicePresident",
      "treasurer",
      "secretary",
      "boardMember",
    ]),
  ),
  summary: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  biography: z
    .array(portableTextBlockSchema)
    .nullish()
    .transform((value) => value ?? []),
  image: imageSchema.nullish().transform((value) => value ?? undefined),
});

const priceItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z
    .number()
    .nonnegative()
    .nullish()
    .transform((value) => value ?? undefined),
  unit: z.enum(["fixed", "year", "hour"]),
  audience: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  note: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  enabled: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const priceGroupSchema = publicationSchema.extend({
  id: z.string(),
  title: z.string(),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  items: z.array(priceItemSchema),
  disclaimer: z.string(),
});

export const trainingProgramSchema = publicationSchema.extend({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  details: z
    .array(portableTextBlockSchema)
    .nullish()
    .transform((value) => value ?? []),
  minimumFlightHours: z
    .number()
    .nonnegative()
    .nullish()
    .transform((value) => value ?? undefined),
  prerequisites: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  availability: z.enum(["available", "planned"]),
});

export const storySchema = publicationSchema.extend({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  category: z.enum(["history", "clubLife", "trip", "elles"]),
  body: z.array(portableTextBlockSchema),
  image: imageSchema.nullish().transform((value) => value ?? undefined),
});

export const newsArticleSchema = publicationSchema.extend({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  body: z.array(portableTextBlockSchema),
  image: imageSchema.nullish().transform((value) => value ?? undefined),
});

export const siteDataSchema = z.object({
  clubName: z.string(),
  tagline: z.string(),
  address: z.object({
    street: z.string(),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string(),
  }),
  phone: z.string(),
  email: z.email(),
  locationLabel: z.string(),
});

interface PublicDocument {
  enabled: boolean;
  order: number;
  publishedAt: string;
}

export const isPublicDocument = (
  document: PublicDocument,
  now: Date = new Date(),
): boolean =>
  document.enabled && Date.parse(document.publishedAt) <= now.getTime();

const mapPublicCollection = <T extends PublicDocument>(
  input: unknown,
  schema: z.ZodType<T>,
  now: Date,
): T[] =>
  z
    .array(schema)
    .parse(input)
    .filter((document) => isPublicDocument(document, now))
    .sort((left, right) => left.order - right.order);

export const mapAircraft = (input: unknown, now = new Date()): Aircraft[] =>
  mapPublicCollection(input, aircraftSchema, now);

export const mapPeople = (input: unknown, now = new Date()): Person[] =>
  mapPublicCollection(input, personSchema, now);

export const mapPriceGroups = (
  input: unknown,
  now = new Date(),
): PriceGroup[] =>
  mapPublicCollection(input, priceGroupSchema, now).map((group) => ({
    ...group,
    items: group.items
      .filter(({ enabled }) => enabled)
      .sort((left, right) => left.order - right.order),
  }));

export const mapTrainingPrograms = (
  input: unknown,
  now = new Date(),
): TrainingProgram[] => mapPublicCollection(input, trainingProgramSchema, now);

export const mapStories = (input: unknown, now = new Date()): Story[] =>
  mapPublicCollection(input, storySchema, now);

export const mapNews = (input: unknown, now = new Date()): NewsArticle[] =>
  mapPublicCollection(input, newsArticleSchema, now).sort(
    (left, right) =>
      Date.parse(right.publishedAt) - Date.parse(left.publishedAt) ||
      left.order - right.order,
  );

export const mapSiteData = (input: unknown): SiteData =>
  siteDataSchema.parse(input);
