/**
 * Ṣaḍbala Scorecard — Data Engine
 *
 * §7 interactive for Lesson 13.5.3.
 *
 * Provides the required minima, ratio-band definitions, planetary
 * kārakatvas, and scorecard presets for the interpretive application.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── Required minima (same canonical table) ─────────────────────────────── */

export interface RequiredMinimum {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  requiredRupas: number;
}

export const REQUIRED_MINIMA: RequiredMinimum[] = [
  { grahaSlug: "surya", nameIAST: "Sūrya", nameDevanagari: "सूर्य", requiredRupas: 5 },
  { grahaSlug: "candra", nameIAST: "Candra", nameDevanagari: "चन्द्र", requiredRupas: 6 },
  { grahaSlug: "mangala", nameIAST: "Maṅgala", nameDevanagari: "मङ्गल", requiredRupas: 5 },
  { grahaSlug: "budha", nameIAST: "Budha", nameDevanagari: "बुध", requiredRupas: 7 },
  { grahaSlug: "guru", nameIAST: "Guru", nameDevanagari: "गुरु", requiredRupas: 6.5 },
  { grahaSlug: "shukra", nameIAST: "Śukra", nameDevanagari: "शुक्र", requiredRupas: 5.5 },
  { grahaSlug: "shani", nameIAST: "Śani", nameDevanagari: "शनि", requiredRupas: 5 },
];

export const REQUIRED_MAP: Record<string, RequiredMinimum> = {
  surya: REQUIRED_MINIMA[0],
  candra: REQUIRED_MINIMA[1],
  mangala: REQUIRED_MINIMA[2],
  budha: REQUIRED_MINIMA[3],
  guru: REQUIRED_MINIMA[4],
  shukra: REQUIRED_MINIMA[5],
  shani: REQUIRED_MINIMA[6],
};

/* ─── Band definitions ───────────────────────────────────────────────────── */

export type StrengthBand = "uttama" | "madhya" | "adhama";

export interface BandDef {
  key: StrengthBand;
  labelIAST: string;
  labelDevanagari: string;
  labelEnglish: string;
  minRatio: number;
  maxRatio: number;
  description: string;
  readingGuidance: string;
  color: string;
}

export const BANDS: BandDef[] = [
  {
    key: "uttama",
    labelIAST: "Uttama",
    labelDevanagari: "उत्तम",
    labelEnglish: "Strong",
    minRatio: 1.0,
    maxRatio: Infinity,
    description: "Total comfortably exceeds the required minimum.",
    readingGuidance: "Predictions about this planet's significations are reliable. Lead with this planet.",
    color: "#2F7D55",
  },
  {
    key: "madhya",
    labelIAST: "Madhya",
    labelDevanagari: "मध्य",
    labelEnglish: "Middling",
    minRatio: 0.5,
    maxRatio: 1.0,
    description: "Total falls short of the minimum but is at least half.",
    readingGuidance: "Predictions are moderate — corroborate with other tools before asserting firmly.",
    color: "#C8841E",
  },
  {
    key: "adhama",
    labelIAST: "Adhama",
    labelDevanagari: "अधम",
    labelEnglish: "Weak",
    minRatio: 0,
    maxRatio: 0.5,
    description: "Total is less than half the required minimum.",
    readingGuidance: "Predictions are unreliable. Cross-validate with daśā, transit, and other evidence.",
    color: "#A23A1E",
  },
];

export function bandFromRatio(ratio: number): BandDef {
  if (ratio >= 1.0) return BANDS[0];
  if (ratio >= 0.5) return BANDS[1];
  return BANDS[2];
}

/* ─── Planetary kārakatvas (significations) ──────────────────────────────── */

export interface Karakatva {
  grahaSlug: GrahaSlug;
  keywords: string[];
}

export const KARAKATVAS: Karakatva[] = [
  { grahaSlug: "surya", keywords: ["career", "authority", "father", "ego", "health"] },
  { grahaSlug: "candra", keywords: ["mind", "emotions", "mother", "public", "comfort"] },
  { grahaSlug: "mangala", keywords: ["courage", "action", "siblings", "energy", "conflict"] },
  { grahaSlug: "budha", keywords: ["intellect", "speech", "commerce", "skills", "youth"] },
  { grahaSlug: "guru", keywords: ["wisdom", "children", "wealth", "dharma", "teaching"] },
  { grahaSlug: "shukra", keywords: ["pleasure", "relationships", "arts", "luxury", "vehicles"] },
  { grahaSlug: "shani", keywords: ["discipline", "delay", "labour", "elders", "structure"] },
];

export const KARAKATVA_MAP: Record<string, Karakatva> = {
  surya: KARAKATVAS[0],
  candra: KARAKATVAS[1],
  mangala: KARAKATVAS[2],
  budha: KARAKATVAS[3],
  guru: KARAKATVAS[4],
  shukra: KARAKATVAS[5],
  shani: KARAKATVAS[6],
};

/* ─── Scorecard presets (worked example from §6) ─────────────────────────── */

export interface ScorecardEntry {
  grahaSlug: GrahaSlug;
  totalRupas: number;
}

export const SCORECARD_PRESET: ScorecardEntry[] = [
  { grahaSlug: "surya", totalRupas: 7.2 },
  { grahaSlug: "candra", totalRupas: 2.6 },
  { grahaSlug: "mangala", totalRupas: 6.5 },
  { grahaSlug: "guru", totalRupas: 4.2 },
  // Mercury, Venus, Saturn omitted in the worked example
];
