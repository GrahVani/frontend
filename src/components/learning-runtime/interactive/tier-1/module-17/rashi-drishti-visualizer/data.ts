/**
 * Rāśi-Dṛṣṭi Visualizer engine -- Lesson 17.5.1
 *
 * Computes which three signs any given sign aspects
 * under the Jaimini rāśi-dṛṣṭi rule by sign-class.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SIGN_CLASSES: ("movable" | "fixed" | "dual")[] = [
  "movable", "fixed", "dual", "movable", "fixed", "dual",
  "movable", "fixed", "dual", "movable", "fixed", "dual",
];

export const CLASS_LABELS = {
  movable: "Cara (Movable)",
  fixed: "Sthira (Fixed)",
  dual: "Dvisvabhāva (Dual)",
};

export function getAspectedSigns(signIdx: number): number[] {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "dual") {
    // Dual aspects other dual signs, except itself
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "dual" && i !== signIdx);
  }
  if (cls === "movable") {
    // Movable aspects fixed signs except the adjacent one
    const fixed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "fixed");
    // Adjacent fixed sign: the one at signIdx + 1 (wrapping)
    const adjacent = (signIdx + 1) % 12;
    return fixed.filter((i) => i !== adjacent);
  }
  // Fixed aspects movable signs except the adjacent one
  const movable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => SIGN_CLASSES[i] === "movable");
  // Adjacent movable sign: the one at signIdx - 1 (wrapping)
  const adjacent = (signIdx - 1 + 12) % 12;
  return movable.filter((i) => i !== adjacent);
}

export function getExcludedSign(signIdx: number): number | null {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "dual") return signIdx; // excludes itself
  if (cls === "movable") return (signIdx + 1) % 12; // adjacent fixed ahead
  return (signIdx - 1 + 12) % 12; // adjacent movable behind
}

export function ruleText(signIdx: number): string {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "movable") {
    return "Movable aspects fixed signs, except the adjacent fixed sign.";
  }
  if (cls === "fixed") {
    return "Fixed aspects movable signs, except the adjacent movable sign.";
  }
  return "Dual aspects the other dual signs, except its own self.";
}

export function explanationText(signIdx: number): string {
  const cls = SIGN_CLASSES[signIdx];
  const aspected = getAspectedSigns(signIdx);
  const excluded = getExcludedSign(signIdx);
  if (cls === "dual") {
    return `${SIGNS[signIdx]} is dual. It aspects the other three dual signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. No adjacent dual sign exists to exclude; the only exclusion is ${SIGNS[signIdx]} itself.`;
  }
  if (cls === "movable") {
    return `${SIGNS[signIdx]} is movable. It aspects three of the four fixed signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. The adjacent fixed sign ${excluded !== null ? SIGNS[excluded] : ""} is excluded.`;
  }
  return `${SIGNS[signIdx]} is fixed. It aspects three of the four movable signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. The adjacent movable sign ${excluded !== null ? SIGNS[excluded] : ""} is excluded.`;
}

export const DRILL_QUESTIONS = [
  { signIdx: 0, question: "Which signs does Aries aspect?" },
  { signIdx: 1, question: "Which signs does Taurus aspect?" },
  { signIdx: 2, question: "Which signs does Gemini aspect?" },
  { signIdx: 3, question: "Which signs does Cancer aspect?" },
  { signIdx: 4, question: "Which signs does Leo aspect?" },
  { signIdx: 5, question: "Which signs does Virgo aspect?" },
  { signIdx: 6, question: "Which signs does Libra aspect?" },
  { signIdx: 7, question: "Which signs does Scorpio aspect?" },
  { signIdx: 8, question: "Which signs does Sagittarius aspect?" },
  { signIdx: 9, question: "Which signs does Capricorn aspect?" },
  { signIdx: 10, question: "Which signs does Aquarius aspect?" },
  { signIdx: 11, question: "Which signs does Pisces aspect?" },
];
