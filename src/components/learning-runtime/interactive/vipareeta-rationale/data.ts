/**
 * Vipareeta Rationale — Data Engine
 *
 * §7 interactive for Lesson 14.5.3 (The Vipareeta Doctrine: Adversity Adversed).
 *
 * Illustrates the spoiler-of-spoiler logic and its honest limits.
 */

export type YogaKey = "harsha" | "sarala" | "vimala";

export interface YogaInfo {
  key: YogaKey;
  nameIAST: string;
  nameDevanagari: string;
  lordHouse: number;
  lordName: string;
  grahaSlug: string;
  flavor: string;
  struggle: string;
  benefit: string;
  color: string;
}

export const YOGAS: YogaInfo[] = [
  {
    key: "harsha",
    nameIAST: "Harṣa",
    nameDevanagari: "हर्ष",
    lordHouse: 6,
    lordName: "6th lord",
    grahaSlug: "mangala",
    flavor: "Victory over enemies, health, competitive success",
    struggle: "Must face rivals and obstacles head-on; success comes after confrontation, not avoidance.",
    benefit: "The enemy-lord's malice is turned against a harmful house — enemies undermine themselves.",
    color: "#C84A3E",
  },
  {
    key: "sarala",
    nameIAST: "Sarala",
    nameDevanagari: "सरल",
    lordHouse: 8,
    lordName: "8th lord",
    grahaSlug: "shani",
    flavor: "Longevity, fearlessness, resilience through crises",
    struggle: "Crises and upheavals still occur; the native endures them and emerges stronger.",
    benefit: "The crisis-lord's destructiveness is absorbed by another dusthana — crises cancel each other out.",
    color: "#5A5A6E",
  },
  {
    key: "vimala",
    nameIAST: "Vimala",
    nameDevanagari: "विमल",
    lordHouse: 12,
    lordName: "12th lord",
    grahaSlug: "guru",
    flavor: "Frugality, independence, freedom from loss",
    struggle: "Losses and expenses happen; the native learns to live with less and finds freedom through detachment.",
    benefit: "The loss-lord's drain is directed into another dusthana — loss undermines loss, leaving purity behind.",
    color: "#C8A456",
  },
];

export type StrengthLevel = "strong" | "moderate" | "weak";
export type TimingLevel = "active" | "moderate" | "quiet";

export interface ScenarioResult {
  outcome: "transformative" | "noticeable" | "muted" | "potential-only";
  outcomeLabel: string;
  outcomeColor: string;
  description: string;
  struggleNote: string;
  deliveryNote: string;
}

export function evaluateScenario(
  yogaKey: YogaKey,
  strength: StrengthLevel,
  timing: TimingLevel,
): ScenarioResult {
  const yoga = YOGAS.find((y) => y.key === yogaKey)!;

  // Matrix: strength × timing → outcome
  const matrix: Record<StrengthLevel, Record<TimingLevel, ScenarioResult>> = {
    strong: {
      active: {
        outcome: "transformative",
        outcomeLabel: "Transformative",
        outcomeColor: "#2F7D55",
        description: `A strong ${yoga.nameIAST} yoga during an active daśā can produce remarkable, life-altering results — the classic "rise after adversity."`,
        struggleNote: yoga.struggle,
        deliveryNote: "The path runs through hardship, but the outcome is genuinely powerful.",
      },
      moderate: {
        outcome: "noticeable",
        outcomeLabel: "Noticeable",
        outcomeColor: "#2F7D55",
        description: `Strong ${yoga.nameIAST} with moderate timing delivers clear benefits, though not at peak intensity.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Timing is supportive but not peak; the yoga still expresses well.",
      },
      quiet: {
        outcome: "potential-only",
        outcomeLabel: "Potential only",
        outcomeColor: "#C8841E",
        description: `The ${yoga.nameIAST} yoga is structurally strong, but quiet timing means it lies dormant — waiting for the right daśā to activate.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Potential is real, but the clock has not yet struck. Do not promise what time has not delivered.",
      },
    },
    moderate: {
      active: {
        outcome: "noticeable",
        outcomeLabel: "Noticeable",
        outcomeColor: "#C8841E",
        description: `Moderate-strength ${yoga.nameIAST} with active timing produces moderate benefits — the struggle is real, the gain is decent.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Neither extraordinary nor negligible — a solid, workaday vipareeta benefit.",
      },
      moderate: {
        outcome: "muted",
        outcomeLabel: "Muted",
        outcomeColor: "#C8841E",
        description: `Moderate ${yoga.nameIAST} with moderate timing delivers a background hum of support — felt but not dramatic.`,
        struggleNote: yoga.struggle,
        deliveryNote: "The yoga is present but neither strong nor well-timed; temper expectations.",
      },
      quiet: {
        outcome: "potential-only",
        outcomeLabel: "Potential only",
        outcomeColor: "#8A7E5E",
        description: `Moderate ${yoga.nameIAST} in quiet timing is largely inactive — a faint structural promise with little current expression.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Mention it as a background pattern, not a present active force.",
      },
    },
    weak: {
      active: {
        outcome: "muted",
        outcomeLabel: "Muted",
        outcomeColor: "#A23A1E",
        description: `Even with active timing, a weak ${yoga.nameIAST} yoga underdelivers — the spoiler mechanism is present but feeble.`,
        struggleNote: yoga.struggle,
        deliveryNote: "The native may experience the struggle without the compensating benefit. Do not over-promise.",
      },
      moderate: {
        outcome: "muted",
        outcomeLabel: "Muted",
        outcomeColor: "#A23A1E",
        description: `Weak ${yoga.nameIAST} with moderate timing produces very little — the structural pattern is too faint to matter much.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Acknowledge the pattern, but keep it in the background of your reading.",
      },
      quiet: {
        outcome: "potential-only",
        outcomeLabel: "Barely present",
        outcomeColor: "#8A7E5E",
        description: `A weak ${yoga.nameIAST} yoga in quiet timing is essentially dormant — the chart carries the pattern, but it is unlikely to express meaningfully.`,
        struggleNote: yoga.struggle,
        deliveryNote: "Do not build a reading around this. Mention it only as a faint structural note.",
      },
    },
  };

  return matrix[strength][timing];
}
