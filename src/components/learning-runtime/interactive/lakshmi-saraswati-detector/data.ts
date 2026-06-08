/**
 * Lakṣmī-Sarasvatī Detector — Data Engine
 *
 * §7 interactive for Lesson 14.4.1.
 *
 * Provides rashi-lord mappings, planet configurations, yoga condition
 * logic, and worked presets for both deity-named special yogas.
 */

export const RASHIS = [
  { num: 1, name: "Meṣa", lord: "mars", exalted: "sun", debilitated: "saturn", moolatrikona: "mars" },
  { num: 2, name: "Vṛṣabha", lord: "venus", exalted: "moon", debilitated: "none", moolatrikona: "moon" },
  { num: 3, name: "Mithuna", lord: "mercury", exalted: "rahu", debilitated: "ketu", moolatrikona: "mercury" },
  { num: 4, name: "Karkaṭa", lord: "moon", exalted: "jupiter", debilitated: "mars", moolatrikona: "jupiter" },
  { num: 5, name: "Siṃha", lord: "sun", exalted: "none", debilitated: "none", moolatrikona: "sun" },
  { num: 6, name: "Kanyā", lord: "mercury", exalted: "mercury", debilitated: "venus", moolatrikona: "mercury" },
  { num: 7, name: "Tulā", lord: "venus", exalted: "saturn", debilitated: "sun", moolatrikona: "saturn" },
  { num: 8, name: "Vṛścika", lord: "mars", exalted: "none", debilitated: "moon", moolatrikona: "mars" },
  { num: 9, name: "Dhanuṣa", lord: "jupiter", exalted: "none", debilitated: "rahu", moolatrikona: "jupiter" },
  { num: 10, name: "Makara", lord: "saturn", exalted: "mars", debilitated: "jupiter", moolatrikona: "saturn" },
  { num: 11, name: "Kumbha", lord: "saturn", exalted: "none", debilitated: "none", moolatrikona: "saturn" },
  { num: 12, name: "Mīna", lord: "jupiter", exalted: "venus", debilitated: "mercury", moolatrikona: "jupiter" },
];

export interface PlanetConfig {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  color: string;
  owns: number[]; // rashi numbers
  exaltedIn: number | null;
  debilitatedIn: number | null;
  moolatrikonaIn: number | null;
}

export const PLANETS: PlanetConfig[] = [
  { key: "sun", nameIAST: "Sūrya", nameDevanagari: "सूर्य", color: "#D99622", owns: [5], exaltedIn: 1, debilitatedIn: 7, moolatrikonaIn: 5 },
  { key: "moon", nameIAST: "Candra", nameDevanagari: "चन्द्र", color: "#6D7FA8", owns: [4], exaltedIn: 2, debilitatedIn: 8, moolatrikonaIn: 2 },
  { key: "mars", nameIAST: "Maṅgala", nameDevanagari: "मङ्गल", color: "#A23A1E", owns: [1, 8], exaltedIn: 10, debilitatedIn: 4, moolatrikonaIn: 1 },
  { key: "mercury", nameIAST: "Budha", nameDevanagari: "बुध", color: "#2F7D55", owns: [3, 6], exaltedIn: 6, debilitatedIn: 12, moolatrikonaIn: 6 },
  { key: "jupiter", nameIAST: "Guru", nameDevanagari: "गुरु", color: "#C8841E", owns: [9, 12], exaltedIn: 4, debilitatedIn: 10, moolatrikonaIn: 9 },
  { key: "venus", nameIAST: "Śukra", nameDevanagari: "शुक्र", color: "#8B5A9F", owns: [2, 7], exaltedIn: 12, debilitatedIn: 6, moolatrikonaIn: 7 },
  { key: "saturn", nameIAST: "Śani", nameDevanagari: "शनि", color: "#5A4E2E", owns: [10, 11], exaltedIn: 7, debilitatedIn: 1, moolatrikonaIn: 11 },
];

export type Dignity = "own" | "exalted" | "moolatrikona" | "neutral" | "debilitated";

export interface DignityInfo {
  key: Dignity;
  label: string;
  strength: number; // 0-100
  isDignified: boolean;
  isDebilitated: boolean;
}

