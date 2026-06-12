import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type FrameKey = "natal" | "lalKitabAnnual" | "tajikaAnnual";

export interface FrameProfile {
  key: FrameKey;
  label: string;
  shortLabel: string;
  color: string;
  tint: string;
  timeFrame: string;
  recomputed: string;
  reads: string;
  tools: string[];
  warning: string;
}

export interface ToolGate {
  label: string;
  belongsTo: FrameKey;
  note: string;
}

export const FRAMES: Record<FrameKey, FrameProfile> = {
  natal: {
    key: "natal",
    label: "Natal Teva",
    shortLabel: "Lifetime",
    color: "#7A5E24",
    tint: "#F3E6C8",
    timeFrame: "Whole life",
    recomputed: "Cast once at birth",
    reads: "The standing lifetime baseline against which annual themes are checked.",
    tools: ["fixed-Aries Teva", "birth placements", "lifelong tendencies"],
    warning: "Do not treat the annual chart as merely the natal Teva re-read each year.",
  },
  lalKitabAnnual: {
    key: "lalKitabAnnual",
    label: "Lal Kitab Varshphala",
    shortLabel: "This year",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
    timeFrame: "One birth-year cycle",
    recomputed: "Recast each year from the nativity",
    reads: "The year's themes and the upaya invited by that year.",
    tools: ["fixed-Aries Teva", "Lal Kitab planet attributes", "remedy focus"],
    warning: "Cross-check against the natal Teva; do not replace it.",
  },
  tajikaAnnual: {
    key: "tajikaAnnual",
    label: "Tajika Varshaphala",
    shortLabel: "Separate system",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
    timeFrame: "One annual forecast year",
    recomputed: "Annual chart in the Tajika stream",
    reads: "A Persian-derived annual system with its own mechanics.",
    tools: ["muntha", "sahams", "year-lord", "Tajika yogas"],
    warning: "Do not import Tajika tools into a Lal Kitab annual reading.",
  },
};

export const TOOL_GATES: ToolGate[] = [
  { label: "Fixed-Aries Teva", belongsTo: "lalKitabAnnual", note: "Shared Lal Kitab frame used by the annual chart." },
  { label: "Lal Kitab planet attributes", belongsTo: "lalKitabAnnual", note: "The annual chart is read through Lal Kitab graha portfolios." },
  { label: "Yearly upaya", belongsTo: "lalKitabAnnual", note: "The year is read to name a remedy, not just a theme." },
  { label: "Natal baseline", belongsTo: "natal", note: "The standing birth Teva is the life-level cross-check." },
  { label: "Muntha", belongsTo: "tajikaAnnual", note: "Tajika apparatus; not a Lal Kitab tool." },
  { label: "Sahams", belongsTo: "tajikaAnnual", note: "Derived annual points from the Tajika stream." },
  { label: "Year-lord", belongsTo: "tajikaAnnual", note: "Tajika varshesha logic, not Lal Kitab." },
];

export const FRAME_KEYS: FrameKey[] = ["natal", "lalKitabAnnual", "tajikaAnnual"];

export function getFrame(key: FrameKey) {
  return FRAMES[key];
}
