import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type SignParity = "odd" | "even";
export type ChartLayerKey = "rashi" | "navamsa";

export interface OjaYugmaSign {
  index: number;
  name: string;
  short: string;
  parity: SignParity;
}

export interface OjaYugmaPlanet {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  preferredParity: SignParity;
  groupNote: string;
  color: string;
}

export interface OjaYugmaPlacement {
  rashi: number;
  navamsa: number;
}

export const OJA_YUGMA_POINTS_PER_LAYER = 15;

export const OJA_YUGMA_SIGNS: OjaYugmaSign[] = [
  { index: 1, name: "Aries", short: "Ar", parity: "odd" },
  { index: 2, name: "Taurus", short: "Ta", parity: "even" },
  { index: 3, name: "Gemini", short: "Ge", parity: "odd" },
  { index: 4, name: "Cancer", short: "Cn", parity: "even" },
  { index: 5, name: "Leo", short: "Le", parity: "odd" },
  { index: 6, name: "Virgo", short: "Vi", parity: "even" },
  { index: 7, name: "Libra", short: "Li", parity: "odd" },
  { index: 8, name: "Scorpio", short: "Sc", parity: "even" },
  { index: 9, name: "Sagittarius", short: "Sg", parity: "odd" },
  { index: 10, name: "Capricorn", short: "Cp", parity: "even" },
  { index: 11, name: "Aquarius", short: "Aq", parity: "odd" },
  { index: 12, name: "Pisces", short: "Pi", parity: "even" },
];

export const OJA_YUGMA_PLANETS: OjaYugmaPlanet[] = [
  {
    slug: "surya",
    planet: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    preferredParity: "odd",
    groupNote: "Odd-sign group",
    color: grahas.surya.primary,
  },
  {
    slug: "candra",
    planet: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    preferredParity: "even",
    groupNote: "Even-sign group",
    color: grahas.candra.primary,
  },
  {
    slug: "mangala",
    planet: "Mars",
    iast: "Mangala",
    devanagari: grahas.mangala.devanagari,
    preferredParity: "odd",
    groupNote: "Odd-sign group",
    color: grahas.mangala.primary,
  },
  {
    slug: "budha",
    planet: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    preferredParity: "odd",
    groupNote: "Odd-sign group; not variable",
    color: grahas.budha.primary,
  },
  {
    slug: "guru",
    planet: "Jupiter",
    iast: "Guru",
    devanagari: grahas.guru.devanagari,
    preferredParity: "odd",
    groupNote: "Odd-sign group",
    color: grahas.guru.primary,
  },
  {
    slug: "shukra",
    planet: "Venus",
    iast: "Shukra",
    devanagari: grahas.shukra.devanagari,
    preferredParity: "even",
    groupNote: "Even-sign group",
    color: grahas.shukra.primary,
  },
  {
    slug: "shani",
    planet: "Saturn",
    iast: "Shani",
    devanagari: grahas.shani.devanagari,
    preferredParity: "odd",
    groupNote: "Odd-sign group; not variable",
    color: grahas.shani.primary,
  },
];

export const DEFAULT_OJA_YUGMA_PLACEMENTS: Record<string, OjaYugmaPlacement> = {
  surya: { rashi: 1, navamsa: 3 },
  candra: { rashi: 4, navamsa: 2 },
  mangala: { rashi: 10, navamsa: 5 },
  budha: { rashi: 3, navamsa: 11 },
  guru: { rashi: 9, navamsa: 6 },
  shukra: { rashi: 1, navamsa: 12 },
  shani: { rashi: 11, navamsa: 10 },
};

export function getOjaYugmaPlanet(slug: GrahaSlug) {
  return OJA_YUGMA_PLANETS.find((planet) => planet.slug === slug) ?? OJA_YUGMA_PLANETS[0];
}

export function getSign(index: number) {
  return OJA_YUGMA_SIGNS.find((sign) => sign.index === index) ?? OJA_YUGMA_SIGNS[0];
}

export function scoresPlacement(planet: OjaYugmaPlanet, signIndex: number) {
  return getSign(signIndex).parity === planet.preferredParity;
}

export function scoreLayer(planet: OjaYugmaPlanet, signIndex: number) {
  return scoresPlacement(planet, signIndex) ? OJA_YUGMA_POINTS_PER_LAYER : 0;
}

export function totalOjaYugma(planet: OjaYugmaPlanet, placement: OjaYugmaPlacement) {
  return scoreLayer(planet, placement.rashi) + scoreLayer(planet, placement.navamsa);
}
