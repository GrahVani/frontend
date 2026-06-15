export type SeverityKey = "mild" | "moderate" | "severe" | "canonical";
export type DefectKey = "neCut" | "swCut" | "seCut" | "centreToilet" | "southEntry" | "minorEdge";
export type ContextKey = "preConstruction" | "existingHome" | "apartment" | "office";
export type DeviceKey = "yantra" | "pyramid" | "none";
export type TierKey = "architectural" | "symbolic" | "device" | "ritual";
export type PriorityKey = "required" | "recommended" | "optional" | "notNeeded";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface DefectProfile extends Option<DefectKey> {
  severity: SeverityKey;
  diagnosis: string;
}

export interface TierReading {
  key: TierKey;
  label: string;
  priority: PriorityKey;
  action: string;
  caution: string;
}

export const DEFECTS: DefectProfile[] = [
  {
    key: "neCut",
    label: "NE corner cut",
    note: "Head-zone loss.",
    severity: "severe",
    diagnosis: "A primary-axis cut. Restore architecturally if possible; otherwise layer symbolic, device, and ritual support.",
  },
  {
    key: "swCut",
    label: "SW corner cut",
    note: "Grounding loss.",
    severity: "severe",
    diagnosis: "A primary-axis cut. The feet-zone needs mass, boundary, and practical stabilization.",
  },
  {
    key: "seCut",
    label: "SE corner cut",
    note: "Agni host-corner loss.",
    severity: "moderate",
    diagnosis: "A secondary-axis cut. Fire/kitchen discipline becomes the main correction theme.",
  },
  {
    key: "centreToilet",
    label: "Toilet in centre",
    note: "Brahmasthana violation.",
    severity: "severe",
    diagnosis: "A centre violation. Relocation is best; symbolic and ritual support are secondary.",
  },
  {
    key: "southEntry",
    label: "South entry",
    note: "Restraint-direction entry.",
    severity: "moderate",
    diagnosis: "A moderate placement concern. Correct threshold, lighting, and use before recommending heavy construction.",
  },
  {
    key: "minorEdge",
    label: "Small edge notch",
    note: "Minor footprint irregularity.",
    severity: "mild",
    diagnosis: "A mild deviation. Light symbolic correction is usually enough.",
  },
];

export const CONTEXTS: Option<ContextKey>[] = [
  { key: "preConstruction", label: "Pre-construction", note: "Structural correction is most realistic before foundation and walls." },
  { key: "existingHome", label: "Existing home", note: "Balance cost, engineering, family use, and symbolic alternatives." },
  { key: "apartment", label: "Apartment", note: "Treat the fixed shell honestly; use internal zoning and symbolic support." },
  { key: "office", label: "Office", note: "Prefer low-disruption correction, circulation clarity, and work-function alignment." },
];

export const DEVICES: Option<DeviceKey>[] = [
  { key: "yantra", label: "Classical yantra", note: "Classically attested geometric remedy category; place with lineage discipline." },
  { key: "pyramid", label: "Modern pyramid", note: "Modern popular Vastu product; some traditions use it, but do not call it classical." },
  { key: "none", label: "No device", note: "Use architectural, symbolic, and ritual tiers without a special product." },
];

export const SEVERITY_OPTIONS: Option<SeverityKey>[] = [
  { key: "severe", label: "Severe", note: "Layer all possible tiers; architectural correction first if feasible." },
  { key: "moderate", label: "Moderate", note: "Symbolic correction is primary; devices and ritual are optional supports." },
  { key: "mild", label: "Mild", note: "Light symbolic support is enough; avoid over-prescribing products." },
  { key: "canonical", label: "Canonical", note: "No defect. Maintain cleanliness, order, and ritual discipline if desired." },
];

export function priorityLabel(priority: PriorityKey) {
  if (priority === "required") return "Required";
  if (priority === "recommended") return "Recommended";
  if (priority === "optional") return "Optional";
  return "Not needed";
}

export function priorityRank(priority: PriorityKey) {
  return { required: 3, recommended: 2, optional: 1, notNeeded: 0 }[priority];
}

export function getTierReadings(severity: SeverityKey, context: ContextKey, device: DeviceKey): TierReading[] {
  const fixedShell = context === "apartment" || context === "office";
  const structuralPossible = context === "preConstruction";
  const architecturalPriority: PriorityKey =
    severity === "severe" ? (fixedShell ? "optional" : "recommended") : severity === "moderate" && structuralPossible ? "optional" : "notNeeded";
  const symbolicPriority: PriorityKey = severity === "canonical" ? "notNeeded" : severity === "mild" ? "optional" : "recommended";
  const devicePriority: PriorityKey =
    device === "none" || severity === "canonical" || severity === "mild" ? "notNeeded" : severity === "severe" ? "recommended" : "optional";
  const ritualPriority: PriorityKey = severity === "severe" ? "recommended" : severity === "canonical" ? "optional" : "optional";

  return [
    {
      key: "architectural",
      label: "Tier 1 Architectural",
      priority: architecturalPriority,
      action: fixedShell ? "Do not demand unsafe reconstruction; evaluate only practical alterations." : "Restore, relocate, extend, or restructure when feasible.",
      caution: "Requires engineering, code, ownership, and cost checks.",
    },
    {
      key: "symbolic",
      label: "Tier 2 Symbolic",
      priority: symbolicPriority,
      action: "Use color, light, weight, water, sacred image, furniture, landscape, and room-use correction.",
      caution: "This is the workhorse tier when construction cannot change.",
    },
    {
      key: "device",
      label: "Tier 3 Yantra / Pyramid",
      priority: devicePriority,
      action: device === "yantra" ? "Use a classical yantra with honest placement and ritual discipline." : device === "pyramid" ? "Use only with honest modern-innovation attribution." : "No device layer selected.",
      caution: device === "pyramid" ? "Do not present modern pyramids as classical textual remedies." : "Devices reinforce diagnosis; they do not replace it.",
    },
    {
      key: "ritual",
      label: "Tier 4 Ritual",
      priority: ritualPriority,
      action: "Use Vastu puja, bhumi-puja, griha-pravesha support, and daily Brahmasthana respect.",
      caution: "Recommend within dharma tradition; a qualified purohita may perform formal ritual.",
    },
  ];
}

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findDefect(key: DefectKey): DefectProfile {
  return DEFECTS.find((item) => item.key === key) ?? DEFECTS[0];
}
