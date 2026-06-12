import { ink } from "@/design-tokens/grahvani-learning/colors";

export type SignalKey = "teva" | "totka" | "idiom" | "lineage" | "region" | "debt" | "classical";
export type ReportVerdict = "lalKitab" | "mixed" | "classical" | "insufficient";

export interface RecognitionSignal {
  key: SignalKey;
  label: string;
  strength: "strong" | "distinctive" | "context" | "counter";
  cue: string;
  meaning: string;
  color: string;
}

export interface PracticeReport {
  id: string;
  label: string;
  excerpt: string;
  signalKeys: SignalKey[];
  verdict: ReportVerdict;
  confidence: number;
  explanation: string;
}

export const SIGNALS: RecognitionSignal[] = [
  {
    key: "teva",
    label: "Teva chart",
    strength: "strong",
    cue: "fixed-Aries Teva",
    meaning: "The clearest single Lal Kitab chart-device signal.",
    color: "#2F7D52",
  },
  {
    key: "totka",
    label: "Object / feeding totka",
    strength: "distinctive",
    cue: "float, bury, feed, throw",
    meaning: "Cheap physical acts are the strongest behavioural signal.",
    color: ink.goldAccent,
  },
  {
    key: "idiom",
    label: "Kale dagh idiom",
    strength: "distinctive",
    cue: "black marks of the chart",
    meaning: "Colloquial Hindi/Punjabi register points to Lal Kitab, not Sanskrit shastra.",
    color: "#8F6C1F",
  },
  {
    key: "lineage",
    label: "Joshi / farman",
    strength: "strong",
    cue: "Roop Chand Joshi, farman",
    meaning: "A direct lineage reference names the Lal Kitab stream.",
    color: "#356C96",
  },
  {
    key: "region",
    label: "Punjab / Delhi context",
    strength: "context",
    cue: "North-Indian setting",
    meaning: "A corroborating cue only; never conclusive by itself.",
    color: "#6B5C8A",
  },
  {
    key: "debt",
    label: "Rina debt language",
    strength: "distinctive",
    cue: "planetary debt cleared by act",
    meaning: "Debt framed as something discharged by a totka is a Lal Kitab signature.",
    color: "#7A3E4A",
  },
  {
    key: "classical",
    label: "Classical remedy cue",
    strength: "counter",
    cue: "mantra, yantra, ratna",
    meaning: "Counted mantra, installed yantra, or strength-based gemstone points to a classical layer.",
    color: ink.vermilionAccent,
  },
];

export const REPORTS: PracticeReport[] = [
  {
    id: "textbook",
    label: "Forwarded Teva report",
    excerpt: "The report opens with a fixed-Aries Teva, marks kale dagh, cites Roop Chand Joshi, and asks the client to float a coconut to clear a planetary debt.",
    signalKeys: ["teva", "totka", "idiom", "lineage", "debt", "region"],
    verdict: "lalKitab",
    confidence: 96,
    explanation: "Several independent signals converge. This is a high-confidence Lal Kitab signature.",
  },
  {
    id: "mixed",
    label: "Mantra plus buried iron",
    excerpt: "The report gives a bija-mantra count and also asks the client to bury iron in the house corner to settle a rina. No Teva or lineage reference appears.",
    signalKeys: ["classical", "totka", "debt"],
    verdict: "mixed",
    confidence: 58,
    explanation: "The mantra is classical; the burial plus debt language is Lal Kitab-influenced. Call it mixed, not pure Lal Kitab.",
  },
  {
    id: "classical",
    label: "Gemstone and mantra plan",
    excerpt: "The prescription uses a strength-tested gemstone, a counted mantra, and a formal dana rule. It gives no Teva, totka, debt idiom, or Joshi reference.",
    signalKeys: ["classical"],
    verdict: "classical",
    confidence: 32,
    explanation: "The visible cues are classical remedy cues. There is no meaningful Lal Kitab convergence.",
  },
  {
    id: "weak",
    label: "Animal feeding only",
    excerpt: "A North-Indian relative recommends feeding birds on Saturday, but gives no Teva, no rina language, no farman, and no Lal Kitab vocabulary.",
    signalKeys: ["totka", "region"],
    verdict: "insufficient",
    confidence: 42,
    explanation: "Feeding plus region raises a hypothesis, but the signals are too thin for confident attribution.",
  },
];

export function getSignal(key: SignalKey) {
  return SIGNALS.find((signal) => signal.key === key) ?? SIGNALS[0];
}

export function getReport(id: string) {
  return REPORTS.find((report) => report.id === id) ?? REPORTS[0];
}

export function verdictLabel(verdict: ReportVerdict) {
  if (verdict === "lalKitab") return "Lal Kitab-derived";
  if (verdict === "mixed") return "Mixed / influenced";
  if (verdict === "classical") return "Classical";
  return "Insufficient convergence";
}

export function verdictColor(verdict: ReportVerdict) {
  if (verdict === "lalKitab") return "#2F7D52";
  if (verdict === "mixed") return "#356C96";
  if (verdict === "classical") return "#8F6C1F";
  return ink.vermilionAccent;
}
