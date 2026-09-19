import { defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Actualité",
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
      title: "Chapô",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "accessibleImage",
    }),
    ...publishingFields,
  ],
  orderings: [
    {
      title: "Date de publication",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "image" },
  },
});
