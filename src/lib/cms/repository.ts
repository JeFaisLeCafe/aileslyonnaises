import {
  fallbackAircraft,
  fallbackNews,
  fallbackPeople,
  fallbackPriceGroups,
  fallbackSiteData,
  fallbackStories,
  fallbackTrainingPrograms,
} from "../../data/cmsFallbacks";

import { sanityClient } from "./client";
import {
  mapAircraft,
  mapNews,
  mapPeople,
  mapPriceGroups,
  mapSiteData,
  mapStories,
  mapTrainingPrograms,
} from "./mappers";
import {
  aircraftQuery,
  newsQuery,
  peopleQuery,
  priceGroupsQuery,
  siteDataQuery,
  storiesQuery,
  trainingProgramsQuery,
} from "./queries";
import type {
  Aircraft,
  NewsArticle,
  Person,
  PriceGroup,
  SiteData,
  Story,
  TrainingProgram,
} from "./types";

type Mapper<T> = (input: unknown) => T;

const fetchOrFallback = async <T>(
  query: string,
  mapper: Mapper<T>,
  fallback: T,
): Promise<T> => {
  if (!sanityClient) {
    return fallback;
  }

  try {
    const response = await sanityClient.fetch<unknown>(query);
    return mapper(response);
  } catch {
    return fallback;
  }
};

export const getAircraft = (): Promise<Aircraft[]> =>
  fetchOrFallback(aircraftQuery, mapAircraft, fallbackAircraft);

export const getPeople = (): Promise<Person[]> =>
  fetchOrFallback(peopleQuery, mapPeople, fallbackPeople);

export const getPriceGroups = (): Promise<PriceGroup[]> =>
  fetchOrFallback(priceGroupsQuery, mapPriceGroups, fallbackPriceGroups);

export const getTrainingPrograms = (): Promise<TrainingProgram[]> =>
  fetchOrFallback(
    trainingProgramsQuery,
    mapTrainingPrograms,
    fallbackTrainingPrograms,
  );

export const getStories = (): Promise<Story[]> =>
  fetchOrFallback(storiesQuery, mapStories, fallbackStories);

export const getNews = (): Promise<NewsArticle[]> =>
  fetchOrFallback(newsQuery, mapNews, fallbackNews);

export const getSiteData = (): Promise<SiteData> =>
  fetchOrFallback(siteDataQuery, mapSiteData, fallbackSiteData);
