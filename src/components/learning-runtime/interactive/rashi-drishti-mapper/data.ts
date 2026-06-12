/**
 * Rāśi-Dṛṣṭi Mapper engine -- Lesson 17.5.2
 *
 * Computes sign-aspects on a live chart, carries occupants and lords
 * across to a target, and detects multi-sign convergence.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SIGN_CLASSES: ("movable" | "fixed" | "dual")[] = [
  "movable", "fixed", "dual", "movable", "fixed", "dual",
  "movable", "fixed", "dual", "movable", "fixed", "dual",
];

export const CLASS_LABELS = {
  movable: "Cara (Movable)",
  fixed: "Sthira (Fixed)",
  dual: "Dvisvabhāva (Dual)",
};

export const LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const GRAHAS = [
  { key: "Su", name: "Sun" },
  { key: "Mo", name: "Moon" },
  { key: "Ma", name: "Mars" },
  { key: "Me", name: "Mercury" },
  { key: "Ju", name: "Jupiter" },
  { key: "Ve", name: "Venus" },
  { key: "Sa", name: "Saturn" },
  { key: "Ra", name: "Rahu" },
  { key: "Ke", name: "Ketu" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

export function getAspectedSigns(signIdx: number): number[] {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "dual") {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "dual" && i !== signIdx);
  }
  if (cls === "movable") {
    const fixed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "fixed");
    const adjacent = (signIdx + 1) % 12;
    return fixed.filter((i) => i !== adjacent);
  }
  const movable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => SIGN_CLASSES[i] === "movable");
  const adjacent = (signIdx - 1 + 12) % 12;
  return movable.filter((i) => i !== adjacent);
}

/** Which signs aspect the given target sign? (Reverse lookup.) */
export function getAspectsToTarget(targetIdx: number): number[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => i !== targetIdx && getAspectedSigns(i).includes(targetIdx));
}

export interface Preset {
  name: string;
  lagna: number;
  occupants: GrahaKey[][];
  target: number;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Lesson example: Ātmakāraka in Aries",
    lagna: 1,
    occupants: [
      ["Me"], [], [], [], ["Su"], [], [], [], [], ["Sa", "Ma"], [], [],
    ],
    target: 0,
    note: "Aries (movable) is aspected by Leo, Scorpio, Aquarius (fixed signs). Leo holds Sun; Scorpio empty; Aquarius holds Saturn + Mars. Multi-sign convergence on Aries.",
  },
  {
    name: "Dual target: Ātmakāraka in Sagittarius",
    lagna: 9,
    occupants: [
      [], [], ["Ju"], [], [], ["Ve"], [], [], [], [], [], [],
    ],
    target: 8,
    note: "Sagittarius (dual) is aspected by Gemini, Virgo, Pisces. Gemini holds Jupiter; Virgo holds Venus; Pisces empty.",
  },
  {
    name: "Adjacent exclusion demo: Cancer target",
    lagna: 4,
    occupants: [
      [], [], [], [], [], [], [], [], [], [], [], [],
    ],
    target: 3,
    note: "Cancer (movable) is aspected by Taurus, Scorpio, Aquarius -- NOT Leo (the adjacent fixed sign).",
  },
  {
    name: "Random explorer",
    lagna: 1,
    occupants: Array.from({ length: 12 }, () => [] as GrahaKey[]),
    target: 0,
    note: "Start from Aries and modify freely.",
  },
];
