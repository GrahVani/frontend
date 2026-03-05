/**
 * Centralized color and background design tokens for the Grahvani application.
 * These tokens ensure consistent branding and visual elegance.
 */
export const COLORS = {
    // Premium Gradients
    premiumGradient: "bg-gradient-to-r from-header-border to-amber-700",
    premiumGradientHover: "hover:from-amber-600 hover:to-amber-800",

    // Workbench Specific
    wbActiveTab: "bg-gradient-to-r from-header-border to-amber-700 !text-white shadow-lg",
} as const;
