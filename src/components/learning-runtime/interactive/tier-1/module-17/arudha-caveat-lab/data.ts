/**
 * Ārūḍha Caveat Lab engine -- Lesson 17.4.5
 *
 * Computes a single ārūḍha pada with full exception handling,
 * dual-lordship convention switching (Scorpio/Aquarius),
 * and step-by-step trace for pedagogy.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

/** Standard Parāśarī lords. */
export const PARASHARI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

/** Jaimini cara-lordship variant -- Scorpio -> Ketu, Aquarius -> Rāhu. */
export const JAIMINI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Ketu", "Jupiter", "Saturn", "Rahu", "Jupiter",
];

export function wrap(n: number): number {
  let m = ((n - 1) % 12) + 1;
  if (m <= 0) m += 12;
  return m;
}

export type Convention = "parashari" | "jaimini";

export interface CaveatResult {
  house: number;
  convention: Convention;
  lordSign: number; // sign whose lord we count to
  lordName: string;
  lordPos: number; // actual placement of that lord
  n: number;
  landing: number;
  exceptionFired: boolean;
  exceptionType: null | "1st" | "7th";
  correctedPada: number;
  shiftFrom: number;
}

export function computeCaveat(
  house: number,
  lordPos: number,
  convention: Convention
): CaveatResult {
  const lordName = convention === "jaimini" ? JAIMINI_LORDS[house - 1] : PARASHARI_LORDS[house - 1];
  const n = wrap(lordPos - house + 1);
  const landing = wrap(lordPos + n - 1);

  const firstFromHouse = house;
  const seventhFromHouse = wrap(house + 6);

  let exceptionFired = false;
  let exceptionType: null | "1st" | "7th" = null;

  if (landing === firstFromHouse) {
    exceptionFired = true;
    exceptionType = "1st";
  } else if (landing === seventhFromHouse) {
    exceptionFired = true;
    exceptionType = "7th";
  }

  const correctedPada = exceptionFired ? wrap(landing + 9) : landing;

  return {
    house,
    convention,
    lordSign: house,
    lordName,
    lordPos,
    n,
    landing,
    exceptionFired,
    exceptionType,
    correctedPada,
    shiftFrom: landing,
  };
}

export function isDualLordship(house: number): boolean {
  return house === 8 || house === 11; // Scorpio (8) or Aquarius (11)
}

export const PRESETS = [
  {
    name: "1st-exception: Aries lord in Aries",
    house: 1,
    lordPos: 1,
    convention: "parashari" as Convention,
    note: "Lord in own house. Count Aries->Aries = 1; count 1 from Aries = Aries (1st). Exception shifts to Capricorn (10th from Aries).",
  },
  {
    name: "7th-exception: lord in 7th from house",
    house: 1,
    lordPos: 7,
    convention: "parashari" as Convention,
    note: "Aries lord in Libra (7th). Count Aries->Libra = 7; count 7 from Libra = Aries (1st). Wait -- let me recalculate.",
  },
  {
    name: "4th->7th trigger: Cancer lord in Libra",
    house: 4,
    lordPos: 7,
    convention: "parashari" as Convention,
    note: "Cancer lord (Moon) in Libra (4th from Cancer). Count Cancer->Libra = 4; count 4 from Libra = Capricorn. Capricorn is 7th from Cancer. Exception shifts to Libra (10th from Capricorn).",
  },
  {
    name: "Dual-lordship: Scorpio, Mars in Pisces vs Ketu in Cancer",
    house: 8,
    lordPos: 12,
    convention: "parashari" as Convention,
    note: "Parāśarī: Mars in Pisces. Count Scorpio->Pisces = 5; count 5 from Pisces = Cancer. No exception.",
  },
  {
    name: "Dual-lordship: Aquarius, Saturn in Aries vs Rahu in Gemini",
    house: 11,
    lordPos: 1,
    convention: "parashari" as Convention,
    note: "Parāśarī: Saturn in Aries. Count Aquarius->Aries = 3; count 3 from Aries = Gemini. No exception.",
  },
];

// Fix the 7th-exception preset.
PRESETS[1] = {
  name: "7th-exception: Taurus lord in Scorpio",
  house: 2,
  lordPos: 8,
  convention: "parashari" as Convention,
  note: "Taurus lord (Venus) in Scorpio (7th from Taurus). Count Taurus->Scorpio = 7; count 7 from Scorpio = Taurus (1st). Exception shifts to Aquarius (10th from Taurus).",
};
