import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { PMPY_ARCHETYPES, type PmpySlug } from "../pmpy-archetype-explorer/data";

export type DilutionFactorSlug = "combustion" | "malefic-affliction" | "low-shadbala" | "weak-dispositor";

export interface DilutionFactor {
  slug: DilutionFactorSlug;
  label: string;
  iast: string;
  weight: number;
  description: string;
  cue: string;
  color: string;
}

export const DILUTION_FACTORS: DilutionFactor[] = [
  {
    slug: "combustion",
    label: "Combustion",
    iast: "Astaṅgata",
    weight: 34,
    description: "The primary dilution: the yoga planet is too close to the Sun and becomes burnt.",
    cue: "Check this first before declaring a clean PMPY.",
    color: grahas.surya.primary,
  },
  {
    slug: "malefic-affliction",
    label: "Malefic affliction",
    iast: "Pāpa sambandha",
    weight: 22,
    description: "Strong malefic conjunction or aspect mars the planet's clean expression.",
    cue: "Read the afflicting planet's strength, dignity, and intent.",
    color: grahas.mangala.primary,
  },
  {
    slug: "low-shadbala",
    label: "Low shadbala",
    iast: "Alpa ṣaḍbala",
    weight: 24,
    description: "The yoga planet fails the strength audit and cannot carry the promise fully.",
    cue: "Use Module 13 thresholds instead of visual guesswork.",
    color: grahas.shani.primary,
  },
  {
    slug: "weak-dispositor",
    label: "Weak dispositor",
    iast: "Durbala rāśi-lord",
    weight: 16,
    description: "The lord of the yoga planet's sign is debilitated, afflicted, or otherwise unable to support it.",
    cue: "A strong tenant still depends on the condition of the sign lord.",
    color: grahas.budha.primary,
  },
];

export const RETROGRADE_BOOST = {
  label: "Retrograde",
  iast: "Vakra / ceṣṭā bala",
  boost: 14,
  description: "Retrogression is not a PMPY dilution. It generally adds strength through ceṣṭā bala.",
  color: grahas.guru.primary,
};

export const DILUTION_PRESETS = [
  {
    label: "Clean yoga",
    yoga: "hamsa" as PmpySlug,
    activeFactors: [] as DilutionFactorSlug[],
    retrograde: false,
    shadbala: 82,
  },
  {
    label: "Combust first",
    yoga: "bhadra" as PmpySlug,
    activeFactors: ["combustion", "low-shadbala"] as DilutionFactorSlug[],
    retrograde: false,
    shadbala: 52,
  },
  {
    label: "Retrograde reinforced",
    yoga: "ruchaka" as PmpySlug,
    activeFactors: ["malefic-affliction"] as DilutionFactorSlug[],
    retrograde: true,
    shadbala: 70,
  },
];

export function getPmpyOptions() {
  return PMPY_ARCHETYPES;
}

export function gradeFromScore(score: number) {
  if (score >= 86) return "Pristine";
  if (score >= 70) return "Usable";
  if (score >= 52) return "Diluted";
  return "Badly diluted";
}
