export type DomainKey = "career" | "marriage" | "wealth" | "children" | "health" | "moksha";

export interface DomainMeta {
  key: DomainKey;
  label: string;
  bhavaNum: number;
  bhavaName: string;
  karaka: string;
  description: string;
}

export const DOMAINS: DomainMeta[] = [
  {
    key: "career",
    label: "Career / Profession",
    bhavaNum: 10,
    bhavaName: "Karma Bhāva",
    karaka: "Saturn",
    description: "Status, livelihood, daily responsibilities, and professional trajectory."
  },
  {
    key: "marriage",
    label: "Marriage / Relationship",
    bhavaNum: 7,
    bhavaName: "Yātara Bhāva",
    karaka: "Venus",
    description: "Partnerships, commitments, and domestic alignment."
  },
  {
    key: "wealth",
    label: "Wealth / Finance",
    bhavaNum: 2,
    bhavaName: "Dhana Bhāva",
    karaka: "Jupiter",
    description: "Liquid savings, family assets, speech, and gains."
  },
  {
    key: "children",
    label: "Children / Santana",
    bhavaNum: 5,
    bhavaName: "Putra Bhāva",
    karaka: "Jupiter",
    description: "Creativity, offspring, memory, and past-life merit."
  },
  {
    key: "health",
    label: "Health / Longevity",
    bhavaNum: 6,
    bhavaName: "Ripu Bhāva",
    karaka: "Sun",
    description: "Physical vitality, ailments, obstacles, and service."
  },
  {
    key: "moksha",
    label: "Liberation / Mokṣa",
    bhavaNum: 12,
    bhavaName: "Vyaya Bhāva",
    karaka: "Ketu",
    description: "Loss, foreign travel, dreams, charity, and liberation."
  }
];

export interface PlanetPosition {
  planet: string;
  sign: string;
  signNum: number; // 1-12
  house: number; // 1-12
  dignity: "exalted" | "debilitated" | "own-sign" | "mula-trikona" | "neutral" | "friendly" | "inimical";
  degree: number;
  vargottama?: boolean;
}

export interface ChartDefinition {
  id: string;
  name: string;
  lagnaSign: string;
  lagnaSignNum: number;
  planets: Record<string, PlanetPosition>;
}

export const CHARTS: ChartDefinition[] = [
  {
    id: "virgo-teach",
    name: "Virgo (Kanyā) Teaching Chart",
    lagnaSign: "Virgo",
    lagnaSignNum: 6,
    planets: {
      ME: { planet: "Mercury", sign: "Virgo", signNum: 6, house: 1, dignity: "exalted", degree: 15, vargottama: true },
      SA: { planet: "Saturn", sign: "Gemini", signNum: 3, house: 10, dignity: "neutral", degree: 12 },
      JU: { planet: "Jupiter", sign: "Aquarius", signNum: 11, house: 6, dignity: "neutral", degree: 8 },
      SU: { planet: "Sun", sign: "Cancer", signNum: 4, house: 11, dignity: "friendly", degree: 20 },
      MO: { planet: "Moon", sign: "Aries", signNum: 1, house: 8, dignity: "neutral", degree: 14 },
      VE: { planet: "Venus", sign: "Libra", signNum: 7, house: 2, dignity: "own-sign", degree: 10 },
      MA: { planet: "Mars", sign: "Leo", signNum: 5, house: 12, dignity: "neutral", degree: 18 }
    }
  },
  {
    id: "aries-teach",
    name: "Aries (Meṣa) Teaching Chart",
    lagnaSign: "Aries",
    lagnaSignNum: 1,
    planets: {
      ME: { planet: "Mercury", sign: "Pisces", signNum: 12, house: 12, dignity: "debilitated", degree: 15 },
      SA: { planet: "Saturn", sign: "Aries", signNum: 1, house: 1, dignity: "debilitated", degree: 20 },
      JU: { planet: "Jupiter", sign: "Cancer", signNum: 4, house: 4, dignity: "exalted", degree: 5 },
      SU: { planet: "Sun", sign: "Leo", signNum: 5, house: 5, dignity: "own-sign", degree: 10 },
      MO: { planet: "Moon", sign: "Taurus", signNum: 2, house: 2, dignity: "exalted", degree: 3 },
      VE: { planet: "Venus", sign: "Virgo", signNum: 6, house: 6, dignity: "debilitated", degree: 27 },
      MA: { planet: "Mars", sign: "Aries", signNum: 1, house: 1, dignity: "own-sign", degree: 18 }
    }
  }
];

export interface DashaPeriod {
  ageStart: number;
  ageEnd: number;
  md: string;
  ad: string;
}

export const VIRGO_DASHAS: DashaPeriod[] = [
  { ageStart: 0, ageEnd: 15, md: "VE", ad: "JU" },
  { ageStart: 15, ageEnd: 25, md: "SU", ad: "ME" },
  { ageStart: 25, ageEnd: 32, md: "MO", ad: "MA" },
  { ageStart: 32, ageEnd: 35, md: "ME", ad: "ME" },
  { ageStart: 35, ageEnd: 39, md: "ME", ad: "SA" },
  { ageStart: 39, ageEnd: 48, md: "ME", ad: "JU" },
  { ageStart: 48, ageEnd: 60, md: "SA", ad: "SU" },
  { ageStart: 60, ageEnd: 80, md: "SA", ad: "SA" },
  { ageStart: 80, ageEnd: 120, md: "JU", ad: "MO" }
];

export const ARIES_DASHAS: DashaPeriod[] = [
  { ageStart: 0, ageEnd: 12, md: "SA", ad: "ME" },
  { ageStart: 12, ageEnd: 24, md: "JU", ad: "JU" },
  { ageStart: 24, ageEnd: 30, md: "SU", ad: "VE" },
  { ageStart: 30, ageEnd: 35, md: "MA", ad: "SA" },
  { ageStart: 35, ageEnd: 42, md: "MA", ad: "JU" },
  { ageStart: 42, ageEnd: 60, md: "MO", ad: "VE" },
  { ageStart: 60, ageEnd: 120, md: "VE", ad: "ME" }
];

export const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function getSignOfHouse(lagnaSignNum: number, houseNum: number): number {
  const num = (lagnaSignNum + houseNum - 1) % 12;
  return num === 0 ? 12 : num;
}
