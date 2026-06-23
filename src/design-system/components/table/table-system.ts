/**
 * Grahvani Table System
 *
 * A unified table language for the entire platform. Built entirely on the
 * approved Grahvani foundations.
 *
 * Variants:
 * - default: standard readable tables
 * - compact: data-dense astrology tables (KP, Shadbala, Ashtakavarga)
 * - comfortable: scan tables (client lists, reports)
 * - matrix: grid-like equal cells (Ashtakavarga grids)
 */

export type TableVariant = 'default' | 'compact' | 'comfortable' | 'matrix';

/**
 * Semantic usage rules for each table variant.
 */
export const tableUsageRules: Record<TableVariant, string> = {
  default:
    'Standard readable tables. Use for planetary positions, transit tables, matchmaking, muhurta, numerology.',
  compact:
    'Data-dense tables. Use for KP analysis, Shadbala, Dasha timelines when screen space is limited.',
  comfortable:
    'Scan tables with generous whitespace. Use for client lists, report tables, settings tables.',
  matrix:
    'Grid-like tables with equal cells. Use for Ashtakavarga grids and other matrix-style astrology data.',
};

/**
 * Cell padding per variant.
 *
 * Maps to the spacing foundation:
 * - 3 = 12px
 * - 2 = 8px
 * - 1 = 4px
 * - 4 = 16px
 */
export const tableCellPadding: Record<TableVariant, { x: number; y: number }> = {
  default: { x: 3, y: 2 },      // 12px / 8px
  compact: { x: 2, y: 1 },      // 8px / 4px
  comfortable: { x: 4, y: 3 },  // 16px / 12px
  matrix: { x: 2, y: 2 },       // 8px / 8px
};

/**
 * Typography rules per variant.
 */
export const tableTypography: Record<TableVariant, { header: string; cell: string; numeric: string; metadata: string }> = {
  default: {
    header: 'text-title-sm font-medium text-primary',
    cell: 'text-body-md text-primary',
    numeric: 'text-body-md text-primary tabular-nums',
    metadata: 'text-meta-md text-muted',
  },
  compact: {
    header: 'text-title-sm font-medium text-primary',
    cell: 'text-body-sm text-primary',
    numeric: 'text-body-sm text-primary tabular-nums',
    metadata: 'text-meta-md text-muted',
  },
  comfortable: {
    header: 'text-title-md font-medium text-primary',
    cell: 'text-body-md text-primary',
    numeric: 'text-body-md text-primary tabular-nums',
    metadata: 'text-meta-md text-muted',
  },
  matrix: {
    header: 'text-title-sm font-medium text-primary text-center',
    cell: 'text-body-sm text-primary text-center',
    numeric: 'text-body-sm text-primary tabular-nums text-center',
    metadata: 'text-meta-md text-muted text-center',
  },
};

/**
 * Row height proxy classes per variant.
 * Tailwind classes enforce consistent minimum heights.
 */
export const tableRowHeight: Record<TableVariant, string> = {
  default: 'min-h-[40px]',
  compact: 'min-h-[32px]',
  comfortable: 'min-h-[52px]',
  matrix: 'min-h-[36px]',
};

/**
 * Header styling per variant.
 */
export const tableHeaderClasses =
  'bg-surface-secondary border-b border-border-primary';

/**
 * Row divider styling.
 */
export const tableDividerClasses = 'border-b border-border-secondary last:border-b-0';

/**
 * Hover state.
 */
export const tableHoverClasses =
  'transition-colors hover:bg-bg-elevated';

/**
 * Selected / active row state.
 */
export const tableSelectedClasses =
  'bg-bg-elevated border-l-2 border-l-gold-primary';

/**
 * Empty state cell styling.
 */
export const tableEmptyStateClasses = 'py-12 text-center';

/**
 * Loading skeleton row styling.
 */
export const tableSkeletonClasses =
  'animate-pulse bg-bg-subtle rounded';

/**
 * Recommended migration mapping from legacy patterns to new variants.
 */
export const tableMigrationMap: Record<string, TableVariant> = {
  DataGrid: 'default',
  'compact DataGrid': 'compact',
  PlanetaryTable: 'default',
  KpPlanetaryTable: 'compact',
  BhavaDetailsTable: 'compact',
  HouseSignificatorsTable: 'compact',
  NaisargikMaitriTable: 'default',
  PanchadhaMaitriTable: 'default',
  PlanetComparisonTable: 'default',
  TemporalRelationshipTable: 'default',
  ClientTableView: 'comfortable',
  ReportHistoryTable: 'comfortable',
  Ashtakavarga: 'matrix',
  Shadbala: 'compact',
  DashaTimelines: 'default',
};
