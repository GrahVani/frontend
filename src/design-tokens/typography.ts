/**
 * Centralized typography design tokens for the Grahvani application.
 * These tokens ensure a consistent, modern, and professional look (Senior UI/UX).
 */
export const TYPOGRAPHY = {
    // Core Layout
    sectionTitle: "font-sans text-md font-semibold text-primary leading-tight tracking-wide",

    // Data Tables (e.g., Vimshottari Dasha, Planetary Table)
    tableHeader: "font-sans text-sm font-medium text-primary capitalize tracking-wider leading-normal",
    planetName: "font-sans text-base font-medium text-primary leading-tight",
    dateAndDuration: "font-sans text-sm font-medium text-primary whitespace-nowrap leading-compact tracking-tight",

    // Navigation
    breadcrumb: "font-sans text-xs font-medium text-primary whitespace-nowrap",

    // Panchanga & Profile Details
    label: "font-sans text-xs text-primary font-semibold tracking-wider uppercase mb-0.5",
    value: "font-sans text-sm font-bold text-primary leading-tight",
    subValue: "font-sans text-[11px] text-primary leading-none mt-1 font-medium whitespace-nowrap",

    // Profile Identity
    profileName: "font-sans text-lg font-semibold text-primary leading-tight",
    profileDetail: "font-sans text-sm font-medium text-primary leading-compact",
    badgeLabel: "font-sans text-sm font-normal text-primary",
    badgeValue: "font-sans text-sm font-bold text-primary",

    // Chart Specific
    svgSignNumber: {
        fontFamily: "'Inter', 'Source Sans 3', sans-serif",
        fontSize: "18",
        fontWeight: "500",
        fill: "var(--text-primary)"
    },
    svgPlanetName: {
        fontFamily: "'Inter', 'Source Sans 3', sans-serif",
        fontSize: "14",
        fontWeight: "600"
    },
    svgDegree: {
        fontSize: "10",
        fontWeight: "500",
        fill: "var(--text-primary)"
    }
} as const;
