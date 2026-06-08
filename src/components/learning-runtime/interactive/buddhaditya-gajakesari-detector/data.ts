/**
 * Buddhāditya-Gaja-Kesari Detector — Data Engine
 *
 * §7 interactive for Lesson 14.4.3.
 *
 * Provides combustion orb logic for Buddhāditya (Sun-Mercury),
 * kendra-from-Moon check for Gaja-Kesari (Jupiter-Moon),
 * and strength grading for both common yogas.
 */

export const COMBUSTION_ORB = 14; // degrees
export const COMBUSTION_ORB_LOOSE = 12; // degrees

export type Dignity = "exalted" | "moolatrikona" | "own" | "neutral" | "debilitated";

export interface DignityInfo {
  key: Dignity;
  label: string;
  strength: number;
  isStrong: boolean;
  isDebilitated: boolean;
}

export const DIGNITIES: DignityInfo[] = [
  { key: "exalted", label: "Exalted", strength: 100, isStrong: true, isDebilitated: false },
  { key: "moolatrikona", label: "Mūlatrikoṇa", strength: 90, isStrong: true, isDebilitated: false },
  { key: "own", label: "Own sign", strength: 80, isStrong: true, isDebilitated: false },
  { key: "neutral", label: "Neutral", strength: 50, isStrong: false, isDebilitated: false },
  { key: "debilitated", label: "Debilitated", strength: 0, isStrong: false, isDebilitated: true },
];

/* ─── Buddhāditya check ──────────────────────────────────────────────────── */

export interface BuddhadtiyaResult {
  present: boolean;
  sameSign: boolean;
  separation: number;
  combust: boolean;
  clean: boolean; // same sign + uncombust
  sunDignityStrong: boolean;
  mercuryDignityStrong: boolean;
  strength: "strong" | "moderate" | "weak" | "absent";
  notes: string[];
}

export function checkBuddhaditya(
  sunLongitude: number,
  mercuryLongitude: number,
  sunDignity: Dignity,
  mercuryDignity: Dignity
): BuddhadtiyaResult {
  const separation = Math.abs(sunLongitude - mercuryLongitude);
  const sameSign = Math.floor(sunLongitude / 30) === Math.floor(mercuryLongitude / 30);
  const combust = separation <= COMBUSTION_ORB;
  const clean = sameSign && !combust;

  const sunStrong = DIGNITIES.find((d) => d.key === sunDignity)!.isStrong;
  const mercuryStrong = DIGNITIES.find((d) => d.key === mercuryDignity)!.isStrong;

  let strength: BuddhadtiyaResult["strength"] = "absent";
  if (clean && sunStrong && mercuryStrong) strength = "strong";
  else if (clean && (sunStrong || mercuryStrong)) strength = "moderate";
  else if (sameSign && !combust) strength = "moderate";
  else if (sameSign && combust && (sunStrong || mercuryStrong)) strength = "weak";
  else if (sameSign) strength = "weak";

  const notes: string[] = [];
  if (!sameSign) notes.push("Sun and Mercury not in the same sign — Buddhāditya absent.");
  else if (combust) notes.push(`Mercury is combust (${separation.toFixed(1)}° ≤ ${COMBUSTION_ORB}°) — weakened. Best form: same sign, outside orb.`);
  else notes.push(`Mercury uncombust (${separation.toFixed(1)}° > ${COMBUSTION_ORB}°) — clean Buddhāditya.`);
  if (!sunStrong) notes.push("Sun not in strong dignity.");
  if (!mercuryStrong) notes.push("Mercury not in strong dignity.");
  if (sameSign) notes.push("Buddhāditya is common — grade strength before reading.");

  return {
    present: sameSign,
    sameSign,
    separation,
    combust,
    clean,
    sunDignityStrong: sunStrong,
    mercuryDignityStrong: mercuryStrong,
    strength,
    notes,
  };
}

/* ─── Gaja-Kesari check ──────────────────────────────────────────────────── */

export function getDistance(from: number, to: number): number {
  const diff = ((to - from + 12) % 12);
  return diff === 0 ? 12 : diff;
}

export function isKendraFromMoon(distance: number): boolean {
  return [1, 4, 7, 10].includes(distance);
}

export function isTrikonaFromMoon(distance: number): boolean {
  return [1, 5, 9].includes(distance);
}

