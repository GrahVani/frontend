import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type YogaOverlayPresetSlug = "strong-raja" | "moderate-pmpy" | "weak-dhana";
export type DignityGrade = "excellent" | "friendly" | "neutral" | "debilitated";

export interface YogaOverlayPreset {
  slug: YogaOverlayPresetSlug;
  label: string;
  yoga: string;
  yogaType: string;
  shadbala: number;
  sav: number;
  dignity: DignityGrade;
  combust: boolean;
  retrograde: boolean;
  reading: string;
  color: string;
}

export const DIGNITY_OPTIONS: Record<DignityGrade, { label: string; score: number; note: string }> = {
  excellent: {
    label: "Exalted / own",
    score: 88,
    note: "Dignity reinforces the yoga planet's promise.",
  },
  friendly: {
    label: "Friendly",
    score: 72,
    note: "The planet has usable environmental support.",
  },
  neutral: {
    label: "Neutral",
    score: 58,
    note: "Dignity neither strongly helps nor strongly harms.",
  },
  debilitated: {
    label: "Debilitated",
    score: 32,
    note: "Dignity materially weakens delivery.",
  },
};

export const YOGA_OVERLAY_PRESETS: YogaOverlayPreset[] = [
  {
    slug: "strong-raja",
    label: "Strong yoga",
    yoga: "4L-5L Raja Yoga",
    yogaType: "Raja",
    shadbala: 84,
    sav: 36,
    dignity: "excellent",
    combust: false,
    retrograde: false,
    reading: "All four factors align, so the yoga can be read with confidence.",
    color: grahas.surya.primary,
  },
  {
    slug: "moderate-pmpy",
    label: "Moderate yoga",
    yoga: "Ruchaka Yoga",
    yogaType: "PMPY",
    shadbala: 68,
    sav: 29,
    dignity: "friendly",
    combust: false,
    retrograde: true,
    reading: "Mixed signals: real potency, but the result should be stated as partial or situational.",
    color: grahas.mangala.primary,
  },
  {
    slug: "weak-dhana",
    label: "Weak yoga",
    yoga: "2L-11L Dhana Yoga",
    yogaType: "Dhana",
    shadbala: 48,
    sav: 21,
    dignity: "debilitated",
    combust: true,
    retrograde: false,
    reading: "The yoga is present, but weak planets and low support make it underdeliver.",
    color: grahas.shukra.primary,
  },
];

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function compositeScore({
  shadbala,
  sav,
  dignity,
  combust,
  retrograde,
}: {
  shadbala: number;
  sav: number;
  dignity: DignityGrade;
  combust: boolean;
  retrograde: boolean;
}) {
  const savScore = Math.min(100, sav * 2.5);
  const dignityScore = DIGNITY_OPTIONS[dignity].score;
  const statusAdjustment = (combust ? -18 : 0) + (retrograde ? 10 : 0);
  return clampScore(shadbala * 0.38 + savScore * 0.26 + dignityScore * 0.24 + 12 + statusAdjustment);
}

export function gradeLabel(score: number) {
  if (score >= 75) return "Strong";
  if (score >= 55) return "Moderate";
  return "Weak";
}
