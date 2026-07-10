import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";

export type PlanStepKey = "diagnose" | "validate" | "layer" | "sequence";
export type LayerKey = "folk" | "classical" | "ratna";
export type PlanScenarioKey = "venus" | "saturnBad" | "saturnClean";
export type CheckKey = "coherent" | "contradiction" | "overprescribed" | "undisclosed";

export interface ArchitectureStep {
  key: PlanStepKey;
  label: string;
  source: string;
  action: string;
  rule: string;
  color: string;
}

export interface RemedyLayer {
  id: string;
  layer: LayerKey;
  label: string;
  tradition: string;
  purpose: string;
  sequence: number;
  color: string;
}

export interface PlanScenario {
  key: PlanScenarioKey;
  label: string;
  diagnosis: string;
  tevaCheck: string;
  direction: string;
  layerIds: string[];
  check: CheckKey;
  correction: string;
}

export interface CheckProfile {
  key: CheckKey;
  label: string;
  headline: string;
  detail: string;
  color: string;
}

export const ARCHITECTURE_STEPS: ArchitectureStep[] = [
  {
    key: "diagnose",
    label: "Diagnose",
    source: "Parashari anchor",
    action: "Identify the afflicted house, graha, and dasha context.",
    rule: "Diagnosis is single-stream; do not average methods.",
    color: grahas.guru.primary,
  },
  {
    key: "validate",
    label: "Cross-validate",
    source: "Lal Kitab Teva",
    action: "Check whether the fixed-Aries Teva confirms or qualifies the reading.",
    rule: "Teva validates; it does not override the diagnostic anchor.",
    color: "#356C96",
  },
  {
    key: "layer",
    label: "Layer remedies",
    source: "Classical plus folk",
    action: "Choose one simple Lal Kitab act and one classical remedy when both fit.",
    rule: "Layer alongside; never hide origins inside one blended ritual.",
    color: "#2F7D52",
  },
  {
    key: "sequence",
    label: "Sequence",
    source: "Simplest to deepest",
    action: "Start with the low-friction act, then introduce the deeper practice.",
    rule: "Sequence supports follow-through; it is not a guarantee.",
    color: ink.goldAccent,
  },
];

export const REMEDY_LAYERS: RemedyLayer[] = [
  {
    id: "venus-folk",
    layer: "folk",
    label: "Friday Lal Kitab folk act",
    tradition: "Lal Kitab empirical-folk",
    purpose: "Begin with a cheap, concrete Venus-supporting action.",
    sequence: 1,
    color: "#2F7D52",
  },
  {
    id: "venus-classical",
    layer: "classical",
    label: "Shukra mantra and Friday dana",
    tradition: "Classical shastra",
    purpose: "Deepen support through a scripturally grounded Venus remedy.",
    sequence: 2,
    color: grahas.guru.primary,
  },
  {
    id: "saturn-mantra",
    layer: "classical",
    label: "Shani mantra",
    tradition: "Classical shastra",
    purpose: "Strengthen Saturn in the diagnosed direction.",
    sequence: 2,
    color: grahas.shani.primary,
  },
  {
    id: "saturn-remove",
    layer: "folk",
    label: "Remove Saturn influence folk act",
    tradition: "Lal Kitab empirical-folk",
    purpose: "Pulls opposite to a strengthen-Saturn diagnosis.",
    sequence: 1,
    color: ink.vermilionAccent,
  },
  {
    id: "saturn-folk-strengthen",
    layer: "folk",
    label: "Saturn service or feeding act",
    tradition: "Lal Kitab empirical-folk",
    purpose: "A simple folk layer aligned with Saturn support.",
    sequence: 1,
    color: "#2F7D52",
  },
  {
    id: "sapphire",
    layer: "ratna",
    label: "Blue sapphire",
    tradition: "Classical ratna, safety-gated",
    purpose: "Allowed only if gemstone safety conditions are satisfied.",
    sequence: 3,
    color: "#356C96",
  },
  {
    id: "mercury-padding",
    layer: "folk",
    label: "Mercury folk act for good luck",
    tradition: "Off-diagnosis padding",
    purpose: "Not tied to the diagnosis; remove it.",
    sequence: 4,
    color: ink.vermilionAccent,
  },
  {
    id: "rahu-padding",
    layer: "classical",
    label: "Rahu dana just in case",
    tradition: "Off-diagnosis padding",
    purpose: "Adds noise and burden; remove it.",
    sequence: 5,
    color: ink.vermilionAccent,
  },
];

export const CHECKS: Record<CheckKey, CheckProfile> = {
  coherent: {
    key: "coherent",
    label: "Coherent plan",
    headline: "Short, sequenced, attributed, and aligned",
    detail: "Every layer serves the diagnostic direction and the client hears each tradition's source.",
    color: "#2F7D52",
  },
  contradiction: {
    key: "contradiction",
    label: "Contradiction",
    headline: "One layer strengthens while another removes",
    detail: "Return to the diagnostic direction and drop the layer that pulls against it.",
    color: ink.vermilionAccent,
  },
  overprescribed: {
    key: "overprescribed",
    label: "Over-prescribed",
    headline: "Too many layers dilute follow-through",
    detail: "Prescription restraint usually means one folk act and one classical remedy.",
    color: grahas.mangala.primary,
  },
  undisclosed: {
    key: "undisclosed",
    label: "Disclosure failure",
    headline: "Folk remedy relabelled as classical",
    detail: "Name each layer honestly: classical shastra versus empirical-folk Lal Kitab.",
    color: "#8F6C1F",
  },
};

export const PLAN_SCENARIOS: PlanScenario[] = [
  {
    key: "venus",
    label: "Venus / seventh house",
    diagnosis: "Parashari shows afflicted seventh house and weak combust Venus in Venus dasha.",
    tevaCheck: "Lal Kitab Teva also shows obstructed Venus significations.",
    direction: "Support and pacify Venus / seventh-house matters.",
    layerIds: ["venus-folk", "venus-classical"],
    check: "coherent",
    correction: "Keep the two-layer plan: simple Friday folk act first, classical Shukra remedy second, both disclosed.",
  },
  {
    key: "saturnBad",
    label: "Weak Saturn pile",
    diagnosis: "Parashari says Saturn should be strengthened.",
    tevaCheck: "Teva confirms Saturn pressure but does not change the direction.",
    direction: "Strengthen Saturn with restraint.",
    layerIds: ["saturn-mantra", "saturn-remove", "sapphire", "mercury-padding", "rahu-padding"],
    check: "contradiction",
    correction: "Drop the Saturn-removal folk act and all off-diagnosis padding; sapphire stays only if safety-gated.",
  },
  {
    key: "saturnClean",
    label: "Corrected Saturn pair",
    diagnosis: "Parashari anchors the need to strengthen Saturn.",
    tevaCheck: "Teva supports Saturn-focused remedy work.",
    direction: "Strengthen Saturn, not remove it.",
    layerIds: ["saturn-folk-strengthen", "saturn-mantra"],
    check: "coherent",
    correction: "A coherent pair: one simple Saturn folk act, then one classical Shani remedy.",
  },
];

export function getLayer(id: string) {
  return REMEDY_LAYERS.find((layer) => layer.id === id) ?? REMEDY_LAYERS[0];
}

export function getScenario(key: PlanScenarioKey) {
  return PLAN_SCENARIOS.find((scenario) => scenario.key === key) ?? PLAN_SCENARIOS[0];
}

export function getStep(key: PlanStepKey) {
  return ARCHITECTURE_STEPS.find((step) => step.key === key) ?? ARCHITECTURE_STEPS[0];
}
