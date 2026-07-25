import { defineArrayMember, defineField, defineType } from "sanity";

import { publishingFields } from "./shared";

export const priceGroup = defineType({
  name: "priceGroup",
  title: "Groupe de tarifs",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "Précisions",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: "items",
      title: "Lignes tarifaires",
      type: "array",
      of: [
        defineArrayMember({
          name: "priceItem",
          title: "Tarif",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "string",
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: "amount",
              title: "Montant",
              type: "number",
              validation: (rule) => rule.min(0).precision(2),
            }),
            defineField({
              name: "unit",
              title: "Unité",
              type: "string",
              options: {
                list: [
                  { title: "Forfait", value: "fixed" },
                  { title: "Par an", value: "year" },
                  { title: "Par heure", value: "hour" },
                ],
              },
              initialValue: "fixed",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "audience",
              title: "Public concerné",
              type: "string",
            }),
            defineField({ name: "note", title: "Note", type: "text", rows: 2 }),
            defineField({
              name: "enabled",
              title: "Visible",
              type: "boolean",
              initialValue: true,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "order",
              title: "Ordre",
              type: "number",
              initialValue: 100,
              validation: (rule) => rule.required().integer().min(0),
            }),
          ],
          preview: {
            select: { title: "label", amount: "amount", audience: "audience" },
            prepare: ({
              title,
              amount,
              audience,
            }: {
              title?: string;
              amount?: number;
              audience?: string;
            }) => ({
              title: title ?? "Sans libellé",
              subtitle: [
                amount === undefined ? "Sur demande" : `${String(amount)} €`,
                audience,
              ]
                .filter(Boolean)
                .join(" · "),
            }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "disclaimer",
      title: "Mention de vérification",
      type: "string",
      initialValue: "Tarifs indicatifs : contactez le club pour confirmation.",
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
