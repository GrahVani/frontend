export type CardinalKey = "east" | "south" | "west" | "north";
export type ActivityKey = "entry" | "treasury" | "puja" | "ancestral" | "dining" | "records";

export interface CardinalLord {
  key: CardinalKey;
  direction: string;
  sanskrit: string;
  deity: string;
  devanagari: string;
  quality: string;
  supports: string;
  caution: string;
  color: string;
  x: number;
  y: number;
}

export interface ActivityMatch {
  key: ActivityKey;
  label: string;
  best: CardinalKey[];
  acceptable: CardinalKey[];
  avoid: CardinalKey[];
  note: string;
}

export const CARDINAL_LORDS: CardinalLord[] = [
  {
    key: "east",
    direction: "East",
    sanskrit: "Purva",
    deity: "Indra",
    devanagari: "इन्द्र",
    quality: "Rising light, kingship, auspicious entry, visible authority.",
    supports: "Main entrance, front living area, study, puja fallback.",
    caution: "Do not reduce East to sunlight only; Indra adds sovereign auspiciousness.",
    color: "#D4941E",
    x: 88,
    y: 50,
  },
  {
    key: "south",
    direction: "South",
    sanskrit: "Dakshina",
    deity: "Yama",
    devanagari: "यम",
    quality: "Ancestors, judgement, restraint, discipline, afternoon heat.",
    supports: "Ancestor-related space and restrained storage.",
    caution: "Main entrance in South is classically suboptimal; mitigate without fear.",
    color: "#A23A1E",
    x: 50,
    y: 88,
  },
  {
    key: "west",
    direction: "West",
    sanskrit: "Pashcima",
    deity: "Varuna",
    devanagari: "वरुण",
    quality: "Waters, cosmic order, settlement, sunset balance.",
    supports: "Dining, financial records, orderly storage, moderate prosperity functions.",
    caution: "West is balanced, not as auspicious for primary entry as East or North.",
    color: "#356C96",
    x: 12,
    y: 50,
  },
  {
    key: "north",
    direction: "North",
    sanskrit: "Uttara",
    deity: "Kubera",
    devanagari: "कुबेर",
    quality: "Wealth, treasury, resources, cool receiving direction.",
    supports: "Treasury, safe, finance desk, second-choice main entry.",
    caution: "North is wealth-supportive, but it does not replace whole-chart or whole-house analysis.",
    color: "#2F7D52",
    x: 50,
    y: 12,
  },
];

export const ACTIVITY_MATCHES: ActivityMatch[] = [
  {
    key: "entry",
    label: "Main entry",
    best: ["east", "north"],
    acceptable: ["west"],
    avoid: ["south"],
    note: "East is first choice through Indra and rising light; North is second through Kubera.",
  },
  {
    key: "treasury",
    label: "Treasury / safe",
    best: ["north"],
    acceptable: ["west"],
    avoid: ["south"],
    note: "Kubera governs wealth and storage of resources; South carries restraint, not expansion.",
  },
  {
    key: "puja",
    label: "Puja fallback",
    best: ["east", "north"],
    acceptable: ["west"],
    avoid: ["south"],
    note: "NE is preferred in the full eight-direction system; among cardinals, East and North are acceptable.",
  },
  {
    key: "ancestral",
    label: "Ancestor space",
    best: ["south"],
    acceptable: ["west"],
    avoid: ["north"],
    note: "Yama and pitri direction make South appropriate for ancestor-related functions.",
  },
  {
    key: "dining",
    label: "Dining",
    best: ["west"],
    acceptable: ["east", "north"],
    avoid: ["south"],
    note: "Varuna's order and settlement support dining and evening household rhythm.",
  },
  {
    key: "records",
    label: "Financial records",
    best: ["west", "north"],
    acceptable: ["east"],
    avoid: ["south"],
    note: "West supports order; North supports wealth. South is too restrictive for growth-oriented records.",
  },
];

export function getLord(key: CardinalKey): CardinalLord {
  return CARDINAL_LORDS.find((lord) => lord.key === key) ?? CARDINAL_LORDS[0];
}

export function getActivity(key: ActivityKey): ActivityMatch {
  return ACTIVITY_MATCHES.find((activity) => activity.key === key) ?? ACTIVITY_MATCHES[0];
}
