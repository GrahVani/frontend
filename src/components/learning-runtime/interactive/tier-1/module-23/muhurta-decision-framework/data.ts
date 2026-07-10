export type StakesKey = "high" | "medium" | "routine" | "trivial";
export type MethodKey = "fullIntegrated" | "reducedPrecision" | "chowghadiya" | "decline";
export type ScenarioKey =
  | "wedding"
  | "businessTravel"
  | "documentSigning"
  | "groceryTrip"
  | "dailyMuhurta"
  | "cumulativeSynthesis";
export type MistakeKey =
  | "overApply"
  | "underApply"
  | "paranoiaFeeding";

export interface StakesLevel {
  key: StakesKey;
  label: string;
  shortLabel: string;
  color: string;
  method: MethodKey;
  eventTypes: string[];
  discipline: string;
  timeEstimate: string;
  feeNote: string;
}

export interface Method {
  key: MethodKey;
  label: string;
  description: string;
  tools: string[];
}

export interface ClientScenario {
  key: ScenarioKey;
  label: string;
  request: string;
  stakes: StakesKey;
  method: MethodKey;
  rationale: string;
  practitionerResponse: string[];
  verdict: string;
}

export interface CommonMistake {
  key: MistakeKey;
  label: string;
  warning: string;
  remedy: string;
}

export interface DecisionTreeNode {
  id: string;
  question: string;
  yesTarget: string;
  noTarget: string;
  yesLabel: string;
  noLabel: string;
  outcome?: {
    stakes: StakesKey;
    title: string;
    note: string;
  };
}

export const STAKES_LEVELS: StakesLevel[] = [
  {
    key: "high",
    label: "High-stakes",
    shortLabel: "High",
    color: "#A23A1E",
    method: "fullIntegrated",
    eventTypes: [
      "Wedding-muhūrta",
      "Gṛha-praveśa apūrva (first-occupation)",
      "Major business-launch",
      "Substantial surgical-procedure",
      "Substantial contract-signing",
    ],
    discipline: "Full integrated method per M23 Chapters 1–5 + pāda-precision + multi-actor synergy + M24-ethics-integration.",
    timeEstimate: "2–3 hour consultation",
    feeNote: "Standard fee per nirlobha",
  },
  {
    key: "medium",
    label: "Medium-stakes",
    shortLabel: "Medium",
    color: "#B9801E",
    method: "reducedPrecision",
    eventTypes: [
      "Routine travel (yātrā-muhūrta)",
      "New-job-start",
      "Routine contract-signing",
      "Gṛha-praveśa sa-pūrva (re-occupation)",
      "Small business-launch",
      "Education-initiation",
    ],
    discipline: "Integrated method with reduced-precision: pañcāṅga + lagna-śuddhi + daily-window check; pāda-precision optional unless warranted.",
    timeEstimate: "45–60 minute consultation",
    feeNote: "Standard fee per nirlobha",
  },
  {
    key: "routine",
    label: "Routine-stakes",
    shortLabel: "Routine",
    color: "#2F6F9F",
    method: "chowghadiya",
    eventTypes: [
      "Routine business-calls",
      "Grocery-shopping",
      "Routine document-signing",
      "Routine appointments",
    ],
    discipline: "Chowghadiya practical-heuristic only. Client uses phone-app or pañcāṅga independently per empowerment-principle.",
    timeEstimate: "5-minute orientation",
    feeNote: "No substantial fee",
  },
  {
    key: "trivial",
    label: "Trivial / client-paranoia",
    shortLabel: "Trivial",
    color: "#5A5C68",
    method: "decline",
    eventTypes: [
      "What-to-wear",
      "What-to-eat",
      "When-to-make-routine-call",
      "Other trivial daily decisions",
    ],
    discipline: "DECLINE engagement per client-paranoia-feeding-avoidance. Articulate client decision-capacity; refer to Chowghadiya phone-app if warranted.",
    timeEstimate: "Decline consultation",
    feeNote: "No fee",
  },
];

