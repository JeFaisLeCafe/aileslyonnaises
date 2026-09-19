import { describe, expect, it } from "vitest";

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
  fallbackAircraft,
  fallbackNews,
  fallbackPeople,
  fallbackPriceGroups,
  fallbackSiteData,
  fallbackStories,
  fallbackTrainingPrograms,
} from "../../data/cmsFallbacks";

const now = new Date("2026-07-25T12:00:00.000Z");

const aircraft = (
  overrides: Record<string, boolean | number | string> = {},
) => ({
  id: "aircraft-1",
  name: "Avion test",
  model: "Modèle test",
  registration: "F-TEST",
  summary: "Résumé vérifié",
  details: [],
  uses: [],
  features: [],
  enabled: true,
  order: 10,
  publishedAt: "2026-07-25T10:00:00.000Z",
  ...overrides,
});

describe("mapAircraft", () => {
  it("keeps only enabled documents whose publication date has passed", () => {
    const result = mapAircraft(
      [
        aircraft({ id: "visible" }),
        aircraft({ id: "disabled", enabled: false }),
        aircraft({ id: "future", publishedAt: "2026-07-26T10:00:00.000Z" }),
      ],
      now,
    );

    expect(result.map(({ id }) => id)).toEqual(["visible"]);
  });

  it("sorts public documents by their explicit order", () => {
    const result = mapAircraft(
      [
        aircraft({ id: "second", order: 20 }),
        aircraft({ id: "first", order: 10 }),
      ],
      now,
    );

    expect(result.map(({ id }) => id)).toEqual(["first", "second"]);
  });
});

describe("mapPriceGroups", () => {
  it("removes disabled price items and sorts the remaining items", () => {
    const [group] = mapPriceGroups(
      [
        {
          id: "prices",
          title: "Tarifs",
          description: "",
          items: [
            {
              id: "second",
              label: "Second",
              amount: 2,
              unit: "fixed",
              enabled: true,
              order: 20,
            },
            {
              id: "hidden",
              label: "Masqué",
              amount: 3,
              unit: "fixed",
              enabled: false,
              order: 5,
            },
            {
              id: "first",
              label: "Premier",
              amount: 1,
              unit: "fixed",
              enabled: true,
              order: 10,
            },
          ],
          disclaimer: "À confirmer.",
          enabled: true,
          order: 10,
          publishedAt: "2026-07-25T10:00:00.000Z",
        },
      ],
      now,
    );

    expect(group?.items.map(({ id }) => id)).toEqual(["first", "second"]);
  });
});

describe("static fallbacks", () => {
  it("conform to the same runtime schemas as CMS responses", () => {
    const publishedNow = new Date("2026-09-19T12:00:00.000Z");
    expect(mapAircraft(fallbackAircraft, publishedNow)).toHaveLength(6);
    expect(mapPeople(fallbackPeople, publishedNow)).toEqual(fallbackPeople);
    expect(mapPriceGroups(fallbackPriceGroups, publishedNow)).toHaveLength(4);
    expect(
      mapTrainingPrograms(fallbackTrainingPrograms, publishedNow),
    ).toHaveLength(4);
    expect(mapStories(fallbackStories, publishedNow)).toHaveLength(4);
    expect(mapNews(fallbackNews, publishedNow)).toHaveLength(1);
    expect(mapSiteData(fallbackSiteData).clubName).toBe(
      "Aéroclub Les Ailes Lyonnaises",
    );
  });
});
