import { z } from "zod";

export const trainingEnquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.string().trim().max(30).optional().default(""),
  ageRange: z.enum(["under-16", "16-17", "18-24", "25-39", "40-plus"]),
  goal: z.enum(["unsure", "ppl", "lapl", "night", "initiation"]),
  experience: z
    .enum(["none", "discovery", "bia", "student", "pilot"])
    .optional()
    .default("none"),
  availability: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal("accepted"),
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().optional().default(""),
});

export type TrainingEnquiry = z.infer<typeof trainingEnquirySchema>;

export const trainingEnquiryLabels = {
  ageRange: {
    "under-16": "Moins de 16 ans",
    "16-17": "16–17 ans",
    "18-24": "18–24 ans",
    "25-39": "25–39 ans",
    "40-plus": "40 ans et plus",
  },
  goal: {
    unsure: "Souhaite être conseillé",
    ppl: "Licence PPL",
    lapl: "Licence LAPL",
    night: "Qualification vol de nuit",
    initiation: "Pack initiation",
  },
  experience: {
    none: "Aucune",
    discovery: "Vol(s) découverte",
    bia: "BIA obtenu ou en préparation",
    student: "Déjà élève-pilote",
    pilot: "Déjà pilote breveté",
  },
} as const;

export const formatTrainingEnquiryText = (enquiry: TrainingEnquiry) =>
  [
    `Nom : ${enquiry.name}`,
    `Email : ${enquiry.email}`,
    `Téléphone : ${enquiry.phone || "Non renseigné"}`,
    `Âge : ${trainingEnquiryLabels.ageRange[enquiry.ageRange]}`,
    `Projet : ${trainingEnquiryLabels.goal[enquiry.goal]}`,
    `Expérience : ${trainingEnquiryLabels.experience[enquiry.experience]}`,
    `Disponibilités : ${enquiry.availability || "Non renseignées"}`,
    "",
    enquiry.message || "Aucun message complémentaire.",
  ].join("\n");
