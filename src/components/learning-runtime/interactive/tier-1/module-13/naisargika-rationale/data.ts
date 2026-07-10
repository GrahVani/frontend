/**
 * Naisargika Rationale — Data Engine
 *
 * §7 interactive for Lesson 13.4.3.
 *
 * Provides the graha hierarchy (significance), the luminosity correlate,
 * and the fixed naisargika values for the rationale explorer.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── The seven grahas with hierarchy + luminosity ───────────────────────── */

export interface GrahaRationale {
  grahaSlug: GrahaSlug;
  nameIAST: string;
  nameDevanagari: string;
  naisargikaVirupas: number;
  naisargikaFormatted: string;
  /** Significance in the hierarchy */
  significanceIAST: string;
  significanceDevanagari: string;
  significanceEnglish: string;
  /** Brief doctrinal note */
  doctrineNote: string;
  /** Apparent brightness rank (1 = brightest) */
  luminosityRank: number;
  /** Brightness description */
  luminosityNote: string;
}

export const GRAHA_RATIONALE: GrahaRationale[] = [
  {
    grahaSlug: "surya",
    nameIAST: "Sūrya",
    nameDevanagari: "सूर्य",
    naisargikaVirupas: 60,
    naisargikaFormatted: "60.00",
    significanceIAST: "Ātmā",
    significanceDevanagari: "आत्मा",
    significanceEnglish: "Soul",
    doctrineNote: "The soul-principle — the animating light of consciousness. Highest natural strength.",
    luminosityRank: 1,
    luminosityNote: "The primary luminary — daytime ruler, blindingly bright.",
  },
  {
    grahaSlug: "candra",
    nameIAST: "Candra",
    nameDevanagari: "चन्द्र",
    naisargikaVirupas: 360 / 7,
    naisargikaFormatted: "51.43",
    significanceIAST: "Manas",
    significanceDevanagari: "मनस्",
    significanceEnglish: "Mind",
    doctrineNote: "The mind and emotional body — reflected light, second only to the Sun.",
    luminosityRank: 2,
    luminosityNote: "The secondary luminary — brightest object in the night sky.",
  },
  {
    grahaSlug: "shukra",
    nameIAST: "Śukra",
    nameDevanagari: "शुक्र",
    naisargikaVirupas: 300 / 7,
    naisargikaFormatted: "42.86",
    significanceIAST: "Kāma / Bhoga",
    significanceDevanagari: "काम / भोग",
    significanceEnglish: "Life-affairs / Pleasures",
    doctrineNote: "Venus governs pleasure, attraction, and the arts — third in natural power.",
    luminosityRank: 3,
    luminosityNote: "The brightest planet — often visible even in twilight ('evening star').",
  },
  {
    grahaSlug: "guru",
    nameIAST: "Guru",
    nameDevanagari: "गुरु",
    naisargikaVirupas: 240 / 7,
    naisargikaFormatted: "34.29",
    significanceIAST: "Jñāna / Dharma",
    significanceDevanagari: "ज्ञान / धर्म",
    significanceEnglish: "Wisdom / Guidance",
    doctrineNote: "Jupiter is wisdom, teaching, and dharma — expansive but fourth in natural order.",
    luminosityRank: 4,
    luminosityNote: "Very bright — a prominent 'wandering star' in the night sky.",
  },
  {
    grahaSlug: "budha",
    nameIAST: "Budha",
    nameDevanagari: "बुध",
    naisargikaVirupas: 180 / 7,
    naisargikaFormatted: "25.71",
    significanceIAST: "Buddhi",
    significanceDevanagari: "बुद्धि",
    significanceEnglish: "Intellect",
    doctrineNote: "Mercury is intellect, speech, and commerce — quick but fifth in natural strength.",
    luminosityRank: 5,
    luminosityNote: "Moderately bright — often near the Sun, harder to spot.",
  },
  {
    grahaSlug: "mangala",
    nameIAST: "Maṅgala",
    nameDevanagari: "मङ्गल",
    naisargikaVirupas: 120 / 7,
    naisargikaFormatted: "17.14",
    significanceIAST: "Kriyā / Tejas",
    significanceDevanagari: "क्रिया / तेजस्",
    significanceEnglish: "Action / Energy",
    doctrineNote: "Mars is energy, courage, and conflict — sixth, its power is in action, not natural radiance.",
    luminosityRank: 6,
    luminosityNote: "Moderate — distinctive reddish colour, but not as bright as Venus or Jupiter.",
  },
  {
    grahaSlug: "shani",
    nameIAST: "Śani",
    nameDevanagari: "शनि",
    naisargikaVirupas: 60 / 7,
    naisargikaFormatted: "8.57",
    significanceIAST: "Yama / Niyama",
    significanceDevanagari: "यम / नियम",
    significanceEnglish: "Restriction / Discipline",
    doctrineNote: "Saturn is restraint, time, and discipline — lowest natural strength because its power lies in withholding, not radiating.",
    luminosityRank: 7,
    luminosityNote: "The faintest naked-eye planet — slow, distant, dim.",
  },
];

export const MAX_VIRUPAS = 60;

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface Preset {
  label: string;
  description: string;
  grahaSlug: GrahaSlug;
  compareSlug?: GrahaSlug;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Top and Bottom",
    description: "Sun (ātmā, brightest) = 60; Saturn (restriction, faintest) = 8.57.",
    grahaSlug: "surya",
    compareSlug: "shani",
    takeaway: "Hierarchy and brightness align at both extremes.",
  },
  {
    label: "Venus above Jupiter",
    description: "Venus (42.86) outranks Jupiter (34.29) — matching its greater apparent brightness.",
    grahaSlug: "shukra",
    compareSlug: "guru",
    takeaway: "Luminosity explains why Venus > Jupiter.",
  },
  {
    label: "The Baseline",
    description: "Naisargika is identical in all charts — the floor, not the differentiator.",
    grahaSlug: "candra",
    takeaway: "Variable balas (sthāna, dik, kāla, cheṣṭā, dṛk) do the distinguishing.",
  },
];

/* ─── Variable balas (for baseline reminder) ─────────────────────────────── */

export interface VariableBala {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
}

export const VARIABLE_BALAS: VariableBala[] = [
  { key: "sthana", nameIAST: "Sthāna Bala", nameDevanagari: "स्थानबलम्" },
  { key: "dik", nameIAST: "Dik Bala", nameDevanagari: "दिक्बलम्" },
  { key: "kala", nameIAST: "Kāla Bala", nameDevanagari: "कालबलम्" },
  { key: "cheshta", nameIAST: "Cheṣṭā Bala", nameDevanagari: "चेष्टाबलम्" },
  { key: "drik", nameIAST: "Dṛk Bala", nameDevanagari: "दृग्बलम्" },
];
