/**
 * Cheṣṭā Bala Calculator — Data Engine
 *
 * §7 interactive for Lesson 13.4.1.
 *
 * Provides the eight motional states (cheṣṭā avasthās) and the
 * Sun/Moon convention rules for computing motional strength.
 * Exact per-state virūpas come from the Astro Engine — they are
 * intricate (epicycle / śīghrocca formulas) and vary slightly
 * by tradition.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── Motional states (cheṣṭā avasthās) ──────────────────────────────────── */

export interface MotionState {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  description: string;
  isMaximal: boolean;
  /** Approximate virūpa range — exact values engine-derived */
  approxVirupas: string;
}

export const MOTION_STATES: MotionState[] = [
  {
    key: "vakra",
    nameIAST: "Vakra",
    nameDevanagari: "वक्र",
    english: "Retrograde",
    description:
      "Planet appears to move backward against the zodiac — its most effortful, potent motion.",
    isMaximal: true,
    approxVirupas: "~60 (maximum)",
  },
  {
    key: "anuvakra",
    nameIAST: "Anuvakra",
    nameDevanagari: "अनुवक्र",
    english: "Resuming Retrograde",
    description:
      "Just after or before a station, still moving retrograde but slowing toward stationary.",
    isMaximal: false,
    approxVirupas: "~45–55",
  },
  {
    key: "vikala",
    nameIAST: "Vikala",
    nameDevanagari: "विकल",
    english: "Stationary",
    description:
      "Planet at a station — momentarily motionless in longitude before reversing direction.",
    isMaximal: false,
    approxVirupas: "~30–40",
  },
  {
    key: "manda",
    nameIAST: "Manda",
    nameDevanagari: "मन्द",
    english: "Slow",
    description:
      "Slower than mean speed, but still moving forward (not retrograde).",
    isMaximal: false,
    approxVirupas: "~15–25",
  },
  {
    key: "mandatara",
    nameIAST: "Mandatara",
    nameDevanagari: "मन्दतर",
    english: "Slower",
    description:
      "Even slower than manda — closer to stationary but still advancing.",
    isMaximal: false,
    approxVirupas: "~10–20",
  },
  {
    key: "sama",
    nameIAST: "Sama",
    nameDevanagari: "सम",
    english: "Mean Speed",
    description:
      "Planet moving at its average (mean) daily motion — the baseline.",
    isMaximal: false,
    approxVirupas: "~0–10",
  },
  {
    key: "chara",
    nameIAST: "Chara (Śīghra)",
    nameDevanagari: "चर (शीघ्र)",
    english: "Fast",
    description:
      "Faster than mean speed — approaching perigee (closest to Earth).",
    isMaximal: false,
    approxVirupas: "~5–15",
  },
  {
    key: "atichara",
    nameIAST: "Atichara",
    nameDevanagari: "अतिचर",
    english: "Very Fast",
    description:
      "At or near maximum speed — fastest forward motion in the epicycle.",
    isMaximal: false,
    approxVirupas: "~10–20",
  },
];

/* ─── Planet motion profiles ─────────────────────────────────────────────── */

export type PlanetMotionType = "real" | "sun-convention" | "moon-convention" | "always-retrograde";

export interface PlanetProfile {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  motionType: PlanetMotionType;
  /** Human-readable note on how this planet's cheṣṭā is derived */
  conventionNote: string;
  /** Whether this planet *can* retrograde in reality */
  canRetrograde: boolean;
  /** Approximate mean daily motion in degrees (for context) */
  meanDailyMotion: string;
}

