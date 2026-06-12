/**
 * Teva vs Lagna Cross-Validator — data engine for Lesson 18.2.4.
 */

export const SHORT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const SIGN_ABBRS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

export interface PlanetDef {
  key: string;
  name: string;
  abbr: string;
}

export const PLANETS: PlanetDef[] = [
  { key: "Sun", name: "Sun", abbr: "Su" },
  { key: "Moon", name: "Moon", abbr: "Mo" },
  { key: "Mars", name: "Mars", abbr: "Ma" },
  { key: "Mercury", name: "Mercury", abbr: "Me" },
  { key: "Jupiter", name: "Jupiter", abbr: "Ju" },
  { key: "Venus", name: "Venus", abbr: "Ve" },
  { key: "Saturn", name: "Saturn", abbr: "Sa" },
];

export interface DemoCase {
  label: string;
  lagnaSign: number;
  lagnaName: string;
  placements: Record<string, number>;
}

export const DEMO_CASES: DemoCase[] = [
  {
    label: "Cancer lagna — Sun in Leo, Moon in Scorpio",
    lagnaSign: 3,
    lagnaName: "Cancer",
    placements: { Sun: 4, Moon: 7 },
  },
  {
    label: "Libra lagna — Mars in Capricorn",
    lagnaSign: 6,
    lagnaName: "Libra",
    placements: { Mars: 9 },
  },
  {
    label: "Sagittarius lagna — mixed planets",
    lagnaSign: 8,
    lagnaName: "Sagittarius",
    placements: { Sun: 0, Moon: 3, Mars: 6, Mercury: 10, Jupiter: 2, Venus: 5, Saturn: 9 },
  },
  {
    label: "Empty frame",
    lagnaSign: 0,
    lagnaName: "Aries",
    placements: {},
  },
];

export const TEVA_THEMES: Record<number, string> = {
  1: "self, body, initiative",
  2: "wealth, speech, family",
  3: "siblings, courage, effort",
  4: "home, mother, comfort",
  5: "children, intellect, authority",
  6: "service, debts, disease",
  7: "partner, trade, relations",
  8: "longevity, upheaval, hidden",
  9: "fortune, dharma, teacher",
  10: "career, status, action",
  11: "gains, networks, elder siblings",
  12: "loss, expense, liberation",
};

export const CLASSICAL_THEMES: Record<number, string> = {
  1: "self, body, personality",
  2: "wealth, family, speech",
  3: "siblings, courage, communication",
  4: "home, mother, vehicles",
  5: "children, intelligence, speculation",
  6: "enemies, disease, service",
  7: "marriage, partnerships, business",
  8: "longevity, obstacles, inheritance",
  9: "dharma, father, fortune",
  10: "career, status, government",
  11: "gains, friends, elder siblings",
  12: "loss, expenditure, liberation",
};
