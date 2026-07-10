import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type CriteriaKey =
  | "ashtottariRahu"
  | "shulaLagna"
  | "mandukaMoon"
  | "cakraPattern"
  | "caturasitiAshubha"
  | "dvadasottariSaturn"
  | "shatabdikaCentury"
  | "shashtiHayani";

export interface CriteriaState {
  ashtottariRahu: boolean;
  shulaLagna: boolean;
  mandukaMoon: boolean;
  cakraPattern: boolean;
  caturasitiAshubha: boolean;
  dvadasottariSaturn: boolean;
  shatabdikaCentury: boolean;
  shashtiHayani: boolean;
}

export interface ConditionalCriterion {
  key: CriteriaKey;
  name: string;
  devanagari: string;
  cycle: string;
  chapterCue: string;
  conditionType: string;
  conditionSummary: string;
  caution: string;
  color: string;
  tint: string;
}

export const DEFAULT_CRITERIA_STATE: CriteriaState = {
  ashtottariRahu: true,
  shulaLagna: false,
  mandukaMoon: true,
  cakraPattern: false,
  caturasitiAshubha: false,
  dvadasottariSaturn: false,
  shatabdikaCentury: false,
  shashtiHayani: false,
};

export const EMPTY_CRITERIA_STATE: CriteriaState = {
  ashtottariRahu: false,
  shulaLagna: false,
  mandukaMoon: false,
  cakraPattern: false,
  caturasitiAshubha: false,
  dvadasottariSaturn: false,
  shatabdikaCentury: false,
  shashtiHayani: false,
};

export const CONDITIONAL_CRITERIA: ConditionalCriterion[] = [
  {
    key: "ashtottariRahu",
    name: "Ashtottari",
    devanagari: "अष्टोत्तरी",
    cycle: "108 yr",
    chapterCue: "BPHS 49",
    conditionType: "Rahu relation",
    conditionSummary: "Lagna/Moon configuration relates to Rahu.",
    caution: "Use alongside Vimshottari when the Rahu-related gate is verified.",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
  },
  {
    key: "shulaLagna",
    name: "Shula",
    devanagari: "शूल",
    cycle: "varies",
    chapterCue: "BPHS 51",
    conditionType: "Lagna grouping",
    conditionSummary: "A specific Lagna-grouping condition is present.",
    caution: "Treat as a specialised supplement; do not infer it from Lagna alone.",
    color: grahas.mangala.primary,
    tint: grahas.mangala.secondaryTint,
  },
  {
    key: "mandukaMoon",
    name: "Manduka",
    devanagari: "मण्डूक",
    cycle: "varies",
    chapterCue: "BPHS 52",
    conditionType: "Moon position",
    conditionSummary: "A specific Moon-position condition is present.",
    caution: "Confirm the textual Moon rule before computing the jumping pattern.",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
  },
  {
    key: "cakraPattern",
    name: "Cakra",
    devanagari: "चक्र",
    cycle: "varies",
    chapterCue: "BPHS 51-58",
    conditionType: "Wheel pattern",
    conditionSummary: "A wheel-pattern conditional rule is satisfied.",
    caution: "Edition details vary; verify the system rule before using it.",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    key: "caturasitiAshubha",
    name: "Caturasiti-Sama",
    devanagari: "चतुराशीति-समा",
    cycle: "84 yr",
    chapterCue: "BPHS",
    conditionType: "Ashubha Lagna yoga",
    conditionSummary: "An ashubha-yoga in the Lagna condition is present.",
    caution: "The 84-year cycle is fixed; applicability still depends on the condition.",
    color: grahas.surya.primary,
    tint: grahas.surya.secondaryTint,
  },
  {
    key: "dvadasottariSaturn",
    name: "Dvadasottari",
    devanagari: "द्वादशोत्तरी",
    cycle: "112 yr",
    chapterCue: "BPHS 56-58",
    conditionType: "Saturn / ashubha cue",
    conditionSummary: "A specific Saturn or ashubha-related condition is present.",
    caution: "Use the broad cue here only as a Tier-1 recognition placeholder.",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
  },
  {
    key: "shatabdikaCentury",
    name: "Shatabdika",
    devanagari: "शताब्दिका",
    cycle: "100 yr",
    chapterCue: "BPHS",
    conditionType: "Centennial condition",
    conditionSummary: "The 100-year system's specific selection condition is met.",
    caution: "Catalog correction: Shatabdika is the 100-year system; do not label it Dashottari.",
    color: grahas.shukra.primary,
    tint: grahas.shukra.secondaryTint,
  },
  {
    key: "shashtiHayani",
    name: "Shashti-hayani",
    devanagari: "षष्टि-हायनी",
    cycle: "60 yr",
    chapterCue: "BPHS 58",
    conditionType: "Specific BPHS condition",
    conditionSummary: "The Shashti-hayani qualifying condition is present.",
    caution: "Recognise the 60-year Jovian-cycle echo; verify before use.",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
  },
];

export function selectedCriteria(state: CriteriaState) {
  return CONDITIONAL_CRITERIA.filter((criterion) => state[criterion.key]);
}

export function getCriterion(key: CriteriaKey) {
  return CONDITIONAL_CRITERIA.find((criterion) => criterion.key === key) ?? CONDITIONAL_CRITERIA[0];
}

export function recommendationSummary(state: CriteriaState) {
  const active = selectedCriteria(state);
  if (active.length === 0) return "Run Vimshottari alone; no conditional gate is marked.";
  if (active.length === 1) return `Run Vimshottari plus ${active[0].name}; one conditional gate is marked.`;
  return `Run Vimshottari plus ${active.length} qualified conditionals; cross-validate rather than override.`;
}

export function twoYesMode(state: CriteriaState) {
  const count = selectedCriteria(state).length;
  if (count === 0) return "Default-only reading";
  if (count === 1) return "One supplement can confirm or nuance Vimshottari";
  return "Multiple supplements require careful two-yes comparison";
}
