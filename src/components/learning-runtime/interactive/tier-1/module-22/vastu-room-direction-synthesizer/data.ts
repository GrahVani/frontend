export type DirectionKey = "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "n" | "center";
export type RoomKey =
  | "kitchen"
  | "masterBedroom"
  | "puja"
  | "guest"
  | "bathroom"
  | "study"
  | "dining"
  | "living"
  | "treasury"
  | "entry"
  | "children"
  | "utility";

export interface DirectionCell {
  key: DirectionKey;
  label: string;
  lord: string;
  element: string;
  role: string;
  row: number;
  col: number;
  color: string;
}

export interface RoomPlacement {
  key: RoomKey;
  label: string;
  quality: string;
  primary: DirectionKey[];
  secondary: DirectionKey[];
  acceptable: DirectionKey[];
  prohibited: DirectionKey[];
  reasoning: string;
  mitigation: string;
}

export const DIRECTIONS: DirectionCell[] = [
  { key: "nw", label: "NW", lord: "Vayu", element: "Air", role: "movement", row: 0, col: 0, color: "#2F7D52" },
  { key: "n", label: "N", lord: "Kubera", element: "-", role: "wealth", row: 0, col: 1, color: "#2F7D52" },
  { key: "ne", label: "NE", lord: "Ishana", element: "Water", role: "sacred", row: 0, col: 2, color: "#2F6F9F" },
  { key: "w", label: "W", lord: "Varuna", element: "-", role: "order", row: 1, col: 0, color: "#356C96" },
  { key: "center", label: "C", lord: "Brahma", element: "Ether", role: "open", row: 1, col: 1, color: "#9C7A2F" },
  { key: "e", label: "E", lord: "Indra", element: "-", role: "entry", row: 1, col: 2, color: "#D4941E" },
  { key: "sw", label: "SW", lord: "Nirriti", element: "Earth", role: "settled", row: 2, col: 0, color: "#7A6B3E" },
  { key: "s", label: "S", lord: "Yama", element: "-", role: "restraint", row: 2, col: 1, color: "#A23A1E" },
  { key: "se", label: "SE", lord: "Agni", element: "Fire", role: "fire", row: 2, col: 2, color: "#A23A1E" },
];

