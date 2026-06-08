import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface DikBalaPlanet {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  direction: "East" | "North" | "West" | "South" | "Excluded";
  homeHouse: number | null;
  homeAngle: number | null;
  oppositeHouse: number | null;
  note: string;
  sampleAngle: number;
  color: string;
  excluded?: boolean;
}

export interface DirectionHouse {
  direction: "East" | "North" | "West" | "South";
  house: number;
  angle: number;
  label: string;
}

export const DIRECTION_HOUSES: DirectionHouse[] = [
  { direction: "East", house: 1, angle: 0, label: "1st / Lagna" },
  { direction: "North", house: 4, angle: 90, label: "4th / Nadir" },
  { direction: "West", house: 7, angle: 180, label: "7th / Descendant" },
  { direction: "South", house: 10, angle: 270, label: "10th / Midheaven" },
];

export const DIK_BALA_PLANETS: DikBalaPlanet[] = [
  {
    slug: "surya",
    planet: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    direction: "South",
    homeHouse: 10,
    homeAngle: 270,
    oppositeHouse: 4,
    note: "Sun peaks at the 10th house.",
    sampleAngle: 270,
    color: grahas.surya.primary,
  },
  {
    slug: "candra",
    planet: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    direction: "North",
    homeHouse: 4,
    homeAngle: 90,
    oppositeHouse: 10,
    note: "Moon roots in the 4th house.",
    sampleAngle: 90,
    color: grahas.candra.primary,
  },
  {
    slug: "mangala",
    planet: "Mars",
    iast: "Mangala",
    devanagari: grahas.mangala.devanagari,
    direction: "South",
    homeHouse: 10,
    homeAngle: 270,
    oppositeHouse: 4,
    note: "Mars shares the Sun's southern strength.",
    sampleAngle: 315,
    color: grahas.mangala.primary,
  },
  {
    slug: "budha",
    planet: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    direction: "East",
    homeHouse: 1,
    homeAngle: 0,
    oppositeHouse: 7,
    note: "Mercury rises in the eastern lagna.",
    sampleAngle: 30,
    color: grahas.budha.primary,
  },
  {
    slug: "guru",
    planet: "Jupiter",
    iast: "Guru",
    devanagari: grahas.guru.devanagari,
    direction: "East",
    homeHouse: 1,
    homeAngle: 0,
    oppositeHouse: 7,
    note: "Jupiter shares Mercury's eastern strength.",
    sampleAngle: 0,
    color: grahas.guru.primary,
  },
  {
    slug: "shukra",
    planet: "Venus",
    iast: "Shukra",
    devanagari: grahas.shukra.devanagari,
    direction: "North",
    homeHouse: 4,
    homeAngle: 90,
    oppositeHouse: 10,
    note: "Venus shares the Moon's northern strength.",
    sampleAngle: 150,
    color: grahas.shukra.primary,
  },
  {
    slug: "shani",
    planet: "Saturn",
    iast: "Shani",
    devanagari: grahas.shani.devanagari,
    direction: "West",
    homeHouse: 7,
    homeAngle: 180,
    oppositeHouse: 1,
    note: "Saturn sets in the west.",
    sampleAngle: 180,
    color: grahas.shani.primary,
  },
  {
    slug: "rahu",
    planet: "Rahu",
    iast: "Rahu",
    devanagari: grahas.rahu.devanagari,
    direction: "Excluded",
    homeHouse: null,
    homeAngle: null,
    oppositeHouse: null,
    note: "Rahu is excluded from dik bala.",
    sampleAngle: 0,
    color: grahas.rahu.primary,
    excluded: true,
  },
  {
    slug: "ketu",
    planet: "Ketu",
    iast: "Ketu",
    devanagari: grahas.ketu.devanagari,
    direction: "Excluded",
    homeHouse: null,
    homeAngle: null,
    oppositeHouse: null,
    note: "Ketu is excluded from dik bala.",
    sampleAngle: 0,
    color: grahas.ketu.primary,
    excluded: true,
  },
];

export function normalizeAngle(value: number) {
  return ((value % 360) + 360) % 360;
}

export function angularDistance(a: number, b: number) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(diff, 360 - diff);
}

export function dikBalaVirupas(planet: DikBalaPlanet, angle: number) {
  if (planet.excluded || planet.homeAngle === null) return 0;
  return Math.max(0, Math.min(60, 60 - angularDistance(angle, planet.homeAngle) / 3));
}

export function angleToHouse(angle: number) {
  const normalized = normalizeAngle(angle);
  return Math.floor(((normalized + 15) % 360) / 30) + 1;
}

export function getDikBalaPlanet(slug: GrahaSlug) {
  return DIK_BALA_PLANETS.find((planet) => planet.slug === slug) ?? DIK_BALA_PLANETS[0];
}

export function formatVirupas(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
