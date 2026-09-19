import { defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

export const story = defineType({
  name: "story",
  title: "Récit intemporel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Résumé",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Histoire", value: "history" },
          { title: "Vie du club", value: "clubLife" },
          { title: "Navigation", value: "trip" },
          { title: "Les Elles Lyonnaises", value: "elles" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image principale",
      type: "accessibleImage",
    }),
    ...publishingFields,
  ],
  orderings: [
    {
      title: "Ordre du site",
      name: "siteOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
