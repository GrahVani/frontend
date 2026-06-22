/**
 * Layout Spacing Tokens
 *
 * Semantic spacing rules for page, section, content, card, form, table,
 * modal, drawer, learning, and mobile layouts.
 *
 * Every value references `spacingScale` so the product stays on one rhythm.
 */

import { spacingScale, type SpacingScaleToken } from './spacing';

export type SpacingAlias = { value: SpacingScaleToken; px: number };

const alias = (token: SpacingScaleToken): SpacingAlias => ({
  value: token,
  px: Math.round(parseFloat(spacingScale[token]) * 16),
});

export const layoutSpacing = {
  /**
   * Page-level spacing
   * The outer frame of every screen.
   */
  page: {
    /** Horizontal page padding. */
    paddingX: alias(6),
    /** Top page padding below the global header. */
    paddingY: alias(6),
    /** Gap between major regions on a page. */
    gap: alias(8),
  },

  /**
   * Section-level spacing
   * Major content blocks inside a page.
   */
  section: {
    /** Gap between adjacent sections. */
    gap: alias(12),
    /** Gap between items inside a section. */
    contentGap: alias(6),
  },

  /**
   * Generic content group spacing
   * Used for clusters of related elements (text + button, label + value, etc.).
   */
  content: {
    gap: alias(6),
    tightGap: alias(4),
    microGap: alias(2),
  },

  /**
   * Card spacing
   * Cards are content containers. Only spacing is defined here; card visual
   * design (radius, shadow, color) is outside this file's scope.
   */
  card: {
    /** Default internal card padding. */
    padding: alias(5),
    /** Gap between cards in a grid or list. */
    gap: alias(4),
    /** Space below a card header. */
    headerPaddingBottom: alias(4),
    /** Gap between elements in a card body. */
    bodyGap: alias(4),
    /** Space above a card footer. */
    footerPaddingTop: alias(4),
    /** Padding for a card nested inside another card. */
    nestedPadding: alias(4),
  },

  /**
   * Form spacing
   */
  form: {
    /** Gap between form fields. */
    fieldGap: alias(4),
    /** Gap between a label and its input. */
    labelGap: alias(1),
    /** Gap between form sections. */
    sectionGap: alias(8),
    /** Gap between an input and its validation message. */
    validationGap: alias(1),
    /** Gap between columns in a multi-column form. */
    multiColumnGap: alias(4),
    /** Internal padding of a field group. */
    groupPadding: alias(4),
  },

  /**
   * Table spacing
   */
  table: {
    /** Default table cell horizontal padding. */
    cellPaddingX: alias(3),
    /** Default table cell vertical padding. */
    cellPaddingY: alias(2),
    /** Table header vertical padding. */
    headerPaddingY: alias(3),
    /** Gap between table rows — rows are stacked, so this is 0. */
    rowGap: alias(0),
    /** Gap between a table and its caption/legend. */
    captionGap: alias(4),

    /** Dense mode for data-heavy astrology tables. */
    dense: {
      cellPaddingX: alias(2),
      cellPaddingY: alias(1),
    },

    /** Comfortable mode for readable scan tables. */
    comfortable: {
      cellPaddingX: alias(4),
      cellPaddingY: alias(3),
    },
  },

  /**
   * Modal spacing
   */
  modal: {
    padding: alias(6),
    sectionGap: alias(6),
    headerPaddingBottom: alias(4),
    footerPaddingTop: alias(4),
  },

  /**
   * Drawer spacing
   */
  drawer: {
    padding: alias(5),
    sectionGap: alias(6),
    headerPaddingBottom: alias(4),
  },

  /**
   * Learning module spacing
   */
  learning: {
    /** Gap between major learning content blocks. */
    contentGap: alias(6),
    /** Gap between steps, items, or cards in a learning flow. */
    stepGap: alias(4),
    /** Gap between a learning instruction and its interactive area. */
    instructionGap: alias(4),
  },

  /**
   * Mobile spacing overrides
   */
  mobile: {
    page: {
      paddingX: alias(4),
      paddingY: alias(4),
    },
    card: {
      padding: alias(4),
      gap: alias(3),
    },
    section: {
      gap: alias(8),
      contentGap: alias(4),
    },
    /** Minimum comfortable gap between touch targets. */
    touchGap: alias(2),
  },
} as const;

export type LayoutSpacing = typeof layoutSpacing;
