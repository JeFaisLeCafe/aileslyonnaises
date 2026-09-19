import { describe, expect, it } from "vitest";

import type { Person } from "./types";
import { isBoardMember, isBureauMember, isInstructor } from "./roles";

const person = (roles: Person["roles"]): Person => ({
  id: "person-test",
  name: "Test",
  roles,
  summary: "",
  biography: [],
  enabled: true,
  order: 10,
  publishedAt: "2026-07-25T00:00:00.000Z",
});

describe("person role filters", () => {
  it("keeps instructors out of the bureau section", () => {
    const instructor = person(["instructor", "chiefInstructor", "boardMember"]);

    expect(isInstructor(instructor)).toBe(true);
    expect(isBoardMember(instructor)).toBe(true);
    expect(isBureauMember(instructor)).toBe(false);
  });

  it("lets a president appear in both bureau and board views", () => {
    const president = person(["president", "boardMember"]);

    expect(isBureauMember(president)).toBe(true);
    expect(isBoardMember(president)).toBe(true);
    expect(isInstructor(president)).toBe(false);
  });
});
