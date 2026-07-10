import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type ReadingStepKey = "states" | "themes" | "upaya" | "crossCheck";
export type PlanetState = "active" | "blind" | "sleeping" | "burning";

export interface ReadingStep {
  key: ReadingStepKey;
  label: string;
  output: string;
  detail: string;
  color: string;
}

export interface AnnualReadingPlanet {
  id: string;
  label: string;
  iast: string;
  house: number;
  state: PlanetState;
  significance: string;
  yearTheme: string;
  upaya: string;
  natalSupport: "supports" | "cautions" | "neutral";
  color: string;
}

export const READING_STEPS: ReadingStep[] = [
  {
    key: "states",
    label: "Read Annual States",
    output: "Classify each planet",
    detail: "Awake planets are functional; blind, sleeping, and burning planets are diagnosed for remedy.",
    color: grahas.rahu.primary,
  },
  {
    key: "themes",
    label: "Name Activated Significations",
    output: "Forecast the year",
    detail: "Prominent active planets set the year's themes through Lal Kitab significations.",
    color: grahas.guru.primary,
  },
  {
    key: "upaya",
    label: "Prescribe Year Upaya",
    output: "Treat dysfunctional states",
    detail: "Blind, sleeping, and burning planets receive year-specific remedies, not lifetime remedies.",
    color: grahas.mangala.primary,
  },
  {
    key: "crossCheck",
    label: "Cross-Check Natal Teva",
    output: "Validate the reading",
    detail: "The annual chart modifies the natal Teva. It never replaces the lifetime baseline.",
    color: "#7A5E24",
  },
];

export const READING_PLANETS: AnnualReadingPlanet[] = [
  {
    id: "jupiter",
    label: "Jupiter",
    iast: "Guru",
    house: 2,
    state: "active",
    significance: "wisdom, dharma, gold, sons",
    yearTheme: "learning, counsel, family resources, and measured financial growth",
    upaya: "No corrective upaya; preserve the benefic channel.",
    natalSupport: "supports",
    color: grahas.guru.primary,
  },
  {
    id: "venus",
    label: "Venus",
    iast: "Shukra",
    house: 7,
    state: "active",
    significance: "wife, comforts, luxury, vehicles, sweet-foods",
    yearTheme: "relationship development, household comfort, and vehicle or pleasure matters",
    upaya: "No corrective upaya; keep conduct clean around spouse and comforts.",
    natalSupport: "supports",
    color: "#356C96",
  },
  {
    id: "saturn",
    label: "Saturn",
    iast: "Shani",
    house: 7,
    state: "burning",
    significance: "hard work, iron, oil, longevity, servants",
    yearTheme: "contracts and partnership duties can become heavy or overheated",
    upaya: "Cool Saturn through the year-specific Saturn remedy pattern.",
    natalSupport: "cautions",
    color: grahas.shani.primary,
  },
  {
    id: "mercury",
    label: "Mercury",
    iast: "Budha",
    house: 3,
    state: "sleeping",
    significance: "business, communication, sister, in-laws",
    yearTheme: "communication and commerce are muted until deliberately roused",
    upaya: "Rouse Mercury through the year-specific Mercury remedy pattern.",
    natalSupport: "neutral",
    color: grahas.budha.primary,
  },
  {
    id: "sun",
    label: "Sun",
    iast: "Surya",
    house: 10,
    state: "blind",
    significance: "father, authority, government, household head",
    yearTheme: "authority matters underperform unless handled carefully",
    upaya: "Apply the blind-Sun year remedy before pushing authority matters.",
    natalSupport: "cautions",
    color: grahas.surya.primary,
  },
];

export const STATE_RULES = [
  { state: "active", label: "Awake / active", role: "Sets themes", color: "#2F7D52" },
  { state: "blind", label: "Blind", role: "Triggers upaya", color: grahas.surya.primary },
  { state: "sleeping", label: "Sleeping", role: "Triggers upaya", color: grahas.budha.primary },
  { state: "burning", label: "Burning", role: "Triggers upaya", color: grahas.mangala.primary },
] as const;

export function getReadingStep(key: ReadingStepKey) {
  return READING_STEPS.find((step) => step.key === key) ?? READING_STEPS[0];
}
