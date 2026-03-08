/**
 * Centralized typography design tokens for the Grahvani application.
 * These tokens ensure a consistent, modern, and professional look.
 *
 * Scale reference (CSS var → px):
 *   4xs = 9px | 3xs = 10px | 2xs = 11px | xs = 12px | sm = 13px
 *   base = 14px | md = 15px | lg = 18px | xl = 20px
 */
export const TYPOGRAPHY = {
    // ===== Core Layout =====
    sectionTitle: "font-sans text-md font-semibold text-primary leading-tight tracking-wide",
    pageTitle: "font-sans text-xl font-bold text-primary leading-tight",

    // ===== Data Tables =====
    tableHeader: "font-sans text-sm font-medium text-primary capitalize tracking-wider leading-normal",
    planetName: "font-sans text-base font-medium text-primary leading-tight",
    dateAndDuration: "font-sans text-sm font-medium text-primary whitespace-nowrap leading-compact tracking-tight",

    // ===== Navigation =====
    breadcrumb: "font-sans text-sm font-semibold whitespace-nowrap",

    // ===== Panchanga & Profile Details =====
    label: "font-sans text-xs text-primary font-semibold tracking-wider mb-0.5",
    value: "font-sans text-sm font-bold text-primary leading-tight",
    subValue: "font-sans text-2xs text-primary leading-none mt-1 font-medium whitespace-nowrap",

    // ===== Profile Identity =====
    profileName: "font-sans text-lg font-semibold text-primary leading-tight",
    profileDetail: "font-sans text-sm font-medium text-primary leading-compact",
    badgeLabel: "font-sans text-sm font-normal text-primary",
    badgeValue: "font-sans text-sm font-bold text-primary",

    // ===== Data-Dense UI (badges, micro labels, status pills) =====
    microLabel: "font-sans text-3xs font-bold uppercase tracking-widest",
    microValue: "font-sans text-3xs font-medium leading-tight",
    decorativeLabel: "font-serif text-4xs font-semibold uppercase tracking-widest",
    statusBadge: "font-sans text-3xs font-black uppercase tracking-wider",

    // ===== Chart Specific (SVG attributes) =====
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
