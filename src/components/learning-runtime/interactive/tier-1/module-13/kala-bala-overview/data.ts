export type KalaBalaGroup = "diurnal" | "lunar" | "calendar" | "solar" | "event";

export interface KalaBalaGroupInfo {
  slug: KalaBalaGroup;
  label: string;
  shortLabel: string;
  teaching: string;
}

export interface KalaBalaComponent {
  slug: string;
  number: number;
  name: string;
  iast: string;
  devanagari: string;
  group: KalaBalaGroup;
  measures: string;
  engineNote: string;
  sampleVirupas: number;
}

export const KALA_BALA_GROUPS: KalaBalaGroupInfo[] = [
  {
    slug: "diurnal",
    label: "Diurnal cycle",
    shortLabel: "Diurnal",
    teaching: "Day, night, thirds, and hour timing.",
  },
  {
    slug: "lunar",
    label: "Lunar phase",
    shortLabel: "Lunar",
    teaching: "Waxing and waning lunar support.",
  },
  {
    slug: "calendar",
    label: "Calendar lords",
    shortLabel: "Calendar",
    teaching: "Year, month, and weekday lordship.",
  },
  {
    slug: "solar",
    label: "Solar declination",
    shortLabel: "Solar",
    teaching: "North-south solar movement.",
  },
  {
    slug: "event",
    label: "Planetary event",
    shortLabel: "War",
    teaching: "Close conjunction victory or loss.",
  },
];

export const KALA_BALA_COMPONENTS: KalaBalaComponent[] = [
  {
    slug: "nathonnata",
    number: 1,
    name: "Nathonnata",
    iast: "Nathonnata",
    devanagari: "नतोन्नत",
    group: "diurnal",
    measures: "Day versus night strength.",
    engineNote: "Depends on birth by day or night and planet class.",
    sampleVirupas: 18,
  },
  {
    slug: "paksha",
    number: 2,
    name: "Paksha",
    iast: "Pakṣa",
    devanagari: "पक्ष",
    group: "lunar",
    measures: "Waxing or waning Moon phase support.",
    engineNote: "The next lesson isolates Paksha because it is a major sub-component.",
    sampleVirupas: 36,
  },
  {
    slug: "tribhaga",
    number: 3,
    name: "Tribhaga",
    iast: "Tribhāga",
    devanagari: "त्रिभाग",
    group: "diurnal",
    measures: "The third of the day or night.",
    engineNote: "Requires exact day/night division, so the engine handles precision.",
    sampleVirupas: 9,
  },
  {
    slug: "abda",
    number: 4,
    name: "Abda",
    iast: "Abda",
    devanagari: "अब्द",
    group: "calendar",
    measures: "Year-lord strength.",
    engineNote: "Calendar lordship is resolved before summing the ledger.",
    sampleVirupas: 7,
  },
  {
    slug: "masa",
    number: 5,
    name: "Masa",
    iast: "Māsa",
    devanagari: "मास",
    group: "calendar",
    measures: "Month-lord strength.",
    engineNote: "The month lord is one of the calendar supports.",
    sampleVirupas: 6,
  },
  {
    slug: "vara",
    number: 6,
    name: "Vara",
    iast: "Vāra",
    devanagari: "वार",
    group: "calendar",
    measures: "Weekday-lord strength.",
    engineNote: "Connects Module 3 weekday literacy to Shadbala.",
    sampleVirupas: 8,
  },
  {
    slug: "hora",
    number: 7,
    name: "Hora",
    iast: "Horā",
    devanagari: "होरा",
    group: "diurnal",
    measures: "Planetary hour strength.",
    engineNote: "Uses the active hora lord inside the day/night cycle.",
    sampleVirupas: 10,
  },
  {
    slug: "ayana",
    number: 8,
    name: "Ayana",
    iast: "Ayana",
    devanagari: "अयन",
    group: "solar",
    measures: "Declination or solstice north-south strength.",
    engineNote: "A solar-position calculation, not a quick visual estimate.",
    sampleVirupas: 14,
  },
  {
    slug: "yuddha",
    number: 9,
    name: "Yuddha",
    iast: "Yuddha",
    devanagari: "युद्ध",
    group: "event",
    measures: "Planetary-war condition within about one degree.",
    engineNote: "The next lesson handles the major close-conjunction rule.",
    sampleVirupas: 0,
  },
];

export const KALA_BALA_PRESETS = [
  {
    slug: "balanced",
    label: "Balanced overview",
    description: "Every dimension contributes, none owns the reading.",
    values: {
      nathonnata: 18,
      paksha: 36,
      tribhaga: 9,
      abda: 7,
      masa: 6,
      vara: 8,
      hora: 10,
      ayana: 14,
      yuddha: 0,
    },
  },
  {
    slug: "lunar-supported",
    label: "Lunar supported",
    description: "Paksha carries more visible temporal support.",
    values: {
      nathonnata: 12,
      paksha: 48,
      tribhaga: 6,
      abda: 5,
      masa: 7,
      vara: 9,
      hora: 8,
      ayana: 12,
      yuddha: 0,
    },
  },
  {
    slug: "war-penalty",
    label: "War caution",
    description: "A close-conjunction event can change the audit.",
    values: {
      nathonnata: 20,
      paksha: 30,
      tribhaga: 11,
      abda: 8,
      masa: 7,
      vara: 10,
      hora: 12,
      ayana: 16,
      yuddha: -18,
    },
  },
] as const;

export type KalaBalaValues = Record<string, number>;

export function defaultKalaBalaValues(): KalaBalaValues {
  return Object.fromEntries(KALA_BALA_COMPONENTS.map((component) => [component.slug, component.sampleVirupas]));
}

export function getKalaBalaComponent(slug: string) {
  return KALA_BALA_COMPONENTS.find((component) => component.slug === slug) ?? KALA_BALA_COMPONENTS[0];
}

export function getKalaBalaGroup(slug: KalaBalaGroup) {
  return KALA_BALA_GROUPS.find((group) => group.slug === slug) ?? KALA_BALA_GROUPS[0];
}

export function sumKalaBala(values: KalaBalaValues) {
  return KALA_BALA_COMPONENTS.reduce((total, component) => total + (values[component.slug] ?? 0), 0);
}
