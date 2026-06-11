/**
 * Kārakāṁśa Reader engine -- Lesson 17.7.2
 *
 * Walks the five-step soul-purpose read:
 *  1. Find the AK (highest within-sign degree).
 *  2. Locate the AK in the D9 navāṁśa.
 *  3. Treat that D9 sign as the Kārakāṁśa Lagna.
 *  4. Read occupants in the KL + planets aspecting it by rāśi-dṛṣṭi.
 *  5. Read key houses counted from the KL.
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
  { key: "Su", name: "Sun", nature: "malefic" as const, natureLabel: "Malefic", sig: "Authority, governance, leadership; medicine and politics of power." },
  { key: "Mo", name: "Moon", nature: "mixed" as const, natureLabel: "Mixed", sig: "Public life, nurture, the mind; fluids, hospitality, caring professions." },
  { key: "Ma", name: "Mars", nature: "malefic" as const, natureLabel: "Malefic", sig: "Engineering, surgery, military, decisive force or the cutting edge." },
  { key: "Me", name: "Mercury", nature: "mixed" as const, natureLabel: "Mixed", sig: "Commerce, writing, mathematics, speech and calculation." },
  { key: "Ju", name: "Jupiter", nature: "benefic" as const, natureLabel: "Benefic", sig: "Teaching, counsel, law, priesthood; dispensing of wisdom." },
  { key: "Ve", name: "Venus", nature: "benefic" as const, natureLabel: "Benefic", sig: "Arts, beauty, vehicles, pleasures, diplomacies of relationship." },
  { key: "Sa", name: "Saturn", nature: "malefic" as const, natureLabel: "Malefic", sig: "Labour, service, asceticism; the old, the poor, endurance." },
  { key: "Ra", name: "Rahu", nature: "malefic" as const, natureLabel: "Malefic", sig: "Foreign or unconventional fields; amplification and obsession." },
  { key: "Ke", name: "Ketu", nature: "malefic" as const, natureLabel: "Malefic", sig: "Renunciation, mokṣa, the esoteric; inner path and liberation." },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

/* --- Rāśi-dṛṣṭi engine --- */

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

/* --- Key houses from Kārakāṁśa --- */

export const KEY_HOUSES = [
  { house: 1, label: "1st (KL itself)", sig: "Core nature and chosen field of the soul." },
  { house: 2, label: "2nd", sig: "Speech, sustenance and the family-line the soul carries." },
  { house: 4, label: "4th", sig: "Happiness, the heart, vehicles and landed contentment." },
  { house: 5, label: "5th", sig: "Mantra, past-life merit (pūrva-puṇya), creative-devotional faculty." },
  { house: 9, label: "9th", sig: "Dharma, the teacher, fortune and the higher law the soul serves." },
  { house: 10, label: "10th", sig: "Profession proper, the public act, the work done in the world." },
  { house: 12, label: "12th", sig: "The iṣṭa-devatā and the door to mokṣa." },
];

/* --- Presets --- */

export interface Preset {
  name: string;
  klSign: number;
  occupants: GrahaKey[][];
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Leo KL — Sun + Jupiter, Venus aspecting",
    klSign: 4, // Leo
    occupants: [
      [], [], [], [],        // 0-3
      ["Su", "Ju"], [],     // 4 Leo <- KL + occupants, 5 Virgo
      [], [], [],            // 6-8
      [], ["Ve"], [], [],    // 9-11: Venus in Aquarius (aspects Leo)
    ],
    note: "Sun-in-KL points to authority and leadership; Jupiter beside it bends toward teaching and dharma. Venus aspects from Aquarius, refining toward dignity and public esteem.",
  },
  {
    name: "Scorpio KL — Saturn, Ketu aspecting",
    klSign: 7, // Scorpio
    occupants: [
      [], [], [], [],         // 0-3
      [], [], [],             // 4-6
      ["Sa"], [],            // 7 Scorpio <- KL + Saturn, 8 Sagittarius
      [], [], [], [],         // 9-11: Ketu in Gemini or Pisces would aspect Scorpio
    ],
    note: "Saturn in Scorpio KL points to disciplined investigation of hidden things. Ketu aspecting deepens the pull toward renunciation and the esoteric.",
  },
  {
    name: "Empty explorer",
    klSign: 0,
    occupants: Array.from({ length: 12 }, () => [] as GrahaKey[]),
    note: "Build your own Kārakāṁśa reading from scratch.",
  },
];

