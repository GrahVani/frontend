/**
 * Shared Template Patterns
 *
 * Reusable page-level building blocks used across multiple templates.
 * These are not components; they are architectural patterns expressed as
 * Tailwind class compositions and TypeScript contracts.
 */

import { layoutSpacing } from '@/design-system/foundations/spacing';

// ---------------------------------------------------------------------------
// Hero Insight
// ---------------------------------------------------------------------------

/**
 * A Hero Insight is the single most important takeaway on a page.
 * It appears at the top of the content area, immediately after the page header.
 *
 * Use when:
 * - The page has a clear primary insight (e.g., Current Dasha, Strongest Planet).
 * - The user needs orientation before exploring detailed data.
 *
 * Do NOT use when:
 * - The page is a list or directory with no single insight.
 * - The page is a form or settings page.
 * - The insight would duplicate the page title without adding value.
 */
export interface HeroInsightSection {
  label: string;
  value: string;
  supportingText?: string;
  metadata?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export const heroInsightClasses = {
  container:
    'bg-surface-primary border border-border-primary rounded-card p-card-padding shadow-card-hover',
  label: 'text-meta-md text-muted uppercase tracking-wide',
  value: 'text-display-sm font-ui text-primary mt-1',
  supportingText: 'text-body-md text-secondary mt-2 max-w-3xl',
  metadata: 'text-meta-md text-muted mt-3',
  actionArea: 'mt-5',
};

// ---------------------------------------------------------------------------
// Insight Strip
// ---------------------------------------------------------------------------

/**
 * An Insight Strip presents 3–6 high-value insights in a horizontal row.
 * Each insight is a small card with a label, value, and optional metadata.
 *
 * Layout:
 * - 1 column on mobile
 * - 2 columns on tablet
 * - 3–6 columns on desktop depending on count
 */
export interface InsightItem {
  label: string;
  value: string;
  metadata?: string;
  status?: 'neutral' | 'positive' | 'negative' | 'warning';
}

export interface InsightStripSection {
  insights: InsightItem[];
}

export const insightStripClasses = {
  container: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-${layoutSpacing.card.gap.value}`,
  item: 'bg-surface-primary border border-border-primary rounded-card p-4',
  label: 'text-meta-md text-muted',
  value: 'text-title-md font-ui text-primary mt-1',
  metadata: 'text-meta-md text-muted mt-1',
};

// ---------------------------------------------------------------------------
// Metric Grid
// ---------------------------------------------------------------------------

/**
 * A Metric Grid displays 2–12 metric cards in a responsive grid.
 *
 * Column rules:
 * - 2 metrics → 2 columns
 * - 3 metrics → 3 columns
 * - 4 metrics → 4 columns (or 2×2 on mobile)
 * - 6 metrics → 3 columns (or 2×3)
 * - 8+ metrics → 4 columns
 */
export interface MetricItem {
  label: string;
  value: string | number;
  change?: string;
  metadata?: string;
}

export interface MetricGridSection {
  metrics: MetricItem[];
  columns?: 2 | 3 | 4 | 6;
}

export const metricGridClasses: Record<NonNullable<MetricGridSection['columns']>, string> = {
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-card-gap',
  3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-card-gap',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap',
  6: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-card-gap',
};

export const metricCardClasses = {
  container: 'bg-surface-primary border border-border-primary rounded-card p-4',
  label: 'text-meta-md text-muted',
  value: 'text-title-lg font-ui text-primary mt-1',
  change: 'text-meta-md mt-1',
  metadata: 'text-meta-md text-muted mt-1',
};

// ---------------------------------------------------------------------------
// Page Header
// ---------------------------------------------------------------------------

export interface PageHeaderSection {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const pageHeaderClasses = {
  container: 'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4',
  titleBlock: 'flex flex-col gap-1',
  title: 'text-heading-lg font-ui text-primary',
  subtitle: 'text-body-md text-secondary',
  actions: 'flex items-center gap-3 shrink-0',
};

// ---------------------------------------------------------------------------
// Page Summary
// ---------------------------------------------------------------------------

export interface PageSummarySection {
  items: { label: string; value: string }[];
}

export const pageSummaryClasses = {
  container: 'flex flex-wrap items-center gap-x-6 gap-y-2',
  item: 'flex items-center gap-2',
  label: 'text-meta-md text-muted',
  value: 'text-body-md text-primary',
};
