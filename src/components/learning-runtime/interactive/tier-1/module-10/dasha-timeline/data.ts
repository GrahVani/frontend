/**
 * Vimśottarī Daśā Timeline — Static Data
 *
 * Uses the Grahvani Learning Design System graha colors from
 * `design-tokens/grahvani-learning/colors.ts`.
 *
 * The `DASHA_LORDS` array follows the fixed canonical order:
 * Ketu → Venus → Sun → Moon → Mars → Rāhu → Jupiter → Saturn → Mercury
 * with year allotments summing to 120 (pūrṇāyus).
 *
 * Designed for reuse: the component accepts any lord-sequence + year data,
 * so it can render Vimśottarī (120yr/9 lords) or other dasha systems
 * (Aṣṭottarī 108yr/8 lords, Yoginī 36yr/8 yoginīs) in future lessons.
 */

import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface DashaLord {
  /** Position in the fixed sequence (1-indexed) */
  index: number;
  /** Graha slug matching design-system key */
  grahaSlug: GrahaSlug;
  /** English name */
  name: string;
  /** IAST transliteration */
  nameIAST: string;
  /** Devanāgarī script */
  devanagari: string;
  /** Allotted mahādaśā years */
  years: number;
  /** Primary color from learning design system */
  color: string;
  /** Lighter tint for backgrounds / hover states */
  colorTint: string;
  /** Short mnemonic abbreviation (Ke, Ve, Su, etc.) */
  abbr: string;
  /** One-line signification summary for the detail panel */
  signification: string;
}

export const DASHA_LORDS: DashaLord[] = [
  {
    index: 1,
    grahaSlug: "ketu",
    name: "Ketu",
    nameIAST: "Ketu",
    devanagari: grahas.ketu.devanagari,
    years: 7,
    color: grahas.ketu.primary,
    colorTint: grahas.ketu.secondaryTint,
    abbr: "Ke",
    signification: "Spirituality, detachment, sudden events, past-life karma",
  },
  {
    index: 2,
    grahaSlug: "shukra",
    name: "Venus",
    nameIAST: "Śukra",
    devanagari: grahas.shukra.devanagari,
    years: 20,
    color: grahas.shukra.primary,
    colorTint: grahas.shukra.secondaryTint,
    abbr: "Ve",
    signification: "Love, luxury, arts, marriage, material comfort",
  },
  {
    index: 3,
    grahaSlug: "surya",
    name: "Sun",
    nameIAST: "Sūrya",
    devanagari: grahas.surya.devanagari,
    years: 6,
    color: grahas.surya.primary,
    colorTint: grahas.surya.secondaryTint,
    abbr: "Su",
    signification: "Authority, self, father, career, government",
  },
  {
    index: 4,
    grahaSlug: "candra",
    name: "Moon",
    nameIAST: "Candra",
    devanagari: grahas.candra.devanagari,
    years: 10,
    color: grahas.candra.primary,
    colorTint: grahas.candra.secondaryTint,
    abbr: "Mo",
    signification: "Mind, mother, emotions, public, nourishment",
  },
  {
    index: 5,
    grahaSlug: "mangala",
    name: "Mars",
    nameIAST: "Maṅgala",
    devanagari: grahas.mangala.devanagari,
    years: 7,
    color: grahas.mangala.primary,
    colorTint: grahas.mangala.secondaryTint,
    abbr: "Ma",
    signification: "Energy, courage, siblings, property, conflict",
  },
  {
    index: 6,
    grahaSlug: "rahu",
    name: "Rāhu",
    nameIAST: "Rāhu",
    devanagari: grahas.rahu.devanagari,
    years: 18,
    color: grahas.rahu.primary,
    colorTint: grahas.rahu.secondaryTint,
    abbr: "Ra",
    signification: "Obsession, foreign, unconventional, amplification",
  },
  {
    index: 7,
    grahaSlug: "guru",
    name: "Jupiter",
    nameIAST: "Guru",
    devanagari: grahas.guru.devanagari,
    years: 16,
    color: grahas.guru.primary,
    colorTint: grahas.guru.secondaryTint,
    abbr: "Ju",
    signification: "Wisdom, children, dharma, expansion, teacher",
  },
  {
    index: 8,
    grahaSlug: "shani",
    name: "Saturn",
    nameIAST: "Śani",
    devanagari: grahas.shani.devanagari,
    years: 19,
    color: grahas.shani.primary,
    colorTint: grahas.shani.secondaryTint,
    abbr: "Sa",
    signification: "Discipline, delay, longevity, service, karma",
  },
  {
    index: 9,
    grahaSlug: "budha",
    name: "Mercury",
    nameIAST: "Budha",
    devanagari: grahas.budha.devanagari,
    years: 17,
    color: grahas.budha.primary,
    colorTint: grahas.budha.secondaryTint,
    abbr: "Me",
    signification: "Intelligence, speech, commerce, skill, adaptability",
  },
];

/** Total cycle years — sum of all lord allotments */
export const TOTAL_CYCLE_YEARS = 120;

/** Mnemonic string: Ke-Ve-Su-Mo-Ma-Ra-Ju-Sa-Me */
export const SEQUENCE_MNEMONIC = DASHA_LORDS.map((l) => l.abbr).join("-");

/** Mnemonic string: 7-20-6-10-7-18-16-19-17 */
export const YEARS_MNEMONIC = DASHA_LORDS.map((l) => l.years).join("-");

/**
 * Compute cumulative year-end for each lord from a given starting index.
 * E.g., if starting at index 0 (Ketu): [7, 27, 33, 43, 50, 68, 84, 103, 120]
 */
export function cumulativeYears(startIndex: number): number[] {
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < DASHA_LORDS.length; i++) {
    const idx = (startIndex + i) % DASHA_LORDS.length;
    sum += DASHA_LORDS[idx].years;
    result.push(sum);
  }
  return result;
}

/**
 * Get the ordered lord sequence starting from a given lord index.
 * Returns a new array with the same 9 lords but rotated.
 */
export function rotatedSequence(startIndex: number): DashaLord[] {
  return Array.from({ length: DASHA_LORDS.length }, (_, i) =>
    DASHA_LORDS[(startIndex + i) % DASHA_LORDS.length]
  );
}

export type GroupingRationale = "none" | "luminaries" | "nodes" | "benefics" | "outerMalefics";

export interface DashaGrouping {
  id: GroupingRationale;
  label: string;
  slugs: GrahaSlug[];
  sum: number;
}

export const DASHA_GROUPINGS: Record<Exclude<GroupingRationale, "none">, DashaGrouping> = {
  luminaries: { id: "luminaries", label: "Luminaries", slugs: ["surya", "candra"], sum: 16 },
  nodes: { id: "nodes", label: "Nodes", slugs: ["rahu", "ketu"], sum: 25 },
  benefics: { id: "benefics", label: "Benefics", slugs: ["shukra", "budha"], sum: 37 },
  outerMalefics: { id: "outerMalefics", label: "Outer Malefics", slugs: ["mangala", "guru", "shani"], sum: 42 },
};

