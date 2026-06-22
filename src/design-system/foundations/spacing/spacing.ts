/**
 * Spacing Foundation Scale
 *
 * The base spacing unit is 0.25rem (4px). All spacing tokens are multiples of
 * this unit so the entire product shares a single visual rhythm.
 *
 * Product code should prefer the semantic layout tokens in
 * `layout-spacing.ts` and `dashboard-spacing.ts`. The scale itself is the
 * underlying numeric reference.
 */

export const spacingScale = {
  /** 0px — collapse, no space. */
  0: '0',
  /** 4px — tight spacing: labels, badges, inline icons. */
  1: '0.25rem',
  /** 8px — compact spacing: table rows, input internal padding, small gaps. */
  2: '0.5rem',
  /** 12px — default tight spacing: card compact padding, metadata groups. */
  3: '0.75rem',
  /** 16px — default spacing: card gaps, form field gaps, section sub-groups. */
  4: '1rem',
  /** 20px — generous component padding: default card padding. */
  5: '1.25rem',
  /** 24px — section padding, page horizontal padding, form section gaps. */
  6: '1.5rem',
  /** 32px — large gaps: page section gaps, major content groups. */
  8: '2rem',
  /** 40px — extra-large gaps: hero sections, report section gaps. */
  10: '2.5rem',
  /** 48px — section-to-section spacing on long pages. */
  12: '3rem',
  /** 64px — major page divisions, landing section spacing. */
  16: '4rem',
  /** 80px — page-level section breaks. */
  20: '5rem',
  /** 96px — largest page rhythm, hero breakouts. */
  24: '6rem',
} as const;

export type SpacingScaleToken = keyof typeof spacingScale;

/**
 * Convert a scale token to its CSS rem value.
 */
export const getSpace = (token: SpacingScaleToken): string => spacingScale[token];

/**
 * Convert a scale token to its approximate pixel value for documentation.
 */
export const getSpacePx = (token: SpacingScaleToken): number =>
  Math.round(parseFloat(spacingScale[token]) * 16);