export const DIGNITIES: DignityInfo[] = [
  { key: "exalted", label: "Exalted", strength: 100, isDignified: true, isDebilitated: false },
  { key: "moolatrikona", label: "Mūlatrikoṇa", strength: 90, isDignified: true, isDebilitated: false },
  { key: "own", label: "Own sign", strength: 80, isDignified: true, isDebilitated: false },
  { key: "neutral", label: "Neutral", strength: 50, isDignified: false, isDebilitated: false },
  { key: "debilitated", label: "Debilitated", strength: 0, isDignified: false, isDebilitated: true },
];

export function getLordOfHouse(house: number, lagnaSign: number): string {
  const signNum = ((lagnaSign - 1 + house - 1) % 12) + 1;
  const rashi = RASHIS.find((r) => r.num === signNum);
  return rashi?.lord ?? "sun";
}

export function getSignOfHouse(house: number, lagnaSign: number): number {
  return ((lagnaSign - 1 + house - 1) % 12) + 1;
}

export function getDignity(planetKey: string, signNum: number): Dignity {
  const planet = PLANETS.find((p) => p.key === planetKey);
  if (!planet) return "neutral";
  if (planet.exaltedIn === signNum) return "exalted";
  if (planet.debilitatedIn === signNum) return "debilitated";
  if (planet.moolatrikonaIn === signNum) return "moolatrikona";
  if (planet.owns.includes(signNum)) return "own";
  return "neutral";
}

