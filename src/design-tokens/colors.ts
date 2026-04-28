/**
 * Centralized color design tokens for the Grahvani application.
 * Single source of truth for all color constants used across components.
 *
 * Categories:
 *   1. PLANET_COLORS — Astrological planet color mappings (hex + Tailwind classes)
 *   2. CHART_THEMES — 5 customizable chart color palettes
 *   3. COLORS — Tailwind utility class tokens for UI patterns
 */

// =============================================================================
// PLANET COLORS — Consistent across Shadbala, KP, Dasha, Transits, etc.
// =============================================================================

export interface PlanetColorSet {
    /** Raw hex for SVG fills, chart.js, and inline styles */
    hex: string;
    /** Tailwind text class */
    text: string;
    /** Tailwind bg class */
    bg: string;
    /** Tailwind bg-soft class (lighter shade for cards/backgrounds) */
    bgSoft: string;
    /** Tailwind text class for dark-on-soft-bg usage */
    textOnSoft: string;
    /** Tailwind border class */
    border: string;
    /** Gradient direction for badge/pill backgrounds */
    gradient: string;
    /** Astronomical symbol */
    symbol: string;
    /** Vedic element */
    element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether' | 'Shadow';
}

export const PLANET_COLORS: Record<string, PlanetColorSet> = {
    Sun: {
        hex: '#F97316',
        text: 'text-orange-500',
        bg: 'bg-orange-500',
        bgSoft: 'bg-orange-50',
        textOnSoft: 'text-orange-700',
        border: 'border-orange-200',
        gradient: 'from-orange-400 to-amber-500',
        symbol: '☉',
        element: 'Fire',
    },
    Moon: {
        hex: '#6B5F52',
        text: 'text-slate-600',
        bg: 'bg-slate-500',
        bgSoft: 'bg-slate-200',
        textOnSoft: 'text-slate-700',
        border: 'border-slate-300',
        gradient: 'from-slate-400 to-slate-500',
        symbol: '☽',
        element: 'Water',
    },
    Mars: {
        hex: '#EF4444',
        text: 'text-red-500',
        bg: 'bg-red-500',
        bgSoft: 'bg-red-50',
        textOnSoft: 'text-red-700',
        border: 'border-red-200',
        gradient: 'from-red-500 to-rose-600',
        symbol: '♂',
        element: 'Fire',
    },
    Mercury: {
        hex: '#10B981',
        text: 'text-emerald-500',
        bg: 'bg-emerald-500',
        bgSoft: 'bg-emerald-50',
        textOnSoft: 'text-emerald-700',
        border: 'border-emerald-200',
        gradient: 'from-emerald-400 to-green-500',
        symbol: '☿',
        element: 'Earth',
    },
    Jupiter: {
        hex: '#EAB308',
        text: 'text-yellow-500',
        bg: 'bg-yellow-500',
        bgSoft: 'bg-yellow-50',
        textOnSoft: 'text-yellow-700',
        border: 'border-yellow-200',
        gradient: 'from-yellow-400 to-amber-500',
        symbol: '♃',
        element: 'Ether',
    },
    Venus: {
        hex: '#D946EF',
        text: 'text-fuchsia-500',
        bg: 'bg-fuchsia-500',
        bgSoft: 'bg-pink-50',
        textOnSoft: 'text-pink-700',
        border: 'border-pink-200',
        gradient: 'from-pink-400 to-rose-400',
        symbol: '♀',
        element: 'Water',
    },
    Saturn: {
        hex: '#3E2A1F',
        text: 'text-indigo-700',
        bg: 'bg-indigo-600',
        bgSoft: 'bg-indigo-100',
        textOnSoft: 'text-indigo-800',
        border: 'border-indigo-300',
        gradient: 'from-indigo-500 to-violet-600',
        symbol: '♄',
        element: 'Air',
    },
    Rahu: {
        hex: '#5C3D26',
        text: 'text-stone-700',
        bg: 'bg-stone-600',
        bgSoft: 'bg-stone-200',
        textOnSoft: 'text-stone-800',
        border: 'border-stone-300',
        gradient: 'from-stone-500 to-stone-600',
        symbol: '☊',
        element: 'Shadow',
    },
    Ketu: {
        hex: '#D97706',
        text: 'text-amber-600',
        bg: 'bg-amber-600',
        bgSoft: 'bg-amber-50',
        textOnSoft: 'text-amber-700',
        border: 'border-amber-200',
        gradient: 'from-amber-600 to-orange-700',
        symbol: '☋',
        element: 'Shadow',
    },
    Uranus: {
        hex: '#06B6D4',
        text: 'text-cyan-500',
        bg: 'bg-cyan-500',
        bgSoft: 'bg-cyan-50',
        textOnSoft: 'text-cyan-700',
        border: 'border-cyan-200',
        gradient: 'from-cyan-400 to-sky-500',
        symbol: '♅',
        element: 'Air',
    },
    Neptune: {
        hex: '#6366F1',
        text: 'text-indigo-500',
        bg: 'bg-indigo-500',
        bgSoft: 'bg-indigo-50',
        textOnSoft: 'text-indigo-700',
        border: 'border-indigo-200',
        gradient: 'from-indigo-400 to-blue-500',
        symbol: '♆',
        element: 'Water',
    },
    Pluto: {
        hex: '#64748B',
        text: 'text-slate-500',
        bg: 'bg-slate-500',
        bgSoft: 'bg-slate-50',
        textOnSoft: 'text-slate-700',
        border: 'border-slate-200',
        gradient: 'from-slate-400 to-zinc-500',
        symbol: '♇',
        element: 'Fire',
    },
} as const;

