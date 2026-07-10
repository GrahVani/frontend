/**
 * Cara Daśā Intro — Data Layer
 *
 * §7 interactive for Lesson 10.6.1 (Jaimini Cara Daśā — Introduction).
 *
 * Holds the 12 rāśis with modalities, lords, and illustrative Cara durations.
 * Full computation is deferred to the Jaimini module (T1-17); here we use
 * simplified illustrative durations that vary per ascendant to teach the
 * "variable duration" principle.
 */

import { grahas } from "@/design-tokens/grahvani-learning/colors";
import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type RashiModality = "movable" | "fixed" | "dual";

export interface RashiData {
  index: number;
  name: string;
  nameIAST: string;
  devanagari: string;
  modality: RashiModality;
  lordSlug: GrahaSlug;
  color: string;
}

/* ─── The 12 rāśis ─────────────────────────────────────────────────────── */

export const RASHIS: RashiData[] = [
  { index: 0, name: "Aries", nameIAST: "Meṣa", devanagari: "मेष", modality: "movable", lordSlug: "mangala", color: grahas.mangala.primary },
  { index: 1, name: "Taurus", nameIAST: "Vṛṣabha", devanagari: "वृषभ", modality: "fixed", lordSlug: "shukra", color: grahas.shukra.primary },
  { index: 2, name: "Gemini", nameIAST: "Mithuna", devanagari: "मिथुन", modality: "dual", lordSlug: "budha", color: grahas.budha.primary },
  { index: 3, name: "Cancer", nameIAST: "Karkaṭa", devanagari: "कर्कट", modality: "movable", lordSlug: "candra", color: grahas.candra.primary },
  { index: 4, name: "Leo", nameIAST: "Siṃha", devanagari: "सिंह", modality: "fixed", lordSlug: "surya", color: grahas.surya.primary },
  { index: 5, name: "Virgo", nameIAST: "Kanyā", devanagari: "कन्या", modality: "dual", lordSlug: "budha", color: grahas.budha.primary },
  { index: 6, name: "Libra", nameIAST: "Tulā", devanagari: "तुला", modality: "movable", lordSlug: "shukra", color: grahas.shukra.primary },
  { index: 7, name: "Scorpio", nameIAST: "Vṛścika", devanagari: "वृश्चिक", modality: "fixed", lordSlug: "mangala", color: grahas.mangala.primary },
  { index: 8, name: "Sagittarius", nameIAST: "Dhanus", devanagari: "धनुस्", modality: "dual", lordSlug: "guru", color: grahas.guru.primary },
  { index: 9, name: "Capricorn", nameIAST: "Makara", devanagari: "मकर", modality: "movable", lordSlug: "shani", color: grahas.shani.primary },
  { index: 10, name: "Aquarius", nameIAST: "Kumbha", devanagari: "कुम्भ", modality: "fixed", lordSlug: "shani", color: grahas.shani.primary },
  { index: 11, name: "Pisces", nameIAST: "Mīna", devanagari: "मीन", modality: "dual", lordSlug: "guru", color: grahas.guru.primary },
];

/* ─── Modality metadata ────────────────────────────────────────────────── */

export const MODALITY_META: Record<RashiModality, { label: string; color: string; bg: string; typicalRange: string }> = {
  movable: { label: "Movable", color: "#356CAB", bg: "rgba(53,108,171,0.12)", typicalRange: "~7–10 yr" },
  fixed: { label: "Fixed", color: "#A23A1E", bg: "rgba(162,58,30,0.12)", typicalRange: "~6–9 yr" },
  dual: { label: "Dual", color: "#2F7D55", bg: "rgba(47,125,85,0.12)", typicalRange: "~5–8 yr" },
};

/**
 * Illustrative Cara durations (simplified, per ascendant).
 *
 * These are *illustrative* values that vary per ascendant to demonstrate the
 * "variable duration" principle. The exact computation (sign-modality +
 * distance-to-lord counted differently for odd/even) is deferred to the
 * Jaimini module (T1-17).
 */

