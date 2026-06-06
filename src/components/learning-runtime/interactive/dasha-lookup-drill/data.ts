import { DASHA_LORDS, TOTAL_CYCLE_YEARS, rotatedSequence, type DashaLord } from "../dasha-timeline/data";

export interface LookupRow {
  lord: DashaLord;
  sequenceNumber: number;
  startAge: number;
  endAge: number;
  years: number;
}

export interface LookupScenario {
  slug: string;
  label: string;
  ageYears: number;
  ageMonths: number;
  note: string;
}

export interface LookupResult {
  age: number;
  mdRows: LookupRow[];
  adRows: LookupRow[];
  pdRows: LookupRow[];
  md: LookupRow;
  ad: LookupRow;
  pd: LookupRow;
}

export const LOOKUP_SCENARIOS: LookupScenario[] = [
  {
    slug: "worked-example",
    label: "Worked example: 25y 4m",
    ageYears: 25,
    ageMonths: 4,
    note: "Should land in Sun MD, Rahu AD, Venus PD.",
  },
  {
    slug: "venus-md",
    label: "Earlier: 12y 6m",
    ageYears: 12,
    ageMonths: 6,
    note: "A clean Venus MD lookup before the Sun period begins.",
  },
  {
    slug: "sun-mars-edge",
    label: "Boundary practice: 24y 5m",
    ageYears: 24,
    ageMonths: 5,
    note: "Near the Sun-Mars to Sun-Rahu transition zone.",
  },
  {
    slug: "later-sun",
    label: "Later Sun MD: 28y 2m",
    ageYears: 28,
    ageMonths: 2,
    note: "Still in Sun MD, but deeper through the bhukti ledger.",
  },
];

export function ageFromParts(years: number, months: number): number {
  return years + months / 12;
}

export function buildMahadashaLookupRows(startLordIndex: number, balanceYears: number): LookupRow[] {
  const rows: LookupRow[] = [];
  let running = 0;
  let first = true;
  let sequenceIndex = startLordIndex - 1;

  while (running < 120 && rows.length < 18) {
    const lord = DASHA_LORDS[sequenceIndex];
    const years = first ? balanceYears : lord.years;
    rows.push({
      lord,
      sequenceNumber: rows.length + 1,
      startAge: running,
      endAge: running + years,
      years,
    });
    running += years;
    sequenceIndex = (sequenceIndex + 1) % DASHA_LORDS.length;
    first = false;
  }

  return rows;
}

export function buildSubLookupRows(parentLordIndex: number, parentYears: number, parentStartAge: number): LookupRow[] {
  let running = parentStartAge;

  return rotatedSequence(parentLordIndex - 1).map((lord, index) => {
    const years = (parentYears * lord.years) / TOTAL_CYCLE_YEARS;
    const row = {
      lord,
      sequenceNumber: index + 1,
      startAge: running,
      endAge: running + years,
      years,
    };
    running += years;
    return row;
  });
}

export function findCoveringRow(rows: LookupRow[], age: number): LookupRow {
  return rows.find((row) => age >= row.startAge && age < row.endAge) ?? rows[rows.length - 1];
}

export function computeLookup(age: number): LookupResult {
  const mdRows = buildMahadashaLookupRows(1, 3.5);
  const md = findCoveringRow(mdRows, age);
  const adRows = buildSubLookupRows(md.lord.index, md.years, md.startAge);
  const ad = findCoveringRow(adRows, age);
  const pdRows = buildSubLookupRows(ad.lord.index, ad.years, ad.startAge);
  const pd = findCoveringRow(pdRows, age);

  return {
    age,
    mdRows,
    adRows,
    pdRows,
    md,
    ad,
    pd,
  };
}

export function formatAge(age: number): string {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  if (months >= 12) return `${years + 1}y 0m`;
  return `${years}y ${months}m`;
}

export function formatAgeSpan(row: LookupRow): string {
  return `${formatAge(row.startAge)} - ${formatAge(row.endAge)}`;
}

export function isSameLord(a: DashaLord | null, b: DashaLord): boolean {
  return a?.index === b.index;
}
