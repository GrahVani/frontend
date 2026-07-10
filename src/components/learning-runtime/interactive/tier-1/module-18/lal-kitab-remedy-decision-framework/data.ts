import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";

export type SignalKey = "receptive" | "quick" | "classicalNotFeasible" | "scriptureDemand" | "deepWork" | "promiseRisk";
export type DecisionKey = "lalKitab" | "classical" | "mixed" | "withhold";

export interface DecisionSignal {
  key: SignalKey;
  label: string;
  direction: "toward" | "away";
  short: string;
  detail: string;
  color: string;
}

export interface ClientScenario {
  id: string;
  label: string;
  situation: string;
  activeSignals: SignalKey[];
  decision: DecisionKey;
  prescription: string;
  disclosure: string;
}

export interface DecisionProfile {
  key: DecisionKey;
  label: string;
  headline: string;
  detail: string;
  color: string;
}

export const DECISION_SIGNALS: DecisionSignal[] = [
  {
    key: "receptive",
    label: "Client receptive",
    direction: "toward",
    short: "Open to empirical-folk practice",
    detail: "Receptivity is meaningful only after disclosure of Lal Kitab's non-scriptural origin.",
    color: "#2F7D52",
  },
  {
    key: "quick",
    label: "Quick simple act wanted",
    direction: "toward",
    short: "Low-cost step today",
    detail: "Lal Kitab excels when the client wants a modest household-scale action.",
    color: grahas.budha.primary,
  },
  {
    key: "classicalNotFeasible",
    label: "Classical not feasible",
    direction: "toward",
    short: "Cost, time, complexity, or preference blocks it",
    detail: "Not feasible does not mean classical remedies were proven ineffective first.",
    color: ink.goldAccent,
  },
  {
    key: "scriptureDemand",
    label: "Scriptural sanction demanded",
    direction: "away",
    short: "Client wants shastric backing",
    detail: "Lal Kitab cannot honestly meet this condition; route to classical upayas.",
    color: ink.vermilionAccent,
  },
  {
    key: "deepWork",
    label: "Deep transformation needed",
    direction: "away",
    short: "Psychological or spiritual depth",
    detail: "A single folk act should not replace sustained classical or counselling work.",
    color: grahas.guru.primary,
  },
  {
    key: "promiseRisk",
    label: "Over-promising pressure",
    direction: "away",
    short: "Client or practitioner wants certainty",
    detail: "If the remedy is being framed as a guarantee, stop and reframe before prescribing.",
    color: grahas.mangala.primary,
  },
];

export const DECISIONS: Record<DecisionKey, DecisionProfile> = {
  lalKitab: {
    key: "lalKitab",
    label: "Offer Lal Kitab",
    headline: "Disclose, obtain consent, prescribe one simple totka",
    detail: "All use-when conditions point together and no avoid-when condition is active.",
    color: "#2F7D52",
  },
  classical: {
    key: "classical",
    label: "Use classical remedy",
    headline: "Route to mantra, yantra, dana, or deeper classical work",
    detail: "The client needs scriptural authority or a depth of work Lal Kitab should not claim.",
    color: grahas.guru.primary,
  },
  mixed: {
    key: "mixed",
    label: "Layer carefully",
    headline: "Classical for depth, disclosed totka for the quick step",
    detail: "A mixed case can use two tools only when each tool keeps its own job and disclosure is explicit.",
    color: "#356C96",
  },
  withhold: {
    key: "withhold",
    label: "Withhold / reframe",
    headline: "Do not prescribe while guarantee pressure remains",
    detail: "Over-promising turns a modest folk practice into an unethical claim.",
    color: ink.vermilionAccent,
  },
};

export const CLIENT_SCENARIOS: ClientScenario[] = [
  {
    id: "job",
    label: "Stalled job search",
    situation: "The client is curious about folk remedies, wants something small today, and cannot sustain a forty-day mantra discipline.",
    activeSignals: ["receptive", "quick", "classicalNotFeasible"],
    decision: "lalKitab",
    prescription: "Offer one simple Lal Kitab totka after disclosure and consent.",
    disclosure: "This is a practitioner-reported Lal Kitab folk remedy, not a scriptural or guaranteed result.",
  },
  {
    id: "scriptural",
    label: "Scripture-only client",
    situation: "The client says they will accept only a remedy with clear shastric sanction.",
    activeSignals: ["scriptureDemand"],
    decision: "classical",
    prescription: "Do not imply Lal Kitab is scriptural. Route to classical upayas.",
    disclosure: "Lal Kitab does not cite Veda, Purana, or Samhita; a classical remedy better fits your requirement.",
  },
  {
    id: "deep",
    label: "Deep issue plus quick step",
    situation: "The client is receptive and wants a quick act, but the matter is psychologically and spiritually deep.",
    activeSignals: ["receptive", "quick", "deepWork"],
    decision: "mixed",
    prescription: "Use classical work for the deep issue; optionally add one disclosed totka for the immediate step.",
    disclosure: "The simple act is supportive only. It does not replace the deeper remedy or counsel.",
  },
  {
    id: "guarantee",
    label: "Guarantee demand",
    situation: "The client asks whether the totka will definitely produce marriage or promotion by a fixed date.",
    activeSignals: ["receptive", "promiseRisk"],
    decision: "withhold",
    prescription: "Pause the prescription until the claim is reframed without certainty.",
    disclosure: "No Lal Kitab remedy should be offered as a guaranteed outcome.",
  },
];

export function getSignal(key: SignalKey) {
  return DECISION_SIGNALS.find((signal) => signal.key === key) ?? DECISION_SIGNALS[0];
}

export function getScenario(id: string) {
  return CLIENT_SCENARIOS.find((scenario) => scenario.id === id) ?? CLIENT_SCENARIOS[0];
}
