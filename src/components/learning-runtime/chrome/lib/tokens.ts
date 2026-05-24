/**
 * Lesson-page design tokens — the single source of truth for typography,
 * spacing, motion, radius, and shadows across every chrome component.
 *
 * Migration rule: NO RAW NUMERIC LITERALS in chrome/*.tsx for font-size,
 * line-height, letter-spacing, transition-duration, or border-radius.
 * Reference these tokens by name.
 *
 * The values were chosen to:
 *   - Collapse 13 prior font-sizes into a 6-rung modular scale
 *   - Collapse 10 prior line-heights into 3 (tight / normal / loose)
 *   - Collapse 10 prior letter-spacings into 5
 *   - Collapse 9 prior transition durations into 3 (fast / default / slow)
 *   - Anchor every spacing value to the 4px grid
 */

/** Font sizes — modular scale. All values px. */
export const T = {
  /** Eyebrows, micro labels, badge text. */
  micro: 11,
  /** Captions, metadata, in-card meta. */
  caption: 13,
  /** Primary body text. */
  body: 16,
  /** Section titles, subheaders. */
  title: 20,
  /** Lesson H2 display. */
  display: 28,
  /** §1 cold-open H1. */
  hero: 40,
} as const;

/** Line heights — three rungs per HIG. */
export const LH = {
  /** Display titles, large headers. */
  tight: 1.2,
  /** Body text, paragraphs (HIG-recommended range 1.45–1.55). */
  normal: 1.5,
  /** Long-form prose, callout blocks. */
  loose: 1.65,
} as const;

/** Letter spacings — five rungs. Unit: em. */
export const LS = {
  none: "0",
  /** Subtle tracking for labels. */
  label: "0.05em",
  /** Standard eyebrow / uppercase mini-label. */
  eyebrow: "0.10em",
  /** Wider eyebrow for prominent section markers. */
  eyebrowWide: "0.18em",
  /** Extreme tracking for hero pills. */
  ultra: "0.24em",
} as const;

/** Motion — durations (ms) + single shared easing. */
export const M = {
  /** Micro-interactions (button presses, chip flips). */
  fast: 150,
  /** Default transitions (hover lifts, page reveals). */
  default: 250,
  /** Larger reveals (modal entries, big composition changes). */
  slow: 400,
  /** Single canonical easing curve. */
  easing: "cubic-bezier(0.32, 0.72, 0.24, 1)",
} as const;

/** Border radius scale. Unit: px (except full = 50%, pill = 999px). */
export const R = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
  /** For circles only. */
  full: "50%",
} as const;

/** Spacing scale — strict 4px-grid. */
export const S = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  hero: 64,
  ultra: 96,
} as const;

/** Composite focus-ring style — for `:focus-visible` accessibility on
 *  text inputs and interactive non-button elements. WCAG 2.4.7. */
export const FOCUS_RING = {
  outline: "2px solid var(--gl-gold-accent, #C9A24D)",
  outlineOffset: "2px",
} as const;

/** Lesson section anchor offset — must match brand-header (56) + chrome
 *  bar (~46) + breathing gap (18) so anchor-jumps land cleanly. */
export const LESSON_SECTION_SCROLL_MARGIN = "120px";
