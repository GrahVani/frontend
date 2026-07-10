import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type DashaClassKey = "vimshottari" | "ashtottari" | "yogini";
export type ScenarioKey = "generalTiming" | "rahuCondition" | "rahuProminent" | "spiritualQuestion" | "quickCrossCheck";

export interface DashaClassRow {
  key: DashaClassKey;
  name: string;
  devanagari: string;
  cycle: string;
  condition: string;
  consultWhen: string;
  role: string;
  color: string;
  tint: string;
}

export interface ScenarioState {
  generalTiming: boolean;
  rahuCondition: boolean;
  rahuProminent: boolean;
  spiritualQuestion: boolean;
  quickCrossCheck: boolean;
}

export interface ScenarioToggle {
  key: ScenarioKey;
  label: string;
  description: string;
}

export const DEFAULT_SCENARIO: ScenarioState = {
  generalTiming: true,
  rahuCondition: false,
  rahuProminent: true,
  spiritualQuestion: false,
  quickCrossCheck: true,
};

export const EMPTY_SCENARIO: ScenarioState = {
  generalTiming: true,
  rahuCondition: false,
  rahuProminent: false,
  spiritualQuestion: false,
  quickCrossCheck: false,
};

export const DASHA_CLASS_ROWS: DashaClassRow[] = [
  {
    key: "vimshottari",
    name: "Vimshottari",
    devanagari: "विंशोत्तरी",
    cycle: "120 yr / 9 planets",
    condition: "None; applies to all charts",
    consultWhen: "Default for every timing question.",
    role: "Baseline",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    key: "ashtottari",
    name: "Ashtottari",
    devanagari: "अष्टोत्तरी",
    cycle: "108 yr / 8 planets",
    condition: "Rahu-related Lagna/Moon condition",
    consultWhen: "Add when the Rahu condition is met; use for Rahu-coloured cross-checks.",
    role: "Condition-gated supplement",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
  },
  {
    key: "yogini",
    name: "Yogini",
    devanagari: "योगिनी",
    cycle: "36 yr / 8 Yoginis",
    condition: "No special condition",
    consultWhen: "Add for subtle-energy, spiritual-practice, or quick sanity-check questions.",
    role: "Question-gated supplement",
    color: grahas.shukra.primary,
    tint: grahas.shukra.secondaryTint,
  },
];

export const SCENARIO_TOGGLES: ScenarioToggle[] = [
  {
    key: "generalTiming",
    label: "General timing question",
    description: "Keep the universal default active for the reading.",
  },
  {
    key: "rahuCondition",
    label: "Rahu condition met",
    description: "The BPHS-style Rahu/Lagna-Moon gate has been verified.",
  },
  {
    key: "rahuProminent",
    label: "Rahu is prominent",
    description: "Rahu is narratively loud, but this alone does not prove the gate.",
  },
  {
    key: "spiritualQuestion",
    label: "Spiritual or subtle-energy question",
    description: "The question asks about practice, inner rhythm, or subtle fluctuation.",
  },
  {
    key: "quickCrossCheck",
    label: "Need quick cross-check",
    description: "A second timing lens would help confirm or nuance the baseline.",
  },
];

export function recommendedDashaKeys(state: ScenarioState): DashaClassKey[] {
  const keys: DashaClassKey[] = ["vimshottari"];

  if (state.rahuCondition) keys.push("ashtottari");
  if (state.spiritualQuestion || state.quickCrossCheck) keys.push("yogini");

  return keys;
}

export function dashaByKey(key: DashaClassKey) {
  return DASHA_CLASS_ROWS.find((row) => row.key === key) ?? DASHA_CLASS_ROWS[0];
}

export function cautionForScenario(state: ScenarioState) {
  if (state.rahuProminent && !state.rahuCondition) {
    return "Rahu is prominent, but Ashtottari should not be promoted unless the Rahu condition is verified.";
  }

  if (!state.spiritualQuestion && state.quickCrossCheck) {
    return "Yogini can help as a fast sanity-check, but name it as a supplement rather than the main reading.";
  }

  return "Every added dasha should be named with its reason, condition, and role.";
}

export function honestyStatement(state: ScenarioState) {
  const names = recommendedDashaKeys(state).map((key) => dashaByKey(key).name);
  const supplements = names.filter((name) => name !== "Vimshottari");

  if (supplements.length === 0) {
    return "Vimshottari is the default timing system for this chart; no supplementary dasha was required.";
  }

  return `Vimshottari is the default. ${supplements.join(" and ")} ${supplements.length === 1 ? "is" : "are"} consulted as supplementary ${supplements.length === 1 ? "lens" : "lenses"} because ${state.rahuCondition ? "the Rahu condition is met" : ""}${state.rahuCondition && (state.spiritualQuestion || state.quickCrossCheck) ? " and " : ""}${state.spiritualQuestion ? "the question is spiritual/subtle-energy focused" : state.quickCrossCheck ? "a quick cross-check is useful" : ""}.`;
}
