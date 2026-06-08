import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type VariantCategory = "grand" | "related" | "misfiled";

export interface RajaVariant {
  slug: string;
  title: string;
  iast: string;
  devanagari: string;
  category: VariantCategory;
  status: "source-fork" | "compounded" | "legitimate" | "reroute";
  condition: string;
  reading: string;
  caution: string;
  color: string;
}

export const VARIANT_CATEGORIES: Record<VariantCategory, { label: string; description: string }> = {
  grand: {
    label: "Grand raja-yoga grades",
    description: "Exceptional or compounded raja-yoga language. Read with source discipline.",
  },
  related: {
    label: "Legitimate relatives",
    description: "Related authority yogas that belong near raja-yoga study.",
  },
  misfiled: {
    label: "Route elsewhere",
    description: "Important yogas that should not be filed as raja yogas.",
  },
};

export const RAJA_YOGA_VARIANTS: RajaVariant[] = [
  {
    slug: "cakravarti",
    title: "Cakravarti",
    iast: "Cakravartī Yoga",
    devanagari: "चक्रवर्ती",
    category: "grand",
    status: "source-fork",
    condition: "Exceptional imperial-stature raja yoga; exact formula varies by source.",
    reading: "Treat as rare, far-reaching eminence after naming the source condition.",
    caution: "Do not assert one rigid formula without citation.",
    color: grahas.surya.primary,
  },
  {
    slug: "maha-raja",
    title: "Maha-Raja",
    iast: "Mahā-Rāja Yoga",
    devanagari: "महाराज",
    category: "grand",
    status: "compounded",
    condition: "Multiple raja yogas compound, or one major yoga receives all strength supports.",
    reading: "A degree of raja-yoga strength: many/strong royal combinations.",
    caution: "Count distinct yoga lines, then judge strength later.",
    color: grahas.guru.primary,
  },
  {
    slug: "bhagya-karmadhipati",
    title: "Bhagya-Karmadhipati",
    iast: "Bhāgya-Karmādhipati Exchange",
    devanagari: "भाग्यकर्म",
    category: "related",
    status: "legitimate",
    condition: "9th lord and 10th lord in mutual exchange.",
    reading: "A tight form of Dharma-Karmadhipati: fortune and action trade seats.",
    caution: "This is specifically 9-10 exchange, not every 9-10 relationship.",
    color: grahas.shukra.primary,
  },
  {
    slug: "adhi",
    title: "Adhi Yoga",
    iast: "Adhi Yoga",
    devanagari: "अधि",
    category: "related",
    status: "legitimate",
    condition: "Natural benefics Mercury, Jupiter, Venus in 6th, 7th, and 8th from the Moon.",
    reading: "A raja-type authority yoga of standing, prosperity, and leadership.",
    caution: "Count from the Moon, not from lagna.",
    color: grahas.budha.primary,
  },
  {
    slug: "chandra-mangala",
    title: "Chandra-Mangala",
    iast: "Candra-Maṅgala Yoga",
    devanagari: "चन्द्रमंगल",
    category: "misfiled",
    status: "reroute",
    condition: "Moon and Mars together.",
    reading: "Classically a dhana yoga: wealth through enterprise or activity.",
    caution: "Do not list it as a raja yoga; route it to Chapter 2.",
    color: grahas.mangala.primary,
  },
];

export const SOURCE_FORKS = [
  "Many planets in kendras and trikonas",
  "Movable-sign concentration",
  "Powerful lagna with benefic angles",
];

export const ADHI_POSITIONS = [
  { houseFromMoon: 6, planet: "Mercury", planetSlug: "budha" },
  { houseFromMoon: 7, planet: "Jupiter", planetSlug: "guru" },
  { houseFromMoon: 8, planet: "Venus", planetSlug: "shukra" },
] as const;

export function getVariant(slug: string) {
  return RAJA_YOGA_VARIANTS.find((variant) => variant.slug === slug) ?? RAJA_YOGA_VARIANTS[0];
}
