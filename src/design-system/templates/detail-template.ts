/**
 * Detail Template
 *
 * Reusable layout for entity-detail pages.
 * Purpose: present a single record (client, report, match, chart) with summary,
 * details, related data, and actions.
 *
 * Use for:
 * - Client Detail
 * - Report Detail
 * - Match Detail
 * - Chart Detail
 * - Session Detail
 *
 * Structure:
 * 1. Page Header
 * 2. Summary Card
 * 3. Detail Sections
 * 4. Related Data
 * 5. Actions
 */

import type { PageHeaderSection } from './shared-template';
import { layoutSpacing } from '@/design-system/foundations/spacing';

export interface DetailSection {
  title: string;
  children: React.ReactNode;
}

export interface DetailTemplate {
  /** 1. Page title + entity name + actions. */
  header: PageHeaderSection;

  /** 2. Summary card with the most important entity metadata. */
  summary: {
    title?: string;
    children: React.ReactNode;
  };

  /** 3. Ordered detail sections. */
  sections: DetailSection[];

  /** 4. Related records, history, or secondary data. */
  relatedData?: {
    title?: string;
    children: React.ReactNode;
  };

  /** 5. Primary and secondary actions. */
  actions?: {
    children: React.ReactNode;
  };
}

export const detailTemplateClasses = {
  root: `space-y-${layoutSpacing.section.contentGap.value}`,
  headerArea: '',
  summaryArea: '',
  sectionsArea: `space-y-${layoutSpacing.section.contentGap.value}`,
  sectionTitle: 'text-heading-md font-ui text-primary mb-4',
  relatedDataArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  actionArea: 'pt-2',
};

/**
 * Detail pages should avoid long vertical stacks without section anchors.
 * Use the Detail Template to keep related information grouped and scannable.
 */
