import { grahas } from "@/design-tokens/grahvani-learning/colors";

export const VIRUPAS_PER_RUPA = 60;

export type ShadbalaComponentKey = "sthana" | "dik" | "kala" | "cheshta" | "naisargika" | "drik";

export interface ShadbalaComponentOverview {
  key: ShadbalaComponentKey;
  order: number;
  name: string;
  iast: string;
  devanagari: string;
  shortLabel: string;
  measures: string;
  laterChapter: string;
  defaultVirupas: number;
  lowVirupas: number;
  highVirupas: number;
  color: string;
}

export interface ShadbalaPreset {
  key: string;
  label: string;
  note: string;
  values: Record<ShadbalaComponentKey, number>;
}

export const SHADBALA_COMPONENTS: ShadbalaComponentOverview[] = [
  {
    key: "sthana",
    order: 1,
    name: "Sthana Bala",
    iast: "Sthāna Bala",
    devanagari: "स्थान बल",
    shortLabel: "Place",
    measures: "Positional strength, including dignity-style placement checks.",
    laterChapter: "Chapter 2",
    defaultVirupas: 78,
    lowVirupas: 32,
    highVirupas: 104,
    color: grahas.surya.primary,
  },
  {
    key: "dik",
    order: 2,
    name: "Dik Bala",
    iast: "Dik Bala",
    devanagari: "दिक् बल",
    shortLabel: "Direction",
    measures: "Directional strength by house orientation.",
    laterChapter: "Chapter 3",
    defaultVirupas: 54,
    lowVirupas: 24,
    highVirupas: 86,
    color: grahas.mangala.primary,
  },
  {
    key: "kala",
    order: 3,
    name: "Kala Bala",
    iast: "Kāla Bala",
    devanagari: "काल बल",
    shortLabel: "Time",
    measures: "Temporal strength from day, night, season, and time factors.",
    laterChapter: "Chapter 3",
    defaultVirupas: 92,
    lowVirupas: 38,
    highVirupas: 112,
    color: grahas.candra.primary,
  },
  {
    key: "cheshta",
    order: 4,
    name: "Cheshta Bala",
    iast: "Cheṣṭā Bala",
    devanagari: "चेष्टा बल",
    shortLabel: "Motion",
    measures: "Motional strength, especially apparent planetary motion.",
    laterChapter: "Chapter 4",
    defaultVirupas: 66,
    lowVirupas: 28,
    highVirupas: 96,
    color: grahas.budha.primary,
  },
  {
    key: "naisargika",
    order: 5,
    name: "Naisargika Bala",
    iast: "Naisargika Bala",
    devanagari: "नैसर्गिक बल",
    shortLabel: "Nature",
    measures: "Natural innate strength, fixed by planet.",
    laterChapter: "Chapter 4",
    defaultVirupas: 42,
    lowVirupas: 28,
    highVirupas: 72,
    color: grahas.guru.primary,
  },
  {
    key: "drik",
    order: 6,
    name: "Drik Bala",
    iast: "Dṛk Bala",
    devanagari: "दृक् बल",
    shortLabel: "Aspects",
    measures: "Aspectual support and pressure.",
    laterChapter: "Chapter 5",
    defaultVirupas: 58,
    lowVirupas: 18,
    highVirupas: 90,
    color: grahas.shani.primary,
  },
];

export const SHADBALA_PRESETS: ShadbalaPreset[] = [
  {
    key: "balanced",
    label: "Balanced audit",
    note: "A steady planet: no component alone explains the total.",
    values: {
      sthana: 78,
      dik: 54,
      kala: 92,
      cheshta: 66,
      naisargika: 42,
      drik: 58,
    },
  },
  {
    key: "compensated",
    label: "Weak one, compensated",
    note: "Dik is weak, but sthana and kala keep the total usable.",
    values: {
      sthana: 104,
      dik: 24,
      kala: 112,
      cheshta: 72,
      naisargika: 48,
      drik: 64,
    },
  },
  {
    key: "lopsided",
    label: "One strong cue",
    note: "One impressive component cannot carry the reading by itself.",
    values: {
      sthana: 34,
      dik: 86,
      kala: 38,
      cheshta: 30,
      naisargika: 36,
      drik: 22,
    },
  },
];

export function virupasToRupas(virupas: number) {
  return virupas / VIRUPAS_PER_RUPA;
}

export function formatRupas(virupas: number) {
  const rupas = virupasToRupas(virupas);
  return `${Number.isInteger(rupas) ? rupas.toFixed(0) : rupas.toFixed(2)} rupa`;
}

export function totalVirupas(values: Record<ShadbalaComponentKey, number>) {
  return SHADBALA_COMPONENTS.reduce((sum, component) => sum + values[component.key], 0);
}

export function componentBand(virupas: number) {
  if (virupas >= 80) return "high";
  if (virupas >= 45) return "moderate";
  return "low";
}
