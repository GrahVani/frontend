/**
 * Surface Foundation Tokens
 *
 * Surfaces are containers that live *on top of* backgrounds: cards, panels,
 * sheets, sidebars, and modals. Use these instead of raw white or parchment.
 *
 * Principles:
 * - surface.primary is the default content container.
 * - surface.secondary is for nested/inset panels and sidebars.
 * - surface.elevated is reserved for floating layers (modals, popovers, dialogs).
 */

export const surfaceTokens = {
  light: {
    /** surface.primary — Default card, sheet, and main panel surface. */
    primary: '#FFF9F0',
    /** surface.secondary — Inset panels, sidebars, secondary wells. */
    secondary: '#FAF5E6',
    /** surface.elevated — Modals, dialogs, popovers, menus. */
    elevated: '#FFFCF6',
  },
  dark: {
    primary: '#241C16',
    secondary: '#1E1810',
    elevated: '#2A2218',
  },
} as const;

export type SurfaceTheme = typeof surfaceTokens;
export type SurfaceToken = keyof SurfaceTheme['light'];

/**
 * Convenience accessor for runtime/theme-aware usage.
 */
export const getSurface = (mode: 'light' | 'dark', token: SurfaceToken): string =>
  surfaceTokens[mode][token];