export const METHODS: Method[] = [
  {
    key: "fullIntegrated",
    label: "Full integrated method",
    description: "M23 Chapters 1–5 operationalised end-to-end with pāda-precision.",
    tools: [
      "Pañcāṅga 5-limb evaluation",
      "Chart-correspondence 4 pillars",
      "Event-specific house-bala",
      "Cancellation-doṣa check",
      "Sub-day filter convergence",
      "Pāda-precision",
      "Multi-actor synergy",
    ],
  },
  {
    key: "reducedPrecision",
    label: "Integrated method — reduced precision",
    description: "Core integrated checks without exhaustive pāda-precision unless context warrants.",
    tools: [
      "Pañcāṅga 5-limb evaluation",
      "Lagna-śuddhi 3-criterion",
      "Daily-window check",
      "Chowghadiya cross-reference",
      "Pāda-precision optional",
    ],
  },
  {
    key: "chowghadiya",
    label: "Chowghadiya practical-heuristic only",
    description: "Quick daily-quality filter for routine decisions; no practitioner-led integrated method.",
    tools: [
      "Phone-app or pañcāṅga publication",
      "Prefer Amṛta / Śubha / Lābha / Cala",
      "Avoid Roga / Udvega / Kāla",
      "Avoid Rāhu-Kāla + Yamagaṇḍa + Gulika-Kāla",
    ],
  },
  {
    key: "decline",
    label: "Decline engagement",
    description: "Protect client decision-capacity and practitioner scope by refusing trivial muhūrta-consultations.",
    tools: [
      "Empowerment-principle (Lesson 24.3.1)",
      "Life-coach-failure-mode avoidance (Lesson 24.3.4)",
      "Nirlobha fee-discipline (Lesson 24.3.2)",
      "Adhikāra competence-boundary (Lesson 24.2.4)",
    ],
  },
];

export const CLIENT_SCENARIOS: ClientScenario[] = [
  {
    key: "wedding",
    label: "Request A: Daughter's wedding",
    request: "Wedding-muhūrta for client's daughter next year.",
    stakes: "high",
    method: "fullIntegrated",
    rationale: "High-stakes life event requiring full cumulative method, pāda-precision, and wedding-specific applications.",
    practitionerResponse: [
      "Classify as HIGH-STAKES.",
      "Apply full integrated method per M23 Chapters 1–5.",
      "Include pāda-precision, multi-actor synergy, and wedding-specific cancellation-doṣas.",
      "Schedule 2–3 hour consultation at standard fee per nirlobha.",
    ],
    verdict: "Full integrated method + pāda-precision + M24-ethics integration.",
  },
  {
    key: "businessTravel",
    label: "Request B: 5-day business trip",
    request: "Travel-muhūrta for routine 5-day business trip next month.",
    stakes: "medium",
    method: "reducedPrecision",
    rationale: "Medium-stakes travel: normal business scope, not substantial pilgrimage.",
    practitionerResponse: [
      "Classify as MEDIUM-STAKES.",
      "Apply integrated method with reduced-precision per Lesson 23.4.4.",
      "Include direction-day pairing + Disha-Śūla check.",
      "Schedule 45–60 minute consultation at standard fee per nirlobha.",
    ],
    verdict: "Integrated method reduced-precision; pāda-precision optional.",
  },
  {
    key: "documentSigning",
    label: "Request C: Routine document signing",
    request: "Document-signing for routine office-paperwork next Wednesday morning.",
    stakes: "routine",
    method: "chowghadiya",
    rationale: "Routine administrative decision; practitioner-led integrated method is cost-prohibitive.",
    practitionerResponse: [
      "Classify as ROUTINE-STAKES.",
      "Decline substantial consultation.",
      "Instruct client to use Chowghadiya phone-app: Wednesday sunrise starts Lābha; prefer Lābha for commerce-documents.",
      "5-minute orientation; no substantial fee per nirlobha + empowerment-principle.",
    ],
    verdict: "Chowghadiya practical-heuristic only; client uses phone-app independently.",
  },
  {
    key: "groceryTrip",
    label: "Request D: Grocery-shopping timing",
    request: "What time should I make a routine grocery-shopping trip tomorrow?",
    stakes: "trivial",
    method: "decline",
    rationale: "Trivial daily decision; engaging would feed client paranoia and erode decision-capacity.",
    practitionerResponse: [
      "Classify as TRIVIAL / client-paranoia.",
      "DECLINE consultation per client-paranoia-feeding-avoidance discipline.",
      "Articulate client decision-capacity per empowerment-principle.",
      "Refer to Chowghadiya phone-app: prefer Amṛta/Śubha/Lābha; avoid Roga/Udvega/Kāla.",
    ],
    verdict: "Decline engagement; preserve client decision-capacity and practitioner scope.",
  },
  {
    key: "dailyMuhurta",
    label: "Daily trivial muhūrta requests",
    request: "Client wants daily muhūrta-consultation for what-time-to-wake, when-to-eat, what-to-wear, routine calls.",
    stakes: "trivial",
    method: "decline",
    rationale: "Daily trivial decisions trigger four failure-modes: dependency, life-coach drift, nirlobha violation, competence-boundary violation.",
    practitionerResponse: [
      "Explain client-paranoia-feeding-avoidance discipline.",
      "Name the four failure-modes: cultivated-dependency, life-coach drift, structural-greed, competence-boundary violation.",
      "Offer Chowghadiya phone-app guidance for routine decisions.",
      "Reserve substantial consultation for substantial events only.",
    ],
    verdict: "Decline daily trivial engagement; uphold empowerment + samatvam + nirlobha + adhikāra.",
  },
  {
    key: "cumulativeSynthesis",
    label: "Cumulative framework synthesis",
    request: "How do the stakes-calibration rules fit into the whole M23 + M24 framework?",
    stakes: "high",
    method: "fullIntegrated",
    rationale: "Synthesis observation: stakes-calibration integrates cumulative M23 method + M24 ethics comprehensively.",
    practitionerResponse: [
      "M23 Chapters 1–3 → high-stakes integrated four-pillar capstone.",
      "M23 Chapter 4 → high-stakes event-type-specific applications.",
      "M23 Chapter 5 Lessons 1–2 → medium + high-stakes daily-window / cancellation checks.",
      "M23 Chapter 5 Lesson 3 → routine-stakes Chowghadiya practical-heuristic.",
      "M23 Chapter 6 Lesson 1 → honest-articulation across all stakes-levels.",
      "This lesson → calibrates which method per stakes-classification.",
      "M24 ethics → grounds the whole framework in adhikāra, empowerment, nirlobha, and samatvam.",
    ],
    verdict: "Comprehensive muhūrta-practitioner-discipline framework operationalised.",
  },
];