/** Helper to get planet color with fallback for unknown planet names */
export function getPlanetColor(planet: string): PlanetColorSet {
    return PLANET_COLORS[planet] ?? PLANET_COLORS.Sun;
}

/**
 * Tailwind badge class strings derived from PLANET_COLORS.
 * Use for dasha badges, pills, and lightweight planet indicators.
 * Format: "bg-{soft} text-{onSoft} border-{border}"
 */
export const PLANET_BADGE_CLASSES: Record<string, string> = Object.fromEntries(
    Object.entries(PLANET_COLORS).map(([planet, colors]) =>
        [planet, `${colors.bgSoft} ${colors.textOnSoft} ${colors.border}`]
    )
);

/**
 * SVG fill colors for planet names in chart rendering.
 * Maps both full names and 2-letter abbreviations.
 * These are optimized for contrast on parchment/white backgrounds.
 */
export const PLANET_SVG_FILLS: Record<string, string> = {
    Su: '#F97316', Sun: '#F97316',
    Mo: '#2563EB', Moon: '#2563EB',
    Ma: '#EF4444', Mars: '#EF4444',
    Me: '#10B981', Mercury: '#10B981',
    Ju: '#EAB308', Jupiter: '#EAB308',
    Ve: '#D946EF', Venus: '#D946EF',
    Sa: '#4338CA', Saturn: '#4338CA',
    Ra: '#57534E', Rahu: '#57534E',
    Ke: '#D97706', Ketu: '#D97706',
    As: '#7C3AED', Asc: '#7C3AED',
    Ur: '#06B6D4', Uranus: '#06B6D4',
    Ne: '#6366F1', Neptune: '#6366F1',
    Pl: '#64748B', Pluto: '#64748B',
    // Arudha Padas
    AL: '#DC2626', '1P': '#DC2626', '2P': '#DC2626', '3P': '#DC2626', '4P': '#DC2626',
    '5P': '#DC2626', '6P': '#DC2626', '7P': '#DC2626', '8P': '#DC2626', '9P': '#DC2626',
    '10P': '#DC2626', '11P': '#DC2626', '12P': '#DC2626',
} as const;

// =============================================================================
// CHART COLOR THEMES — Used by NorthIndianChart, SouthIndianChart, Customization
// =============================================================================

