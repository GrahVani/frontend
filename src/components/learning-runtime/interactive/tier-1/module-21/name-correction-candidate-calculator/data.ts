/**
 * Engine for Lesson 21.4.2 — Name-Correction Candidate Calculator.
 *
 * Computes current Name-Number + candidate spelling-variation Name-Numbers,
 * evaluates graha-compatibility with Mūlāṅka / Bhāgyāṅka, and supports the
 * six-step name-correction computation workflow.
 */

import {
  computeNameNumber,
  getNameResultForConvention,
  getRegister,
  systemShortLabel,
  type NumerologySystem,
  type Convention,
} from "../mulanka-bhagyanka-namanka-calculator/data";
import {
  computeBhagyanka,
  getResultForConvention as getBhagyankaResult,
} from "../bhagyanka-calculator/data";

export type { NumerologySystem, Convention };

export interface CandidateResult {
  name: string;
  totalSum: number;
  strictResult: number;
  flexibleResult: number;
  finalResult: number;
  registerName: string;
  registerDetail: string;
}

export interface CompatibilityResult {
  withMulanka: "friend" | "enemy" | "neutral";
  withBhagyanka: "friend" | "enemy" | "neutral";
}

// Classical Parāśari graha-friendship framework (simplified for numerology)
// 1=Sūrya, 2=Candra, 3=Guru, 4=Rāhu, 5=Budha, 6=Śukra, 7=Ketu, 8=Śani, 9=Maṅgala
const GRAHA_FRIENDS: Record<number, number[]> = {
  1: [2, 3, 9],
  2: [1, 5],
  3: [1, 2, 9],
  4: [5, 6, 8],
  5: [1, 6],
  6: [5, 8],
  7: [5, 6, 8],
  8: [5, 6],
  9: [1, 2, 3],
};

const GRAHA_ENEMIES: Record<number, number[]> = {
  1: [8, 6],
  2: [],
  3: [5, 6],
  4: [1, 2],
  5: [2],
  6: [1, 2],
  7: [1, 2],
  8: [1, 2, 9],
  9: [5],
};

export function grahaCompatibility(a: number, b: number): "friend" | "enemy" | "neutral" {
  if (a === b) return "friend"; // same-graha identity treated as friendly
  if (GRAHA_FRIENDS[a]?.includes(b)) return "friend";
  if (GRAHA_ENEMIES[a]?.includes(b)) return "enemy";
  return "neutral";
}

export function compatibilityLabel(result: CompatibilityResult): string {
  const parts: string[] = [];
  parts.push(`Mūlāṅka: ${result.withMulanka}`);
  parts.push(`Bhāgyāṅka: ${result.withBhagyanka}`);
  return parts.join("; ");
}

export function computeCandidate(
  name: string,
  system: NumerologySystem,
  convention: Convention
): CandidateResult | null {
  const nameResult = computeNameNumber(name, system, convention);
  if (nameResult.values.length === 0) return null;
  const finalResult = getNameResultForConvention(nameResult, convention);
  const register = getRegister(finalResult);
  const registerName = register ? ("graha" in register ? register.graha : register.baseGraha) : "—";
  const registerDetail = register
    ? "graha" in register
      ? `Digit ${register.digit}`
      : `Master ${register.master} intensifies ${register.baseGraha}`
    : "—";
  return {
    name,
    totalSum: nameResult.totalSum,
    strictResult: nameResult.strictResult,
    flexibleResult: nameResult.flexibleResult,
    finalResult,
    registerName,
    registerDetail,
  };
}

export function evaluateCandidateCompatibility(
  candidate: CandidateResult,
  mulanka: number | null,
  bhagyanka: number | null
): CompatibilityResult {
  return {
    withMulanka: mulanka !== null ? grahaCompatibility(candidate.finalResult, mulanka) : "neutral",
    withBhagyanka: bhagyanka !== null ? grahaCompatibility(candidate.finalResult, bhagyanka) : "neutral",
  };
}

