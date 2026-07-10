/**
 * Two-Yes Checker — Data Layer
 *
 * §7 interactive for Lesson 10.4.3 (The Two-Yes Principle — Introductory).
 *
 * Models independent indicators as groups: toggling any indicator within a
 * group counts as one "yes". Two *different* groups active = reliable.
 * The false-double demo shows two differently-worded indicators sharing one
 * group — both on still counts as a single yes.
 */

export interface PredictiveQuestion {
  id: string;
  label: string;
  labelIAST: string;
  houses: string;
  domain: string;
}

export interface IndicatorGroup {
  id: string;
  label: string;
  description: string;
}

export interface Indicator {
  id: string;
  groupId: string;
  label: string;
  description: string;
  isFalseDouble?: boolean;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  questionId: string;
  activeIds: string[];
  note: string;
  expectedCount: number;
  expectedVerdict: "reliable" | "uncertain" | "none";
}

export type ReliabilityVerdict = "reliable" | "uncertain" | "none";

/* ─── Predictive questions ─────────────────────────────────────────────── */

export const QUESTIONS: PredictiveQuestion[] = [
  {
    id: "marriage",
    label: "Marriage / partnership",
    labelIAST: "Vivāha",
    houses: "7th",
    domain: "relationships",
  },
  {
    id: "career",
    label: "Career / status",
    labelIAST: "Karma",
    houses: "10th",
    domain: "work",
  },
  {
    id: "wealth",
    label: "Wealth / gains",
    labelIAST: "Dhana",
    houses: "2nd & 11th",
    domain: "finance",
  },
  {
    id: "health",
    label: "Health / vitality",
    labelIAST: "Ārogya",
    houses: "1st & 6th",
    domain: "health",
  },
  {
    id: "spirituality",
    label: "Spirituality / dharma",
    labelIAST: "Dharma",
    houses: "9th & 12th",
    domain: "spirituality",
  },
];

/* ─── Indicator groups (independent categories) ────────────────────────── */

export const INDICATOR_GROUPS: Record<string, IndicatorGroup> = {
  ownership: {
    id: "ownership",
    label: "House ownership",
    description: "The daśā-lord rules the house relevant to the question.",
  },
  aspect: {
    id: "aspect",
    label: "House aspect",
    description: "The daśā-lord aspects the relevant house by planetary aspect.",
  },
  occupation: {
    id: "occupation",
    label: "House occupation",
    description: "The daśā-lord occupies the relevant house.",
  },
  transit: {
    id: "transit",
    label: "Transit activation",
    description: "The daśā-lord is in gochara (transit) over a sensitive point.",
  },
  bhukti: {
    id: "bhukti",
    label: "Bhukti support",
    description: "The bhukti-lord is friendly to the daśā-lord (bhukti-yoga).",
  },
  cluster: {
    id: "cluster",
    label: "Kāraka cluster",
    description: "Multiple natural significators of the matter activate together.",
  },
  dignity: {
    id: "dignity",
    label: "Lord dignity",
    description: "The daśā-lord is well-dignified (exalted, own sign, or functional benefic).",
  },
};

/**
 * Indicator toggles.
 *
 * Each indicator belongs to exactly one group. Toggling ANY indicator in a
 * group counts as one yes for that group. Two indicators in the SAME group
 * (the false-double pair) demonstrate that restating one fact does not add
 * a second yes.
 */

