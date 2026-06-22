/**
 * Line Height Scale
 *
 * Tight line heights for large type, generous line heights for reading.
 * Display and heading tokens are tight to keep their visual impact.
 * Body tokens are relaxed for long-form reading by professional astrologers.
 */

export const lineHeightScale = {
  /** 1.1 — Hero and large display text. */
  display: '1.1',
  /** 1.15 — Medium display that needs slightly more breathing room. */
  displayLoose: '1.15',
  /** 1.2 — Page and section headings. */
  heading: '1.2',
  /** 1.25 — Small headings. */
  headingLoose: '1.25',
  /** 1.3 — Titles, card headings, field labels. */
  title: '1.3',
  /** 1.35 — Small titles and data-dense labels. */
  titleLoose: '1.35',
  /** 1.5 — Body text. Optimized for readability. */
  body: '1.5',
  /** 1.4 — Metadata and captions. */
  meta: '1.4',
  /** 1.35 — Data-dense metadata (table cells, chart labels). */
  metaTight: '1.35',
} as const;

export type LineHeightToken = keyof typeof lineHeightScale;
export type LineHeightValue = (typeof lineHeightScale)[LineHeightToken];
