/**
 * Font Size Scale
 *
 * A single rem-based scale used by every semantic typography token.
 * The minimum size is 12px (0.75rem). Sizes below 12px are not part of the
 * foundation and must not be used for UI text.
 *
 * This scale uses t-shirt sizes for internal reference only. Product code
 * must consume the semantic tokens (display, heading, title, body, meta).
 */

export const fontSizeScale = {
  /** 12px — minimum readable size. Use for metadata, captions, timestamps. */
  '2xs': '0.75rem',
  /** 13px — small body, large metadata, table cells. */
  xs: '0.8125rem',
  /** 14px — default body, small titles, labels. */
  sm: '0.875rem',
  /** 16px — emphasis body, medium titles. */
  md: '1rem',
  /** 18px — large title, small heading. */
  lg: '1.125rem',
  /** 20px — section heading. */
  xl: '1.25rem',
  /** 24px — page heading. */
  '2xl': '1.5rem',
  /** 28px — small display. */
  '3xl': '1.75rem',
  /** 32px — medium display. */
  '4xl': '2rem',
  /** 40px — large display. */
  '5xl': '2.5rem',
  /** 48px — extra-large display / hero. */
  '6xl': '3rem',
} as const;

export type FontSizeToken = keyof typeof fontSizeScale;
export type FontSizeValue = (typeof fontSizeScale)[FontSizeToken];

/**
 * Convert a scale token to its approximate pixel value for documentation.
 */
export const getPixelSize = (token: FontSizeToken): number =>
  Math.round(parseFloat(fontSizeScale[token]) * 16);
