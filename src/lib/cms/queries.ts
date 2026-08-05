const publicGate =
  "enabled == true && defined(publishedAt) && publishedAt <= now()";

const publicationProjection = `
  enabled,
  order,
  publishedAt
`;

const imageProjection = `
  image {
    alt,
    "url": asset->url + "?w=1600&q=75&auto=format"
  }
`;

export const aircraftQuery = `*[_type == "aircraft" && ${publicGate}] | order(order asc) {
  "id": _id,
  name,
  model,
  registration,
  summary,
  details,
  ${imageProjection},
  uses,
  features,
  ${publicationProjection}
}`;

export const peopleQuery = `*[_type == "person" && ${publicGate}] | order(order asc) {
  "id": _id,
  name,
  title,
  roles,
  summary,
  biography,
  ${imageProjection},
  ${publicationProjection}
}`;

export const priceGroupsQuery = `*[_type == "priceGroup" && ${publicGate}] | order(order asc) {
  "id": _id,
  title,
  description,
  "items": items[enabled == true] | order(order asc) {
    "id": _key,
    label,
    amount,
    unit,
    audience,
    note,
    enabled,
    order
  },
  disclaimer,
  ${publicationProjection}
}`;

export const trainingProgramsQuery = `*[_type == "trainingProgram" && ${publicGate}] | order(order asc) {
  "id": _id,
  title,
  "slug": slug.current,
  summary,
  details,
  minimumFlightHours,
  prerequisites,
  availability,
  ${publicationProjection}
}`;

export const storiesQuery = `*[_type == "story" && ${publicGate}] | order(order asc) {
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  body,
  ${imageProjection},
  ${publicationProjection}
}`;

export const siteDataQuery = `*[
  _type == "siteSettings" &&
  _id == "siteSettings" &&
  enabled == true &&
  defined(publishedAt) &&
  publishedAt <= now()
][0] {
  clubName,
  tagline,
  address,
  phone,
  email,
  locationLabel
}`;
