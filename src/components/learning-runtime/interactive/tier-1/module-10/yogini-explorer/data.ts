import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface YoginiPeriod {
  index: number;
  name: string;
  devanagari: string;
  planet: string;
  grahaSlug: GrahaSlug;
  years: number;
  quality: string;
  readingCue: string;
  color: string;
  tint: string;
}

export const YOGINI_TOTAL_YEARS = 36;
export const DAYS_PER_YEAR = 365.2425;

export const YOGINI_PERIODS: YoginiPeriod[] = [
  {
    index: 1,
    name: "Mangala",
    devanagari: "मङ्गला",
    planet: "Moon",
    grahaSlug: "candra",
    years: 1,
    quality: "Auspicious",
    readingCue: "A soft opening period: nourishment, receptivity, and auspicious beginnings.",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    index: 2,
    name: "Pingala",
    devanagari: "पिङ्गला",
    planet: "Sun",
    grahaSlug: "surya",
    years: 2,
    quality: "Aggressive",
    readingCue: "Heat, assertion, visibility, and sharper willpower need conscious handling.",
    color: grahas.surya.primary,
    tint: grahas.surya.secondaryTint,
  },
  {
    index: 3,
    name: "Dhanya",
    devanagari: "धन्या",
    planet: "Jupiter",
    grahaSlug: "guru",
    years: 3,
    quality: "Wealthy",
    readingCue: "Growth, support, learning, and abundance become the subtle-energy theme.",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
  },
  {
    index: 4,
    name: "Bhramari",
    devanagari: "भ्रामरी",
    planet: "Mars",
    grahaSlug: "mangala",
    years: 4,
    quality: "Restless",
    readingCue: "Movement, friction, effort, and redirection require disciplined action.",
    color: grahas.mangala.primary,
    tint: grahas.mangala.secondaryTint,
  },
  {
    index: 5,
    name: "Bhadrika",
    devanagari: "भद्रिका",
    planet: "Mercury",
    grahaSlug: "budha",
    years: 5,
    quality: "Auspicious",
    readingCue: "Skill, communication, trade, study, and practical intelligence can mature.",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
  },
  {
    index: 6,
    name: "Ulka",
    devanagari: "उल्का",
    planet: "Saturn",
    grahaSlug: "shani",
    years: 6,
    quality: "Fiery / disruptive",
    readingCue: "Pressure, separation, sobriety, and course-correction burn away excess.",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
  },
  {
    index: 7,
    name: "Siddha",
    devanagari: "सिद्धा",
    planet: "Venus",
    grahaSlug: "shukra",
    years: 7,
    quality: "Accomplished",
    readingCue: "Refinement, devotion, art, relationship, and practice-fruit come forward.",
    color: grahas.shukra.primary,
    tint: grahas.shukra.secondaryTint,
  },
  {
    index: 8,
    name: "Sankata",
    devanagari: "सङ्कटा",
    planet: "Rahu",
    grahaSlug: "rahu",
    years: 8,
    quality: "Crisis",
    readingCue: "Intensification, uncertainty, karmic knots, and threshold experiences need steadiness.",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
  },
];

export function yoginiYearsMnemonic() {
  return YOGINI_PERIODS.map((period) => period.years).join(" + ");
}

export function yoginiSequenceMnemonic() {
  return YOGINI_PERIODS.map((period) => `${period.name} ${period.years}`).join(" -> ");
}

export function triangularTotal() {
  return YOGINI_PERIODS.reduce((sum, period) => sum + period.years, 0);
}

export function rotateYoginiSequence(startIndex: number) {
  const start = Math.max(1, Math.min(YOGINI_PERIODS.length, startIndex)) - 1;
  return [...YOGINI_PERIODS.slice(start), ...YOGINI_PERIODS.slice(0, start)];
}

export function cumulativeYoginiPeriods(startIndex = 1) {
  let total = 0;
  return rotateYoginiSequence(startIndex).map((period) => {
    const start = total;
    total += period.years;
    return { period, start, end: total };
  });
}

export function yearsBetween(startDate: string, targetDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const target = new Date(`${targetDate}T00:00:00`);
  const diffDays = (target.getTime() - start.getTime()) / 86400000;
  return Math.max(0, diffDays / DAYS_PER_YEAR);
}

export function normalizeCycleYears(years: number) {
  return ((years % YOGINI_TOTAL_YEARS) + YOGINI_TOTAL_YEARS) % YOGINI_TOTAL_YEARS;
}

export function activeYoginiForYears(years: number, startIndex = 1) {
  const cycleYear = normalizeCycleYears(years);
  return (
    cumulativeYoginiPeriods(startIndex).find(({ start, end }) => cycleYear >= start && cycleYear < end) ??
    cumulativeYoginiPeriods(startIndex)[0]
  );
}
