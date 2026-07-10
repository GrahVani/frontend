/**
 * Engine for Lesson 21.4.3 — Name-Correction Caution Screener.
 *
 * Provides the four-test screen framework, six commercial-numerology failure
 * modes, three real-cost categories, and scenario-based caution drills.
 */

export type TestKey =
  | "empirical-kernel"
  | "demolition-prohibition"
  | "cost-benefit"
  | "over-claim";

export type FailureModeKey =
  | "life-fixer"
  | "fear-escape"
  | "commercial-pressure"
  | "guarantee-language"
  | "practitioner-imposition"
  | "computational-incoherence";

export type Verdict = "proceed" | "preview" | "revise" | "refuse";

export interface FourTest {
  key: TestKey;
  label: string;
  shortLabel: string;
  passQuestion: string;
  failQuestion: string;
}

export interface FailureMode {
  key: FailureModeKey;
  number: number;
  label: string;
  description: string;
}

export interface CostCategory {
  key: "documentation" | "social-friction" | "identity-continuity";
  number: number;
  label: string;
  description: string;
  examples: string[];
}

export interface Scenario {
  id: number;
  client: string;
  quote: string;
  context: string;
  expectedTests: Record<TestKey, boolean>;
  expectedFailures: FailureModeKey[];
  verdict: Verdict;
  explanation: string;
  practitionerResponse: string;
}

export const FOUR_TESTS: FourTest[] = [
  {
    key: "empirical-kernel",
    label: "Test 1 — Empirical-Kernel",
    shortLabel: "Empirical-Kernel",
    passQuestion: "Is the prescription routed through chart-context register-difference (not deterministic improvement)?",
    failQuestion: "Is it framed as deterministic life-improvement?",
  },
  {
    key: "demolition-prohibition",
    label: "Test 2 — Demolition-Prohibition",
    shortLabel: "Demolition-Prohibition",
    passQuestion: "Are there convergent independent grounds (categories 1-5)?",
    failQuestion: "Does it rest on single-numerology-framing alone?",
  },
  {
    key: "cost-benefit",
    label: "Test 3 — Cost-Benefit",
    shortLabel: "Cost-Benefit",
    passQuestion: "Do the three real-cost categories balance against the realistic register-shift?",
    failQuestion: "Do documentation + social-friction + identity-continuity costs outweigh benefit?",
  },
  {
    key: "over-claim",
    label: "Test 4 — Over-Claim",
    shortLabel: "Over-Claim",
    passQuestion: "Is framing contribution-vs-causation (no single-factor life guarantees)?",
    failQuestion: "Does it make single-factor causal-attribution to multifactorial outcomes?",
  },
];

export const FAILURE_MODES: FailureMode[] = [
  {
    key: "life-fixer",
    number: 1,
    label: "Numerology-alone-as-life-fixer",
    description: "Change name to magically improve career / marriage / health / wealth / bring harmony.",
  },
  {
    key: "fear-escape",
    number: 2,
    label: "Fear-induction-driven-escape",
    description: "Change name to escape Saturn's curse, Rahu's fate, Sade-Sati, Ketu-isolation, etc.",
  },
  {
    key: "commercial-pressure",
    number: 3,
    label: "Commercial-numerologist-pressure",
    description: "Practitioner insists on the change for fee, prestige, or upsell; client would not consider it independently.",
  },
  {
    key: "guarantee-language",
    number: 4,
    label: "Guarantee-language",
    description: "Framing that the Name-Number WILL / DETERMINISTICALLY produces / GUARANTEES success.",
  },
  {
    key: "practitioner-imposition",
    number: 5,
    label: "Practitioner-imposition",
    description: "Practitioner picks best spelling without client phonetic-acceptability confirmation.",
  },
  {
    key: "computational-incoherence",
    number: 6,
    label: "Computational-incoherence",
    description: "Change name to escape Mulaṅka / Bhāgyāṅka — birth-date-derived numbers name-change cannot alter.",
  },
];

