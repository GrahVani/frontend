export type ScenarioKey = "careerChart" | "movingClient" | "fullAudit" | "demolitionRequest" | "yantraUpsell" | "adversarial";
export type FlagGroundKey = "none" | "clientNamed" | "chartGround" | "lifeStage";
export type DepthKey = "contextual" | "fullAudit" | "construction" | "commercial";
export type RemedyTierKey = "architectural" | "symbolic" | "yantra" | "ritual";
export type DecisionMode = "flag" | "defer" | "refuse";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface Scenario extends Option<ScenarioKey> {
  prompt: string;
  defaultGround: FlagGroundKey;
  defaultDepth: DepthKey;
  defaultTier: RemedyTierKey;
  asksGuarantee: boolean;
  financialRisk: boolean;
  ethicalRisk: boolean;
  structuralDemand: boolean;
}

export interface DecisionStep {
  key: string;
  label: string;
  result: string;
  status: "pass" | "caution" | "stop";
}

export interface DecisionResult {
  mode: DecisionMode;
  title: string;
  practitionerLine: string;
  nextAction: string;
  steps: DecisionStep[];
  tierAdvice: string;
}

export const FLAG_GROUNDS: Option<FlagGroundKey>[] = [
  { key: "none", label: "No ground", note: "No client topic, chart warrant, or moving stage." },
  { key: "clientNamed", label: "Client named", note: "Housing, move, renovation, or property is already the question." },
  { key: "chartGround", label: "Chart ground", note: "4H, 4H lord, Mars/Saturn/Rahu, or residential finance factors warrant one question." },
  { key: "lifeStage", label: "Life-stage", note: "Move, marriage-home setup, child-arrival, purchase, or renovation is near." },
];

export const DEPTHS: Option<DepthKey>[] = [
  { key: "contextual", label: "Chart-context", note: "Brief Vastu mention inside an astrology session." },
  { key: "fullAudit", label: "Full audit", note: "Site visit, plan review, room-by-room judgement, and prescription." },
  { key: "construction", label: "Build plan", note: "Plot, orientation, plan, foundation, and specialist construction scope." },
  { key: "commercial", label: "Commercial", note: "Office, retail, temple, or specialist institutional Vastu." },
];

export const REMEDY_TIERS: Option<RemedyTierKey>[] = [
  { key: "architectural", label: "T1 Architectural", note: "Reversible orientation, light, ventilation, furniture, cleanliness." },
  { key: "symbolic", label: "T2 Symbolic", note: "Dik-pala, color, element balancing, water/fire/weight cues." },
  { key: "yantra", label: "T3 Yantra / pyramid", note: "Modern-practice layer, only with honest attribution and client request." },
  { key: "ritual", label: "T4 Ritual", note: "Puja or shanti as symbolic marking, not a guaranteed causal cure." },
];

export const SCENARIOS: Scenario[] = [
  {
    key: "careerChart",
    label: "Career consultation, Mars in 4H",
    note: "A chart clue appears inside a non-housing session.",
    prompt: "Client asks about career. You notice Mars in the 4H and a stressed 4H lord.",
    defaultGround: "chartGround",
    defaultDepth: "contextual",
    defaultTier: "architectural",
    asksGuarantee: false,
    financialRisk: false,
    ethicalRisk: false,
    structuralDemand: false,
  },
  {
    key: "movingClient",
    label: "Client is moving next month",
    note: "Housing is already live, but the question can stay scoped.",
    prompt: "Client says they are moving into an apartment and asks what to watch first.",
    defaultGround: "lifeStage",
    defaultDepth: "contextual",
    defaultTier: "architectural",
    asksGuarantee: false,
    financialRisk: false,
    ethicalRisk: false,
    structuralDemand: false,
  },
  {
    key: "fullAudit",
    label: "Full floor-plan audit request",
    note: "This exceeds Tier 1 literacy.",
    prompt: "Client asks for full plan review, room-by-room dosha list, and exact prescriptions.",
    defaultGround: "clientNamed",
    defaultDepth: "fullAudit",
    defaultTier: "symbolic",
    asksGuarantee: false,
    financialRisk: false,
    ethicalRisk: false,
    structuralDemand: false,
  },
  {
    key: "demolitionRequest",
    label: "Demolition endorsement",
    note: "The four-test screen fails.",
    prompt: "Client wants you to confirm a costly wall demolition for Vastu alone.",
    defaultGround: "clientNamed",
    defaultDepth: "fullAudit",
    defaultTier: "architectural",
    asksGuarantee: false,
    financialRisk: true,
    ethicalRisk: false,
    structuralDemand: true,
  },
  {
    key: "yantraUpsell",
    label: "Yantra sold as guaranteed cure",
    note: "A modern remedy is being over-claimed.",
    prompt: "Client asks whether a paid yantra will guarantee marriage or business results.",
    defaultGround: "clientNamed",
    defaultDepth: "contextual",
    defaultTier: "yantra",
    asksGuarantee: true,
    financialRisk: true,
    ethicalRisk: false,
    structuralDemand: false,
  },
  {
    key: "adversarial",
    label: "Adversarial Vastu request",
    note: "The request is unethical.",
    prompt: "Client asks how to arrange Vastu to harm a rival household or tenant.",
    defaultGround: "clientNamed",
    defaultDepth: "contextual",
    defaultTier: "ritual",
    asksGuarantee: false,
    financialRisk: false,
    ethicalRisk: true,
    structuralDemand: false,
  },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findScenario(key: ScenarioKey): Scenario {
  return SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];
}

