import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type YogaFiringScenarioSlug = "raja-guru-shani" | "dhana-shukra-shani" | "ruchaka-mangala";

export interface YogaTimingWindow {
  id: string;
  label: string;
  startAge: number;
  endAge: number;
  mdLord: GrahaSlug;
  bhuktiLord: GrahaSlug;
  transit: string;
  transitAge: number;
  convergence: boolean;
  reading: string;
}

export interface YogaFiringScenario {
  slug: YogaFiringScenarioSlug;
  label: string;
  iast: string;
  devanagari: string;
  planets: GrahaSlug[];
  houses: number[];
  promise: string;
  dormantLesson: string;
  color: string;
  windows: YogaTimingWindow[];
}

export const YOGA_FIRING_SCENARIOS: YogaFiringScenario[] = [
  {
    slug: "raja-guru-shani",
    label: "Jupiter-Saturn Raja Yoga",
    iast: "Guru-Sani raja yoga",
    devanagari: "योगफलकाल",
    planets: ["guru", "shani"],
    houses: [9, 10],
    promise: "Dharma and karma lords form a royal promise, but it waits for Jupiter or Saturn periods.",
    dormantLesson: "In unrelated periods the yoga remains natal potential, not a guaranteed event.",
    color: grahas.guru.primary,
    windows: [
      {
        id: "ju-sa",
        label: "Appointment window",
        startAge: 11,
        endAge: 13.5,
        mdLord: "guru",
        bhuktiLord: "shani",
        transit: "Jupiter crosses the 10th-house yoga field",
        transitAge: 12.4,
        convergence: true,
        reading: "Strong firing window: both dasha and transit point to the same yoga.",
      },
      {
        id: "sa-ju",
        label: "Second candidate",
        startAge: 28,
        endAge: 31,
        mdLord: "shani",
        bhuktiLord: "guru",
        transit: "Saturn aspects the 9th-house yoga field",
        transitAge: 29.2,
        convergence: true,
        reading: "A second mature window; the same two yoga planets exchange timing authority.",
      },
      {
        id: "me-ra",
        label: "Dormant contrast",
        startAge: 37,
        endAge: 40,
        mdLord: "budha",
        bhuktiLord: "rahu",
        transit: "No direct activation of the yoga houses",
        transitAge: 38.4,
        convergence: false,
        reading: "Yoga may be visible in background, but this is not its main appointment.",
      },
    ],
  },
  {
    slug: "dhana-shukra-shani",
    label: "Venus-Saturn Dhana Yoga",
    iast: "Sukra-Sani dhana yoga",
    devanagari: "धनयोगकाल",
    planets: ["shukra", "shani"],
    houses: [2, 11],
    promise: "Wealth houses connect through Venus and Saturn; timing is strongest when either planet owns the period.",
    dormantLesson: "Money themes may exist, but the named yoga needs its participating lords to run.",
    color: grahas.shukra.primary,
    windows: [
      {
        id: "sa-ve",
        label: "Saturn-Venus",
        startAge: 24,
        endAge: 27.2,
        mdLord: "shani",
        bhuktiLord: "shukra",
        transit: "Venus activates the 2nd-house wealth channel",
        transitAge: 25.7,
        convergence: true,
        reading: "A clean dhana appointment: period lords and transit reinforce the wealth houses.",
      },
      {
        id: "ve-sa",
        label: "Venus-Saturn",
        startAge: 61,
        endAge: 64.2,
        mdLord: "shukra",
        bhuktiLord: "shani",
        transit: "Saturn steadies the 11th-house gain channel",
        transitAge: 62.9,
        convergence: true,
        reading: "Later-life consolidation window, especially for durable gains.",
      },
      {
        id: "su-mo",
        label: "Dormant contrast",
        startAge: 52,
        endAge: 54,
        mdLord: "surya",
        bhuktiLord: "candra",
        transit: "Transit touches status, not the wealth yoga",
        transitAge: 53.1,
        convergence: false,
        reading: "Useful life movement, but not the main dhana-yoga firing period.",
      },
    ],
  },
  {
    slug: "ruchaka-mangala",
    label: "Ruchaka Yoga",
    iast: "Rucaka yoga",
    devanagari: "रुचककाल",
    planets: ["mangala"],
    houses: [10],
    promise: "A strong Mars in kendra promises courage and command; Mars periods open the gate.",
    dormantLesson: "Strength can be obvious, yet the event-fruition waits for Mars timing.",
    color: grahas.mangala.primary,
    windows: [
      {
        id: "ma-ma",
        label: "Mars-Mars",
        startAge: 43,
        endAge: 43.5,
        mdLord: "mangala",
        bhuktiLord: "mangala",
        transit: "Mars returns to the 10th-house action point",
        transitAge: 43.2,
        convergence: true,
        reading: "Sharp launch window: the same planet owns yoga, dasha, bhukti, and trigger.",
      },
      {
        id: "ma-ju",
        label: "Mars-Jupiter",
        startAge: 46,
        endAge: 47,
        mdLord: "mangala",
        bhuktiLord: "guru",
        transit: "Jupiter supports the career angle while Mars MD runs",
        transitAge: 46.4,
        convergence: true,
        reading: "Constructive action window; Mars provides force and Jupiter gives sanction.",
      },
      {
        id: "ve-ke",
        label: "Dormant contrast",
        startAge: 59,
        endAge: 61,
        mdLord: "shukra",
        bhuktiLord: "ketu",
        transit: "No Mars or kendra emphasis",
        transitAge: 60,
        convergence: false,
        reading: "The Mars yoga is present, but the period does not strongly invite it to act.",
      },
    ],
  },
];

export function getYogaFiringScenario(slug: YogaFiringScenarioSlug) {
  return YOGA_FIRING_SCENARIOS.find((scenario) => scenario.slug === slug) ?? YOGA_FIRING_SCENARIOS[0];
}

export function grahaLabel(slug: GrahaSlug) {
  return grahas[slug].iast;
}

export function grahaAbbr(slug: GrahaSlug) {
  const labels: Record<GrahaSlug, string> = {
    ketu: "Ke",
    shukra: "Ve",
    surya: "Su",
    candra: "Mo",
    mangala: "Ma",
    rahu: "Ra",
    guru: "Ju",
    shani: "Sa",
    budha: "Me",
  };
  return labels[slug];
}