export const COST_CATEGORIES: CostCategory[] = [
  {
    key: "documentation",
    number: 1,
    label: "Documentation cost",
    description: "Financial + administrative cost of updating legal identity across government, financial, professional, educational, and family records.",
    examples: [
      "Gazette notification, passport renewal, Aadhaar/PAN/license updates",
      "Bank KYC re-verification across multiple accounts",
      "Professional credentials: LinkedIn, business cards, email signatures",
      "Educational records + transcripts (some institutions don't update post-graduation)",
      "Typical total: Rs. 5,000-50,000 + 50-200 hours over 6-18 months",
    ],
  },
  {
    key: "social-friction",
    number: 2,
    label: "Social-friction cost",
    description: "The 1-3 year settlement period during which family, friends, colleagues, and professional networks learn and adopt the new name.",
    examples: [
      "Identity-recognition issues: people who knew the old name don't recognise the new",
      "Social-introduction awkwardness during transition",
      "Mixed-use periods: legal name in formal contexts, social name in casual contexts",
      "Family resistance + professional-recognition discontinuity",
    ],
  },
  {
    key: "identity-continuity",
    number: 3,
    label: "Identity-continuity loss",
    description: "Psychological friction as the practitioner's internal sense of name-identity shifts; some never fully internalise the new name.",
    examples: [
      "Self-introduction awkwardness for months or longer",
      "Identity-displacement: felt sense of being in-between names",
      "Memory-and-narrative discontinuity with past experiences",
      "Children + spouse adapt their internal representation of you more slowly",
    ],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    client: "Marriage + confirmatory numerology",
    quote: "I'm getting married and adopting my partner's surname Sharma. We're deciding between Priya Sharma and Pria Sharma. Can numerology help us choose?",
    context: "Legitimate category-1 (marriage) + category-3 (aesthetic) grounds. Numerology is confirmatory input for selecting among life-circumstance-produced variants.",
    expectedTests: {
      "empirical-kernel": true,
      "demolition-prohibition": true,
      "cost-benefit": true,
      "over-claim": true,
    },
    expectedFailures: [],
    verdict: "proceed",
    explanation: "All four tests pass. The surname change is happening because of marriage regardless of numerology; numerology is confirmatory. Cost-benefit favours because documentation cost is already sunk for the marriage-driven name-change. No over-claim framing is present.",
    practitionerResponse: "All four discipline-tests pass. Priya Sharma and Pria Sharma are chart-context register options within your marriage-related name-change. I recommend previewing the chosen spelling socially for 3-12 months before committing legal documentation. The decision is yours.",
  },
  {
    id: 2,
    client: "Pure numerology-alone over-claim",
    quote: "My numerologist says I should change Anita to Aneetha. This changes my Name-Number from 9 to 6, which she says will balance my Rahu and bring more harmony. She quoted Rs. 15,000 for the service.",
    context: "No categories 1-5 ground. Mulaṅka is birth-date-derived and cannot be changed by name-change. Fee-driven recommendation.",
    expectedTests: {
      "empirical-kernel": false,
      "demolition-prohibition": false,
      "cost-benefit": false,
      "over-claim": false,
    },
    expectedFailures: ["life-fixer", "fear-escape", "commercial-pressure", "guarantee-language", "computational-incoherence"],
    verdict: "refuse",
    explanation: "Test 1 fails: 'balance Rahu' is fear-induction + computationally incoherent (Mulaṅka is not changeable). Test 2 fails: no convergent independent grounds. Test 3 fails: real costs without any legitimate-ground benefit. Test 4 fails: single-factor causal-attribution. Five of six failure modes are present.",
    practitionerResponse: "I refuse this recommendation. 'Balance Rahu' is fear-induction framing; Mulaṅka is birth-date-derived and cannot be changed by name-change. There are no independent life-circumstance grounds, the fee structure creates commercial-pressure, and the guarantee-like language over-claims. I can explain the chart-context facts, but I will not recommend a name-change on this basis.",
  },
  {
    id: 3,
    client: "Preview-vs-commit application",
    quote: "I have legitimate grounds for Pria Sharma — marriage to a Sharma plus I've always preferred the spelling Pria. I want to commit legally at the wedding.",
    context: "All four tests pass. Even so, legal documentation-change should be preceded by a 3-12 month social preview.",
    expectedTests: {
      "empirical-kernel": true,
      "demolition-prohibition": true,
      "cost-benefit": true,
      "over-claim": true,
    },
    expectedFailures: [],
    verdict: "preview",
    explanation: "All tests pass, but the discipline ALWAYS recommends preview before committing legal documentation. Preview in low-stakes contexts provides empirical feedback about felt-experience and social-uptake friction that pure computation cannot.",
    practitionerResponse: "Before initiating passport / Aadhaar / PAN updates, preview 'Pria Sharma' socially for 3-12 months: introduce yourself that way to new acquaintances, use it on social media, at restaurants, in casual emails. Keep legal documents and high-stakes professional context as 'Priya' for now. After the preview, decide whether the spelling feels internalised and whether the social-uptake friction is acceptable.",
  },
  {
    id: 4,
    client: "Legitimate ground layered with over-claim",
    quote: "I'm rebranding my coaching business and prefer the spelling Ravii over Ravi. My numerologist says Ravii's Name-Number will definitely boost my career and attract more clients.",
    context: "Category 5 (professional rebranding) + category 3 (aesthetic) are legitimate independent grounds, but the framing contains guarantee-language and life-fixer over-claim.",
    expectedTests: {
      "empirical-kernel": true,
      "demolition-prohibition": true,
      "cost-benefit": true,
      "over-claim": false,
    },
    expectedFailures: ["life-fixer", "guarantee-language"],
    verdict: "revise",
    explanation: "Tests 1-3 pass because professional rebranding is a legitimate independent ground and cost-benefit can favour business-identity change. Test 4 fails because 'will definitely boost my career and attract more clients' is guarantee-language + single-factor causal-attribution. The recommendation can proceed only after revising the framing to contribution-vs-causation.",
    practitionerResponse: "Your professional rebranding + aesthetic preference are legitimate grounds, and Ravii can be one of the candidate spellings. But I must revise the framing: the Name-Number is chart-context register information, not a deterministic career-booster. I will present Ravii's register as one ambient-context input among many; I will not claim it guarantees client attraction.",
  },
  {
    id: 5,
    client: "Fear-induction + no convergent grounds",
    quote: "My Bhagyanka is 8 and my Mulaṅka is 4. A numerologist told me to add an extra 'a' to my name to escape Shani's curse and Rahu's bad luck.",
    context: "No categories 1-5 ground. Bhagyanka and Mulaṅka are birth-date-derived; name-change cannot alter them. Fear-induction over-claim.",
    expectedTests: {
      "empirical-kernel": false,
      "demolition-prohibition": false,
      "cost-benefit": false,
      "over-claim": false,
    },
    expectedFailures: ["fear-escape", "computational-incoherence"],
    verdict: "refuse",
    explanation: "Test 1 fails: 'escape Shani / Rahu' is fear-induction + misattributes change-mechanism. Test 2 fails: no convergent independent grounds. Test 3 fails: real costs with no legitimate benefit. Test 4 fails: single-factor causal-attribution to multifactorial life-outcomes.",
    practitionerResponse: "I refuse. Bhagyanka and Mulaṅka are derived from your birth date; changing your name cannot change them. 'Escape Shani's curse' is fear-induction framing that the shadow-graha caveats explicitly refuse. Name-change is not a remedy for birth-date-derived registers.",
  },
  {
    id: 6,
    client: "Practitioner-imposition risk",
    quote: "I'm returning to my birth-name after divorce. My family numerologist is pressuring me to also change my first name from Anjali to Anjalee because she says it will help me find a better partner faster.",
    context: "Category 2 (legal-recognition: reverting to birth-name) is legitimate. First-name spelling-change is practitioner-imposition + life-fixer over-claim.",
    expectedTests: {
      "empirical-kernel": true,
      "demolition-prohibition": true,
      "cost-benefit": true,
      "over-claim": false,
    },
    expectedFailures: ["life-fixer", "practitioner-imposition", "guarantee-language"],
    verdict: "revise",
    explanation: "Tests 1-3 pass for the surname reversion. Test 4 fails for the first-name spelling-change because 'help find a better partner faster' is life-fixer + guarantee-language. The practitioner is also imposing a spelling without client confirmation. Verdict: approve surname reversion; revise/refuse first-name change.",
    practitionerResponse: "Reverting to your birth-name is a legitimate legal-recognition change; I can support that. But I will not recommend changing Anjali to Anjalee: 'better partner faster' is over-claim, and changing your first name requires your own phonetic-acceptability confirmation — not the numerologist's insistence. Let's separate the two layers.",
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Step 1 — Rationale-evaluation gate (Lesson 21.4.1)",
    text: "Confirm legitimate convergent independent grounds (categories 1-5). If only numerology-alone, category-6 without convergence, or over-claim layers: refuse.",
  },
  {
    title: "Step 2 — Computation workflow (Lesson 21.4.2)",
    text: "If rationale passes, compute current + candidate Name-Numbers, identify target register, generate phonetic-preserving variants, verify client acceptance, and prepare discipline-compliant presentation.",
  },
  {
    title: "Step 3 — Apply the four-test screen (this lesson)",
    text: "Test 1 empirical-kernel, Test 2 demolition-prohibition, Test 3 cost-benefit, Test 4 over-claim. Any failure triggers revision or refusal.",
  },
  {
    title: "Step 4 — Assess three real-cost categories",
    text: "Surface documentation cost (Rs. 5,000-50,000 + 50-200 hours), social-friction cost (1-3 year settlement), and identity-continuity loss (months-to-years internalisation). Costs compound.",
  },
  {
    title: "Step 5 — Recommend preview-vs-commit",
    text: "Even when all tests pass, recommend 3-12 month social preview before legal documentation-change. Maintain original spelling in high-stakes / legal contexts during preview.",
  },
  {
    title: "Step 6 — Refuse commercial failure modes + respect client decision",
    text: "Refuse the six failure modes regardless of surface presentation. Provide information, apply discipline, and respect the client's decision per the client-empowerment principle.",
  },
];

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "proceed":
      return "Proceed (with preview before legal commit)";
    case "preview":
      return "Recommend preview-vs-commit";
    case "revise":
      return "Revise framing / separate layers";
    case "refuse":
      return "Refuse";
  }
}

export function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case "proceed":
      return "#2F7D55";
    case "preview":
      return "#356CAB";
    case "revise":
      return "#B88421";
    case "refuse":
      return "#A23A1E";
  }
}

export function getFailureMode(key: FailureModeKey): FailureMode | undefined {
  return FAILURE_MODES.find((f) => f.key === key);
}

export function getTest(key: TestKey): FourTest | undefined {
  return FOUR_TESTS.find((t) => t.key === key);
}
