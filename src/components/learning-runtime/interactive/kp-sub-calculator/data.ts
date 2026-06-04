// Vimśottarī Daśā cycle — the canonical 9-planet sequence with year-lengths.
// The sub order within any Nakṣatra starts from the Nakṣatra's own lord
// and follows this cycle, wrapping around.

export interface VimshottariPlanet {
  id: string;
  name: string;
  years: number;
  /** sub width in arc-minutes = (years / 120) × 800 */
  widthArcMin: number;
  /** human-readable width string */
  widthLabel: string;
  color: string;
}

// Canonical Vimśottarī order
export const VIMSOTTARI_CYCLE: VimshottariPlanet[] = [
  { id: "ke", name: "Ketu",    years: 7,  widthArcMin: 46.667,  widthLabel: "0°46′40″", color: "#8B6914" },
  { id: "ve", name: "Venus",   years: 20, widthArcMin: 133.333, widthLabel: "2°13′20″", color: "#B8860B" },
  { id: "su", name: "Sun",     years: 6,  widthArcMin: 40.0,    widthLabel: "0°40′00″", color: "#CD853F" },
  { id: "mo", name: "Moon",    years: 10, widthArcMin: 66.667,  widthLabel: "1°06′40″", color: "#D2B48C" },
  { id: "ma", name: "Mars",    years: 7,  widthArcMin: 46.667,  widthLabel: "0°46′40″", color: "#A0522D" },
  { id: "ra", name: "Rāhu",    years: 18, widthArcMin: 120.0,   widthLabel: "2°00′00″", color: "#6B4423" },
  { id: "ju", name: "Jupiter", years: 16, widthArcMin: 106.667, widthLabel: "1°46′40″", color: "#DAA520" },
  { id: "sa", name: "Saturn",  years: 19, widthArcMin: 126.667, widthLabel: "2°06′40″", color: "#7B6A3A" },
  { id: "me", name: "Mercury", years: 17, widthArcMin: 113.333, widthLabel: "1°53′20″", color: "#9B8555" },
];

export interface NakshatraKP {
  id: number;        // 1–27
  name: string;
  lordIndex: number; // index into VIMSOTTARI_CYCLE (0=Ketu, 1=Venus, …)
}

export const NAKSHATRAS_KP: NakshatraKP[] = [
  { id: 1,  name: "Aśvinī",              lordIndex: 0 }, // Ketu
  { id: 2,  name: "Bharaṇī",             lordIndex: 1 }, // Venus
  { id: 3,  name: "Kṛttikā",             lordIndex: 2 }, // Sun
  { id: 4,  name: "Rohiṇī",              lordIndex: 3 }, // Moon
  { id: 5,  name: "Mṛgaśīrṣa",          lordIndex: 4 }, // Mars
  { id: 6,  name: "Ārdrā",               lordIndex: 5 }, // Rahu
  { id: 7,  name: "Punarvasu",            lordIndex: 6 }, // Jupiter
  { id: 8,  name: "Puṣya",               lordIndex: 7 }, // Saturn
  { id: 9,  name: "Āśleṣā",              lordIndex: 8 }, // Mercury
  { id: 10, name: "Maghā",               lordIndex: 0 }, // Ketu
  { id: 11, name: "Pūrva Phalgunī",      lordIndex: 1 }, // Venus
  { id: 12, name: "Uttara Phalgunī",     lordIndex: 2 }, // Sun
  { id: 13, name: "Hasta",               lordIndex: 3 }, // Moon
  { id: 14, name: "Citrā",               lordIndex: 4 }, // Mars
  { id: 15, name: "Svātī",               lordIndex: 5 }, // Rahu
  { id: 16, name: "Viśākhā",             lordIndex: 6 }, // Jupiter
  { id: 17, name: "Anurādhā",            lordIndex: 7 }, // Saturn
  { id: 18, name: "Jyeṣṭhā",            lordIndex: 8 }, // Mercury
  { id: 19, name: "Mūla",                lordIndex: 0 }, // Ketu
  { id: 20, name: "Pūrva Aṣāḍhā",       lordIndex: 1 }, // Venus
  { id: 21, name: "Uttara Aṣāḍhā",      lordIndex: 2 }, // Sun
  { id: 22, name: "Śravaṇa",             lordIndex: 3 }, // Moon
  { id: 23, name: "Dhaniṣṭhā",           lordIndex: 4 }, // Mars
  { id: 24, name: "Śatabhiṣaj",          lordIndex: 5 }, // Rahu
  { id: 25, name: "Pūrva Bhādrapadā",    lordIndex: 6 }, // Jupiter
  { id: 26, name: "Uttara Bhādrapadā",   lordIndex: 7 }, // Saturn
  { id: 27, name: "Revatī",              lordIndex: 8 }, // Mercury
];

