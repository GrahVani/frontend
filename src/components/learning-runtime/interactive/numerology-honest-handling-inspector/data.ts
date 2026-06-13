/**
 * Engine for Lesson 21.4.4 — Numerology Honest-Handling Inspector.
 *
 * Provides the empirical-kernel / over-claim layer framework, the eight
 * over-claim framings, the five operational forms of do-no-harm, the Chapter
 * 1-4 integration table, and scenario-based inspection drills.
 */

export type OverclaimKey =
  | "life-fixer"
  | "fear-induction"
  | "destiny-determinism"
  | "year-determinant"
  | "name-change-catalogue"
  | "master-special"
  | "one-true-system"
  | "computational-incoherence";

export type DoNoHarmKey =
  | "single-factor"
  | "fear"
  | "convergent-grounds"
  | "four-test"
  | "contribution-causation";

export type Verdict = "proceed" | "revise" | "refuse" | "mixed";

export interface OverclaimFraming {
  key: OverclaimKey;
  number: number;
  label: string;
  description: string;
  source: string;
}

export interface DoNoHarmForm {
  key: DoNoHarmKey;
  letter: string;
  label: string;
  description: string;
}

export interface LayerDescription {
  key: "empirical-kernel" | "symbolic-layer" | "over-claim";
  label: string;
  description: string;
  stance: string;
}

export interface ChapterIntegration {
  chapter: string;
  refusals: string;
  integration: string;
}

export interface Scenario {
  id: number;
  client: string;
  quote: string;
  context: string;
  empiricalKernelPresent: boolean;
  expectedOverclaims: OverclaimKey[];
  expectedFormsViolated: DoNoHarmKey[];
  verdict: Verdict;
  explanation: string;
  practitionerResponse: string;
}

export const LAYERS: LayerDescription[] = [
  {
    key: "empirical-kernel",
    label: "Empirical-kernel",
    description: "Classical-tradition lineage + symbolic-correspondence framework + multivalent interpretive content (graha-aṅka registers, strengths-and-shadows reading, cross-system digit meanings).",
    stance: "Preserve — legitimate symbolic-layer tradition with real interpretive content.",
  },
  {
    key: "symbolic-layer",
    label: "Symbolic layer",
    description: "Graha-aṅka register-correspondences are internally coherent and culturally meaningful, but not laboratory-verified causal mechanisms.",
    stance: "Acknowledge honestly — this is numerology's legitimate scope; neither dismiss as superstition nor inflate into empirical causation.",
  },
  {
    key: "over-claim",
    label: "Over-claim layer",
    description: "Single-factor causal-attribution, fear-induction, guarantee-language, destiny-determinism, year-as-determinant, master-number special framings, one-true-system, computational-incoherence.",
    stance: "Refuse structurally — the same failure mode regardless of system or register.",
  },
];

export const OVERCLAIM_FRAMINGS: OverclaimFraming[] = [
  {
    key: "life-fixer",
    number: 1,
    label: "Numerology-as-life-fixer",
    description: "Change name / number to magically improve career, marriage, health, wealth, bring harmony.",
    source: "Lesson 21.4.1 + Lesson 21.4.3",
  },
  {
    key: "fear-induction",
    number: 2,
    label: "Fear-induction",
    description: "Rahu / Ketu / Saturn / Sade-Sati framed as curse, doom, or cosmic punishment.",
    source: "Lesson 21.2.2 + Lesson 21.2.3",
  },
  {
    key: "destiny-determinism",
    number: 3,
    label: "Destiny-determinism",
    description: "Bhagyanka or Life-Path means destiny is fixed or guaranteed.",
    source: "Lesson 21.3.2",
  },
  {
    key: "year-determinant",
    number: 4,
    label: "Year-as-determinant",
    description: "Personal Year X is a guaranteed-outcome year.",
    source: "Lesson 21.3.4",
  },
  {
    key: "name-change-catalogue",
    number: 5,
    label: "Name-change over-claim catalogue",
    description: "The six commercial name-correction failure modes (life-fixer, fear-escape, commercial-pressure, guarantee-language, practitioner-imposition, computational-incoherence).",
    source: "Lesson 21.4.3",
  },
  {
    key: "master-special",
    number: 6,
    label: "Master-number special",
    description: "Master 11/22/33 means cosmically chosen / spiritually advanced by default.",
    source: "Lesson 21.2.4",
  },
  {
    key: "one-true-system",
    number: 7,
    label: "One-true-system",
    description: "Chaldean is the only real / Vedic the only authentic / Pythagorean the only scientific system.",
    source: "Lesson 21.1.4",
  },
  {
    key: "computational-incoherence",
    number: 8,
    label: "Computational-incoherence",
    description: "Change name to escape Mulaṅka / Bhagyanka — birth-date-derived numbers name-change cannot alter.",
    source: "Lesson 21.3.1 + Lesson 21.3.2 + Lesson 21.3.3",
  },
];

