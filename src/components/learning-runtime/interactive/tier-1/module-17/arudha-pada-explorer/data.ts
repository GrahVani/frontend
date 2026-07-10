/**
 * Ārūḍha Pāda Explorer engine -- Lesson 17.4.4
 *
 * Computes all twelve ārūḍha padas, models occupant/aspect effects,
 * and provides image-vs-reality divergence readings.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export function wrap(n: number): number {
  let m = ((n - 1) % 12) + 1;
  if (m <= 0) m += 12;
  return m;
}

export interface PadaResult {
  house: number;
  lordPos: number;
  n: number;
  firstLanding: number;
  finalPada: number;
  exceptionFired: boolean;
  exceptionType: null | "1st" | "7th";
}

export function computePada(house: number, lordPos: number): PadaResult {
  const n = wrap(lordPos - house + 1);
  let landing = wrap(lordPos + n - 1);
  const firstFromHouse = house;
  const seventhFromHouse = wrap(house + 6);
  let exceptionFired = false;
  let exceptionType: null | "1st" | "7th" = null;
  const firstLanding = landing;

  if (landing === firstFromHouse) {
    exceptionFired = true;
    exceptionType = "1st";
    landing = wrap(landing + 9);
  } else if (landing === seventhFromHouse) {
    exceptionFired = true;
    exceptionType = "7th";
    landing = wrap(landing + 9);
  }

  return { house, lordPos, n, firstLanding, finalPada: landing, exceptionFired, exceptionType };
}

export function computeAllPadas(lagna: number, lordPositions: number[]): PadaResult[] {
  return Array.from({ length: 12 }, (_, i) => {
    const house = wrap(lagna + i);
    return computePada(house, lordPositions[i]);
  });
}

export const GRAHAS = [
  { key: "Su", name: "Sun", nature: "malefic" },
  { key: "Mo", name: "Moon", nature: "benefic" },
  { key: "Ma", name: "Mars", nature: "malefic" },
  { key: "Me", name: "Mercury", nature: "neutral" },
  { key: "Ju", name: "Jupiter", nature: "benefic" },
  { key: "Ve", name: "Venus", nature: "benefic" },
  { key: "Sa", name: "Saturn", nature: "malefic" },
  { key: "Ra", name: "Rahu", nature: "malefic" },
  { key: "Ke", name: "Ketu", nature: "malefic" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

export interface HouseSig {
  reality: string;
  image: string;
}

export const HOUSE_SIGS: HouseSig[] = [
  { reality: "Physical self, body, health, innate temperament", image: "Social image, reputation, how the world sees the native (AL)" },
  { reality: "Wealth, family, speech, accumulated resources", image: "Wealth-image, perceived prosperity, family reputation (A2)" },
  { reality: "Siblings, courage, initiative, short travels", image: "Image among siblings / peers, perceived boldness (A3)" },
  { reality: "Home, mother, vehicles, emotional roots", image: "Image of home-life, perceived stability / comfort (A4)" },
  { reality: "Children, intelligence, past merit, speculation", image: "Image of creativity, perceived wisdom / luck (A5)" },
  { reality: "Disease, enemies, debts, obstacles, service", image: "Image of conflict, perceived struggle or resilience (A6)" },
  { reality: "Marriage, partnership, contracts, open enemies", image: "Image of partnerships, perceived relationship quality (A7)" },
  { reality: "Longevity, transformation, occult, inheritance", image: "Image of mystery, perceived depth / crisis-handling (A8)" },
  { reality: "Dharma, higher learning, father, fortune", image: "Image of righteousness, perceived wisdom / luck (A9)" },
  { reality: "Career, status, public action, authority", image: "Career-image, perceived success / authority (A10)" },
  { reality: "Gains, elder siblings, networks, aspirations", image: "Gains-image, perceived social reach / prosperity (A11)" },
  { reality: "Loss, liberation, bed-pleasures, foreign lands", image: "Spouse / marriage image (Upapada / A12)" },
];

export type FocusMode = "general" | "marriage" | "wealth" | "career" | "gains";

export interface FocusConfig {
  key: FocusMode;
  label: string;
  padaIndices: number[]; // 0-based A1-A12 indices
  question: string;
}

export const FOCUS_MODES: FocusConfig[] = [
  { key: "general", label: "General (AL)", padaIndices: [0], question: "How is this native seen by the world?" },
  { key: "marriage", label: "Marriage (AL + UL)", padaIndices: [0, 11], question: "What is the marriage-image, and how does it sit against the native's social image?" },
  { key: "wealth", label: "Wealth (AL + A2)", padaIndices: [0, 1], question: "How does the wealth-image compare with real wealth, and what is the social reputation around money?" },
  { key: "career", label: "Career (AL + A10)", padaIndices: [0, 9], question: "How is the native's career and public success perceived?" },
  { key: "gains", label: "Gains (AL + A11)", padaIndices: [0, 10], question: "What is the image of gains, networks, and social reach?" },
];

export function occupantNatureScore(keys: GrahaKey[]): number {
  if (keys.length === 0) return 0;
  let score = 0;
  for (const k of keys) {
    const g = GRAHAS.find((x) => x.key === k);
    if (!g) continue;
    if (g.nature === "benefic") score += 1;
    else if (g.nature === "malefic") score -= 1;
  }
  return score;
}

export function imageReading(padaIndex: number, score: number): string {
  const sig = HOUSE_SIGS[padaIndex];
  if (score > 0) {
    return `The ${sig.image} is projected favourably -- benefic influence lends dignity, ease, and a positive reputation to this area.`;
  }
  if (score < 0) {
    return `The ${sig.image} is projected harshly -- malefic influence lends severity, struggle, or a constrained reputation to this area.`;
  }
  return `The ${sig.image} is neutral -- no strong planetary colouring; the projection rests on the sign and its lord.`;
}

export function divergencePhrase(padaIndex: number, padaScore: number): string {
  const sig = HOUSE_SIGS[padaIndex];
  if (padaScore > 0) {
    return `Image exceeds reality: the ${sig.image} reads better than the underlying ${sig.reality.toLowerCase()}.`;
  }
  if (padaScore < 0) {
    return `Reality exceeds image: the ${sig.reality.toLowerCase()} is sounder than the ${sig.image.toLowerCase()} projects.`;
  }
  return `Image and reality are in balance for the ${sig.reality.toLowerCase()}.`;
}

export const PRESETS = [
  {
    name: "Lesson example: Aries Lagna",
    lagna: 1,
    lordPositions: [5, 3, 7, 10, 1, 9, 11, 2, 6, 12, 8, 4],
    occupants: [
      ["Ve"], ["Sa"], [], [], ["Ju"], [], [], ["Ma"], [], [], [], ["Mo"],
    ] as GrahaKey[][],
  },
  {
    name: "Image-above-reality: strong A2, weak AL",
    lagna: 3,
    lordPositions: [6, 9, 11, 1, 3, 5, 7, 10, 12, 2, 4, 8],
    occupants: [
      ["Sa"], ["Ju", "Ve"], [], [], [], [], [], [], [], [], [], [],
    ] as GrahaKey[][],
  },
  {
    name: "Malefic-laden UL: Leo Lagna",
    lagna: 5,
    lordPositions: [8, 10, 12, 2, 4, 6, 9, 11, 1, 3, 5, 7],
    occupants: [
      [], [], [], [], [], [], [], [], [], [], [], ["Sa", "Ma"],
    ] as GrahaKey[][],
  },
  {
    name: "Random explorer",
    lagna: 1,
    lordPositions: [5, 3, 7, 10, 1, 9, 11, 2, 6, 12, 8, 4],
    occupants: Array.from({ length: 12 }, () => [] as GrahaKey[]),
  },
];
