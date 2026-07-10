/**
 * Kala Sarpa Detector -- Data Engine
 *
 * Section 7 interactive for Lesson 14.6.3 (Kala Sarpa Yoga: Classical Debate).
 *
 * Checks whether all seven planets are hemmed on one side of the
 * Rahu-Ketu axis. Distinguishes complete vs broken vs none and
 * KSY vs Kala Amrita orientation.
 */

export const PLANETS = [
  { key: "sun" as const, name: "Sun", short: "Su", grahaSlug: "surya", defaultHouse: 3 },
  { key: "moon" as const, name: "Moon", short: "Mo", grahaSlug: "candra", defaultHouse: 4 },
  { key: "mars" as const, name: "Mars", short: "Ma", grahaSlug: "mangala", defaultHouse: 5 },
  { key: "mercury" as const, name: "Mercury", short: "Me", grahaSlug: "budha", defaultHouse: 6 },
  { key: "jupiter" as const, name: "Jupiter", short: "Ju", grahaSlug: "guru", defaultHouse: 2 },
  { key: "venus" as const, name: "Venus", short: "Ve", grahaSlug: "shukra", defaultHouse: 7 },
  { key: "saturn" as const, name: "Saturn", short: "Sa", grahaSlug: "shani", defaultHouse: 8 },
];

export type PlanetKey = (typeof PLANETS)[number]["key"];

export function getKetu(rahu: number): number {
  const k = rahu + 6;
  return k > 12 ? k - 12 : k;
}

export function distFromRahu(rahu: number, house: number): number {
  return ((house - rahu + 12) % 12) || 0;
}

export interface KSYResult {
  formed: boolean;
  variant: "none" | "ksy-complete" | "ksy-broken" | "amrita-complete" | "amrita-broken" | "partial";
  variantLabel: string;
  variantColor: string;
  rahuHouse: number;
  ketuHouse: number;
  planetsOnAxis: string[];
  planetsInArcRK: string[];
  planetsInArcKR: string[];
  notes: string[];
}

export function checkKSY(
  rahuHouse: number,
  planetHouses: Record<PlanetKey, number>,
): KSYResult {
  const ketuHouse = getKetu(rahuHouse);

  const onAxis: string[] = [];
  const inArcRK: string[] = []; // Rahu -> Ketu arc (dist 1-6)
  const inArcKR: string[] = []; // Ketu -> Rahu arc (dist 8-11)

  PLANETS.forEach((p) => {
    const d = distFromRahu(rahuHouse, planetHouses[p.key]);
    if (d === 0 || d === 7) {
      onAxis.push(p.name);
    } else if (d >= 1 && d <= 6) {
      inArcRK.push(p.name);
    } else {
      inArcKR.push(p.name);
    }
  });

  const allInRK = inArcRK.length === 7;
  const allInRKWithAxis = inArcRK.length + onAxis.length === 7 && inArcRK.length > 0;
  const allInKR = inArcKR.length === 7;
  const allInKRWithAxis = inArcKR.length + onAxis.length === 7 && inArcKR.length > 0;

  let variant: KSYResult["variant"] = "none";
  let variantLabel = "No Kala Sarpa configuration";
  let variantColor = "#2F7D55";
  const notes: string[] = [];

  if (allInRK) {
    variant = "ksy-complete";
    variantLabel = "Complete Kala Sarpa Yoga";
    variantColor = "#A23A1E";
    notes.push("All seven planets are strictly between Rahu and Ketu -- the full configuration.");
    notes.push("Even so, this configuration is contested and absent from BPHS. Never predict catastrophe from it alone.");
  } else if (allInRKWithAxis) {
    variant = "ksy-broken";
    variantLabel = "Broken / Partial Kala Sarpa Yoga";
    variantColor = "#C8841E";
    notes.push(`All planets are on the Rahu-to-Ketu side, but ${onAxis.join(", ")} ${onAxis.length === 1 ? "is" : "are"} on the axis itself.`);
    notes.push("A 'broken' KSY is even weaker grounds for alarm than a complete one.");
  } else if (allInKR) {
    variant = "amrita-complete";
    variantLabel = "Complete Kala Amrita Yoga (reverse)";
    variantColor = "#A23A1E";
    notes.push("All seven planets are strictly between Ketu and Rahu -- the reversed (Kala Amrita) orientation.");
    notes.push("Same doctrinal debate applies: contested, absent from BPHS.");
  } else if (allInKRWithAxis) {
    variant = "amrita-broken";
    variantLabel = "Broken Kala Amrita Yoga";
    variantColor = "#C8841E";
    notes.push(`All planets are on the Ketu-to-Rahu side, but ${onAxis.join(", ")} ${onAxis.length === 1 ? "is" : "are"} on the axis.`);
    notes.push("Broken reverse orientation -- weaker grounds for alarm.");
  } else {
    variant = "partial";
    variantLabel = "No KSY -- planets split across both arcs";
    variantColor = "#2F7D55";
    notes.push("Planets are distributed across both sides of the nodal axis -- no Kala Sarpa configuration.");
  }

  return {
    formed: variant !== "partial",
    variant,
    variantLabel,
    variantColor,
    rahuHouse,
    ketuHouse,
    planetsOnAxis: onAxis,
    planetsInArcRK: inArcRK,
    planetsInArcKR: inArcKR,
    notes,
  };
}

/* --- Presets --- */

export interface Preset {
  key: string;
  label: string;
  rahuHouse: number;
  planets: Record<PlanetKey, number>;
}

export const PRESETS: Preset[] = [
  {
    key: "complete-ksy",
    label: "Complete KSY",
    rahuHouse: 1,
    planets: { sun: 2, moon: 3, mars: 4, mercury: 5, jupiter: 6, venus: 7, saturn: 7 },
  },
  {
    key: "broken-ksy",
    label: "Broken KSY",
    rahuHouse: 1,
    planets: { sun: 1, moon: 3, mars: 4, mercury: 5, jupiter: 6, venus: 7, saturn: 7 },
  },
  {
    key: "complete-amrita",
    label: "Kala Amrita",
    rahuHouse: 1,
    planets: { sun: 8, moon: 9, mars: 10, mercury: 11, jupiter: 12, venus: 1, saturn: 1 },
  },
  {
    key: "no-ksy",
    label: "No KSY",
    rahuHouse: 1,
    planets: { sun: 2, moon: 3, mars: 8, mercury: 9, jupiter: 10, venus: 11, saturn: 12 },
  },
];
