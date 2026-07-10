export type SlopeKey = "swToNe" | "toNorthEast" | "level" | "toNw" | "toSe" | "neToSw" | "toCenter";
export type DrainageKey = "rainNe" | "rainNorth" | "sewageNw" | "sewageNe" | "centerCrossing" | "swExit";
export type PhaseKey = "preConstruction" | "postConstruction" | "apartment" | "townhouse";
export type VerticalKey = "swPlinthHigh" | "uniformPlinth" | "nePenthouse" | "swBasement" | "neBasement" | "centerBasement";
export type VerdictKey = "canonical" | "secondary" | "workable" | "mixed" | "avoid" | "severe";

export interface Option<T extends string> {
  key: T;
  label: string;
  verdict: VerdictKey;
  note: string;
  mitigation: string;
}

export const SLOPES: Option<SlopeKey>[] = [
  { key: "swToNe", label: "SW high -> NE low", verdict: "canonical", note: "Canonical polar-axis slope. The heavy feet-zone is high and water moves toward the light head-zone.", mitigation: "Preserve a gentle 1-3% gradient and ensure drainage does not stagnate." },
  { key: "toNorthEast", label: "Toward N / E", verdict: "secondary", note: "Partially honours the auspicious north/east fall even without the full diagonal.", mitigation: "Keep SW weighted and NE open so the symbolic polar axis remains clear." },
  { key: "level", label: "Level ground", verdict: "workable", note: "No reversal. Symbolic elevation can carry the discipline.", mitigation: "Use practical drainage plus lighter NE and heavier SW treatment." },
  { key: "toNw", label: "Toward NW", verdict: "mixed", note: "Secondary-axis drainage. Less severe than polar reversal, but not canonical.", mitigation: "Keep NE as a fresh entry and route dirty discharge to NW/W only." },
  { key: "toSe", label: "Toward SE", verdict: "avoid", note: "Water is pulled toward Agni, creating fire-water tension at the drainage point.", mitigation: "Redirect drainage toward N/NE/NW where feasible." },
  { key: "neToSw", label: "NE high -> SW low", verdict: "severe", note: "Severe elevation reversal: the sacred head-zone becomes high and the heavy feet-zone becomes low.", mitigation: "Pre-construction: consult civil engineer for cut-and-fill. Finished building: symbolic mitigation only." },
  { key: "toCenter", label: "Toward centre", verdict: "severe", note: "Water gathers at Brahmasthana, the integrative centre.", mitigation: "Redesign drainage immediately; keep pipes and pooling away from the centre." },
];

export const DRAINAGE: Option<DrainageKey>[] = [
  { key: "rainNe", label: "Rainwater exits NE", verdict: "canonical", note: "Clean rainwater can exit toward the jala side.", mitigation: "Keep it clean, flowing, and non-stagnant." },
  { key: "rainNorth", label: "Rainwater exits N", verdict: "secondary", note: "North exit is acceptable and cool-supportive.", mitigation: "Check that water does not pool near the centre." },
  { key: "sewageNw", label: "Sewage exits NW/W", verdict: "workable", note: "Dirty discharge belongs toward dispersal/order zones, not sacred NE.", mitigation: "Maintain sealed plumbing, ventilation, and slope to periphery." },
  { key: "sewageNe", label: "Sewage exits NE", verdict: "severe", note: "Confuses clean-water drainage with sewage and defiles the sacred jala zone.", mitigation: "Reroute if feasible; otherwise strict cleanliness, ventilation, and remediation planning." },
  { key: "centerCrossing", label: "Pipes cross centre", verdict: "avoid", note: "Drainage through Brahmasthana violates the open-centre discipline.", mitigation: "Route pipes along periphery where feasible." },
  { key: "swExit", label: "Drainage exits SW", verdict: "avoid", note: "Water exits at the heavy earth pole, weakening the polar discipline.", mitigation: "Redirect toward N/NE/NW if site engineering allows." },
];

export const PHASES: Option<PhaseKey>[] = [
  { key: "preConstruction", label: "Pre-construction plot", verdict: "canonical", note: "Best window for grading correction.", mitigation: "Use civil-engineering cut-and-fill before foundation work." },
  { key: "postConstruction", label: "Finished house", verdict: "mixed", note: "Earthwork is usually disruptive or infeasible.", mitigation: "Use symbolic elevation, drainage maintenance, and localized remediation." },
  { key: "apartment", label: "Apartment", verdict: "workable", note: "Ground slope and building massing are mostly fixed.", mitigation: "Judge building context; mitigate inside with NE lightness and SW weight." },
  { key: "townhouse", label: "Townhouse", verdict: "secondary", note: "Some site and plinth decisions may still be possible.", mitigation: "Apply plot grading if pre-construction; otherwise symbolic correction." },
];

export const VERTICALS: Option<VerticalKey>[] = [
  { key: "swPlinthHigh", label: "SW plinth higher", verdict: "canonical", note: "Extends the heavy pole vertically.", mitigation: "Pair with a lower/open NE approach." },
  { key: "uniformPlinth", label: "Uniform plinth", verdict: "workable", note: "Modern construction often uses a level plinth.", mitigation: "Recover slope logic through drainage and interior symbolic elevation." },
  { key: "nePenthouse", label: "Penthouse / mass at NE", verdict: "avoid", note: "Upper mass crowds the light head-zone.", mitigation: "Prefer stepped massing away from NE; keep NE terraces light." },
  { key: "swBasement", label: "Basement at SW", verdict: "severe", note: "Hollows out the heavy feet-zone and may collect water.", mitigation: "Avoid in design; if existing, keep it dry, weighted, ventilated, and structurally monitored." },
  { key: "neBasement", label: "Basement at NE", verdict: "secondary", note: "Accepted in some traditions because NE is the low/light zone.", mitigation: "Disclose tradition variance and keep it dry and bright." },
  { key: "centerBasement", label: "Basement under centre", verdict: "avoid", note: "Creates a hollow/water-risk below Brahmasthana.", mitigation: "Avoid water pooling and keep centre above open/light." },
];

export function rankVerdict(verdict: VerdictKey) {
  return { canonical: 0, secondary: 1, workable: 2, mixed: 3, avoid: 4, severe: 5 }[verdict];
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "canonical") return "Canonical";
  if (verdict === "secondary") return "Secondary";
  if (verdict === "workable") return "Workable";
  if (verdict === "mixed") return "Mixed";
  if (verdict === "avoid") return "Avoid";
  return "Severe";
}
