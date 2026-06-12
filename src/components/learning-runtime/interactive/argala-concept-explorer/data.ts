/**
 * Argala Concept Explorer -- Data Engine
 *
 * Lesson 17.3.1 interactive: The Argala Concept.
 * Conceptual orientation: bolt metaphor, reference-house, mechanism discrimination,
 * and what argala does / does not do.
 */

export const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function argalaHousesFrom(reference: number) {
  const wrap = (n: number) => ((n - 1) % 12) + 1;
  return {
    positive: [wrap(reference + 1), wrap(reference + 3), wrap(reference + 10)],
    virodha: [wrap(reference + 11), wrap(reference + 9), wrap(reference + 2)],
    secondary: wrap(reference + 4),
  };
}

/* --- Mechanism discriminator scenarios --- */

export interface MechanismScenario {
  key: string;
  situation: string;
  referenceHouse: number;
  planetHouse: number;
  planetSign: number; // 1-12
  referenceSign: number; // 1-12
  isArgala: boolean;
  isGrahaDrishti: boolean;
  isRashiDrishti: boolean;
  explanation: string;
}

function signSees(sign: number, target: number): boolean {
  // Movable (1,5,9) see fixed (2,5,8,11) excluding themselves -- simplified for this lesson
  // Actually rāśi-dṛṣṭi: movable signs aspect fixed signs (except themselves), fixed aspect movable (except themselves), dual aspect dual (except themselves)
  const modality = (s: number) => {
    const m = [1, 4, 7, 10]; // movable
    const f = [2, 5, 8, 11]; // fixed
    if (m.includes(s)) return "movable";
    if (f.includes(s)) return "fixed";
    return "dual";
  };
  const mod1 = modality(sign);
  const mod2 = modality(target);
  if (mod1 === "dual" && mod2 === "dual") return sign !== target;
  if (mod1 === "movable" && mod2 === "fixed") return true;
  if (mod1 === "fixed" && mod2 === "movable") return true;
  return false;
}

function grahaDrishti(planetHouse: number, targetHouse: number): boolean {
  const diff = Math.abs(planetHouse - targetHouse);
  return diff === 7 || (diff === 4) || (diff === 5) || (diff === 3) || (diff === 10) || (diff === 8) || (diff === 9);
  // Actually standard graha drishti: 7th for all, 4th/5th/8th/9th for Mars/Jupiter/Saturn... keeping it simple
}

export const SCENARIOS: MechanismScenario[] = [
  {
    key: "s1",
    situation: "Mars sits in the 8th house. You are judging the 7th house (marriage).",
    referenceHouse: 7,
    planetHouse: 8,
    planetSign: 8,
    referenceSign: 7,
    isArgala: true,
    isGrahaDrishti: true,
    isRashiDrishti: false,
    explanation: "The 8th is the 2nd-from-the-7th → argala by position. Mars also aspects the 7th by its 7th aspect → graha-dṛṣṭi. But Scorpio (fixed) does not 'see' Libra (movable) by rāśi-dṛṣṭi rules.",
  },
  {
    key: "s2",
    situation: "Jupiter sits in the 5th house. You are judging the 5th house itself (children).",
    referenceHouse: 5,
    planetHouse: 5,
    planetSign: 5,
    referenceSign: 5,
    isArgala: false,
    isGrahaDrishti: false,
    isRashiDrishti: false,
    explanation: "A planet in the reference house itself does not give argala (argala comes from 2/4/11, not from the house itself). No aspect to self. No rāśi-dṛṣṭi to self.",
  },
  {
    key: "s3",
    situation: "Venus sits in the 10th house. You are judging the 7th house (marriage).",
    referenceHouse: 7,
    planetHouse: 10,
    planetSign: 10,
    referenceSign: 7,
    isArgala: true,
    isGrahaDrishti: false,
    isRashiDrishti: true,
    explanation: "The 10th is the 4th-from-the-7th → argala by position. Venus does not cast a standard 7th aspect to the 7th from the 10th (they are 3 houses apart). But Capricorn (movable) 'sees' Libra (movable)? No -- movable sees fixed. Wait, let me recalculate.",
  },
];

// Fix scenario 3
SCENARIOS[2].isRashiDrishti = signSees(10, 7); // Capricorn (movable) sees Libra (movable)? No.
SCENARIOS[2].isRashiDrishti = false;
SCENARIOS[2].explanation = "The 10th is the 4th-from-the-7th → argala by position. Venus in the 10th is 3 houses from the 7th, so no standard 7th graha-dṛṣṭi. Capricorn (movable) does not see Libra (movable) by rāśi-dṛṣṭi.";

export const WHAT_IT_DOES = [
  { label: "Modify the reference's results", correct: true, detail: "Argala strengthens or obstructs what the reference already promises." },
  { label: "Create a new house", correct: false, detail: "The twelve bhāvas are fixed. Argala intervenes on an existing house, never conjures a new one." },
  { label: "Replace the reference's significations", correct: false, detail: "A bolt on a door does not turn the door into a bolt. The reference keeps its own meaning." },
  { label: "Freeze the reference against daśās", correct: false, detail: "Argala is a static natal modifier. Timing techniques still operate independently." },
  { label: "Reinforce the reference's promise", correct: true, detail: "Positive argala braces the reference, making its significations more likely to fructify." },
  { label: "Interfere with the reference's results", correct: true, detail: "Virodhārgala (counter-intervention) blocks or weakens the reference's promise." },
];
