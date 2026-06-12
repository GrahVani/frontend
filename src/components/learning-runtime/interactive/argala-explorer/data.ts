/**
 * Argala Explorer -- Data Engine
 *
 * Chapter-level interactive for Module 17, Chapter 3 (Argala).
 * Covers all four lessons: concept, positive argala (2/4/11),
 * virodhārgala (12/10/3), and the five-step application workflow.
 */

export const GRAHAS = [
  { key: "Sun", label: "Su", color: "#E8B845" },
  { key: "Moon", label: "Ch", color: "#D8DBE8" },
  { key: "Mars", label: "Ma", color: "#C8412E" },
  { key: "Mercury", label: "Me", color: "#3A8C5A" },
  { key: "Jupiter", label: "Ju", color: "#E89E2A" },
  { key: "Venus", label: "Ve", color: "#A8C8E8" },
  { key: "Saturn", label: "Sa", color: "#2C2C3E" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

export interface ArgalaPair {
  positiveHouse: number; // absolute house number
  positiveLabel: string;
  virodhaHouse: number; // absolute house number
  virodhaLabel: string;
  positiveGrahas: GrahaKey[];
  virodhaGrahas: GrahaKey[];
  positiveCount: number;
  virodhaCount: number;
  net: "positive" | "negative" | "neutral";
  netLabel: string;
}

export interface ArgalaResult {
  referenceHouse: number;
  pairs: ArgalaPair[];
  secondaryPositive: {
    house: number;
    label: string;
    grahas: GrahaKey[];
    count: number;
  };
  totalPositive: number;
  totalVirodha: number;
  overallNet: number;
  overallVerdict: string;
  overallColor: string;
}

function wrapHouse(n: number): number {
  return ((n - 1) % 12) + 1;
}

export function computeArgala(
  referenceHouse: number,
  placements: Partial<Record<GrahaKey, number>>,
): ArgalaResult {
  // Positive argala houses from reference
  const h2 = wrapHouse(referenceHouse + 1);
  const h4 = wrapHouse(referenceHouse + 3);
  const h11 = wrapHouse(referenceHouse + 10);
  const h5 = wrapHouse(referenceHouse + 4); // secondary

  // Virodhārgala houses from reference
  const h12 = wrapHouse(referenceHouse + 11);
  const h10 = wrapHouse(referenceHouse + 9);
  const h3 = wrapHouse(referenceHouse + 2);

  const grahaInHouse = (house: number): GrahaKey[] =>
    (Object.entries(placements) as [GrahaKey, number][])
      .filter(([, h]) => h === house)
      .map(([g]) => g);

  const pair = (posH: number, vH: number, posLabel: string, vLabel: string): ArgalaPair => {
    const posG = grahaInHouse(posH);
    const vG = grahaInHouse(vH);
    const posC = posG.length;
    const vC = vG.length;
    let net: ArgalaPair["net"] = "neutral";
    let netLabel = "Neutral -- equal counts, no net intervention";
    if (posC > vC) {
      net = "positive";
      netLabel = `Survives -- ${posC} vs ${vC}, positive argala prevails`;
    } else if (vC > posC) {
      net = "negative";
      netLabel = `Obstructed -- ${posC} vs ${vC}, virodhārgala prevails`;
    }
    return {
      positiveHouse: posH,
      positiveLabel: posLabel,
      virodhaHouse: vH,
      virodhaLabel: vLabel,
      positiveGrahas: posG,
      virodhaGrahas: vG,
      positiveCount: posC,
      virodhaCount: vC,
      net,
      netLabel,
    };
  };

  const pairs: ArgalaPair[] = [
    pair(h2, h12, "2nd-from-ref", "12th-from-ref (obstructs 2nd)"),
    pair(h4, h10, "4th-from-ref", "10th-from-ref (obstructs 4th)"),
    pair(h11, h3, "11th-from-ref", "3rd-from-ref (obstructs 11th)"),
  ];

  const secG = grahaInHouse(h5);
  const secondaryPositive = {
    house: h5,
    label: "5th-from-ref (secondary)",
    grahas: secG,
    count: secG.length,
  };

  const totalPositive = pairs.reduce((s, p) => s + p.positiveCount, 0) + secondaryPositive.count;
  const totalVirodha = pairs.reduce((s, p) => s + p.virodhaCount, 0);
  const overallNet = totalPositive - totalVirodha;

  let overallVerdict = "Net neutral -- read the house on its other testimonies";
  let overallColor = "#8A7E5E";

  if (overallNet > 0) {
    overallVerdict = `Net positive (+${overallNet}) -- the reference is supported`;
    overallColor = "#2F7D55";
  } else if (overallNet < 0) {
    overallVerdict = `Net negative (${overallNet}) -- the reference is obstructed`;
    overallColor = "#A23A1E";
  }

  return {
    referenceHouse,
    pairs,
    secondaryPositive,
    totalPositive,
    totalVirodha,
    overallNet,
    overallVerdict,
    overallColor,
  };
}

/* --- Presets from worked examples --- */

export interface Preset {
  key: string;
  label: string;
  referenceHouse: number;
  placements: Partial<Record<GrahaKey, number>>;
  description: string;
}

export const PRESETS: Preset[] = [
  {
    key: "lagna-supported",
    label: "Lagna supported (4th argala survives)",
    referenceHouse: 1,
    placements: { Jupiter: 4, Saturn: 10, Venus: 11, Mars: 3 },
    description: "Jupiter in 4th gives positive argala to lagna; Saturn in 10th obstructs it. 11th has Venus, 3rd has Mars. Net: 4th-channel obstructed, 11th-channel neutral.",
  },
  {
    key: "lagna-strong",
    label: "Lagna strongly supported",
    referenceHouse: 1,
    placements: { Jupiter: 4, Moon: 11, Mercury: 2 },
    description: "Planets in 2nd, 4th, and 11th all give positive argala with no obstructors. Strong net positive.",
  },
  {
    key: "seventh-mixed",
    label: "7th house -- mixed (lesson example)",
    referenceHouse: 7,
    placements: { Venus: 8, Mars: 9, Moon: 10 },
    description: "Venus in 8th = 2nd-from-7th (positive). Mars in 9th = 3rd-from-7th (virodha). Moon in 10th = 4th-from-7th (positive). Net +1 positive. 11th-channel unobstructed.",
  },
  {
    key: "tenth-career",
    label: "10th house -- career (lesson example)",
    referenceHouse: 10,
    placements: { Jupiter: 1, Mercury: 8, Saturn: 12 },
    description: "Jupiter in 1st = 4th-from-10th (positive). Mercury in 8th = 11th-from-10th (positive). Saturn in 12th = 3rd-from-10th (virodha obstructs 11th-channel). Net +1 mild positive.",
  },
  {
    key: "fifth-obstructed",
    label: "5th house -- obstructed",
    referenceHouse: 5,
    placements: { Sun: 6, Mars: 7, Saturn: 3 },
    description: "Sun in 6th = 2nd-from-5th (positive). Mars in 7th = 3rd-from-5th (virodha). Saturn in 3rd = 11th-from-5th (positive). 4th-channel empty. Net: 2nd-channel survives, 11th-channel survives. Overall positive.",
  },
  {
    key: "clear",
    label: "No argala configuration",
    referenceHouse: 1,
    placements: { Sun: 6, Mars: 7, Saturn: 9 },
    description: "No planets in any argala or virodhārgala houses relative to the reference. Net neutral.",
  },
];

/* --- Workflow steps --- */

export const WORKFLOW_STEPS = [
  { num: 1, title: "Identify the reference-house", detail: "Fix the single house whose results you intend to judge. Every count is relative to this house." },
  { num: 2, title: "List positive-argala occupants", detail: "Planets in the 2nd, 4th, and 11th from the reference. These strengthen the matter." },
  { num: 3, title: "List virodhārgala occupants", detail: "Planets in the 12th, 10th, and 3rd from the reference. These obstruct." },
  { num: 4, title: "Compute the net intervention", detail: "Compare counts: positive minus obstruction. Stronger side prevails. Equal = neutral." },
  { num: 5, title: "Apply the net to judgement", detail: "Feed the net back into your house reading: supported, obstructed, or neutral. Argala sharpens; it does not replace." },
];
