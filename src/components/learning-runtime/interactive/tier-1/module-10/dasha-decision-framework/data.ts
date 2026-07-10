import { grahas } from "@/design-tokens/grahvani-learning/colors";

export interface FrameworkState {
  rahuCondition: boolean;
  jaiminiRelevant: boolean;
  signHouseQuestion: boolean;
  conditionalMatches: number;
  convergence: "aligned" | "mixed" | "unknown";
}

export interface FrameworkStep {
  index: number;
  title: string;
  shortTitle: string;
  rule: string;
  output: string;
  color: string;
  tint: string;
}

export const DEFAULT_FRAMEWORK_STATE: FrameworkState = {
  rahuCondition: true,
  jaiminiRelevant: true,
  signHouseQuestion: false,
  conditionalMatches: 2,
  convergence: "mixed",
};

export const EMPTY_FRAMEWORK_STATE: FrameworkState = {
  rahuCondition: false,
  jaiminiRelevant: false,
  signHouseQuestion: false,
  conditionalMatches: 0,
  convergence: "unknown",
};

export const FRAMEWORK_STEPS: FrameworkStep[] = [
  {
    index: 1,
    title: "Always start with Vimshottari",
    shortTitle: "Baseline",
    rule: "Conditionless default for every chart.",
    output: "Vimshottari",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    index: 2,
    title: "Check the Rahu condition",
    shortTitle: "Rahu gate",
    rule: "If met, add Ashtottari.",
    output: "Ashtottari",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
  },
  {
    index: 3,
    title: "Check Jaimini relevance",
    shortTitle: "Jaimini",
    rule: "If trained or the question is sign/house focused, add Cara/Sthira.",
    output: "Cara / Sthira",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
  },
  {
    index: 4,
    title: "Check BPHS 51-58 conditionals",
    shortTitle: "Conditionals",
    rule: "Add any conditional dasha whose selection condition is met.",
    output: "0, 1, or 2+ conditionals",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
  },
  {
    index: 5,
    title: "Apply two-yes convergence",
    shortTitle: "Two-yes",
    rule: "Convergence increases confidence; divergence becomes nuance.",
    output: "Confidence / nuance",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
  },
];

export const OTHER_DECISION_FRAMEWORKS = [
  "Calendar selection",
  "Friendship-system selection",
  "Cusp-system selection",
  "Aspect-doctrine selection",
  "Dasha-system selection",
];

export function selectedSystems(state: FrameworkState) {
  const systems = ["Vimshottari"];

  if (state.rahuCondition) systems.push("Ashtottari");
  if (state.jaiminiRelevant || state.signHouseQuestion) systems.push("Cara/Sthira");
  if (state.conditionalMatches > 0) {
    systems.push(`${state.conditionalMatches} BPHS conditional${state.conditionalMatches === 1 ? "" : "s"}`);
  }

  return systems;
}

export function activeStepIndexes(state: FrameworkState) {
  return new Set([
    1,
    ...(state.rahuCondition ? [2] : []),
    ...(state.jaiminiRelevant || state.signHouseQuestion ? [3] : []),
    ...(state.conditionalMatches > 0 ? [4] : []),
    5,
  ]);
}

export function convergenceLabel(state: FrameworkState) {
  if (selectedSystems(state).length === 1) return "No supplement selected";
  if (state.convergence === "aligned") return "Convergence: high confidence";
  if (state.convergence === "mixed") return "Divergence: report nuance";
  return "Cross-validation pending";
}

export function frameworkStatement(state: FrameworkState) {
  const systems = selectedSystems(state);
  if (systems.length === 1) {
    return "Start and remain with Vimshottari. No condition, Jaimini relevance, or conditional gate has been marked.";
  }

  return `Start with Vimshottari, then add ${systems.slice(1).join(", ")}. Apply two-yes: ${convergenceLabel(state).toLowerCase()}.`;
}
