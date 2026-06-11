/**
 * Twelve Ārūḍha Padas -- Data Engine
 *
 * Lesson 17.4.2 interactive: compute all twelve ārūḍha padas
 * from a Lagna and twelve lord positions, with significations
 * and AL/UL emphasis.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function wrap(n: number): number {
  return ((n - 1) % 12) + 1;
}

export interface PadaResult {
  house: number;
  lordPos: number;
  n: number;
  firstLanding: number;
  finalPada: number;
  exceptionFired: boolean;
}

export function computePada(house: number, lordPos: number): PadaResult {
  const n = wrap(lordPos - house + 1);
  let landing = wrap(lordPos + n - 1);
  const firstFromHouse = house;
  const seventhFromHouse = wrap(house + 6);
  let exceptionFired = false;
  let originalLanding: number | null = null;

  if (landing === firstFromHouse || landing === seventhFromHouse) {
    exceptionFired = true;
    originalLanding = landing;
    landing = wrap(landing + 9);
  }

  return {
    house,
    lordPos,
    n,
    firstLanding: originalLanding ?? landing,
    finalPada: landing,
    exceptionFired,
  };
}

export const HOUSE_SIGNIFICATIONS = [
  { house: 1, reality: "Self, body, innate nature", pada: "Image of the self (AL)" },
  { house: 2, reality: "Wealth, family, speech", pada: "Image of wealth / family status" },
  { house: 3, reality: "Courage, siblings, effort", pada: "Image of courage / sibling standing" },
  { house: 4, reality: "Home, mother, roots", pada: "Image of stability / home status" },
  { house: 5, reality: "Children, intelligence, creativity", pada: "Image of intelligence / children's standing" },
  { house: 6, reality: "Disease, enemies, service", pada: "Image of struggle / enemy perception" },
  { house: 7, reality: "Marriage, partnerships", pada: "Image of marriage / partner's standing" },
  { house: 8, reality: "Hidden matters, longevity", pada: "Image of mystery / crisis perception" },
  { house: 9, reality: "Fortune, dharma, teacher", pada: "Image of wisdom / teacher's standing" },
  { house: 10, reality: "Career, status, action", pada: "Image of status / professional standing" },
  { house: 11, reality: "Gains, friends, elder siblings", pada: "Image of prosperity / network" },
  { house: 12, reality: "Loss, liberation, bed-pleasures", pada: "Upapada (UL) -- spouse / marriage image" },
];

export type LordPattern = "own" | "fifth" | "seventh" | "eleventh" | "random" | "custom";

export const PATTERNS: { key: LordPattern; label: string; description: string; get: (lagna: number) => number[] }[] = [
  {
    key: "own",
    label: "Lords in own signs",
    description: "Every house lord sits in its own sign. The 1st/7th exception always fires; every pada lands in the 10th from its house.",
    get: (lagna) => Array.from({ length: 12 }, (_, i) => wrap(lagna + i)),
  },
  {
    key: "fifth",
    label: "Lords in 5th from houses",
    description: "Every lord sits in the 5th from its house. n=5 for all; each pada lands in the 9th from its house.",
    get: (lagna) => Array.from({ length: 12 }, (_, i) => wrap(wrap(lagna + i) + 4)),
  },
  {
    key: "seventh",
    label: "Lords in 7th from houses",
    description: "Every lord sits in the 7th from its house. The 1st exception always fires; every pada lands in the 10th.",
    get: (lagna) => Array.from({ length: 12 }, (_, i) => wrap(wrap(lagna + i) + 6)),
  },
  {
    key: "eleventh",
    label: "Lords in 11th from houses",
    description: "Every lord sits in the 11th from its house. n=11; each pada lands in the 9th.",
    get: (lagna) => Array.from({ length: 12 }, (_, i) => wrap(wrap(lagna + i) + 10)),
  },
  {
    key: "random",
    label: "Mixed realistic",
    description: "A varied set of lord positions showing different pada outcomes.",
    get: () => [5, 3, 7, 10, 1, 9, 11, 2, 6, 12, 8, 4], // fixed varied pattern
  },
  {
    key: "custom",
    label: "Custom",
    description: "Set each lord position manually.",
    get: () => [],
  },
];

export const PRESET_LABELS = [
  "Aries rising, varied lords",
  "Taurus rising, lords in 5th",
  "Cancer rising, lords in own",
  "Libra rising, lords in 11th",
];
