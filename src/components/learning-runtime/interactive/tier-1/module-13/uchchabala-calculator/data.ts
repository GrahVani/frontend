import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface RashiPoint {
  sign: string;
  short: string;
  degree: number;
  longitude: number;
}

export interface UchchabalaPlanet {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  exaltation: RashiPoint;
  debilitation: RashiPoint;
  sampleLongitude: number;
  color: string;
}

export const RASHIS = [
  { sign: "Aries", short: "Ar", start: 0 },
  { sign: "Taurus", short: "Ta", start: 30 },
  { sign: "Gemini", short: "Ge", start: 60 },
  { sign: "Cancer", short: "Cn", start: 90 },
  { sign: "Leo", short: "Le", start: 120 },
  { sign: "Virgo", short: "Vi", start: 150 },
  { sign: "Libra", short: "Li", start: 180 },
  { sign: "Scorpio", short: "Sc", start: 210 },
  { sign: "Sagittarius", short: "Sg", start: 240 },
  { sign: "Capricorn", short: "Cp", start: 270 },
  { sign: "Aquarius", short: "Aq", start: 300 },
  { sign: "Pisces", short: "Pi", start: 330 },
];

function point(sign: string, degree: number): RashiPoint {
  const rashi = RASHIS.find((item) => item.sign === sign) ?? RASHIS[0];
  return { sign: rashi.sign, short: rashi.short, degree, longitude: rashi.start + degree };
}

export const UCHCHABALA_PLANETS: UchchabalaPlanet[] = [
  {
    slug: "surya",
    planet: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    exaltation: point("Aries", 10),
    debilitation: point("Libra", 10),
    sampleLongitude: 10,
    color: grahas.surya.primary,
  },
  {
    slug: "candra",
    planet: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    exaltation: point("Taurus", 3),
    debilitation: point("Scorpio", 3),
    sampleLongitude: 33,
    color: grahas.candra.primary,
  },
  {
    slug: "mangala",
    planet: "Mars",
    iast: "Mangala",
    devanagari: grahas.mangala.devanagari,
    exaltation: point("Capricorn", 28),
    debilitation: point("Cancer", 28),
    sampleLongitude: 298,
    color: grahas.mangala.primary,
  },
  {
    slug: "budha",
    planet: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    exaltation: point("Virgo", 15),
    debilitation: point("Pisces", 15),
    sampleLongitude: 165,
    color: grahas.budha.primary,
  },
  {
    slug: "guru",
    planet: "Jupiter",
    iast: "Guru",
    devanagari: grahas.guru.devanagari,
    exaltation: point("Cancer", 5),
    debilitation: point("Capricorn", 5),
    sampleLongitude: 5,
    color: grahas.guru.primary,
  },
  {
    slug: "shukra",
    planet: "Venus",
    iast: "Shukra",
    devanagari: grahas.shukra.devanagari,
    exaltation: point("Pisces", 27),
    debilitation: point("Virgo", 27),
    sampleLongitude: 357,
    color: grahas.shukra.primary,
  },
  {
    slug: "shani",
    planet: "Saturn",
    iast: "Shani",
    devanagari: grahas.shani.devanagari,
    exaltation: point("Libra", 20),
    debilitation: point("Aries", 20),
    sampleLongitude: 20,
    color: grahas.shani.primary,
  },
];

export function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

export function angularDistance(a: number, b: number) {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return Math.min(diff, 360 - diff);
}

export function uchchabalaVirupas(longitude: number, debilitationLongitude: number) {
  return Math.min(60, Math.max(0, angularDistance(longitude, debilitationLongitude) / 3));
}

export function longitudeToRashi(longitude: number) {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const rashi = RASHIS[signIndex] ?? RASHIS[0];
  return {
    sign: rashi.sign,
    short: rashi.short,
    degree: normalized - rashi.start,
    longitude: normalized,
  };
}

export function formatDegree(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

export function getUchchabalaPlanet(slug: GrahaSlug) {
  return UCHCHABALA_PLANETS.find((planet) => planet.slug === slug) ?? UCHCHABALA_PLANETS[0];
}
