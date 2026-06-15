export type ShapeKey = "square" | "rectangle" | "elongated" | "triangle" | "irregular";
export type DirectionModKey = "none" | "neExtension" | "neCut" | "swExtension" | "swCut" | "seExtension" | "nwExtension";
export type RoadKey = "east" | "north" | "ne" | "south" | "west" | "tJunction" | "culDeSac";
export type TopographyKey = "canonical" | "flat" | "reverseSlope" | "waterNE" | "waterSW" | "treesSW" | "treesNE";
export type VerdictKey = "primary" | "secondary" | "mitigate" | "avoid" | "prohibited";

export interface Option<T extends string> {
  key: T;
  label: string;
  verdict: VerdictKey;
  note: string;
  mitigation: string;
}

export const SHAPES: Option<ShapeKey>[] = [
  { key: "square", label: "Square", verdict: "primary", note: "Hosts the mandala cleanly with a stable Brahmasthana.", mitigation: "Preserve right angles and keep internal centre open." },
  { key: "rectangle", label: "Rectangle", verdict: "primary", note: "A regular rectangle up to about 1:2 remains canonical.", mitigation: "Align the mandala to the longest clean rectangle." },
  { key: "elongated", label: "Elongated", verdict: "mitigate", note: "Workable if not extreme, but circulation and centre placement need care.", mitigation: "Use the largest clean internal rectangle and balance the unused strip gently." },
  { key: "triangle", label: "Triangular", verdict: "prohibited", note: "Tri-mukhi dosha: the mandala and centre cannot sit cleanly.", mitigation: "Prefer another plot; if already owned, plan major boundary/landscape correction." },
  { key: "irregular", label: "Highly irregular", verdict: "prohibited", note: "Irregular boundaries distort deity zones and the central grid.", mitigation: "Prefer another plot or regularise through compound-wall and usable-rectangle planning." },
];

export const DIRECTION_MODS: Option<DirectionModKey>[] = [
  { key: "none", label: "No extension/cut", verdict: "primary", note: "Regular boundaries keep directional operations neutral.", mitigation: "Evaluate road, slope, water, and neighbours next." },
  { key: "neExtension", label: "NE extension", verdict: "primary", note: "Adds to the sacred head-zone; the strongest auspicious modifier.", mitigation: "Keep the extended NE light, open, clean, and water-friendly." },
  { key: "neCut", label: "NE cut", verdict: "prohibited", note: "Removes from the head-zone; one of the most serious plot-level cuts.", mitigation: "Avoid purchase if possible; correction needs boundary and symbolic head-zone restoration." },
  { key: "swExtension", label: "SW extension", verdict: "mitigate", note: "Adds earth weight and stability but can over-emphasise the heavy pole.", mitigation: "Keep NE open and avoid letting SW dominate the whole plan." },
  { key: "swCut", label: "SW cut", verdict: "avoid", note: "Weakens the feet-zone and the plot's grounding.", mitigation: "Regularise with boundary correction or recover weight/stability in the SW." },
  { key: "seExtension", label: "SE extension", verdict: "avoid", note: "Over-extends fire and may produce heat/agitation.", mitigation: "Contain fire use and balance with NE/N openness." },
  { key: "nwExtension", label: "NW extension", verdict: "avoid", note: "Over-extends movement and dispersal.", mitigation: "Use light/transient functions and do not put settled household anchors there." },
];

export const ROADS: Option<RoadKey>[] = [
  { key: "east", label: "East road", verdict: "primary", note: "Indra and rising-light entry: first-choice road access.", mitigation: "Keep entry clean, visible, and not blocked by trees or clutter." },
  { key: "north", label: "North road", verdict: "primary", note: "Kubera/cool-pole entry: strong first-tier access.", mitigation: "Preserve northern openness and drainage clarity." },
  { key: "ne", label: "NE road", verdict: "secondary", note: "Acceptable intercardinal access with auspicious head-zone emphasis.", mitigation: "Keep entry gentle and avoid crowding the NE with heavy gate structures." },
  { key: "south", label: "South road", verdict: "mitigate", note: "Acceptable with yama-dvara discipline and careful entry planning.", mitigation: "Use controlled entry, threshold discipline, and stronger NE/N/E openness." },
  { key: "west", label: "West road", verdict: "mitigate", note: "Acceptable with mitigation and good internal orientation.", mitigation: "Balance with east/north light and internal main-door discipline." },
  { key: "tJunction", label: "T-junction front", verdict: "prohibited", note: "Vitha-vidha dosha: road force points directly at the plot.", mitigation: "Avoid if alternatives exist; if proceeding, use setback, boundary wall, vegetation, and reoriented entry." },
  { key: "culDeSac", label: "Cul-de-sac", verdict: "avoid", note: "Can restrict air flow and create stagnant access.", mitigation: "Check ventilation paths and avoid blocked NE-to-NW circulation." },
];

export const TOPOGRAPHY: Option<TopographyKey>[] = [
  { key: "canonical", label: "SW high, NE low", verdict: "primary", note: "Matches the polar-axis elevation discipline.", mitigation: "Preserve drainage toward N/NE without standing water." },
  { key: "flat", label: "Flat", verdict: "secondary", note: "Acceptable when drainage and internal symbolic elevation are managed.", mitigation: "Create practical drainage and keep NE lighter than SW." },
  { key: "reverseSlope", label: "NE high, SW low", verdict: "avoid", note: "Reverses the ideal elevation logic.", mitigation: "Regrade if feasible; otherwise correct with drainage and symbolic weight/opening treatment." },
  { key: "waterNE", label: "Water in NE", verdict: "primary", note: "Canonical jala placement.", mitigation: "Keep water clean, contained, and not stagnant." },
  { key: "waterSW", label: "Water in SW", verdict: "prohibited", note: "Places water in the earth pole and reverses the plot axis.", mitigation: "Relocate if feasible; if fixed, ensure dryness, drainage, and strong earth correction." },
  { key: "treesSW", label: "Large trees SW", verdict: "secondary", note: "Supports the heavy earth pole.", mitigation: "Ensure roots and shadows do not damage building structure." },
  { key: "treesNE", label: "Large trees NE", verdict: "avoid", note: "Blocks the light, open, sacred head-zone.", mitigation: "Thin, relocate, or keep only light planting in NE." },
];

export function rankVerdict(verdict: VerdictKey) {
  return { primary: 0, secondary: 1, mitigate: 2, avoid: 3, prohibited: 4 }[verdict];
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "primary") return "Primary";
  if (verdict === "secondary") return "Secondary";
  if (verdict === "mitigate") return "Accept with mitigation";
  if (verdict === "avoid") return "Avoid if possible";
  return "Prohibited";
}