const ILLUSTRATIVE_DURATIONS: number[][] = [
  // Ascendant = Aries (0)
  [8, 7, 6, 9, 7, 6, 8, 7, 6, 9, 7, 6], // sum = 86
  // Taurus (1)
  [7, 8, 6, 7, 9, 6, 7, 8, 6, 7, 9, 6], // sum = 86
  // Gemini (2)
  [6, 7, 8, 6, 7, 9, 6, 7, 8, 6, 7, 9], // sum = 86
  // Cancer (3)
  [9, 7, 6, 8, 7, 6, 9, 7, 6, 8, 7, 6], // sum = 86
  // Leo (4)
  [7, 9, 6, 7, 8, 6, 7, 9, 6, 7, 8, 6], // sum = 86
  // Virgo (5)
  [6, 7, 9, 6, 7, 8, 6, 7, 9, 6, 7, 8], // sum = 86
  // Libra (6)
  [8, 7, 6, 9, 7, 6, 8, 7, 6, 9, 7, 6], // sum = 86
  // Scorpio (7)
  [7, 8, 6, 7, 9, 6, 7, 8, 6, 7, 9, 6], // sum = 86
  // Sagittarius (8)
  [6, 7, 8, 6, 7, 9, 6, 7, 8, 6, 7, 9], // sum = 86
  // Capricorn (9)
  [9, 7, 6, 8, 7, 6, 9, 7, 6, 8, 7, 6], // sum = 86
  // Aquarius (10)
  [7, 9, 6, 7, 8, 6, 7, 9, 6, 7, 8, 6], // sum = 86
  // Pisces (11)
  [6, 7, 9, 6, 7, 8, 6, 7, 9, 6, 7, 8], // sum = 86
];

/** Get illustrative Cara durations for a given ascendant. */
export function getCaraDurations(ascendantIndex: number): number[] {
  return ILLUSTRATIVE_DURATIONS[ascendantIndex] ?? ILLUSTRATIVE_DURATIONS[0];
}

/** Build the Cara sequence starting from the ascendant. */
export function buildCaraSequence(ascendantIndex: number): { rashi: RashiData; years: number }[] {
  const durations = getCaraDurations(ascendantIndex);
  return Array.from({ length: 12 }, (_, i) => {
    const rashiIdx = (ascendantIndex + i) % 12;
    return { rashi: RASHIS[rashiIdx], years: durations[rashiIdx] };
  });
}

/* ─── Vimśottarī reference (for contrast) ──────────────────────────────── */

export const VIMSHOTTARI_LORDS = [
  { name: "Ketu", nameIAST: "Ketu", years: 7, color: grahas.ketu.primary, abbr: "Ke" },
  { name: "Venus", nameIAST: "Śukra", years: 20, color: grahas.shukra.primary, abbr: "Ve" },
  { name: "Sun", nameIAST: "Sūrya", years: 6, color: grahas.surya.primary, abbr: "Su" },
  { name: "Moon", nameIAST: "Candra", years: 10, color: grahas.candra.primary, abbr: "Mo" },
  { name: "Mars", nameIAST: "Maṅgala", years: 7, color: grahas.mangala.primary, abbr: "Ma" },
  { name: "Rāhu", nameIAST: "Rāhu", years: 18, color: grahas.rahu.primary, abbr: "Ra" },
  { name: "Jupiter", nameIAST: "Guru", years: 16, color: grahas.guru.primary, abbr: "Ju" },
  { name: "Saturn", nameIAST: "Śani", years: 19, color: grahas.shani.primary, abbr: "Sa" },
  { name: "Mercury", nameIAST: "Budha", years: 17, color: grahas.budha.primary, abbr: "Me" },
] as const;

export const VIMSHOTTARI_TOTAL = 120;
