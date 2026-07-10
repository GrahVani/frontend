export type ElementKey = "jala" | "agni" | "prithvi" | "vayu" | "akasha";

export type ActivityKey =
  | "kitchen"
  | "puja"
  | "water"
  | "masterBedroom"
  | "storage"
  | "guest"
  | "bathroom"
  | "courtyard";

export interface ElementZone {
  key: ElementKey;
  name: string;
  iast: string;
  devanagari: string;
  direction: string;
  deity: string;
  qualities: string;
  placement: string;
  reason: string;
  color: string;
  row: number;
  col: number;
}

export interface ActivityRule {
  key: ActivityKey;
  label: string;
  quality: string;
  best: ElementKey;
  acceptable: ElementKey[];
  avoid: ElementKey[];
  note: string;
}

export const ELEMENT_ZONES: ElementZone[] = [
  {
    key: "jala",
    name: "Water",
    iast: "Jala",
    devanagari: "जल",
    direction: "North-east",
    deity: "Ishana",
    qualities: "Cool, pure, sacred, fresh, settling",
    placement: "Puja, meditation, clean water, sacred stillness",
    reason: "The Vastu-Purusha head-zone receives coolness, purity, and subtle devotional work.",
    color: "#2F6F9F",
    row: 0,
    col: 2,
  },
  {
    key: "agni",
    name: "Fire",
    iast: "Agni",
    devanagari: "अग्नि",
    direction: "South-east",
    deity: "Agni",
    qualities: "Hot, bright, transformative, cooking, digestion",
    placement: "Kitchen, stove, controlled heat, electrical fire",
    reason: "Cooking is a fire activity, so it belongs in the fire quarter.",
    color: "#A23A1E",
    row: 2,
    col: 2,
  },
  {
    key: "prithvi",
    name: "Earth",
    iast: "Prithvi",
    devanagari: "पृथ्वी",
    direction: "South-west",
    deity: "Nirriti",
    qualities: "Heavy, dense, stable, grounded, settled",
    placement: "Master bedroom, heavy storage, weight, stability",
    reason: "The feet-zone is settled and weight-bearing; it can hold the heaviest functions.",
    color: "#7A6B3E",
    row: 2,
    col: 0,
  },
  {
    key: "vayu",
    name: "Air",
    iast: "Vayu",
    devanagari: "वायु",
    direction: "North-west",
    deity: "Vayu",
    qualities: "Moving, light, dispersing, communicative, transient",
    placement: "Guest rooms, movement, bathrooms on edges, circulation",
    reason: "Air supports movement and temporary occupancy rather than deep settlement.",
    color: "#2F7D52",
    row: 0,
    col: 0,
  },
  {
    key: "akasha",
    name: "Ether",
    iast: "Akasha",
    devanagari: "आकाश",
    direction: "Centre",
    deity: "Brahma",
    qualities: "Open, spacious, subtle, container of all elements",
    placement: "Open centre, courtyard, uncluttered Brahma-sthana",
    reason: "The centre should breathe; it is the space that lets the whole dwelling cohere.",
    color: "#9C7A2F",
    row: 1,
    col: 1,
  },
];

export const ACTIVITY_RULES: ActivityRule[] = [
  {
    key: "kitchen",
    label: "Kitchen",
    quality: "hot, transformative",
    best: "agni",
    acceptable: ["vayu"],
    avoid: ["jala", "akasha"],
    note: "SE is best. NW is workable as a second-best because air and fire are both light and active.",
  },
  {
    key: "puja",
    label: "Puja / meditation",
    quality: "cool, sacred, quiet",
    best: "jala",
    acceptable: ["akasha"],
    avoid: ["agni", "prithvi"],
    note: "NE supports purity and devotion; the centre can support openness if kept uncluttered.",
  },
  {
    key: "water",
    label: "Clean water",
    quality: "cool, fresh, purifying",
    best: "jala",
    acceptable: ["vayu"],
    avoid: ["agni"],
    note: "Water belongs with the NE water quarter; avoid placing it in the fire zone when possible.",
  },
  {
    key: "masterBedroom",
    label: "Master bedroom",
    quality: "heavy, private, settled",
    best: "prithvi",
    acceptable: ["vayu"],
    avoid: ["jala", "akasha"],
    note: "SW supports grounded sleep. NE is too light and sacred for heavy settlement.",
  },
  {
    key: "storage",
    label: "Heavy storage",
    quality: "weight, density",
    best: "prithvi",
    acceptable: ["agni"],
    avoid: ["jala", "akasha"],
    note: "Weight belongs in SW. Do not load the centre or the NE head-zone.",
  },
  {
    key: "guest",
    label: "Guest room",
    quality: "temporary, moving",
    best: "vayu",
    acceptable: ["prithvi"],
    avoid: ["akasha"],
    note: "NW supports temporary occupants and movement; avoid turning the centre into a room.",
  },
  {
    key: "bathroom",
    label: "Bathroom / drainage",
    quality: "discharge, dispersal",
    best: "vayu",
    acceptable: ["prithvi"],
    avoid: ["jala", "akasha"],
    note: "Keep discharge away from NE purity and the central Brahma-sthana.",
  },
  {
    key: "courtyard",
    label: "Open courtyard",
    quality: "space, breath, light",
    best: "akasha",
    acceptable: ["jala"],
    avoid: ["prithvi"],
    note: "The centre is an ether function: open, uncluttered, and structurally honest.",
  },
];

export const DISCIPLINE_PARALLELS = [
  {
    title: "Vastu",
    text: "Spatial zones: element quality decides which activity belongs where.",
  },
  {
    title: "Ayurveda",
    text: "Body constitution: doshas arise from the same five-element vocabulary.",
  },
  {
    title: "Jyotisha",
    text: "Planet and sign qualities can use element language, but the method is not identical.",
  },
];

export function getElement(key: ElementKey): ElementZone {
  return ELEMENT_ZONES.find((item) => item.key === key) ?? ELEMENT_ZONES[0];
}

export function getActivity(key: ActivityKey): ActivityRule {
  return ACTIVITY_RULES.find((item) => item.key === key) ?? ACTIVITY_RULES[0];
}
