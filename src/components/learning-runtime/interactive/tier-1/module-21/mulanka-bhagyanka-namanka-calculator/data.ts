/**
 * Engine for Lesson 21.3.3 — Name-Number (Nāmāṅka) calculator.
 *
 * Implements three-system name-number computation (Chaldean / Pythagorean /
 * Vedic-Chaldean hybrid) under strict-preservation and flexibility conventions.
 * Also supports the Pythagorean four-number framework: Expression, Soul Urge,
 * Personality, and Life Path (= Bhāgyāṅka).
 */

import {
  computeBhagyanka,
  getResultForConvention,
  getRegister,
  type Convention,
} from "../bhagyanka-calculator/data";

export type NumerologySystem = "chaldean" | "pythagorean" | "vedic-hybrid";

export interface LetterValue {
  letter: string;
  value: number;
}

export interface NameComputationResult {
  name: string;
  system: NumerologySystem;
  convention: Convention;
  values: LetterValue[];
  totalSum: number;
  strictResult: number;
  flexibleResult: number;
  steps: string[];
}

export interface FourNumberResult {
  expression: number;
  soulUrge: number;
  personality: number;
  lifePath: number | null;
}

// Chaldean letter-table per Lesson 21.1.1
// A/I/J/Q/Y = 1; B/K/R = 2; C/G/L/S = 3; D/M/T = 4; E/H/N/X = 5;
// U/V/W = 6; O/Z = 7; F/P = 8; 9 reserved-sacred (no letter)
const CHALDEAN_TABLE: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function pythagoreanValue(letter: string): number {
  const code = letter.charCodeAt(0) - 64; // A=1, B=2, ...
  const mod = code % 9;
  return mod === 0 ? 9 : mod;
}

function getLetterValue(letter: string, system: NumerologySystem): number | null {
  if (!/^[A-Z]$/.test(letter)) return null;
  if (system === "chaldean" || system === "vedic-hybrid") {
    return CHALDEAN_TABLE[letter] ?? null;
  }
  return pythagoreanValue(letter);
}

function sumDigits(n: number): number {
  return n.toString().split("").map(Number).reduce((a, b) => a + b, 0);
}

function reduceNumber(n: number, convention: Convention): number {
  if (n >= 1 && n <= 9) return n;
  if (convention === "strict" && (n === 11 || n === 22 || n === 33)) return n;
  if (n > 9) {
    const s = sumDigits(n);
    return reduceNumber(s, convention);
  }
  return n;
}

export function computeNameNumber(
  rawName: string,
  system: NumerologySystem,
  convention: Convention
): NameComputationResult {
  const name = rawName.toUpperCase().replace(/[^A-Z]/g, "");
  const values: LetterValue[] = [];
  const skipped: string[] = [];

  for (const ch of name) {
    const value = getLetterValue(ch, system);
    if (value !== null) {
      values.push({ letter: ch, value });
    } else {
      skipped.push(ch);
    }
  }

  const totalSum = values.reduce((sum, lv) => sum + lv.value, 0);
  const strictResult = reduceNumber(totalSum, "strict");
  const flexibleResult = reduceNumber(totalSum, "flexible");

  const steps: string[] = [];
  steps.push(`System: ${systemLabel(system)}.`);
  steps.push(`Name resolved: "${rawName}" -> "${name}".`);

  if (values.length === 0) {
    steps.push("No recognised English letters found.");
  } else {
    const breakdown = values.map((lv) => `${lv.letter}(${lv.value})`).join(" + ");
    steps.push(`Letter values: ${breakdown}.`);
    steps.push(`Sum: ${totalSum}.`);

    if (totalSum >= 10) {
      if (totalSum === 11 || totalSum === 22 || totalSum === 33) {
        steps.push(`Intermediate sum ${totalSum} is a master number.`);
        steps.push(`Strict-preservation: keep Master ${totalSum}; flexibility: reduce to ${flexibleResult}.`);
      } else {
        const reductionSteps: string[] = [];
        let current = totalSum;
        while (current > 9) {
          const next = sumDigits(current);
          if (current === 11 || current === 22 || current === 33) {
            reductionSteps.push(`${current} (master, flexibility reduces to ${next})`);
            current = next;
            break;
          }
          reductionSteps.push(`${current} -> ${next}`);
          current = next;
        }
        if (reductionSteps.length > 0) {
          steps.push(`Reduction path (flexibility): ${reductionSteps.join(", ")}.`);
        }
        if (strictResult !== flexibleResult) {
          steps.push(`Strict-preservation stops at Master ${strictResult}; flexibility reduces to ${flexibleResult}.`);
        } else {
          steps.push(`Result under both conventions: ${flexibleResult}.`);
        }
      }
    } else {
      steps.push(`Single-digit sum: Name-Number = ${totalSum}.`);
    }
  }

  if (skipped.length > 0) {
    steps.push(`Ignored non-English characters: ${[...new Set(skipped)].join(", ")}.`);
  }

  return { name: rawName, system, convention, values, totalSum, strictResult, flexibleResult, steps };
}