export function computeMulanka(day: number): number {
  if (day >= 1 && day <= 9) return day;
  const s = day.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  if (s === 11 || s === 22) {
    return s.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return s >= 10 ? s.toString().split("").map(Number).reduce((a, b) => a + b, 0) : s;
}

export function computePersonalBhagyanka(day: number, month: number, year: number, convention: Convention): number | null {
  try {
    const result = computeBhagyanka(day, month, year);
    return getBhagyankaResult(result, convention);
  } catch {
    return null;
  }
}

export const GRAHA_FRIENDSHIP_TABLE = [
  { digit: 1, graha: "Sūrya", friends: "Candra (2), Guru (3), Maṅgala (9)", enemies: "Śani (8), Śukra (6)", neutral: "Budha (5)" },
  { digit: 2, graha: "Candra", friends: "Sūrya (1), Budha (5)", enemies: "—", neutral: "Maṅgala (9), Guru (3), Śukra (6), Śani (8)" },
  { digit: 3, graha: "Guru", friends: "Sūrya (1), Candra (2), Maṅgala (9)", enemies: "Budha (5), Śukra (6)", neutral: "Śani (8)" },
  { digit: 4, graha: "Rāhu", friends: "Budha (5), Śukra (6), Śani (8)", enemies: "Sūrya (1), Candra (2)", neutral: "Maṅgala (9), Guru (3)" },
  { digit: 5, graha: "Budha", friends: "Sūrya (1), Śukra (6)", enemies: "Candra (2)", neutral: "Maṅgala (9), Guru (3), Śani (8)" },
  { digit: 6, graha: "Śukra", friends: "Budha (5), Śani (8)", enemies: "Sūrya (1), Candra (2)", neutral: "Maṅgala (9), Guru (3)" },
  { digit: 7, graha: "Ketu", friends: "Budha (5), Śukra (6), Śani (8)", enemies: "Sūrya (1), Candra (2)", neutral: "Maṅgala (9), Guru (3)" },
  { digit: 8, graha: "Śani", friends: "Budha (5), Śukra (6)", enemies: "Sūrya (1), Candra (2), Maṅgala (9)", neutral: "Guru (3)" },
  { digit: 9, graha: "Maṅgala", friends: "Sūrya (1), Candra (2), Guru (3)", enemies: "Budha (5)", neutral: "Śani (8), Śukra (6)" },
];

export const COMMON_VARIATION_PATTERNS = [
  { pattern: "Vowel-doubling / un-doubling", examples: "Anita ↔ Aneeta; Reka ↔ Reeka" },
  { pattern: "Alternate vowel-spellings (same phoneme)", examples: "Priya ↔ Preeya; Manish ↔ Maneesh" },
  { pattern: "Adding/removing silent letters", examples: "Anil ↔ Anill; Karan ↔ Karann" },
  { pattern: "Alternate consonant-spellings (same phoneme)", examples: "Krishna ↔ Krishnaa" },
  { pattern: "Transliteration variants", examples: "Ananda ↔ Anand; Vasudeva ↔ Vāsudeva" },
];

export interface WorkedExample {
  id: number;
  label: string;
  currentName: string;
  system: NumerologySystem;
  convention: Convention;
  candidates: string[];
  mulanka: number;
  bhagyanka: number;
  notes: string[];
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 1,
    label: "§1 hook client — Priya Sharma vs Pria Sharma",
    currentName: "Priya Devi",
    system: "vedic-hybrid",
    convention: "strict",
    candidates: ["Priya Sharma", "Pria Sharma"],
    mulanka: 6,
    bhagyanka: 33,
    notes: [
      "Current Name-Number (Priya Devi): 29 -> 11 (Master 11 / Candra).",
      "Priya Sharma: 29 -> 11 (Candra). Pria Sharma: 28 -> 1 (Sūrya).",
      "Both Candra and Sūrya are enemy-grahas to Śukra (Mūlāṅka/Bhāgyāṅka). Neither optimises graha-compatibility.",
      "Discipline-compliant framing: compatibility is chart-context input, not life-outcome determinant.",
    ],
  },
  {
    id: 2,
    label: "Generating candidates for Sunita Verma",
    currentName: "Sunita Sharma",
    system: "vedic-hybrid",
    convention: "flexible",
    candidates: ["Sunita Verma", "Suneeta Verma", "Sunitha Verma"],
    mulanka: 4,
    bhagyanka: 7,
    notes: [
      "Current Name-Number (Sunita Sharma): 36 -> 9 (Maṅgala).",
      "Target MITRA registers for Rāhu (4) + Ketu (7): Budha (5), Śukra (6), Śani (8).",
      "Generated candidates don't reach target; several produce Ketu-7 or Candra-2.",
      "Honest limitation: phonetic-preserving variants may not always hit the ideal target register.",
    ],
  },
  {
    id: 3,
    label: "Cross-system difference for Pria Sharma",
    currentName: "Pria Sharma",
    system: "pythagorean",
    convention: "flexible",
    candidates: ["Pria Sharma"],
    mulanka: 6,
    bhagyanka: 6,
    notes: [
      "Pythagorean: P(7)+R(9)+I(9)+A(1) + S(1)+H(8)+A(1)+R(9)+M(4)+A(1) = 50 -> 5 (Budha).",
      "Same name under Chaldean produces 1 (Sūrya). Different systems -> different Name-Numbers.",
      "Present under ONE chosen system; do not mix systems within the same candidate-set.",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Pre-requisite: rationale-evaluation confirmed",
    text: "Lesson 21.4.1 must confirm legitimate convergent grounds (categories 1-5) before computation. Computing without gating is the commercial-numerologist failure mode.",
  },
  {
    title: "Step 1 — Compute current Name-Number",
    text: "Apply Lesson 21.3.3 procedure under the chosen system + name-choice convention. Record current Name-Number + graha-aṅka register + caveats.",
  },
  {
    title: "Step 2 — Identify vibrational-target register",
    text: "Consider graha-compatibility with Mūlāṅka/Bhāgyāṅka, multivalent register fit, chart-context, client-preference, and refuse *compatibility-determines-outcome* over-claim.",
  },
  {
    title: "Step 3 — Generate spelling-variation candidates",
    text: "Candidates must preserve phonetic-identity of the original name. Acceptable: vowel-doubling, same-phoneme spellings, transliteration variants. Unacceptable: phoneme-changes that produce a different name.",
  },
  {
    title: "Step 4 — Compute each candidate's Name-Number",
    text: "Apply Lesson 21.3.3 to each candidate. Tabulate candidate ↔ Name-Number ↔ register ↔ caveats for transparency.",
  },
  {
    title: "Step 5 — Verify phonetic-acceptability with client",
    text: "Check pronounceability, cultural-acceptability, and documentation-acceptability. Client confirmation is REQUIRED; the practitioner cannot impose an awkward spelling.",
  },
  {
    title: "Step 6 — Discipline-compliant presentation",
    text: "Present confirmatory-not-deterministic framing: *This is chart-context register-shift information; it is not a life-outcome determinant. The decision is yours.* Refuse *will improve your luck* over-claims.",
  },
];

export { getRegister, getNameResultForConvention, systemShortLabel };
