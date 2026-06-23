/**
 * Letter Spacing (Tracking) Scale
 *
 * Large display type is slightly tightened for elegance.
 * Small metadata is slightly opened for readability.
 * Body text uses neutral tracking so long-form reading is comfortable.
 */

export const letterSpacingScale = {
  /** -0.02em — Large display / hero. */
  displayTight: '-0.02em',
  /** -0.015em — Medium display. */
  display: '-0.015em',
  /** -0.01em — Headings. */
  heading: '-0.01em',
  /** -0.005em — Small headings. */
  headingLoose: '-0.005em',
  /** 0 — Body and titles. Neutral, readable. */
  body: '0',
  /** 0.01em — Metadata and captions. Slight openness at small sizes. */
  meta: '0.01em',
} as const;

export type LetterSpacingToken = keyof typeof letterSpacingScale;
export type LetterSpacingValue = (typeof letterSpacingScale)[LetterSpacingToken];