export function computePythagoreanFourNumbers(
  rawName: string,
  day: number | null,
  month: number | null,
  year: number | null,
  convention: Convention
): FourNumberResult | null {
  const name = rawName.toUpperCase().replace(/[^A-Z]/g, "");
  if (name.length === 0) return null;

  const allValues: number[] = [];
  const vowelValues: number[] = [];
  const consonantValues: number[] = [];

  for (const ch of name) {
    const value = getLetterValue(ch, "pythagorean");
    if (value === null) continue;
    allValues.push(value);
    if (VOWELS.has(ch)) {
      vowelValues.push(value);
    } else {
      consonantValues.push(value);
    }
  }

  if (allValues.length === 0) return null;

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const expression = reduceNumber(sum(allValues), convention);
  const soulUrge = vowelValues.length > 0 ? reduceNumber(sum(vowelValues), convention) : expression;
  const personality = consonantValues.length > 0 ? reduceNumber(sum(consonantValues), convention) : expression;

  let lifePath: number | null = null;
  if (
    day !== null && month !== null && year !== null &&
    day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1000 && year <= 9999
  ) {
    const bhagyanka = computeBhagyanka(day, month, year);
    lifePath = getResultForConvention(bhagyanka, convention);
  }

  return { expression, soulUrge, personality, lifePath };
}

export function systemLabel(system: NumerologySystem): string {
  switch (system) {
    case "chaldean":
      return "Chaldean (Cheiro irregular vibrational table)";
    case "pythagorean":
      return "Pythagorean (sequential A=1 ... I=9 ... Z=8)";
    case "vedic-hybrid":
      return "Vedic-Chaldean hybrid (Chaldean computation + Vedic interpretation)";
  }
}

export function systemShortLabel(system: NumerologySystem): string {
  switch (system) {
    case "chaldean":
      return "Chaldean";
    case "pythagorean":
      return "Pythagorean";
    case "vedic-hybrid":
      return "Vedic-Chaldean hybrid";
  }
}

export const SYSTEMS: { key: NumerologySystem; label: string }[] = [
  { key: "chaldean", label: "Chaldean" },
  { key: "pythagorean", label: "Pythagorean" },
  { key: "vedic-hybrid", label: "Vedic-Chaldean hybrid" },
];

export const CHALDEAN_GROUPS = [
  { value: 1, letters: "A, I, J, Q, Y" },
  { value: 2, letters: "B, K, R" },
  { value: 3, letters: "C, G, L, S" },
  { value: 4, letters: "D, M, T" },
  { value: 5, letters: "E, H, N, X" },
  { value: 6, letters: "U, V, W" },
  { value: 7, letters: "O, Z" },
  { value: 8, letters: "F, P" },
];

export const PYTHAGOREAN_GROUPS = [
  { value: 1, letters: "A, J, S" },
  { value: 2, letters: "B, K, T" },
  { value: 3, letters: "C, L, U" },
  { value: 4, letters: "D, M, V" },
  { value: 5, letters: "E, N, W" },
  { value: 6, letters: "F, O, X" },
  { value: 7, letters: "G, P, Y" },
  { value: 8, letters: "H, Q, Z" },
  { value: 9, letters: "I, R" },
];

