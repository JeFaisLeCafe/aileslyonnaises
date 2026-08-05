import type {
  Aircraft,
  PortableTextBlock,
  PriceGroup,
  SiteData,
  Story,
  TrainingProgram,
} from "../lib/cms/types";

const publishedAt = "2026-07-25T00:00:00.000Z";
const priceDisclaimer =
  "Tarifs issus du document de travail 2026 fourni par le club. Contactez le club pour confirmation.";

const paragraph = (key: string, text: string): PortableTextBlock => ({
  _key: key,
  _type: "block",
  children: [{ _key: `${key}-span`, _type: "span", marks: [], text }],
  markDefs: [],
  style: "normal",
});

export const fallbackAircraft = [
  {
    id: "fallback-f-gypg",
    name: "DR400/160 F-GYPG",
    model: "DR400/160",
    registration: "F-GYPG",
    summary: "Avion de la flotte du club, proposé pour l’école et le voyage.",
    details: [],
    uses: ["École", "Voyage"],
    features: [],
    enabled: true,
    order: 10,
    publishedAt,
  },
  {
    id: "fallback-f-hlyo",
    name: "DR401/160 F-HLYO",
    model: "DR401/160",
    registration: "F-HLYO",
    summary: "Avion de la flotte du club, proposé pour l’école et le voyage.",
    details: [],
    uses: ["École", "Voyage"],
    features: [],
    enabled: true,
    order: 20,
    publishedAt,
  },
  {
    id: "fallback-f-hsmb",
    name: "Bristell B23 F-HSMB",
    model: "Bristell B23",
    registration: "F-HSMB",
    summary:
      "Avion de nouvelle génération avec glass cockpit, destiné à l’école et au voyage.",
    details: [],
    uses: ["École", "Voyage"],
    features: ["Glass cockpit"],
    enabled: true,
    order: 30,
    publishedAt,
  },
  {
    id: "fallback-f-gxge",
    name: "DR400/120 F-GXGE",
    model: "DR400/120",
    registration: "F-GXGE",
    summary:
      "Avion de la flotte du club, proposé prioritairement pour l’école.",
    details: [],
    uses: ["École", "Voyage"],
    features: [],
    enabled: true,
    order: 40,
    publishedAt,
  },
  {
    id: "fallback-f-gjqt",
    name: "DR400/120 F-GJQT",
    model: "DR400/120",
    registration: "F-GJQT",
    summary:
      "Avion de la flotte du club, proposé prioritairement pour l’école.",
    details: [],
    uses: ["École", "Voyage"],
    features: [],
    enabled: true,
    order: 50,
    publishedAt,
  },
] satisfies Aircraft[];

export const fallbackPriceGroups = [
  {
    id: "fallback-membership",
    title: "Adhésion au club",
    description: "Cotisation annuelle et participation aux frais.",
    items: [
      {
        id: "membership",
        label: "Cotisation annuelle",
        amount: 50,
        unit: "year",
        enabled: true,
        order: 10,
      },
      {
        id: "participation-under-25",
        label: "Participation aux frais",
        amount: 100,
        unit: "year",
        audience: "Moins de 25 ans",
        enabled: true,
        order: 20,
      },
      {
        id: "participation-standard",
        label: "Participation aux frais",
        amount: 250,
        unit: "year",
        audience: "Tarif général",
        enabled: true,
        order: 30,
      },
      {
        id: "visiting-pilot",
        label: "Pilote FFA de passage",
        amount: 10,
        unit: "fixed",
        note: "Nous consulter.",
        enabled: true,
        order: 40,
      },
    ],
    disclaimer: priceDisclaimer,
    enabled: true,
    order: 10,
    publishedAt,
  },
  {
    id: "fallback-ffa",
    title: "Licence FFA et assurance",
    description: "Licence fédérale annuelle et assurance de base.",
    items: [
      {
        id: "ffa-license",
        label: "Licence FFA",
        amount: 80,
        unit: "year",
        enabled: true,
        order: 10,
      },
      {
        id: "base-insurance",
        label: "Assurance de base",
        amount: 16,
        unit: "year",
        enabled: true,
        order: 20,
      },
      {
        id: "info-pilote",
        label: "Abonnement optionnel Info-Pilote",
        amount: 49,
        unit: "year",
        enabled: true,
        order: 30,
      },
    ],
    disclaimer: priceDisclaimer,
    enabled: true,
    order: 20,
    publishedAt,
  },
  {
    id: "fallback-aircraft-rates",
    title: "Tarifs horaires des avions",
    description:
      "Le tarif réduit nécessite un forfait annuel initial de 450 €.",
    items: [
      {
        id: "f-gypg-normal",
        label: "DR400/160 F-GYPG — tarif normal",
        amount: 211.2,
        unit: "hour",
        enabled: true,
        order: 10,
      },
      {
        id: "f-gypg-reduced",
        label: "DR400/160 F-GYPG — tarif réduit",
        amount: 168.96,
        unit: "hour",
        enabled: true,
        order: 20,
      },
      {
        id: "f-hlyo-normal",
        label: "DR401/160 F-HLYO — tarif normal",
        amount: 199.8,
        unit: "hour",
        enabled: true,
        order: 30,
      },
      {
        id: "f-hlyo-reduced",
        label: "DR401/160 F-HLYO — tarif réduit",
        amount: 158.94,
        unit: "hour",
        enabled: true,
        order: 40,
      },
      {
        id: "f-hsmb-normal",
        label: "Bristell B23 F-HSMB — tarif normal",
        amount: 179.4,
        unit: "hour",
        enabled: true,
        order: 50,
      },
      {
        id: "f-hsmb-reduced",
        label: "Bristell B23 F-HSMB — tarif réduit",
        amount: 143.52,
        unit: "hour",
        enabled: true,
        order: 60,
      },
      {
        id: "f-gxge-normal",
        label: "DR400/120 F-GXGE — tarif normal",
        amount: 179.4,
        unit: "hour",
        enabled: true,
        order: 70,
      },
      {
        id: "f-gxge-reduced",
        label: "DR400/120 F-GXGE — tarif réduit",
        amount: 143.52,
        unit: "hour",
        enabled: true,
        order: 80,
      },
      {
        id: "f-gjqt-normal",
        label: "DR400/120 F-GJQT — tarif normal",
        amount: 179.4,
        unit: "hour",
        enabled: true,
        order: 90,
      },
      {
        id: "f-gjqt-reduced",
        label: "DR400/120 F-GJQT — tarif réduit",
        amount: 143.52,
        unit: "hour",
        enabled: true,
        order: 100,
      },
    ],
    disclaimer: priceDisclaimer,
    enabled: true,
    order: 30,
    publishedAt,
  },
  {
    id: "fallback-instruction",
    title: "Instruction",
    description:
      "Le coût total dépend du nombre d’heures nécessaires et des frais annexes.",
    items: [
      {
        id: "instruction-hour",
        label: "Instruction",
        amount: 42,
        unit: "hour",
        note: "Briefing, débriefing, encadrement en vol et, selon le besoin, théorie en salle.",
        enabled: true,
        order: 10,
      },
    ],
    disclaimer: priceDisclaimer,
    enabled: true,
    order: 40,
    publishedAt,
  },
] satisfies PriceGroup[];

