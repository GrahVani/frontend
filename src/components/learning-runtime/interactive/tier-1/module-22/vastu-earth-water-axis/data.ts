export type ZoneKey = "ne" | "sw" | "n" | "e" | "w" | "nw" | "se" | "s" | "center";
export type FeatureKey = "waterFeature" | "heavyStorage" | "masterBedroom" | "puja" | "column" | "bathroom" | "openWindow";

export interface AxisZone {
  key: ZoneKey;
  label: string;
  element: string;
  quality: string;
  instruction: string;
  color: string;
  row: number;
  col: number;
}

export interface FeatureRule {
  key: FeatureKey;
  label: string;
  quality: string;
  ideal: ZoneKey[];
  acceptable: ZoneKey[];
  severe: ZoneKey[];
  avoid: ZoneKey[];
  note: string;
  mitigation: string;
}

export const AXIS_ZONES: AxisZone[] = [
  { key: "nw", label: "NW", element: "Air", quality: "movement", instruction: "acceptable for dispersal", color: "#2F7D52", row: 0, col: 0 },
  { key: "n", label: "N", element: "Cool", quality: "resources", instruction: "secondary water / safe support", color: "#2F7D52", row: 0, col: 1 },
  { key: "ne", label: "NE", element: "Jala", quality: "light, pure, open", instruction: "keep low, light, clean, and open", color: "#2F6F9F", row: 0, col: 2 },
  { key: "w", label: "W", element: "Order", quality: "balance", instruction: "secondary storage / water edge", color: "#356C96", row: 1, col: 0 },
  { key: "center", label: "C", element: "Akasha", quality: "open centre", instruction: "do not load or wet the centre", color: "#9C7A2F", row: 1, col: 1 },
  { key: "e", label: "E", element: "Light", quality: "morning entry", instruction: "secondary water and openness", color: "#D4941E", row: 1, col: 2 },
  { key: "sw", label: "SW", element: "Prithvi", quality: "heavy, dense, settled", instruction: "keep high, stable, and weighted", color: "#7A6B3E", row: 2, col: 0 },
  { key: "s", label: "S", element: "Restraint", quality: "stored and controlled", instruction: "supports weight and restraint", color: "#A23A1E", row: 2, col: 1 },
  { key: "se", label: "SE", element: "Fire", quality: "heat", instruction: "avoid water conflicts", color: "#A23A1E", row: 2, col: 2 },
];

export const FEATURE_RULES: FeatureRule[] = [
  {
    key: "waterFeature",
    label: "Water feature",
    quality: "cool, flowing, purifying",
    ideal: ["ne"],
    acceptable: ["n", "e", "nw", "w"],
    severe: ["sw", "se", "center"],
    avoid: ["s"],
    note: "Water belongs in NE first; SW reverses the polar axis and SE creates fire-water conflict.",
    mitigation: "If water is fixed in SW, keep drainage flawless, prevent standing water, and restore earth quality with dry, heavy, earth-tone treatment.",
  },
  {
    key: "heavyStorage",
    label: "Heavy storage",
    quality: "weight, density, load",
    ideal: ["sw", "s"],
    acceptable: ["w"],
    severe: ["ne", "center"],
    avoid: ["n", "e"],
    note: "Weight belongs in SW/S. Heavy mass in NE defiles the light head-zone.",
    mitigation: "If heavy mass is fixed in NE, lighten surrounding decor, clear clutter, and preserve as much openness around it as possible.",
  },
  {
    key: "masterBedroom",
    label: "Master bedroom",
    quality: "settled sleep, privacy",
    ideal: ["sw"],
    acceptable: ["w", "s"],
    severe: ["ne", "center"],
    avoid: ["nw"],
    note: "Sleep needs the grounded SW feet-zone, not the NE head-zone.",
    mitigation: "If bedroom is in NE, reduce heavy furniture, keep the NE corner light, and recover SW weight elsewhere.",
  },
  {
    key: "puja",
    label: "Puja / shrine",
    quality: "sacred, light, pure",
    ideal: ["ne"],
    acceptable: ["n", "e"],
    severe: ["sw", "center"],
    avoid: ["s", "se"],
    note: "Puja belongs in the light-pure head-zone; SW is too dense and grounded.",
    mitigation: "If a room is impossible, create a clean NE shrine within a north or east room.",
  },
  {
    key: "column",
    label: "Concrete column",
    quality: "structural mass",
    ideal: ["sw", "s"],
    acceptable: ["w"],
    severe: ["ne", "center"],
    avoid: ["n", "e"],
    note: "Columns are structural; if they fall in NE, respect engineering and mitigate symbolically.",
    mitigation: "Never recommend unsafe structural changes. Use light color, uncluttered surroundings, and open sightlines.",
  },
  {
    key: "bathroom",
    label: "Bathroom",
    quality: "water discharge",
    ideal: ["nw", "w"],
    acceptable: ["s"],
    severe: ["ne", "sw", "center"],
    avoid: ["e"],
    note: "Bathroom in NE defiles purity; bathroom in SW places water/discharge in the earth pole.",
    mitigation: "Prioritize dryness, ventilation, drainage discipline, and clear separation from sacred/water storage areas.",
  },
  {
    key: "openWindow",
    label: "Large opening",
    quality: "light, air, openness",
    ideal: ["ne", "n", "e"],
    acceptable: ["nw", "w"],
    severe: [],
    avoid: ["sw", "s"],
    note: "Openings support the light NE pole; SW prefers density and enclosure.",
    mitigation: "If SW has large openings, compensate with stable furniture, shading, and heavier interior anchoring.",
  },
];

export const ELEVATION_STEPS = [
  "NE: lower, lighter, cleaner, brighter, and more open.",
  "SW: higher, denser, heavier, quieter, and more enclosed.",
  "Traditional plots use actual slope; apartments use symbolic elevation.",
  "Do not demand unsafe structural changes; adjust furniture, color, clutter, and drainage.",
];

export function getZone(key: ZoneKey): AxisZone {
  return AXIS_ZONES.find((zone) => zone.key === key) ?? AXIS_ZONES[0];
}

export function getFeature(key: FeatureKey): FeatureRule {
  return FEATURE_RULES.find((feature) => feature.key === key) ?? FEATURE_RULES[0];
}