/* --- Synthesis --- */

export function formatDegree(value: number): string {
  const deg = Math.floor(value);
  const min = Math.round((value - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

export function findAtmakaraka(degrees: Record<string, number>): { key: string; name: string; degree: number } {
  const grahaNames = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"];
  let max = -1;
  let ak = "Su";
  for (const k of grahaNames) {
    if ((degrees[k] ?? 0) > max) {
      max = degrees[k] ?? 0;
      ak = k;
    }
  }
  const planet = GRAHAS.find((g) => g.key === ak)!;
  return { key: ak, name: planet.name, degree: max };
}

export function synthesiseKarakamshaReading(
  klSign: number,
  occupants: GrahaKey[][],
): { theme: string; qualification: string; character: string } {
  const klOcc = occupants[klSign];
  const aspecting = getAspectsToTarget(klSign);

  // Theme from occupants in KL
  const occPlanets = klOcc.map((k) => GRAHAS.find((g) => g.key === k)!).filter(Boolean);
  if (occPlanets.length === 0) {
    const theme = `${SIGNS[klSign]} Kārakāṁśa is unoccupied. Read from aspects and houses -- the sign-flavour and its lord (${LORDS[klSign]}) set the base tone.`;
    const qual = aspecting.length > 0
      ? `Aspected by ${aspecting.map((s) => SIGNS[s]).join(", ")}.`
      : "No sign-aspects land on the Kārakāṁśa.";
    return { theme, qualification: qual, character: "Neutral -- sign and lord only." };
  }

  const themeParts = occPlanets.map((p) => `${p.name} (${p.sig})`);
  const theme = `Occupants in ${SIGNS[klSign]} Kārakāṁśa: ${themeParts.join("; ")}.`;

  // Aspecting planets
  const aspPlanets = aspecting.flatMap((sIdx) => occupants[sIdx].map((k) => GRAHAS.find((g) => g.key === k)!).filter(Boolean));
  const benefic = aspPlanets.filter((p) => p.nature === "benefic");
  const malefic = aspPlanets.filter((p) => p.nature === "malefic");
  const mixed = aspPlanets.filter((p) => p.nature === "mixed");

  let qual = "";
  if (aspPlanets.length === 0) {
    qual = "No planets aspect the Kārakāṁśa by rāśi-dṛṣṭi.";
  } else {
    qual = "Aspecting by rāśi-dṛṣṭi: ";
    const parts: string[] = [];
    if (benefic.length) parts.push(`${benefic.map((p) => p.name).join(", ")} (benefic)`);
    if (malefic.length) parts.push(`${malefic.map((p) => p.name).join(", ")} (malefic)`);
    if (mixed.length) parts.push(`${mixed.map((p) => p.name).join(", ")} (mixed)`);
    qual += parts.join("; ") + ".";
  }

  let character = "";
  if (benefic.length > 0 && malefic.length > 0) {
    character = `Mixed field: ${benefic.map((p) => p.name).join(", ")} elevate and steady the path, while ${malefic.map((p) => p.name).join(", ")} intensify or test it. Hold both.`;
  } else if (benefic.length > 0) {
    character = `Benefic-dominant: ${benefic.map((p) => p.name).join(", ")} support and refine the indicated field toward dignity and grace.`;
  } else if (malefic.length > 0) {
    character = `Malefic-dominant: ${malefic.map((p) => p.name).join(", ")} complicate or strip the field toward austerity, struggle, or deep inner work.`;
  } else if (mixed.length > 0) {
    character = `Mixed-neutral: ${mixed.map((p) => p.name).join(", ")} modify without strongly supporting or obstructing.`;
  } else {
    character = "No planetary aspects -- the field stands on occupant strength and sign-flavour alone.";
  }

  return { theme, qualification: qual, character };
}
