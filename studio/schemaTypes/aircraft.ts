import { defineArrayMember, defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

export const aircraft = defineType({
  name: "aircraft",
  title: "Avion",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom affiché",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "model",
      title: "Modèle",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "registration",
      title: "Immatriculation",
      type: "string",
      validation: (rule) => rule.required().regex(/^F-[A-Z0-9]{4}$/),
    }),
    defineField({
      name: "summary",
      title: "Résumé",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: "details",
      title: "Présentation",
      type: "portableText",
    }),
    defineField({ name: "image", title: "Photo", type: "accessibleImage" }),
    defineField({
      name: "uses",
      title: "Usages",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "features",
      title: "Caractéristiques vérifiées",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.unique(),
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
  preview: {
    select: { title: "name", subtitle: "registration", media: "image" },
  },
});
