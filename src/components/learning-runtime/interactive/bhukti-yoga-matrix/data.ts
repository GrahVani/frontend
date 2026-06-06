/**
 * Bhukti-Yoga Matrix — Data Layer
 *
 * §7 interactive for Lesson 10.4.1 (The Bhukti-Yoga Doctrine).
 *
 * Holds the naisargika (natural/permanent) friendship grid,
 * the MD→AD relation → bhukti-quality mapping, worked examples,
 * and dignity modifiers that demonstrate "modulator, not override."
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type NaisargikaRelation = "friend" | "neutral" | "enemy";

export type BhuktiQuality = "auspicious" | "mixed" | "inauspicious";

export interface BhuktiQualityMeta {
  quality: BhuktiQuality;
  label: string;
  effect: string;
  tone: string;
  color: string;
  bg: string;
}

export interface DignityModifier {
  key: string;
  label: string;
  labelIAST: string;
  shift: number; // +1 = lifts baseline, -1 = lowers, 0 = neutral
  description: string;
}

export interface WorkedExample {
  id: string;
  mdSlug: GrahaSlug;
  adSlug: GrahaSlug;
  label: string;
  note: string;
}

/* ─── Naisargika friendship grid (directed) ────────────────────────────── */

/** Row = "this planet treats the column planet as…" */
const NAISARGIKA_GRID: Record<GrahaSlug, Partial<Record<GrahaSlug, NaisargikaRelation>>> = {
  surya: {
    surya: "friend",
    candra: "friend",
    mangala: "friend",
    budha: "neutral",
    guru: "friend",
    shukra: "enemy",
    shani: "enemy",
    rahu: "enemy",
    ketu: "enemy",
  },
  candra: {
    surya: "friend",
    candra: "friend",
    mangala: "neutral",
    budha: "friend",
    guru: "neutral",
    shukra: "neutral",
    shani: "neutral",
    rahu: "neutral",
    ketu: "neutral",
  },
  mangala: {
    surya: "friend",
    candra: "friend",
    mangala: "friend",
    budha: "enemy",
    guru: "friend",
    shukra: "neutral",
    shani: "neutral",
    rahu: "enemy",
    ketu: "friend",
  },
  budha: {
    surya: "friend",
    candra: "enemy",
    mangala: "neutral",
    budha: "friend",
    guru: "neutral",
    shukra: "friend",
    shani: "neutral",
    rahu: "friend",
    ketu: "neutral",
  },
  guru: {
    surya: "friend",
    candra: "friend",
    mangala: "friend",
    budha: "enemy",
    guru: "friend",
    shukra: "enemy",
    shani: "neutral",
    rahu: "neutral",
    ketu: "neutral",
  },
  shukra: {
    surya: "enemy",
    candra: "enemy",
    mangala: "neutral",
    budha: "friend",
    guru: "neutral",
    shukra: "friend",
    shani: "friend",
    rahu: "friend",
    ketu: "friend",
  },
  shani: {
    surya: "enemy",
    candra: "enemy",
    mangala: "enemy",
    budha: "friend",
    guru: "neutral",
    shukra: "friend",
    shani: "friend",
    rahu: "friend",
    ketu: "friend",
  },
  rahu: {
    surya: "enemy",
    candra: "enemy",
    mangala: "enemy",
    budha: "friend",
    guru: "neutral",
    shukra: "friend",
    shani: "friend",
    ketu: "neutral", // varies by tradition; taught as neutral in this curriculum
  },
  ketu: {
    surya: "enemy",
    candra: "enemy",
    mangala: "friend",
    budha: "neutral",
    guru: "neutral",
    shukra: "friend",
    shani: "friend",
    rahu: "neutral", // varies by tradition
  },
};

/**
 * Look up the naisargika relation from one graha to another.
 * Returns "self" when both slugs are identical.
 */
export function getNaisargikaRelation(
  from: GrahaSlug,
  to: GrahaSlug
): NaisargikaRelation | "self" {
  if (from === to) return "self";
  return NAISARGIKA_GRID[from]?.[to] ?? "neutral";
}

/* ─── Bhukti-yoga quality mapping ──────────────────────────────────────── */

export const BHUKTI_YOGA_META: Record<NaisargikaRelation, BhuktiQualityMeta> = {
  friend: {
    quality: "auspicious",
    label: "Auspicious",
    effect: "smooth, supportive sub-period",
    tone: "Flow — their significations cooperate.",
    color: "#2F7D55",
    bg: "rgba(47,125,85,0.12)",
  },
  neutral: {
    quality: "mixed",
    label: "Mixed",
    effect: "mediocre, unremarkable results",
    tone: "Ordinary — neither help nor hindrance dominates.",
    color: "#887A42",
    bg: "rgba(136,122,66,0.12)",
  },
  enemy: {
    quality: "inauspicious",
    label: "Inauspicious",
    effect: "friction, challenges, mixed outcomes",
    tone: "Grind — their agendas pull against each other.",
    color: "#A23A1E",
    bg: "rgba(162,58,30,0.12)",
  },
};

