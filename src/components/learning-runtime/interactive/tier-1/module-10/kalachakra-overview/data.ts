/**
 * Kālacakra Overview — Data Layer
 *
 * §7 interactive for Lesson 10.6.3 (Kālacakra Daśā — the Most Complex Classical System).
 *
 * Holds nakṣatra savya/apasavya classification, the 108 pāda concept,
 * and illustrative sign sequences. Exact computation deferred.
 */

import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';
import { grahas } from "@/design-tokens/grahvani-learning/colors";

/* ─── Savya / Apasavya classification ──────────────────────────────────── */

/** Nakṣatra numbers (1–27) that are Savya (direct / forward sequence). */
const SAVYA_NAKSHATRA_NUMS = new Set([
  1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
]);

/** Nakṣatra numbers (1–27) that are Apasavya (reverse / backward sequence). */
const APASAVYA_NAKSHATRA_NUMS = new Set([
  2, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
]);

export function isSavya(nakshatraNum: number): boolean {
  return SAVYA_NAKSHATRA_NUMS.has(nakshatraNum);
}

export function isApasavya(nakshatraNum: number): boolean {
  return APASAVYA_NAKSHATRA_NUMS.has(nakshatraNum);
}

export function getDirection(nakshatraNum: number): "savya" | "apasavya" | "unknown" {
  if (SAVYA_NAKSHATRA_NUMS.has(nakshatraNum)) return "savya";
  if (APASAVYA_NAKSHATRA_NUMS.has(nakshatraNum)) return "apasavya";
  return "unknown";
}

/* ─── Sign sequence data ───────────────────────────────────────────────── */

export interface SignData {
  index: number;
  name: string;
  nameIAST: string;
  lord: string;
  color: string;
}

export const KALA_SIGN_SEQUENCE: SignData[] = [
  { index: 0, name: "Aries", nameIAST: "Meṣa", lord: "Mars", color: grahas.mangala.primary },
  { index: 1, name: "Taurus", nameIAST: "Vṛṣabha", lord: "Venus", color: grahas.shukra.primary },
  { index: 2, name: "Gemini", nameIAST: "Mithuna", lord: "Mercury", color: grahas.budha.primary },
  { index: 3, name: "Cancer", nameIAST: "Karkaṭa", lord: "Moon", color: grahas.candra.primary },
  { index: 4, name: "Leo", nameIAST: "Siṃha", lord: "Sun", color: grahas.surya.primary },
  { index: 5, name: "Virgo", nameIAST: "Kanyā", lord: "Mercury", color: grahas.budha.primary },
  { index: 6, name: "Libra", nameIAST: "Tulā", lord: "Venus", color: grahas.shukra.primary },
  { index: 7, name: "Scorpio", nameIAST: "Vṛścika", lord: "Mars", color: grahas.mangala.primary },
  { index: 8, name: "Sagittarius", nameIAST: "Dhanus", lord: "Jupiter", color: grahas.guru.primary },
  { index: 9, name: "Capricorn", nameIAST: "Makara", lord: "Saturn", color: grahas.shani.primary },
  { index: 10, name: "Aquarius", nameIAST: "Kumbha", lord: "Saturn", color: grahas.shani.primary },
  { index: 11, name: "Pisces", nameIAST: "Mīna", lord: "Jupiter", color: grahas.guru.primary },
];

/** Get the illustrative sign sequence for a given direction. */
export function getSignSequence(direction: "savya" | "apasavya"): SignData[] {
  if (direction === "savya") return [...KALA_SIGN_SEQUENCE];
  return [...KALA_SIGN_SEQUENCE].reverse();
}

/** Illustrative starting sign index for a nakṣatra-pāda (simplified). */
export function getIllustrativeStartSign(nakshatraNum: number, pada: number): number {
  // Simplified: each pāda shifts the start by 3 signs (108 pādas ÷ 12 signs = 9 pādas per sign, but we simplify)
  const base = ((nakshatraNum - 1) * 4 + (pada - 1)) % 12;
  return base;
}

/** Build an illustrative Kālacakra sequence for a nakṣatra-pāda. */
export function buildKalachakraSequence(
  nakshatraNum: number,
  pada: number
): { direction: "savya" | "apasavya"; startSign: SignData; sequence: SignData[] } {
  const dir = getDirection(nakshatraNum);
  const effectiveDir = dir === "unknown" ? "savya" : dir;
  const startIndex = getIllustrativeStartSign(nakshatraNum, pada);
  const baseSequence = getSignSequence(effectiveDir);

  // Rotate so the start sign is first
  const rotated = [
    ...baseSequence.slice(baseSequence.findIndex((s) => s.index === startIndex)),
    ...baseSequence.slice(0, baseSequence.findIndex((s) => s.index === startIndex)),
  ];

  return {
    direction: effectiveDir,
    startSign: KALA_SIGN_SEQUENCE[startIndex],
    sequence: rotated,
  };
}

/* ─── Re-export nakṣatras ──────────────────────────────────────────────── */

export { NAKSHATRAS };
