/**
 * Teva House Reader — data engine for Lesson 18.2.3.
 *
 * Static content for fixed house themes, planet significations,
 * combined readings, and example presets.
 */

export const SIGNS = [
  "Meṣa / Aries",
  "Vṛṣabha / Taurus",
  "Mithuna / Gemini",
  "Karka / Cancer",
  "Siṁha / Leo",
  "Kanyā / Virgo",
  "Tulā / Libra",
  "Vṛścika / Scorpio",
  "Dhanu / Sagittarius",
  "Makara / Capricorn",
  "Kumbha / Aquarius",
  "Mīna / Pisces",
];

export const SHORT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const SIGN_ABBRS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

export interface PlanetDef {
  key: string;
  name: string;
  abbr: string;
  significations: string;
}

export const PLANETS: PlanetDef[] = [
  { key: "Sun", name: "Sun", abbr: "Su", significations: "authority, vitality, command, ego" },
  { key: "Moon", name: "Moon", abbr: "Mo", significations: "emotion, mind, nourishment, mother" },
  { key: "Mars", name: "Mars", abbr: "Ma", significations: "drive, heat, assertion, courage" },
  { key: "Mercury", name: "Mercury", abbr: "Me", significations: "intellect, speech, commerce, skill" },
  { key: "Jupiter", name: "Jupiter", abbr: "Ju", significations: "wisdom, expansion, benevolence, dharma" },
  { key: "Venus", name: "Venus", abbr: "Ve", significations: "pleasure, relationship, art, luxury" },
  { key: "Saturn", name: "Saturn", abbr: "Sa", significations: "discipline, delay, endurance, consequence" },
  { key: "Rahu", name: "Rāhu", abbr: "Ra", significations: "obsession, disruption, foreign, ambition" },
];

export interface HouseTheme {
  box: number;
  themes: string;
  signNature: string;
}

export const HOUSE_THEMES: HouseTheme[] = [
  { box: 1, themes: "self, body, initiative, identity", signNature: "Aries — fiery, pioneering, self-directed" },
  { box: 2, themes: "wealth, speech, family, values", signNature: "Taurus — earthy, stabilising, accumulative" },
  { box: 3, themes: "siblings, courage, effort, communication", signNature: "Gemini — airy, curious, communicative" },
  { box: 4, themes: "home, mother, comfort, roots", signNature: "Cancer — watery, nurturing, protective" },
  { box: 5, themes: "children, intellect, authority, creativity", signNature: "Leo — fiery, commanding, creative" },
  { box: 6, themes: "service, debts, disease, obstacles", signNature: "Virgo — earthy, analytical, service-oriented" },
  { box: 7, themes: "partner, trade, relations, contracts", signNature: "Libra — airy, balancing, relational" },
  { box: 8, themes: "longevity, upheaval, the hidden, transformation", signNature: "Scorpio — watery, intense, penetrating" },
  { box: 9, themes: "fortune, dharma, the teacher, pilgrimage", signNature: "Sagittarius — fiery, philosophical, expansive" },
  { box: 10, themes: "career, status, action, public role", signNature: "Capricorn — earthy, disciplined, ambitious" },
  { box: 11, themes: "gains, networks, elder siblings, aspirations", signNature: "Aquarius — airy, innovative, collective" },
  { box: 12, themes: "loss, expense, liberation, the foreign", signNature: "Pisces — watery, dissolving, spiritual" },
];

/** Combined reading generator: returns house-centric text for a planet in a box. */
export function getCombinedReading(planetKey: string, box: number): string {
  const planet = PLANETS.find((p) => p.key === planetKey);
  if (!planet) return "";
  const house = HOUSE_THEMES.find((h) => h.box === box);
  if (!house) return "";

  // Natural lord reinforcements
  const naturalLords: Record<string, number> = {
    Mars: 0, // Aries
    Venus: 1, // Taurus
    Mercury: 2, // Gemini
    Moon: 3, // Cancer
    Sun: 4, // Leo
    Mercury2: 5, // Virgo (Mercury also)
    Venus2: 6, // Libra (Venus also)
    Mars2: 7, // Scorpio (Mars also)
    Jupiter: 8, // Sagittarius
    Saturn: 9, // Capricorn
    Saturn2: 10, // Aquarius (Saturn also)
    Jupiter2: 11, // Pisces (Jupiter also)
  };

  const isOwnSign =
    (planetKey === "Mars" && (box === 1 || box === 8)) ||
    (planetKey === "Venus" && (box === 2 || box === 7)) ||
    (planetKey === "Mercury" && (box === 3 || box === 6)) ||
    (planetKey === "Moon" && box === 4) ||
    (planetKey === "Sun" && box === 5) ||
    (planetKey === "Jupiter" && (box === 9 || box === 12)) ||
    (planetKey === "Saturn" && (box === 10 || box === 11));

  const reinforcement = isOwnSign
    ? ` The ${planet.name} is the natural lord of ${SHORT_SIGNS[box - 1]}, so the combination strongly reinforces the house's own nature.`
    : "";

  return `Box ${box} is fixed ${SHORT_SIGNS[box - 1]} (${house.themes}). The ${planet.name} brings ${planet.significations}.${reinforcement} Combined: ${planet.name.toLowerCase()}-flavoured ${SHORT_SIGNS[box - 1]} on ${house.themes.split(", ")[0]} matters — read house-centrically as "${planet.name} in the ${box}${box === 1 ? "st" : box === 2 ? "nd" : box === 3 ? "rd" : "th"} house," not as a free-standing sign dignity.`;
}

export interface Preset {
  label: string;
  lagnaSign: number;
  lagnaName: string;
  placements: Record<string, number>;
}

export const PRESETS: Preset[] = [
  {
    label: "Example 1 — Sun, Mars, Saturn, Jupiter",
    lagnaSign: 6, // Libra
    lagnaName: "Libra",
    placements: {
      Sun: 4,    // Leo -> box 5
      Mars: 0,   // Aries -> box 1
      Saturn: 9, // Capricorn -> box 10
      Jupiter: 11, // Pisces -> box 12
    },
  },
  {
    label: "Example 2 — Moon in box 4",
    lagnaSign: 7, // Scorpio
    lagnaName: "Scorpio",
    placements: {
      Moon: 3, // Cancer -> box 4
    },
  },
  {
    label: "Mixed planets",
    lagnaSign: 2, // Taurus
    lagnaName: "Taurus",
    placements: {
      Sun: 8,     // Sagittarius -> box 9
      Moon: 2,    // Gemini -> box 3
      Mars: 10,   // Aquarius -> box 11
      Mercury: 5, // Virgo -> box 6
      Jupiter: 0, // Aries -> box 1
      Venus: 6,   // Libra -> box 7
      Saturn: 3,  // Cancer -> box 4
      Rahu: 9,    // Capricorn -> box 10
    },
  },
  {
    label: "Empty frame",
    lagnaSign: 0,
    lagnaName: "Aries",
    placements: {},
  },
];
