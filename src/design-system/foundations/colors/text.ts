/**
 * Text Foundation Tokens
 *
 * A single, background-aware text palette for Grahvani. Every text color is
 * semantic and automatically readable on the corresponding background or
 * surface. Developers must never pick text colors by hand.
 *
 * Tokens are relative to the active theme. In light mode the default set is
 * dark brown; in dark mode it flips to warm cream. `text.inverse` is the
 * opposite color for inverted components (buttons, badges, toasts) and for
 * mixed-theme surfaces such as a dark dashboard card inside a light app.
 */

export const textTokens = {
  light: {
    /** text.primary — Headings, body copy, and any primary content. */
    primary: '#2D2419',
    /** text.secondary — Subheadings, descriptions, supporting copy. */
    secondary: '#4A3B2A',
    /** text.muted — Captions, timestamps, helper text, metadata. */
    muted: '#6B533C',
    /** text.disabled — Disabled labels, placeholders, non-interactive hints. */
    disabled: '#A89480',
    /** text.inverse — Text on inverted or dark accents inside light mode. */
    inverse: '#F5EFE4',
  },
  dark: {
    primary: '#F0E8D8',
    secondary: '#D4C4A8',
    muted: '#A89070',
    disabled: '#6B5F52',
    inverse: '#2D2419',
  },
} as const;

export type TextTheme = typeof textTokens;
export type TextToken = keyof TextTheme['light'];

/**
 * Convenience accessor for theme-aware text colors.
 */
export const getText = (mode: 'light' | 'dark', token: TextToken): string =>
  textTokens[mode][token];

/**
 * Every background and surface token that participates in the readability
 * system. These names must stay in sync with the background and surface
 * foundations.
 */
export type BackgroundOrSurface =
  | 'bg.canvas'
  | 'bg.subtle'
  | 'bg.elevated'
  | 'surface.primary'
  | 'surface.secondary'
  | 'surface.elevated';

/**
 * Semantic text roles. Maps 1:1 to the text tokens in the active theme.
 */
export type TextRole = 'primary' | 'secondary' | 'muted' | 'disabled';

/**
 * Default text role for each surface. The same mapping applies in both themes
 * because backgrounds and surfaces flip together with text tokens.
 */
export const surfaceToTextRole: Record<BackgroundOrSurface, Record<TextRole, TextToken>> = {
  'bg.canvas': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
  'bg.subtle': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
  'bg.elevated': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
  'surface.primary': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
  'surface.secondary': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
  'surface.elevated': {
    primary: 'primary',
    secondary: 'secondary',
    muted: 'muted',
    disabled: 'disabled',
  },
};

/**
 * Resolve a semantic text role for a given surface in the active theme.
 * This is the default API for automatic readability.
 */
export const getTextForSurface = (
  mode: 'light' | 'dark',
  surface: BackgroundOrSurface,
  role: TextRole = 'primary'
): string => {
  const token = surfaceToTextRole[surface][role];
  return getText(mode, token);
};

/**
 * Approved text tokens per surface for runtime validation / linting.
 * A token is approved when it meets WCAG AA (4.5:1) against that surface.
 */
export const approvedTextCombinations: Record<BackgroundOrSurface, TextToken[]> = {
  'bg.canvas': ['primary', 'secondary', 'muted'],
  'bg.subtle': ['primary', 'secondary', 'muted'],
  'bg.elevated': ['primary', 'secondary', 'muted'],
  'surface.primary': ['primary', 'secondary', 'muted'],
  'surface.secondary': ['primary', 'secondary', 'muted'],
  'surface.elevated': ['primary', 'secondary', 'muted'],
};

/**
 * Forbidden combinations that should never ship.
 *
 * `disabled` is intentionally low-contrast and must never be used for readable
 * content. `inverse` must not be used on same-theme surfaces because it is
 * designed for inverted accents and mixed-theme surfaces.
 */