export const ROOM_PLACEMENTS: RoomPlacement[] = [
  {
    key: "kitchen",
    label: "Kitchen",
    quality: "Fire, transformation, cooking",
    primary: ["se"],
    secondary: ["nw"],
    acceptable: ["e"],
    prohibited: ["ne", "center"],
    reasoning: "Kitchen belongs to SE because Agni deity and fire element converge. NW is a workable second-best in modern apartments.",
    mitigation: "If forced outside SE, place stove toward the SE side and keep water/fire separation clear.",
  },
  {
    key: "masterBedroom",
    label: "Master bedroom",
    quality: "Heavy, private, settled sleep",
    primary: ["sw"],
    secondary: ["w"],
    acceptable: ["s"],
    prohibited: ["ne", "center"],
    reasoning: "Master bedroom belongs to SW because Nirriti and earth produce a grounded sleep zone.",
    mitigation: "If not in SW, reduce movement and clutter, use stable furniture, and avoid occupying the NE sacred zone.",
  },
  {
    key: "puja",
    label: "Puja room",
    quality: "Sacred, cool, pure",
    primary: ["ne"],
    secondary: ["e", "n"],
    acceptable: [],
    prohibited: ["s", "sw", "center"],
    reasoning: "Puja belongs to NE because Ishana and water converge with sacred-cool clarity.",
    mitigation: "If a full room is impossible, keep a clean NE shrine within an E or N room.",
  },
  {
    key: "guest",
    label: "Guest room",
    quality: "Temporary, moving, light",
    primary: ["nw"],
    secondary: ["w"],
    acceptable: ["ne"],
    prohibited: ["sw", "center"],
    reasoning: "Guest rooms belong to NW because Vayu and air support temporary occupancy.",
    mitigation: "Keep guest functions temporary; do not displace the SW master-bedroom anchor.",
  },
  {
    key: "bathroom",
    label: "Bathroom",
    quality: "Drainage, dispersal",
    primary: ["nw", "w"],
    secondary: ["s"],
    acceptable: [],
    prohibited: ["ne", "center"],
    reasoning: "Discharge belongs away from NE purity and the open Brahma-sthana; NW or W edges are preferred.",
    mitigation: "If fixed near a sensitive zone, prioritize ventilation, dryness, and strict separation from sacred/water storage.",
  },
  {
    key: "study",
    label: "Study / library",
    quality: "Learning, clarity, attention",
    primary: ["ne", "e"],
    secondary: ["w"],
    acceptable: ["n"],
    prohibited: ["center"],
    reasoning: "Study benefits from NE clarity or East morning light; West supports ordered records and study rhythm.",
    mitigation: "If elsewhere, orient the desk toward E or NE and keep the zone light and quiet.",
  },
  {
    key: "dining",
    label: "Dining room",
    quality: "Meal order, household rhythm",
    primary: ["w"],
    secondary: ["se"],
    acceptable: ["e"],
    prohibited: ["center"],
    reasoning: "Dining belongs to West through Varuna's order and evening household settlement; SE can work near the kitchen.",
    mitigation: "When adjacent to kitchen, preserve airflow and avoid blocking the centre.",
  },
  {
    key: "living",
    label: "Living room",
    quality: "Reception, flow, shared activity",
    primary: ["n", "e", "ne"],
    secondary: ["w"],
    acceptable: [],
    prohibited: ["sw", "center"],
    reasoning: "Living rooms work best in auspicious reception zones around North, East, and NE.",
    mitigation: "If constrained, keep circulation clear and avoid turning the centre into a heavy seating block.",
  },
  {
    key: "treasury",
    label: "Treasury / safe",
    quality: "Resources, valuables, finance",
    primary: ["n"],
    secondary: ["ne"],
    acceptable: ["w"],
    prohibited: ["s"],
    reasoning: "Kubera governs North, making it the primary resource and safe direction.",
    mitigation: "If not in North, use West for order and keep the safe clean, stable, and discreet.",
  },
  {
    key: "entry",
    label: "Main entrance",
    quality: "Receiving, threshold, auspicious entry",
    primary: ["e"],
    secondary: ["n"],
    acceptable: ["ne", "w"],
    prohibited: ["s"],
    reasoning: "East receives Indra and rising light; North receives Kubera. South entry needs care and mitigation.",
    mitigation: "If forced south, use thermal shading, clean threshold discipline, and auspicious interior orientation.",
  },
  {
    key: "children",
    label: "Children's room",
    quality: "Growth, rest, active movement",
    primary: ["w", "nw"],
    secondary: ["e"],
    acceptable: ["n"],
    prohibited: ["sw"],
    reasoning: "West gives balance; NW supports activity. SW should remain the settled master-bedroom anchor.",
    mitigation: "Balance movement with sleep discipline if using NW.",
  },
  {
    key: "utility",
    label: "Utility / store",
    quality: "Stored weight, practical load",
    primary: ["sw", "s"],
    secondary: ["w"],
    acceptable: ["se"],
    prohibited: ["ne", "center"],
    reasoning: "Storage belongs to heavy or restrained zones, never the sacred head-zone or open centre.",
    mitigation: "If storage must be elsewhere, keep it light and avoid NE or centre loading.",
  },
];

export const WORKFLOW_STEPS = [
  "Anchor intercardinal primary assignments: puja-NE, kitchen-SE, master-bedroom-SW, guest/dispersal-NW.",
  "Place cardinal secondary functions around the anchors: entry E/N, treasury N, dining W, ancestors S.",
  "Verify the Brahma-sthana remains open, light, and unblocked.",
  "Check prohibitions: kitchen NE, toilet centre, bedroom NE, entry S without mitigation, heavy NE storage.",
  "Apply honest handling: name the issue, prioritize severity, mitigate proportionally, and avoid fear.",
];

export function getDirection(key: DirectionKey): DirectionCell {
  return DIRECTIONS.find((direction) => direction.key === key) ?? DIRECTIONS[0];
}

export function getRoom(key: RoomKey): RoomPlacement {
  return ROOM_PLACEMENTS.find((room) => room.key === key) ?? ROOM_PLACEMENTS[0];
}
