import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type WorkflowStepSlug = "identify" | "cancel" | "strength" | "dasha" | "transit" | "two-yes" | "frame";
export type WorkflowScenarioSlug = "strong-timed-raja" | "cancelled-dosha" | "withhold-single-signal";

export interface WorkflowStep {
  slug: WorkflowStepSlug;
  number: number;
  label: string;
  shortLabel: string;
  engine: string;
  action: string;
  question: string;
  color: string;
}

export interface WorkflowScenario {
  slug: WorkflowScenarioSlug;
  label: string;
  iast: string;
  devanagari: string;
  chartSignal: string;
  cancellationClear: boolean;
  strengthClear: boolean;
  dashaClear: boolean;
  transitClear: boolean;
  honestFrame: string;
  color: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    slug: "identify",
    number: 1,
    label: "Identify all yogas and doshas",
    shortLabel: "Identify",
    engine: "/yogas",
    action: "List raja, dhana, PMPY, special yogas, Vipareeta, and doshas before choosing favorites.",
    question: "What is actually present in the chart?",
    color: grahas.guru.primary,
  },
  {
    slug: "cancel",
    number: 2,
    label: "Check cancellations and dilutions",
    shortLabel: "Cancel",
    engine: "/yogas",
    action: "Test dosha cancellations and yoga dilution before predicting effects.",
    question: "Is the signal clean, softened, or cancelled?",
    color: grahas.budha.primary,
  },
  {
    slug: "strength",
    number: 3,
    label: "Overlay strength",
    shortLabel: "Strength",
    engine: "/shadbala + /ashtakavarga",
    action: "Grade with shadbala, SAV, dignity, and status before timing the result.",
    question: "Can the yoga-forming planets deliver?",
    color: grahas.surya.primary,
  },
  {
    slug: "dasha",
    number: 4,
    label: "Find dasha timing",
    shortLabel: "Dasha",
    engine: "/dasha",
    action: "Time the yoga through the dasha and bhukti of participating planets.",
    question: "Has the appointment arrived?",
    color: grahas.shani.primary,
  },
  {
    slug: "transit",
    number: 5,
    label: "Confirm with transit",
    shortLabel: "Transit",
    engine: "/transits",
    action: "Seek gochara activation of the same yoga houses or planets.",
    question: "Is there a trigger on the same field?",
    color: grahas.candra.primary,
  },
  {
    slug: "two-yes",
    number: 6,
    label: "Apply two-yes",
    shortLabel: "Two yes",
    engine: "synthesis",
    action: "Require at least two independent indicators before committing to a firm prediction.",
    question: "Do two independent lines agree?",
    color: grahas.mangala.primary,
  },
  {
    slug: "frame",
    number: 7,
    label: "Frame honestly",
    shortLabel: "Frame",
    engine: "reader discipline",
    action: "State pure or diluted, strong or weak, manifest or limited; de-fearmonger doshas.",
    question: "How should this be said responsibly?",
    color: grahas.shukra.primary,
  },
];

export const WORKFLOW_SCENARIOS: WorkflowScenario[] = [
  {
    slug: "strong-timed-raja",
    label: "Full raja-yoga pass",
    iast: "Raja yoga, timed and confirmed",
    devanagari: "राजयोग",
    chartSignal: "Kendra-trikona yoga is identified, not diluted, strong by audit, and running in its planet periods.",
    cancellationClear: true,
    strengthClear: true,
    dashaClear: true,
    transitClear: true,
    honestFrame: "Commit carefully: strong, timed, and transit-confirmed.",
    color: grahas.guru.primary,
  },
  {
    slug: "cancelled-dosha",
    label: "Manglik dosha pass",
    iast: "Dosha checked before alarm",
    devanagari: "दोषशमन",
    chartSignal: "Mars placement flags a dosha, but cancellation conditions soften the result.",
    cancellationClear: true,
    strengthClear: false,
    dashaClear: false,
    transitClear: false,
    honestFrame: "De-fearmonger: name the cancellation and avoid fatal language.",
    color: grahas.mangala.primary,
  },
  {
    slug: "withhold-single-signal",
    label: "Withhold prediction",
    iast: "One signal is not enough",
    devanagari: "विचारः",
    chartSignal: "A named yoga appears strong, but timing and transit do not yet agree.",
    cancellationClear: true,
    strengthClear: true,
    dashaClear: false,
    transitClear: false,
    honestFrame: "Withhold firm prediction until timing or transit supplies the second yes.",
    color: grahas.shani.primary,
  },
];

export function getWorkflowStep(slug: WorkflowStepSlug) {
  return WORKFLOW_STEPS.find((step) => step.slug === slug) ?? WORKFLOW_STEPS[0];
}

export function getWorkflowScenario(slug: WorkflowScenarioSlug) {
  return WORKFLOW_SCENARIOS.find((scenario) => scenario.slug === slug) ?? WORKFLOW_SCENARIOS[0];
}
