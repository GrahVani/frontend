import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type CaraScheme = "seven" | "eight";

export interface CaraPlanet {
  slug: GrahaSlug;
  label: string;
  iast: string;
  devanagari: string;
  sign: string;
  degree: number;
  naisargika: string;
  includeInSeven: boolean;
}

export interface CaraRole {
  rank: number;
  short: string;
  iast: string;
  devanagari: string;
  domain: string;
}

export const CARA_ROLES: CaraRole[] = [
  { rank: 1, short: "AK", iast: "Atmakaraka", devanagari: "आत्मकारक", domain: "self, soul thread" },
  { rank: 2, short: "AmK", iast: "Amatyakaraka", devanagari: "अमात्यकारक", domain: "advisor, work, counsel" },
  { rank: 3, short: "BK", iast: "Bhratrkaraka", devanagari: "भ्रातृकारक", domain: "siblings, courage" },
  { rank: 4, short: "MK", iast: "Matrkaraka", devanagari: "मातृकारक", domain: "mother, nourishment" },
  { rank: 5, short: "PK", iast: "Putrakaraka", devanagari: "पुत्रकारक", domain: "children, learning" },
  { rank: 6, short: "GK", iast: "Gnatikaraka", devanagari: "ज्ञातिकारक", domain: "conflict, obstacles" },
  { rank: 7, short: "DK", iast: "Darakaraka", devanagari: "दारकारक", domain: "spouse, partnership" },
  { rank: 8, short: "PiK", iast: "Pitrkaraka", devanagari: "पितृकारक", domain: "father, lineage" },
];

export const SAMPLE_CARA_PLANETS: CaraPlanet[] = [
  { slug: "surya", label: "Sun", iast: "Surya", devanagari: grahas.surya.devanagari, sign: "Leo", degree: 12, naisargika: "father, authority", includeInSeven: true },
  { slug: "candra", label: "Moon", iast: "Candra", devanagari: grahas.candra.devanagari, sign: "Taurus", degree: 28, naisargika: "mother, mind", includeInSeven: true },
  { slug: "mangala", label: "Mars", iast: "Mangala", devanagari: grahas.mangala.devanagari, sign: "Aries", degree: 4, naisargika: "siblings, force", includeInSeven: true },
  { slug: "budha", label: "Mercury", iast: "Budha", devanagari: grahas.budha.devanagari, sign: "Gemini", degree: 19, naisargika: "speech, intellect", includeInSeven: true },
  { slug: "guru", label: "Jupiter", iast: "Guru", devanagari: grahas.guru.devanagari, sign: "Sagittarius", degree: 25, naisargika: "children, wisdom", includeInSeven: true },
  { slug: "shukra", label: "Venus", iast: "Shukra", devanagari: grahas.shukra.devanagari, sign: "Libra", degree: 8, naisargika: "spouse, pleasure, art", includeInSeven: true },
  { slug: "shani", label: "Saturn", iast: "Shani", devanagari: grahas.shani.devanagari, sign: "Capricorn", degree: 16, naisargika: "longevity, sorrow, labor", includeInSeven: true },
  { slug: "rahu", label: "Rahu", iast: "Rahu", devanagari: grahas.rahu.devanagari, sign: "Virgo", degree: 8, naisargika: "amplification, obsession", includeInSeven: false },
];

export function formatDegree(value: number) {
  const degrees = Math.floor(value);
  const minutes = Math.round((value - degrees) * 60);
  return `${degrees}°${String(minutes).padStart(2, "0")}'`;
}

export function effectiveCaraDegree(planet: CaraPlanet, scheme: CaraScheme) {
  if (scheme === "eight" && planet.slug === "rahu") return 30 - planet.degree;
  return planet.degree;
}

export function rankCaraPlanets(planets: CaraPlanet[], scheme: CaraScheme) {
  return planets
    .filter((planet) => scheme === "eight" || planet.includeInSeven)
    .map((planet) => ({ planet, effectiveDegree: effectiveCaraDegree(planet, scheme) }))
    .sort((a, b) => b.effectiveDegree - a.effectiveDegree)
    .map((item, index) => ({
      ...item,
      role: CARA_ROLES[index] ?? CARA_ROLES[CARA_ROLES.length - 1],
    }));
}