/** Return the 9 subs for a given nakshatra, starting from its lord and cycling through. */
export function getSubsForNakshatra(lordIndex: number): VimshottariPlanet[] {
  const subs: VimshottariPlanet[] = [];
  for (let i = 0; i < 9; i++) {
    subs.push(VIMSOTTARI_CYCLE[(lordIndex + i) % 9]);
  }
  return subs;
}

export interface DrillScenario {
  slug: string;
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "s1",
    question: "What is the width of Venus's sub within any Nakṣatra? (Venus has 20 Vimśottarī years.)",
    options: [
      {
        id: "A",
        label: "1°28′53″",
        isCorrect: false,
        explanation: "This would be the width if all 9 subs were equal (13°20′ ÷ 9). But KP subs are proportional to Vimśottarī years."
      },
      {
        id: "B",
        label: "2°13′20″",
        isCorrect: true,
        explanation: "Correct! (20 / 120) × 13°20′ = (20 / 120) × 800′ = 133.33′ = 2°13′20″. Venus gets the widest sub because it has the most Daśā years."
      },
      {
        id: "C",
        label: "2°00′00″",
        isCorrect: false,
        explanation: "This is Rāhu's sub width (18 years). Venus (20 years) gets a slightly wider sub."
      }
    ]
  },
  {
    slug: "s2",
    question: "Why do KP tables list 249 sub-divisions when 27 × 9 = 243?",
    options: [
      {
        id: "A",
        label: "Because 6 subs straddle a sign cusp and are split, counting in both signs",
        isCorrect: true,
        explanation: "Correct! 243 sub-lords exist, but when tallied sign-by-sign, 6 subs cross a 30° boundary and get listed in both signs: 243 + 6 = 249."
      },
      {
        id: "B",
        label: "Because 6 extra sub-lords are added for Rāhu and Ketu",
        isCorrect: false,
        explanation: "No extra sub-lords are invented. Rāhu and Ketu already appear in the standard 9-planet cycle."
      },
      {
        id: "C",
        label: "Because the formula rounds up to 249 for convenience",
        isCorrect: false,
        explanation: "It is not a rounding issue. The count difference has a precise structural cause (cusp-straddling)."
      }
    ]
  },
  {
    slug: "s3",
    question: "In Bharaṇī (Nakṣatra Lord: Venus), what is the FIRST sub-lord in the KP sequence?",
    options: [
      {
        id: "A",
        label: "Ketu",
        isCorrect: false,
        explanation: "Ketu is the first planet in the Vimśottarī cycle, but the sub sequence starts from the Nakṣatra's own Lord, not always from Ketu."
      },
      {
        id: "B",
        label: "Venus",
        isCorrect: true,
        explanation: "Correct! The sub sequence always begins with the Nakṣatra's own Vimśottarī Lord. Since Bharaṇī's lord is Venus, the first sub is Venus, then Sun, Moon, Mars, etc."
      },
      {
        id: "C",
        label: "Sun",
        isCorrect: false,
        explanation: "Sun comes second in the cycle after Venus (Bharaṇī's lord). The sequence starts from the lord."
      }
    ]
  }
];
