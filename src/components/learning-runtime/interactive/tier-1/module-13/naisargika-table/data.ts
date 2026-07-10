/**
 * Naisargika Bala Table — Data Engine
 *
 * §7 interactive for Lesson 13.4.2.
 *
 * Provides the seven fixed naisargika bala values and the 60×k/7
 * pattern. These are constant per-planet strengths, identical in
 * every chart — the baseline onto which variable balas accumulate.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── The seven fixed naisargika values ──────────────────────────────────── */

export interface NaisargikaEntry {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  /** Fixed virūpa value */
  virupas: number;
  /** Formatted to 2 decimal places */
  virupasFormatted: string;
  /** k in the formula 60 × k/7 */
  k: number;
  /** Fraction of the full 60 */
  fraction: string;
  /** Rank from strongest (1) to weakest (7) */
  rank: number;
}

export const NAISARGIKA_VALUES: NaisargikaEntry[] = [
  {
    grahaSlug: "surya",
    nameIAST: "Sūrya",
    nameDevanagari: "सूर्य",
    virupas: 60,
    virupasFormatted: "60.00",
    k: 7,
    fraction: "7/7",
    rank: 1,
  },
  {
    grahaSlug: "candra",
    nameIAST: "Candra",
    nameDevanagari: "चन्द्र",
    virupas: 360 / 7, // ≈ 51.428571...
    virupasFormatted: "51.43",
    k: 6,
    fraction: "6/7",
    rank: 2,
  },
  {
    grahaSlug: "shukra",
    nameIAST: "Śukra",
    nameDevanagari: "शुक्र",
    virupas: 300 / 7, // ≈ 42.857142...
    virupasFormatted: "42.86",
    k: 5,
    fraction: "5/7",
    rank: 3,
  },
  {
    grahaSlug: "guru",
    nameIAST: "Guru",
    nameDevanagari: "गुरु",
    virupas: 240 / 7, // ≈ 34.285714...
    virupasFormatted: "34.29",
    k: 4,
    fraction: "4/7",
    rank: 4,
  },
  {
    grahaSlug: "budha",
    nameIAST: "Budha",
    nameDevanagari: "बुध",
    virupas: 180 / 7, // ≈ 25.714285...
    virupasFormatted: "25.71",
    k: 3,
    fraction: "3/7",
    rank: 5,
  },
  {
    grahaSlug: "mangala",
    nameIAST: "Maṅgala",
    nameDevanagari: "मङ्गल",
    virupas: 120 / 7, // ≈ 17.142857...
    virupasFormatted: "17.14",
    k: 2,
    fraction: "2/7",
    rank: 6,
  },
  {
    grahaSlug: "shani",
    nameIAST: "Śani",
    nameDevanagari: "शनि",
    virupas: 60 / 7, // ≈ 8.571428...
    virupasFormatted: "8.57",
    k: 1,
    fraction: "1/7",
    rank: 7,
  },
];

export const MAX_VIRUPAS = 60;
export const FORMULA_BASE = 60;
export const FORMULA_DIVISOR = 7;

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface Preset {
  label: string;
  description: string;
  grahaSlug: GrahaSlug;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Sūrya — The Maximum",
    description: "Sun's naisargika bala = 60 in every chart. The full 7/7.",
    grahaSlug: "surya",
    takeaway: "Fixed maximum: 60 virūpas.",
  },
  {
    label: "Guru — The Pattern",
    description: "Jupiter = 60 × 4/7 = 34.29. One step in the k/7 ladder.",
    grahaSlug: "guru",
    takeaway: "60 × k/7 gives each value.",
  },
  {
    label: "Same Baseline, Different Charts",
    description: "Two charts share identical naisargika; only variable balas differ.",
    grahaSlug: "shani",
    takeaway: "Constant baseline — not a differentiator.",
  },
];

/* ─── Variable balas (for baseline concept) ──────────────────────────────── */

export interface VariableBala {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  description: string;
}

export const VARIABLE_BALAS: VariableBala[] = [
  {
    key: "sthana",
    nameIAST: "Sthāna Bala",
    nameDevanagari: "स्थानबलम्",
    description: "Positional strength (house, sign dignity)",
  },
  {
    key: "dik",
    nameIAST: "Dik Bala",
    nameDevanagari: "दिक्बलम्",
    description: "Directional strength (angular position)",
  },
  {
    key: "kala",
    nameIAST: "Kāla Bala",
    nameDevanagari: "कालबलम्",
    description: "Temporal strength (time of day, season, age)",
  },
  {
    key: "cheshta",
    nameIAST: "Cheṣṭā Bala",
    nameDevanagari: "चेष्टाबलम्",
    description: "Motional strength (retrograde = max)",
  },
  {
    key: "drik",
    nameIAST: "Dṛk Bala",
    nameDevanagari: "दृग्बलम्",
    description: "Aspectual strength (benefic / malefic aspects)",
  },
];
