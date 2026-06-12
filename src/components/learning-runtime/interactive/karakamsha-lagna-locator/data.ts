/**
 * Kārakāṁśa Lagna Locator engine -- Lesson 17.7.1
 *
 * Walks the three-step Kārakāṁśa identification:
 *  1. Identify the Ātmakāraka (highest within-sign degree among the seven grahas).
 *  2. Read the sign the AK occupies in the navāṁśa (D9).
 *  3. Project that D9 sign onto the rāśi (D1) and treat it as a special lagna.
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

export const GRAHAS = [
  { key: "Su", name: "Sun", iast: "Surya" },
  { key: "Mo", name: "Moon", iast: "Candra" },
  { key: "Ma", name: "Mars", iast: "Mangala" },
  { key: "Me", name: "Mercury", iast: "Budha" },
  { key: "Ju", name: "Jupiter", iast: "Guru" },
  { key: "Ve", name: "Venus", iast: "Shukra" },
  { key: "Sa", name: "Saturn", iast: "Shani" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

export type Degrees = Record<GrahaKey, number>;

export const DEFAULT_DEGREES: Degrees = {
  Su: 11.0,
  Mo: 4.0,
  Ma: 19.0,
  Me: 22.0,
  Ju: 8.0,
  Ve: 27.0,
  Sa: 15.0,
};

export function formatDegree(value: number): string {
  const deg = Math.floor(value);
  const min = Math.round((value - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

export function findAtmakaraka(degrees: Degrees): { key: GrahaKey; name: string; degree: number } {
  let max = -1;
  let ak: GrahaKey = "Su";
  for (const g of GRAHAS) {
    if (degrees[g.key] > max) {
      max = degrees[g.key];
      ak = g.key;
    }
  }
  const planet = GRAHAS.find((g) => g.key === ak)!;
  return { key: ak, name: planet.name, degree: max };
}

export interface Preset {
  name: string;
  lagna: number;
  degrees: Degrees;
  d9Sign: number;
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Venus AK → D9 Capricorn",
    lagna: 1,
    degrees: { Su: 11.0, Mo: 4.0, Ma: 19.0, Me: 22.0, Ju: 8.0, Ve: 27.0, Sa: 15.0 },
    d9Sign: 9, // Capricorn
    note: "Venus has the highest longitude (27°) → Venus is the Ātmakāraka. Its navāṁśa sign is Capricorn, so Capricorn becomes the Kārakāṁśa Lagna on the rāśi.",
  },
  {
    name: "Mercury AK → D9 Pisces",
    lagna: 1,
    degrees: { Su: 11.0, Mo: 4.0, Ma: 19.0, Me: 29.5, Ju: 8.0, Ve: 22.0, Sa: 15.0 },
    d9Sign: 11, // Pisces
    note: "Mercury has the highest longitude (29°30') → Mercury is the Ātmakāraka. Its navāṁśa sign is Pisces, so Pisces becomes the Kārakāṁśa Lagna on the rāśi.",
  },
  {
    name: "Saturn AK → D9 Leo",
    lagna: 4,
    degrees: { Su: 11.0, Mo: 4.0, Ma: 19.0, Me: 22.0, Ju: 8.0, Ve: 20.0, Sa: 28.85 },
    d9Sign: 4, // Leo
    note: "Saturn at 28°51' wins the degree race → Saturn is the Ātmakāraka. Its navāṁśa sign is Leo, so Leo becomes the Kārakāṁśa Lagna.",
  },
  {
    name: "Empty explorer",
    lagna: 1,
    degrees: { Su: 10.0, Mo: 10.0, Ma: 10.0, Me: 10.0, Ju: 10.0, Ve: 10.0, Sa: 10.0 },
    d9Sign: 0,
    note: "Set degrees to rank the kārakas, then select the AK's D9 sign manually.",
  },
];

/** Count houses from karakamshaSign as if it were lagna. */
export function houseFromKarakamsha(karakamshaSign: number, targetSign: number): number {
  const diff = (targetSign - karakamshaSign + 12) % 12;
  return diff + 1;
}
