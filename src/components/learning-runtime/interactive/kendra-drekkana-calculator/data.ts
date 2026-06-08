import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type HouseClassKey = "kendra" | "panaphara" | "apoklima";
export type PlanetGenderKey = "male" | "neutral" | "female";

export interface KendraDrekkanaPlanet {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  gender: PlanetGenderKey;
  sampleHouse: number;
  sampleDegree: number;
  color: string;
}

export interface HouseClass {
  key: HouseClassKey;
  label: string;
  iast: string;
  houses: number[];
  virupas: number;
  note: string;
}

export interface DrekkanaBand {
  index: 1 | 2 | 3;
  label: string;
  range: string;
  start: number;
  end: number;
  favours: PlanetGenderKey;
  planets: string;
}

export const HOUSE_CLASSES: HouseClass[] = [
  {
    key: "kendra",
    label: "Kendra",
    iast: "Kendra",
    houses: [1, 4, 7, 10],
    virupas: 60,
    note: "Angular houses carry full house-class strength.",
  },
  {
    key: "panaphara",
    label: "Panaphara",
    iast: "Panaphara",
    houses: [2, 5, 8, 11],
    virupas: 30,
    note: "Succedent houses carry middle strength.",
  },
  {
    key: "apoklima",
    label: "Apoklima",
    iast: "Apoklima",
    houses: [3, 6, 9, 12],
    virupas: 15,
    note: "Cadent houses carry the lowest house-class strength.",
  },
];

export const DREKKANA_BANDS: DrekkanaBand[] = [
  { index: 1, label: "1st drekkana", range: "0-10 deg", start: 0, end: 10, favours: "male", planets: "Sun, Mars, Jupiter" },
  { index: 2, label: "2nd drekkana", range: "10-20 deg", start: 10, end: 20, favours: "neutral", planets: "Mercury, Saturn" },
  { index: 3, label: "3rd drekkana", range: "20-30 deg", start: 20, end: 30, favours: "female", planets: "Moon, Venus" },
];

export const KENDRA_DREKKANA_PLANETS: KendraDrekkanaPlanet[] = [
  { slug: "surya", planet: "Sun", iast: "Surya", devanagari: grahas.surya.devanagari, gender: "male", sampleHouse: 10, sampleDegree: 6, color: grahas.surya.primary },
  { slug: "candra", planet: "Moon", iast: "Candra", devanagari: grahas.candra.devanagari, gender: "female", sampleHouse: 4, sampleDegree: 25, color: grahas.candra.primary },
  { slug: "mangala", planet: "Mars", iast: "Mangala", devanagari: grahas.mangala.devanagari, gender: "male", sampleHouse: 3, sampleDegree: 8, color: grahas.mangala.primary },
  { slug: "budha", planet: "Mercury", iast: "Budha", devanagari: grahas.budha.devanagari, gender: "neutral", sampleHouse: 2, sampleDegree: 14, color: grahas.budha.primary },
  { slug: "guru", planet: "Jupiter", iast: "Guru", devanagari: grahas.guru.devanagari, gender: "male", sampleHouse: 1, sampleDegree: 22, color: grahas.guru.primary },
  { slug: "shukra", planet: "Venus", iast: "Shukra", devanagari: grahas.shukra.devanagari, gender: "female", sampleHouse: 11, sampleDegree: 27, color: grahas.shukra.primary },
  { slug: "shani", planet: "Saturn", iast: "Shani", devanagari: grahas.shani.devanagari, gender: "neutral", sampleHouse: 6, sampleDegree: 16, color: grahas.shani.primary },
];

export function getHouseClass(house: number) {
  return HOUSE_CLASSES.find((houseClass) => houseClass.houses.includes(house)) ?? HOUSE_CLASSES[0];
}

export function getDrekkanaBand(degree: number) {
  const normalized = Math.min(29.999, Math.max(0, degree));
  return DREKKANA_BANDS.find((band) => normalized >= band.start && normalized < band.end) ?? DREKKANA_BANDS[2];
}

export function drekkanaScore(planet: KendraDrekkanaPlanet, degree: number) {
  return getDrekkanaBand(degree).favours === planet.gender ? 15 : 0;
}

export function totalKendraDrekkana(planet: KendraDrekkanaPlanet, house: number, degree: number) {
  return getHouseClass(house).virupas + drekkanaScore(planet, degree);
}

export function getKendraDrekkanaPlanet(slug: GrahaSlug) {
  return KENDRA_DREKKANA_PLANETS.find((planet) => planet.slug === slug) ?? KENDRA_DREKKANA_PLANETS[0];
}
