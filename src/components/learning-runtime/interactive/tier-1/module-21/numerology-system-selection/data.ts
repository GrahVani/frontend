import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";

export type SystemId = "chaldean" | "pythagorean" | "vedic";
export type CriterionId =
  | "indianCommercial"
  | "westernLiteracy"
  | "chartIntegration"
  | "romanName"
  | "devanagariName"
  | "compoundDepth"
  | "mathClarity"
  | "sanskritAuthority"
  | "standalone";

export interface NumerologySystem {
  id: SystemId;
  label: string;
  iast: string;
  devanagari: string;
  shortFit: string;
  basis: string;
  range: string;
  depthLayer: string;
  clientPhrase: string;
  color: string;
  weights: Partial<Record<CriterionId, number>>;
}

export interface Criterion {
  id: CriterionId;
  label: string;
  prompt: string;
  group: "client" | "format" | "purpose";
}

export interface ClientScenario {
  id: string;
  label: string;
  brief: string;
  selectedCriteria: CriterionId[];
  lessonFit: SystemId;
}

export const SYSTEMS: NumerologySystem[] = [
  {
    id: "chaldean",
    label: "Chaldean",
    iast: "Cheiro-Chaldean",
    devanagari: "चाल्डियन",
    shortFit: "Indian commercial numerology, Roman names, compound-number depth.",
    basis: "Irregular 1-8 letter table; 9 reserved as result.",
    range: "1-8 letters, 9 result-only",
    depthLayer: "Cheiro-style compound numbers 10-52.",
    clientPhrase: "Use Chaldean when the client already speaks Cheiro-style name-number language.",
    color: ink.goldAccent,
    weights: {
      indianCommercial: 4,
      romanName: 3,
      compoundDepth: 4,
      standalone: 2,
      sanskritAuthority: 1,
    },
  },
  {
    id: "pythagorean",
    label: "Pythagorean",
    iast: "Pythagorean",
    devanagari: "पाइथागोरियन",
    shortFit: "Western clients, sequential math clarity, Life-Path style teaching.",
    basis: "Alphabet position wraps by modulo 9.",
    range: "1-9 all assigned",
    depthLayer: "Life Path, Expression, Soul Urge, Personality.",
    clientPhrase: "Use Pythagorean when the client is already in the Western Life-Path frame.",
    color: "#356C96",
    weights: {
      westernLiteracy: 4,
      mathClarity: 4,
      standalone: 2,
      romanName: 2,
    },
  },
  {
    id: "vedic",
    label: "Vedic Anka-Jyotisha",
    iast: "Anka-Jyotisha",
    devanagari: "अङ्क-ज्योतिष",
    shortFit: "Parashari chart integration, Sanskrit context, three-vector graha reading.",
    basis: "Graha-anka register; pure use prefers Sanskrit or Devanagari name logic.",
    range: "1-9 graha mapped",
    depthLayer: "Mulanka, Bhagyanka, Namanka with graha cross-reference.",
    clientPhrase: "Use Vedic when numerology must speak cleanly with the natal chart.",
    color: grahas.budha.primary,
    weights: {
      chartIntegration: 5,
      devanagariName: 4,
      sanskritAuthority: 3,
      indianCommercial: 1,
    },
  },
];

export const CRITERIA: Criterion[] = [
  { id: "indianCommercial", label: "Indian Chaldean literacy", prompt: "Client already knows Cheiro or Indian commercial numerology language.", group: "client" },
  { id: "westernLiteracy", label: "Western Life-Path literacy", prompt: "Client comes from Decoz, Millman, Javane, or Western Life-Path framing.", group: "client" },
  { id: "chartIntegration", label: "Parashari chart integration", prompt: "The numerology reading must integrate with a natal chart consultation.", group: "purpose" },
  { id: "romanName", label: "Romanised English name", prompt: "The working name is documented in Roman letters.", group: "format" },
  { id: "devanagariName", label: "Devanagari or Sanskrit name", prompt: "The name is available in Devanagari or carries Sanskrit ritual context.", group: "format" },
  { id: "compoundDepth", label: "Compound-number depth", prompt: "Client asks about 18, 26, 32, 46, or other compound meanings.", group: "purpose" },
  { id: "mathClarity", label: "Clean mathematical table", prompt: "Client values an easily derived, teachable formula.", group: "purpose" },
  { id: "sanskritAuthority", label: "Sanskrit authority valued", prompt: "Client wants classical Sanskrit vocabulary and graha anchoring.", group: "client" },
  { id: "standalone", label: "Standalone numerology", prompt: "No chart reading is being performed in this consultation.", group: "purpose" },
];

export const SCENARIOS: ClientScenario[] = [
  {
    id: "mumbai-chart",
    label: "Mumbai chart client",
    brief: "Sanskrit name, Devanagari available, full Parashari chart overlay requested.",
    selectedCriteria: ["chartIntegration", "devanagariName", "sanskritAuthority", "indianCommercial"],
    lessonFit: "vedic",
  },
  {
    id: "london-life-path",
    label: "London Life-Path client",
    brief: "Western client, Life-Path vocabulary already familiar, no Indian chart context.",
    selectedCriteria: ["westernLiteracy", "mathClarity", "romanName", "standalone"],
    lessonFit: "pythagorean",
  },
  {
    id: "bengaluru-cheiro",
    label: "Bengaluru Cheiro second opinion",
    brief: "Romanised name, existing Indian Chaldean reading, wants compound-number review.",
    selectedCriteria: ["indianCommercial", "romanName", "compoundDepth", "standalone"],
    lessonFit: "chaldean",
  },
  {
    id: "mixed-request",
    label: "Mixed-system request",
    brief: "Client asks to merge Chaldean, Pythagorean, and Vedic numbers into one verdict.",
    selectedCriteria: ["romanName", "compoundDepth", "mathClarity", "sanskritAuthority"],
    lessonFit: "chaldean",
  },
];

export function scoreSystems(criteria: CriterionId[]) {
  return SYSTEMS.map((system) => ({
    ...system,
    score: criteria.reduce((sum, criterion) => sum + (system.weights[criterion] ?? 0), 0),
  })).sort((a, b) => b.score - a.score);
}

export function getSystem(id: SystemId) {
  return SYSTEMS.find((system) => system.id === id) ?? SYSTEMS[0];
}
