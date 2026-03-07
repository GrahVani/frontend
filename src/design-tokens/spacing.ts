/**
 * Spacing design tokens as TypeScript constants.
 * These mirror the CSS custom properties in globals.css.
 *
 * Usage in Tailwind: Use the CSS variables directly via var(--spacing-*)
 * Usage in JS/inline styles: import { SPACING } from '@/design-tokens/spacing'
 */
export const SPACING = {
    /** 24px — between major sections */
    section: 'var(--spacing-section)',
    /** 16px — card internal padding */
    card: 'var(--spacing-card)',
    /** 12px — gap between cards in a grid */
    cardGap: 'var(--spacing-card-gap)',
    /** 8px — between inline elements */
    inline: 'var(--spacing-inline)',
    /** 4px — tight spacing (labels, badges) */
    tight: 'var(--spacing-tight)',
} as const;

export const CONTAINER = {
    sm: 'var(--container-sm)',
    md: 'var(--container-md)',
    lg: 'var(--container-lg)',
    xl: 'var(--container-xl)',
    '2xl': 'var(--container-2xl)',
} as const;

export const SIDEBAR = {
    width: 'var(--sidebar-width)',
    collapsed: 'var(--sidebar-collapsed)',
} as const;
