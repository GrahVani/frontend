import type { CSSProperties } from "react";

/**
 * Generic two-column workbench layout.
 * Use for text-heavy or evenly-weighted panels (e.g. interpretation guards +
 * diagnostic statement). On narrow viewports it collapses to a single column.
 */
export const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

/**
 * Diagram-first layout: gives the diagram ~2/3 of the available width while the
 * sidebar (notes / controls) takes ~1/3. On narrow viewports the sidebar wraps
 * below the diagram.
 *
 * This fixes the recurring issue where a complex SVG was squeezed into a 50/50
 * grid and became unreadably small.
 */
export const workbenchDiagramLayoutStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "stretch",
};