export interface ChartThemePalette {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    border: string;
    gridLine: string;
    ascLine: string;
    ascText: string;
    signText: string;
    planetText: string;
    centerText: string;
    preview: [string, string, string];
}

export const CHART_THEMES: Record<string, ChartThemePalette> = {
    classic: {
        name: 'Classic',
        primary: '#D97706',
        secondary: '#3E2A1F',
        accent: '#D97706',
        background: '#FFFDF9',
        border: '#D97706',
        gridLine: '#D97706',
        ascLine: '#D97706',
        ascText: '#D97706',
        signText: '#3E2A1F',
        planetText: '#3E2A1F',
        centerText: '#D97706',
        preview: ['#D97706', '#3E2A1F', '#FFFDF9'],
    },
    modern: {
        name: 'Modern',
        primary: '#6366F1',
        secondary: '#1E1B4B',
        accent: '#A5B4FC',
        background: '#EEF2FF',
        border: '#4F46E5',
        gridLine: '#6366F1',
        ascLine: '#4F46E5',
        ascText: '#4F46E5',
        signText: '#6366F1',
        planetText: '#1E1B4B',
        centerText: '#6366F1',
        preview: ['#6366F1', '#1E1B4B', '#EEF2FF'],
    },
    royal: {
        name: 'Royal',
        primary: '#9333EA',
        secondary: '#581C87',
        accent: '#C084FC',
        background: '#FAF5FF',
        border: '#7C3AED',
        gridLine: '#9333EA',
        ascLine: '#7C3AED',
        ascText: '#7C3AED',
        signText: '#9333EA',
        planetText: '#581C87',
        centerText: '#9333EA',
        preview: ['#9333EA', '#581C87', '#FAF5FF'],
    },
    earth: {
        name: 'Earth',
        primary: '#059669',
        secondary: '#064E3B',
        accent: '#34D399',
        background: '#ECFDF5',
        border: '#047857',
        gridLine: '#059669',
        ascLine: '#047857',
        ascText: '#047857',
        signText: '#059669',
        planetText: '#064E3B',
        centerText: '#059669',
        preview: ['#059669', '#064E3B', '#ECFDF5'],
    },
    ocean: {
        name: 'Ocean',
        primary: '#0EA5E9',
        secondary: '#0C4A6E',
        accent: '#38BDF8',
        background: '#F0F9FF',
        border: '#0284C7',
        gridLine: '#0EA5E9',
        ascLine: '#0284C7',
        ascText: '#0284C7',
        signText: '#0EA5E9',
        planetText: '#0C4A6E',
        centerText: '#0EA5E9',
        preview: ['#0EA5E9', '#0C4A6E', '#F0F9FF'],
    },
} as const;

// =============================================================================
// UI CLASS TOKENS — Tailwind class compositions for consistent component styling
// =============================================================================

export const COLORS = {
    // Premium Gradients
    premiumGradient: "bg-gradient-to-r from-gold-dark to-amber-700",
    premiumGradientHover: "hover:from-amber-600 hover:to-amber-800",

    // Content Containers & Surfaces
    wbSurface: "bg-softwhite",
    wbContainer: "bg-softwhite rounded-xl border border-antique shadow-card overflow-hidden",
    wbSectionHeader: "bg-parchment/30 border-b border-antique",

    // Workbench Specific
    wbActiveTab: "bg-gradient-to-r from-gold-dark to-amber-700 !text-white shadow-lg",

    // Status badges
    statusSuccess: "bg-emerald-50 text-emerald-700 border-emerald-200",
    statusError: "bg-red-50 text-red-700 border-red-200",
    statusWarning: "bg-amber-50 text-amber-700 border-amber-200",
    statusInfo: "bg-blue-50 text-blue-700 border-blue-200",

    // Card variants
    cardDefault: "bg-softwhite border border-antique rounded-lg shadow-sm",
    cardElevated: "bg-softwhite border border-antique rounded-xl shadow-card",
    cardInteractive: "bg-softwhite border border-antique rounded-lg shadow-sm hover:shadow-card hover:border-gold-primary transition-all",
} as const;