export const DO_NO_HARM_FORMS: DoNoHarmForm[] = [
  {
    key: "single-factor",
    letter: "a",
    label: "Refuse single-factor causal-attribution",
    description: "Life outcomes depend on dozens of factors; a number is at most one ambient-context contribution.",
  },
  {
    key: "fear",
    letter: "b",
    label: "Refuse fear-induction",
    description: "Shadow-grahas are not curse-bearers; Sade-Sati is a transit phenomenon, not a numerology register.",
  },
  {
    key: "convergent-grounds",
    letter: "c",
    label: "Apply convergent-independent-grounds",
    description: "Major life decisions require multiple independent grounds; never a single numerology framing alone.",
  },
  {
    key: "four-test",
    letter: "d",
    label: "Apply the four-test screen",
    description: "Empirical-kernel + demolition-prohibition + cost-benefit + over-claim tests; any failure -> revision or refusal.",
  },
  {
    key: "contribution-causation",
    letter: "e",
    label: "Apply contribution-vs-causation",
    description: "Numerology is one contribution among many, never the sole cause.",
  },
];

export const CHAPTER_INTEGRATION: ChapterIntegration[] = [
  {
    chapter: "Chapter 1 — Three-system survey",
    refusals: "One-true-system over-claim; pick-one-per-consultation discipline.",
    integration: "Select one system explicitly per consultation; refuse 'only X system is correct' framings.",
  },
  {
    chapter: "Chapter 2 — Nine digits + master numbers",
    refusals: "Shadow-graha fear-induction; Sade-Sati conflation; master-number special; all-strengths/all-shadows reading failures.",
    integration: "Read every digit multivalently; refuse curse-framings; refuse cosmic-specialness; keep Śani readings separate from Sade-Sati transit.",
  },
  {
    chapter: "Chapter 3 — Personal-number computation",
    refusals: "Destiny-determinism; year-as-determinant; computational-incoherence.",
    integration: "Apply correct procedure; refuse fixed-destiny / guaranteed-year / escape-by-name-change framings; note system-portable vs system-dependent numbers.",
  },
  {
    chapter: "Chapter 4 — Name-correction practice",
    refusals: "Six commercial-failure-mode catalogue; rationale-gating; preview-vs-commit bypass.",
    integration: "Rationale -> computation -> cautions; refuse single numerology framing; recommend preview; provide information, apply discipline, respect decision.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    client: "Multi-framing over-claim consultation",
    quote: "My numerologist computed Mulaṅka 7 (Ketu) and said it is a spiritually-isolated cursed number. Bhāgyāṅka 8 (Saturn) means perpetual Sade-Sati for life. Master 11 Life-Path makes me cosmically chosen. My Name-Number 4 (Rāhu) is doubly-cursed. She recommends changing to Master 22 and GUARANTEES it will improve my career, fix my marriage, and remove the cursed registers. Fee: Rs. 40,000. Should I do this?",
    context: "A single consultation layering eight over-claim framings. The computed numbers themselves may be correct; every interpretation layered on top is over-claim.",
    empiricalKernelPresent: true,
    expectedOverclaims: [
      "fear-induction",
      "master-special",
      "life-fixer",
      "name-change-catalogue",
      "computational-incoherence",
    ],
    expectedFormsViolated: ["single-factor", "fear", "convergent-grounds", "four-test", "contribution-causation"],
    verdict: "refuse",
    explanation: "The computed registers (Mulaṅka 7, Bhagyanka 8, Master 11, Name-Number 4) are empirical-kernel information. Every layered framing is over-claim: fear-induction on shadow-grahas and Śani/Sade-Sati, master-special, life-fixer, guarantee-language, name-change catalogue, and computational-incoherence (name-change cannot alter Mulaṅka/Bhagyanka). All five do-no-harm forms are violated. No convergent independent ground exists.",
    practitionerResponse: "I refuse this recommendation. The number identifications may be correct, but every interpretation layered on them is over-claim. Shadow-grahas are not curse-bearers, Bhagyanka is not Sade-Sati, master-numbers are not cosmic specialness, and a name-change cannot remove birth-date-derived registers. There are no independent grounds for the change, and the guarantee-language is single-factor causal-attribution. Do not pay Rs. 40,000 on these grounds.",
  },
  {
    id: 2,
    client: "Legitimate marriage-context consultation",
    quote: "I'm getting married and adopting my partner's surname Sharma. We're deciding between Priya Sharma and Pria Sharma. Can numerology give any useful input?",
    context: "Legitimate convergent independent grounds (marriage + aesthetic preference). Numerology is confirmatory input for selecting among life-circumstance-produced variants.",
    empiricalKernelPresent: true,
    expectedOverclaims: [],
    expectedFormsViolated: [],
    verdict: "proceed",
    explanation: "Empirical-kernel is preserved: Name-Number computation can compare the two candidate spellings as chart-context register information. No over-claim framings are present in the client's question. All five do-no-harm forms are satisfied: no single-factor attribution, no fear, convergent grounds present, four-test screen passes, contribution-vs-causation maintained. Verdict: proceed with discipline-compliant framing and preview-vs-commit.",
    practitionerResponse: "Yes — numerology can be a confirmatory input. Marriage and your aesthetic preference are legitimate independent grounds. I'll compute both candidates, present the register-difference as chart-context information, and avoid any guarantee-language. The name-choice is one contribution among many factors in your marriage; the decision remains yours. I also recommend previewing the new spelling socially before committing all documentation.",
  },
  {
    id: 3,
    client: "One-true-system claim",
    quote: "A practitioner told me that Pythagorean numerology is the only scientifically valid system and that Chaldean and Vedic systems are just commercial distortions. He insists I abandon my family's Vedic Anka-Jyotiṣa practice.",
    context: "System-selection over-claim. Each of the three systems has legitimate classical-tradition lineage; pick-one-per-consultation does not mean only-one-is-valid.",
    empiricalKernelPresent: true,
    expectedOverclaims: ["one-true-system"],
    expectedFormsViolated: ["contribution-causation"],
    verdict: "refuse",
    explanation: "The empirical-kernel (all three systems carry classical lineage) is present. The over-claim is one-true-system universalism. The practitioner's insistence misattributes the discipline: pick-one-per-consultation is operational consistency, not system-supremacy.",
    practitionerResponse: "I refuse that framing. Chaldean, Pythagorean, and Vedic Anka-Jyotiṣa each have classical-tradition lineage. The discipline is to pick one system per consultation and apply it consistently — not to claim one is the only valid system. Your family's Vedic practice is a legitimate symbolic-correspondence tradition.",
  },
  {
    id: 4,
    client: "Destiny-determinism claim",
    quote: "My Bhāgyāṅka is 8, so my numerologist says my destiny is fixed around Saturn-like hardship and there's nothing I can do about it.",
    context: "Bhāgyāṅka is a symbolic register, not a fixed destiny. The framing removes agency and deterministically attributes life outcomes to a single number.",
    empiricalKernelPresent: true,
    expectedOverclaims: ["destiny-determinism"],
    expectedFormsViolated: ["single-factor", "contribution-causation"],
    verdict: "refuse",
    explanation: "Bhāgyāṅka 8 as Śani-aṅka register is empirical-kernel. 'Destiny is fixed' is destiny-determinism over-claim, violating single-factor causal-attribution and contribution-vs-causation.",
    practitionerResponse: "I refuse that framing. Bhāgyāṅka 8 identifies a Śani-aṅka register in your chart-context — that is legitimate interpretive content. But it does not fix your destiny. Life outcomes are multi-factor; the register is one ambient-context contribution. Conscious engagement with discipline, responsibility, and timing can shape how any register expresses.",
  },
  {
    id: 5,
    client: "Year-as-determinant claim",
    quote: "I'm entering Personal Year 8, and my numerologist says this year will definitely bring major career success and financial gain because of the year-number.",
    context: "Personal Year is a symbolic cycle indicator, not a deterministic outcome guarantee.",
    empiricalKernelPresent: true,
    expectedOverclaims: ["year-determinant"],
    expectedFormsViolated: ["single-factor", "contribution-causation"],
    verdict: "revise",
    explanation: "Personal Year 8 as a Śani-aṅka thematic cycle is empirical-kernel. 'Definitely bring career success and financial gain' is year-as-determinant over-claim, violating single-factor attribution and contribution-vs-causation. The statement can be revised to contribution-vs-causation language.",
    practitionerResponse: "I would revise that framing. Personal Year 8 points to a Śani-aṅka thematic cycle — discipline, authority, consolidation, possibly delayed results. That is chart-context information. But it does not guarantee career success or financial gain. Outcomes depend on your skills, market, choices, and many other factors; the year-number is one contribution among them.",
  },
  {
    id: 6,
    client: "Master-number special claim",
    quote: "My son has a Master 22 Life-Path. A numerologist told us he is a 'Master Builder' chosen for a great destiny and we should treat him as spiritually superior to his peers.",
    context: "Master-numbers are intensified registers requiring elevated conscious engagement, not markers of cosmic specialness or superiority.",
    empiricalKernelPresent: true,
    expectedOverclaims: ["master-special"],
    expectedFormsViolated: ["single-factor", "contribution-causation"],
    verdict: "refuse",
    explanation: "Master 22 as an intensified register is empirical-kernel. 'Master Builder chosen for great destiny' and 'spiritually superior' are master-number special over-claims, violating single-factor attribution and contribution-vs-causation.",
    practitionerResponse: "I refuse that framing. Master 22 is an intensified Candra-4 / Rāhu-4 amplitude register — it can indicate heightened capacity for practical vision, but also intensified shadows such as rigidity or overwhelm. It is not a mark of cosmic chosenness or superiority. How the register expresses depends on environment, education, choices, and many other factors.",
  },
];

