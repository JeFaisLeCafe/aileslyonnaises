import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("legacy redirects", () => {
  it("preserves the main indexed journeys", async () => {
    const redirects = await readFile("public/_redirects", "utf8");

    expect(redirects).toContain("/formations");
    expect(redirects).toContain("/baptemes-de-lair-2");
    expect(redirects).toContain("/contact-29");
  });
});
