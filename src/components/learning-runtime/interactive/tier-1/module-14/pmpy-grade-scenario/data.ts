import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { type PmpySlug } from "../pmpy-archetype-explorer/data";

export type PmpyGrade = "pure" | "mixed" | "diluted";

export interface GradeScenario {
  slug: PmpyGrade;
  title: string;
  yoga: PmpySlug;
  placement: string;
  shadbala: number;
  dilutionCount: number;
  support: number;
  grade: string;
  archetype: string;
  overClaim: string;
  dismissive: string;
  honest: string;
  color: string;
}

export const GRADE_SCENARIOS: GradeScenario[] = [
  {
    slug: "pure",
    title: "Pure PMPY",
    yoga: "hamsa",
    placement: "Jupiter exalted in Cancer in the 1st, strong and unafflicted.",
    shadbala: 86,
    dilutionCount: 0,
    support: 84,
    grade: "Full archetype",
    archetype: "The sage expresses cleanly: counsel, protection, dharma, teaching, and wisdom are visible.",
    overClaim: "This person must become universally great.",
    dismissive: "This is just a strong Jupiter, nothing more.",
    honest: "Haṁsa is present in clean form: expect a strong sage-teacher pattern, then time its expression through dasha and chart context.",
    color: grahas.guru.primary,
  },
  {
    slug: "mixed",
    title: "Mixed PMPY",
    yoga: "ruchaka",
    placement: "Mars exalted in Capricorn in the 10th, strong but receiving a hard malefic influence.",
    shadbala: 74,
    dilutionCount: 1,
    support: 64,
    grade: "Usable but tempered",
    archetype: "The warrior is real: courage and command remain, but expression needs discipline and ethical containment.",
    overClaim: "This is flawless command and victory.",
    dismissive: "The affliction cancels Ruchaka completely.",
    honest: "Ruchaka is genuine but tempered by affliction: expect courage and technical force in measured, sometimes pressured form.",
    color: grahas.mangala.primary,
  },
  {
    slug: "diluted",
    title: "Diluted PMPY",
    yoga: "shasha",
    placement: "Saturn exalted in Libra in the 7th, but combust and low in strength.",
    shadbala: 49,
    dilutionCount: 2,
    support: 42,
    grade: "Partial archetype",
    archetype: "The disciplinarian appears as endurance and seriousness, but the full authority signature is muted.",
    overClaim: "This is a complete great-person yoga with major authority.",
    dismissive: "It does not count at all.",
    honest: "Śaśa is present and genuine, but tempered by combustion and weak strength; expect discipline and endurance in measured form.",
    color: grahas.shani.primary,
  },
];

export function getGradeScenario(slug: PmpyGrade) {
  return GRADE_SCENARIOS.find((scenario) => scenario.slug === slug) ?? GRADE_SCENARIOS[0];
}

export function gradeScore(scenario: GradeScenario) {
  return Math.max(0, Math.min(100, Math.round(scenario.shadbala * 0.55 + scenario.support * 0.35 - scenario.dilutionCount * 12 + 18)));
}
