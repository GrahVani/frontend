/**
 * Dashboard Spacing Tokens
 *
 * Data-dense but readable spacing rules for astrology dashboards.
 *
 * These tokens extend `layoutSpacing` with dashboard-specific aliases so
 * every dashboard (Overview, KP, Shadbala, Ashtakavarga, Dasha, Reports,
 * Client) shares the same rhythm.
 */

import { spacingScale, type SpacingScaleToken } from './spacing';

const alias = (token: SpacingScaleToken) => ({
  value: token,
  px: Math.round(parseFloat(spacingScale[token]) * 16),
});

export const dashboardSpacing = {
  /** Shared dashboard constants. */
  shared: {
    sectionGap: alias(6),
    widgetGap: alias(4),
    metricGap: alias(2),
    cardPadding: alias(5),
  },

  overview: {
    sectionGap: alias(6),
    widgetGap: alias(4),
    metricGap: alias(2),
    heroPadding: alias(6),
  },

  kp: {
    sectionGap: alias(6),
    widgetGap: alias(3),
    metricGap: alias(2),
    tableCellPaddingX: alias(2),
    tableCellPaddingY: alias(1),
    cuspCardGap: alias(3),
  },

  shadbala: {
    sectionGap: alias(6),
    scoreGap: alias(2),
    metricGap: alias(3),
    strengthRowGap: alias(2),
  },

  ashtakavarga: {
    sectionGap: alias(6),
    gridCellPaddingX: alias(2),
    gridCellPaddingY: alias(2),
    gridGap: alias(1),
    chartGap: alias(4),
  },

  dasha: {
    sectionGap: alias(6),
    timelineItemGap: alias(3),
    periodGap: alias(2),
    treeRowGap: alias(2),
  },

  reports: {
    pageGap: alias(8),
    contentGap: alias(6),
    sectionGap: alias(8),
    cardPadding: alias(5),
  },

  client: {
    pageGap: alias(8),
    cardPadding: alias(5),
    sectionGap: alias(8),
    fieldGap: alias(4),
    profileHeaderGap: alias(4),
  },
} as const;

export type DashboardSpacing = typeof dashboardSpacing;
