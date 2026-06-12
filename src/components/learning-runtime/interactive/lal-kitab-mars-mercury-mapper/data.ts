import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type FocusPlanet = "mars" | "mercury";

export interface RashiOption {
  id: number;
  name: string;
  iast: string;
  devanagari: string;
  lord: GrahaSlug;
}

export interface PlanetProfile {
  key: FocusPlanet;
  label: string;
  iast: string;
  devanagari: string;
  grahaSlug: GrahaSlug;
  color: string;
  tint: string;
  headline: string;
  classicalOverlap: string;
  lalKitabMove: string;
  significations: string[];
  remedyHooks: string[];
}

export interface ClusterGuard {
  label: string;
  belongsTo: string;
  correction: string;
}

export const RASHIS: RashiOption[] = [
  { id: 1, name: "Aries", iast: "Meṣa", devanagari: "मेष", lord: "mangala" },
  { id: 2, name: "Taurus", iast: "Vṛṣabha", devanagari: "वृषभ", lord: "shukra" },
  { id: 3, name: "Gemini", iast: "Mithuna", devanagari: "मिथुन", lord: "budha" },
  { id: 4, name: "Cancer", iast: "Karka", devanagari: "कर्क", lord: "candra" },
  { id: 5, name: "Leo", iast: "Siṃha", devanagari: "सिंह", lord: "surya" },
  { id: 6, name: "Virgo", iast: "Kanyā", devanagari: "कन्या", lord: "budha" },
  { id: 7, name: "Libra", iast: "Tulā", devanagari: "तुला", lord: "shukra" },
  { id: 8, name: "Scorpio", iast: "Vṛścika", devanagari: "वृश्चिक", lord: "mangala" },
  { id: 9, name: "Sagittarius", iast: "Dhanu", devanagari: "धनु", lord: "guru" },
  { id: 10, name: "Capricorn", iast: "Makara", devanagari: "मकर", lord: "shani" },
  { id: 11, name: "Aquarius", iast: "Kumbha", devanagari: "कुम्भ", lord: "shani" },
  { id: 12, name: "Pisces", iast: "Mīna", devanagari: "मीन", lord: "guru" },
];

export const PROFILES: Record<FocusPlanet, PlanetProfile> = {
  mars: {
    key: "mars",
    label: "Mars",
    iast: "Maṅgala",
    devanagari: grahas.mangala.devanagari,
    grahaSlug: "mangala",
    color: grahas.mangala.primary,
    tint: grahas.mangala.secondaryTint,
    headline: "Brothers, courage, and landed property",
    classicalOverlap: "Keeps the martial sibling-courage baseline.",
    lalKitabMove: "Splits Mars into Maṅgal nek or Maṅgal bad before reading remedies.",
    significations: ["younger brothers", "courage and valour", "land and immovable property"],
    remedyHooks: ["own sign: preserve strength", "other signs: consider Mars pacification", "property or brother matters become the first inquiry"],
  },
  mercury: {
    key: "mercury",
    label: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    grahaSlug: "budha",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
    headline: "Business, communication, in-laws, and sister",
    classicalOverlap: "Keeps the speech-trade-intellect baseline.",
    lalKitabMove: "Widens Mercury into a concrete family-relations net.",
    significations: ["business and commerce", "communication", "in-laws", "sister"],
    remedyHooks: ["communication conduct", "sister relationship repair", "in-law relationship repair"],
  },
};

export const MERCURY_NET = [
  { label: "Business", cue: "trade, buying, selling", keep: true },
  { label: "Communication", cue: "speech, writing, negotiation", keep: true },
  { label: "In-laws", cue: "relations acquired through marriage", keep: true },
  { label: "Sister", cue: "specific sibling-sister route", keep: true },
  { label: "Mother", cue: "Moon, not Mercury", keep: false },
  { label: "Father", cue: "Sun, not Mercury", keep: false },
];

export const CLUSTER_GUARDS: ClusterGuard[] = [
  { label: "brothers, courage, land", belongsTo: "Mars", correction: "Correct for Mars: this is the Maṅgala cluster in Lal Kitab." },
  { label: "business, speech, in-laws, sister", belongsTo: "Mercury", correction: "Correct for Mercury: Lal Kitab adds in-laws and sister to Budha." },
  { label: "wife, comforts, luxuries", belongsTo: "Venus", correction: "Keep comforts, vehicles, wife, and luxury with Shukra." },
  { label: "mother, mind, milk", belongsTo: "Moon", correction: "This is the Candra cluster, not Mercury or Mars." },
  { label: "father, government, household head", belongsTo: "Sun", correction: "This stays with Surya in Lal Kitab." },
  { label: "iron, oil, labour, servants", belongsTo: "Saturn", correction: "This belongs to Shani, not the Mars land cluster." },
];

export function getProfile(key: FocusPlanet) {
  return PROFILES[key];
}

export function getRashi(id: number) {
  return RASHIS.find((rashi) => rashi.id === id) ?? RASHIS[0];
}

export function isMarsNek(rashiId: number) {
  return rashiId === 1 || rashiId === 8;
}
