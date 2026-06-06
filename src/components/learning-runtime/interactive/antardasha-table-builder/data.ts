import { DASHA_LORDS, TOTAL_CYCLE_YEARS, rotatedSequence, type DashaLord } from "../dasha-timeline/data";

export interface AntardashaPreset {
  slug: string;
  label: string;
  mdLordIndex: number;
  mdYears: number;
  startDate: string;
  note: string;
}

export interface AntardashaRow {
  sequenceNumber: number;
  lord: DashaLord;
  formula: string;
  years: number;
  startOffsetYears: number;
  endOffsetYears: number;
  startDate: Date;
  endDate: Date;
}

export const ANTARDASHA_PRESETS: AntardashaPreset[] = [
  {
    slug: "sun-md",
    label: "Sun MD, 6 years",
    mdLordIndex: 3,
    mdYears: 6,
    startDate: "2026-01-01",
    note: "Lesson worked example: Su -> Mo -> Ma -> Ra -> Ju -> Sa -> Me -> Ke -> Ve.",
  },
  {
    slug: "moon-md",
    label: "Moon MD, 10 years",
    mdLordIndex: 4,
    mdYears: 10,
    startDate: "2026-01-01",
    note: "Example 2 in the lesson: the sequence starts from Moon.",
  },
  {
    slug: "saturn-md",
    label: "Saturn MD, 19 years",
    mdLordIndex: 8,
    mdYears: 19,
    startDate: "2026-01-01",
    note: "Long parent period; compare with the previous recursive-ratio lesson.",
  },
];

export function getLordByIndex(index: number): DashaLord {
  return DASHA_LORDS.find((lord) => lord.index === index) ?? DASHA_LORDS[0];
}

export function buildAntardashaRows(mdLordIndex: number, mdYears: number, startDateString: string): AntardashaRow[] {
  const startDate = parseDateInput(startDateString);
  let running = 0;

  return rotatedSequence(mdLordIndex - 1).map((lord, index) => {
    const years = (mdYears * lord.years) / TOTAL_CYCLE_YEARS;
    const startOffsetYears = running;
    const endOffsetYears = running + years;

    const row = {
      sequenceNumber: index + 1,
      lord,
      formula: `(${formatShortNumber(mdYears)} x ${lord.years}) / ${TOTAL_CYCLE_YEARS}`,
      years,
      startOffsetYears,
      endOffsetYears,
      startDate: addYearsAsDays(startDate, startOffsetYears),
      endDate: addYearsAsDays(startDate, endOffsetYears),
    };

    running = endOffsetYears;
    return row;
  });
}

export function sumAntardashaRows(rows: AntardashaRow[]): number {
  return rows.reduce((sum, row) => sum + row.years, 0);
}

export function addYearsAsDays(date: Date, years: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + Math.round(years * 365.25));
  return result;
}

export function parseDateInput(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date("2026-01-01T00:00:00") : parsed;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function formatYearsMonthsDays(years: number): string {
  const wholeYears = Math.floor(years);
  const monthFloat = (years - wholeYears) * 12;
  const wholeMonths = Math.floor(monthFloat);
  const days = Math.round((monthFloat - wholeMonths) * 30);
  const parts: string[] = [];

  if (wholeYears > 0) parts.push(`${wholeYears}y`);
  if (wholeMonths > 0) parts.push(`${wholeMonths}m`);
  if (days > 0) parts.push(`${days}d`);

  return parts.length > 0 ? parts.join(" ") : "0d";
}

export function formatShortNumber(value: number): string {
  return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}
