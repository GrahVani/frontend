export type WallKey = "north" | "east" | "ne" | "west" | "nw" | "se" | "south" | "sw";
export type RoomKey = "living" | "entry" | "bedroom" | "office" | "dressing";
export type FacingKey = "none" | "bed" | "entry" | "stove" | "water";
export type MirrorTypeKey = "flat" | "convex" | "covered";
export type VerdictKey = "canonical" | "acceptable" | "mitigate" | "avoid" | "prohibited";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface WallProfile extends Option<WallKey> {
  verdict: VerdictKey;
  quality: string;
  guidance: string;
}

export const WALLS: WallProfile[] = [
  { key: "north", label: "N wall", note: "Kubera wealth amplification.", verdict: "canonical", quality: "Wealth and clear flow", guidance: "Good for living, office, foyer, and commercial spaces when it does not face bed or entry directly." },
  { key: "east", label: "E wall", note: "Indra light and opportunity.", verdict: "canonical", quality: "Opportunity and light", guidance: "Good for brightening active spaces and supporting opportunity." },
  { key: "ne", label: "NE wall", note: "Combined auspicious quality.", verdict: "acceptable", quality: "Clean sacred clarity", guidance: "Acceptable if kept light, clean, and not used to multiply clutter." },
  { key: "west", label: "W wall", note: "Varuna balanced containment.", verdict: "acceptable", quality: "Order and balance", guidance: "Workable in common areas, records, and dining spaces." },
  { key: "nw", label: "NW wall", note: "Vayu movement.", verdict: "mitigate", quality: "Movement and transit", guidance: "Use in transient spaces; avoid making it a restless focal point." },
  { key: "se", label: "SE wall", note: "Agni fire amplification.", verdict: "avoid", quality: "Fire and heat", guidance: "Avoid in active rooms, especially if reflecting stove, flame, or water-fire conflict." },
  { key: "south", label: "S wall", note: "Yama restraint amplification.", verdict: "avoid", quality: "Restraint and heat", guidance: "Avoid as a general enhancement mirror; use only with careful decor purpose." },
  { key: "sw", label: "SW wall", note: "Nairrti heaviness.", verdict: "avoid", quality: "Weight and settlement", guidance: "Avoid because mirrors disturb the heavy, settled sleep and stability zone." },
];

export const ROOMS: Option<RoomKey>[] = [
  { key: "living", label: "Living room", note: "Active shared space; N/E mirrors can work well." },
  { key: "entry", label: "Entry foyer", note: "Side-wall mirror is acceptable; direct door-facing is not." },
  { key: "bedroom", label: "Bedroom", note: "Mirror must never face the bed; cover or relocate if fixed." },
  { key: "office", label: "Office", note: "Use N/E mirrors carefully to brighten and expand active work." },
  { key: "dressing", label: "Dressing area", note: "Best bedroom-adjacent location when mirror does not face bed." },
];

export const FACING: Option<FacingKey>[] = [
  { key: "none", label: "No sensitive reflection", note: "The mirror does not directly face bed, entry, stove, or water conflict." },
  { key: "bed", label: "Faces bed", note: "Bedroom sleep prohibition." },
  { key: "entry", label: "Faces entry door", note: "Reflects entry flow outward." },
  { key: "stove", label: "Reflects stove", note: "Can multiply Agni heat." },
  { key: "water", label: "Reflects water source", note: "Can create water-fire or cluttered jala amplification depending zone." },
];

export const MIRROR_TYPES: Option<MirrorTypeKey>[] = [
  { key: "flat", label: "Flat mirror", note: "Modern Vastu decor remedy; use honest attribution." },
  { key: "convex", label: "Convex mirror", note: "Feng Shui-derived deflection adapted by some modern Vastu practitioners." },
  { key: "covered", label: "Covered at night", note: "Immediate mitigation for fixed bedroom mirrors." },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findWall(key: WallKey): WallProfile {
  return WALLS.find((item) => item.key === key) ?? WALLS[0];
}

export function rankVerdict(verdict: VerdictKey) {
  return { canonical: 0, acceptable: 1, mitigate: 2, avoid: 3, prohibited: 4 }[verdict];
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "canonical") return "Canonical";
  if (verdict === "acceptable") return "Acceptable";
  if (verdict === "mitigate") return "Accept with mitigation";
  if (verdict === "avoid") return "Avoid";
  return "Prohibited";
}

export function judgeMirror(wall: WallProfile, room: RoomKey, facing: FacingKey, mirrorType: MirrorTypeKey): VerdictKey {
  if (facing === "bed") return mirrorType === "covered" ? "mitigate" : "prohibited";
  if (facing === "entry") return "avoid";
  if (room === "bedroom" && mirrorType !== "covered" && (wall.key === "sw" || wall.key === "south")) return "prohibited";
  if (facing === "stove" && (wall.key === "se" || room === "living" || room === "office")) return "avoid";
  if (mirrorType === "convex" && room !== "entry") return "mitigate";
  return wall.verdict;
}

export function mitigationFor(verdict: VerdictKey, facing: FacingKey, mirrorType: MirrorTypeKey) {
  if (facing === "bed" && mirrorType !== "covered") return "Cover the mirror at night, rotate it away from the bed, or move it to a dressing area.";
  if (facing === "entry") return "Move it to a side wall so entry flow is not reflected directly outward.";
  if (facing === "stove") return "Avoid multiplying fire; shift the mirror or soften the reflective field.";
  if (mirrorType === "convex") return "Name it honestly as Feng Shui-derived modern adaptation, not classical Vastu attestation.";
  if (verdict === "avoid") return "Use a lighter decor alternative or relocate toward N/E/NE/W depending room function.";
  if (verdict === "mitigate") return "Use modest size, clean framing, and avoid reflecting clutter or movement.";
  return "Keep the mirror clean, proportionate, and free from clutter reflection.";
}
