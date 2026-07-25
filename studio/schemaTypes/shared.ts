import { defineArrayMember, defineField, defineType } from "sanity";

export const publishingFields = [
  defineField({
    name: "enabled",
    title: "Visible",
    type: "boolean",
    initialValue: false,
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "publishedAt",
    title: "Date de publication",
    type: "datetime",
    description: "Le contenu ne sera public qu’à partir de cette date.",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "order",
    title: "Ordre d’affichage",
    type: "number",
    initialValue: 100,
    validation: (rule) => rule.required().integer().min(0),
  }),
] as const;

export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image accessible",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description:
        "Décrivez brièvement l’image pour les personnes qui ne peuvent pas la voir.",
      validation: (rule) => rule.required().min(3).max(180),
    }),
  ],
  validation: (rule) => rule.assetRequired(),
});

export const portableText = defineType({
  name: "portableText",
  title: "Texte enrichi",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Intertitre", value: "h2" },
        { title: "Sous-titre", value: "h3" },
        { title: "Citation", value: "blockquote" },
      ],
      marks: {
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Lien",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Adresse",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
