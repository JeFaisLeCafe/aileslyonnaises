import { defineArrayMember, defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

export const trainingProgram = defineType({
  name: "trainingProgram",
  title: "Formation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Résumé",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "details",
      title: "Présentation",
      type: "portableText",
    }),
    defineField({
      name: "minimumFlightHours",
      title: "Minimum réglementaire d’heures de vol",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "prerequisites",
      title: "Prérequis vérifiés",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "availability",
      title: "Disponibilité",
      type: "string",
      options: {
        list: [
          { title: "Proposée", value: "available" },
          { title: "Prévue ultérieurement", value: "planned" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (rule) => rule.required(),
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
});
