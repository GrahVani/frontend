/**
 * Vimśottarī Daśā Balance Calculator — Static Data & Computation Engine
 *
 * Pedagogical calculator for Lesson 10.2.1.
 * Performs client-side computation of the four-step balance calculation.
 *
 * Design system: Grahvani Learning Design System
 */

import { DASHA_LORDS, type DashaLord } from "../dasha-timeline/data";
import { NAKSHATRAS, type NakshatraData } from "../nakshatra-data";

/* ── Constants ─────────────────────────────────────────────────────────── */

/** Each nakṣatra spans 13°20′ = 800 arc-minutes = 13.333... degrees */
export const NAKSHATRA_SPAN_DEGREES = 13 + 20 / 60;
export const NAKSHATRA_SPAN_ARC_MINUTES = 800;
export const PADA_SPAN_DEGREES = 3 + 20 / 60;

/* ── Rāśi table ────────────────────────────────────────────────────────── */

export interface RashiData {
  num: number;
  name: string;
  nameIAST: string;
  devanagari: string;
  startLongitude: number; // total sidereal longitude from 0° Aries
}

export const RASHIS: RashiData[] = [
  { num: 1,  name: "Aries",       nameIAST: "Meṣa",       devanagari: "मेष",     startLongitude: 0 },
  { num: 2,  name: "Taurus",      nameIAST: "Vṛṣabha",    devanagari: "वृषभ",    startLongitude: 30 },
  { num: 3,  name: "Gemini",      nameIAST: "Mithuna",    devanagari: "मिथुन",    startLongitude: 60 },
  { num: 4,  name: "Cancer",      nameIAST: "Karka",      devanagari: "कर्क",     startLongitude: 90 },
  { num: 5,  name: "Leo",         nameIAST: "Siṁha",      devanagari: "सिंह",     startLongitude: 120 },
  { num: 6,  name: "Virgo",       nameIAST: "Kanyā",      devanagari: "कन्या",    startLongitude: 150 },
  { num: 7,  name: "Libra",       nameIAST: "Tulā",       devanagari: "तुला",     startLongitude: 180 },
  { num: 8,  name: "Scorpio",     nameIAST: "Vṛścika",    devanagari: "वृश्चिक",  startLongitude: 210 },
  { num: 9,  name: "Sagittarius", nameIAST: "Dhanus",     devanagari: "धनुस्",   startLongitude: 240 },
  { num: 10, name: "Capricorn",   nameIAST: "Makara",     devanagari: "मकर",     startLongitude: 270 },
  { num: 11, name: "Aquarius",    nameIAST: "Kumbha",     devanagari: "कुम्भ",    startLongitude: 300 },
  { num: 12, name: "Pisces",      nameIAST: "Mīna",       devanagari: "मीन",      startLongitude: 330 },
];

/* ── Nakṣatra with Vimśottarī lord mapping ─────────────────────────────── */

export interface NakshatraLordMapping {
  nakshatra: NakshatraData;
  lord: DashaLord;
  startLongitude: number; // total sidereal longitude where this nakṣatra begins
}

export const NAKSHATRA_MAPPINGS: NakshatraLordMapping[] = NAKSHATRAS.map((nakshatra) => {
  const lordIndex = (nakshatra.num - 1) % DASHA_LORDS.length;
  const startLongitude = (nakshatra.num - 1) * NAKSHATRA_SPAN_DEGREES;
  return {
    nakshatra,
    lord: DASHA_LORDS[lordIndex],
    startLongitude,
  };
});

/* ── Degree conversion helpers ─────────────────────────────────────────── */

export interface DMS {
  d: number;
  m: number;
  s: number;
}

export function toDms(deg: number): DMS {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  // Handle rounding edge case where s == 60
  if (s >= 60) {
    return toDms(deg + (s >= 60 ? (60 - s) / 3600 : 0));
  }
  return { d, m, s };
}

export function dmsToDecimal(d: number, m: number, s: number): number {
  return d + m / 60 + s / 3600;
}

