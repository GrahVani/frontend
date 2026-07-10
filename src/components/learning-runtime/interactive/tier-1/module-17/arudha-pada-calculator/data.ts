/**
 * Upapada Lagna calculator engine -- Lesson 17.4.3
 *
 * Computes the ārūḍha of the 12th house (Upapada Lagna) using the
 * double-count method plus the 1st/7th exception.
 */

export const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

/** Lords of each sign in standard Parāśari order. */
export const LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

export function wrap(n: number): number {
  let m = ((n - 1) % 12) + 1;
  if (m <= 0) m += 12;
  return m;
}

export interface UpapadaResult {
  lagna: number;
  sourceHouse: number;
  sourceLordSign: number;
  lordPos: number;
  n: number;
  firstLanding: number;
  finalPada: number;
  exceptionFired: boolean;
  exceptionType: null | "1st" | "7th";
  secondFromUl: number;
}

export function computeUpapada(lagna: number, lordPos: number): UpapadaResult {
  const sourceHouse = wrap(lagna + 11);
  const sourceLordSign = sourceHouse;
  const n = wrap(lordPos - sourceHouse + 1);
  let landing = wrap(lordPos + n - 1);

  const firstFromSource = sourceHouse;
  const seventhFromSource = wrap(sourceHouse + 6);

  let exceptionFired = false;
  let exceptionType: null | "1st" | "7th" = null;
  const firstLanding = landing;

  if (landing === firstFromSource) {
    exceptionFired = true;
    exceptionType = "1st";
    landing = wrap(landing + 9);
  } else if (landing === seventhFromSource) {
    exceptionFired = true;
    exceptionType = "7th";
    landing = wrap(landing + 9);
  }

  return {
    lagna,
    sourceHouse,
    sourceLordSign,
    lordPos,
    n,
    firstLanding,
    finalPada: landing,
    exceptionFired,
    exceptionType,
    secondFromUl: wrap(landing + 1),
  };
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

export interface Preset {
  name: string;
  lagna: number;
  lordPos: number;
  ulOccupants: GrahaKey[];
  secondOccupants: GrahaKey[];
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Lesson example: Aries Lagna, Jupiter in Cancer",
    lagna: 1,
    lordPos: 4,
    ulOccupants: [],
    secondOccupants: ["Ju"],
    note: "12th = Pisces. Count Pisces to Cancer = 5; count 5 from Cancer to Scorpio. UL = Scorpio, 2nd-from-UL = Sagittarius.",
  },
  {
    name: "1st-exception: Cancer Lagna, Mercury in Gemini",
    lagna: 4,
    lordPos: 3,
    ulOccupants: [],
    secondOccupants: [],
    note: "12th = Gemini. Lord Mercury in Gemini. First count = 1, landing = Gemini (1st from 12th). Exception shifts to Pisces. UL = Pisces.",
  },
  {
    name: "7th-exception: Cancer Lagna, Mercury in Virgo",
    lagna: 4,
    lordPos: 6,
    ulOccupants: [],
    secondOccupants: [],
    note: "12th = Gemini. Lord Mercury in Virgo. Count Gemini to Virgo = 4; count 4 from Virgo to Sagittarius. Sagittarius is 7th from Gemini. Exception shifts to Virgo (10th from Sagittarius). UL = Virgo.",
  },
  {
    name: "Random explorer",
    lagna: 1,
    lordPos: 4,
    ulOccupants: [],
    secondOccupants: [],
    note: "Start from the lesson example and modify Lagna, lord placement, and occupants freely.",
  },
];

// Sign-specific one-line readings for the UL image.
export const UL_SIGN_READING: Record<number, string> = {
  1: "Aries UL suggests an active, independent, initiatory marriage-image; the partner may be direct and energetic.",
  2: "Taurus UL suggests a steady, sensual, materially anchored marriage-image; the partner may be loyal and grounded.",
  3: "Gemini UL suggests a communicative, intellectually varied marriage-image; the partner may be curious and adaptable.",
  4: "Cancer UL suggests a nurturing, emotionally close marriage-image; the partner may be protective and family-oriented.",
  5: "Leo UL suggests a warm, expressive, dignity-conscious marriage-image; the partner may be generous and commanding.",
  6: "Virgo UL suggests a service-oriented, detail-attentive marriage-image; the partner may be practical and discerning.",
  7: "Libra UL suggests a balanced, relationship-focused, aesthetically attuned marriage-image; the partner may be diplomatic and graceful.",
  8: "Scorpio UL suggests an intense, transformative, privacy-guarded marriage-image; the partner may be penetrating and resilient.",
  9: "Sagittarius UL suggests an expansive, principled, freedom-loving marriage-image; the partner may be philosophical and adventurous.",
  10: "Capricorn UL suggests a responsible, structured, long-term marriage-image; the partner may be ambitious and reserved.",
  11: "Aquarius UL suggests an unconventional, friendship-based, idealistic marriage-image; the partner may be independent and original.",
  12: "Pisces UL suggests a compassionate, fluid, spiritually tinted marriage-image; the partner may be sensitive and imaginative.",
};

// 2nd-from-UL sustenance reading keyed by occupant nature.
export function sustenanceReadings(secondOccupants: GrahaKey[]): string {
  if (secondOccupants.length === 0) {
    return "No grahas in the 2nd-from-UL leaves the sustenance of the marriage neutral -- look to the sign and its lord for the full picture.";
  }
  const benefics = secondOccupants.filter((k) => GRAHAS.find((g) => g.key === k)?.nature === "benefic").length;
  const malefics = secondOccupants.filter((k) => GRAHAS.find((g) => g.key === k)?.nature === "malefic").length;
  if (benefics > 0 && malefics === 0) {
    return "Benefic presence in the 2nd-from-UL supports the sustenance and continuity of the marriage.";
  }
  if (malefics > 0 && benefics === 0) {
    return "Malefic presence in the 2nd-from-UL places stress on the marriage's durability; weigh against supporting factors.";
  }
  return "Mixed benefic and malefic presence in the 2nd-from-UL gives a contested picture for the marriage's sustenance.";
}