export const WORKFLOW_SUMMARY = [
  {
    title: "Identify the empirical-kernel",
    text: "Classical lineage + symbolic-correspondence framework + multivalent interpretive content. Preserve this layer.",
  },
  {
    title: "Acknowledge the symbolic-layer status",
    text: "Internally coherent and culturally meaningful, but not a laboratory-verified causal mechanism. Neither dismiss nor inflate.",
  },
  {
    title: "Scan for the eight over-claim framings",
    text: "Life-fixer, fear-induction, destiny-determinism, year-as-determinant, name-change catalogue, master-special, one-true-system, computational-incoherence.",
  },
  {
    title: "Apply the five operational forms of do-no-harm",
    text: "Refuse single-factor attribution; refuse fear; require convergent grounds; run the four-test screen; keep contribution distinct from causation.",
  },
  {
    title: "Integrate Chapter 1-4 refusals into one coherent practice",
    text: "System-selection, digit-reading, computation, and name-correction refusals are applied uniformly in every consultation.",
  },
  {
    title: "Provide information, apply discipline, respect client decision",
    text: "The practitioner's role is transparent information-provider + discipline-applier + decision-respecter, not decision-maker.",
  },
];

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "proceed":
      return "Proceed with discipline";
    case "revise":
      return "Revise framing";
    case "refuse":
      return "Refuse over-claim";
    case "mixed":
      return "Mixed — separate layers";
  }
}

export function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case "proceed":
      return "#2F7D55";
    case "revise":
      return "#B88421";
    case "refuse":
      return "#A23A1E";
    case "mixed":
      return "#356CAB";
  }
}

export function getOverclaim(key: OverclaimKey): OverclaimFraming | undefined {
  return OVERCLAIM_FRAMINGS.find((o) => o.key === key);
}

export function getDoNoHarmForm(key: DoNoHarmKey): DoNoHarmForm | undefined {
  return DO_NO_HARM_FORMS.find((f) => f.key === key);
}
