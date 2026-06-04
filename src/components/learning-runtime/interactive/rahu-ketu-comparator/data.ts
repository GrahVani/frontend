export interface NodeAttribute {
  id: string;
  label: string;
  rahu: string;
  ketu: string;
  isInversion?: boolean;
}

export const COMPARISON_DATA: NodeAttribute[] = [
  { id: "direction", label: "Direction", rahu: "outward, grasping", ketu: "inward, releasing" },
  { id: "karaka", label: "Primary kāraka", rahu: "foreign / amplification", ketu: "mokṣa / detachment" },
  { id: "mode", label: "Mode", rahu: "amplifies (Mercury-like)", ketu: "cuts (Mars-like)" },
  { id: "gender", label: "Gender", rahu: "generally male", ketu: "generally neuter" },
  { id: "gem", label: "Gem", rahu: "hessonite", ketu: "cat's eye" },
  { id: "mars", label: "Mars", rahu: "enemy", ketu: "friend", isInversion: true },
  { id: "mercury", label: "Mercury", rahu: "friend", ketu: "neutral", isInversion: true },
  { id: "dasa", label: "Daśā", rahu: "18 years", ketu: "7 years" },
  { id: "chart", label: "In a chart", rahu: "where the soul grasps", ketu: "where the soul renounces" },
];

export type InteractiveMode = "scan" | "axis" | "conjunction" | "dasa";
