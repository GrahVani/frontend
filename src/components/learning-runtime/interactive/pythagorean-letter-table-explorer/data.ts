export interface LetterValue {
  letter: string;
  pythagorean: number;
  chaldean: number;
}

export interface NumberMode {
  id: "expression" | "soulUrge" | "personality" | "lifePath";
  label: string;
  source: string;
  rule: string;
}

export interface PythagoreanRegister {
  value: number;
  label: string;
  register: string;
  caution: string;
}

export interface ExampleInput {
  id: string;
  label: string;
  name: string;
  birthDate: string;
  note: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CHALDEAN_VALUES: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 8,
  G: 3,
  H: 5,
  I: 1,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  O: 7,
  P: 8,
  Q: 1,
  R: 2,
  S: 3,
  T: 4,
  U: 6,
  V: 6,
  W: 6,
  X: 5,
  Y: 1,
  Z: 7,
};

export const LETTER_VALUES: LetterValue[] = ALPHABET.map((letter, index) => ({
  letter,
  pythagorean: (index % 9) + 1,
  chaldean: CHALDEAN_VALUES[letter] ?? 0,
}));

export const PYTHAGOREAN_VALUE: Record<string, number> = Object.fromEntries(
  LETTER_VALUES.map((item) => [item.letter, item.pythagorean]),
);

export const CHALDEAN_VALUE: Record<string, number> = Object.fromEntries(
  LETTER_VALUES.map((item) => [item.letter, item.chaldean]),
);

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const NUMBER_MODES: NumberMode[] = [
  {
    id: "expression",
    label: "Expression",
    source: "All letters",
    rule: "Full birth-name or working name: sum every letter, then reduce.",
  },
  {
    id: "soulUrge",
    label: "Soul Urge",
    source: "Vowels only",
    rule: "Sum the vowels to read the interior desire register.",
  },
  {
    id: "personality",
    label: "Personality",
    source: "Consonants only",
    rule: "Sum consonants to read the outer-facing register.",
  },
  {
    id: "lifePath",
    label: "Life Path",
    source: "Birth date",
    rule: "Sum date digits and reduce; this does not depend on a letter table.",
  },
];

export const PYTHAGOREAN_REGISTERS: PythagoreanRegister[] = [
  { value: 1, label: "Initiator", register: "Independence, leadership, beginning power.", caution: "Avoid turning initiative into isolation." },
  { value: 2, label: "Mediator", register: "Cooperation, sensitivity, diplomacy.", caution: "Avoid dependence or fear of conflict." },
  { value: 3, label: "Expressive", register: "Creativity, speech, social brightness.", caution: "Avoid scattering energy across too many displays." },
  { value: 4, label: "Builder", register: "Structure, practicality, discipline.", caution: "Avoid rigidity and over-control." },
  { value: 5, label: "Mover", register: "Freedom, change, variety, travel.", caution: "Avoid restlessness without direction." },
  { value: 6, label: "Harmoniser", register: "Care, beauty, responsibility, relationship.", caution: "Avoid rescuing or carrying too much." },
  { value: 7, label: "Searcher", register: "Analysis, study, solitude, interior inquiry.", caution: "Avoid mistaking withdrawal for wisdom." },
  { value: 8, label: "Executive", register: "Authority, material organisation, achievement.", caution: "Avoid making success a single-number destiny claim." },
  { value: 9, label: "Universalist", register: "Completion, compassion, service, wide vision.", caution: "Avoid vague idealism without practical grounding." },
];

export const EXAMPLES: ExampleInput[] = [
  { id: "aniket", label: "Aniket", name: "Aniket", birthDate: "1985-07-22", note: "Shows Pythagorean 24 -> 6 vs Chaldean 18 -> 9." },
  { id: "sharma", label: "Aniket Sharma", name: "Aniket Sharma", birthDate: "1985-07-22", note: "Expression 48 -> 12 -> 3 from the lesson example." },
  { id: "western", label: "Western 7", name: "Daniel Morris", birthDate: "1985-07-22", note: "Life Path 34 -> 7, useful for the hook client." },
  { id: "grahvani", label: "Grahvani", name: "Grahvani", birthDate: "1990-01-01", note: "Good contrast name for sequential vs vibrational mapping." },
];

export function cleanName(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

export function reduceDigits(value: number, preserveMaster = false) {
  const chain = [value];
  let current = value;
  while (current > 9) {
    if (preserveMaster && (current === 11 || current === 22 || current === 33)) break;
    current = String(current).split("").reduce((sum, digit) => sum + Number(digit), 0);
    chain.push(current);
  }
  return chain;
}

export function getRegister(value: number) {
  const reduced = value > 9 ? reduceDigits(value).at(-1) ?? 1 : value;
  return PYTHAGOREAN_REGISTERS.find((item) => item.value === reduced) ?? PYTHAGOREAN_REGISTERS[0];
}

export function dateDigitSum(date: string) {
  return date.replace(/\D/g, "").split("").reduce((sum, digit) => sum + Number(digit), 0);
}
