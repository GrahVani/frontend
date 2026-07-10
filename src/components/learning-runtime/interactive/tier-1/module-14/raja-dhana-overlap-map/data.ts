import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type YogaClass = "raja-only" | "dhana-only" | "both" | "neither";

export interface HouseSetInfo {
  house: number;
  label: string;
  iast: string;
  roles: string[];
  color: string;
}

export interface OverlapCase {
  slug: string;
  label: string;
  houses: [number, number];
  note: string;
}

export const KENDRA_HOUSES = [1, 4, 7, 10] as const;
export const TRIKONA_HOUSES = [1, 5, 9] as const;
export const WEALTH_HOUSES = [2, 5, 9, 11] as const;

export const HOUSE_SET_INFO: HouseSetInfo[] = [
  { house: 1, label: "Self / throne", iast: "Lagna", roles: ["Kendra", "Trikona"], color: grahas.surya.primary },
  { house: 2, label: "Held wealth", iast: "Dhana", roles: ["Wealth"], color: grahas.shukra.primary },
  { house: 3, label: "Effort", iast: "Sahaja", roles: ["Neither"], color: grahas.shani.primary },
  { house: 4, label: "Seat", iast: "Sukha", roles: ["Kendra"], color: grahas.candra.primary },
  { house: 5, label: "Merit", iast: "Pūrva-puṇya", roles: ["Trikona", "Wealth"], color: grahas.budha.primary },
  { house: 6, label: "Obstacles", iast: "Ripu", roles: ["Neither"], color: grahas.mangala.primary },
  { house: 7, label: "Public field", iast: "Yuvati", roles: ["Kendra"], color: grahas.shukra.primary },
  { house: 8, label: "Vulnerability", iast: "Randhra", roles: ["Neither"], color: grahas.shani.primary },
  { house: 9, label: "Bhagya", iast: "Dharma", roles: ["Trikona", "Wealth"], color: grahas.guru.primary },
  { house: 10, label: "Action", iast: "Karma", roles: ["Kendra"], color: grahas.surya.primary },
  { house: 11, label: "Gains", iast: "Lābha", roles: ["Wealth"], color: grahas.candra.primary },
  { house: 12, label: "Release", iast: "Vyaya", roles: ["Neither"], color: grahas.shani.primary },
];

export const OVERLAP_CASES: OverlapCase[] = [
  {
    slug: "dual",
    label: "Canonical dual",
    houses: [5, 9],
    note: "Both wealth houses and both trikonas: dhana plus raja-grade.",
  },
  {
    slug: "pure-raja",
    label: "Pure raja",
    houses: [4, 5],
    note: "Kendra plus trikona, but the 4th is not a wealth house.",
  },
  {
    slug: "pure-dhana",
    label: "Pure dhana",
    houses: [2, 11],
    note: "Both wealth houses, but neither is kendra-trikona for raja logic.",
  },
];

export const CLASS_META: Record<YogaClass, { label: string; devanagari: string; description: string; color: string }> = {
  both: {
    label: "Both raja-grade and dhana",
    devanagari: "धनराज",
    description: "Wealth and eminence coincide. The 5th-9th lord relationship is the canonical dual.",
    color: grahas.guru.primary,
  },
  "raja-only": {
    label: "Pure raja",
    devanagari: "राज",
    description: "Authority or eminence logic is present, but it is not a wealth-house pair.",
    color: grahas.surya.primary,
  },
  "dhana-only": {
    label: "Pure dhana",
    devanagari: "धन",
    description: "Wealth-house logic is present, but the pair does not create raja classification.",
    color: grahas.shukra.primary,
  },
  neither: {
    label: "Neither core yoga",
    devanagari: "न",
    description: "This pair is outside the simplified raja/dhana classification taught here.",
    color: grahas.shani.primary,
  },
};

export function isKendra(house: number) {
  return KENDRA_HOUSES.includes(house as (typeof KENDRA_HOUSES)[number]);
}

export function isTrikona(house: number) {
  return TRIKONA_HOUSES.includes(house as (typeof TRIKONA_HOUSES)[number]);
}

export function isWealthHouse(house: number) {
  return WEALTH_HOUSES.includes(house as (typeof WEALTH_HOUSES)[number]);
}

export function getHouseInfo(house: number) {
  return HOUSE_SET_INFO.find((item) => item.house === house) ?? HOUSE_SET_INFO[0];
}

export function classifyRelationship(first: number, second: number): YogaClass {
  const sorted = [first, second].sort((a, b) => a - b).join("-");
  const dhana = isWealthHouse(first) && isWealthHouse(second);
  const raja = (isKendra(first) && isTrikona(second)) || (isKendra(second) && isTrikona(first)) || sorted === "5-9";

  if (raja && dhana) return "both";
  if (raja) return "raja-only";
  if (dhana) return "dhana-only";
  return "neither";
}
