/**
 * Grahvani Card System
 *
 * A unified card language built entirely on the Grahvani foundations:
 * - Background & Surface: surface.primary
 * - Border: border.primary
 * - Text: text.primary / text.secondary / text.muted
 * - Typography: Inter, title.md/sm, body.md, meta.md
 * - Spacing: card.padding (20px), card.gap (16px)
 * - Radius: card (12px) / widget (8px)
 * - Elevation: card (sm) / cardHover (md)
 *
 * Six card variants cover every use case in the platform:
 * base, widget, insight, hero, data, interactive.
 */

export type CardVariant = 'base' | 'widget' | 'insight' | 'hero' | 'data' | 'interactive';

/**
 * Semantic usage rules for each card variant.
 */
export const cardUsageRules: Record<CardVariant, string> = {
  base:
    'Default content container. Use for generic grouped content: settings panels, info blocks, simple summaries.',
  widget:
    'Dashboard widget. Use for data-dense dashboard surfaces: KP widgets, Shadbala scores, Ashtakavarga grids, metric cards.',
  insight:
    'Interpretation and analysis card. Use for astrological insights, report summaries, reading conclusions, explanatory content.',
  hero:
    'Featured or primary-action card. Use for empty states, CTAs, premium highlights, welcome cards.',
  data:
    'Data table or chart container. Use when a table, chart, or dense data matrix lives inside a card.',
  interactive:
    'Clickable/selectable card. Use for selectable items, clickable options, card-based navigation, flip cards.',
};

/**
 * Tailwind class compositions for each card variant.
 *
 * These assume the following design tokens are registered in Tailwind v4:
 * --color-surface-primary, --color-border-primary,
 * --radius-card (12px), --radius-widget (8px),
 * --spacing-card-padding (20px),
 * --shadow-card, --shadow-card-hover.
 */
export const cardVariantClasses: Record<CardVariant, string> = {
  base: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-card',
    'p-card-padding',
    'shadow-card',
  ].join(' '),

  widget: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-widget',
    'p-card-padding',
    'shadow-widget',
  ].join(' '),

  insight: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-card',
    'p-card-padding',
    'shadow-card',
  ].join(' '),

  hero: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-card',
    'p-card-padding',
    'shadow-card-hover',
  ].join(' '),

  data: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-card',
    'p-card-padding',
    'shadow-card',
  ].join(' '),

  interactive: [
    'bg-surface-primary',
    'border border-border-primary',
    'rounded-card',
    'p-card-padding',
    'shadow-card',
    'transition-shadow',
    'hover:shadow-card-hover',
    'cursor-pointer',
  ].join(' '),
};

/**
 * Internal spacing inside a card body.
 */
export const cardBodyClasses = 'flex flex-col gap-card-body';

/**
 * Card header layout.
 */
export const cardHeaderClasses = 'flex items-start justify-between gap-4 pb-card-header';

/**
 * Card footer layout.
 */
export const cardFooterClasses = 'flex items-center justify-between gap-4 pt-card-footer';

/**
 * Card title typography.
 */
export const cardTitleClasses = 'font-ui text-title-md font-medium text-primary';

/**
 * Card subtitle typography.
 */
export const cardSubtitleClasses = 'font-ui text-meta-md text-muted';

/**
 * Recommended migration mapping from legacy card classes to new variants.
 */
export const cardMigrationMap: Record<string, CardVariant | null> = {
  '.card': 'base',
  '.prem-card': 'base',
  '.prem-card-active': 'interactive',
  '.dash-card': 'widget',
  '.dash-hero': 'hero',
  '.learn-card': 'base',
  '.learn-card-interactive': 'interactive',
  '.gl-surface-twilight-glass': 'insight',
  '.gl-surface-manuscript': 'insight',
  '.gl-surface-dawn': 'hero',
  '.luxury-card-bg': 'hero',
  'bg-white rounded-2xl border border-amber-200/60 shadow-sm': 'base',
  'bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5': 'base',
  'bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6': 'hero',
};
