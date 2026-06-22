/**
 * Dashboard Template
 *
 * The standard architecture for dashboard-style pages.
 * Purpose: give the user immediate orientation + the most important signals,
 * then progressively disclose detailed data and actions.
 *
 * Sections (in order):
 * 1. Page Header
 * 2. Page Summary
 * 3. Hero Insight (optional)
 * 4. Insight Strip (optional)
 * 5. Metrics Area
 * 6. Content Area
 * 7. Data Area
 * 8. Action Area
 */

import type {
  PageHeaderSection,
  PageSummarySection,
  HeroInsightSection,
  InsightStripSection,
  MetricGridSection,
} from './shared-template';
import { layoutSpacing } from '@/design-system/foundations/spacing';

export interface DashboardTemplate {
  /** 1. Page title + context + primary actions. */
  header: PageHeaderSection;

  /** 2. Key context metadata (client, date, system, ayanamsa). */
  summary?: PageSummarySection;

  /** 3. Single most important insight. */
  heroInsight?: HeroInsightSection;

  /** 4. 3–6 supporting insights. */
  insightStrip?: InsightStripSection;

  /** 5. Quantified metrics or scores. */
  metrics?: MetricGridSection;

  /** 6. Main analytical content: charts, visualizations, cards. */
  content: {
    title?: string;
    children: React.ReactNode;
  };

  /** 7. Supporting data: tables, matrices, timelines. */
  data?: {
    title?: string;
    children: React.ReactNode;
  };

  /** 8. Primary page actions. */
  actions?: {
    children: React.ReactNode;
  };
}

export const dashboardTemplateClasses = {
  root: `space-y-${layoutSpacing.section.contentGap.value}`,
  headerArea: '',
  summaryArea: 'pt-2',
  heroArea: '',
  insightStripArea: '',
  metricsArea: '',
  contentArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  dataArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  actionArea: 'pt-2',
};

/**
 * When to use the Dashboard Template:
 * - Overview pages
 * - Home / landing pages for a module
 * - Pages where the user needs a high-level scan before drilling down
 */
