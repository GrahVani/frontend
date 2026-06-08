/**
 * Dṛk Bala Calculator — Data Engine
 *
 * §7 interactive for Lesson 13.5.1.
 *
 * Provides the natural benefic/malefic classification and illustrative
 * aspect data for the dṛk-bala calculator. Exact drishti-piṇḍa grading
 * and scaling are engine-dependent — this is a concept-teaching tool.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── Natural benefic / malefic classification ───────────────────────────── */

export type GrahaNature = "benefic" | "malefic" | "mixed";

export interface GrahaNatureEntry {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  nature: GrahaNature;
  note: string;
}

export const GRAHA_NATURES: GrahaNatureEntry[] = [
  {
    grahaSlug: "surya",
    nameIAST: "Sūrya",
    nameDevanagari: "सूर्य",
    nature: "malefic",
    note: "Naturally malefic by heat and dryness; counts as subtracting in dṛk bala.",
  },
  {
    grahaSlug: "candra",
    nameIAST: "Candra",
    nameDevanagari: "चन्द्र",
    nature: "mixed",
    note: "Benefic when waxing, malefic when waning; here treated as benefic for simplicity.",
  },
  {
    grahaSlug: "mangala",
    nameIAST: "Maṅgala",
    nameDevanagari: "मङ्गल",
    nature: "malefic",
    note: "Naturally malefic — energy, conflict, injury. Subtracts in dṛk bala.",
  },
  {
    grahaSlug: "budha",
    nameIAST: "Budha",
    nameDevanagari: "बुध",
    nature: "benefic",
    note: "Neutral by nature, but generally counted as benefic unless conjoined with malefics.",
  },
  {
    grahaSlug: "guru",
    nameIAST: "Guru",
    nameDevanagari: "गुरु",
    nature: "benefic",
    note: "The greatest benefic. Adds strength in dṛk bala.",
  },
  {
    grahaSlug: "shukra",
    nameIAST: "Śukra",
    nameDevanagari: "शुक्र",
    nature: "benefic",
    note: "A major benefic. Adds strength in dṛk bala.",
  },
  {
    grahaSlug: "shani",
    nameIAST: "Śani",
    nameDevanagari: "शनि",
    nature: "malefic",
    note: "Naturally malefic — restriction, delay, sorrow. Subtracts in dṛk bala.",
  },
  {
    grahaSlug: "rahu",
    nameIAST: "Rāhu",
    nameDevanagari: "राहु",
    nature: "malefic",
    note: "A natural malefic (some traditions exclude nodes from dṛk bala).",
  },
  {
    grahaSlug: "ketu",
    nameIAST: "Ketu",
    nameDevanagari: "केतु",
    nature: "malefic",
    note: "A natural malefic (some traditions exclude nodes from dṛk bala).",
  },
];

export const GRAHA_NATURE_MAP: Record<GrahaSlug, GrahaNatureEntry> = {
  surya: GRAHA_NATURES[0],
  candra: GRAHA_NATURES[1],
  mangala: GRAHA_NATURES[2],
  budha: GRAHA_NATURES[3],
  guru: GRAHA_NATURES[4],
  shukra: GRAHA_NATURES[5],
  shani: GRAHA_NATURES[6],
  rahu: GRAHA_NATURES[7],
  ketu: GRAHA_NATURES[8],
};

/* ─── Aspect entries (for the calculator) ────────────────────────────────── */

export interface AspectEntry {
  id: string;
  sourceSlug: GrahaSlug;
  /** Illustrative strength: 1.0 = full, 0.5 = partial */
  strength: number;
  /** Whether this is a benefic (+) or malefic (−) aspect */
  isBenefic: boolean;
  /** Aspect type label */
  aspectLabel: string;
}

export const ASPECT_PRESETS: AspectEntry[][] = [
  // Example 1 — benefic-dominated
  [
    { id: "e1-1", sourceSlug: "guru", strength: 1.0, isBenefic: true, aspectLabel: "Full aspect" },
    { id: "e1-2", sourceSlug: "shukra", strength: 0.5, isBenefic: true, aspectLabel: "Partial aspect" },
  ],
  // Example 2 — malefic-dominated (negative)
  [
    { id: "e2-1", sourceSlug: "shani", strength: 1.0, isBenefic: false, aspectLabel: "Full aspect" },
    { id: "e2-2", sourceSlug: "mangala", strength: 0.5, isBenefic: false, aspectLabel: "Partial aspect" },
  ],
  // Example 3 — mixed (net)
  [
    { id: "e3-1", sourceSlug: "guru", strength: 1.0, isBenefic: true, aspectLabel: "Full aspect" },
    { id: "e3-2", sourceSlug: "shani", strength: 1.0, isBenefic: false, aspectLabel: "Full aspect" },
  ],
];

/* ─── The six ṣaḍbala components (for overview) ─────────────────────────── */

export interface ShadbalaComponent {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  description: string;
  isVariable: boolean;
  isFinal: boolean;
}

export const SHADBALA_COMPONENTS: ShadbalaComponent[] = [
  {
    key: "sthana",
    nameIAST: "Sthāna Bala",
    nameDevanagari: "स्थानबलम्",
    english: "Positional Strength",
    description: "Strength from house placement and sign dignity",
    isVariable: true,
    isFinal: false,
  },
  {
    key: "dik",
    nameIAST: "Dik Bala",
    nameDevanagari: "दिक्बलम्",
    english: "Directional Strength",
    description: "Strength from angular position (MC, IC, etc.)",
    isVariable: true,
    isFinal: false,
  },
  {
    key: "kala",
    nameIAST: "Kāla Bala",
    nameDevanagari: "कालबलम्",
    english: "Temporal Strength",
    description: "Strength from time of day, season, lunar phase",
    isVariable: true,
    isFinal: false,
  },
  {
    key: "cheshta",
    nameIAST: "Cheṣṭā Bala",
    nameDevanagari: "चेष्टाबलम्",
    english: "Motional Strength",
    description: "Strength from motion — retrograde = max",
    isVariable: true,
    isFinal: false,
  },
  {
    key: "naisargika",
    nameIAST: "Naisargika Bala",
    nameDevanagari: "नैसर्गिकबलम्",
    english: "Natural Strength",
    description: "Fixed per-planet baseline — identical in every chart",
    isVariable: false,
    isFinal: false,
  },
  {
    key: "drk",
    nameIAST: "Dṛk Bala",
    nameDevanagari: "दृग्बलम्",
    english: "Aspectual Strength",
    description: "Net of benefic minus malefic aspects — can be negative",
    isVariable: true,
    isFinal: true,
  },
];
