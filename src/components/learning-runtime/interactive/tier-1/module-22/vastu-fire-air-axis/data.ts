export type ZoneKey = "ne" | "n" | "nw" | "e" | "center" | "w" | "se" | "s" | "sw";
export type FeatureKey =
  | "stove"
  | "sink"
  | "electricalHub"
  | "refrigerator"
  | "exhaust"
  | "largeWindow"
  | "bathroom"
  | "guestRoom";

export interface AxisZone {
  key: ZoneKey;
  label: string;
  element: string;
  role: string;
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
  workable: ZoneKey[];
  caution: ZoneKey[];
  avoid: ZoneKey[];
  note: string;
  mitigation: string;
}

export const AXIS_ZONES: AxisZone[] = [
  { key: "nw", label: "NW", element: "Vayu", role: "air / dispersal", instruction: "best for exhaust, guests, movement, and workable second-best kitchen logic", color: "#2F7D52", row: 0, col: 0 },
  { key: "n", label: "N", element: "Cool", role: "fresh support", instruction: "supports ventilation, water edge, and cool storage", color: "#2F7D52", row: 0, col: 1 },
  { key: "ne", label: "NE", element: "Jala", role: "pure entry", instruction: "keep cool, light, sacred, and mostly free of fire load", color: "#2F6F9F", row: 0, col: 2 },
  { key: "w", label: "W", element: "Order", role: "edge balance", instruction: "supports discharge and ordinary service functions", color: "#356C96", row: 1, col: 0 },
  { key: "center", label: "C", element: "Akasha", role: "open center", instruction: "keep open; avoid fire, heavy equipment, and discharge focus", color: "#9C7A2F", row: 1, col: 1 },
  { key: "e", label: "E", element: "Light", role: "east-facing action", instruction: "supports cooking stance and morning air entry", color: "#D4941E", row: 1, col: 2 },
  { key: "sw", label: "SW", element: "Prithvi", role: "heavy settled", instruction: "not a fire or air-flow zone; preserve weight and quiet", color: "#7A6B3E", row: 2, col: 0 },
  { key: "s", label: "S", element: "Restraint", role: "contained heat", instruction: "can hold some service load but not the ideal fire point", color: "#A23A1E", row: 2, col: 1 },
  { key: "se", label: "SE", element: "Agni", role: "fire / transformation", instruction: "canonical for stove, cooking heat, and electrical fire-equipment", color: "#B94724", row: 2, col: 2 },
];

export const FEATURE_RULES: FeatureRule[] = [
  {
    key: "stove",
    label: "Stove / cooking fire",
    quality: "heat, transformation",
    ideal: ["se"],
    workable: ["nw", "s"],
    caution: ["e", "w"],
    avoid: ["ne", "sw", "center"],
    note: "SE is canonical. NW is workable because air feeds fire, but it needs internal SE stove placement and east-facing cooking.",
    mitigation: "In an NW kitchen, place the stove toward the kitchen's SE edge, cook facing east, and separate sink/water by at least a clear counter span.",
  },
  {
    key: "sink",
    label: "Sink / water edge",
    quality: "cooling, washing",
    ideal: ["ne", "n"],
    workable: ["e", "nw", "w"],
    caution: ["s"],
    avoid: ["se", "sw", "center"],
    note: "Water can support the kitchen only when it is separated from the stove. Direct SE sink-stove adjacency creates micro agni-jala conflict.",
    mitigation: "Keep sink, purifier, and dishwasher on the NE/N side of the kitchen and maintain clear separation from the fire line.",
  },
  {
    key: "electricalHub",
    label: "Electrical hub",
    quality: "fire-equipment load",
    ideal: ["se"],
    workable: ["nw", "s", "w"],
    caution: ["n", "e"],
    avoid: ["ne", "center"],
    note: "Electrical load is a modern Agni extension. NE should not become the equipment corner.",
    mitigation: "Move heavy electrical clustering toward SE, NW, or service walls; leave NE light, cool, and uncluttered.",
  },
  {
    key: "refrigerator",
    label: "Refrigerator / cooling appliance",
    quality: "cooling with electrical fire",
    ideal: ["nw", "w"],
    workable: ["se", "n"],
    caution: ["e", "s"],
    avoid: ["ne", "center"],
    note: "A refrigerator mixes cooling and electrical load, so NW/W dispersal works well; SE is acceptable as equipment, not as water purity.",
    mitigation: "Avoid turning NE into appliance storage. Keep refrigerator ventilation clear so heat disperses.",
  },
  {
    key: "exhaust",
    label: "Exhaust / air exit",
    quality: "movement, smoke removal",
    ideal: ["nw"],
    workable: ["w", "n"],
    caution: ["se", "e"],
    avoid: ["sw", "center"],
    note: "NW carries Vayu dispersal. It is the cleanest logic for warm air, kitchen fumes, and bathroom extraction.",
    mitigation: "Create a NE/N entry to NW/W exit flow; add exhaust fans where natural airflow is blocked.",
  },
  {
    key: "largeWindow",
    label: "Fresh-air opening",
    quality: "entry, circulation",
    ideal: ["ne", "n", "e"],
    workable: ["nw", "w"],
    caution: ["se"],
    avoid: ["sw", "s"],
    note: "Fresh air enters best through NE/N/E and exits through NW/W. The lesson's airflow is a path, not one isolated window.",
    mitigation: "Keep the NE-to-NW corridor unblocked and use fans only as support when natural cross-ventilation is weak.",
  },
  {
    key: "bathroom",
    label: "Bathroom / discharge",
    quality: "drainage, extraction",
    ideal: ["nw", "w"],
    workable: ["s"],
    caution: ["se", "n"],
    avoid: ["ne", "sw", "center"],
    note: "NW tolerates discharge through air movement. NE purity and SW stability should not become discharge zones.",
    mitigation: "Keep extraction toward NW/W, maintain dryness, and do not treat a bathroom as merely a plumbing convenience.",
  },
  {
    key: "guestRoom",
    label: "Guest / transient room",
    quality: "temporary stay, movement",
    ideal: ["nw"],
    workable: ["w", "n"],
    caution: ["se", "e"],
    avoid: ["sw", "ne"],
    note: "Guest use is transient, matching Vayu. SW is too settled; NE is too sacred-light for ordinary guest traffic.",
    mitigation: "If guests occupy another zone, keep stays light and temporary; reserve SW for settled household anchoring.",
  },
];

export const COMPATIBILITY_NOTES = [
  { label: "Primary axis", pair: "SW / NE", relation: "opposite-complementary", severity: "reversal is high severity" },
  { label: "Secondary axis", pair: "SE / NW", relation: "compatible-flow", severity: "deviation is usually moderate" },
  { label: "Kitchen in NW", pair: "Agni in Vayu", relation: "air can feed fire", severity: "workable with stove and stance discipline" },
];

export const KITCHEN_DISCIPLINE = [
  "Place the stove toward the SE edge of the kitchen.",
  "Cook facing east where the plan allows.",
  "Keep sink, purifier, and dishwasher separated from the fire line.",
  "Vent heat and fumes toward NW or W; bring fresh air from NE, N, or E.",
];

export function getZone(key: ZoneKey): AxisZone {
  return AXIS_ZONES.find((zone) => zone.key === key) ?? AXIS_ZONES[0];
}

export function getFeature(key: FeatureKey): FeatureRule {
  return FEATURE_RULES.find((feature) => feature.key === key) ?? FEATURE_RULES[0];
}
