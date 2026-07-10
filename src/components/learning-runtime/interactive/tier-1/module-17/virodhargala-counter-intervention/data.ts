/**
 * Virodhārgala Counter-Intervention -- Data Engine
 *
 * Lesson 17.3.3 interactive: obstruction pairs, net-effect computation,
 * and survives-vs-obstructed scenarios.
 */

export function wrapHouse(n: number): number {
  return ((n - 1) % 12) + 1;
}

export interface PairResult {
  positiveHouse: number;
  virodhaHouse: number;
  positiveLabel: string;
  virodhaLabel: string;
  positiveCount: number;
  virodhaCount: number;
  net: "positive" | "negative" | "neutral";
  netLabel: string;
}

export function computePairs(reference: number, positiveCounts: [number, number, number], virodhaCounts: [number, number, number]): PairResult[] {
  const h2 = wrapHouse(reference + 1);
  const h4 = wrapHouse(reference + 3);
  const h11 = wrapHouse(reference + 10);
  const h12 = wrapHouse(reference + 11);
  const h10 = wrapHouse(reference + 9);
  const h3 = wrapHouse(reference + 2);

  const pairs: PairResult[] = [];
  const data: [number, number, string, string, number, number][] = [
    [h2, h12, "2nd", "12th", positiveCounts[0], virodhaCounts[0]],
    [h4, h10, "4th", "10th", positiveCounts[1], virodhaCounts[1]],
    [h11, h3, "11th", "3rd", positiveCounts[2], virodhaCounts[2]],
  ];

  for (const [posH, vH, posL, vL, posC, vC] of data) {
    let net: PairResult["net"] = "neutral";
    let netLabel = "Neutral -- equal counts";
    if (posC > vC) {
      net = "positive";
      netLabel = `Survives -- ${posC} vs ${vC}`;
    } else if (vC > posC) {
      net = "negative";
      netLabel = `Obstructed -- ${posC} vs ${vC}`;
    }
    pairs.push({ positiveHouse: posH, virodhaHouse: vH, positiveLabel: posL, virodhaLabel: vL, positiveCount: posC, virodhaCount: vC, net, netLabel });
  }

  return pairs;
}

/* --- Scenarios --- */

export interface Scenario {
  key: string;
  label: string;
  reference: number;
  positiveCounts: [number, number, number];
  virodhaCounts: [number, number, number];
  description: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "s1",
    label: "Cancelled 4th-argala",
    reference: 1,
    positiveCounts: [0, 1, 0],
    virodhaCounts: [0, 2, 0],
    description: "One benefic in the 4th gives positive argala to the lagna, but two malefics in the 10th obstruct it. The virodhārgala prevails.",
  },
  {
    key: "s2",
    label: "Surviving 11th-argala",
    reference: 1,
    positiveCounts: [0, 0, 2],
    virodhaCounts: [0, 0, 1],
    description: "Two planets in the 11th give strong positive argala. One planet in the 3rd cannot fully obstruct it. Net positive survives.",
  },
  {
    key: "s3",
    label: "All clear",
    reference: 7,
    positiveCounts: [1, 1, 0],
    virodhaCounts: [0, 0, 0],
    description: "Planets in the 2nd and 4th from the 7th give positive argala. No obstructors in any counter-house. All argala survives.",
  },
  {
    key: "s4",
    label: "Mixed net",
    reference: 10,
    positiveCounts: [1, 1, 1],
    virodhaCounts: [1, 0, 1],
    description: "2nd-channel neutralised (1 vs 1). 4th-channel survives (1 vs 0). 11th-channel neutralised (1 vs 1). Net: one surviving channel.",
  },
  {
    key: "s5",
    label: "Fully obstructed",
    reference: 5,
    positiveCounts: [1, 0, 1],
    virodhaCounts: [2, 0, 2],
    description: "Positive argala in 2nd and 11th, but stronger virodhārgala in both counters. All channels obstructed.",
  },
];

/* --- Traps --- */

export interface Trap {
  key: string;
  statement: string;
  error: string;
  correction: string;
}

export const TRAPS: Trap[] = [
  { key: "t1", statement: "The 3rd obstructs the 2nd-argala.", error: "Wrong pair.", correction: "The 12th obstructs the 2nd. The 3rd obstructs the 11th. Each obstructor has exactly one target." },
  { key: "t2", statement: "I found positive argala -- the house is reinforced. No need to check further.", error: "Ignoring virodhārgala entirely.", correction: "Always check the counter-house. The house receives only the NET intervention." },
  { key: "t3", statement: "Add all planets in positive and virodha houses together -- more total planets = stronger argala.", error: "Adding instead of comparing.", correction: "Net = positive MINUS obstruction. The 10th's occupant works AGAINST the 4th's argala, not with it." },
  { key: "t4", statement: "Cancelled argala means the house is destroyed.", error: "Over-reading cancellation.", correction: "Cancelled argala means promised reinforcement does not arrive. The house's own significations remain intact." },
];
