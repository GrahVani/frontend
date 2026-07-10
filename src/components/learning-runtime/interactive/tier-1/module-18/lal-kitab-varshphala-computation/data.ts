import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type WorkflowStepKey = "solarReturn" | "castTeva" | "applyStates" | "readYear";
export type ToolKey = "lalKitab" | "tajika" | "other";

export interface WorkflowStep {
  key: WorkflowStepKey;
  label: string;
  shortLabel: string;
  output: string;
  detail: string;
  color: string;
}

export interface AnnualPlanet {
  id: string;
  label: string;
  iast: string;
  house: number;
  state: "active" | "sleeping" | "dysfunctional";
  theme: string;
  color: string;
}

export interface ToolGate {
  label: string;
  group: ToolKey;
  verdict: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: "solarReturn",
    label: "Compute Solar Return",
    shortLabel: "Sun return",
    output: "Annual anchor moment",
    detail: "Find the moment the Sun reaches its exact natal longitude. This keys the birth-year cycle.",
    color: grahas.surya.primary,
  },
  {
    key: "castTeva",
    label: "Cast Fixed-Aries Teva",
    shortLabel: "Teva",
    output: "Annual planets in fixed houses",
    detail: "Place return-moment planets into the Lal Kitab frame: Aries remains house 1 regardless of rising sign.",
    color: "#7A5E24",
  },
  {
    key: "applyStates",
    label: "Apply Attributes + States",
    shortLabel: "States",
    output: "Active and troubled annual planets",
    detail: "Read each planet through Lal Kitab signification clusters and the state-doctrine.",
    color: grahas.rahu.primary,
  },
  {
    key: "readYear",
    label: "Read Year Tendencies",
    shortLabel: "Year reading",
    output: "Themes and upaya candidates",
    detail: "Active planets foreground themes; dysfunctional planets show where the year needs remedial care.",
    color: grahas.budha.primary,
  },
];

export const SAMPLE_PLANETS: AnnualPlanet[] = [
  { id: "mars", label: "Mars", iast: "Maṅgala", house: 1, state: "active", theme: "self-assertion, courage, initiative", color: grahas.mangala.primary },
  { id: "saturn", label: "Saturn", iast: "Śani", house: 7, state: "dysfunctional", theme: "partnership strain, contracts, duty", color: grahas.shani.primary },
  { id: "mercury", label: "Mercury", iast: "Budha", house: 3, state: "sleeping", theme: "communication must be awakened by conduct", color: grahas.budha.primary },
  { id: "moon", label: "Moon", iast: "Candra", house: 4, state: "active", theme: "home, mother, emotional steadiness", color: "#356CAB" },
];

export const TOOL_GATES: ToolGate[] = [
  { label: "Solar return anchor", group: "lalKitab", verdict: "Correct first step for Lal Kitab annual casting." },
  { label: "Fixed-Aries Teva", group: "lalKitab", verdict: "Correct chart frame: Aries stays in house 1." },
  { label: "Planet attributes", group: "lalKitab", verdict: "Correct interpretive layer for the annual chart." },
  { label: "State-doctrine", group: "lalKitab", verdict: "Correct Lal Kitab condition layer." },
  { label: "Muntha", group: "tajika", verdict: "Tajika only; do not import into Lal Kitab varshphala." },
  { label: "Sahams", group: "tajika", verdict: "Tajika sensitive points; not part of this workflow." },
  { label: "Ithasala", group: "tajika", verdict: "Tajika yoga logic; not a Lal Kitab annual step." },
  { label: "Fresh lagna chart", group: "other", verdict: "Wrong frame here: Lal Kitab uses fixed-Aries Teva, not a new Ascendant chart." },
  { label: "Moon return", group: "other", verdict: "Wrong anchor for an annual chart; this would key a lunar cycle." },
];

export function getStep(key: WorkflowStepKey) {
  return WORKFLOW_STEPS.find((step) => step.key === key) ?? WORKFLOW_STEPS[0];
}