export interface GajaKesariResult {
  present: boolean;
  distance: number;
  isKendra: boolean;
  isTrikona: boolean;
  jupiterDignityStrong: boolean;
  moonDignityStrong: boolean;
  strength: "strong" | "moderate" | "weak" | "absent";
  notes: string[];
}

export function checkGajaKesari(
  moonHouse: number,
  jupiterHouse: number,
  moonDignity: Dignity,
  jupiterDignity: Dignity
): GajaKesariResult {
  const distance = getDistance(moonHouse, jupiterHouse);
  const kendra = isKendraFromMoon(distance);
  const trikona = isTrikonaFromMoon(distance);

  const moonStrong = DIGNITIES.find((d) => d.key === moonDignity)!.isStrong;
  const jupiterStrong = DIGNITIES.find((d) => d.key === jupiterDignity)!.isStrong;

  let strength: GajaKesariResult["strength"] = "absent";
  if (kendra && moonStrong && jupiterStrong) strength = "strong";
  else if (kendra && (moonStrong || jupiterStrong)) strength = "moderate";
  else if (kendra) strength = "weak";

  const notes: string[] = [];
  if (!kendra) {
    if (trikona) notes.push(`Jupiter is ${distance}th from Moon — this is a trikoṇa, NOT a kendra. Gaja-Kesari absent.`);
    else notes.push(`Jupiter is ${distance}th from Moon — not a kendra (1/4/7/10). Gaja-Kesari absent.`);
  } else {
    notes.push(`Jupiter is ${distance === 1 ? "conjunct" : distance + "th from"} the Moon — kendra confirmed.`);
  }
  if (!moonStrong) notes.push("Moon not in strong dignity.");
  if (!jupiterStrong) notes.push("Jupiter not in strong dignity.");
  if (kendra) notes.push("Gaja-Kesari is common — grade strength before reading.");

  return {
    present: kendra,
    distance,
    isKendra: kendra,
    isTrikona: trikona,
    jupiterDignityStrong: jupiterStrong,
    moonDignityStrong: moonStrong,
    strength,
    notes,
  };
}

/* ─── Presets ────────────────────────────────────────────────────────────── */

export interface Preset {
  key: string;
  label: string;
  // Buddhāditya
  sunLongitude: number;
  mercuryLongitude: number;
  sunDignity: Dignity;
  mercuryDignity: Dignity;
  // Gaja-Kesari
  moonHouse: number;
  jupiterHouse: number;
  moonDignity: Dignity;
  jupiterDignity: Dignity;
  description: string;
}

export const PRESETS: Preset[] = [
  {
    key: "clean-buddhaditya",
    label: "Clean Buddhāditya",
    sunLongitude: 125,
    mercuryLongitude: 140,
    sunDignity: "own",
    mercuryDignity: "own",
    moonHouse: 4,
    jupiterHouse: 7,
    moonDignity: "exalted",
    jupiterDignity: "exalted",
    description: "Sun 125° (Leo), Mercury 140° (Leo) — same sign, 15° apart (uncombust). Both own-sign.",
  },
  {
    key: "combust-buddhaditya",
    label: "Combust Buddhāditya",
    sunLongitude: 125,
    mercuryLongitude: 128,
    sunDignity: "own",
    mercuryDignity: "neutral",
    moonHouse: 4,
    jupiterHouse: 7,
    moonDignity: "exalted",
    jupiterDignity: "exalted",
    description: "Sun 125°, Mercury 128° — same sign but only 3° apart (combust). Weakened.",
  },
  {
    key: "gajakesari-strong",
    label: "Strong Gaja-Kesari",
    sunLongitude: 60,
    mercuryLongitude: 75,
    sunDignity: "neutral",
    mercuryDignity: "neutral",
    moonHouse: 4,
    jupiterHouse: 10,
    moonDignity: "exalted",
    jupiterDignity: "exalted",
    description: "Moon in Cancer (4th), Jupiter in Capricorn (10th) — 7th from Moon (kendra). Both exalted.",
  },
  {
    key: "wrong-trikona",
    label: "Wrong: trikoṇa not kendra",
    sunLongitude: 60,
    mercuryLongitude: 75,
    sunDignity: "neutral",
    mercuryDignity: "neutral",
    moonHouse: 4,
    jupiterHouse: 8,
    moonDignity: "exalted",
    jupiterDignity: "own",
    description: "Moon in 4th, Jupiter in 8th — 5th from Moon. This is a trikoṇa, NOT a kendra. No Gaja-Kesari.",
  },
];