export const DECISION_TREE: DecisionTreeNode[] = [
  {
    id: "start",
    question: "Is the event substantial (wedding, griha-praveśa apūrva, major business-launch, substantial surgery, substantial contract)?",
    yesLabel: "Yes",
    noLabel: "No",
    yesTarget: "high-outcome",
    noTarget: "medium-check",
  },
  {
    id: "medium-check",
    question: "Is the event routine but meaningful (travel, new-job, routine contract, sa-pūrva griha, small business, education)?",
    yesLabel: "Yes",
    noLabel: "No",
    yesTarget: "medium-outcome",
    noTarget: "routine-check",
  },
  {
    id: "routine-check",
    question: "Is the event a routine daily decision (business-call, shopping, routine document, appointment)?",
    yesLabel: "Yes",
    noLabel: "No",
    yesTarget: "routine-outcome",
    noTarget: "trivial-outcome",
  },
  {
    id: "high-outcome",
    question: "",
    yesLabel: "",
    noLabel: "",
    outcome: { stakes: "high", title: "HIGH-STAKES", note: "Full integrated method per M23 Chapters 1–5 + pāda-precision." },
    yesTarget: "",
    noTarget: "",
  },
  {
    id: "medium-outcome",
    question: "",
    yesLabel: "",
    noLabel: "",
    outcome: { stakes: "medium", title: "MEDIUM-STAKES", note: "Integrated method reduced-precision; pāda-precision optional." },
    yesTarget: "",
    noTarget: "",
  },
  {
    id: "routine-outcome",
    question: "",
    yesLabel: "",
    noLabel: "",
    outcome: { stakes: "routine", title: "ROUTINE-STAKES", note: "Chowghadiya practical-heuristic only; client uses phone-app." },
    yesTarget: "",
    noTarget: "",
  },
  {
    id: "trivial-outcome",
    question: "",
    yesLabel: "",
    noLabel: "",
    outcome: { stakes: "trivial", title: "TRIVIAL / CLIENT-PARANOIA", note: "Decline engagement per client-paranoia-feeding-avoidance." },
    yesTarget: "",
    noTarget: "",
  },
];

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    key: "overApply",
    label: "Over-applying integrated method to routine events",
    warning: "Practitioner applies full pāda-precision + cancellation-discipline + multi-pillar evaluation to business-calls or grocery-shopping.",
    remedy: "Apply §4.5 routine-stakes classification. Chowghadiya practical-heuristic only; client uses phone-app independently.",
  },
  {
    key: "underApply",
    label: "Under-applying method to high-stakes events",
    warning: "Practitioner treats wedding, griha-praveśa, or major business-launch with Chowghadiya alone.",
    remedy: "Apply §4.3 high-stakes classification + Lesson 23.5.3 practical-heuristic-vs-integrated-method distinction.",
  },
  {
    key: "paranoiaFeeding",
    label: "Engaging client-paranoia via trivial consultations",
    warning: "Practitioner accepts daily what-to-wear / what-to-eat / routine-call-timing requests; client dependency and life-coach drift follow.",
    remedy: "Apply §4.6 client-paranoia-feeding-avoidance. Decline trivial engagement; articulate empowerment; refer to Chowghadiya phone-app.",
  },
];

export function findStakesLevel(key: StakesKey): StakesLevel {
  return STAKES_LEVELS.find((s) => s.key === key) ?? STAKES_LEVELS[0];
}

export function findMethod(key: MethodKey): Method {
  return METHODS.find((m) => m.key === key) ?? METHODS[0];
}

export function findScenario(key: ScenarioKey): ClientScenario {
  return CLIENT_SCENARIOS.find((s) => s.key === key) ?? CLIENT_SCENARIOS[0];
}
