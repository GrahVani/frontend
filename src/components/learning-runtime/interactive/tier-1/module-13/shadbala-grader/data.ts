import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type ShadbalaGrade = "uttama" | "madhya" | "adhama";

export interface ShadbalaMinimum {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  requiredRupas: number;
  sampleActual: number;
  correction?: string;
  karakaRegister: string;
  color: string;
}

export interface GradeBand {
  key: ShadbalaGrade;
  label: string;
  iast: string;
  ratioRange: string;
  interpretation: string;
  color: string;
}

export const SHADBALA_MINIMA: ShadbalaMinimum[] = [
  {
    slug: "surya",
    planet: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    requiredRupas: 5,
    sampleActual: 5.5,
    correction: "Standard Sun minimum is 5, not 6.5.",
    karakaRegister: "authority, father, vitality, visibility",
    color: grahas.surya.primary,
  },
  {
    slug: "candra",
    planet: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    requiredRupas: 6,
    sampleActual: 5.1,
    karakaRegister: "mind, mother, nourishment, public response",
    color: grahas.candra.primary,
  },
  {
    slug: "mangala",
    planet: "Mars",
    iast: "Mangala",
    devanagari: grahas.mangala.devanagari,
    requiredRupas: 5,
    sampleActual: 3.4,
    karakaRegister: "courage, siblings, action, technical force",
    color: grahas.mangala.primary,
  },
  {
    slug: "budha",
    planet: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    requiredRupas: 7,
    sampleActual: 3,
    karakaRegister: "speech, trade, analysis, learning",
    color: grahas.budha.primary,
  },
  {
    slug: "guru",
    planet: "Jupiter",
    iast: "Guru",
    devanagari: grahas.guru.devanagari,
    requiredRupas: 6.5,
    sampleActual: 7.8,
    karakaRegister: "wisdom, children, counsel, dharma",
    color: grahas.guru.primary,
  },
  {
    slug: "shukra",
    planet: "Venus",
    iast: "Shukra",
    devanagari: grahas.shukra.devanagari,
    requiredRupas: 5.5,
    sampleActual: 4.2,
    karakaRegister: "relationship, art, pleasure, vehicles",
    color: grahas.shukra.primary,
  },
  {
    slug: "shani",
    planet: "Saturn",
    iast: "Shani",
    devanagari: grahas.shani.devanagari,
    requiredRupas: 5,
    sampleActual: 6.1,
    karakaRegister: "discipline, longevity, labor, endurance",
    color: grahas.shani.primary,
  },
];

export const GRADE_BANDS: GradeBand[] = [
  {
    key: "adhama",
    label: "Adhama",
    iast: "Adhama",
    ratioRange: "< 0.50",
    interpretation: "Weak: cross-validate before relying on the planet.",
    color: grahas.mangala.primary,
  },
  {
    key: "madhya",
    label: "Madhya",
    iast: "Madhya",
    ratioRange: "0.50-0.99",
    interpretation: "Moderate: the planet can speak, but mixedly.",
    color: grahas.candra.primary,
  },
  {
    key: "uttama",
    label: "Uttama",
    iast: "Uttama",
    ratioRange: ">= 1.00",
    interpretation: "Strong: meets or exceeds the required minimum.",
    color: grahas.guru.primary,
  },
];

export function getMinimum(slug: GrahaSlug) {
  return SHADBALA_MINIMA.find((minimum) => minimum.slug === slug) ?? SHADBALA_MINIMA[0];
}

export function getRatio(actualRupas: number, requiredRupas: number) {
  return requiredRupas === 0 ? 0 : actualRupas / requiredRupas;
}

export function getGrade(ratio: number): ShadbalaGrade {
  if (ratio >= 1) return "uttama";
  if (ratio >= 0.5) return "madhya";
  return "adhama";
}

export function getGradeBand(ratio: number) {
  const grade = getGrade(ratio);
  return GRADE_BANDS.find((band) => band.key === grade) ?? GRADE_BANDS[0];
}

export function formatRupas(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
