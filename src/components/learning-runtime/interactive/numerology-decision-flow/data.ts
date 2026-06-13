export type ContextKey = "clientAsked" | "clientRaised" | "lifeStage" | "chartSurfaced" | "bookedNumerology";
export type RefuseKey = "ethicsFail" | "guarantee" | "financialDistress" | "unethicalPurpose" | "credential" | "singleFactor";
export type DeferKey = "depthAnalytics" | "uncoveredTradition" | "fullConsulting" | "beyondScope" | "clientExpert";
export type DecisionOutcome = "noApply" | "refuse" | "defer" | "mode1" | "mode2";

export interface DecisionState {
  contexts: ContextKey[];
  refuses: RefuseKey[];
  defers: DeferKey[];
  bookedWithChart: boolean;
}

export interface Scenario {
  id: string;
  label: string;
  situation: string;
  state: DecisionState;
}

export const APPLY_CONTEXTS: Record<ContextKey, { label: string; detail: string }> = {
  clientAsked: { label: "Client asks", detail: "The client explicitly requests a numerology view." },
  clientRaised: { label: "Client raises topic", detail: "A name, number, compatibility, business, or object-number topic appears." },
  lifeStage: { label: "Life-stage near", detail: "Birth, naming, marriage, launch, or move makes the topic naturally relevant." },
  chartSurfaced: { label: "Chart surfaces it", detail: "The chart reading itself points to a number/graha register worth briefly naming." },
  bookedNumerology: { label: "Booked numerology", detail: "The session itself is numerology, with chart grounding available." },
};

export const REFUSE_TRIGGERS: Record<RefuseKey, { label: string; detail: string }> = {
  ethicsFail: { label: "Ethics-screen failure", detail: "No honest empirical/symbolic kernel, or the request forces an over-claim." },
  guarantee: { label: "Guarantee demand", detail: "The client wants certainty about marriage, business, future, luck, or safety." },
  financialDistress: { label: "Financial distress", detail: "The numerology action would worsen a vulnerable client's material position." },
  unethicalPurpose: { label: "Unethical purpose", detail: "The request supports manipulation, exclusion, coercion, or harm." },
  credential: { label: "Credential impersonation", detail: "The reader would need to pretend to hold expertise they do not hold." },
  singleFactor: { label: "Single-factor major decision", detail: "A major decision rests on numerology alone without convergent grounds." },
};

export const DEFER_TRIGGERS: Record<DeferKey, { label: string; detail: string }> = {
  depthAnalytics: { label: "Depth analytics", detail: "The client asks for specialist-level numerology beyond Tier-1 literacy." },
  uncoveredTradition: { label: "Uncovered tradition", detail: "The request belongs to gematria, kabbalah, Chinese numerology, or another uncovered system." },
  fullConsulting: { label: "Full consulting", detail: "The engagement is a full numerology practice rather than chart-integrated literacy." },
  beyondScope: { label: "Beyond honest scope", detail: "The reader cannot answer without inventing confidence." },
  clientExpert: { label: "Client exceeds you", detail: "The client's numerology literacy is ahead of the reader's training." },
};

export const SCENARIOS: Scenario[] = [
  {
    id: "monday",
    label: "Monday: uninvited detour",
    situation: "Chart reading only. The client never asks about numerology, but the practitioner wants to add it.",
    state: { contexts: [], refuses: [], defers: [], bookedWithChart: false },
  },
  {
    id: "wednesday",
    label: "Wednesday: over-refusal risk",
    situation: "Client asks for compatibility numerology. A chart can be cast first, and no guarantee is requested.",
    state: { contexts: ["clientAsked"], refuses: [], defers: [], bookedWithChart: true },
  },
  {
    id: "friday",
    label: "Friday: naming decision",
    situation: "Client raises a child's proposed name change. Costs are discussed and the chart is available.",
    state: { contexts: ["clientRaised", "lifeStage"], refuses: [], defers: [], bookedWithChart: false },
  },
  {
    id: "guarantee",
    label: "Guarantee demand",
    situation: "Client asks for a business name that will guarantee profit and wants to spend heavily today.",
    state: { contexts: ["clientRaised"], refuses: ["guarantee", "financialDistress", "singleFactor"], defers: [], bookedWithChart: false },
  },
  {
    id: "specialist",
    label: "Specialist tradition",
    situation: "Client requests a full gematria and kabbalistic numerology engagement.",
    state: { contexts: ["clientAsked"], refuses: [], defers: ["uncoveredTradition", "fullConsulting"], bookedWithChart: false },
  },
];

export function evaluateDecision(state: DecisionState): DecisionOutcome {
  if (state.contexts.length === 0) return "noApply";
  if (state.refuses.length > 0) return "refuse";
  if (state.defers.length > 0) return "defer";
  if (state.bookedWithChart || state.contexts.includes("bookedNumerology")) return "mode2";
  return "mode1";
}

export function outcomeCopy(outcome: DecisionOutcome) {
  if (outcome === "noApply") {
    return {
      label: "Do not introduce",
      tone: "neutral" as const,
      headline: "Absent-grounds rule blocks the detour.",
      text: "Stay in the primary chart-reading mode unless the client or the chart raises numerology.",
    };
  }
  if (outcome === "refuse") {
    return {
      label: "Refuse",
      tone: "danger" as const,
      headline: "A refusal trigger is active.",
      text: "Decline the numerology framing and offer a multifactor, non-fearful alternative or referral.",
    };
  }
  if (outcome === "defer") {
    return {
      label: "Defer",
      tone: "defer" as const,
      headline: "The request exceeds Tier-1 scope.",
      text: "Name your boundary honestly and refer to a credentialed specialist when appropriate.",
    };
  }
  if (outcome === "mode2") {
    return {
      label: "Mode 2",
      tone: "support" as const,
      headline: "Standalone numerology with chart grounding.",
      text: "Proceed only with chart context available and the module's refusal rules active.",
    };
  }
  return {
    label: "Mode 1",
    tone: "support" as const,
    headline: "Chart-contextual mention.",
    text: "Keep the chart primary; use numerology briefly as a subordinate cross-reference.",
  };
}
