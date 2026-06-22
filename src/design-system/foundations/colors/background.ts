/**
 * Background Foundation Tokens
 *
 * The ground layer of every Grahvani screen. These tokens describe the
 * environmental color of the page itself — never components that float on top.
 *
 * Principles:
 * - Use exactly one background token per page region.
 * - Backgrounds must feel warm, premium, and spiritually calm.
 * - Dark mode keeps the same semantic intent, shifted to deep espresso tones.
 */

export const backgroundTokens = {
  light: {
    /** bg.canvas — The default page ground. Parchment. */
    canvas: '#FAEFD8',
    /** bg.subtle — Alternate quiet regions within a page. */
    subtle: '#FEFAEA',
    /** bg.elevated — Hover/selected/resting emphasis on the ground. */
    elevated: '#FFF4E6',
  },
  dark: {
    canvas: '#1A1410',
    subtle: '#201A14',
    elevated: '#2E2518',
  },
} as const;

export type BackgroundTheme = typeof backgroundTokens;
export type BackgroundToken = keyof BackgroundTheme['light'];

/**
 * Convenience accessor for runtime/theme-aware usage.
 */
export const getBackground = (mode: 'light' | 'dark', token: BackgroundToken): string =>
  backgroundTokens[mode][token];
