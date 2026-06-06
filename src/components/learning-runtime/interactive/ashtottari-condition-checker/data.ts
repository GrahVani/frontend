import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type CriterionKey = "lagnaRahu" | "moonRahu" | "rahuStrong" | "vimshottariIncomplete" | "eventCrossCheck";

export interface CriterionToggle {
  key: CriterionKey;
  label: string;
  shortLabel: string;
  description: string;
  weight: number;
  isGate: boolean;
}

export interface DecisionState {
  lagnaRahu: boolean;
  moonRahu: boolean;
  rahuStrong: boolean;
  vimshottariIncomplete: boolean;
  eventCrossCheck: boolean;
}

export const CRITERIA: CriterionToggle[] = [
  {
    key: "lagnaRahu",
    label: "Lagna relates to Rahu",
    shortLabel: "Lagna-Rahu",
    description: "A BPHS-49 gate: the ascendant configuration is read through Rahu.",
    weight: 36,
    isGate: true,
  },
  {
    key: "moonRahu",
    label: "Moon relates to Rahu",
    shortLabel: "Moon-Rahu",
    description: "A BPHS-49 gate: Janma-candra is tied into Rahu's field.",
    weight: 36,
    isGate: true,
  },
  {
    key: "rahuStrong",
    label: "Rahu is prominent",
    shortLabel: "Strong Rahu",
    description: "A practical cue: Rahu is angular, heavily connected, or narratively loud.",
    weight: 12,
    isGate: false,
  },
  {
    key: "vimshottariIncomplete",
    label: "Vimshottari feels incomplete",
    shortLabel: "Second lens",
    description: "A practical cue: the default dasha is valid, but another timing lens may nuance it.",
    weight: 8,
    isGate: false,
  },
  {
    key: "eventCrossCheck",
    label: "Rahu event timing needs cross-check",
    shortLabel: "Event check",
    description: "A practical cue: major Rahu-coloured events deserve a second timing pass.",
    weight: 8,
    isGate: false,
  },
];

export const DEFAULT_DECISION_STATE: DecisionState = {
  lagnaRahu: true,
  moonRahu: false,
  rahuStrong: true,
  vimshottariIncomplete: false,
  eventCrossCheck: true,
};

export const EMPTY_DECISION_STATE: DecisionState = {
  lagnaRahu: false,
  moonRahu: false,
  rahuStrong: false,
  vimshottariIncomplete: false,
  eventCrossCheck: false,
};

export const ASHTOTTARI_DECISION_COLORS = {
  rahu: grahas.rahu.primary,
  rahuTint: grahas.rahu.secondaryTint,
  vimshottari: grahas.candra.primary,
  vimshottariTint: grahas.candra.secondaryTint,
  caution: grahas.mangala.primary,
  support: grahas.budha.primary,
};

export function hasGateCondition(state: DecisionState) {
  return state.lagnaRahu || state.moonRahu;
}

export function supportCount(state: DecisionState) {
  return Number(state.rahuStrong) + Number(state.vimshottariIncomplete) + Number(state.eventCrossCheck);
}

export function decisionScore(state: DecisionState) {
  return CRITERIA.reduce((sum, criterion) => sum + (state[criterion.key] ? criterion.weight : 0), 0);
}

export function decisionBand(state: DecisionState) {
  if (hasGateCondition(state)) {
    return supportCount(state) > 0 ? "candidate-supported" : "candidate";
  }

  return supportCount(state) > 0 ? "study-only" : "default-only";
}

export function recommendationLabel(state: DecisionState) {
  const band = decisionBand(state);

  if (band === "candidate-supported") return "Run Ashtottari alongside Vimshottari";
  if (band === "candidate") return "Ashtottari candidate";
  if (band === "study-only") return "Rahu cues present, verify the classical gate";
  return "Stay with Vimshottari only";
}

export function recommendationDetail(state: DecisionState) {
  const band = decisionBand(state);

  if (band === "candidate-supported") {
    return "The Rahu-related Lagna/Moon gate is present, and practical Rahu cues make the supplementary dasha worth comparing.";
  }

  if (band === "candidate") {
    return "The classical gate is present. Consult Ashtottari, but keep Vimshottari as the baseline timing system.";
  }

  if (band === "study-only") {
    return "Rahu is loud, but the BPHS applicability gate has not been confirmed. Do not promote Ashtottari beyond a cautious study note.";
  }

  return "No Rahu-related gate or practical Rahu cue is active. The default Vimshottari workflow is sufficient.";
}
