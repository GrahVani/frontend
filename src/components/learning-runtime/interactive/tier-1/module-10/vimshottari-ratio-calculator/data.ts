import { DASHA_LORDS, TOTAL_CYCLE_YEARS, rotatedSequence, type DashaLord } from "../dasha-timeline/data";

export interface RatioPreset {
  slug: string;
  label: string;
  parentLordIndex: number;
  parentYears: number;
  note: string;
}

export interface RatioSubPeriod {
  lord: DashaLord;
  sequenceNumber: number;
  numerator: number;
  years: number;
  startYears: number;
  endYears: number;
  percentOfParent: number;
}

export const RATIO_PRESETS: RatioPreset[] = [
  {
    slug: "saturn-md",
    label: "Saturn MD, 19 years",
    parentLordIndex: 8,
    parentYears: 19,
    note: "Lesson table: Sa -> Me -> Ke -> Ve -> Su -> Mo -> Ma -> Ra -> Ju.",
  },
  {
    slug: "mercury-bhukti",
    label: "Mercury parent, 2.692 years",
    parentLordIndex: 9,
    parentYears: 323 / 120,
    note: "A Saturn-Mercury bhukti drilled down to the next level.",
  },
  {
    slug: "venus-md",
    label: "Venus MD, 20 years",
    parentLordIndex: 2,
    parentYears: 20,
    note: "Longest mahadasha; helpful for seeing proportion without changing the rule.",
  },
  {
    slug: "sun-md",
    label: "Sun MD, 6 years",
    parentLordIndex: 3,
    parentYears: 6,
    note: "Shortest mahadasha; the same ratio compresses into a smaller parent.",
  },
];

export function getLordByIndex(index: number): DashaLord {
  return DASHA_LORDS.find((lord) => lord.index === index) ?? DASHA_LORDS[0];
}

export function computeRatioSubPeriods(parentLordIndex: number, parentYears: number): RatioSubPeriod[] {
  let running = 0;

  return rotatedSequence(parentLordIndex - 1).map((lord, index) => {
    const numerator = parentYears * lord.years;
    const years = numerator / TOTAL_CYCLE_YEARS;
    const subPeriod: RatioSubPeriod = {
      lord,
      sequenceNumber: index + 1,
      numerator,
      years,
      startYears: running,
      endYears: running + years,
      percentOfParent: (lord.years / TOTAL_CYCLE_YEARS) * 100,
    };
    running += years;
    return subPeriod;
  });
}

export function sumSubPeriods(subPeriods: RatioSubPeriod[]): number {
  return subPeriods.reduce((total, subPeriod) => total + subPeriod.years, 0);
}

export function yearsToParts(years: number): { years: number; months: number; days: number } {
  const wholeYears = Math.floor(years);
  const monthFloat = (years - wholeYears) * 12;
  const wholeMonths = Math.floor(monthFloat);
  const days = Math.round((monthFloat - wholeMonths) * 30.4375);

  if (days >= 30) {
    return { years: wholeYears, months: wholeMonths + 1, days: 0 };
  }

  if (wholeMonths >= 12) {
    return { years: wholeYears + 1, months: 0, days };
  }

  return { years: wholeYears, months: wholeMonths, days };
}

export function formatYearsMonthsDays(years: number): string {
  const parts = yearsToParts(years);
  const output: string[] = [];

  if (parts.years > 0) output.push(`${parts.years}y`);
  if (parts.months > 0) output.push(`${parts.months}m`);
  if (parts.days > 0) output.push(`${parts.days}d`);

  return output.length > 0 ? output.join(" ") : "0d";
}

export function formatDecimalYears(years: number): string {
  return `${years.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")} yr`;
}
