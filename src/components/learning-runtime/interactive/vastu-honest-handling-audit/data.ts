export type ScenarioKey = "demolition" | "marriageCause" | "flatCancel" | "mirrorGuarantee" | "lowCostCorrection";
export type FeasibilityKey = "low" | "medium" | "high";
export type ClaimStrengthKey = "modest" | "strong" | "absolute";
export type TestKey = "empirical" | "demolition" | "costBenefit" | "overclaim";
export type TestStatus = "pass" | "caution" | "fail";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface Scenario extends Option<ScenarioKey> {
  claim: string;
  empiricalKernel: string;
  symbolicLayer: string;
  cost: string;
  recommendation: string;
  defaultFeasibility: FeasibilityKey;
  defaultClaimStrength: ClaimStrengthKey;
  structuralChange: boolean;
  lifeOutcomeClaim: boolean;
}

export interface TestResult {
  key: TestKey;
  label: string;
  status: TestStatus;
  finding: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "demolition",
    label: "8-lakh wall demolition",
    note: "Master bedroom direction mismatch.",
    claim: "Demolish a load-bearing wall because the bedroom is not in the canonical SW zone.",
    empiricalKernel: "Bedroom stability has modest empirical support through quiet, weight, and privacy logic.",
    symbolicLayer: "SW/Nairrti is the heavy settled sleep zone in the symbolic layer.",
    cost: "Very high money, disruption, engineering risk, and family strain.",
    recommendation: "Do not demolish for Vastu alone. Use bed orientation, furniture weight, and symbolic correction unless independent renovation grounds exist.",
    defaultFeasibility: "low",
    defaultClaimStrength: "strong",
    structuralChange: true,
    lifeOutcomeClaim: false,
  },
  {
    key: "marriageCause",
    label: "Kitchen caused marriage issue",
    note: "NW kitchen blamed for relationship trouble.",
    claim: "The kitchen direction is the reason the marriage is failing.",
    empiricalKernel: "Kitchen ventilation and Sun-arc alignment can matter for comfort and hygiene.",
    symbolicLayer: "SE/Agni is the canonical fire zone; NW/Vayu is not ideal for kitchen fire.",
    cost: "Potentially high if relocation is demanded; emotionally high if blame is assigned.",
    recommendation: "Treat kitchen placement as ambient support, not marital causation. Address relationship causes through appropriate human channels.",
    defaultFeasibility: "medium",
    defaultClaimStrength: "absolute",
    structuralChange: false,
    lifeOutcomeClaim: true,
  },
  {
    key: "flatCancel",
    label: "Cancel flat for east toilet",
    note: "Single direction mismatch inflated online.",
    claim: "Cancel the purchase because an east toilet is a disaster.",
    empiricalKernel: "An east toilet may reduce useful morning light and needs good ventilation.",
    symbolicLayer: "East/Indra is a light and opportunity direction, so waste placement is symbolically suboptimal.",
    cost: "Very high opportunity cost, search delay, and stress.",
    recommendation: "Do not cancel for one mitigable defect. Use ventilation, cleanliness, door discipline, and symbolic correction.",
    defaultFeasibility: "low",
    defaultClaimStrength: "absolute",
    structuralChange: false,
    lifeOutcomeClaim: true,
  },
  {
    key: "mirrorGuarantee",
    label: "N-wall mirror guarantees wealth",
    note: "Modern mirror remedy overclaim.",
    claim: "A north-wall mirror will guarantee wealth flow.",
    empiricalKernel: "A mirror can brighten and visually expand a room if placed well.",
    symbolicLayer: "North/Kubera wealth symbolism supports N-wall mirror practice in modern Vastu.",
    cost: "Low cost but high claim inflation.",
    recommendation: "Use the mirror only as modest symbolic/decor support. Do not promise financial outcomes.",
    defaultFeasibility: "high",
    defaultClaimStrength: "absolute",
    structuralChange: false,
    lifeOutcomeClaim: true,
  },
  {
    key: "lowCostCorrection",
    label: "Low-cost NE water feature",
    note: "Modest symbolic and environmental correction.",
    claim: "Place a small clean water feature in NE to support jala-zone quality.",
    empiricalKernel: "Clean water, light, and uncluttered NE space can improve visual calm and environmental feel.",
    symbolicLayer: "NE/Isana-jala symbolism supports clean water placement.",
    cost: "Low money and low disruption.",
    recommendation: "Accept as a modest, honest, reversible correction with no life-outcome guarantee.",
    defaultFeasibility: "high",
    defaultClaimStrength: "modest",
    structuralChange: false,
    lifeOutcomeClaim: false,
  },
];

export const FEASIBILITY: Option<FeasibilityKey>[] = [
  { key: "low", label: "Low feasibility", note: "High cost, disruption, ownership, or engineering constraints." },
  { key: "medium", label: "Medium feasibility", note: "Possible, but cost and disruption need client review." },
  { key: "high", label: "High feasibility", note: "Low-cost, reversible, and within client authority." },
];

export const CLAIM_STRENGTH: Option<ClaimStrengthKey>[] = [
  { key: "modest", label: "Modest contribution", note: "Ambient support, not a guarantee." },
  { key: "strong", label: "Strong prescription", note: "Serious recommendation but still not deterministic." },
  { key: "absolute", label: "Absolute claim", note: "Guarantee, disaster, sole-cause, or single-factor life-outcome framing." },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findScenario(key: ScenarioKey): Scenario {
  return SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];
}

export function auditScenario(scenario: Scenario, feasibility: FeasibilityKey, claimStrength: ClaimStrengthKey): TestResult[] {
  const structuralRisk = scenario.structuralChange && feasibility !== "high";
  const costFail = feasibility === "low" && claimStrength !== "modest";
  const overClaim = claimStrength === "absolute" || scenario.lifeOutcomeClaim;

  return [
    {
      key: "empirical",
      label: "Empirical kernel vs symbolic layer",
      status: scenario.empiricalKernel && scenario.symbolicLayer ? "pass" : "caution",
      finding: "Name both layers separately before making the recommendation.",
    },
    {
      key: "demolition",
      label: "Demolition prohibition",
      status: structuralRisk ? "fail" : scenario.structuralChange ? "caution" : "pass",
      finding: structuralRisk ? "Structural change is not justified by Vastu alone." : "No Vastu-only demolition demand is present.",
    },
    {
      key: "costBenefit",
      label: "Cost-benefit screen",
      status: costFail ? "fail" : feasibility === "medium" ? "caution" : "pass",
      finding: costFail ? "Cost and disruption exceed the realistic benefit claim." : "Cost appears proportionate to the stated benefit.",
    },
    {
      key: "overclaim",
      label: "Modern over-claim refusal",
      status: overClaim ? "fail" : claimStrength === "strong" ? "caution" : "pass",
      finding: overClaim ? "This frames Vastu as a sole cause or guaranteed cure." : "The claim stays in contribution language.",
    },
  ];
}

export function finalVerdict(results: TestResult[]) {
  if (results.some((item) => item.status === "fail")) return "Revise before offering";
  if (results.some((item) => item.status === "caution")) return "Offer with caveats";
  return "Safe to offer";
}
