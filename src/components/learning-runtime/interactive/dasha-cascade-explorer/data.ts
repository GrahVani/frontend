import { DASHA_LORDS, TOTAL_CYCLE_YEARS, rotatedSequence, type DashaLord } from "../dasha-timeline/data";

export type CascadeLevelKey = "md" | "ad" | "pd" | "sd" | "prd";

export type CascadeUnit = "years" | "months" | "days" | "hours" | "minutes";

export interface CascadeLevel {
  key: CascadeLevelKey;
  depth: number;
  abbreviation: string;
  label: string;
  labelIAST: string;
  devanagari: string;
  durationScale: string;
  precision: string;
  parentPhrase: string;
  unit: CascadeUnit;
}

export interface CascadeNode {
  level: CascadeLevel;
  lord: DashaLord;
  parentLord: DashaLord | null;
  years: number;
}

export interface SubPeriod {
  lord: DashaLord;
  years: number;
  proportion: number;
  startYears: number;
  endYears: number;
}

export const CASCADE_LEVELS: CascadeLevel[] = [
  {
    key: "md",
    depth: 1,
    abbreviation: "MD",
    label: "Mahadasha",
    labelIAST: "Mahadasa",
    devanagari: "महादशा",
    durationScale: "6-20 years",
    precision: "Life-phase quality",
    parentPhrase: "The major container",
    unit: "years",
  },
  {
    key: "ad",
    depth: 2,
    abbreviation: "AD",
    label: "Antardasha / Bhukti",
    labelIAST: "Antardasa / Bhukti",
    devanagari: "अन्तर्दशा",
    durationScale: "months-years",
    precision: "Year-scale timing",
    parentPhrase: "Nine bhuktis fill one MD",
    unit: "months",
  },
  {
    key: "pd",
    depth: 3,
    abbreviation: "PD",
    label: "Pratyantardasha",
    labelIAST: "Pratyantardasa",
    devanagari: "प्रत्यन्तर्दशा",
    durationScale: "days-months",
    precision: "Month-scale timing",
    parentPhrase: "Nine PDs fill one bhukti",
    unit: "days",
  },
  {
    key: "sd",
    depth: 4,
    abbreviation: "SD",
    label: "Sukshma",
    labelIAST: "Suksma",
    devanagari: "सूक्ष्म",
    durationScale: "hours-days",
    precision: "Day-scale timing",
    parentPhrase: "Nine SDs fill one PD",
    unit: "hours",
  },
  {
    key: "prd",
    depth: 5,
    abbreviation: "PrD",
    label: "Prana",
    labelIAST: "Prana",
    devanagari: "प्राण",
    durationScale: "minutes-hours",
    precision: "Hour-scale timing",
    parentPhrase: "Nine PrD windows fill one SD",
    unit: "minutes",
  },
];

export const DEFAULT_CASCADE_PATH: Record<CascadeLevelKey, number> = {
  md: 8,
  ad: 9,
  pd: 2,
  sd: 3,
  prd: 4,
};

export const STANDARD_DEPTH_KEYS: CascadeLevelKey[] = ["md", "ad", "pd"];

export function getLordByIndex(index: number): DashaLord {
  return DASHA_LORDS.find((lord) => lord.index === index) ?? DASHA_LORDS[0];
}

export function getLevel(key: CascadeLevelKey): CascadeLevel {
  return CASCADE_LEVELS.find((level) => level.key === key) ?? CASCADE_LEVELS[0];
}

export function getChildLevel(parentKey: CascadeLevelKey): CascadeLevel | null {
  const parentIndex = CASCADE_LEVELS.findIndex((level) => level.key === parentKey);
  return parentIndex >= 0 ? CASCADE_LEVELS[parentIndex + 1] ?? null : null;
}

export function buildSubPeriods(parentLordIndex: number, parentYears: number): SubPeriod[] {
  let running = 0;

  return rotatedSequence(parentLordIndex - 1).map((lord) => {
    const years = (parentYears * lord.years) / TOTAL_CYCLE_YEARS;
    const subPeriod = {
      lord,
      years,
      proportion: lord.years / TOTAL_CYCLE_YEARS,
      startYears: running,
      endYears: running + years,
    };
    running += years;
    return subPeriod;
  });
}

export function buildCascadeNodes(path: Record<CascadeLevelKey, number>): CascadeNode[] {
  const nodes: CascadeNode[] = [];
  let parentYears = getLordByIndex(path.md).years;
  let parentLord: DashaLord | null = null;

  CASCADE_LEVELS.forEach((level, index) => {
    const lord = getLordByIndex(path[level.key]);
    const years = index === 0 ? lord.years : (parentYears * lord.years) / TOTAL_CYCLE_YEARS;

    nodes.push({
      level,
      lord,
      parentLord,
      years,
    });

    parentYears = years;
    parentLord = lord;
  });

  return nodes;
}

export function getParentForLevel(
  levelKey: CascadeLevelKey,
  path: Record<CascadeLevelKey, number>
): CascadeNode | null {
  const nodes = buildCascadeNodes(path);
  const levelIndex = CASCADE_LEVELS.findIndex((level) => level.key === levelKey);
  if (levelIndex <= 0) return null;
  return nodes[levelIndex - 1] ?? null;
}

export function formatCascadeDuration(years: number, unit: CascadeUnit): string {
  if (unit === "years") return `${trimNumber(years)} yr`;

  const months = years * 12;
  if (unit === "months") return months >= 12 ? `${trimNumber(years)} yr` : `${trimNumber(months)} mo`;

  const days = years * 365.25;
  if (unit === "days") return days >= 60 ? `${trimNumber(days / 30.4375)} mo` : `${trimNumber(days)} d`;

  const hours = days * 24;
  if (unit === "hours") return hours >= 48 ? `${trimNumber(hours / 24)} d` : `${trimNumber(hours)} hr`;

  const minutes = hours * 60;
  return minutes >= 120 ? `${trimNumber(minutes / 60)} hr` : `${trimNumber(minutes)} min`;
}

export function trimNumber(value: number): string {
  if (value >= 10) return value.toFixed(1).replace(/\.0$/, "");
  if (value >= 1) return value.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
