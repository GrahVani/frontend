/**
 * Typography Foundation Tokens
 *
 * Semantic typography tokens for Grahvani. Every text style in the product
 * must resolve to one of these tokens. No arbitrary sizes, no hardcoded
 * pixel values, no opacity-based type.
 *
 * Categories:
 * - display: Hero, brand moments, premium landing headings.
 * - heading: Page and section headings.
 * - title: Card titles, field labels, subsection titles.
 * - body: Paragraphs, descriptions, readable content.
 * - meta: Captions, timestamps, table headers, metadata.
 *
 * Font families are assigned by role, not by token. See `fontFamilyTokens`.
 */

import { fontSizeScale, type FontSizeToken } from './scale';
import { lineHeightScale, type LineHeightToken } from './line-height';
import { letterSpacingScale, type LetterSpacingToken } from './tracking';

export type TypographyCategory = 'display' | 'heading' | 'title' | 'body' | 'meta';
export type TypographyVariant = 'xl' | 'lg' | 'md' | 'sm';

export interface TypographyStyle {
  fontSize: FontSizeToken;
  lineHeight: LineHeightToken;
  letterSpacing: LetterSpacingToken;
  fontWeight: '400' | '500' | '600';
}

export interface ResolvedTypographyStyle {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: '400' | '500' | '600';
}

/**
 * The canonical semantic typography system. All product text must map here.
 */
export const typographyTokens = {
  display: {
    xl: {
      fontSize: '6xl',
      lineHeight: 'display',
      letterSpacing: 'displayTight',
      fontWeight: '400',
    },
    lg: {
      fontSize: '5xl',
      lineHeight: 'display',
      letterSpacing: 'displayTight',
      fontWeight: '400',
    },
    md: {
      fontSize: '4xl',
      lineHeight: 'displayLoose',
      letterSpacing: 'display',
      fontWeight: '400',
    },
    sm: {
      fontSize: '3xl',
      lineHeight: 'heading',
      letterSpacing: 'heading',
      fontWeight: '400',
    },
  },
  heading: {
    xl: {
      fontSize: '2xl',
      lineHeight: 'heading',
      letterSpacing: 'heading',
      fontWeight: '600',
    },
    lg: {
      fontSize: 'xl',
      lineHeight: 'heading',
      letterSpacing: 'headingLoose',
      fontWeight: '600',
    },
    md: {
      fontSize: 'lg',
      lineHeight: 'headingLoose',
      letterSpacing: 'body',
      fontWeight: '600',
    },
    sm: {
      fontSize: 'md',
      lineHeight: 'title',
      letterSpacing: 'body',
      fontWeight: '600',
    },
  },
  title: {
    lg: {
      fontSize: 'lg',
      lineHeight: 'title',
      letterSpacing: 'body',
      fontWeight: '500',
    },
    md: {
      fontSize: 'md',
      lineHeight: 'titleLoose',
      letterSpacing: 'body',
      fontWeight: '500',
    },
    sm: {
      fontSize: 'sm',
      lineHeight: 'titleLoose',
      letterSpacing: 'body',
      fontWeight: '500',
    },
  },
  body: {
    lg: {
      fontSize: 'md',
      lineHeight: 'body',
      letterSpacing: 'body',
      fontWeight: '400',
    },
    md: {
      fontSize: 'sm',
      lineHeight: 'body',
      letterSpacing: 'body',
      fontWeight: '400',
    },
    sm: {
      fontSize: 'xs',
      lineHeight: 'body',
      letterSpacing: 'body',
      fontWeight: '400',
    },
  },
  meta: {
    lg: {
      fontSize: 'xs',
      lineHeight: 'meta',
      letterSpacing: 'meta',
      fontWeight: '500',
    },
    md: {
      fontSize: '2xs',
      lineHeight: 'meta',
      letterSpacing: 'meta',
      fontWeight: '400',
    },
    sm: {
      fontSize: '2xs',
      lineHeight: 'metaTight',
      letterSpacing: 'meta',
      fontWeight: '400',
    },
  },
} as const satisfies Record<
  TypographyCategory,
  Partial<Record<TypographyVariant, TypographyStyle>>
>;

export type TypographyToken = keyof typeof typographyTokens;

/**
 * Resolve a typography token to its concrete CSS values.
 */
export const getTypographyStyle = (
  category: TypographyCategory,
  variant: TypographyVariant
): ResolvedTypographyStyle => {
  const token = (typographyTokens[category] as Record<TypographyVariant, TypographyStyle | undefined>)[
    variant
  ];
  if (!token) {
    throw new Error(`Typography token ${category}.${variant} does not exist.`);
  }
  return {
    fontSize: fontSizeScale[token.fontSize],
    lineHeight: lineHeightScale[token.lineHeight],
    letterSpacing: letterSpacingScale[token.letterSpacing],
    fontWeight: token.fontWeight,
  };
};

/**
 * Font family tokens.
 *
 * Grahvani uses exactly two font families:
 * - font.ui: Inter for all Latin / English application text.
 * - font.devanagari: Tiro Devanagari for Sanskrit / Hindi / Devanagari script.
 *
 * Playfair Display, Cormorant Garamond, and Spectral are removed from the
 * active application typography foundation.
 */
export const fontFamilyTokens = {
  ui: 'var(--font-ui)',
  devanagari: 'var(--font-devanagari)',
} as const;

export type FontFamilyToken = keyof typeof fontFamilyTokens;

/**
 * Map a typography token to its default font family.
 * Every UI typography token uses Inter.
 */
export const getFontFamilyForToken = (
  _category: TypographyCategory,
  _variant: TypographyVariant
): string => fontFamilyTokens.ui;

/**
 * Complete CSS style for a typography token, including font family.
 */
export const getTypography = (
  category: TypographyCategory,
  variant: TypographyVariant
): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: string;
} => {
  const style = getTypographyStyle(category, variant);
  return {
    fontFamily: getFontFamilyForToken(category, variant),
    ...style,
  };
};
