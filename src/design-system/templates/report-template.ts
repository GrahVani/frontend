/**
 * Report Template
 *
 * Reusable layout for generated astrological reports.
 * Purpose: present a professional, readable document that can be scanned or read in depth.
 *
 * Structure:
 * 1. Summary
 * 2. Insights
 * 3. Detailed Analysis
 * 4. Supporting Tables
 * 5. Appendix
 */

import { layoutSpacing } from '@/design-system/foundations/spacing';

export interface ReportSection {
  title: string;
  children: React.ReactNode;
}

export interface ReportTemplate {
  /** 1. One-paragraph executive summary. */
  summary: {
    title?: string;
    children: React.ReactNode;
  };

  /** 2. 3–6 bullet insights. */
  insights: {
    title?: string;
    items: { label: string; description: string }[];
  };

  /** 3. Ordered detailed analysis sections. */
  analysis: ReportSection[];

  /** 4. Tables and data supporting the analysis. */
  supportingTables?: {
    title?: string;
    children: React.ReactNode;
  };

  /** 5. Optional raw calculations, references, or glossary. */
  appendix?: {
    title?: string;
    children: React.ReactNode;
  };
}

export const reportTemplateClasses = {
  root: `space-y-${layoutSpacing.section.contentGap.value}`,
  summaryArea: 'bg-surface-primary border border-border-primary rounded-card p-card-padding',
  insightsArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  analysisArea: `space-y-${layoutSpacing.section.contentGap.value}`,
  sectionTitle: 'text-heading-md font-ui text-primary mb-4',
  supportingTablesArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  appendixArea: `space-y-${layoutSpacing.content.tightGap.value}`,
};

/**
 * Reports are read by both astrologers and clients.
 * The Report Template ensures they are scannable (summary + insights)
 * and deep (detailed analysis + supporting data).
 */
