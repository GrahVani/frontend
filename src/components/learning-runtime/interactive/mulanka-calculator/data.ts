/**
 * Engine for Lesson 21.3.1 — Mūlāṅka calculator.
 *
 * Implements birth-day-to-Mūlāṅka computation under strict-preservation
 * and flexibility conventions, plus graha-aṅka registers and caveats.
 */

export type Convention = "strict" | "flexible";

export interface GrahaRegister {
  digit: number;
  graha: string;
  devanagari: string;
  caveat?: string;
}

export const GRAHA_REGISTERS: Record<number, GrahaRegister> = {
  1: { digit: 1, graha: "Sūrya", devanagari: "सूर्य" },
  2: { digit: 2, graha: "Candra", devanagari: "चन्द्र" },
  3: { digit: 3, graha: "Guru", devanagari: "गुरु" },
  4: { digit: 4, graha: "Rāhu", devanagari: "राहु", caveat: "Rāhu shadow-graha caveat — refuse cursed / destined-for-disasters / spiritually-deficient fear-induction patterns." },
  5: { digit: 5, graha: "Budha", devanagari: "बुध" },
  6: { digit: 6, graha: "Śukra", devanagari: "शुक्र" },
  7: { digit: 7, graha: "Ketu", devanagari: "केतु", caveat: "Ketu shadow-graha caveat — refuse spiritually-cursed / disconnected / must-change-Mūlāṅka-to-gain-warmth fear-induction patterns." },
  8: { digit: 8, graha: "Śani", devanagari: "शनि", caveat: "Śani kruratama + Sade-Sati conflation caveat — refuse deterministic punishment / lifelong-delay framings." },
  9: { digit: 9, graha: "Maṅgala", devanagari: "मङ्गल", caveat: "Conscious-channeling reframe — use Maṅgala energy purposefully; refuse all-shadows aggression framings." },
};

export interface MasterRegister {
  master: number;
  baseDigit: number;
  baseGraha: string;
  label: string;
  caveat: string;
}

export const MASTER_REGISTERS: Record<number, MasterRegister> = {
  11: {
    master: 11,
    baseDigit: 2,
    baseGraha: "Candra",
    label: "Master Intuitive",
    caveat: "Master-number SPECIAL over-claim refusal — refuse cosmically-chosen / advanced-by-default framings; intensified-amplitude Candra-2.",
  },
  22: {
    master: 22,
    baseDigit: 4,
    baseGraha: "Rāhu",
    label: "Master Builder",
    caveat: "Compounded Rāhu + master-SPECIAL caveat — refuse both cursed framings and cosmically-chosen-for-construction framings; conscious-integration critical.",
  },
};

export interface ComputationResult {
  day: number;
  digitSum: number;
  strictResult: number;
  flexibleResult: number;
  steps: string[];
}

export function computeMulanka(day: number): ComputationResult {
  const digits = day.toString().split("").map(Number);
  const digitSum = digits.reduce((a, b) => a + b, 0);

  let strictResult: number;
  let flexibleResult: number;
  const steps: string[] = [];

  steps.push(`Birth-day = ${day}.`);
  steps.push(`Sum digits: ${digits.join(" + ")} = ${digitSum}.`);

  // Single-digit days
  if (day >= 1 && day <= 9) {
    strictResult = day;
    flexibleResult = day;
    steps.push(`Single-digit day: Mūlāṅka = ${day} directly; no reduction needed.`);
  }
  // Master days 11, 22
  else if (day === 11 || day === 22) {
    strictResult = day;
    flexibleResult = digitSum;
    steps.push(`Direct master-day: strict-preservation keeps Master ${day}; flexibility reduces to ${digitSum}.`);
  }
  // Day 29 -> 11 -> master or 2
  else if (day === 29) {
    strictResult = 11;
    flexibleResult = 2;
    steps.push(`Intermediate sum ${digitSum} is a master number.`);
    steps.push(`Strict-preservation: keep Master 11; flexibility: 1+1 = 2.`);
  }
  // Other double-digit days
  else {
    let reduced = digitSum;
    if (digitSum >= 10 && digitSum !== 11 && digitSum !== 22 && digitSum !== 33) {
      const sumDigits = digitSum.toString().split("").map(Number);
      reduced = sumDigits.reduce((a, b) => a + b, 0);
      steps.push(`Intermediate sum ${digitSum} is not a master; reduce: ${sumDigits.join(" + ")} = ${reduced}.`);
    } else {
      steps.push(`Intermediate sum ${digitSum} is a single-digit or master; no further reduction under flexibility.`);
    }
    strictResult = reduced;
    flexibleResult = reduced;
  }

  return { day, digitSum, strictResult, flexibleResult, steps };
}

