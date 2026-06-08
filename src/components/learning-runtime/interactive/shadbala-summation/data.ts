/**
 * Ṣaḍbala Summation — Data Engine
 *
 * §7 interactive for Lesson 13.5.2.
 *
 * Provides the six ṣaḍbala components, required minima per planet,
 * and illustrative presets for the summation calculator.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── The six components ─────────────────────────────────────────────────── */

export interface ShadbalaComponent {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  description: string;
  canBeNegative: boolean;
}

export const COMPONENTS: ShadbalaComponent[] = [
  {
    key: "sthana",
    nameIAST: "Sthāna Bala",
    nameDevanagari: "स्थानबलम्",
    english: "Positional",
    description: "House placement and sign dignity",
    canBeNegative: false,
  },
  {
    key: "dik",
    nameIAST: "Dik Bala",
    nameDevanagari: "दिक्बलम्",
    english: "Directional",
    description: "Angular position (MC, IC, etc.)",
    canBeNegative: false,
  },
  {
    key: "kala",
    nameIAST: "Kāla Bala",
    nameDevanagari: "कालबलम्",
    english: "Temporal",
    description: "Time of day, season, lunar phase",
    canBeNegative: false,
  },
  {
    key: "cheshta",
    nameIAST: "Cheṣṭā Bala",
    nameDevanagari: "चेष्टाबलम्",
    english: "Motional",
    description: "Motion — retrograde = max",
    canBeNegative: false,
  },
  {
    key: "naisargika",
    nameIAST: "Naisargika Bala",
    nameDevanagari: "नैसर्गिकबलम्",
    english: "Natural",
    description: "Fixed per-planet baseline",
    canBeNegative: false,
  },
  {
    key: "drk",
    nameIAST: "Dṛk Bala",
    nameDevanagari: "दृग्बलम्",
    english: "Aspectual",
    description: "Net of benefic − malefic aspects",
    canBeNegative: true,
  },
];

/* ─── Required minima (curriculum canonical) ─────────────────────────────── */

export interface RequiredMinimum {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  requiredRupas: number;
  /** Whether this value has a known source-fork */
  hasFork: boolean;
  forkNote?: string;
}

export const REQUIRED_MINIMA: RequiredMinimum[] = [
  {
    grahaSlug: "surya",
    nameIAST: "Sūrya",
    nameDevanagari: "सूर्य",
    requiredRupas: 5,
    hasFork: true,
    forkNote: "Some texts list 6.5 (same as Jupiter). This curriculum uses 5.",
  },
  {
    grahaSlug: "candra",
    nameIAST: "Candra",
    nameDevanagari: "चन्द्र",
    requiredRupas: 6,
    hasFork: false,
  },
  {
    grahaSlug: "mangala",
    nameIAST: "Maṅgala",
    nameDevanagari: "मङ्गल",
    requiredRupas: 5,
    hasFork: false,
  },
  {
    grahaSlug: "budha",
    nameIAST: "Budha",
    nameDevanagari: "बुध",
    requiredRupas: 7,
    hasFork: false,
  },
  {
    grahaSlug: "guru",
    nameIAST: "Guru",
    nameDevanagari: "गुरु",
    requiredRupas: 6.5,
    hasFork: false,
  },
  {
    grahaSlug: "shukra",
    nameIAST: "Śukra",
    nameDevanagari: "शुक्र",
    requiredRupas: 5.5,
    hasFork: false,
  },
  {
    grahaSlug: "shani",
    nameIAST: "Śani",
    nameDevanagari: "शनि",
    requiredRupas: 5,
    hasFork: false,
  },
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

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface ComponentValues {
  sthana: number;
  dik: number;
  kala: number;
  cheshta: number;
  naisargika: number;
  drk: number;
}

export interface Preset {
  label: string;
  description: string;
  grahaSlug: GrahaSlug;
  values: ComponentValues;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "The Sum",
    description: "Add six components in virūpas, then ÷60 for rūpas.",
    grahaSlug: "guru",
    values: {
      sthana: 120,
      dik: 40,
      kala: 150,
      cheshta: 30,
      naisargika: 240 / 7,
      drk: 20,
    },
    takeaway: "394.29 virūpas ÷ 60 = 6.57 rūpas.",
  },
  {
    label: "Clearing the Bar",
    description: "Mars totals 6.0 rūpas vs required 5 → strong.",
    grahaSlug: "mangala",
    values: {
      sthana: 100,
      dik: 50,
      kala: 80,
      cheshta: 20,
      naisargika: 120 / 7,
      drk: 30,
    },
    takeaway: "6.0 rūpas ≥ 5 required → clears.",
  },
  {
    label: "Negative Dṛk",
    description: "360 virūpas from first five, minus 40 dṛk = 320.",
    grahaSlug: "shukra",
    values: {
      sthana: 80,
      dik: 60,
      kala: 100,
      cheshta: 40,
      naisargika: 300 / 7,
      drk: -40,
    },
    takeaway: "320 ÷ 60 = 5.33 rūpas. Dṛk pulled it down.",
  },
];