export interface WorkedExample {
  id: number;
  label: string;
  name: string;
  system: NumerologySystem;
  strictResult: number;
  flexibleResult: number;
  register: string;
  notes: string[];
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 1,
    label: "Chaldean: Priya",
    name: "Priya",
    system: "chaldean",
    strictResult: 4,
    flexibleResult: 4,
    register: "Rāhu",
    notes: [
      "P(8) + R(2) + I(1) + Y(1) + A(1) = 13 -> 1 + 3 = 4.",
      "Rāhu shadow-graha caveat applies; refuse cursed / destined-for-disasters framings.",
    ],
  },
  {
    id: 2,
    label: "Pythagorean: Priya",
    name: "Priya",
    system: "pythagorean",
    strictResult: 33,
    flexibleResult: 6,
    register: "Strict: Master Teacher (intensified Śukra); Flexible: Śukra",
    notes: [
      "P(7) + R(9) + I(9) + Y(7) + A(1) = 33.",
      "Strict preserves Master 33; flexibility reduces to 6 (Śukra).",
    ],
  },
  {
    id: 3,
    label: "Vedic-Chaldean hybrid: Rohit Verma",
    name: "Rohit Verma",
    system: "vedic-hybrid",
    strictResult: 1,
    flexibleResult: 1,
    register: "Sūrya",
    notes: [
      "R(2) + O(7) + H(5) + I(1) + T(4) + V(6) + E(5) + R(2) + M(4) + A(1) = 37 -> 3 + 7 = 10 -> 1.",
      "Chaldean computation + Vedic graha-aṅka interpretation (1 = Sūrya).",
    ],
  },
  {
    id: 4,
    label: "Pythagorean four-number: Aniket Sharma, 25-10-1985",
    name: "Aniket Sharma",
    system: "pythagorean",
    strictResult: 3,
    flexibleResult: 3,
    register: "Expression 3 (Guru); Soul Urge 8 (Śani); Personality 4 (Rāhu); Life Path 4 (Rāhu)",
    notes: [
      "Expression: all letters = 48 -> 4 + 8 = 12 -> 3 (Guru).",
      "Soul Urge: vowels = 17 -> 8 (Śani). Personality: consonants = 31 -> 4 (Rāhu).",
      "Life Path = Bhāgyāṅka of 25-10-1985 = 4 (Rāhu).",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Select ONE system per consultation",
    text: "Chaldean, Pythagorean, or Vedic-Chaldean hybrid. Name the choice to the client and use it consistently.",
  },
  {
    title: "Resolve which name-form to use",
    text: "Birth-name, full birth-name, current-legal-name, or commonly-used-name. Name the convention and apply it consistently.",
  },
  {
    title: "Apply the system's letter-table",
    text: "Chaldean irregular vibrational table; Pythagorean sequential A=1...Z=8; Vedic-Chaldean hybrid uses Chaldean table for Romanised names.",
  },
  {
    title: "Sum, reduce, and preserve master-numbers",
    text: "Sum all letter-values. Reduce to single-digit (1-9) by digital-root reduction, preserving 11/22/33 per chosen convention from Lesson 21.2.4.",
  },
  {
    title: "Map to graha-aṅka register + read multivalently",
    text: "Use the register's strengths AND shadows. Apply caveats for Rāhu (4), Ketu (7), Śani (8), Maṅgala (9), and master-number SPECIAL over-claim refusal.",
  },
  {
    title: "Refuse single-numerology name-change over-claims",
    text: "Name-Number is the only personal-number changeable by name-change, but legal name-change is a major-life-decision requiring convergent independent grounds, never numerology alone.",
  },
];

export { getRegister };
export type { Convention } from "../bhagyanka-calculator/data";

export function getNameResultForConvention(result: NameComputationResult, convention: Convention): number {
  return convention === "strict" ? result.strictResult : result.flexibleResult;
}
