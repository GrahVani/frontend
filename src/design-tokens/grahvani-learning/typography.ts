/**
 * Grahvani Learning — Type System
 * Mirrors §3 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 */

export const fontFamilies = {
  display: "var(--font-devanagari), serif", // Tiro Devanagari Hindi
  literarySerif: "var(--font-cormorant), 'Cormorant Garamond', 'Cormorant', serif",
  body: "var(--font-sans), 'Inter', system-ui, sans-serif",
} as const;

export const displaySizes = {
  xs: "32px",
  sm: "40px",
  md: "56px",
  lg: "72px",
} as const;

export const bodySizes = {
  caption: "14px",
  small: "16px",
  body: "18px",
  emphasis: "20px",
  subheading: "24px",
} as const;

export const lineHeights = {
  devanagari: 1.45,
  body: 1.65,
  display: 1.15,
  ui: 1.4,
} as const;

export const letterSpacing = {
  body: "-0.01em",
  ui: "0",
  smallCaps: "0.02em",
} as const;
