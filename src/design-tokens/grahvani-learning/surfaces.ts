/**
 * Grahvani Learning — Material System
 * Mirrors §5 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 *
 * Four named surfaces. No others. CSS implementations live in globals.css
 * under the `.gl-surface-*` class names; this module re-exports them as
 * stable string constants for components that want to compose classes.
 */

import { surfaces, goldOnGlassHairline } from "./colors";

export const surfaceClasses = {
  night: "gl-surface-night",
  twilightGlass: "gl-surface-twilight-glass",
  manuscriptCream: "gl-surface-manuscript",
  dawnAccent: "gl-surface-dawn",
} as const;

/**
 * Inline style equivalents — for cases where a component must compute the
 * surface programmatically (e.g., a celebration overlay that animates the
 * dawn-accent intensity). Production rendering should prefer the class names
 * above; these inline styles are escape hatches.
 */
export const surfaceStyles = {
  night: {
    background: `radial-gradient(ellipse at top, ${surfaces.nightDeepGradientTop} 0%, ${surfaces.nightDeep} 70%, ${surfaces.nightDeepGradientBottom} 100%)`,
    minHeight: "100vh",
    position: "relative" as const,
  },
  twilightGlass: {
    background: surfaces.twilightGlass,
    backdropFilter: "blur(24px) saturate(140%)",
    WebkitBackdropFilter: "blur(24px) saturate(140%)",
    border: `1px solid ${goldOnGlassHairline}`,
    borderRadius: "16px",
  },
  manuscriptCream: {
    background: surfaces.manuscriptCream,
    borderRadius: "8px",
    padding: "32px 40px",
    position: "relative" as const,
  },
  dawnAccent: {
    background: `linear-gradient(135deg, ${surfaces.dawnAccentFrom} 0%, ${surfaces.dawnAccentTo} 100%)`,
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(232, 168, 92, 0.18)",
  },
} as const;
