/**
 * Iṣṭa-Devatā Finder engine -- Lesson 17.7.3
 *
 * Rule: count the 12th house from the Kārakāṁśa Lagna.
 * Read the planet there; if empty, read the sign-lord.
 * Map the planet to its deity via the standard Jaimini correspondence.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const GRAHAS = [
  { key: "Su", name: "Sun", iast: "Surya" },
  { key: "Mo", name: "Moon", iast: "Candra" },
  { key: "Ma", name: "Mars", iast: "Mangala" },
  { key: "Me", name: "Mercury", iast: "Budha" },
  { key: "Ju", name: "Jupiter", iast: "Guru" },
  { key: "Ve", name: "Venus", iast: "Shukra" },
  { key: "Sa", name: "Saturn", iast: "Shani" },
  { key: "Ra", name: "Rahu", iast: "Rahu" },
  { key: "Ke", name: "Ketu", iast: "Ketu" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

/* --- Planet-to-deity correspondence --- */

export interface DeityMapping {
  planet: string;
  deity: string;
  note: string;
}

export const DEITY_MAP: Record<string, DeityMapping> = {
  Su: { planet: "Sun (Surya)", deity: "Śiva", note: "Also Sūrya himself" },
  Mo: { planet: "Moon (Candra)", deity: "Pārvatī / Gaurī", note: "The divine mother" },
  Ma: { planet: "Mars (Maṅgala)", deity: "Skanda / Kārttikeya", note: "Also Subrahmaṇya" },
  Me: { planet: "Mercury (Budha)", deity: "Viṣṇu", note: "The preserving deity" },
  Ju: { planet: "Jupiter (Guru)", deity: "Vāmana / Viṣṇu", note: "Also Brahmā" },
  Ve: { planet: "Venus (Śukra)", deity: "Lakṣmī", note: "Wealth and grace" },
  Sa: { planet: "Saturn (Śani)", deity: "Brahmā", note: "Also the Kūrma (tortoise) avatāra" },
  Ra: { planet: "Rāhu", deity: "Durgā", note: "The protective goddess" },
  Ke: { planet: "Ketu", deity: "Gaṇeśa", note: "Remover of obstacles" },
};

/* --- Lord-to-key lookup for empty-house fallback --- */

const LORD_KEY: Record<string, GrahaKey> = {
  Mars: "Ma", Venus: "Ve", Mercury: "Me", Moon: "Mo",
  Sun: "Su", Jupiter: "Ju", Saturn: "Sa",
};

export function getDeityForPlanet(key: GrahaKey): DeityMapping {
  return DEITY_MAP[key] ?? { planet: key, deity: "Unknown", note: "" };
}

export function getDeityForLord(lordName: string): DeityMapping | null {
  const key = LORD_KEY[lordName];
  if (!key) return null;
  return getDeityForPlanet(key);
}

/* --- 12th-from-KL --- */

export function twelfthFromKarakamsha(klSign: number): number {
  return (klSign - 1 + 12) % 12;
}

/* --- Rāśi-dṛṣṭi engine (for aspecting fallback) --- */

export const SIGN_CLASSES: ("movable" | "fixed" | "dual")[] = [
  "movable", "fixed", "dual", "movable", "fixed", "dual",
  "movable", "fixed", "dual", "movable", "fixed", "dual",
];

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

export function getAspectsToTarget(targetIdx: number): number[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => i !== targetIdx && getAspectedSigns(i).includes(targetIdx));
}

/* --- Presets --- */

export interface Preset {
  name: string;
  klSign: number;
  occupants: GrahaKey[][];
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Aries KL — Venus in Pisces (12th)",
    klSign: 0, // Aries
    occupants: [
      [], [], [], [], [], [], [], [], [], [], [], ["Ve"], // 11 Pisces <- Venus
    ],
    note: "12th from Aries is Pisces. Venus occupies it → Lakṣmī.",
  },
  {
    name: "Leo KL — empty Cancer (12th)",
    klSign: 4, // Leo
    occupants: [
      [], [], [], [],        // 0-3
      [], [], [],            // 4-6 (Leo KL, Virgo empty, Libra empty)
      [], [], [], [], [], [], // 7-11 (Scorpio empty... Pisces empty)
    ],
    note: "12th from Leo is Cancer. Empty → read lord Moon → Pārvatī / Gaurī.",
  },
  {
    name: "Scorpio KL — Ketu in Libra (12th)",
    klSign: 7, // Scorpio
    occupants: [
      [], [], [], [],         // 0-3
      [], [], ["Ke"],        // 4-6 (Libra <- Ketu, the 12th from Scorpio)
      [], [], [], [], [], [], // 7-11
    ],
    note: "12th from Scorpio is Libra. Ketu occupies it → Gaṇeśa.",
  },
  {
    name: "Capricorn KL — Jupiter aspecting Sagittarius (12th)",
    klSign: 9, // Capricorn
    occupants: [
      [], [], [], [],         // 0-3
      ["Ju"], [], [],        // 4 Leo <- Jupiter (aspects Sagittarius via rāśi-dṛṣṭi)
      [], [], [],             // 7-9
      [], [], [],             // 10-11 (Sagittarius empty = 12th from Capricorn)
    ],
    note: "12th from Capricorn is Sagittarius. Empty; lord is Jupiter. Jupiter also aspects Sagittarius from Leo, reinforcing.",
  },
  {
    name: "Empty explorer",
    klSign: 0,
    occupants: Array.from({ length: 12 }, () => [] as GrahaKey[]),
    note: "Build your own iṣṭa-devatā reading.",
  },
];
