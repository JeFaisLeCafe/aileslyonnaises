import type { Person, PersonRole } from "./types";

export const bureauRoles = [
  "president",
  "vicePresident",
  "treasurer",
  "secretary",
] as const satisfies readonly PersonRole[];

export const boardRoles = [
  "boardMember",
] as const satisfies readonly PersonRole[];

export const instructorRoles = [
  "instructor",
  "chiefInstructor",
] as const satisfies readonly PersonRole[];

export const hasAnyRole = (
  person: Person,
  roles: readonly PersonRole[],
): boolean => person.roles.some((role) => roles.includes(role));

export const isBureauMember = (person: Person): boolean =>
  hasAnyRole(person, bureauRoles);

export const isBoardMember = (person: Person): boolean =>
  hasAnyRole(person, boardRoles);

export const isInstructor = (person: Person): boolean =>
  hasAnyRole(person, instructorRoles);