export function evaluateDecision(
  scenario: Scenario,
  ground: FlagGroundKey,
  depth: DepthKey,
  tier: RemedyTierKey,
): DecisionResult {
  const needsSpecialist = depth === "fullAudit" || depth === "construction" || depth === "commercial";
  const mustRefuse = scenario.ethicalRisk || scenario.asksGuarantee || scenario.structuralDemand || scenario.financialRisk;
  const mayFlag = ground !== "none";
  const tierIndex = REMEDY_TIERS.findIndex((item) => item.key === tier);

  const steps: DecisionStep[] = [
    {
      key: "ground",
      label: "When to flag",
      result: mayFlag ? findOption(FLAG_GROUNDS, ground).note : "Absent-grounds: do not introduce Vastu.",
      status: mayFlag ? "pass" : "stop",
    },
    {
      key: "scope",
      label: "When to defer",
      result: needsSpecialist ? "This needs specialist Vastu depth, not Tier 1 chart literacy." : "Keep it chart-contextual and brief.",
      status: needsSpecialist ? "caution" : "pass",
    },
    {
      key: "refusal",
      label: "When to refuse",
      result: mustRefuse ? "Refuse or revise: guarantee, harm, demolition, or harmful cost is present." : "No refusal trigger is active.",
      status: mustRefuse ? "stop" : "pass",
    },
    {
      key: "cascade",
      label: "Remedy cascade",
      result: tierIndex <= 1 ? "Start low and reversible." : "Escalated tier needs client request plus honest attribution.",
      status: tierIndex <= 1 ? "pass" : "caution",
    },
  ];

  if (mustRefuse) {
    return {
      mode: "refuse",
      title: "Refuse or revise before proceeding",
      practitionerLine: "I cannot endorse that framing. Let us reduce it to a proportionate, ethical, non-guaranteed option.",
      nextAction: "Name the failed gate, offer a safer alternative, and preserve client agency.",
      tierAdvice: "Return to T1/T2 only if the client wants a modest, reversible support.",
      steps,
    };
  }

  if (needsSpecialist) {
    return {
      mode: "defer",
      title: "Defer to a Vastu specialist",
      practitionerLine: "This requires plan review or site depth beyond Tier 1 Vastu literacy.",
      nextAction: "Give the chart-contextual note, then refer for site-visit or specialist plan review.",
      tierAdvice: "Do not prescribe final tiers; describe the cascade the specialist should consider.",
      steps,
    };
  }

  if (!mayFlag) {
    return {
      mode: "refuse",
      title: "Do not raise Vastu here",
      practitionerLine: "Vastu is outside the client agenda in this consultation.",
      nextAction: "Continue the stated reading; keep the observation internal unless a proper ground appears.",
      tierAdvice: "No remedy discussion is warranted.",
      steps,
    };
  }

  return {
    mode: "flag",
    title: "Flag gently, then stay scoped",
    practitionerLine: ground === "chartGround" ? "I notice one home-context indicator; is housing currently on your mind?" : "Since housing is in scope, we can add a brief Vastu lens.",
    nextAction: "Use contribution language, avoid guarantees, and begin with reversible T1 adjustments.",
    tierAdvice: tierIndex === 0 ? "Correct: T1 is the default first move." : "Acceptable only after T1 is considered and the claim stays modest.",
    steps,
  };
}
