import { type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { computeCaraPeriod, getPeriodRashi, type CaraPeriodRashi } from "../cara-period-calculator/data";

export type AnchorMode = "lagna" | "moon";

export interface SequencePreset {
  slug: string;
  label: string;
  lagnaIndex: number;
  moonIndex: number;
  anchorMode: AnchorMode;
  note: string;
}

export interface SequenceStep {
  order: number;
  rashi: CaraPeriodRashi;
  periodYears: number;
  cumulativeStart: number;
  cumulativeEnd: number;
}

export const RASHI_ASCII_NAMES = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanus",
  "Makara",
  "Kumbha",
  "Mina",
];

export const RASHI_SHORT_NAMES = ["Me", "Vr", "Mi", "Ka", "Si", "Kn", "Tu", "Sc", "Dh", "Ma", "Ku", "Pi"];

export const SAMPLE_LORD_PLACEMENTS: Record<GrahaSlug, number> = {
  surya: 8,
  candra: 10,
  mangala: 7,
  budha: 0,
  guru: 5,
  shukra: 4,
  shani: 4,
  rahu: 8,
  ketu: 7,
};

export const SEQUENCE_PRESETS: SequencePreset[] = [
  {
    slug: "mithuna-lagna",
    label: "Mithuna Lagna",
    lagnaIndex: 2,
    moonIndex: 3,
    anchorMode: "lagna",
    note: "Odd-footed start: the whole sequence moves forward.",
  },
  {
    slug: "karka-lagna",
    label: "Karka Lagna",
    lagnaIndex: 3,
    moonIndex: 4,
    anchorMode: "lagna",
    note: "Even-footed start: the whole sequence reverses.",
  },
  {
    slug: "moon-anchor",
    label: "Moon anchor",
    lagnaIndex: 4,
    moonIndex: 11,
    anchorMode: "moon",
    note: "Only the anchor changes; the same parity machinery runs.",
  },
];

export function getRashiName(index: number) {
  return RASHI_ASCII_NAMES[((index % 12) + 12) % 12];
}

export function getRashiShortName(index: number) {
  return RASHI_SHORT_NAMES[((index % 12) + 12) % 12];
}

export function sequenceDirection(startIndex: number) {
  return getPeriodRashi(startIndex).parity === "odd" ? "forward" : "backward";
}

export function buildCaraSequence(startIndex: number) {
  const direction = sequenceDirection(startIndex);
  return Array.from({ length: 12 }, (_, step) => {
    const index = direction === "forward" ? startIndex + step : startIndex - step;
    return getPeriodRashi(index);
  });
}

export function periodForRashi(index: number) {
  const rashi = getPeriodRashi(index);
  const lordIndex = SAMPLE_LORD_PLACEMENTS[rashi.primaryLord];
  return computeCaraPeriod(index, lordIndex);
}

export function buildSequenceTimeline(startIndex: number): SequenceStep[] {
  let running = 0;
  return buildCaraSequence(startIndex).map((rashi, index) => {
    const period = periodForRashi(rashi.index).years;
    const step = {
      order: index + 1,
      rashi,
      periodYears: period,
      cumulativeStart: running,
      cumulativeEnd: running + period,
    };
    running += period;
    return step;
  });
}

export function totalYearsForSequence(startIndex: number) {
  return buildSequenceTimeline(startIndex).reduce((sum, step) => sum + step.periodYears, 0);
}
