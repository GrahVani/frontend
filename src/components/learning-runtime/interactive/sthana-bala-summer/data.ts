import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type SthanaComponentKey = "uchcha" | "saptavarga" | "ojaYugma" | "kendra" | "drekkana";

export interface SthanaBalaComponent {
  key: SthanaComponentKey;
  order: number;
  label: string;
  iast: string;
  source: string;
  range: string;
  lesson: string;
  defaultVirupas: number;
  min: number;
  max: number;
  step: number;
  note: string;
  color: string;
}

export interface SthanaBalaPreset {
  key: string;
  label: string;
  note: string;
  values: Record<SthanaComponentKey, number>;
}

export const VIRUPAS_PER_RUPA = 60;

export const STHANA_BALA_COMPONENTS: SthanaBalaComponent[] = [
  {
    key: "uchcha",
    order: 1,
    label: "Uchcha-bala",
    iast: "Uchcha-bala",
    source: "Exaltation distance",
    range: "0-60",
    lesson: "13.2.1",
    defaultVirupas: 60,
    min: 0,
    max: 60,
    step: 1,
    note: "Sun at exact exaltation gives the full 60.",
    color: grahas.surya.primary,
  },
  {
    key: "saptavarga",
    order: 2,
    label: "Saptavarga-bala",
    iast: "Saptavarga-bala",
    source: "Seven varga dignities",
    range: "summed, not capped",
    lesson: "13.2.2",
    defaultVirupas: 40,
    min: 0,
    max: 210,
    step: 1,
    note: "Illustrative value; take exact total from the engine.",
    color: grahas.guru.primary,
  },
  {
    key: "ojaYugma",
    order: 3,
    label: "Oja-yugma-bala",
    iast: "Oja-yugma-bala",
    source: "Odd/even sign match",
    range: "0-30",
    lesson: "13.2.3",
    defaultVirupas: 15,
    min: 0,
    max: 30,
    step: 15,
    note: "Sun is in the odd group and Aries is odd.",
    color: grahas.budha.primary,
  },
  {
    key: "kendra",
    order: 4,
    label: "Kendra-bala",
    iast: "Kendra-bala",
    source: "House class",
    range: "15 / 30 / 60",
    lesson: "13.2.4",
    defaultVirupas: 60,
    min: 15,
    max: 60,
    step: 15,
    note: "10th house is a kendra, so it scores 60.",
    color: grahas.mangala.primary,
  },
  {
    key: "drekkana",
    order: 5,
    label: "Drekkana-bala",
    iast: "Drekkana-bala",
    source: "Gender-matching third",
    range: "0 / 15",
    lesson: "13.2.4",
    defaultVirupas: 15,
    min: 0,
    max: 15,
    step: 15,
    note: "Sun is male; 10 degrees is treated here as the 1st drekkana worked example.",
    color: grahas.shukra.primary,
  },
];

export const STHANA_BALA_PRESETS: SthanaBalaPreset[] = [
  {
    key: "workedSun",
    label: "Worked Sun",
    note: "The lesson example: exact exaltation, 10th house, strong position.",
    values: {
      uchcha: 60,
      saptavarga: 40,
      ojaYugma: 15,
      kendra: 60,
      drekkana: 15,
    },
  },
  {
    key: "weak",
    label: "Weak placement",
    note: "Debilitated, cadent, wrong parity, wrong drekkana.",
    values: {
      uchcha: 0,
      saptavarga: 18,
      ojaYugma: 0,
      kendra: 15,
      drekkana: 0,
    },
  },
  {
    key: "mixed",
    label: "Mixed chart",
    note: "Strong house support, but only moderate dignity and distance.",
    values: {
      uchcha: 34,
      saptavarga: 72,
      ojaYugma: 15,
      kendra: 60,
      drekkana: 0,
    },
  },
];

export function getInitialSthanaValues() {
  return { ...STHANA_BALA_PRESETS[0].values };
}

export function totalSthanaVirupas(values: Record<SthanaComponentKey, number>) {
  return STHANA_BALA_COMPONENTS.reduce((sum, component) => sum + values[component.key], 0);
}

export function virupasToRupas(virupas: number) {
  return virupas / VIRUPAS_PER_RUPA;
}

export function formatVirupas(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
}

export function formatRupasFromVirupas(virupas: number) {
  return virupasToRupas(virupas).toFixed(2);
}
