export type ShapeKey = "square" | "rectangle" | "elongated" | "modestL" | "tShape" | "uCourtyard" | "uIndent" | "circle" | "irregular";
export type CornerKey = "complete" | "neMissing" | "swMissing" | "seMissing" | "nwMissing" | "eastEdgeCut";
export type RotationKey = "aligned" | "minor" | "moderate" | "suboptimal" | "diagonal";
export type ContextKey = "preConstruction" | "existingHome" | "apartment" | "renovation";
export type VerdictKey = "canonical" | "secondary" | "mitigate" | "suboptimal" | "severe" | "prohibited";

export interface Option<T extends string> {
  key: T;
  label: string;
  verdict: VerdictKey;
  note: string;
  mitigation: string;
}

export const SHAPES: Option<ShapeKey>[] = [
  { key: "square", label: "Square", verdict: "canonical", note: "Cleanest building form for mandala superposition and centre integrity.", mitigation: "Preserve right angles and keep the centre open." },
  { key: "rectangle", label: "Rectangle", verdict: "canonical", note: "Canonical when proportions remain close to 1:1 through 1:2.", mitigation: "Align the building to N-S and E-W axes." },
  { key: "elongated", label: "Elongated rectangle", verdict: "secondary", note: "Workable when not extreme; mandala mapping remains coherent.", mitigation: "Keep Brahmasthana identifiable and avoid long dead corridors." },
  { key: "modestL", label: "Modest L-shape", verdict: "mitigate", note: "Can be workable when the missing corner is symbolically restored.", mitigation: "Mark the geometric corner with pillar, lighting, landscape, and correct room use." },
  { key: "tShape", label: "T-shape", verdict: "prohibited", note: "Fragments the mandala with one dominant projection and missing balancing corners.", mitigation: "Prefer redesign to a regular rectangle or inscribed quadrilateral." },
  { key: "uCourtyard", label: "U with central courtyard", verdict: "canonical", note: "A true Brahmangana courtyard can honour the open centre.", mitigation: "Keep the courtyard central, sacred, clean, and not a service indentation." },
  { key: "uIndent", label: "U with deep indentation", verdict: "prohibited", note: "A prominent indentation can wound the centre instead of honouring it.", mitigation: "Redesign as central courtyard or restore the missing mass proportionally." },
  { key: "circle", label: "Circular residential form", verdict: "prohibited", note: "No clean corners for the Vastu Purusha anatomy in ordinary residential use.", mitigation: "Use a rectangular internal planning grid if form is unavoidable." },
  { key: "irregular", label: "Irregular polygon", verdict: "prohibited", note: "Unclear corners and axes fragment the deity grid.", mitigation: "Regularise through walls, interior planning, or architectural redesign." },
];

export const CORNERS: Option<CornerKey>[] = [
  { key: "complete", label: "All corners present", verdict: "canonical", note: "Corner integrity allows clean NE, SE, SW, and NW assignments.", mitigation: "Protect all four corners from heavy cuts and confusing projections." },
  { key: "neMissing", label: "NE missing", verdict: "severe", note: "Head-zone loss: one of the strongest building-form faults.", mitigation: "Architectural extension is best; otherwise mark NE with pillar, light colour, water, and sacred placement." },
  { key: "swMissing", label: "SW missing", verdict: "severe", note: "Feet-zone loss: weakens grounding and structural stability symbolism.", mitigation: "Restore mass if feasible; otherwise add weight, boundary, and grounded treatment at geometric SW." },
  { key: "seMissing", label: "SE missing", verdict: "mitigate", note: "Secondary-axis corner loss affecting fire/kitchen placement.", mitigation: "Contain kitchen fire elsewhere and symbolically mark Agni corner." },
  { key: "nwMissing", label: "NW missing", verdict: "mitigate", note: "Secondary-axis corner loss affecting movement and guest/dispersal functions.", mitigation: "Recover ventilation/dispersal through windows, exhaust, and light transient use." },
  { key: "eastEdgeCut", label: "Cardinal edge cut", verdict: "mitigate", note: "Moderate edge loss; less severe than primary-axis corner loss.", mitigation: "Restore the edge through boundary rhythm, light, and functional alignment." },
];

export const ROTATIONS: Option<RotationKey>[] = [
  { key: "aligned", label: "0 deg aligned", verdict: "canonical", note: "Walls align N-S/E-W and corners face intercardinals.", mitigation: "Use this as the design target in new construction." },
  { key: "minor", label: "Within +/-5 deg", verdict: "secondary", note: "Minor deviation; framework still applies cleanly.", mitigation: "Use exact compass mapping for internal rooms." },
  { key: "moderate", label: "5-15 deg", verdict: "mitigate", note: "Workable with symbolic realignment and careful room assignment.", mitigation: "Use internal grid discipline and avoid compounding with missing corners." },
  { key: "suboptimal", label: "15-30 deg", verdict: "suboptimal", note: "Mandala overlay becomes compromised.", mitigation: "Prefer redesign if possible; otherwise apply substantial symbolic correction." },
  { key: "diagonal", label: "30-45 deg", verdict: "prohibited", note: "Corners approach cardinal directions, inverting the intended assignment pattern.", mitigation: "Avoid if design is still flexible; use expert remediation if fixed." },
];

export const CONTEXTS: Option<ContextKey>[] = [
  { key: "preConstruction", label: "Pre-construction", verdict: "canonical", note: "Best moment to choose canonical shape, alignment, and complete corners.", mitigation: "Redesign before foundation if severe form faults appear." },
  { key: "existingHome", label: "Existing home", verdict: "mitigate", note: "Structural changes may be costly but sometimes possible.", mitigation: "Compare architectural extension with symbolic mitigation and cost." },
  { key: "apartment", label: "Apartment", verdict: "secondary", note: "Building form is fixed by developer; unit-level mitigation is the practical path.", mitigation: "Read the whole building form, then apply internal room and symbolic correction." },
  { key: "renovation", label: "Renovation", verdict: "mitigate", note: "Form changes are constrained by structure, codes, and budget.", mitigation: "Respect engineering; do not demand unsafe structural modifications." },
];

export function rankVerdict(verdict: VerdictKey) {
  return { canonical: 0, secondary: 1, mitigate: 2, suboptimal: 3, severe: 4, prohibited: 5 }[verdict];
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "canonical") return "Canonical";
  if (verdict === "secondary") return "Secondary";
  if (verdict === "mitigate") return "Accept with mitigation";
  if (verdict === "suboptimal") return "Suboptimal";
  if (verdict === "severe") return "Severe";
  return "Prohibited";
}
