/**
 * Border Foundation Tokens
 *
 * Borders separate surfaces and backgrounds without introducing visual noise.
 * Keep borders quiet: their job is structure, not decoration.
 *
 * Principles:
 * - border.primary is for cards, panels, and primary containers.
 * - border.secondary is for dividers, hairlines, and subtle separators.
 * - Gold accents remain decorative; these tokens are structural only.
 */

export const borderTokens = {
  light: {
    /** border.primary — Container outlines, card strokes. */
    primary: '#E7D6B8',
    /** border.secondary — Dividers, separators, table borders. */
    secondary: '#DCC9A6',
  },
  dark: {
    primary: 'rgba(255, 210, 125, 0.06)',
    secondary: 'rgba(255, 255, 255, 0.06)',
  },
} as const;

export type BorderTheme = typeof borderTokens;
export type BorderToken = keyof BorderTheme['light'];

/**
 * Convenience accessor for runtime/theme-aware usage.
 */
export const getBorder = (mode: 'light' | 'dark', token: BorderToken): string =>
  borderTokens[mode][token];
