export type ContextKey = "apartment" | "office" | "retail" | "restaurant" | "factory" | "hospital";
export type FunctionKey = "desk" | "cashVault" | "conference" | "heavyStorage" | "kitchen" | "entry" | "bathroom" | "patientRoom";
export type ZoneKey = "nw" | "north" | "ne" | "west" | "centre" | "east" | "sw" | "south" | "se";
export type VerdictKey = "canonical" | "secondary" | "mitigate" | "avoid" | "prohibited";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface FunctionProfile extends Option<FunctionKey> {
  canonical: ZoneKey[];
  secondary: ZoneKey[];
  avoid: ZoneKey[];
  prohibited: ZoneKey[];
  principle: string;
  correction: string;
}

export interface ZoneProfile {
  key: ZoneKey;
  label: string;
  deity: string;
  use: string;
}

export const ZONES: ZoneProfile[] = [
  { key: "nw", label: "NW", deity: "Vayu", use: "movement, guests, dispersal" },
  { key: "north", label: "N", deity: "Kubera", use: "wealth, reception, clear work" },
  { key: "ne", label: "NE", deity: "Isana", use: "puja, clarity, light, water" },
  { key: "west", label: "W", deity: "Varuna", use: "records, dining, order" },
  { key: "centre", label: "Centre", deity: "Brahma", use: "open, clean, unburdened" },
  { key: "east", label: "E", deity: "Indra", use: "entry, study, rising light" },
  { key: "sw", label: "SW", deity: "Nairrti", use: "weight, seniority, stability" },
  { key: "south", label: "S", deity: "Yama", use: "restraint, service, heat" },
  { key: "se", label: "SE", deity: "Agni", use: "kitchen, electrical, controlled fire" },
];

export const CONTEXTS: Option<ContextKey>[] = [
  { key: "apartment", label: "Apartment", note: "Building shell is fixed; apply the mandala inside the unit." },
  { key: "office", label: "Office", note: "Prioritize desk direction, cash placement, meeting flow, and door visibility." },
  { key: "retail", label: "Retail shop", note: "Entry, cash counter, display weight, and customer movement matter most." },
  { key: "restaurant", label: "Restaurant", note: "Kitchen fire, dining flow, cash, and waste zones need separation." },
  { key: "factory", label: "Factory", note: "Heavy machinery and raw storage belong to weight-bearing zones." },
  { key: "hospital", label: "Hospital", note: "Patient rooms, medicine storage, waste, and clarity of movement need care." },
];

export const FUNCTIONS: FunctionProfile[] = [
  {
    key: "desk",
    label: "Desk / seating",
    note: "Occupant should face N or E, without back to door.",
    canonical: ["north", "east"],
    secondary: ["ne"],
    avoid: ["west"],
    prohibited: ["south"],
    principle: "Work posture is active. Facing north supports Kubera clarity; facing east supports Indra light.",
    correction: "Rotate the desk first. If furniture is fixed, improve door visibility and use light symbolic support.",
  },
  {
    key: "cashVault",
    label: "Cash vault / safe",
    note: "Wealth category belongs to N, not SW.",
    canonical: ["north"],
    secondary: ["ne", "east"],
    avoid: ["sw", "west"],
    prohibited: ["south"],
    principle: "Cash is wealth-storage, so it follows Kubera/N. SW is for heavy non-valuable storage, not treasury.",
    correction: "Move the safe to N or NE if possible. Do not justify SW merely because the safe is heavy.",
  },
  {
    key: "conference",
    label: "Conference room",
    note: "Decision-making prefers N, NE, or E.",
    canonical: ["north", "ne"],
    secondary: ["east"],
    avoid: ["west", "south"],
    prohibited: ["centre"],
    principle: "Meetings need clear speech, ethical judgment, and business support.",
    correction: "Place the chairperson facing N or E and avoid seating people with their backs to the door.",
  },
  {
    key: "heavyStorage",
    label: "Heavy storage",
    note: "Weight category belongs to SW and S.",
    canonical: ["sw"],
    secondary: ["south", "west"],
    avoid: ["north", "east"],
    prohibited: ["ne", "centre"],
    principle: "Heavy non-valuable storage stabilizes the earth side; it should not burden NE or the centre.",
    correction: "Move heavy stock, files, or machinery toward SW/S while keeping NE light.",
  },
  {
    key: "kitchen",
    label: "Kitchen / pantry",
    note: "Controlled fire belongs to SE.",
    canonical: ["se"],
    secondary: ["nw"],
    avoid: ["south", "west"],
    prohibited: ["ne", "centre"],
    principle: "Kitchen fire follows Agni/SE. NE kitchen creates fire-water conflict.",
    correction: "If relocation is impossible, contain heat, improve ventilation, and keep NE clean and light.",
  },
  {
    key: "entry",
    label: "Main entry",
    note: "E and N are most supportive.",
    canonical: ["east", "north"],
    secondary: ["ne"],
    avoid: ["west", "south"],
    prohibited: ["sw"],
    principle: "Entry controls the first flow into the unit or business.",
    correction: "If entry is fixed, correct threshold lighting, cleanliness, signage, and movement path.",
  },
  {
    key: "bathroom",
    label: "Bathroom / waste",
    note: "Prefer NW or W edge, never NE or centre.",
    canonical: ["nw", "west"],
    secondary: ["south"],
    avoid: ["east", "north"],
    prohibited: ["ne", "centre"],
    principle: "Waste and drainage need edge placement, not sacred or central placement.",
    correction: "When fixed, improve ventilation, dryness, cleanliness, and symbolic separation.",
  },
  {
    key: "patientRoom",
    label: "Patient room",
    note: "Light and airy zones support recovery.",
    canonical: ["ne", "north", "east"],
    secondary: ["nw"],
    avoid: ["south", "west"],
    prohibited: ["centre"],
    principle: "Recovery spaces benefit from light, airflow, and calm clarity.",
    correction: "If ward layout is fixed, use light, ventilation, clean circulation, and quiet zoning.",
  },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findFunction(key: FunctionKey): FunctionProfile {
  return FUNCTIONS.find((item) => item.key === key) ?? FUNCTIONS[0];
}

export function findZone(key: ZoneKey): ZoneProfile {
  return ZONES.find((item) => item.key === key) ?? ZONES[0];
}

export function judgePlacement(profile: FunctionProfile, zone: ZoneKey): VerdictKey {
  if (profile.canonical.includes(zone)) return "canonical";
  if (profile.secondary.includes(zone)) return "secondary";
  if (profile.prohibited.includes(zone)) return "prohibited";
  if (profile.avoid.includes(zone)) return "avoid";
  return "mitigate";
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "canonical") return "Canonical";
  if (verdict === "secondary") return "Secondary";
  if (verdict === "mitigate") return "Accept with mitigation";
  if (verdict === "avoid") return "Avoid";
  return "Prohibited";
}
