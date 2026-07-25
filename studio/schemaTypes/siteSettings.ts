import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Coordonnées du site",
  type: "document",
  fields: [
    defineField({
      name: "clubName",
      title: "Nom du club",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Accroche",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Rue",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "postalCode",
          title: "Code postal",
          type: "string",
          validation: (rule) => rule.required().regex(/^\d{5}$/),
        }),
        defineField({
          name: "city",
          title: "Ville",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Courriel",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationLabel",
      title: "Lieu",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Coordonnées vérifiées et publiables",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Coordonnées du site" }) },
});