export const PLANET_PROFILES: PlanetProfile[] = [
  {
    grahaSlug: "surya",
    nameIAST: "Sūrya",
    nameDevanagari: "सूर्य",
    motionType: "sun-convention",
    conventionNote:
      "The Sun never retrogrades. By convention, the Sun's cheṣṭā bala equals its āyana bala (strength from declination / tropical position).",
    canRetrograde: false,
    meanDailyMotion: "~0.99°",
  },
  {
    grahaSlug: "candra",
    nameIAST: "Candra",
    nameDevanagari: "चन्द्र",
    motionType: "moon-convention",
    conventionNote:
      "The Moon never retrogrades. By convention, the Moon's cheṣṭā bala equals its pakṣa bala (strength from lunar phase).",
    canRetrograde: false,
    meanDailyMotion: "~13.18°",
  },
  {
    grahaSlug: "mangala",
    nameIAST: "Maṅgala",
    nameDevanagari: "मङ्गल",
    motionType: "real",
    conventionNote:
      "Maṅgala follows the eight motional states. Retrograde (vakra) yields maximal cheṣṭā bala.",
    canRetrograde: true,
    meanDailyMotion: "~0.52°",
  },
  {
    grahaSlug: "budha",
    nameIAST: "Budha",
    nameDevanagari: "बुध",
    motionType: "real",
    conventionNote:
      "Budha follows the eight motional states. Being an inner planet, it retrogrades frequently and strongly.",
    canRetrograde: true,
    meanDailyMotion: "~0.98°",
  },
  {
    grahaSlug: "guru",
    nameIAST: "Guru",
    nameDevanagari: "गुरु",
    motionType: "real",
    conventionNote:
      "Guru follows the eight motional states. Retrograde (vakra) yields maximal cheṣṭā bala.",
    canRetrograde: true,
    meanDailyMotion: "~0.08°",
  },
  {
    grahaSlug: "shukra",
    nameIAST: "Śukra",
    nameDevanagari: "शुक्र",
    motionType: "real",
    conventionNote:
      "Śukra follows the eight motional states. Being an inner planet, it retrogrades frequently and strongly.",
    canRetrograde: true,
    meanDailyMotion: "~0.62°",
  },
  {
    grahaSlug: "shani",
    nameIAST: "Śani",
    nameDevanagari: "शनि",
    motionType: "real",
    conventionNote:
      "Śani follows the eight motional states. Retrograde (vakra) yields maximal cheṣṭā bala.",
    canRetrograde: true,
    meanDailyMotion: "~0.03°",
  },
  {
    grahaSlug: "rahu",
    nameIAST: "Rāhu",
    nameDevanagari: "राहु",
    motionType: "always-retrograde",
    conventionNote:
      "Rāhu is always retrograde (moves backward through the zodiac). Its cheṣṭā bala is always near-maximal.",
    canRetrograde: true,
    meanDailyMotion: "~0.05° (R)",
  },
  {
    grahaSlug: "ketu",
    nameIAST: "Ketu",
    nameDevanagari: "केतु",
    motionType: "always-retrograde",
    conventionNote:
      "Ketu is always retrograde (moves backward through the zodiac). Its cheṣṭā bala is always near-maximal.",
    canRetrograde: true,
    meanDailyMotion: "~0.05° (R)",
  },
];

export const PLANET_PROFILE_MAP: Record<GrahaSlug, PlanetProfile> = {
  surya: PLANET_PROFILES[0],
  candra: PLANET_PROFILES[1],
  mangala: PLANET_PROFILES[2],
  budha: PLANET_PROFILES[3],
  guru: PLANET_PROFILES[4],
  shukra: PLANET_PROFILES[5],
  shani: PLANET_PROFILES[6],
  rahu: PLANET_PROFILES[7],
  ketu: PLANET_PROFILES[8],
};

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface Preset {
  label: string;
  description: string;
  grahaSlug: GrahaSlug;
  /** The state to pre-select / highlight for real-motion planets */
  highlightedState?: string;
  /** Whether to show the convention panel open */
  showConvention: boolean;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Retrograde Śani",
    description: "Śani retrograde → near-maximal cheṣṭā bala (~60 virūpas).",
    grahaSlug: "shani",
    highlightedState: "vakra",
    showConvention: false,
    takeaway: "Vakra (retrograde) = maximum cheṣṭā bala.",
  },
  {
    label: "Sūrya Convention",
    description: "The Sun's cheṣṭā bala is taken as its āyana bala.",
    grahaSlug: "surya",
    showConvention: true,
    takeaway: "Sun → āyana bala (never retrogrades).",
  },
  {
    label: "Candra Convention",
    description: "The Moon's cheṣṭā bala is taken as its pakṣa bala.",
    grahaSlug: "candra",
    showConvention: true,
    takeaway: "Moon → pakṣa bala (never retrogrades).",
  },
];

/* ─── Convention cross-references (for display) ──────────────────────────── */

export interface ConventionDetail {
  grahaSlug: GrahaSlug;
  conventionNameIAST: string;
  conventionNameDevanagari: string;
  conventionEnglish: string;
  briefExplanation: string;
  crossRefLesson: string;
}

export const CONVENTION_DETAILS: Record<
  "surya" | "candra",
  ConventionDetail
> = {
  surya: {
    grahaSlug: "surya",
    conventionNameIAST: "Āyana Bala",
    conventionNameDevanagari: "अयनबलम्",
    conventionEnglish: "Declination Strength",
    briefExplanation:
      "The Sun's cheṣṭā bala is replaced by its āyana bala — strength derived from its tropical position (declination relative to the equator).",
    crossRefLesson: "Lesson 13.3.3 — Kāla Bala / Āyana Bala",
  },
  candra: {
    grahaSlug: "candra",
    conventionNameIAST: "Pakṣa Bala",
    conventionNameDevanagari: "पक्षबलम्",
    conventionEnglish: "Lunar Phase Strength",
    briefExplanation:
      "The Moon's cheṣṭā bala is replaced by its pakṣa bala — strength derived from its phase (brightness / distance from the Sun).",
    crossRefLesson: "Lesson 13.3.4 — Kāla Bala / Pakṣa Bala",
  },
};
