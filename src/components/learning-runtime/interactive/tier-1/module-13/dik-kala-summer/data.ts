/**
 * Dik-Kāla Summer — Data Engine
 *
 * §7 interactive for Lesson 13.3.4 (Chapter 3 capstone).
 *
 * Provides dik bala (0–60), the nine kāla sub-components,
 * worked presets, and virūpa→rūpa conversion helpers.
 */

export const VIRUPAS_PER_RUPA = 60;

export interface DikBalaConfig {
  key: "dik";
  label: string;
  iast: string;
  devanagari: string;
  description: string;
  range: string;
  defaultVirupas: number;
  min: number;
  max: number;
  step: number;
  note: string;
  color: string;
}

export const DIK_BALA_CONFIG: DikBalaConfig = {
  key: "dik",
  label: "Dik Bala",
  iast: "Dik-bala",
  devanagari: "दिक्बलम्",
  description: "Directional strength by house placement.",
  range: "0–60",
  defaultVirupas: 60,
  min: 0,
  max: 60,
  step: 1,
  note: "Sun in 10th = full 60. Mercury/Jupiter in 1st = full 60. Moon/Venus in 4th = full 60. Mars/Saturn in 10th = full 60.",
  color: "#356CAB",
};

export interface KalaComponent {
  key: string;
  number: number;
  label: string;
  iast: string;
  devanagari: string;
  group: string;
  description: string;
  range: string;
  defaultVirupas: number;
  min: number;
  max: number;
  step: number;
  note: string;
  color: string;
}

export const KALA_COMPONENTS: KalaComponent[] = [
  {
    key: "nathonnata",
    number: 1,
    label: "Nathonnata",
    iast: "Nathonnata",
    devanagari: "नतोन्नत",
    group: "Diurnal",
    description: "Day vs. night strength by planet class.",
    range: "0–60",
    defaultVirupas: 20,
    min: 0,
    max: 60,
    step: 1,
    note: "Day-born malefics and night-born benefics score higher.",
    color: "#D99622",
  },
  {
    key: "paksha",
    number: 2,
    label: "Pakṣabala",
    iast: "Pakṣabala",
    devanagari: "पक्षबलम्",
    group: "Lunar",
    description: "Lunar phase strength — waxing vs. waning.",
    range: "0–60",
    defaultVirupas: 30,
    min: 0,
    max: 60,
    step: 1,
    note: "Benefics strong in waxing; malefics in waning. Moon's value is doubled in standard computation.",
    color: "#6D7FA8",
  },
  {
    key: "tribhaga",
    number: 3,
    label: "Tribhāga",
    iast: "Tribhāga",
    devanagari: "त्रिभाग",
    group: "Diurnal",
    description: "Third of day or night strength.",
    range: "0–30",
    defaultVirupas: 10,
    min: 0,
    max: 30,
    step: 1,
    note: "Depends on which third of day/night the birth falls in.",
    color: "#8B5A9F",
  },
  {
    key: "abda",
    number: 4,
    label: "Abda",
    iast: "Abda",
    devanagari: "अब्द",
    group: "Calendar",
    description: "Year-lord strength.",
    range: "0–15",
    defaultVirupas: 7,
    min: 0,
    max: 15,
    step: 1,
    note: "The year lord's temporal support.",
    color: "#2F7D55",
  },
  {
    key: "masa",
    number: 5,
    label: "Māsa",
    iast: "Māsa",
    devanagari: "मास",
    group: "Calendar",
    description: "Month-lord strength.",
    range: "0–15",
    defaultVirupas: 6,
    min: 0,
    max: 15,
    step: 1,
    note: "The month lord's temporal support.",
    color: "#C8841E",
  },
  {
    key: "vara",
    number: 6,
    label: "Vāra",
    iast: "Vāra",
    devanagari: "वार",
    group: "Calendar",
    description: "Weekday-lord strength.",
    range: "0–15",
    defaultVirupas: 8,
    min: 0,
    max: 15,
    step: 1,
    note: "The weekday lord's temporal support.",
    color: "#A23A1E",
  },
  {
    key: "hora",
    number: 7,
    label: "Horā",
    iast: "Horā",
    devanagari: "होरा",
    group: "Diurnal",
    description: "Planetary hour strength.",
    range: "0–15",
    defaultVirupas: 10,
    min: 0,
    max: 15,
    step: 1,
    note: "The active hora lord at birth time.",
    color: "#5A4E2E",
  },
  {
    key: "ayana",
    number: 8,
    label: "Ayana",
    iast: "Ayana",
    devanagari: "अयन",
    group: "Solar",
    description: "Declination / solstice distance strength.",
    range: "0–60",
    defaultVirupas: 15,
    min: 0,
    max: 60,
    step: 1,
    note: "North-moving vs. south-moving Sun effect.",
    color: "#7A6B3E",
  },
  {
    key: "yuddha",
    number: 9,
    label: "Yuddha",
    iast: "Yuddha",
    devanagari: "युद्ध",
    group: "Event",
    description: "Planetary war bonus or penalty.",
    range: "−30 to +30",
    defaultVirupas: 0,
    min: -30,
    max: 30,
    step: 1,
    note: "Winner gains; loser loses kāla bala sharply. Sun/Moon exempt.",
    color: "#3A8C5A",
  },
];

