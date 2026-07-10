import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS, type DashaLord } from "../dasha-timeline/data";

export interface AshtottariLord {
  index: number;
  grahaSlug: GrahaSlug;
  name: string;
  nameIAST: string;
  devanagari: string;
  years: number;
  abbr: string;
  color: string;
  colorTint: string;
  vimshottariYears: number | null;
  contrast: string;
}

export const ASHTOTTARI_TOTAL_YEARS = 108;

export const ASHTOTTARI_LORDS: AshtottariLord[] = [
  {
    index: 1,
    grahaSlug: "surya",
    name: "Sun",
    nameIAST: "Surya",
    devanagari: grahas.surya.devanagari,
    years: 6,
    abbr: "Su",
    color: grahas.surya.primary,
    colorTint: grahas.surya.secondaryTint,
    vimshottariYears: 6,
    contrast: "Same duration as Vimshottari, but starts the Ashtottari sequence.",
  },
  {
    index: 2,
    grahaSlug: "candra",
    name: "Moon",
    nameIAST: "Candra",
    devanagari: grahas.candra.devanagari,
    years: 15,
    abbr: "Mo",
    color: grahas.candra.primary,
    colorTint: grahas.candra.secondaryTint,
    vimshottariYears: 10,
    contrast: "Moon expands from 10 to 15 years.",
  },
  {
    index: 3,
    grahaSlug: "mangala",
    name: "Mars",
    nameIAST: "Mangala",
    devanagari: grahas.mangala.devanagari,
    years: 8,
    abbr: "Ma",
    color: grahas.mangala.primary,
    colorTint: grahas.mangala.secondaryTint,
    vimshottariYears: 7,
    contrast: "Mars gains one year compared with Vimshottari.",
  },
  {
    index: 4,
    grahaSlug: "budha",
    name: "Mercury",
    nameIAST: "Budha",
    devanagari: grahas.budha.devanagari,
    years: 17,
    abbr: "Me",
    color: grahas.budha.primary,
    colorTint: grahas.budha.secondaryTint,
    vimshottariYears: 17,
    contrast: "Mercury keeps the same 17-year allotment.",
  },
  {
    index: 5,
    grahaSlug: "shani",
    name: "Saturn",
    nameIAST: "Shani",
    devanagari: grahas.shani.devanagari,
    years: 10,
    abbr: "Sa",
    color: grahas.shani.primary,
    colorTint: grahas.shani.secondaryTint,
    vimshottariYears: 19,
    contrast: "Saturn contracts sharply from 19 to 10 years.",
  },
  {
    index: 6,
    grahaSlug: "guru",
    name: "Jupiter",
    nameIAST: "Guru",
    devanagari: grahas.guru.devanagari,
    years: 19,
    abbr: "Ju",
    color: grahas.guru.primary,
    colorTint: grahas.guru.secondaryTint,
    vimshottariYears: 16,
    contrast: "Jupiter expands to 19 years.",
  },
  {
    index: 7,
    grahaSlug: "rahu",
    name: "Rahu",
    nameIAST: "Rahu",
    devanagari: grahas.rahu.devanagari,
    years: 12,
    abbr: "Ra",
    color: grahas.rahu.primary,
    colorTint: grahas.rahu.secondaryTint,
    vimshottariYears: 18,
    contrast: "Rahu is retained, but shortened from 18 to 12 years.",
  },
  {
    index: 8,
    grahaSlug: "shukra",
    name: "Venus",
    nameIAST: "Shukra",
    devanagari: grahas.shukra.devanagari,
    years: 21,
    abbr: "Ve",
    color: grahas.shukra.primary,
    colorTint: grahas.shukra.secondaryTint,
    vimshottariYears: 20,
    contrast: "Venus becomes 21 years, the longest Ashtottari period.",
  },
];

export const OMITTED_KETU: DashaLord | undefined = DASHA_LORDS.find((lord) => lord.grahaSlug === "ketu");

export function ashtottariSequenceMnemonic() {
  return ASHTOTTARI_LORDS.map((lord) => lord.abbr).join(" -> ");
}

export function ashtottariYearsMnemonic() {
  return ASHTOTTARI_LORDS.map((lord) => lord.years).join("-");
}

export function cumulativeAshtottariYears() {
  let total = 0;
  return ASHTOTTARI_LORDS.map((lord) => {
    const start = total;
    total += lord.years;
    return { lord, start, end: total };
  });
}

export function getAshtottariLord(index: number) {
  return ASHTOTTARI_LORDS.find((lord) => lord.index === index) ?? ASHTOTTARI_LORDS[0];
}

export function getVimshottariYearsBySlug(slug: GrahaSlug) {
  return DASHA_LORDS.find((lord) => lord.grahaSlug === slug)?.years ?? null;
}
