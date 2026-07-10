import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface GrahaAnka {
  value: number;
  grahaSlug: GrahaSlug;
  devanagari: string;
  register: string;
  caveat: string;
}

export interface VedicVector {
  id: "mulanka" | "bhagyanka" | "namanka";
  label: string;
  devanagari: string;
  source: string;
  rule: string;
  depth: string;
  color: string;
}

export interface ExampleProfile {
  id: string;
  label: string;
  name: string;
  birthDate: string;
  note: string;
}

export const GRAHA_ANKA: GrahaAnka[] = [
  { value: 1, grahaSlug: "surya", devanagari: "सूर्य", register: "authority, vitality, leadership", caveat: "Do not turn confidence into domination." },
  { value: 2, grahaSlug: "candra", devanagari: "चन्द्र", register: "mind, receptivity, public feeling", caveat: "Do not mistake sensitivity for weakness." },
  { value: 3, grahaSlug: "guru", devanagari: "गुरु", register: "teaching, wisdom, expansion", caveat: "Avoid moral certainty without chart support." },
  { value: 4, grahaSlug: "rahu", devanagari: "राहु", register: "unconventional, shadow, foreign, sudden", caveat: "Do not label every disruption as doom." },
  { value: 5, grahaSlug: "budha", devanagari: "बुध", register: "speech, trade, analysis, adaptability", caveat: "Avoid cleverness without grounding." },
  { value: 6, grahaSlug: "shukra", devanagari: "शुक्र", register: "harmony, beauty, relationship, comfort", caveat: "Do not promise marital harmony from 6 alone." },
  { value: 7, grahaSlug: "ketu", devanagari: "केतु", register: "detachment, refinement, moksha, isolation", caveat: "Do not romanticise withdrawal." },
  { value: 8, grahaSlug: "shani", devanagari: "शनि", register: "karma, discipline, delay, structure", caveat: "Do not make Saturn a fatalistic verdict." },
  { value: 9, grahaSlug: "mangala", devanagari: "मङ्गल", register: "action, courage, fire, conflict", caveat: "Do not reduce conflict to Mars alone." },
];

export const VEDIC_VECTORS: VedicVector[] = [
  {
    id: "mulanka",
    label: "Mulanka",
    devanagari: "मूलाङ्क",
    source: "Birth day",
    rule: "Reduce the day of month only.",
    depth: "Root-graha: the base operating register.",
    color: "#2F7D52",
  },
  {
    id: "bhagyanka",
    label: "Bhagyanka",
    devanagari: "भाग्याङ्क",
    source: "Full date",
    rule: "Reduce all digits of day, month, and year.",
    depth: "Destiny trajectory: the life-direction register.",
    color: "#356C96",
  },
  {
    id: "namanka",
    label: "Namanka",
    devanagari: "नामाङ्क",
    source: "Name",
    rule: "Pure Vedic uses Devanagari syllable values; Roman names often use the Vedic-Chaldean hybrid.",
    depth: "Name vibration: the called or spoken register.",
    color: ink.goldAccent,
  },
];

const CHALDEAN_VALUE: Record<string, number> = {
  A: 1,
  I: 1,
  J: 1,
  Q: 1,
  Y: 1,
  B: 2,
  K: 2,
  R: 2,
  C: 3,
  G: 3,
  L: 3,
  S: 3,
  D: 4,
  M: 4,
  T: 4,
  E: 5,
  H: 5,
  N: 5,
  X: 5,
  U: 6,
  V: 6,
  W: 6,
  O: 7,
  Z: 7,
  F: 8,
  P: 8,
};

export const EXAMPLES: ExampleProfile[] = [
  { id: "aniket", label: "Aniket", name: "Aniket", birthDate: "1985-07-22", note: "Lesson example: Mulanka 4, Bhagyanka 7, hybrid Namanka 9." },
  { id: "priya", label: "Priya", name: "Priya", birthDate: "1990-08-15", note: "Shows a changeable name vector beside fixed birth-date vectors." },
  { id: "rohit", label: "Rohit Verma", name: "Rohit Verma", birthDate: "1988-11-29", note: "Good hybrid-pattern example for commercial Indian practice." },
  { id: "marriage", label: "Hook case", name: "Meena", birthDate: "1991-05-09", note: "Demonstrates why graha mismatch language must not become a guarantee." },
];

export function cleanName(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

export function reduceDigits(value: number) {
  const chain = [value];
  let current = value;
  while (current > 9) {
    current = String(current).split("").reduce((sum, digit) => sum + Number(digit), 0);
    chain.push(current);
  }
  return chain;
}

export function dateDigits(date: string) {
  return date.replace(/\D/g, "").split("").map(Number);
}

export function dayFromDate(date: string) {
  const day = date.split("-")[2] ?? "";
  return Number(day);
}

export function computeMulanka(date: string) {
  const day = dayFromDate(date);
  return Number.isFinite(day) && day > 0 ? reduceDigits(day) : [0];
}

export function computeBhagyanka(date: string) {
  const sum = dateDigits(date).reduce((total, digit) => total + digit, 0);
  return sum > 0 ? reduceDigits(sum) : [0];
}

export function computeHybridNamanka(name: string) {
  const letters = cleanName(name).split("");
  const values = letters.map((letter) => ({ letter, value: CHALDEAN_VALUE[letter] ?? 0 }));
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return {
    values,
    chain: total > 0 ? reduceDigits(total) : [0],
  };
}

export function getGrahaAnka(value: number) {
  return GRAHA_ANKA.find((item) => item.value === value) ?? GRAHA_ANKA[0];
}

export function grahaColor(value: number) {
  const item = getGrahaAnka(value);
  if (item.grahaSlug === "candra") return "#5A6F96";
  if (item.grahaSlug === "shukra") return "#356C96";
  return grahas[item.grahaSlug].primary;
}