export function getIndicators(question: PredictiveQuestion): Indicator[] {
  const h = question.houses;
  return [
    {
      id: `${question.id}-ownership-1`,
      groupId: "ownership",
      label: `Lord rules the ${h} house`,
      description: "House-lordship = ownership of the domain.",
    },
    {
      id: `${question.id}-ownership-2`,
      groupId: "ownership",
      label: `Lord is the ${h}-lord`,
      description: "Same fact, restated — still one indicator.",
      isFalseDouble: true,
    },
    {
      id: `${question.id}-aspect`,
      groupId: "aspect",
      label: `Lord aspects the ${h} house`,
      description: "Planetary aspect onto the relevant house.",
    },
    {
      id: `${question.id}-occupation`,
      groupId: "occupation",
      label: `Lord occupies the ${h} house`,
      description: "Physical presence in the relevant house.",
    },
    {
      id: `${question.id}-transit`,
      groupId: "transit",
      label: `Lord in transit over ${h} cusp`,
      description: "Gochara activation of the sensitive point.",
    },
    {
      id: `${question.id}-bhukti`,
      groupId: "bhukti",
      label: "Bhukti-lord supports MD-lord",
      description: "Friendly bhukti-yoga reinforces the daśā theme.",
    },
    {
      id: `${question.id}-cluster`,
      groupId: "cluster",
      label: `Multiple ${question.domain} karakas converge`,
      description: "Natural significators of the matter activate together.",
    },
    {
      id: `${question.id}-dignity`,
      groupId: "dignity",
      label: "Lord is well-dignified / functional benefic",
      description: "Strength and benefic nature of the period-lord.",
    },
  ];
}

/* ─── Reliability engine ───────────────────────────────────────────────── */

export function computeReliability(
  activeIds: Set<string>,
  indicators: Indicator[]
): {
  activeGroups: Set<string>;
  count: number;
  verdict: ReliabilityVerdict;
  falseDoublesActive: boolean;
} {
  const activeGroups = new Set<string>();
  let falseDoublesActive = false;

  for (const ind of indicators) {
    if (activeIds.has(ind.id)) {
      activeGroups.add(ind.groupId);
      if (ind.isFalseDouble) {
        // Check if its partner in the same group is also active
        const partner = indicators.find(
          (i) => i.groupId === ind.groupId && i.id !== ind.id && activeIds.has(i.id)
        );
        if (partner) falseDoublesActive = true;
      }
    }
  }

  const count = activeGroups.size;
  const verdict: ReliabilityVerdict =
    count >= 2 ? "reliable" : count === 1 ? "uncertain" : "none";

  return { activeGroups, count, verdict, falseDoublesActive };
}

/* ─── Scenario presets ─────────────────────────────────────────────────── */

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "one-yes",
    label: "One yes (uncertain)",
    questionId: "marriage",
    activeIds: ["marriage-dignity"],
    note: "Only the lord's dignity is favourable — no second independent indicator.",
    expectedCount: 1,
    expectedVerdict: "uncertain",
  },
  {
    id: "two-yes",
    label: "Two independent yeses (reliable)",
    questionId: "marriage",
    activeIds: ["marriage-ownership-1", "marriage-transit"],
    note: "Lord rules the 7th AND is in transit over it — two genuinely different lines of evidence.",
    expectedCount: 2,
    expectedVerdict: "reliable",
  },
  {
    id: "false-double",
    label: "False double (still one)",
    questionId: "marriage",
    activeIds: ["marriage-ownership-1", "marriage-ownership-2"],
    note: '"Rules the 7th" and "is the 7th-lord" are the SAME fact restated — still counts as one indicator.',
    expectedCount: 1,
    expectedVerdict: "uncertain",
  },
  {
    id: "triple",
    label: "Three yeses (strong)",
    questionId: "career",
    activeIds: ["career-ownership-1", "career-occupation", "career-dignity"],
    note: "Lord rules the 10th, occupies it, AND is well-dignified — strong convergence.",
    expectedCount: 3,
    expectedVerdict: "reliable",
  },
  {
    id: "cluster-plus",
    label: "Cluster + ownership (reliable)",
    questionId: "wealth",
    activeIds: ["wealth-ownership-1", "wealth-cluster"],
    note: "Lord rules the 2nd/11th AND multiple wealth-karakas converge — two independent yeses.",
    expectedCount: 2,
    expectedVerdict: "reliable",
  },
];