export interface Preset {
  key: string;
  label: string;
  note: string;
  dikVirupas: number;
  kalaValues: Record<string, number>;
}

export const PRESETS: Preset[] = [
  {
    key: "sun-10th-day",
    label: "Sun in 10th, day-birth",
    note: "Worked example: full dik (10th = directional home) + strong kāla from nathonnata day + pakṣa malefic-waning.",
    dikVirupas: 60,
    kalaValues: {
      nathonnata: 24,
      paksha: 28,
      tribhaga: 12,
      abda: 8,
      masa: 7,
      vara: 9,
      hora: 11,
      ayana: 18,
      yuddha: 0,
    },
  },
  {
    key: "moon-night-waxing",
    label: "Moon at night, waxing",
    note: "Moon in 4th (full dik) + night-born + waxing pakṣa (doubled). High temporal support.",
    dikVirupas: 60,
    kalaValues: {
      nathonnata: 18,
      paksha: 48,
      tribhaga: 8,
      abda: 6,
      masa: 7,
      vara: 10,
      hora: 9,
      ayana: 12,
      yuddha: 0,
    },
  },
  {
    key: "mars-saturn-war",
    label: "Mars–Saturn war",
    note: "Mars wins war (+12) but Saturn loses (−18). Both in 10th with full dik. Shows yuddha's verdict-changing power.",
    dikVirupas: 60,
    kalaValues: {
      nathonnata: 15,
      paksha: 20,
      tribhaga: 10,
      abda: 6,
      masa: 5,
      vara: 7,
      hora: 8,
      ayana: 14,
      yuddha: -18,
    },
  },
  {
    key: "mixed",
    label: "Mixed placement",
    note: "Moderate dik (kendra, not mūla-trikona) + moderate kāla across all nine.",
    dikVirupas: 30,
    kalaValues: {
      nathonnata: 12,
      paksha: 18,
      tribhaga: 8,
      abda: 5,
      masa: 4,
      vara: 6,
      hora: 7,
      ayana: 10,
      yuddha: 0,
    },
  },
];

export function getDefaultValues() {
  return {
    dik: DIK_BALA_CONFIG.defaultVirupas,
    ...Object.fromEntries(KALA_COMPONENTS.map((c) => [c.key, c.defaultVirupas])),
  };
}

export function sumKala(values: Record<string, number>) {
  return KALA_COMPONENTS.reduce((sum, c) => sum + (values[c.key] ?? 0), 0);
}

export function totalDikKala(values: Record<string, number>) {
  return (values.dik ?? 0) + sumKala(values);
}

export function virupasToRupas(virupas: number) {
  return virupas / VIRUPAS_PER_RUPA;
}

export function formatVirupas(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

export function formatRupas(virupas: number) {
  return virupasToRupas(virupas).toFixed(2);
}