export const fallbackTrainingPrograms = [
  {
    id: "fallback-ppl",
    title: "PPL(A) — Licence de pilote privé",
    slug: "ppl",
    summary:
      "Formation au pilotage d’un avion monomoteur à pistons en VFR de jour.",
    details: [
      paragraph(
        "ppl",
        "Le minimum réglementaire annoncé est de 45 heures de vol, dont 10 heures en solo.",
      ),
    ],
    minimumFlightHours: 45,
    prerequisites: [
      "Âge et aptitude médicale réglementaires à vérifier avant l’inscription.",
    ],
    availability: "available",
    enabled: true,
    order: 10,
    publishedAt,
  },
  {
    id: "fallback-lapl",
    title: "LAPL(A) — Licence de pilote d’avion léger",
    slug: "lapl",
    summary:
      "Formation européenne pour voler en aviation légère en VFR de jour.",
    details: [
      paragraph(
        "lapl",
        "Le minimum réglementaire annoncé est de 30 heures de vol, dont 6 heures en solo.",
      ),
    ],
    minimumFlightHours: 30,
    prerequisites: [
      "Âge et aptitude médicale réglementaires à vérifier avant l’inscription.",
    ],
    availability: "available",
    enabled: true,
    order: 20,
    publishedAt,
  },
  {
    id: "fallback-night",
    title: "Qualification au vol de nuit",
    slug: "vol-de-nuit",
    summary: "Formation complémentaire pour voler en conditions VFR de nuit.",
    details: [
      paragraph(
        "night",
        "Le programme fourni prévoit au minimum 5 heures de vol de nuit.",
      ),
    ],
    minimumFlightHours: 5,
    prerequisites: [
      "Être titulaire d’une licence de pilote compatible et d’une aptitude médicale valide.",
    ],
    availability: "available",
    enabled: true,
    order: 30,
    publishedAt,
  },
  {
    id: "fallback-mountain",
    title: "Sensibilisation au vol en région montagneuse",
    slug: "sensibilisation-vol-montagne",
    summary:
      "Module de sensibilisation destiné à découvrir le vol en région montagneuse en sécurité.",
    details: [],
    prerequisites: ["Programme et conditions à confirmer auprès du club."],
    availability: "available",
    enabled: true,
    order: 40,
    publishedAt,
  },
] satisfies TrainingProgram[];

export const fallbackStories = [
  {
    id: "fallback-history",
    title: "Un club ancré dans le territoire lyonnais",
    slug: "histoire-du-club",
    excerpt:
      "Né en 1965 à Lyon, le club s’est installé à Bron avant de prendre son nom actuel en 1978.",
    category: "history",
    body: [
      paragraph(
        "history-1",
        "Le club naît en 1965 sous le nom « Aéro-club des Jeunes de Monplaisir-Lumière », avec pour objectif de rendre les sports aériens plus accessibles aux jeunes.",
      ),
      paragraph(
        "history-2",
        "Initialement actif à Satolas, il rejoint le terrain de Bron au début des travaux du futur aéroport de Lyon-Saint-Exupéry.",
      ),
      paragraph(
        "history-3",
        "En 1978, le club prend le nom « Les Ailes Lyonnaises ».",
      ),
    ],
    enabled: true,
    order: 10,
    publishedAt,
  },
] satisfies Story[];

export const fallbackSiteData = {
  clubName: "Aéroclub Les Ailes Lyonnaises",
  tagline: "École de pilotage et aéroclub à Lyon-Bron",
  address: {
    street: "305 rue Albert Kimmerling",
    postalCode: "69680",
    city: "Chassieu",
  },
  phone: "06 40 36 92 29",
  email: "info2@aileslyonnaises.com",
  locationLabel: "Aéroport de Lyon-Bron",
} satisfies SiteData;
