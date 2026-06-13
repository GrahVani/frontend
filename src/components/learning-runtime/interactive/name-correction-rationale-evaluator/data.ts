/**
 * Engine for Lesson 21.4.1 — Name-Correction Rationale Evaluator.
 *
 * Provides the six-rationale-category framework, scenario-based rationale
 * evaluation exercises, over-claim layer detection, and the discipline workflow.
 */

export type CategoryKey =
  | "marriage"
  | "legal"
  | "aesthetic"
  | "cultural"
  | "professional"
  | "numerology"
  | "overclaim";

export type OverclaimLayer = "fear" | "fixer" | "pressure";

export interface RationaleCategory {
  key: CategoryKey;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  compliant: "legitimate" | "conditional" | "overclaim";
}

export const CATEGORIES: RationaleCategory[] = [
  {
    key: "marriage",
    number: 1,
    label: "Marriage",
    shortLabel: "Marriage",
    description: "Adopting partner's surname or new combined surname at marriage; cultural-tradition practice.",
    compliant: "legitimate",
  },
  {
    key: "legal",
    number: 2,
    label: "Legal-recognition",
    shortLabel: "Legal",
    description: "Formalising a name already used socially or professionally; aligning documents with daily-used name.",
    compliant: "legitimate",
  },
  {
    key: "aesthetic",
    number: 3,
    label: "Aesthetic-preference",
    shortLabel: "Aesthetic",
    description: "Personal preference for a different spelling or version of the name; visual or phonetic clarity.",
    compliant: "legitimate",
  },
  {
    key: "cultural",
    number: 4,
    label: "Cultural-context shift",
    shortLabel: "Cultural",
    description: "Moving between language-contexts; adding diacritics; transliteration variant for migration.",
    compliant: "legitimate",
  },
  {
    key: "professional",
    number: 5,
    label: "Professional rebranding",
    shortLabel: "Professional",
    description: "Name-change for professional or artistic identity: stage-name, pen-name, business-context name.",
    compliant: "legitimate",
  },
  {
    key: "numerology",
    number: 6,
    label: "Numerology as confirmatory",
    shortLabel: "Numerology",
    description: "Name-Number shift as ONE consideration among multiple convergent grounds. Legitimate ONLY with categories 1-5; NEVER sole grounds.",
    compliant: "conditional",
  },
  {
    key: "overclaim",
    number: 0,
    label: "Over-claim rationale",
    shortLabel: "Over-claim",
    description: "No life-circumstance ground; numerology-alone-as-life-fixer, fear-induction escape, or commercial-pressure.",
    compliant: "overclaim",
  },
];

export const OVERCLAIM_LAYERS: { key: OverclaimLayer; label: string; description: string }[] = [
  {
    key: "fear",
    label: "Fear-induction-driven-escape",
    description: "Change name to escape Saturn's curse, Rāhu's fate, Sade-Sati, Ketu-isolation, etc.",
  },
  {
    key: "fixer",
    label: "Numerology-alone-as-life-fixer",
    description: "Change name to magically improve career, marriage, health, wealth, or bring harmony.",
  },
  {
    key: "pressure",
    label: "Commercial-numerologist-pressure",
    description: "Practitioner insists on the change for fee, prestige, or upsell; client would not consider it independently.",
  },
];