export function getResultForConvention(result: ComputationResult, convention: Convention): number {
  return convention === "strict" ? result.strictResult : result.flexibleResult;
}

export function getRegister(result: number): GrahaRegister | MasterRegister | null {
  if (result >= 1 && result <= 9) return GRAHA_REGISTERS[result];
  if (result === 11 || result === 22) return MASTER_REGISTERS[result];
  return null;
}

export interface DayReferenceRow {
  day: number;
  flexible: number;
  graha: string;
  strictAlternate: string;
}

export const DAY_REFERENCE_TABLE: DayReferenceRow[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const result = computeMulanka(day);
  const flexible = result.flexibleResult;
  const strictAlt = result.strictResult !== flexible ? `Master ${result.strictResult}` : "—";
  const register = getRegister(flexible);
  return {
    day,
    flexible,
    graha: register ? ("graha" in register ? register.graha : register.baseGraha) : "—",
    strictAlternate: strictAlt,
  };
});

export interface WorkedExample {
  id: number;
  client: string;
  day: number;
  computation: string;
  strictResult: number;
  flexibleResult: number;
  register: string;
  caveats: string[];
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 1,
    client: "Client A",
    day: 5,
    computation: "Day already single-digit",
    strictResult: 5,
    flexibleResult: 5,
    register: "Budha (Mercury)",
    caveats: ["Standard multivalent reading per Lesson 21.2.1"],
  },
  {
    id: 2,
    client: "Client B",
    day: 13,
    computation: "1 + 3 = 4",
    strictResult: 4,
    flexibleResult: 4,
    register: "Rāhu (north lunar node)",
    caveats: ["Rāhu shadow-graha caveat — refuse cursed / destined-for-disasters / spiritually-deficient fear-induction patterns"],
  },
  {
    id: 3,
    client: "Client C",
    day: 22,
    computation: "Direct master-day",
    strictResult: 22,
    flexibleResult: 4,
    register: "Strict: Master Builder (intensified Rāhu); Flexibility: Rāhu",
    caveats: [
      "Strict: compounded Rāhu + master-SPECIAL over-claim refusal",
      "Flexibility: standard Rāhu shadow-graha caveat",
    ],
  },
  {
    id: 4,
    client: "Client D",
    day: 29,
    computation: "2 + 9 = 11; strict preserves Master 11, flexibility reduces to 2",
    strictResult: 11,
    flexibleResult: 2,
    register: "Strict: Master Intuitive (intensified Candra); Flexibility: Candra",
    caveats: [
      "Strict: master-number SPECIAL over-claim refusal",
      "Flexibility: standard Candra multivalent reading",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Compute the Mūlāṅka",
    text: "Take the birth-day-of-month (1-31). Sum its digits. Reduce to single-digit (1-9) or preserve master-number 11/22 per chosen convention.",
  },
  {
    title: "Identify the graha-aṅka register",
    text: "Map the result to its graha: 1=Sūrya, 2=Candra, 3=Guru, 4=Rāhu, 5=Budha, 6=Śukra, 7=Ketu, 8=Śani, 9=Maṅgala. Master 11 intensifies Candra; Master 22 intensifies Rāhu.",
  },
  {
    title: "Articulate strengths AND shadows",
    text: "Read the register multivalently per Lesson 21.2.1. Refuse all-strengths AND all-shadows single-direction readings.",
  },
  {
    title: "Apply specific caveats",
    text: "Rāhu (4), Ketu (7), Śani (8), Maṅgala (9) shadow-graha caveats; master-number SPECIAL over-claim refusal for 11/22.",
  },
  {
    title: "Refuse over-claim framings",
    text: "No single-factor causal attribution. Mūlāṅka is one ambient-context factor in a multifactorial life; determinism is over-claim.",
  },
];
