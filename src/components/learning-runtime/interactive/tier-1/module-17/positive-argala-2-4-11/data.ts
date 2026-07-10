/**
 * Positive Argala 2/4/11 -- Data Engine
 *
 * Lesson 17.3.2 interactive: counting drill, self-check challenges,
 * worked examples, and strength visualisation.
 */

export function wrapHouse(n: number): number {
  return ((n - 1) % 12) + 1;
}

export function argalaFrom(reference: number) {
  return {
    second: wrapHouse(reference + 1),
    fourth: wrapHouse(reference + 3),
    eleventh: wrapHouse(reference + 10),
    fifth: wrapHouse(reference + 4),
  };
}

/* --- Self-check challenges --- */

export interface Challenge {
  key: string;
  question: string;
  reference: number;
  answer: { second: number; fourth: number; eleventh: number };
  hint: string;
}

export const CHALLENGES: Challenge[] = [
  { key: "c1", question: "Reference = 7th house (marriage). Count 2nd, 4th, 11th from it.", reference: 7, answer: { second: 8, fourth: 10, eleventh: 5 }, hint: "2nd = 7+1 = 8. 4th = 7+3 = 10. 11th = 7+10 = 17 -> wrap = 5." },
  { key: "c2", question: "Reference = 10th house (career). Count 2nd, 4th, 11th from it.", reference: 10, answer: { second: 11, fourth: 1, eleventh: 8 }, hint: "2nd = 10+1 = 11. 4th = 10+3 = 13 -> wrap = 1. 11th = 10+10 = 20 -> wrap = 8." },
  { key: "c3", question: "Reference = 4th house (home). Count 2nd, 4th, 11th from it.", reference: 4, answer: { second: 5, fourth: 7, eleventh: 2 }, hint: "2nd = 4+1 = 5. 4th = 4+3 = 7. 11th = 4+10 = 14 -> wrap = 2." },
  { key: "c4", question: "Reference = 9th house (fortune). Count 2nd, 4th, 11th + secondary 5th.", reference: 9, answer: { second: 10, fourth: 12, eleventh: 7 }, hint: "2nd = 9+1 = 10. 4th = 9+3 = 12. 11th = 9+10 = 19 -> wrap = 7. Secondary 5th = 9+4 = 1." },
  { key: "c5", question: "Reference = 2nd house (wealth). Count 2nd, 4th, 11th from it.", reference: 2, answer: { second: 3, fourth: 5, eleventh: 12 }, hint: "2nd = 2+1 = 3. 4th = 2+3 = 5. 11th = 2+10 = 12." },
];

/* --- Strength examples --- */

export interface StrengthExample {
  key: string;
  label: string;
  occupants: number; // how many planets in argala houses
  description: string;
}

export const STRENGTH_EXAMPLES: StrengthExample[] = [
  { key: "none", label: "No argala", occupants: 0, description: "The reference stands on its own. Read it from its lord, occupants, and aspects." },
  { key: "single", label: "Single planet", occupants: 1, description: "One planet in an argala house gives a noticeable but mild reinforcement." },
  { key: "double", label: "Two planets", occupants: 2, description: "Two argala-givers compound. The intervention is now a meaningful factor in the reading." },
  { key: "triple", label: "Three+ planets", occupants: 3, description: "Multiple planets across the 2nd/4th/11th produce a strong, compounding positive argala. The reference is well-supported." },
];

/* --- Common traps (spot the error) --- */

export interface Trap {
  key: string;
  statement: string;
  error: string;
  correction: string;
}

export const TRAPS: Trap[] = [
  { key: "t1", statement: "The positive-argala houses are always the 2nd, 4th, and 11th of the chart.", error: "Treating argala as absolute, not relative.", correction: "The houses are 2nd, 4th, 11th FROM THE REFERENCE. From the 7th they are 8, 10, 5." },
  { key: "t2", statement: "A planet in the 3rd from the reference gives positive argala.", error: "Wrong house-set.", correction: "The 3rd is a virodhārgala (obstructing) position, not positive. Positive = 2nd, 4th, 11th." },
  { key: "t3", statement: "Two planets in argala houses cancel each other out.", error: "Importing cancellation logic incorrectly.", correction: "Positive argala occupants compound -- they add, never cancel. More planets = stronger argala." },
  { key: "t4", statement: "Only benefics in the argala houses generate argala.", error: "Confusing nature with position.", correction: "Any planet in an argala house gives argala by position. Its nature colours the quality of the result." },
];
