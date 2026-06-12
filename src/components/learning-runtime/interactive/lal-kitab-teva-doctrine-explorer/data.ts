/**
 * Lal Kitab Teva Doctrine Explorer — data engine for Lesson 18.2.1.
 *
 * Static content for the fixed-Aries frame, planet placement rules,
 * and house-to-sign quiz items.
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

export const GRAHAS = [
  { key: "Sun", name: "Sun", abbr: "Su" },
  { key: "Moon", name: "Moon", abbr: "Mo" },
  { key: "Mars", name: "Mars", abbr: "Ma" },
  { key: "Mercury", name: "Mercury", abbr: "Me" },
  { key: "Jupiter", name: "Jupiter", abbr: "Ju" },
  { key: "Venus", name: "Venus", abbr: "Ve" },
  { key: "Saturn", name: "Saturn", abbr: "Sa" },
];

export interface DemoPlacement {
  lagnaSign: number;
  lagnaName: string;
  placements: { graha: string; houseFromLagna: number; note: string }[];
}

export const DEMO_PLACEMENTS: DemoPlacement[] = [
  {
    lagnaSign: 3, // Cancer
    lagnaName: "Cancer",
    placements: [
      { graha: "Mars", houseFromLagna: 7, note: "Mars in the 7th from Cancer lagna -> Teva house 7 (Libra)" },
      { graha: "Jupiter", houseFromLagna: 9, note: "Jupiter in the 9th from Cancer lagna -> Teva house 9 (Sagittarius)" },
      { graha: "Saturn", houseFromLagna: 4, note: "Saturn in the 4th from Cancer lagna -> Teva house 4 (Cancer)" },
    ],
  },
  {
    lagnaSign: 8, // Sagittarius
    lagnaName: "Sagittarius",
    placements: [
      { graha: "Sun", houseFromLagna: 10, note: "Sun in the 10th from Sagittarius lagna -> Teva house 10 (Capricorn)" },
      { graha: "Venus", houseFromLagna: 2, note: "Venus in the 2nd from Sagittarius lagna -> Teva house 2 (Taurus)" },
      { graha: "Mercury", houseFromLagna: 12, note: "Mercury in the 12th from Sagittarius lagna -> Teva house 12 (Pisces)" },
    ],
  },
  {
    lagnaSign: 0, // Aries
    lagnaName: "Aries",
    placements: [
      { graha: "Moon", houseFromLagna: 5, note: "Moon in the 5th from Aries lagna -> Teva house 5 (Leo)" },
      { graha: "Saturn", houseFromLagna: 11, note: "Saturn in the 11th from Aries lagna -> Teva house 11 (Aquarius)" },
    ],
  },
  {
    lagnaSign: 6, // Libra
    lagnaName: "Libra",
    placements: [
      { graha: "Jupiter", houseFromLagna: 1, note: "Jupiter in the 1st from Libra lagna -> Teva house 1 (Aries)" },
      { graha: "Mars", houseFromLagna: 8, note: "Mars in the 8th from Libra lagna -> Teva house 8 (Scorpio)" },
    ],
  },
];

export interface QuizItem {
  id: number;
  question: string;
  answer: string;
  explanation: string;
}

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 1,
    question: "In the Teva, which sign is always in the 1st house?",
    answer: "Aries",
    explanation: "The fixed-Aries doctrine: Meṣa (Aries) is permanently pinned to house 1, regardless of the native's actual lagna.",
  },
  {
    id: 2,
    question: "A planet sits in the genuine 7th house from the lagna. Which Teva house does it go into, and which sign do we read it with?",
    answer: "Teva house 7, read as Libra",
    explanation: "The lagna determines the planet's house-position, but the Teva's 7th house is always Libra (sign 7). House number equals sign number.",
  },
  {
    id: 3,
    question: "Which sign occupies the Teva's 10th house?",
    answer: "Capricorn",
    explanation: "House 10 = sign 10 = Makara (Capricorn). The fixed mapping never changes.",
  },
  {
    id: 4,
    question: "A native has Leo rising. In the Parāśarī rāśi chart, which sign is in the 1st house? In the Teva?",
    answer: "Parāśarī: Leo. Teva: Aries.",
    explanation: "Parāśarī rotates the frame so the lagna (Leo) becomes house 1. Teva fixes Aries in house 1 for everyone.",
  },
  {
    id: 5,
    question: "In the Teva, does the lagna play any role at all?",
    answer: "Yes — it determines where planets fall within the fixed houses",
    explanation: "The lagna still shifts planet-positions. A planet in the genuine 4th house from lagna goes into Teva house 4. The lagna just never sets the 1st-house sign.",
  },
  {
    id: 6,
    question: "A planet is in Teva house 5. Which sign's signification do we read it with?",
    answer: "Leo",
    explanation: "Read house N as sign N. House 5 is always Siṁha (Leo) in the Teva.",
  },
];
