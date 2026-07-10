/**
 * Sthira Daśā Intro — Data Layer
 *
 * §7 interactive for Lesson 10.6.2 (Jaimini Sthira Daśā — Introduction).
 *
 * Holds contrast data for Cara vs Sthira: feature comparisons,
 * illustrative sequences (both rāśi-based, different rules), and
 * the Jaimini family structure. Full computation deferred to T1-17.
 */

import { grahas } from "@/design-tokens/grahvani-learning/colors";
import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type RashiModality = "movable" | "fixed" | "dual";

export interface RashiData {
  index: number;
  name: string;
  nameIAST: string;
  modality: RashiModality;
  lordSlug: GrahaSlug;
  color: string;
}

export const RASHIS: RashiData[] = [
  { index: 0, name: "Aries", nameIAST: "Meṣa", modality: "movable", lordSlug: "mangala", color: grahas.mangala.primary },
  { index: 1, name: "Taurus", nameIAST: "Vṛṣabha", modality: "fixed", lordSlug: "shukra", color: grahas.shukra.primary },
  { index: 2, name: "Gemini", nameIAST: "Mithuna", modality: "dual", lordSlug: "budha", color: grahas.budha.primary },
  { index: 3, name: "Cancer", nameIAST: "Karkaṭa", modality: "movable", lordSlug: "candra", color: grahas.candra.primary },
  { index: 4, name: "Leo", nameIAST: "Siṃha", modality: "fixed", lordSlug: "surya", color: grahas.surya.primary },
  { index: 5, name: "Virgo", nameIAST: "Kanyā", modality: "dual", lordSlug: "budha", color: grahas.budha.primary },
  { index: 6, name: "Libra", nameIAST: "Tulā", modality: "movable", lordSlug: "shukra", color: grahas.shukra.primary },
  { index: 7, name: "Scorpio", nameIAST: "Vṛścika", modality: "fixed", lordSlug: "mangala", color: grahas.mangala.primary },
  { index: 8, name: "Sagittarius", nameIAST: "Dhanus", modality: "dual", lordSlug: "guru", color: grahas.guru.primary },
  { index: 9, name: "Capricorn", nameIAST: "Makara", modality: "movable", lordSlug: "shani", color: grahas.shani.primary },
  { index: 10, name: "Aquarius", nameIAST: "Kumbha", modality: "fixed", lordSlug: "shani", color: grahas.shani.primary },
  { index: 11, name: "Pisces", nameIAST: "Mīna", modality: "dual", lordSlug: "guru", color: grahas.guru.primary },
];

export const MODALITY_META: Record<RashiModality, { label: string; color: string; bg: string }> = {
  movable: { label: "Movable", color: "#356CAB", bg: "rgba(53,108,171,0.12)" },
  fixed: { label: "Fixed", color: "#A23A1E", bg: "rgba(162,58,30,0.12)" },
  dual: { label: "Dual", color: "#2F7D55", bg: "rgba(47,125,85,0.12)" },
};

/* ─── Illustrative sequences (awareness-level) ─────────────────────────── */

/** Cara: starts from ascendant, zodiacal order, variable durations. */
export function buildCaraSequence(ascendantIndex: number): { rashi: RashiData; years: number }[] {
  const baseDurations = [8, 7, 6, 9, 7, 6, 8, 7, 6, 9, 7, 6];
  return Array.from({ length: 12 }, (_, i) => {
    const rashiIdx = (ascendantIndex + i) % 12;
    return { rashi: RASHIS[rashiIdx], years: baseDurations[rashiIdx] };
  });
}

/**
 * Sthira: illustrative different sequence — starts from a different point
 * and uses a different ordering to demonstrate that Sthira gives a
 * different timeline from the same chart. Exact rules deferred to T1-17.
 */
export function buildSthiraSequence(ascendantIndex: number): { rashi: RashiData; years: number }[] {
  // Illustrative: Sthira uses a different starting anchor (e.g., 7th from 8th)
  // and a different progression pattern. Here we simulate that by starting
  // from a different sign and using a non-zodiacal skip pattern.
  const startIndex = (ascendantIndex + 7) % 12; // Different start from Cara
  const pattern = [0, 2, 4, 6, 8, 10, 1, 3, 5, 7, 9, 11]; // Non-sequential
  const baseDurations = [7, 8, 5, 9, 6, 7, 8, 5, 9, 6, 7, 8]; // Different from Cara
  return pattern.map((offset, i) => {
    const rashiIdx = (startIndex + offset) % 12;
    return { rashi: RASHIS[rashiIdx], years: baseDurations[rashiIdx] };
  });
}

/* ─── Feature comparison rows ──────────────────────────────────────────── */

export interface ComparisonRow {
  feature: string;
  featureIAST: string;
  caraValue: string;
  sthiraValue: string;
  highlight?: "cara" | "sthira" | "both" | "neither";
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Ruler type",
    featureIAST: "Ādhipatya",
    caraValue: "Sign (rāśi)",
    sthiraValue: "Sign (rāśi)",
    highlight: "both",
  },
  {
    feature: "Stream",
    featureIAST: "Pravaṇatā",
    caraValue: "Jaimini",
    sthiraValue: "Jaimini",
    highlight: "both",
  },
  {
    feature: "Duration driver",
    featureIAST: "Kālakaraṇa",
    caraValue: "Sign modality + distance to lord (odd/even counting)",
    sthiraValue: "Different fixed-pattern sign-distance computation",
    highlight: "neither",
  },
  {
    feature: "Sequence start",
    featureIAST: "Prārambha",
    caraValue: "From Lagna (ascendant sign)",
    sthiraValue: "From a different anchor (e.g., 7th from 8th)",
    highlight: "neither",
  },
  {
    feature: "Total cycle",
    featureIAST: "Paripāṭī",
    caraValue: "Variable ~84–96 years",
    sthiraValue: "Variable (different total from Cara)",
    highlight: "neither",
  },
  {
    feature: "Character",
    featureIAST: "Svarūpa",
    caraValue: "'Moving' — dynamic, modality-driven",
    sthiraValue: "'Fixed' — stable-pattern, different rule set",
    highlight: "neither",
  },
  {
    feature: "Tier-1 stance",
    featureIAST: "Tārakā-sthiti",
    caraValue: "Principle understood; full computation in Jaimini module",
    sthiraValue: "Recognition only; full computation in Jaimini module",
    highlight: "both",
  },
];