/** Get the bhukti-yoga quality for an MD→AD pair. */
export function getBhuktiYogaQuality(
  mdSlug: GrahaSlug,
  adSlug: GrahaSlug
): BhuktiQualityMeta & { relation: NaisargikaRelation | "self"; isMutual: boolean } {
  const relation = getNaisargikaRelation(mdSlug, adSlug);
  const mirror = getNaisargikaRelation(adSlug, mdSlug);
  const isMutual =
    relation !== "self" && relation === mirror;

  if (relation === "self") {
    return {
      relation: "self",
      quality: "mixed",
      label: "Same lord",
      effect: "The lord meets itself — strength or intensity, not relation",
      tone: "Intensity of the lord's own agenda.",
      color: "#356CAB",
      bg: "rgba(53,108,171,0.12)",
      isMutual: true,
    };
  }

  return { ...BHUKTI_YOGA_META[relation], relation, isMutual };
}

/* ─── Worked examples from the lesson ──────────────────────────────────── */

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: "jup-mars",
    mdSlug: "guru",
    adSlug: "mangala",
    label: "Jupiter MD + Mars AD",
    note: "Natural friends → auspicious, smooth bhukti.",
  },
  {
    id: "jup-sat",
    mdSlug: "guru",
    adSlug: "shani",
    label: "Jupiter MD + Saturn AD",
    note: "Jupiter neutral to Saturn, Saturn neutral to Jupiter → mixed baseline.",
  },
  {
    id: "sun-sat",
    mdSlug: "surya",
    adSlug: "shani",
    label: "Sun MD + Saturn AD",
    note: "Mutual enemies → significant friction.",
  },
  {
    id: "ven-merc",
    mdSlug: "shukra",
    adSlug: "budha",
    label: "Venus MD + Mercury AD",
    note: "Venus friend to Mercury, Mercury friend to Venus → mutual friends (complementary pair).",
  },
  {
    id: "sun-ven",
    mdSlug: "surya",
    adSlug: "shukra",
    label: "Sun MD + Venus AD",
    note: "Mutual enemies → authority of soul vs. sensory pleasure.",
  },
  {
    id: "mars-merc-trap",
    mdSlug: "mangala",
    adSlug: "budha",
    label: "Mars MD + Mercury AD",
    note: "Mars treats Mercury as enemy, but Mercury is neutral back — asymmetric, not mutual enmity.",
  },
];

/* ─── Dignity modifiers (modulator, not override) ──────────────────────── */

export const DIGNITY_MODIFIERS: DignityModifier[] = [
  {
    key: "exalted",
    label: "Exalted",
    labelIAST: "Ucca",
    shift: +2,
    description: "Both lords exalted — lifts even a neutral or enemy baseline above its default.",
  },
  {
    key: "own-sign",
    label: "Own sign",
    labelIAST: "Sva",
    shift: +1,
    description: "Both in own signs — strengthens the bhukti-yoga tone by one degree.",
  },
  {
    key: "neutral-sign",
    label: "Neutral sign",
    labelIAST: "Samatā",
    shift: 0,
    description: "Neither strong nor weak — the bhukti-yoga baseline holds unchanged.",
  },
  {
    key: "debilitated",
    label: "Debilitated",
    labelIAST: "Nīca",
    shift: -2,
    description: "Both debilitated — drags even a friendly baseline downward.",
  },
];

/**
 * Compute the modulated quality label given a baseline quality and an aggregate dignity shift.
 * Demonstrates that bhukti-yoga is a modulator, not an override.
 */
export function modulatedLabel(
  baseline: BhuktiQuality,
  aggregateShift: number
): { label: string; color: string; note: string } {
  const score =
    baseline === "auspicious" ? 2 : baseline === "mixed" ? 1 : 0;
  const final = score + aggregateShift;

  if (final >= 3) {
    return {
      label: "Excellent",
      color: "#1E6B3F",
      note: "Dignity lifts the baseline well above the default tone.",
    };
  }
  if (final === 2) {
    return {
      label: "Auspicious",
      color: "#2F7D55",
      note: "At or near the friendly baseline — dignified support.",
    };
  }
  if (final === 1) {
    return {
      label: "Mixed / Mediocre",
      color: "#887A42",
      note: "Neutral zone — dignity and relation balance out.",
    };
  }
  if (final === 0) {
    return {
      label: "Inauspicious",
      color: "#A23A1E",
      note: "Friction dominates — even dignity cannot fully offset the enemy relation.",
    };
  }
  return {
    label: "Difficult",
    color: "#7A1E0E",
    note: "Severely strained — weak lords in an enemy relation compound the hardship.",
  };
}
