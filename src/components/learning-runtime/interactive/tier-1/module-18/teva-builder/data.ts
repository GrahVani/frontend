/**
 * Teva Builder — data engine for Lesson 18.2.2.
 *
 * Static content for signs, planets, example presets, and
 * the Parāśarī comparison overlay.
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
}

export const PLANETS: PlanetDef[] = [
  { key: "Sun", name: "Sun", abbr: "Su" },
  { key: "Moon", name: "Moon", abbr: "Mo" },
  { key: "Mars", name: "Mars", abbr: "Ma" },
  { key: "Mercury", name: "Mercury", abbr: "Me" },
  { key: "Jupiter", name: "Jupiter", abbr: "Ju" },
  { key: "Venus", name: "Venus", abbr: "Ve" },
  { key: "Saturn", name: "Saturn", abbr: "Sa" },
  { key: "Rahu", name: "Rāhu", abbr: "Ra" },
];

export interface Preset {
  label: string;
  lagnaSign: number;
  lagnaName: string;
  placements: Record<string, number>;
}

export const PRESETS: Preset[] = [
  {
    label: "Example 1 — Cancer lagna (Lesson §6)",
    lagnaSign: 3,
    lagnaName: "Cancer",
    placements: {
      Sun: 4,
      Moon: 3,
      Mars: 0,
      Mercury: 5,
      Jupiter: 8,
      Venus: 6,
      Saturn: 6,
      Rahu: 2,
    },
  },
  {
    label: "Example 2 — Scorpio lagna (Lesson §6)",
    lagnaSign: 7,
    lagnaName: "Scorpio",
    placements: {
      Sun: 9,
      Saturn: 11,
      Mars: 4,
    },
  },
  {
    label: "Empty frame",
    lagnaSign: 0,
    lagnaName: "Aries",
    placements: {},
  },
];