export interface Scenario {
  id: number;
  client: string;
  quote: string;
  categories: CategoryKey[];
  overclaim: OverclaimLayer[];
  operationalTest: "yes" | "no" | "partial";
  verdict: "approve" | "partial" | "refuse";
  explanation: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    client: "§1 hook client",
    quote: "My neighbour's numerologist says I should change the spelling of my name from 'Anita' to 'Aneetha' — this changes my Name-Number from 9 to 6, which she says will balance the Rāhu and bring more harmony. She's quoted me ₹15,000 for the name-correction service.",
    categories: ["overclaim"],
    overclaim: ["fear", "fixer", "pressure"],
    operationalTest: "no",
    verdict: "refuse",
    explanation: "No categories 1-5 ground. 'Balance the Rāhu' is fear-induction (Rāhu shadow-graha caveat) + computationally incoherent (Mūlāṅka is birth-date-derived, not changeable by name). 'Bring more harmony' is numerology-alone-as-life-fixer. ₹15,000 fee-driven recommendation is commercial-pressure.",
  },
  {
    id: 2,
    client: "Marriage + confirmatory",
    quote: "I'm getting married next month and adopting my partner's surname 'Sharma'. We're deciding between 'Priya Sharma' and 'Pria Sharma' — I've used 'Pria' socially for years. Can numerology help us choose?",
    categories: ["marriage", "aesthetic", "numerology"],
    overclaim: [],
    operationalTest: "yes",
    verdict: "approve",
    explanation: "Categories 1 (marriage) + 3 (aesthetic preference for 'Pria') are legitimate, independent grounds. Numerology is confirmatory: selecting among name-variant candidates the life-circumstance is producing.",
  },
  {
    id: 3,
    client: "Mixed case",
    quote: "I'm legally changing my surname back to my birth-name after divorce. My family-numerologist is pressuring me to ALSO change the spelling of my first name from 'Anjali' to 'Anjalee' because she says 'Anjalee' will help me find a better partner faster.",
    categories: ["legal", "overclaim"],
    overclaim: ["fixer", "pressure"],
    operationalTest: "partial",
    verdict: "partial",
    explanation: "Surname return is legitimate (category 2 — legal-recognition). First-name spelling-change is over-claim: 'better partner faster' is numerology-alone-as-life-fixer + family-numerologist pressure. Separate layers: approve surname; refuse first-name change.",
  },
  {
    id: 4,
    client: "Professional rebranding",
    quote: "I'm launching an author career under a pen-name. Between 'Ravi' and 'Ravii', I prefer the visual balance of 'Ravii'. Does the Name-Number give any useful input?",
    categories: ["professional", "aesthetic", "numerology"],
    overclaim: [],
    operationalTest: "yes",
    verdict: "approve",
    explanation: "Categories 5 (professional rebranding) + 3 (aesthetic preference) are independent grounds. Numerology can be confirmatory input for selecting between the two already-considered spellings.",
  },
  {
    id: 5,
    client: "Fear-induction escape",
    quote: "My Bhāgyāṅka is 8 and my Mūlāṅka is 4. A numerologist told me to add an extra 'a' to my name to escape Śani's curse and Rāhu's bad luck.",
    categories: ["overclaim"],
    overclaim: ["fear"],
    operationalTest: "no",
    verdict: "refuse",
    explanation: "No categories 1-5 ground. 'Escape Śani's curse / Rāhu's bad luck' is fear-induction over-claim. Also computationally incoherent: Bhāgyāṅka and Mūlāṅka are birth-date-derived and cannot be changed by name-change.",
  },
  {
    id: 6,
    client: "Cultural-context shift",
    quote: "I'm moving to a Devanāgarī-script work context. I want to align my documents with the proper Sanskrit spelling of my name. While making the change, can we check which spelling gives a Name-Number I find meaningful?",
    categories: ["cultural", "numerology"],
    overclaim: [],
    operationalTest: "yes",
    verdict: "approve",
    explanation: "Category 4 (cultural-context shift) is a legitimate independent ground. Numerology is confirmatory: selecting among spelling variants the cultural move is already producing.",
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Elicit the client's stated rationale",
    text: "Ask: *Why are you considering this name-change?* Listen for marriage, legal, aesthetic, cultural, professional, and numerology framings + any fear-induction / fixer / commercial-pressure layers.",
  },
  {
    title: "Categorise per the six-rationale-category framework",
    text: "Identify whether categories 1-5 (life-circumstance grounds) are present, or only category 6 (numerology), or over-claim-only.",
  },
  {
    title: "Probe for convergent independent grounds",
    text: "Operational test: *Would you be considering this name-change without the numerology-framing?* YES = legitimate confirmatory; NO = sole-motivator + refusal-discipline applies.",
  },
  {
    title: "Identify over-claim layers",
    text: "Look for fear-induction-driven-escape, numerology-alone-as-life-fixer, and commercial-numerologist-pressure. Often layered together.",
  },
  {
    title: "Discipline-compliant client conversation",
    text: "Preserve legitimate grounds; use numerology as confirmatory input for selecting among life-circumstance-produced variants; refuse over-claim layers; refuse recommendation when no convergent independent grounds exist.",
  },
];

export function getCategory(key: CategoryKey): RationaleCategory | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function verdictLabel(verdict: Scenario["verdict"]): string {
  switch (verdict) {
    case "approve":
      return "Approve as confirmatory";
    case "partial":
      return "Partial — separate layers";
    case "refuse":
      return "Refuse";
  }
}

export function verdictColor(verdict: Scenario["verdict"]): string {
  switch (verdict) {
    case "approve":
      return "#2F7D55";
    case "partial":
      return "#B88421";
    case "refuse":
      return "#A23A1E";
  }
}
