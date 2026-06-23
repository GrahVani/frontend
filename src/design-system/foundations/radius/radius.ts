/**
 * Radius Foundation Scale
 *
 * A minimal, professional radius system for Grahvani. The scale is intentionally
 * small so every component feels related and no radius is chosen arbitrarily.
 *
 * Personality: soft but precise — appropriate for a premium astrology SaaS,
 * not playful consumer UI or aggressive crypto dashboards.
 */

export const radiusScale = {
  /** 0px — no radius. */
  none: '0',
  /** 4px — small controls, badges, tags, inputs. */
  sm: '0.25rem',
  /** 8px — default for cards, buttons, dropdowns, data widgets. */
  md: '0.5rem',
  /** 12px — featured cards, panels, larger surfaces. */
  lg: '0.75rem',
  /** 16px — modals, drawers, hero cards, landing surfaces. */
  xl: '1rem',
  /** 9999px — pills, avatars, circular elements. */
  full: '9999px',
} as const;

export type RadiusScaleToken = keyof typeof radiusScale;

/**
 * Resolve a radius token to its CSS value.
 */
export const getRadius = (token: RadiusScaleToken): string => radiusScale[token];

/**
 * Resolve a radius token to its approximate pixel value for documentation.
 */
export const getRadiusPx = (token: RadiusScaleToken): number =>
  token === 'full' ? 9999 : Math.round(parseFloat(radiusScale[token]) * 16);
