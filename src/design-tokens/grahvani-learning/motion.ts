/**
 * Grahvani Learning — Motion Vocabulary
 * Mirrors §6 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 */

export const easings = {
  grahvani: [0.32, 0.72, 0.24, 1] as const,
  ceremonial: [0.65, 0, 0.35, 1] as const,
} as const;

export const springs = {
  soft: { type: "spring" as const, stiffness: 160, damping: 22 },
} as const;

export const durations = {
  hover: 0.12,
  tapFeedback: 0.18,
  sectionOpenClose: 0.28,
  pageTransition: 0.36,
  sectionCeremonyFill: 0.32,
  sectionCeremonySettle: 0.28,
  sectionCeremonyTotal: 0.60,
  lessonCeremonyBloom: 0.50,
  lessonCeremonyHold: 0.60,
  lessonCeremonyRecede: 0.30,
  lessonCeremonyTotal: 1.40,
  chapterCeremonyOverlay: 0.64,
} as const;

export type MotionToken = keyof typeof durations;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function reducedOrFull<T>(reduced: T, full: T): T {
  return prefersReducedMotion() ? reduced : full;
}