export function formatDms(deg: number): string {
  const { d, m, s } = toDms(deg);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

export function formatArcMinutes(totalMinutes: number): string {
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${degrees}° ${minutes.toString().padStart(2, "0")}′`;
}

export function formatDecimal(deg: number, places = 4): string {
  return `${deg.toFixed(places)}°`;
}

/* ── Year-month-day conversion ─────────────────────────────────────────── */

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
  if (ymd.years > 0) parts.push(`${ymd.years} year${ymd.years !== 1 ? "s" : ""}`);
  if (ymd.months > 0) parts.push(`${ymd.months} month${ymd.months !== 1 ? "s" : ""}`);
  if (ymd.days > 0) parts.push(`${ymd.days} day${ymd.days !== 1 ? "s" : ""}`);
  return parts.length > 0 ? parts.join(", ") : "0 days";
}

/* ── Core computation ──────────────────────────────────────────────────── */

export interface BalanceResult {
  /** Step 1 inputs */
  moonLongitude: number; // total sidereal longitude 0-360
  rashi: RashiData;
  rashiLongitude: number; // longitude within rāśi

  /** Step 2 outputs */
  nakshatraMapping: NakshatraLordMapping;
  pada: number;
  nakshatraStartLongitude: number;
  nakshatraEndLongitude: number;

  /** Step 3 outputs */
  elapsedDegrees: number; // degrees Moon has moved into nakṣatra
  elapsedArcMinutes: number;
  fractionConsumed: number;
  fractionRemaining: number;

  /** Step 4 outputs */
  fullMahadashaYears: number;
  balanceYears: number;
  balanceYmd: YMD;

  /** Warning flags */
  isNearBoundary: boolean;
  boundaryDistanceArcMinutes: number;
}

/**
 * Compute the Vimśottarī daśā balance from the Moon's total sidereal longitude.
 * @param moonLongitude — total sidereal longitude in decimal degrees (0–360)
 */
export function computeBalance(moonLongitude: number): BalanceResult {
  const normalized = ((moonLongitude % 360) + 360) % 360;

  // Step 1: Rāśi
  const rashiIndex = Math.floor(normalized / 30);
  const rashi = RASHIS[rashiIndex];
  const rashiLongitude = normalized - rashi.startLongitude;

  // Step 2: Nakṣatra & lord
  const nakshatraIndex = Math.min(Math.floor(normalized / NAKSHATRA_SPAN_DEGREES), 26);
  const nakshatraMapping = NAKSHATRA_MAPPINGS[nakshatraIndex];
  const nakshatraStartLongitude = nakshatraMapping.startLongitude;
  const nakshatraEndLongitude = nakshatraStartLongitude + NAKSHATRA_SPAN_DEGREES;

  // Pāda: 4 quarters of 3°20′ each
  const elapsedInNakshatra = normalized - nakshatraStartLongitude;
  const pada = Math.min(Math.floor(elapsedInNakshatra / PADA_SPAN_DEGREES) + 1, 4);

  // Step 3: Fraction
  const elapsedDegrees = elapsedInNakshatra;
  const elapsedArcMinutes = elapsedDegrees * 60;
  const fractionConsumed = elapsedArcMinutes / NAKSHATRA_SPAN_ARC_MINUTES;
  const fractionRemaining = 1 - fractionConsumed;

  // Step 4: Balance
  const fullMahadashaYears = nakshatraMapping.lord.years;
  const balanceYears = fractionRemaining * fullMahadashaYears;
  const balanceYmd = yearsToYmd(balanceYears);

  // Boundary warning: within ~0.1° = 6 arc-minutes of either boundary
  const toStartBoundary = elapsedArcMinutes;
  const toEndBoundary = NAKSHATRA_SPAN_ARC_MINUTES - elapsedArcMinutes;
  const boundaryDistanceArcMinutes = Math.min(toStartBoundary, toEndBoundary);
  const isNearBoundary = boundaryDistanceArcMinutes < 6; // < 0.1°

  return {
    moonLongitude: normalized,
    rashi,
    rashiLongitude,
    nakshatraMapping,
    pada,
    nakshatraStartLongitude,
    nakshatraEndLongitude,
    elapsedDegrees,
    elapsedArcMinutes,
    fractionConsumed,
    fractionRemaining,
    fullMahadashaYears,
    balanceYears,
    balanceYmd,
    isNearBoundary,
    boundaryDistanceArcMinutes,
  };
}

/* ── Preset scenarios from worked examples ─────────────────────────────── */

export interface PresetScenario {
  slug: string;
  label: string;
  moonLongitude: number; // total sidereal longitude
  description: string;
}

export const PRESETS: PresetScenario[] = [
  {
    slug: "example-1",
    label: "Example 1 — Pūrva-Aṣāḍhā (Lesson)",
    moonLongitude: 240 + dmsToDecimal(23, 14, 17), // 23°14′17″ Sagittarius = 263°14′17″
    description: "Moon at 23°14′17″ Dhanu → Pūrva-Aṣāḍhā, Jupiter lord. Expected balance: ~4y 1m 11d.",
  },
  {
    slug: "example-2",
    label: "Example 2 — 0°00′ Aśvinī (Boundary)",
    moonLongitude: 0,
    description: "Moon at exact start of Aśvinī → Ketu lord. Expected balance: exactly 7 years.",
  },
  {
    slug: "example-3",
    label: "Example 3 — Near boundary (Critical)",
    moonLongitude: dmsToDecimal(13, 19, 45), // 13°19′45″ Aries — just before Bharaṇī
    description: "Moon 15″ before Bharaṇī boundary → Aśvinī, Ketu lord. Expected balance: ~19 hours.",
  },
  {
    slug: "example-4",
    label: "Example 4 — 29°59′ Mīna (End of Revatī)",
    moonLongitude: 330 + dmsToDecimal(29, 59, 0), // 29°59′ Pisces = 359°59′
    description: "Moon near end of Revatī → Mercury lord. Tiny remaining balance, then Ketu.",
  },
];

/* ── Subsequent mahādaśā preview ───────────────────────────────────────── */

export interface SubsequentMahadasha {
  lord: DashaLord;
  startOffsetYears: number; // years from birth when this MD starts
  durationYears: number;
}

/**
 * Generate the next N mahādaśās after the starting one.
 */
export function getSubsequentMahadashas(startLordIndex: number, balanceYears: number, count = 3): SubsequentMahadasha[] {
  const result: SubsequentMahadasha[] = [];
  let offset = balanceYears;
  for (let i = 0; i < count; i++) {
    const lordIdx = (startLordIndex + i) % DASHA_LORDS.length;
    const nextLordIdx = (startLordIndex + i + 1) % DASHA_LORDS.length;
    const duration = DASHA_LORDS[lordIdx].years;
    result.push({
      lord: DASHA_LORDS[nextLordIdx],
      startOffsetYears: offset,
      durationYears: DASHA_LORDS[nextLordIdx].years,
    });
    offset += duration;
  }
  return result;
}

/* ── Mistake simulation (Lesson 10.2.2) ────────────────────────────────── */

export type AyanamsaMode = "lahiri" | "tropical" | "krishnamurti";

export const AYANAMSA_OFFSETS: Record<AyanamsaMode, number> = {
  lahiri: 24.0,        // approximate for educational use
  tropical: 0.0,       // no ayanamsa = tropical frame
  krishnamurti: 23.5,  // approximate for educational use
};

export interface MistakeConfig {
  /** Mistake #1: Use tropical frame (0° ayanamsa) instead of sidereal */
  useTropical: boolean;
  /** Mistake #2: Reverse remaining/traversed (use consumed fraction as balance) */
  reverseDirection: boolean;
  /** Mistake #3: Treat DMS as raw decimal (6°40′ → 6.40) */
  naiveDecimal: boolean;
  /** Mistake #4: Override lord years with a wrong value (0 = use correct) */
  wrongYearsOverride: number;
  /** Mistake #5: Use Sun longitude instead of Moon longitude (0 = same as Moon) */
  sunLongitude: number;
  /** Mistake #6: Birth time error in arc-minutes (shifts Moon longitude) */
  timeErrorArcMinutes: number;
}

export interface MistakeResult {
  config: MistakeConfig;
  corruptedInput: number;
  corruptedBalance: BalanceResult;
  correctBalance: BalanceResult;
  /** Human-readable description of what went wrong */
  errorDescription: string;
  /** How many years the corrupted balance is off */
  divergenceYears: number;
  /** Whether divergence exceeds ±1 day threshold */
  exceedsTolerance: boolean;
}

/**
 * Apply a configuration of mistake toggles and return both correct and corrupted results.
 */
export function simulateMistakes(
  moonLongitude: number,
  config: MistakeConfig
): MistakeResult {
  // ── Compute correct result ──
  const correctBalance = computeBalance(moonLongitude);

  // ── Build corrupted input ──
  let corruptedInput = moonLongitude;
  let errorParts: string[] = [];

  // Mistake #6: birth time error shifts Moon position
  if (config.timeErrorArcMinutes !== 0) {
    corruptedInput += config.timeErrorArcMinutes / 60;
    errorParts.push(`birth-time error of ${config.timeErrorArcMinutes}′ shifts Moon by ${(config.timeErrorArcMinutes / 60).toFixed(3)}°`);
  }

  // Mistake #1: tropical frame
  if (config.useTropical) {
    // In tropical frame, nakṣatra is computed from tropical longitude
    // which is sidereal + ayanamsa. So the "mistaken" longitude is:
    corruptedInput += AYANAMSA_OFFSETS.lahiri;
    errorParts.push("tropical longitude used instead of sidereal (no ayanamsa subtracted)");
  }

  // Mistake #5: wrong anchor (Sun instead of Moon)
  if (config.sunLongitude !== 0) {
    corruptedInput = config.sunLongitude;
    errorParts.push("Sun's nakṣatra used as anchor instead of Moon's");
  }

  // Mistake #3: naive decimal — simulate by corrupting the DMS interpretation
  // This is handled at the UI level by showing what 6°40′ → 6.40 does to the fraction
  let naiveDecimalMultiplier = 1;
  if (config.naiveDecimal) {
    // When naive, the user treats minutes as hundredths: e.g. 6°40′ → 6.40°
    // We approximate this effect by scaling the elapsed degrees
    errorParts.push("minutes treated as decimal hundredths (6°40′ → 6.40)");
  }

  // Compute corrupted balance
  let corruptedBalance = computeBalance(corruptedInput);

  // Apply mistake #3 at the result level: recompute with naive decimal elapsed
  if (config.naiveDecimal) {
    const { nakshatraMapping, fractionRemaining: _fr } = corruptedBalance;
    const lord = nakshatraMapping.lord;
    // Simulate: elapsed in nakshatra is interpreted naively
    // e.g. true elapsed = 6.667°, naive elapsed = 6.40°
    // We approximate by scaling the true elapsed by ~0.96 (6.40/6.667)
    const trueElapsed = corruptedBalance.elapsedDegrees;
    const d = Math.floor(trueElapsed);
    const m = (trueElapsed - d) * 60;
    const naiveElapsed = d + m / 100; // wrong: minutes → hundredths
    const naiveArcMinutes = naiveElapsed * 60;
    const naiveFractionConsumed = naiveArcMinutes / NAKSHATRA_SPAN_ARC_MINUTES;
    const naiveFractionRemaining = 1 - naiveFractionConsumed;
    const naiveBalanceYears = naiveFractionRemaining * lord.years;
    corruptedBalance = {
      ...corruptedBalance,
      elapsedDegrees: naiveElapsed,
      elapsedArcMinutes: naiveArcMinutes,
      fractionConsumed: naiveFractionConsumed,
      fractionRemaining: naiveFractionRemaining,
      balanceYears: naiveBalanceYears,
      balanceYmd: yearsToYmd(naiveBalanceYears),
    };
  }

  // Mistake #2: reverse direction (use consumed as remaining)
  if (config.reverseDirection) {
    const { nakshatraMapping, fractionConsumed } = corruptedBalance;
    const lord = nakshatraMapping.lord;
    const reversedBalanceYears = fractionConsumed * lord.years;
    corruptedBalance = {
      ...corruptedBalance,
      fractionRemaining: fractionConsumed,
      fractionConsumed: corruptedBalance.fractionRemaining,
      balanceYears: reversedBalanceYears,
      balanceYmd: yearsToYmd(reversedBalanceYears),
    };
    errorParts.push("traversed fraction used as balance instead of remaining fraction");
  }

  // Mistake #4: wrong MD years
  if (config.wrongYearsOverride !== 0) {
    const { fractionRemaining } = corruptedBalance;
    const wrongBalanceYears = fractionRemaining * config.wrongYearsOverride;
    corruptedBalance = {
      ...corruptedBalance,
      fullMahadashaYears: config.wrongYearsOverride,
      balanceYears: wrongBalanceYears,
      balanceYmd: yearsToYmd(wrongBalanceYears),
    };
    errorParts.push(`wrong mahādaśā years used (${config.wrongYearsOverride} instead of ${correctBalance.fullMahadashaYears})`);
  }

  const divergenceYears = Math.abs(corruptedBalance.balanceYears - correctBalance.balanceYears);
  // ±1 day tolerance ≈ ±0.00274 years
  const exceedsTolerance = divergenceYears > 1 / 365.25;

  return {
    config,
    corruptedInput,
    corruptedBalance,
    correctBalance,
    errorDescription: errorParts.join("; ") || "No mistake simulated",
    divergenceYears,
    exceedsTolerance,
  };
}

/* ── Cross-Check Mode (Lesson 10.2.3) ──────────────────────────────────── */

export interface HandBalanceInput {
  /** Hand-computed balance years */
  years: number;
  months: number;
  days: number;
  /** Slug of the hand-computed starting lord, or empty string */
  lordSlug: string;
}

export interface CrossCheckResult {
  handTotalYears: number;
  engineTotalYears: number;
  divergenceDays: number;
  withinTolerance: boolean;
  /** Diagnosis hint when diverged */
  diagnosis: string;
  /** Severity: 'match' | 'minor' | 'major' | 'critical' */
  severity: "match" | "minor" | "major" | "critical";
}

/**
 * Compare a hand-computed balance against the engine (correct) balance.
 */
export function compareHandVsEngine(
  hand: HandBalanceInput,
  engineBalance: BalanceResult
): CrossCheckResult {
  const handTotalYears = hand.years + hand.months / 12 + hand.days / 365.25;
  const engineTotalYears = engineBalance.balanceYears;
  const divergenceYears = Math.abs(handTotalYears - engineTotalYears);
  const divergenceDays = divergenceYears * 365.25;
  const withinTolerance = divergenceDays <= 1.0;

  let diagnosis = "";
  let severity: CrossCheckResult["severity"] = "match";

  if (withinTolerance) {
    diagnosis = "Match within ±1 day — hand computation confirmed. Small sub-day differences are normal rounding variance.";
    severity = "match";
  } else if (divergenceDays < 7) {
    diagnosis = "Minor gap (1–7 days). Likely causes: decimal-minute rounding, year-month-day conversion approximation, or small DMS rounding. Recheck Steps 3–4.";
    severity = "minor";
  } else if (divergenceDays < 60) {
    diagnosis = "Major gap (weeks to months). Likely causes: reversed direction (remaining↔traversed), naive decimal (6°40′→6.40), or wrong mahādaśā years. Check Lesson 10.2.2 Mistakes #2–#4.";
    severity = "major";
  } else {
    // Check if lords differ
    const handLordIndex = DASHA_LORDS.findIndex(
      (l) => l.grahaSlug === hand.lordSlug || l.name.toLowerCase() === hand.lordSlug.toLowerCase()
    );
    const engineLordIndex = engineBalance.nakshatraMapping.lord.index - 1;
    if (handLordIndex !== -1 && handLordIndex !== engineLordIndex) {
      diagnosis = "Critical gap — different starting lord entirely. Almost certainly ayanāṁśa mismatch (tropical vs sidereal) or wrong anchor planet (Sun/Lagna instead of Moon). Check Lesson 10.2.2 Mistakes #1 and #5.";
    } else {
      diagnosis = "Critical gap (months+). Likely a compound error — review all six mistakes in Lesson 10.2.2 systematically.";
    }
    severity = "critical";
  }

  return {
    handTotalYears,
    engineTotalYears,
    divergenceDays,
    withinTolerance,
    diagnosis,
    severity,
  };
}
