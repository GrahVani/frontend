export type IntercardinalKey = "ne" | "se" | "sw" | "nw";
export type ActivityKey = "puja" | "kitchen" | "bedroom" | "guest" | "water" | "storage" | "bathroom";

export interface IntercardinalZone {
  key: IntercardinalKey;
  direction: string;
  sanskrit: string;
  deity: string;
  element: string;
  devanagari: string;
  convergence: string;
  primaryActivity: string;
  quality: string;
  avoid: string;
  note: string;
  color: string;
  x: number;
  y: number;
  priority: string;
}

export interface ActivityRule {
  key: ActivityKey;
  label: string;
  best: IntercardinalKey;
  workable: IntercardinalKey[];
  avoid: IntercardinalKey[];
  note: string;
}

export const INTERCARDINAL_ZONES: IntercardinalZone[] = [
  {
    key: "ne",
    direction: "North-east",
    sanskrit: "Aishanya",
    deity: "Ishana",
    element: "Jala",
    devanagari: "ईशान",
    convergence: "Sacred + pure",
    primaryActivity: "Puja, meditation, clean water",
    quality: "Shiva-aspect, head-zone, cool purity, sacred stillness.",
    avoid: "Kitchen, heavy storage, heavy bedroom.",
    note: "The most auspicious intercardinal: deity and water element both support sacred-cool activities.",
    color: "#2F6F9F",
    x: 85,
    y: 15,
    priority: "Most auspicious",
  },
  {
    key: "se",
    direction: "South-east",
    sanskrit: "Agneya",
    deity: "Agni",
    element: "Agni",
    devanagari: "अग्नि",
    convergence: "Fire + fire",
    primaryActivity: "Kitchen, stove, controlled heat",
    quality: "Fire deity, transformation, cooking, illumination, heat.",
    avoid: "Puja room, water storage, heavy sleep.",
    note: "The clearest match: deity-name and element-name converge directly.",
    color: "#A23A1E",
    x: 85,
    y: 85,
    priority: "Transformative",
  },
  {
    key: "sw",
    direction: "South-west",
    sanskrit: "Nairritya",
    deity: "Nirriti",
    element: "Prithvi",
    devanagari: "निरृति",
    convergence: "Settled + earth",
    primaryActivity: "Master bedroom, weight, heavy storage",
    quality: "Dense, grounded, chthonic, settled, feet-zone of the Vastu-Purusha.",
    avoid: "Puja, light sacred activity, main entry.",
    note: "Read as heavy-settled grounding, not as fear or moral evil.",
    color: "#7A6B3E",
    x: 15,
    y: 85,
    priority: "Grounding",
  },
  {
    key: "nw",
    direction: "North-west",
    sanskrit: "Vayavya",
    deity: "Vayu",
    element: "Vayu",
    devanagari: "वायु",
    convergence: "Wind + air",
    primaryActivity: "Guest room, movement, dispersal",
    quality: "Wind, breath, motion, communication, transient occupancy.",
    avoid: "Permanent master bedroom, heavy storage.",
    note: "Good for temporary occupancy and dispersal functions, not deep settlement.",
    color: "#2F7D52",
    x: 15,
    y: 15,
    priority: "Transient",
  },
];

export const ACTIVITY_RULES: ActivityRule[] = [
  {
    key: "puja",
    label: "Puja / meditation",
    best: "ne",
    workable: [],
    avoid: ["se", "sw"],
    note: "Ishana plus jala makes NE the canonical sacred-cool zone.",
  },
  {
    key: "kitchen",
    label: "Kitchen / stove",
    best: "se",
    workable: ["nw"],
    avoid: ["ne"],
    note: "Agni plus agni makes SE the primary fire zone; NW can be second-best in modern layouts.",
  },
  {
    key: "bedroom",
    label: "Master bedroom",
    best: "sw",
    workable: [],
    avoid: ["ne", "nw"],
    note: "Nirriti plus prithvi makes SW the grounded sleep and settlement zone.",
  },
  {
    key: "guest",
    label: "Guest room",
    best: "nw",
    workable: [],
    avoid: ["sw"],
    note: "Vayu plus vayu supports temporary guests and movement.",
  },
  {
    key: "water",
    label: "Clean water",
    best: "ne",
    workable: ["nw"],
    avoid: ["se"],
    note: "Water belongs with NE purity; keep it away from the fire zone when possible.",
  },
  {
    key: "storage",
    label: "Heavy storage",
    best: "sw",
    workable: ["se"],
    avoid: ["ne", "nw"],
    note: "Weight belongs where earth and settledness converge.",
  },
  {
    key: "bathroom",
    label: "Bathroom / dispersal",
    best: "nw",
    workable: ["sw"],
    avoid: ["ne"],
    note: "NW supports dispersal; avoid defiling NE purity.",
  },
];

export function getZone(key: IntercardinalKey): IntercardinalZone {
  return INTERCARDINAL_ZONES.find((zone) => zone.key === key) ?? INTERCARDINAL_ZONES[0];
}

export function getActivity(key: ActivityKey): ActivityRule {
  return ACTIVITY_RULES.find((activity) => activity.key === key) ?? ACTIVITY_RULES[0];
}
