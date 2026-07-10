import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface CancerLordRow {
  house: number;
  family: "kendra" | "trikona" | "both";
  lord: GrahaSlug;
  sign: string;
  note: string;
}

export interface WorkedRajaYoga {
  slug: string;
  title: string;
  pattern: string;
  relationship: string;
  houses: number[];
  lords: GrahaSlug[];
  result: string;
}

export const CANCER_LORDS: CancerLordRow[] = [
  { house: 1, family: "both", lord: "candra", sign: "Karka", note: "Lagna lord; both kendra and trikona." },
  { house: 4, family: "kendra", lord: "shukra", sign: "Tula", note: "Angle lord; not used in the four marked yogas." },
  { house: 5, family: "trikona", lord: "mangala", sign: "Vrishchika", note: "Mars rules the 5th and becomes yogakaraka through the 10th." },
  { house: 7, family: "kendra", lord: "shani", sign: "Makara", note: "Saturn aspects the 9th lord Jupiter in this worked chart." },
  { house: 9, family: "trikona", lord: "guru", sign: "Mina", note: "Jupiter is the 9th lord, conjunct Mars in the 5th." },
  { house: 10, family: "kendra", lord: "mangala", sign: "Mesha", note: "Mars also rules the 10th: Cancer's yogakaraka." },
];

export const CHART_PLACEMENTS = [
  { house: 5, grahas: ["mangala", "guru"] as GrahaSlug[], label: "Mars + Jupiter" },
  { house: 10, grahas: ["shani"] as GrahaSlug[], label: "Saturn" },
];

export const WORKED_RAJA_YOGAS: WorkedRajaYoga[] = [
  {
    slug: "trikona-trikona",
    title: "Mars + Jupiter conjunction",
    pattern: "5th lord Mars conjunct 9th lord Jupiter",
    relationship: "Conjunction in the 5th house",
    houses: [5, 9],
    lords: ["mangala", "guru"],
    result: "Two dharma-trine lords unite, enriching merit, intelligence, guidance, and authority.",
  },
  {
    slug: "yogakaraka",
    title: "Mars as yogakaraka",
    pattern: "Mars owns the 5th and 10th",
    relationship: "One planet carries trikona grace and kendra power",
    houses: [5, 10],
    lords: ["mangala"],
    result: "Mars is a raja yoga in one body for Cancer lagna.",
  },
  {
    slug: "dharma-karmadhipati",
    title: "Dharma-Karmadhipati",
    pattern: "10th lord Mars relates to 9th lord Jupiter",
    relationship: "Conjunction through Mars and Jupiter in the 5th",
    houses: [9, 10],
    lords: ["mangala", "guru"],
    result: "Fortune meets action: the most prized specific raja-yoga bridge.",
  },
  {
    slug: "saturn-jupiter",
    title: "Saturn aspecting Jupiter",
    pattern: "7th lord Saturn aspects 9th lord Jupiter",
    relationship: "Kendra lord aspecting trikona lord",
    houses: [7, 9, 10],
    lords: ["shani", "guru"],
    result: "A kendra-trikona relationship adds another raja-yoga line.",
  },
];

export const DEFAULT_STRENGTHS: Record<GrahaSlug, number> = {
  surya: 50,
  candra: 58,
  mangala: 78,
  budha: 50,
  guru: 74,
  shukra: 52,
  shani: 62,
  rahu: 50,
  ketu: 50,
};

export function deliveryScore(yoga: WorkedRajaYoga, strengths: Record<GrahaSlug, number>) {
  const sum = yoga.lords.reduce((total, lord) => total + strengths[lord], 0);
  return Math.round(sum / yoga.lords.length);
}

export function deliveryBand(score: number) {
  if (score >= 75) return { label: "strong delivery potential", color: grahas.budha.primary };
  if (score >= 60) return { label: "moderate delivery potential", color: grahas.guru.primary };
  return { label: "identified, but underpowered", color: grahas.mangala.primary };
}

export function grahaName(slug: GrahaSlug) {
  return grahas[slug].iast;
}
