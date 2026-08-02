import { defineArrayMember, defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

const roles = [
  { title: "Instructeur ou instructrice", value: "instructor" },
  { title: "Chef instructeur", value: "chiefInstructor" },
  { title: "Présidence", value: "president" },
  { title: "Vice-présidence", value: "vicePresident" },
  { title: "Trésorerie", value: "treasurer" },
  { title: "Secrétariat", value: "secretary" },
  { title: "Conseil d’administration", value: "boardMember" },
];

export const person = defineType({
  name: "person",
  title: "Personne",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom public",
      type: "string",
      description: "Publier uniquement avec l’accord de la personne.",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "title",
      title: "Titre affiché",
      type: "string",
      description: "Ex. Chef instructeur, FI(A), Présidente…",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "roles",
      title: "Rôles",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: roles },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "summary",
      title: "Présentation courte",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(260),
    }),
    defineField({ name: "biography", title: "Parcours", type: "portableText" }),
    defineField({
      name: "image",
      title: "Portrait",
      type: "accessibleImage",
      description: "Portrait optionnel, avec texte alternatif.",
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
    select: {
      title: "name",
      subtitle: "title",
      roleValues: "roles",
      media: "image",
    },
    prepare: ({
      title,
      subtitle,
      roleValues,
    }: {
      title?: string;
      subtitle?: string;
      roleValues?: string[];
    }) => ({
      title: title ?? "Sans nom",
      subtitle:
        subtitle ??
        roleValues
          ?.map(
            (role) => roles.find(({ value }) => value === role)?.title ?? role,
          )
          .join(", ") ??
        "",
    }),
  },
});
