/**
 * Daśā Table Builder — Static Data & Computation Engine
 *
 * Pedagogical component for Lesson 10.2.4.
 * Builds the full mahādaśā table from birth to age 120,
 * and computes bhukti subdivisions using the proportion formula.
 */

import { DASHA_LORDS, type DashaLord } from "../dasha-timeline/data";

/* ── Table row types ───────────────────────────────────────────────────── */

export interface MahadashaRow {
  /** Position in the table (0-indexed) */
  index: number;
  /** The lord of this mahādaśā */
  lord: DashaLord;
  /** Start age in years */
  startAge: number;
  /** End age in years */
  endAge: number;
  /** Duration of this MD in years */
  years: number;
  /** True only for the first (balance) MD */
  isFirst: boolean;
}

export interface BhuktiRow {
  /** The bhukti lord */
  lord: DashaLord;
  /** Bhukti duration in years */
  years: number;
  /** Display formula: (MD × lord) ÷ 120 */
  formula: string;
  /** Start age within this MD */
  startWithinMd: number;
  /** End age within this MD */
  endWithinMd: number;
}

/* ── Year-month-day conversion (shared from calculator) ────────────────── */

export interface YMD {
  years: number;
  months: number;
  days: number;
}

export function yearsToYmd(years: number): YMD {
  const y = Math.floor(years);
  const remainderMonths = (years - y) * 12;
  const m = Math.floor(remainderMonths);
  const d = Math.round((remainderMonths - m) * 30);
  return { years: y, months: m, days: d };
}

export function formatYmd(ymd: YMD): string {
  const parts: string[] = [];
  if (ymd.years > 0) parts.push(`${ymd.years}y`);
  if (ymd.months > 0) parts.push(`${ymd.months}m`);
  if (ymd.days > 0) parts.push(`${ymd.days}d`);
  return parts.length > 0 ? parts.join(" ") : "0d";
}

export function formatDecimalYears(years: number): string {
  return `${years.toFixed(3)} yr`;
}

/* ── Core computation ──────────────────────────────────────────────────── */

/**
 * Build the full mahādaśā table from birth to age 120.
 *
 * @param startLordIndex — 0-based index into DASHA_LORDS (0=Ketu, 1=Venus, …)
 * @param balanceYears — the unspent portion of the first MD in years
 */
export function buildMahadashaTable(startLordIndex: number, balanceYears: number): MahadashaRow[] {
  const rows: MahadashaRow[] = [];
  let currentAge = 0;
  let lordIdx = startLordIndex;
  let isFirst = true;

  while (currentAge < 120 && rows.length < 20) {
    const lord = DASHA_LORDS[lordIdx];
    const years = isFirst ? balanceYears : lord.years;
    const endAge = Math.min(currentAge + years, 120);

    rows.push({
      index: rows.length,
      lord,
      startAge: currentAge,
      endAge,
      years: endAge - currentAge,
      isFirst,
    });

    currentAge = endAge;
    lordIdx = (lordIdx + 1) % DASHA_LORDS.length;
    isFirst = false;

    // Safety: break if we've looped through all 9 lords and still haven't reached 120
    // (this can happen with very small balance values)
    if (rows.length >= 18) break;
  }

  return rows;
}

/**
 * Compute the nine bhuktis within a given mahādaśā.
 *
 * Formula: bhukti = (MD-years × bhukti-lord-years) ÷ 120
 *
 * The bhuktis run in the Vimśottarī sequence starting from the MD-lord.
 *
 * @param mdLordIndex — 0-based index of the mahādaśā lord
 * @param mdYears — years of this mahādaśā (may be partial for the first MD)
 */
export function computeBhuktis(mdLordIndex: number, mdYears: number): BhuktiRow[] {
  const bhuktis: BhuktiRow[] = [];
  let withinMd = 0;

  for (let i = 0; i < DASHA_LORDS.length; i++) {
    const bhuktiLordIdx = (mdLordIndex + i) % DASHA_LORDS.length;
    const bhuktiLord = DASHA_LORDS[bhuktiLordIdx];
    const years = (mdYears * bhuktiLord.years) / 120;
    const formula = `(${mdYears} × ${bhuktiLord.years}) ÷ 120`;

    bhuktis.push({
      lord: bhuktiLord,
      years,
      formula,
      startWithinMd: withinMd,
      endWithinMd: withinMd + years,
    });

    withinMd += years;
  }

  return bhuktis;
}

/* ── Verification helpers ──────────────────────────────────────────────── */

/**
 * Verify that the nine bhuktis sum to the mahādaśā years.
 */
export function verifyBhuktiSum(bhuktis: BhuktiRow[]): { sum: number; matches: boolean } {
  const sum = bhuktis.reduce((acc, b) => acc + b.years, 0);
  // Allow tiny floating-point tolerance
  const matches = Math.abs(sum - bhuktis[0].years * (120 / bhuktis[0].lord.years)) < 0.001;
  return { sum, matches };
}
