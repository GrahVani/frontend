import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { getDigitRegister, type VectorKey } from "../numerology-compatibility-calculator/data";

export type ChartStrength = "strong" | "mixed" | "weak";
export type AlignmentKind = "convergent-strong" | "convergent-weak" | "divergent-mixed" | "structural-divergence";

export interface IntegrationVector {
  key: VectorKey;
  label: string;
  shortLabel: string;
  chartReference: string;
  secondaryReference: string;
}

export interface VectorReading {
  key: VectorKey;
  digit: number;
  graha: string;
  slug: GrahaSlug;
  strength: ChartStrength;
  role: string;
  cue: string;
}

export interface AlignmentReading {
  kind: AlignmentKind;
  label: string;
  tone: "support" | "caution" | "mixed" | "structural";
  headline: string;
  explanation: string;
  practitionerLine: string;
}

export interface PresetProfile {
  id: string;
  label: string;
  mulanka: number;
  bhagyanka: number;
  namanka: number;
  strengths: Record<VectorKey, ChartStrength>;
}

export const INTEGRATION_VECTORS: IntegrationVector[] = [
  {
    key: "mulanka",
    label: "Mulanka",
    shortLabel: "Root",
    chartReference: "Natal mula-graha strength, house placement, aspects, and dasha context.",
    secondaryReference: "Lagna lord and ascendant-element register-fit.",
  },
  {
    key: "bhagyanka",
    label: "Bhagyanka",
    shortLabel: "Destiny",
    chartReference: "10th lord, Sun, Saturn, and Atmakaraka as destiny-vector indicators.",
    secondaryReference: "9th house, Jupiter, and karma-vector support.",
  },
  {
    key: "namanka",
    label: "Name-number",
    shortLabel: "Expression",
    chartReference: "Mercury, Venus, and the corresponding graha strength.",
    secondaryReference: "2nd and 3rd houses for speech, name, and expression.",
  },
];

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: "hook",
    label: "Hook chart: Mars challenged, Jupiter and Sun strong",
    mulanka: 9,
    bhagyanka: 3,
    namanka: 1,
    strengths: { mulanka: "weak", bhagyanka: "strong", namanka: "strong" },
  },
  {
    id: "convergent-strong",
    label: "All three personal registers well grounded",
    mulanka: 3,
    bhagyanka: 6,
    namanka: 5,
    strengths: { mulanka: "strong", bhagyanka: "strong", namanka: "strong" },
  },
  {
    id: "convergent-weak",
    label: "All three registers need conscious work",
    mulanka: 4,
    bhagyanka: 8,
    namanka: 7,
    strengths: { mulanka: "weak", bhagyanka: "weak", namanka: "weak" },
  },
  {
    id: "mixed",
    label: "Common mixed integration",
    mulanka: 2,
    bhagyanka: 5,
    namanka: 9,
    strengths: { mulanka: "mixed", bhagyanka: "strong", namanka: "weak" },
  },
];

export const STRUCTURAL_DIVERGENCE_OPTIONS = [
  { value: false, label: "Personal numbers mirror chart grahas" },
  { value: true, label: "Strong chart grahas are not in the three numbers" },
] as const;

export function buildVectorReading(key: VectorKey, digit: number, strength: ChartStrength): VectorReading {
  const register = getDigitRegister(digit);
  return {
    key,
    digit,
    graha: register.graha,
    slug: register.slug,
    strength,
    role: register.role,
    cue: register.cue,
  };
}

export function classifyAlignment(readings: VectorReading[], structuralDivergence: boolean): AlignmentReading {
  if (structuralDivergence) {
    return {
      kind: "structural-divergence",
      label: "Structural divergence",
      tone: "structural",
      headline: "The chart foundation and number registers do not have to mirror each other.",
      explanation: "Strong natal grahas can work through house, yoga, and dasha context even when they are not one of the three personal-number registers.",
      practitionerLine: "This is a mapping observation, not a problem label.",
    };
  }

  const strong = readings.filter((item) => item.strength === "strong").length;
  const weak = readings.filter((item) => item.strength === "weak").length;

  if (strong === readings.length) {
    return {
      kind: "convergent-strong",
      label: "Convergent strong",
      tone: "support",
      headline: "All three number registers have strong natal foundations.",
      explanation: "This is favourable register-fit. It supports expression, but it does not guarantee outcomes.",
      practitionerLine: "Name the support, then still read the whole chart.",
    };
  }

  if (weak === readings.length) {
    return {
      kind: "convergent-weak",
      label: "Convergent weak",
      tone: "caution",
      headline: "All three number registers need conscious integration.",
      explanation: "The chart context asks for care around the register shadows. This is not a curse or life-problem prediction.",
      practitionerLine: "Reframe weakness as integration work, not fear.",
    };
  }

  return {
    kind: "divergent-mixed",
    label: "Divergent mixed",
    tone: "mixed",
    headline: "The personal-number map is textured: some lanes support, some require work.",
    explanation: "This is the most common real-client pattern. Read each vector separately before synthesising.",
    practitionerLine: "Do not collapse three distinct cross-references into one verdict.",
  };
}

export function strengthLabel(strength: ChartStrength): string {
  if (strength === "strong") return "Strong chart support";
  if (strength === "weak") return "Weak chart foundation";
  return "Mixed chart context";
}

export function strengthShortLabel(strength: ChartStrength): string {
  if (strength === "strong") return "Strong";
  if (strength === "weak") return "Weak";
  return "Mixed";
}
