export type StatementFieldKey = "scope" | "system" | "honesty" | "ethics" | "place";

export interface ChapterSynthesis {
  chapter: number;
  title: string;
  gives: string;
  practiceCue: string;
}

export interface StatementField {
  key: StatementFieldKey;
  label: string;
  prompt: string;
  sample: string;
}

export interface ConsultationTest {
  id: string;
  label: string;
  question: string;
  tests: StatementFieldKey[];
}

export const CHAPTER_SYNTHESIS: ChapterSynthesis[] = [
  { chapter: 1, title: "Systems", gives: "Chaldean, Pythagorean, and Vedic Anka-Jyotisha.", practiceCue: "Pick one system per consultation." },
  { chapter: 2, title: "Numbers", gives: "Number-planet registers, including strengths and shadows.", practiceCue: "Read multivalently, never as a curse." },
  { chapter: 3, title: "Personal vectors", gives: "Mulanka, Bhagyanka, Name-number, and personal year.", practiceCue: "Separate root, destiny, expression, and timing." },
  { chapter: 4, title: "Name correction", gives: "Rationale, computation, real costs, and preview-before-commit.", practiceCue: "Refuse numerology-only life fixes." },
  { chapter: 5, title: "Application contexts", gives: "Compatibility, business names, and object-number boundaries.", practiceCue: "Use context-specific refusal catalogues." },
  { chapter: 6, title: "Integration", gives: "Chart cross-reference plus apply, defer, refuse framework.", practiceCue: "Let the chart ground numerology." },
];

export const DO_NO_HARM = [
  "No single-factor causation.",
  "No fear-induction.",
  "Convergent grounds for big actions.",
  "Run the ethics screen before major recommendations.",
  "Contribution, not causation.",
];

export const STATEMENT_FIELDS: StatementField[] = [
  {
    key: "scope",
    label: "Scope",
    prompt: "Name the consultation modes you will use, and what is outside your scope.",
    sample: "I use numerology as a brief chart-contextual mention, or as a standalone numerology reading only when a chart is available.",
  },
  {
    key: "system",
    label: "System default",
    prompt: "Name your default system and your pick-one rule.",
    sample: "My default is Vedic Anka-Jyotisha; I name exceptions and do not mix systems inside one reading.",
  },
  {
    key: "honesty",
    label: "Honest attribution",
    prompt: "State how you explain numerology's power and its limits.",
    sample: "I present numerology as context and register-fit, never as destiny, guarantee, or a one-true-system claim.",
  },
  {
    key: "ethics",
    label: "Ethics screen",
    prompt: "State the screen you will run before recommendations.",
    sample: "I refuse guarantees, fear, financial harm, credential impersonation, and any major decision based on numbers alone.",
  },
  {
    key: "place",
    label: "Place in practice",
    prompt: "Place numerology among your other Jyotisha literacies.",
    sample: "Numerology is one literacy alongside the chart, not my whole practice and not the end of my training.",
  },
];

export const CONSULTATION_TESTS: ConsultationTest[] = [
  {
    id: "rename",
    label: "Child rename",
    question: "Would your statement stop you from recommending a child's rename for luck alone?",
    tests: ["scope", "honesty", "ethics"],
  },
  {
    id: "business",
    label: "Business launch",
    question: "Would it keep business-name numerology subordinate to market, legal, and chart factors?",
    tests: ["system", "honesty", "ethics"],
  },
  {
    id: "compatibility",
    label: "Compatibility fear",
    question: "Would it stop a single-number marriage rejection or guarantee?",
    tests: ["honesty", "ethics", "place"],
  },
];

export const DEFAULT_STATEMENT: Record<StatementFieldKey, string> = {
  scope: STATEMENT_FIELDS[0].sample,
  system: STATEMENT_FIELDS[1].sample,
  honesty: STATEMENT_FIELDS[2].sample,
  ethics: STATEMENT_FIELDS[3].sample,
  place: STATEMENT_FIELDS[4].sample,
};