export function isKendra(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

export function isTrikona(house: number): boolean {
  return [1, 5, 9].includes(house);
}

export function isKendraOrTrikona(house: number): boolean {
  return isKendra(house) || isTrikona(house);
}

export interface LakshmiResult {
  present: boolean;
  strength: "strong" | "partial" | "absent";
  conditions: {
    ninthLordDignified: boolean;
    ninthLordInKendraTrikona: boolean;
    lagnaLordStrong: boolean;
    venusReinforces: boolean;
  };
  notes: string[];
}

export function checkLakshmiYoga(
  lagnaSign: number,
  ninthLordHouse: number,
  ninthLordDignity: Dignity,
  lagnaLordStrength: number, // 0-100
  venusStrength: number // 0-100
): LakshmiResult {
  const ninthLordSign = getSignOfHouse(ninthLordHouse, lagnaSign);
  const ninthLordDignified = ["own", "exalted", "moolatrikona"].includes(ninthLordDignity);
  const ninthLordInKT = isKendraOrTrikona(ninthLordHouse);
  const lagnaLordStrong = lagnaLordStrength >= 60;
  const venusReinforces = venusStrength >= 60;

  const present = ninthLordDignified && ninthLordInKT && lagnaLordStrong;
  const strength = present
    ? venusReinforces
      ? "strong"
      : "partial"
    : ninthLordDignified || ninthLordInKT || lagnaLordStrong
      ? "partial"
      : "absent";

  const notes: string[] = [];
  if (!ninthLordDignified) notes.push("9th lord is not dignified (needs own, exaltation, or mūlatrikoṇa).");
  if (!ninthLordInKT) notes.push("9th lord is not in a kendra or trikoṇa.");
  if (!lagnaLordStrong) notes.push("Lagna lord is not strong enough.");
  if (venusReinforces && present) notes.push("Venus reinforces — Lakṣmī's kāraka adds thematic weight.");

  return {
    present,
    strength,
    conditions: {
      ninthLordDignified,
      ninthLordInKendraTrikona: ninthLordInKT,
      lagnaLordStrong,
      venusReinforces,
    },
    notes,
  };
}

export interface SaraswatiResult {
  present: boolean;
  strength: "strong" | "partial" | "absent";
  conditions: {
    mercuryWellPlaced: boolean;
    mercuryUndebilitated: boolean;
    jupiterWellPlaced: boolean;
    jupiterUndebilitated: boolean;
    jupiterStrong: boolean;
    venusWellPlaced: boolean;
    venusUndebilitated: boolean;
  };
  notes: string[];
}

export function checkSaraswatiYoga(
  mercuryHouse: number,
  mercuryDignity: Dignity,
  jupiterHouse: number,
  jupiterDignity: Dignity,
  venusHouse: number,
  venusDignity: Dignity
): SaraswatiResult {
  const mercuryWellPlaced = isKendraOrTrikona(mercuryHouse) || mercuryHouse === 2;
  const mercuryUndebilitated = mercuryDignity !== "debilitated";

  const jupiterWellPlaced = isKendraOrTrikona(jupiterHouse) || jupiterHouse === 2;
  const jupiterUndebilitated = jupiterDignity !== "debilitated";
  const jupiterStrong = ["own", "exalted", "moolatrikona"].includes(jupiterDignity);

  const venusWellPlaced = isKendraOrTrikona(venusHouse) || venusHouse === 2;
  const venusUndebilitated = venusDignity !== "debilitated";

  const allWellPlaced = mercuryWellPlaced && jupiterWellPlaced && venusWellPlaced;
  const allUndebilitated = mercuryUndebilitated && jupiterUndebilitated && venusUndebilitated;
  const present = allWellPlaced && allUndebilitated && jupiterStrong;

  const strength = present
    ? "strong"
    : allWellPlaced && allUndebilitated
      ? "partial"
      : allWellPlaced || allUndebilitated
        ? "partial"
        : "absent";

  const notes: string[] = [];
  if (!mercuryWellPlaced) notes.push("Mercury is not in a kendra, trikoṇa, or 2nd house.");
  if (!mercuryUndebilitated) notes.push("Mercury is debilitated.");
  if (!jupiterWellPlaced) notes.push("Jupiter is not in a kendra, trikoṇa, or 2nd house.");
  if (!jupiterUndebilitated) notes.push("Jupiter is debilitated — this breaks Sarasvatī Yoga.");
  if (!jupiterStrong) notes.push("Jupiter is not especially strong (needs own, exaltation, or mūlatrikoṇa).");
  if (!venusWellPlaced) notes.push("Venus is not in a kendra, trikoṇa, or 2nd house.");
  if (!venusUndebilitated) notes.push("Venus is debilitated.");

  return {
    present,
    strength,
    conditions: {
      mercuryWellPlaced,
      mercuryUndebilitated,
      jupiterWellPlaced,
      jupiterUndebilitated,
      jupiterStrong,
      venusWellPlaced,
      venusUndebilitated,
    },
    notes,
  };
}

export interface Preset {
  key: string;
  label: string;
  lagnaSign: number;
  // Lakshmi params
  ninthLordHouse: number;
  ninthLordDignity: Dignity;
  lagnaLordStrength: number;
  venusStrength: number;
  // Sarasvati params
  mercuryHouse: number;
  mercuryDignity: Dignity;
  jupiterHouse: number;
  jupiterDignity: Dignity;
  venusHouse: number;
  venusDignity: Dignity;
  description: string;
}

export const PRESETS: Preset[] = [
  {
    key: "lakshmi-full",
    label: "Lakṣmī Yoga — full",
    lagnaSign: 5, // Leo
    ninthLordHouse: 9, // 9th lord (Mars) in 9th (Aries) = own sign + trikoṇa
    ninthLordDignity: "own",
    lagnaLordStrength: 80,
    venusStrength: 70,
    mercuryHouse: 2,
    mercuryDignity: "neutral",
    jupiterHouse: 4,
    jupiterDignity: "exalted",
    venusHouse: 3,
    venusDignity: "neutral",
    description: "Leo lagna: 9th lord Mars in Aries (own sign, trikoṇa) + strong Sun (lagna lord) + Venus reinforces.",
  },
  {
    key: "saraswati-full",
    label: "Sarasvatī Yoga — full",
    lagnaSign: 1, // Aries
    ninthLordHouse: 9,
    ninthLordDignity: "own",
    lagnaLordStrength: 60,
    venusStrength: 60,
    mercuryHouse: 1,
    mercuryDignity: "own",
    jupiterHouse: 9,
    jupiterDignity: "own",
    venusHouse: 7,
    venusDignity: "own",
    description: "Mercury in lagna, Jupiter in 9th (own), Venus in 7th (own) — all in kendra/trikoṇa, none debilitated.",
  },
  {
    key: "saraswati-broken",
    label: "Sarasvatī broken",
    lagnaSign: 1,
    ninthLordHouse: 9,
    ninthLordDignity: "own",
    lagnaLordStrength: 60,
    venusStrength: 60,
    mercuryHouse: 1,
    mercuryDignity: "own",
    jupiterHouse: 10,
    jupiterDignity: "debilitated", // Jupiter debilitated in Capricorn
    venusHouse: 7,
    venusDignity: "own",
    description: "Jupiter debilitated in Capricorn (10th) — breaks Sarasvatī Yoga despite good Mercury and Venus.",
  },
];
