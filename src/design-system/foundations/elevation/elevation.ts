/**
 * Elevation Foundation
 *
 * A minimal shadow system for Grahvani. Shadows are warm-tinted in light mode
 * to harmonize with the parchment palette, and neutral-dark in dark mode.
 *
 * Philosophy:
 * - Borders provide structure.
 * - Shadows provide elevation only when needed.
 * - Most surfaces are flat; only raised or floating surfaces cast shadows.
 */

export const elevationTokens = {
  light: {
    /** No shadow. Flat surface. */
    none: 'none',
    /** Subtle lift: resting cards, widgets, small panels. */
    sm: '0 1px 2px rgba(62, 42, 31, 0.05), 0 1px 3px rgba(62, 42, 31, 0.04)',
    /** Default elevation: cards (hover), dropdowns, popovers, tooltips. */
    md: '0 4px 12px rgba(62, 42, 31, 0.08), 0 2px 6px rgba(62, 42, 31, 0.05)',
    /** Prominent elevation: modals, drawers, toasts. */
    lg: '0 8px 24px rgba(62, 42, 31, 0.12), 0 4px 12px rgba(62, 42, 31, 0.06)',
    /** Maximum elevation: full-screen overlays, command palettes. */
    xl: '0 16px 48px rgba(62, 42, 31, 0.16), 0 8px 24px rgba(62, 42, 31, 0.08)',
  },
  dark: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ElevationTheme = typeof elevationTokens;
export type ElevationToken = keyof ElevationTheme['light'];

/**
 * Resolve an elevation token for the active theme.
 */
export const getElevation = (mode: 'light' | 'dark', token: ElevationToken): string =>
  elevationTokens[mode][token];
