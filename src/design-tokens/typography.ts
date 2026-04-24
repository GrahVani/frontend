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
    sectionTitle: "font-sans text-md font-semibold text-primary leading-tight tracking-wide text-balance",
    pageTitle: "font-sans text-[20px] font-bold text-primary leading-tight text-balance",

    // ===== Data Tables =====
    tableHeader: "font-sans text-[14px] font-medium text-primary capitalize tracking-wider leading-normal text-balance",
    planetName: "font-sans text-[16px] font-medium text-primary leading-tight",
    dateAndDuration: "font-sans text-[14px] font-medium text-primary whitespace-nowrap leading-compact tracking-tight",

    // ===== Navigation =====
    breadcrumb: "font-sans text-[14px] font-semibold whitespace-nowrap",

    // ===== Panchanga & Profile Details =====
    label: "font-sans text-[12px] text-primary font-semibold tracking-wider mb-0.5",
    value: "font-sans text-[14px] font-bold text-primary leading-tight",
    subValue: "font-sans text-2xs text-primary leading-none mt-1 font-medium",

    // ===== Profile Identity =====
    profileName: "font-sans text-[18px] font-semibold text-primary leading-tight",
    profileDetail: "font-sans text-[14px] font-medium text-primary leading-compact",
    badgeLabel: "font-sans text-[14px] font-normal text-primary",
    badgeValue: "font-sans text-[14px] font-bold text-primary",

    // ===== Data-Dense UI (badges, micro labels, status pills) =====
    microLabel: "font-sans text-3xs font-bold uppercase tracking-widest",
    microValue: "font-sans text-3xs font-medium leading-tight",
    decorativeLabel: "font-serif text-4xs font-semibold uppercase tracking-widest",
    statusBadge: "font-sans text-3xs font-black uppercase tracking-wider",

    // ===== Chart Specific (SVG attributes) =====
    svgSignNumber: {
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSize: "18",
        fontWeight: "700",
        fill: "var(--text-primary)"
    },
    svgPlanetName: {
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSize: "14",
        fontWeight: "700"
    },
    svgDegree: {
        fontSize: "10",
        fontWeight: "500",
        fill: "var(--text-primary)"
    }
} as const;
