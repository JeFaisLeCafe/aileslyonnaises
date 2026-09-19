export interface PortableTextSpan {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
}

export interface PortableTextBlock {
  _key: string;
  _type: "block";
  children: PortableTextSpan[];
  markDefs: readonly Record<string, string>[];
  style: "normal" | "h2" | "h3" | "blockquote";
}

export interface CmsImage {
  alt: string;
  url: string;
}

export interface Publication {
  enabled: boolean;
  order: number;
  publishedAt: string;
}

export interface Aircraft extends Publication {
  id: string;
  name: string;
  model: string;
  registration: string;
  summary: string;
  details: PortableTextBlock[];
  image?: CmsImage | undefined;
  uses: string[];
  features: string[];
}

export type PersonRole =
  | "instructor"
  | "chiefInstructor"
  | "president"
  | "vicePresident"
  | "treasurer"
  | "secretary"
  | "boardMember";

export interface Person extends Publication {
  id: string;
  name: string;
  title?: string | undefined;
  roles: PersonRole[];
  summary: string;
  biography: PortableTextBlock[];
  image?: CmsImage | undefined;
}

export type PriceUnit = "fixed" | "year" | "hour";

export interface PriceItem {
  id: string;
  label: string;
  amount?: number | undefined;
  unit: PriceUnit;
  audience?: string | undefined;
  note?: string | undefined;
  enabled: boolean;
  order: number;
}

export interface PriceGroup extends Publication {
  id: string;
  title: string;
  description: string;
  items: PriceItem[];
  disclaimer: string;
}

export interface TrainingProgram extends Publication {
  id: string;
  title: string;
  slug: string;
  summary: string;
  details: PortableTextBlock[];
  minimumFlightHours?: number | undefined;
  prerequisites: string[];
  availability: "available" | "planned";
}

export type StoryCategory = "history" | "clubLife" | "trip" | "elles";

export interface Story extends Publication {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: StoryCategory;
  body: PortableTextBlock[];
  image?: CmsImage | undefined;
}

export interface NewsArticle extends Publication {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: PortableTextBlock[];
  image?: CmsImage | undefined;
}

export interface SiteData {
  clubName: string;
  tagline: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string;
  email: string;
  locationLabel: string;
}