export const forbiddenTextCombinations: Array<{
  surface: BackgroundOrSurface;
  token: TextToken;
  reason: string;
}> = [
  {
    surface: 'bg.canvas',
    token: 'disabled',
    reason: 'Disabled text fails WCAG AA on canvas and must only mark non-interactive state.',
  },
  {
    surface: 'bg.subtle',
    token: 'disabled',
    reason: 'Disabled text is not readable on subtle backgrounds.',
  },
  {
    surface: 'bg.elevated',
    token: 'disabled',
    reason: 'Disabled text is not readable on elevated backgrounds.',
  },
  {
    surface: 'surface.primary',
    token: 'disabled',
    reason: 'Disabled text is not readable on primary surfaces.',
  },
  {
    surface: 'surface.secondary',
    token: 'disabled',
    reason: 'Disabled text is not readable on secondary surfaces.',
  },
  {
    surface: 'surface.elevated',
    token: 'disabled',
    reason: 'Disabled text is not readable on elevated surfaces.',
  },
  {
    surface: 'bg.canvas',
    token: 'inverse',
    reason: 'Inverse text is invisible on light canvas; reserved for inverted components or dark surfaces.',
  },
  {
    surface: 'bg.subtle',
    token: 'inverse',
    reason: 'Inverse text is invisible on light subtle backgrounds.',
  },
  {
    surface: 'bg.elevated',
    token: 'inverse',
    reason: 'Inverse text is invisible on light elevated backgrounds.',
  },
  {
    surface: 'surface.primary',
    token: 'inverse',
    reason: 'Inverse text is invisible on light primary surfaces.',
  },
  {
    surface: 'surface.secondary',
    token: 'inverse',
    reason: 'Inverse text is invisible on light secondary surfaces.',
  },
  {
    surface: 'surface.elevated',
    token: 'inverse',
    reason: 'Inverse text is invisible on light elevated surfaces.',
  },
];

/**
 * Contrast reference data (WCAG 2.1, normal text).
 * Kept here for linting tools, Storybook docs, and automated checks.
 */
export const textContrastReference: Record<
  'light' | 'dark',
  Record<BackgroundOrSurface, Record<TextToken, number>>
> = {
  light: {
    'bg.canvas': {
      primary: 13.36,
      secondary: 9.44,
      muted: 6.29,
      disabled: 2.55,
      inverse: 1.0,
    },
    'bg.subtle': {
      primary: 14.57,
      secondary: 10.29,
      muted: 6.86,
      disabled: 2.78,
      inverse: 1.09,
    },
    'bg.elevated': {
      primary: 14.03,
      secondary: 9.91,
      muted: 6.6,
      disabled: 2.68,
      inverse: 1.05,
    },
    'surface.primary': {
      primary: 14.56,
      secondary: 10.29,
      muted: 6.85,
      disabled: 2.78,
      inverse: 1.09,
    },
    'surface.secondary': {
      primary: 13.98,
      secondary: 9.88,
      muted: 6.58,
      disabled: 2.67,
      inverse: 1.05,
    },
    'surface.elevated': {
      primary: 14.88,
      secondary: 10.52,
      muted: 7.0,
      disabled: 2.84,
      inverse: 1.12,
    },
  },
  dark: {
    'bg.canvas': {
      primary: 14.97,
      secondary: 10.65,
      muted: 5.98,
      disabled: 2.94,
      inverse: 1.2,
    },
    'bg.subtle': {
      primary: 14.14,
      secondary: 10.06,
      muted: 5.65,
      disabled: 2.78,
      inverse: 1.13,
    },
    'bg.elevated': {
      primary: 12.37,
      secondary: 8.8,
      muted: 4.94,
      disabled: 2.43,
      inverse: 1.01,
    },
    'surface.primary': {
      primary: 13.76,
      secondary: 9.79,
      muted: 5.5,
      disabled: 2.7,
      inverse: 1.1,
    },
    'surface.secondary': {
      primary: 14.45,
      secondary: 10.27,
      muted: 5.77,
      disabled: 2.84,
      inverse: 1.15,
    },
    'surface.elevated': {
      primary: 12.86,
      secondary: 9.15,
      muted: 5.14,
      disabled: 2.52,
      inverse: 1.03,
    },
  },
};

/**
 * Check whether a text token is compliant on a given surface.
 * Returns the contrast ratio and AA/AAA status.
 */
export const getTextContrastStatus = (
  mode: 'light' | 'dark',
  surface: BackgroundOrSurface,
  token: TextToken
): { ratio: number; aa: boolean; aaa: boolean } => {
  const ratio = textContrastReference[mode][surface][token];
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
  };
};
