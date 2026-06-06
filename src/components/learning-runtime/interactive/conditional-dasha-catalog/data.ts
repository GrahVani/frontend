import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type ConditionalDashaKind = "varies" | "fixed";

export interface ConditionalDasha {
  index: number;
  name: string;
  devanagari: string;
  cycle: string;
  cycleYears: number | null;
  kind: ConditionalDashaKind;
  nameEncoding: string;
  note: string;
  conditionFrame: string;
  color: string;
  tint: string;
}

export const CONDITIONAL_DASHAS: ConditionalDasha[] = [
  {
    index: 1,
    name: "Shula",
    devanagari: "शूल",
    cycle: "varies",
    cycleYears: null,
    kind: "varies",
    nameEncoding: "No fixed number in the name",
    note: "Sign-based, special condition.",
    conditionFrame: "Consider only when its special Parashara condition is met.",
    color: grahas.mangala.primary,
    tint: grahas.mangala.secondaryTint,
  },
  {
    index: 2,
    name: "Manduka",
    devanagari: "मण्डूक",
    cycle: "varies",
    cycleYears: null,
    kind: "varies",
    nameEncoding: "Frog-like movement, not a cycle-number name",
    note: "Known for a jumping pattern.",
    conditionFrame: "Condition-gated; not a routine dasha for every chart.",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
  },
  {
    index: 3,
    name: "Cakra",
    devanagari: "चक्र",
    cycle: "varies",
    cycleYears: null,
    kind: "varies",
    nameEncoding: "Wheel-pattern name",
    note: "A wheel-pattern conditional system.",
    conditionFrame: "Use only after the relevant textual condition is confirmed.",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    index: 4,
    name: "Caturasiti-Sama",
    devanagari: "चतुराशीति-समा",
    cycle: "84 years",
    cycleYears: 84,
    kind: "fixed",
    nameEncoding: "Caturasiti means eighty-four",
    note: "An equal-period 84-year system.",
    conditionFrame: "Fixed cycle, still conditional in applicability.",
    color: grahas.surya.primary,
    tint: grahas.surya.secondaryTint,
  },
  {
    index: 5,
    name: "Dvadasottari",
    devanagari: "द्वादशोत्तरी",
    cycle: "112 years",
    cycleYears: 112,
    kind: "fixed",
    nameEncoding: "Dvadasa-uttari points to 12 added to 100",
    note: "A 112-year conditional cycle.",
    conditionFrame: "Consult only when its qualifying condition is met.",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
  },
  {
    index: 6,
    name: "Shatabdika",
    devanagari: "शताब्दिका",
    cycle: "100 years",
    cycleYears: 100,
    kind: "fixed",
    nameEncoding: "Shata means one hundred",
    note: "The centennial system; do not mislabel it as Dashottari.",
    conditionFrame: "The 100-year name is a recognition anchor, not permission to use it routinely.",
    color: grahas.shukra.primary,
    tint: grahas.shukra.secondaryTint,
  },
  {
    index: 7,
    name: "Shashti-hayani",
    devanagari: "षष्टि-हायनी",
    cycle: "60 years",
    cycleYears: 60,
    kind: "fixed",
    nameEncoding: "Shashti means sixty",
    note: "Reflects the 60-year Jovian cycle.",
    conditionFrame: "Recognise the cycle; verify the condition before use.",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
  },
];

export function fixedCycleDashas() {
  return CONDITIONAL_DASHAS.filter((dasha) => dasha.kind === "fixed");
}

export function varyingCycleDashas() {
  return CONDITIONAL_DASHAS.filter((dasha) => dasha.kind === "varies");
}

export function getConditionalDasha(index: number) {
  return CONDITIONAL_DASHAS.find((dasha) => dasha.index === index) ?? CONDITIONAL_DASHAS[0];
}
