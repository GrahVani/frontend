/**
 * Ārūḍha Pāda Finder -- Data Engine
 *
 * Lesson 17.4.1 interactive: double-count computation,
 * 1st/7th exception detection, and reality-vs-perception comparison.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function wrap(n: number): number {
  return ((n - 1) % 12) + 1;
}

export interface ArudhaResult {
  house: number;
  lord: number;
  n: number;
  firstLanding: number;
  finalPada: number;
  exceptionFired: boolean;
  exceptionType: "none" | "first" | "seventh";
  shiftedFrom: number | null;
}

export function computeArudha(house: number, lord: number): ArudhaResult {
  // Step 1: count from house to lord (inclusive)
  const n = wrap(lord - house + 1);

  // Step 2: count n from lord
  let landing = wrap(lord + n - 1);

  // Check exception: landing is 1st or 7th from house
  const firstFromHouse = house;
  const seventhFromHouse = wrap(house + 6);

  let exceptionFired = false;
  let exceptionType: ArudhaResult["exceptionType"] = "none";
  let shiftedFrom: number | null = null;

  if (landing === firstFromHouse) {
    exceptionFired = true;
    exceptionType = "first";
    shiftedFrom = landing;
    landing = wrap(landing + 9); // 10th from landing
  } else if (landing === seventhFromHouse) {
    exceptionFired = true;
    exceptionType = "seventh";
    shiftedFrom = landing;
    landing = wrap(landing + 9); // 10th from landing
  }

  return {
    house,
    lord,
    n,
    firstLanding: shiftedFrom ?? landing,
    finalPada: landing,
    exceptionFired,
    exceptionType,
    shiftedFrom,
  };
}

/* --- Presets --- */

export interface Preset {
  key: string;
  label: string;
  house: number;
  lord: number;
  description: string;
}

export const PRESETS: Preset[] = [
  {
    key: "ex1",
    label: "Example 1: AL from Aries",
    house: 1,
    lord: 5,
    description: "Aries rising, Mars in Leo. n=5. Count 5 from Leo = Sagittarius. No exception. AL = Sagittarius.",
  },
  {
    key: "ex2",
    label: "Example 2: Exception (7th)",
    house: 1,
    lord: 4,
    description: "Lord in 4th from house. n=4. Count 4 from 4th = 7th (Libra). 7th is prohibited. Shift to 10th from 7th = 4th (Cancer).",
  },
  {
    key: "ex3",
    label: "Exception (1st) -- lord in 7th",
    house: 1,
    lord: 7,
    description: "Lord in 7th from house. n=7. Count 7 from 7th = 1st (Aries). 1st is prohibited. Shift to 10th from 1st = 10th (Capricorn).",
  },
  {
    key: "ex4",
    label: "Lord in own house",
    house: 1,
    lord: 1,
    description: "Lord in its own sign (Aries). n=1. Count 1 from Aries = Aries. 1st is prohibited. Shift to 10th from 1st = 10th (Capricorn).",
  },
  {
    key: "ex5",
    label: "Wide gap -- lord in 11th",
    house: 1,
    lord: 11,
    description: "Lord in 11th from house (Aquarius). n=11. Count 11 from 11th = 9th (Sagittarius). No exception. AL = Sagittarius.",
  },
  {
    key: "ex6",
    label: "7th house reference",
    house: 7,
    lord: 11,
    description: "Reference = 7th (Libra), lord in 11th (Aquarius). n=5. Count 5 from 11th = 3rd (Gemini). No exception. Ārūḍha of 7th = Gemini.",
  },
];

/* --- Reality vs perception pairs --- */

export const REALITY_PERCEPTION = [
  { house: 1, reality: "The self, body, innate nature", perception: "How others see you, your public image" },
  { house: 2, reality: "Actual wealth, family, speech", perception: "How wealthy you seem, family's reputation" },
  { house: 3, reality: "Courage, siblings, effort", perception: "Image of courage, sibling standing" },
  { house: 4, reality: "Home, mother, roots", perception: "Perceived stability, mother's image" },
  { house: 5, reality: "Children, intelligence, creativity", perception: "Image of intelligence, children's standing" },
  { house: 6, reality: "Disease, enemies, service", perception: "Perceived struggles, enemy image" },
  { house: 7, reality: "Real marriage, partnerships", perception: "Image of marriage, partner's standing" },
  { house: 8, reality: "Hidden matters, longevity, transformation", perception: "Perceived mystery, crisis image" },
  { house: 9, reality: "Fortune, dharma, teacher", perception: "Image of wisdom, teacher's standing" },
  { house: 10, reality: "Real career, status, action", perception: "Perceived status, professional image" },
  { house: 11, reality: "Real gains, friends, elder siblings", perception: "Image of prosperity, network standing" },
  { house: 12, reality: "Loss, liberation, bed-pleasures", perception: "Image of renunciation, foreign standing" },
];
