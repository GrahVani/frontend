import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type VectorKey = "mulanka" | "bhagyanka" | "namanka";
export type Relation = "mitra" | "shatru" | "sama";

export interface DigitRegister {
  digit: number;
  slug: GrahaSlug;
  graha: string;
  devanagari: string;
  role: string;
  cue: string;
}

export interface PersonProfile {
  name: string;
  mulanka: number;
  bhagyanka: number;
  namanka: number;
}

export interface CompatibilityPair {
  id: string;
  label: string;
  aVector: VectorKey;
  bVector: VectorKey;
  primary: boolean;
}

export const DIGIT_REGISTERS: DigitRegister[] = [
  { digit: 1, slug: "surya", graha: "Surya", devanagari: "सूर्य", role: "authority and visibility", cue: "identity, confidence, leadership" },
  { digit: 2, slug: "candra", graha: "Candra", devanagari: "चन्द्र", role: "care and emotional rhythm", cue: "mind, nurture, receptivity" },
  { digit: 3, slug: "guru", graha: "Guru", devanagari: "गुरु", role: "wisdom and guidance", cue: "meaning, counsel, expansion" },
  { digit: 4, slug: "rahu", graha: "Rahu", devanagari: "राहु", role: "unconventional drive", cue: "ambition, disruption, invention" },
  { digit: 5, slug: "budha", graha: "Budha", devanagari: "बुध", role: "intelligence and exchange", cue: "speech, trade, adaptability" },
  { digit: 6, slug: "shukra", graha: "Shukra", devanagari: "शुक्र", role: "affection and refinement", cue: "beauty, agreement, comfort" },
  { digit: 7, slug: "ketu", graha: "Ketu", devanagari: "केतु", role: "separation and insight", cue: "detachment, subtlety, inwardness" },
  { digit: 8, slug: "shani", graha: "Shani", devanagari: "शनि", role: "duty and endurance", cue: "time, labor, accountability" },
  { digit: 9, slug: "mangala", graha: "Mangala", devanagari: "मङ्गल", role: "action and courage", cue: "heat, assertion, protection" },
];

export const DEFAULT_A: PersonProfile = {
  name: "Person A",
  mulanka: 4,
  bhagyanka: 7,
  namanka: 9,
};

export const DEFAULT_B: PersonProfile = {
  name: "Person B",
  mulanka: 8,
  bhagyanka: 5,
  namanka: 6,
};

export const COMPATIBILITY_PAIRS: CompatibilityPair[] = [
  { id: "root-root", label: "Root to root", aVector: "mulanka", bVector: "mulanka", primary: true },
  { id: "destiny-destiny", label: "Destiny to destiny", aVector: "bhagyanka", bVector: "bhagyanka", primary: true },
  { id: "name-name", label: "Name to name", aVector: "namanka", bVector: "namanka", primary: true },
  { id: "root-destiny", label: "A root to B destiny", aVector: "mulanka", bVector: "bhagyanka", primary: false },
  { id: "root-name", label: "A root to B name", aVector: "mulanka", bVector: "namanka", primary: false },
  { id: "destiny-root", label: "A destiny to B root", aVector: "bhagyanka", bVector: "mulanka", primary: false },
  { id: "destiny-name", label: "A destiny to B name", aVector: "bhagyanka", bVector: "namanka", primary: false },
  { id: "name-root", label: "A name to B root", aVector: "namanka", bVector: "mulanka", primary: false },
  { id: "name-destiny", label: "A name to B destiny", aVector: "namanka", bVector: "bhagyanka", primary: false },
];

const FRIENDS: Record<number, number[]> = {
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

const ENEMIES: Record<number, number[]> = {
  1: [6, 8],
  2: [],
  3: [5, 6],
  4: [1, 2],
  5: [2],
  6: [1, 2],
  7: [1, 2],
  8: [1, 2, 9],
  9: [5],
};

export function getDigitRegister(digit: number): DigitRegister {
  return DIGIT_REGISTERS.find((item) => item.digit === digit) ?? DIGIT_REGISTERS[0];
}

export function getVectorValue(profile: PersonProfile, key: VectorKey): number {
  return profile[key];
}

export function classifyRelation(a: number, b: number): Relation {
  if (a === b) return "mitra";
  if (FRIENDS[a]?.includes(b)) return "mitra";
  if (ENEMIES[a]?.includes(b)) return "shatru";
  return "sama";
}

export function relationScore(relation: Relation): number {
  if (relation === "mitra") return 2;
  if (relation === "sama") return 1;
  return 0;
}

export function relationLabel(relation: Relation): string {
  if (relation === "mitra") return "MITRA";
  if (relation === "shatru") return "SHATRU";
  return "SAMA";
}

export function vectorLabel(key: VectorKey): string {
  if (key === "mulanka") return "Mulanka";
  if (key === "bhagyanka") return "Bhagyanka";
  return "Name-number";
}

export function summarizeProfile(relations: Relation[]) {
  const mitra = relations.filter((item) => item === "mitra").length;
  const sama = relations.filter((item) => item === "sama").length;
  const shatru = relations.filter((item) => item === "shatru").length;
  const score = relations.reduce((total, item) => total + relationScore(item), 0);

  if (shatru >= 3) {
    return {
      band: "Friction to handle",
      score,
      counts: { mitra, sama, shatru },
      framing: "Several vectors are SHATRU. Treat this as a conversation map for friction patterns, not as a verdict on the relationship.",
    };
  }

  if (mitra >= 5) {
    return {
      band: "Supportive register-fit",
      score,
      counts: { mitra, sama, shatru },
      framing: "Many vectors are MITRA. This is favourable context, but it still does not replace communication, values, and lived relationship-work.",
    };
  }

  return {
    band: "Mixed register-fit",
    score,
    counts: { mitra, sama, shatru },
    framing: "The profile is mixed. Read the helpful and frictional lanes separately instead of collapsing them into one judgement.",
  };
}
