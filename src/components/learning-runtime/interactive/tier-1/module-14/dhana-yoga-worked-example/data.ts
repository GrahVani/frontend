import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type WorkedYogaSlug = "pure-dhana" | "dual-dhana-raja";
export type StrengthPresetSlug = "reliable" | "underdelivers";

export interface AriesWealthLord {
  house: 2 | 5 | 9 | 11;
  lord: GrahaSlug;
  sign: string;
  signDevanagari: string;
  role: string;
  color: string;
}

export interface WorkedYoga {
  slug: WorkedYogaSlug;
  label: string;
  iast: string;
  devanagari: string;
  houses: [2 | 5 | 9 | 11, 2 | 5 | 9 | 11];
  lords: [GrahaSlug, GrahaSlug];
  classification: "Pure dhana" | "Dhana + raja-grade";
  identification: string;
  reading: string;
  color: string;
}

export interface StrengthPreset {
  slug: StrengthPresetSlug;
  label: string;
  shadbala: Record<GrahaSlug, number>;
  sav: Record<number, number>;
  note: string;
}

export const ARIES_WEALTH_LORDS: AriesWealthLord[] = [
  {
    house: 2,
    lord: "shukra",
    sign: "Taurus",
    signDevanagari: "वृषभ",
    role: "Held wealth and assets",
    color: grahas.shukra.primary,
  },
  {
    house: 5,
    lord: "surya",
    sign: "Leo",
    signDevanagari: "सिंह",
    role: "Merit, intelligence, fortune",
    color: grahas.surya.primary,
  },
  {
    house: 9,
    lord: "guru",
    sign: "Sagittarius",
    signDevanagari: "धनुस्",
    role: "Bhagya, grace, dharma",
    color: grahas.guru.primary,
  },
  {
    house: 11,
    lord: "shani",
    sign: "Aquarius",
    signDevanagari: "कुम्भ",
    role: "Gains, income, fulfilment",
    color: grahas.shani.primary,
  },
];

export const WORKED_YOGAS: WorkedYoga[] = [
  {
    slug: "pure-dhana",
    label: "2L Venus x 11L Saturn",
    iast: "Dhana-Lābha Yoga",
    devanagari: "धन-लाभ",
    houses: [2, 11],
    lords: ["shukra", "shani"],
    classification: "Pure dhana",
    identification: "The 2nd lord and 11th lord relate: the celebrated wealth-plus-gains pairing.",
    reading: "A wealth promise through assets, income, networks, and accumulation.",
    color: grahas.shukra.primary,
  },
  {
    slug: "dual-dhana-raja",
    label: "5L Sun x 9L Jupiter",
    iast: "Lakṣmī-Bhāgya Link",
    devanagari: "लक्ष्मी-भाग्य",
    houses: [5, 9],
    lords: ["surya", "guru"],
    classification: "Dhana + raja-grade",
    identification: "The 5th lord and 9th lord relate: both wealth houses and both trikonas.",
    reading: "A fortunate wealth promise with eminence, recognition, and dharmic support.",
    color: grahas.guru.primary,
  },
];

export const STRENGTH_PRESETS: StrengthPreset[] = [
  {
    slug: "reliable",
    label: "Reliable delivery",
    shadbala: {
      surya: 72,
      candra: 58,
      mangala: 61,
      budha: 63,
      guru: 78,
      shukra: 74,
      shani: 68,
      rahu: 55,
      ketu: 55,
    },
    sav: {
      2: 34,
      5: 32,
      9: 36,
      11: 35,
    },
    note: "Strong lords plus high SAV: the yoga is likely to deliver more reliably.",
  },
  {
    slug: "underdelivers",
    label: "Present but muted",
    shadbala: {
      surya: 51,
      candra: 58,
      mangala: 61,
      budha: 63,
      guru: 54,
      shukra: 49,
      shani: 43,
      rahu: 55,
      ketu: 55,
    },
    sav: {
      2: 22,
      5: 28,
      9: 24,
      11: 20,
    },
    note: "The yoga is present, but weak lords or low SAV make delivery uneven.",
  },
];

export function grahaLabel(slug: GrahaSlug) {
  return grahas[slug].iast;
}

export function getWorkedYoga(slug: WorkedYogaSlug) {
  return WORKED_YOGAS.find((yoga) => yoga.slug === slug) ?? WORKED_YOGAS[0];
}
