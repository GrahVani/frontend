/**
 * Analysis Template
 *
 * Reusable layout for deep analytical pages.
 * Purpose: lead with insights, then analysis, then tables, then raw data.
 *
 * Use for:
 * - KP Analysis
 * - Shadbala
 * - Ashtakavarga
 * - Planetary Analysis
 * - Transit Analysis
 * - Yoga / Dosha Analysis
 *
 * Structure:
 * 1. Page Header
 * 2. Insight Strip (3–6 high-value insights)
 * 3. Hero Insight (optional single dominant signal)
 * 4. Analysis Area (charts, visualizations, interpretation cards)
 * 5. Table Area (data tables, matrices)
 * 6. Raw Data Area (expandable raw calculations)
 */

import type {
  PageHeaderSection,
  PageSummarySection,
  HeroInsightSection,
  InsightStripSection,
} from './shared-template';
import { layoutSpacing } from '@/design-system/foundations/spacing';

export interface AnalysisTemplate {
  /** 1. Page title + context. */
  header: PageHeaderSection;

  /** 2. Context metadata (system, chart, ayanamsa). */
  summary?: PageSummarySection;

  /** 3. 3–6 high-value insights. Always present on analysis pages. */
  insightStrip: InsightStripSection;

  /** 4. Optional single dominant insight. */
  heroInsight?: HeroInsightSection;

  /** 5. Main analytical content: charts, interpretation cards, visualizations. */
  analysis: {
    title?: string;
    children: React.ReactNode;
  };

  /** 6. Supporting data tables or matrices. */
  tables?: {
    title?: string;
    children: React.ReactNode;
  };

  /** 7. Expandable raw calculations or source data. */
  rawData?: {
    title?: string;
    children: React.ReactNode;
  };
}

export const analysisTemplateClasses = {
  root: `space-y-${layoutSpacing.section.contentGap.value}`,
  headerArea: '',
  summaryArea: 'pt-2',
  insightStripArea: '',
  heroArea: '',
  analysisArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  tablesArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  rawDataArea: `space-y-${layoutSpacing.content.tightGap.value}`,
};

/**
 * Reasoning for "Insights First, Analysis Second, Tables Third, Raw Data Last":
 *
 * 1. Insights First — tell the astrologer what matters before showing how it was computed.
 * 2. Analysis Second — provide the interpretation and visual evidence.
 * 3. Tables Third — offer detailed data for verification and drilling.
 * 4. Raw Data Last — keep low-level calculations out of the way unless explicitly needed.
 */
