"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Orbit,
    ArrowLeft,
    Zap,
    Shield,
    Clock,
    Compass,
    Star,
    BarChart2,
    AlertTriangle,
    Loader2,
    TrendingUp,
    TrendingDown,
    Info,
    Activity,
    Target,
    Gauge,
    Table2,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS } from '@/design-tokens/colors';
import { PLANET_SYMBOLS as ASTRO_SYMBOLS } from '@/lib/planet-symbols';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// Shadbala Types & Interfaces
// ============================================================================

interface IshtaKashta {
    ishta: number;
    kashta: number;
}

interface SthanaSubBalas {
    uchcha: number;
    saptavarga: number;
    ojayugma: number;
    kendra: number;
    drekkana: number;
}

interface KalaSubBalas {
    natonnata: number;
    paksha: number;
    triBhaga: number;
    kaalaDina: number;
    hora: number;
    ayana: number;
    maasa: number;
    varsha: number;
}

export interface ShadbalaPlanet {
    planet: string;
    sthalaBala: number;   // Positional (STHANA TOTAL)
    digBala: number;      // Directional
    kalaBala: number;     // Temporal (sum of kala sub-components)
    cheshtaBala: number;  // Motional
    naisargikaBala: number; // Natural
    drikBala: number;     // Aspectual
    totalBala: number;    // Total in Virupas
    rupaBala: number;     // Total in Rupas (total/60)
    minBalaRequired: number;
    ratio: number;
    rank: number;
    isStrong: boolean;
    percentOfRequired: number;
    ishtaKashta: IshtaKashta;
    sthanaSubBalas: SthanaSubBalas;
    kalaSubBalas: KalaSubBalas;
}

export interface ShadbalaData {
    planets: ShadbalaPlanet[];
    ayanamsa: string;
    system: string;
    userName: string;
    raw?: Record<string, unknown>;
}

// Planet themes derived from centralized design tokens
const PLANET_THEMES: Record<string, { color: string, bg: string, text: string, border: string, iconColor: string, twText: string, twBg: string }> = Object.fromEntries(
    Object.entries(PLANET_COLORS).map(([name, c]) => [name, {
        color: c.hex, bg: c.bgSoft, text: c.textOnSoft, border: c.border,
        iconColor: c.text, twText: c.text, twBg: c.bg,
    }])
);

// Standard minimum Rupa requirements.
const MIN_BALA_REQUIREMENTS: Record<string, number> = {
    Sun: 6.5,
    Moon: 6.0,
    Mars: 5.0,
    Mercury: 7.0,
    Jupiter: 6.5,
    Venus: 7.5,
    Saturn: 5.0,
};

// ============================================================================
// Shadbala Page Component
// ============================================================================

export default function ShadbalaPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [error] = useState<string | null>(null);

    /**
     * Normalizes complex Python engine response to clean frontend types
     */
    const normalizeShadbalaData = useCallback((raw: Record<string, Record<string, unknown>>): ShadbalaData => {
        const planets: ShadbalaPlanet[] = [];
        const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

        planetKeys.forEach(p => {
            const details = (raw[`${p}_details`] || {}) as Record<string, number>;
            const virupas = ((raw.shadbala_virupas as Record<string, number>)?.[p]) || 0;
            const rupas = ((raw.shadbala_rupas as Record<string, number>)?.[p]) || 0;
            const rank = ((raw.relative_rank as Record<string, number>)?.[p]) || 0;
            const strength = ((raw.strength_summary as Record<string, string>)?.[p]) || 'Weak';
            const ishKas = ((raw.ishta_kashta_phala as Record<string, Record<string, number>>)?.[p]) || { Ishta: 0, Kashta: 0 };
            const pctReq = ((raw.percentage_of_required as Record<string, number>)?.[p]) || 0;

            // Sthana Bala sub-components
            const sthanaSubBalas: SthanaSubBalas = {
                uchcha: details['Uchcha Bala'] || 0,
                saptavarga: details['Saptavarga Bala'] || 0,
                ojayugma: details['Ojayugma Bala'] || 0,
                kendra: details['Kendra Bala'] || 0,
                drekkana: details['Drekkana Bala'] || 0,
            };

            // Kala Bala sub-components
            const kalaSubBalas: KalaSubBalas = {
                natonnata: details['Natonnata Bala'] || 0,
                paksha: details['Paksha Bala'] || 0,
                triBhaga: details['Tri-Bhaga Bala'] || 0,
                kaalaDina: details['Kaala_Dina_Bala'] || 0,
                hora: details['Hora Bala'] || 0,
                ayana: details['Ayana Bala'] || 0,
                maasa: details['Maasa Bala'] || 0,
                varsha: details['Varsha Bala'] || 0,
            };

            // Calculate Temporal (Kala) Bala from sub-components
            const kalaBala = Object.values(kalaSubBalas).reduce((a, b) => a + b, 0);

            const minRequired = MIN_BALA_REQUIREMENTS[p] || 6.0;

            planets.push({
                planet: p,
                sthalaBala: details['STHANA TOTAL'] || 0,
                digBala: details['Dig Bala'] || 0,
                kalaBala: kalaBala,
                cheshtaBala: details['Chesta Bala'] || 0,
                naisargikaBala: details['Naisargika Bala'] || 0,
                drikBala: details['Drik Bala'] || 0,
                totalBala: virupas,
                rupaBala: rupas,
                minBalaRequired: minRequired * 60,
                ratio: rupas / minRequired,
                rank: rank,
                isStrong: strength === 'Strong',
                percentOfRequired: pctReq,
                ishtaKashta: {
                    ishta: ishKas.Ishta || 0,
                    kashta: ishKas.Kashta || 0
                },
                sthanaSubBalas,
                kalaSubBalas,
            });
        });

        return {
            planets,
            ayanamsa: String((raw.meta as Record<string, unknown>)?.ayanamsa || 'Lahiri'),
            system: 'Chitrapaksha',
            userName: String((raw.meta as Record<string, unknown>)?.user || ''),
            raw: raw
        };
    }, []);

    // Get Shadbala data from database (processedCharts)
    const shadbalaKey = `shadbala_${ayanamsa.toLowerCase()}`;
    const shadbalaRaw = processedCharts[shadbalaKey]?.chartData;
    const rawData = shadbalaRaw?.data || shadbalaRaw;
    
    // Normalize data for display
    const data: ShadbalaData | null = useMemo(() => {
        const raw = rawData as Record<string, Record<string, unknown>> | undefined;
        if (!raw || !raw.shadbala_virupas) return null;
        return normalizeShadbalaData(raw);
    }, [normalizeShadbalaData, rawData]);
    
    const loading = !data && (isLoadingCharts || isRefreshingCharts);

    // Handle refresh - trigger page reload to refresh charts
    const handleRefresh = () => {
        window.location.reload();
    };

    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-10 max-w-md">
                    <Orbit className="w-12 h-12 text-amber-600 mb-4 mx-auto" />
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] mb-2 text-amber-900")}>Shadbala Analysis — Lahiri Only</h2>
                    <p className={cn(TYPOGRAPHY.profileDetail, "text-amber-700 max-w-md")}>
                        Shadbala (Six-fold planetary strength) analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                    </p>
                    <Link href="/vedic-astrology/overview" className="mt-6 inline-flex items-center gap-1 text-[14px] font-medium text-amber-700 hover:text-amber-500 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Kundali
                    </Link>
                </div>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-12 -mt-2 lg:-mt-4">
            <div className="space-y-5 animate-in fade-in duration-500">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] font-bold text-amber-900">Shadbala</h1>
                        <p className="text-[16px] text-amber-600 mt-1">Six-fold planetary strength analysis</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                        <p className={cn(TYPOGRAPHY.value, "italic tracking-wide text-amber-700")}>Calculating celestial potencies...</p>
                    </div>
                ) : error ? (
                    <div className="p-10 bg-red-50 border border-red-200 rounded-2xl text-center">
                        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 text-[18px] mb-2")}>Calculation Error</h3>
                        <p className={cn(TYPOGRAPHY.profileDetail, "text-red-600 max-w-md mx-auto mb-6")}>{error}</p>
                        <button 
                            onClick={handleRefresh} 
                            disabled={isRefreshingCharts}
                            className={cn(TYPOGRAPHY.label, "px-6 py-2.5 bg-red-100 text-red-700 rounded-xl !text-[14px] !font-bold hover:bg-red-200 transition-colors !mb-0 disabled:opacity-50")}
                        >
                            {isRefreshingCharts ? 'Loading...' : 'Retry Calculation'}
                        </button>
                    </div>
                ) : data?.planets ? (
                    <ShadbalaDashboard displayData={data} />
                ) : (
                    <div className="p-10 bg-white rounded-2xl border border-amber-200/60 shadow-sm text-center lg:py-16">
                        <Orbit className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                        <p className={cn(TYPOGRAPHY.profileDetail, "text-amber-700")}>No Shadbala data found for this chart.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Planet Symbols for Display
// ============================================================================
const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa'
};

// Bala axis labels with educational descriptions
const BALA_AXES = [
    { key: 'sthalaBala', label: 'Sthana', shortLabel: 'Positional', desc: 'Positional strength based on exaltation, divisional charts (vargas), and sign placement.' },
    { key: 'digBala', label: 'Dig', shortLabel: 'Directional', desc: 'Directional strength based on which house/direction the planet occupies. E.g., Sun is strongest in 10th house (South).' },
    { key: 'kalaBala', label: 'Kala', shortLabel: 'Temporal', desc: 'Temporal strength derived from time factors: day/night birth, moon phase, weekday, and year.' },
    { key: 'cheshtaBala', label: 'Cheshta', shortLabel: 'Motional', desc: 'Motional strength related to speed and direction. Retrograde planets have very high Cheshta Bala.' },
    { key: 'naisargikaBala', label: 'Naisargik', shortLabel: 'Natural', desc: 'Natural brightness. Sun is inherently the strongest, followed by Moon, Venus, Jupiter, Mercury, Mars, and Saturn.' },
    { key: 'drikBala', label: 'Drik', shortLabel: 'Aspectual', desc: 'Aspectual strength gained or lost from the visual beam of other planets (Drishti).' },
];

const STHANA_SUB_AXES = [
    { key: 'uchcha', label: 'Uchcha' },
    { key: 'saptavarga', label: 'Saptavarga' },
    { key: 'ojayugma', label: 'Ojayugma' },
    { key: 'kendra', label: 'Kendra' },
    { key: 'drekkana', label: 'Drekkana' },
];

const KALA_SUB_AXES = [
    { key: 'ayana', label: 'Ayana' },
    { key: 'natonnata', label: 'Natonnata' },
    { key: 'paksha', label: 'Paksha' },
    { key: 'triBhaga', label: 'Tri-Bhaga' },
    { key: 'kaalaDina', label: 'Kaala Dina' },
    { key: 'hora', label: 'Hora' },
    { key: 'maasa', label: 'Maasa' },
    { key: 'varsha', label: 'Varsha' },
];

// ============================================================================
// Animated Bar Helper
// ============================================================================
function AnimatedBar({ value, maxVal, color, isNegative, height = 'h-[6px]' }: {
    value: number; maxVal: number; color: string; isNegative?: boolean; height?: string;
}) {
    const barWidth = Math.min((Math.abs(value) / Math.max(maxVal, 1)) * 100, 100);
    return (
        <div className={cn("flex-1 w-full bg-amber-50 rounded-full overflow-hidden shadow-inner", height)}>
            <motion.div
                className={cn("h-full rounded-full relative overflow-hidden")}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }} // Bouncy ease
                style={{
                    backgroundColor: isNegative ? '#ef4444' : color,
                    boxShadow: isNegative ? '0 0 10px #ef444450' : `0 0 10px ${color}50`,
                }}
            >
                {/* Gloss Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 w-1/2 -skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
            </motion.div>
        </div>
    );
}

// ============================================================================
// Mini Ring — used inside hero intelligence cards
// ============================================================================
function MiniRing({ value, max, color }: { value: number; max: number; color: string }) {
    const r = 22;
    const circumference = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const dashOffset = circumference * (1 - pct);
    return (
        <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#F3E9D5" strokeWidth="5" />
            <motion.circle
                cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                transform="rotate(-90 28 28)"
                style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
            />
            <text x="28" y="28" textAnchor="middle" dominantBaseline="central"
                fontSize="11" fontWeight="800" fill={color}>
                {value.toFixed(2)}×
            </text>
        </svg>
    );
}

// ============================================================================
// Radial Gauge Sub-component
// ============================================================================
function RadialGauge({ planet, rupaBala, minRequired, isStrong, color, rank }: {
    planet: string; rupaBala: number; minRequired: number; isStrong: boolean; color: string; rank: number;
}) {
    // Larger gauge for visual impact and clearer ranking at a glance.
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2 - 10;
    const center = size / 2;
    const maxVal = 12;
    const startAngle = 135;
    const sweepAngle = 270;

    const valueAngle = Math.min(rupaBala / maxVal, 1) * sweepAngle;
    const minAngle = Math.min(minRequired / maxVal, 1) * sweepAngle;

    const polarToCartesian = (angleDeg: number) => {
        const angleRad = ((angleDeg + startAngle) * Math.PI) / 180;
        return {
            x: center + radius * Math.cos(angleRad),
            y: center + radius * Math.sin(angleRad),
        };
    };

    const describeArc = (startDeg: number, endDeg: number) => {
        const start = polarToCartesian(startDeg);
        const end = polarToCartesian(endDeg);
        const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    const minTickInner = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius - strokeWidth / 2 - 5;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();
    const minTickOuter = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius + strokeWidth / 2 + 5;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center group min-w-[140px]"
        >
            <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background track */}
                    <path d={describeArc(0, sweepAngle)} fill="none" stroke="#F3E9D5" strokeWidth={strokeWidth} strokeLinecap="round" />
                    {/* Value arc */}
                    <motion.path
                        d={describeArc(0, valueAngle)}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                    />
                    {/* Minimum required threshold tick */}
                    <line
                        x1={minTickInner.x} y1={minTickInner.y}
                        x2={minTickOuter.x} y2={minTickOuter.y}
                        stroke="#ef4444" strokeWidth={3} strokeLinecap="round"
                    />
                    {/* Planet symbol */}
                    <text x={center} y={center - 10} textAnchor="middle" dominantBaseline="central"
                        fontSize="26" fill={color} fontWeight="700">
                        {PLANET_SYMBOLS[planet]}
                    </text>
                    {/* Prominent Rupa value */}
                    <text x={center} y={center + 18} textAnchor="middle" dominantBaseline="central"
                        fontSize="18" fill="#3E2A1F" fontWeight="800">
                        {rupaBala.toFixed(2)}
                    </text>
                    {/* Unit label */}
                    <text x={center} y={center + 36} textAnchor="middle" dominantBaseline="central"
                        fontSize="9" fill="#8B7355" fontWeight="700" letterSpacing="1.5">
                        RUPA
                    </text>
                </svg>
            </div>
            {/* Clearer planet name and ranking */}
            <div className="mt-2 text-center">
                <p className="text-[13px] font-bold text-stone-800 tracking-tight">{planet}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-[11px] font-semibold text-amber-600 tabular-nums">#{rank}</span>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border",
                        isStrong ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                    )}>
                        {isStrong ? "POTENT" : "WEAK"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// Sub-Bala Breakdown Card (used for Sthana & Kala breakdowns)
// ============================================================================
function SubBalaBreakdownCard({ planet, axes, values, theme, idx, globalMaxes }: {
    planet: ShadbalaPlanet;
    axes: { key: string; label: string }[];
    values: Record<string, number>;
    theme: { color: string; twBg: string; twText: string };
    idx: number;
    globalMaxes?: Record<string, number>;
}) {
    const localMax = Math.max(...axes.map(a => Math.abs(values[a.key] || 0)), 1);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="rounded-xl border p-4 transition-all hover:shadow-md"
            style={{ borderColor: `${theme.color}25`, background: `linear-gradient(135deg, ${theme.color}04, transparent)` }}
        >
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-amber-100">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[13px] font-bold shadow-sm", theme.twBg)}>
                    {ASTRO_SYMBOLS[planet.planet]}
                </div>
                <div>
                    <h4 className="text-[13px] font-bold text-stone-800">{planet.planet}</h4>
                    <span className="text-[10px] font-medium text-stone-500 tabular-nums">{planet.rupaBala.toFixed(2)} Rupa · #{planet.rank}</span>
                </div>
            </div>
            <div className="space-y-2">
                {axes.map(axis => {
                    const val = values[axis.key] || 0;
                    const isNegative = val < 0;
                    const maxVal = globalMaxes?.[axis.key] ? Math.max(globalMaxes[axis.key], Math.abs(val)) : localMax;
                    return (
                        <div key={axis.key} className="flex items-center gap-2">
                            <span className="w-[84px] shrink-0 text-right text-[11px] font-medium text-stone-500">
                                {axis.label}
                            </span>
                            <AnimatedBar value={val} maxVal={maxVal} color={theme.color} isNegative={isNegative} height="h-[5px]" />
                            <span className={cn(
                                "w-[44px] text-right tabular-nums text-[11px] font-bold shrink-0",
                                isNegative ? "text-rose-500" : "text-stone-700"
                            )}>
                                {val.toFixed(1)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ============================================================================
// Bala Ranking Bars — horizontal ranking chart shared across bala sections
// ============================================================================
function BalaRankingBars({
    planets,
    valueExtractor,
    unit = '',
}: {
    planets: ShadbalaPlanet[];
    valueExtractor: (p: ShadbalaPlanet) => number;
    unit?: string;
}) {
    const ranked = [...planets].sort((a, b) => valueExtractor(b) - valueExtractor(a));
    const maxVal = Math.max(...ranked.map(p => Math.abs(valueExtractor(p))), 1);

    return (
        <div className="space-y-2">
            {ranked.map((p, idx) => {
                const theme = PLANET_THEMES[p.planet];
                const val = valueExtractor(p);
                const isNegative = val < 0;
                const barWidth = Math.min((Math.abs(val) / maxVal) * 100, 100);

                return (
                    <motion.div
                        key={`rank-${p.planet}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className="flex items-center gap-3"
                    >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm", theme.twBg)}>
                            {PLANET_SYMBOLS[p.planet]}
                        </div>
                        <span className="w-[60px] shrink-0 text-[12px] font-semibold text-stone-700">{p.planet}</span>
                        <div className="flex-1 relative h-3">
                            <div className="h-full w-full bg-amber-50 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{ backgroundColor: isNegative ? '#ef4444' : theme.color }}
                                />
                            </div>
                        </div>
                        <span className={cn(
                            "w-[52px] text-right tabular-nums text-[12px] font-bold shrink-0",
                            isNegative ? "text-rose-500" : "text-stone-700"
                        )}>
                            {val.toFixed(1)}{unit}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ============================================================================
// Simple Bala Table — for balas without sub-components (Dig, Cheshta, etc.)
// ============================================================================
function SimpleBalaTable({
    planets,
    valueExtractor,
    columnLabel,
}: {
    planets: ShadbalaPlanet[];
    valueExtractor: (p: ShadbalaPlanet) => number;
    columnLabel: string;
}) {
    const ranked = [...planets].sort((a, b) => valueExtractor(b) - valueExtractor(a));
    return (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-amber-50/70 border-b border-amber-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <th className="px-4 py-2.5 text-left">Planet</th>
                    <th className="px-4 py-2.5 text-right">{columnLabel}</th>
                    <th className="px-4 py-2.5 text-center w-20">Rank</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
                {ranked.map((p, idx) => {
                    const theme = PLANET_THEMES[p.planet];
                    const val = valueExtractor(p);
                    return (
                        <tr key={p.planet} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-sm", theme.twBg)}>
                                        {ASTRO_SYMBOLS[p.planet]}
                                    </div>
                                    <span className="text-[13px] font-semibold text-stone-700">{p.planet}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className={cn("text-[13px] font-bold tabular-nums", val < 0 ? "text-rose-500" : "text-stone-700")}>
                                    {val.toFixed(1)}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="text-[11px] font-bold text-amber-600 tabular-nums">#{idx + 1}</span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

// ============================================================================
// Compact Dashboard Sub-components
// ============================================================================

function SectionShell({
    title,
    icon,
    meta,
    children,
    className,
}: {
    title: string;
    icon: React.ReactNode;
    meta?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn("bg-white/95 rounded-xl border border-amber-200/70 shadow-sm overflow-hidden", className)}>
            <div className="h-9 px-3 border-b border-amber-200/70 bg-amber-50/45 flex items-center gap-2">
                {icon}
                <h3 className="text-[12px] font-bold text-amber-900 leading-none">{title}</h3>
                {meta && <span className="ml-auto text-[10px] font-semibold text-amber-700 leading-none">{meta}</span>}
            </div>
            {children}
        </section>
    );
}

function StatusPill({ ratio }: { ratio: number }) {
    const status = ratio >= 1 ? "STRONG" : ratio >= 0.8 ? "AVERAGE" : "WEAK";
    return (
        <span className={cn(
            "inline-flex h-5 min-w-[54px] items-center justify-center rounded px-2 text-[9px] font-extrabold leading-none",
            ratio >= 1
                ? "bg-emerald-50 text-emerald-700"
                : ratio >= 0.8
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
        )}>
            {status}
        </span>
    );
}

function TinyPlanetMark({ planet, className }: { planet: string; className?: string }) {
    const theme = PLANET_THEMES[planet];
    return (
        <span className={cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold text-white shadow-sm", theme.twBg, className)}>
            {ASTRO_SYMBOLS[planet] || PLANET_SYMBOLS[planet]}
        </span>
    );
}

function CompactKpiCard({
    label,
    planet,
    tone,
}: {
    label: string;
    planet: ShadbalaPlanet;
    tone: "strong" | "weak";
}) {
    const theme = PLANET_THEMES[planet.planet];
    const isStrongTone = tone === "strong";
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-[86px] rounded-xl border border-amber-200/70 bg-white/95 shadow-sm px-4 py-3 flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3 min-w-0">
                <TinyPlanetMark planet={planet.planet} className="h-8 w-8 text-[14px]" />
                <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase text-amber-800/80 leading-none">{label}</p>
                    <p className="mt-1 text-[19px] font-bold leading-none text-stone-900 truncate">{planet.planet}</p>
                    <p className="mt-1 text-[12px] font-semibold leading-none text-stone-500 tabular-nums">
                        {planet.rupaBala.toFixed(2)} Rupa <span className="text-stone-300">/</span> #{planet.rank}
                    </p>
                </div>
            </div>
            <div className="shrink-0">
                <MiniRing value={planet.percentOfRequired} max={2.5} color={isStrongTone ? theme.color : "#ef4444"} />
            </div>
        </motion.div>
    );
}

function OverallStrengthCard({ planets, averageEfficiency }: { planets: ShadbalaPlanet[]; averageEfficiency: number }) {
    const values = planets.map(p => p.rupaBala);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 0.1);
    const points = values.map((v, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * 116;
        const y = 34 - ((v - min) / range) * 26 - 4;
        return `${x},${y}`;
    }).join(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="h-[86px] rounded-xl border border-amber-200/70 bg-white/95 shadow-sm px-4 py-3 flex items-center justify-between gap-4"
        >
            <div>
                <p className="text-[10px] font-extrabold uppercase text-amber-800/80 leading-none">Overall Strength</p>
                <p className="mt-2 text-[24px] font-extrabold text-stone-900 leading-none tabular-nums">{averageEfficiency.toFixed(2)}x</p>
                <p className="mt-1 text-[12px] font-medium text-stone-500 leading-none">Average Efficiency Ratio</p>
            </div>
            <svg width="120" height="38" viewBox="0 0 120 38" className="shrink-0 overflow-visible">
                <polyline fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
                {values.map((v, i) => {
                    const x = (i / Math.max(values.length - 1, 1)) * 116;
                    const y = 34 - ((v - min) / range) * 26 - 4;
                    return <circle key={i} cx={x} cy={y} r="2.2" fill="#fff7ed" stroke="#d97706" strokeWidth="1.4" />;
                })}
            </svg>
        </motion.div>
    );
}

function IshtaKashtaMiniChart({ planets }: { planets: ShadbalaPlanet[] }) {
    return (
        <div className="p-3">
            <div className="grid grid-cols-7 gap-3 items-end h-[120px]">
                {planets.map((p) => {
                    const theme = PLANET_THEMES[p.planet];
                    const total = Math.max(p.ishtaKashta.ishta + p.ishtaKashta.kashta, 1);
                    const ishtaHeight = Math.max((p.ishtaKashta.ishta / total) * 86, 6);
                    const kashtaHeight = Math.max((p.ishtaKashta.kashta / total) * 86, 6);
                    return (
                        <div key={`phala-${p.planet}`} className="flex flex-col items-center gap-1 min-w-0">
                            <TinyPlanetMark planet={p.planet} className="h-7 w-7" />
                            <p className="w-full truncate text-center text-[10px] font-bold text-stone-800 leading-none">{p.planet}</p>
                            <div className="h-[88px] w-full max-w-[66px] rounded-md overflow-hidden flex flex-col justify-end border border-amber-100 bg-amber-50/50">
                                <div
                                    className="flex items-center justify-center bg-emerald-500 text-[10px] font-bold text-white"
                                    style={{ height: `${ishtaHeight}px`, backgroundColor: theme.color === "#10B981" ? "#10B981" : "#14b981" }}
                                >
                                    {p.ishtaKashta.ishta.toFixed(1)}
                                </div>
                                <div className="flex items-center justify-center bg-red-500 text-[10px] font-bold text-white" style={{ height: `${kashtaHeight}px` }}>
                                    {p.ishtaKashta.kashta.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-5 border-t border-amber-200/70 pt-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Ishta (Auspicious)</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500"><span className="h-3 w-3 rounded-sm bg-red-500" /> Kashta (Inauspicious)</span>
            </div>
        </div>
    );
}

function CompactProfileCard({ planet, maxes }: { planet: ShadbalaPlanet; maxes: Record<string, number> }) {
    const theme = PLANET_THEMES[planet.planet];
    return (
        <div className="rounded-lg border border-amber-200/70 bg-white px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <TinyPlanetMark planet={planet.planet} />
                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-stone-900 leading-none">{planet.planet}</p>
                        <p className="mt-1 text-[10px] font-semibold text-amber-800 leading-none tabular-nums">{planet.rupaBala.toFixed(2)} Rupa / #{planet.rank}</p>
                    </div>
                </div>
                <StatusPill ratio={planet.percentOfRequired} />
            </div>
            <div className="space-y-1">
                {BALA_AXES.map((axis) => {
                    const value = (planet as unknown as Record<string, number>)[axis.key] || 0;
                    const width = Math.min((Math.abs(value) / Math.max(maxes[axis.key] || 1, 1)) * 100, 100);
                    return (
                        <div key={`${planet.planet}-${axis.key}`} className="grid grid-cols-[58px_1fr_34px] items-center gap-2">
                            <span className="text-[10px] font-medium text-stone-600 leading-none">{axis.shortLabel}</span>
                            <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${width}%`, backgroundColor: value < 0 ? "#ef4444" : theme.color }}
                                />
                            </div>
                            <span className={cn("text-right text-[10px] font-bold tabular-nums leading-none", value < 0 ? "text-red-500" : "text-amber-800")}>
                                {value.toFixed(0)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function RequiredStrengthBars({ planets, maxRatio }: { planets: ShadbalaPlanet[]; maxRatio: number }) {
    return (
        <div className="p-3 space-y-2">
            {planets.map((p) => {
                const theme = PLANET_THEMES[p.planet];
                const width = Math.min((p.percentOfRequired / maxRatio) * 100, 100);
                return (
                    <div key={`required-${p.planet}`} className="grid grid-cols-[24px_58px_1fr_42px] items-center gap-2">
                        <TinyPlanetMark planet={p.planet} />
                        <span className="text-[12px] font-bold text-stone-800 leading-none">{p.planet}</span>
                        <div className="h-2.5 rounded-full bg-amber-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: p.percentOfRequired >= 1 ? theme.color : "#ef4444" }} />
                        </div>
                        <span className={cn("text-right text-[11px] font-extrabold tabular-nums leading-none", p.percentOfRequired >= 1 ? "text-emerald-600" : "text-red-500")}>
                            {p.percentOfRequired.toFixed(2)}x
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function CompactRupaGauge({ planet }: { planet: ShadbalaPlanet }) {
    const theme = PLANET_THEMES[planet.planet];
    const radius = 29;
    const circumference = 2 * Math.PI * radius;
    const max = 10;
    const pct = Math.min(planet.rupaBala / max, 1);
    const dashOffset = circumference * (1 - pct);
    return (
        <div className="flex min-w-[104px] flex-col items-center">
            <div className="h-[82px] w-[86px]">
                <svg width="86" height="82" viewBox="0 0 86 82" className="block overflow-visible">
                    <circle cx="43" cy="43" r={radius} fill="none" stroke="#f5ead3" strokeWidth="8" strokeDasharray={`${circumference * 0.72} ${circumference}`} strokeLinecap="round" transform="rotate(142 43 43)" />
                    <circle
                        cx="43"
                        cy="43"
                        r={radius}
                        fill="none"
                        stroke={theme.color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform="rotate(142 43 43)"
                    />
                    <text x="43" y="38" textAnchor="middle" fontSize="16" fontWeight="800" fill="#2D2419">{planet.rupaBala.toFixed(2)}</text>
                    <text x="43" y="51" textAnchor="middle" fontSize="8" fontWeight="800" fill="#8B7355">RUPA</text>
                </svg>
            </div>
            <p className="mt-0 text-[11px] font-extrabold text-stone-800 leading-none">#{planet.rank}</p>
            <div className="mt-2"><StatusPill ratio={planet.percentOfRequired} /></div>
        </div>
    );
}

// ============================================================================
// Enhanced Dashboard Sub-component
// ============================================================================

export function ShadbalaDashboard({ displayData }: { displayData: ShadbalaData }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    const averageEfficiency = sortedPlanets.reduce((sum, p) => sum + p.percentOfRequired, 0) / sortedPlanets.length;
    const maxPctReq = Math.max(...sortedPlanets.map(p => p.percentOfRequired), 1);
    const tableMaxValues: Record<string, number> = {};
    BALA_AXES.forEach(axis => {
        tableMaxValues[axis.key] = Math.max(...sortedPlanets.map(p => Math.abs((p as unknown as Record<string, number>)[axis.key] || 0)), 1);
    });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <CompactKpiCard label="Strongest Planet" planet={strongest} tone="strong" />
                <CompactKpiCard label="Weakest Planet" planet={weakest} tone="weak" />
                <OverallStrengthCard planets={sortedPlanets} averageEfficiency={averageEfficiency} />
            </div>

            <SectionShell
                title="Shadbala Summary"
                icon={<Table2 className="w-3.5 h-3.5 text-amber-700" />}
                meta="Compare Strength Values"
            >
                <DataGrid
                    columns={[
                        {
                            key: 'planet',
                            header: 'Planet',
                            width: 'w-32',
                            cellClassName: 'px-3',
                            render: (row: ShadbalaPlanet) => (
                                <div className="flex items-center gap-2">
                                    <TinyPlanetMark planet={row.planet} />
                                    <span className="text-[12px] font-bold text-stone-900">{row.planet}</span>
                                </div>
                            ),
                        },
                        ...BALA_AXES.map(axis => ({
                            key: axis.key,
                            header: axis.label,
                            align: 'center' as const,
                            width: 'w-20',
                            cellClassName: "text-[12px] tabular-nums text-stone-800",
                            render: (row: ShadbalaPlanet) => {
                                const val = (row as unknown as Record<string, number>)[axis.key] || 0;
                                return <span className={val < 0 ? "text-red-500 font-bold" : ""}>{val.toFixed(1)}</span>;
                            },
                        })),
                        {
                            key: 'totalBala',
                            header: 'Virupa',
                            align: 'center' as const,
                            width: 'w-24',
                            headerClassName: '!text-amber-800 bg-amber-50/80',
                            cellClassName: "text-[12px] font-extrabold text-amber-800 bg-amber-50/60 tabular-nums",
                            render: (row: ShadbalaPlanet) => row.totalBala.toFixed(1),
                        },
                        {
                            key: 'rupaBala',
                            header: 'Rupa',
                            align: 'center' as const,
                            width: 'w-20',
                            cellClassName: "text-[12px] font-extrabold text-stone-900 tabular-nums",
                            render: (row: ShadbalaPlanet) => row.rupaBala.toFixed(2),
                        },
                        {
                            key: 'rank',
                            header: 'Rank',
                            align: 'center' as const,
                            width: 'w-16',
                            cellClassName: "text-[12px] font-extrabold text-stone-800 tabular-nums",
                            render: (row: ShadbalaPlanet) => `#${row.rank}`,
                        },
                        {
                            key: 'percentOfRequired',
                            header: '% Req',
                            align: 'center' as const,
                            width: 'w-20',
                            cellClassName: "text-[12px] font-extrabold tabular-nums",
                            render: (row: ShadbalaPlanet) => (
                                <span className={row.percentOfRequired >= 1 ? "text-emerald-600" : "text-red-500"}>
                                    {row.percentOfRequired.toFixed(2)}x
                                </span>
                            ),
                        },
                        {
                            key: 'isStrong',
                            header: 'Status',
                            align: 'center' as const,
                            width: 'w-20',
                            cellClassName: "px-2",
                            render: (row: ShadbalaPlanet) => <StatusPill ratio={row.percentOfRequired} />,
                        },
                    ] satisfies DataGridColumn<ShadbalaPlanet>[]}
                    data={sortedPlanets}
                    rowKey={(row) => row.planet}
                    compact
                    cellPadding="px-3 py-1.5"
                    headerClassName="bg-amber-50/70 border-b border-amber-200/80"
                    tableClassName="text-[12px]"
                    ariaLabel="Shadbala complete strength summary"
                    scrollShadows={true}
                />
            </SectionShell>

            <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.55fr] gap-3">
                <SectionShell
                    title="Ishta & Kashta Phala"
                    icon={<Activity className="w-3.5 h-3.5 text-emerald-600" />}
                >
                    <IshtaKashtaMiniChart planets={sortedPlanets} />
                </SectionShell>

                <SectionShell
                    title="Six-Fold Strength Profile"
                    icon={<Compass className="w-3.5 h-3.5 text-amber-700" />}
                    meta="Rupa Values"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 p-3">
                        {sortedPlanets.map((planet) => (
                            <CompactProfileCard key={`profile-${planet.planet}`} planet={planet} maxes={tableMaxValues} />
                        ))}
                    </div>
                </SectionShell>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.55fr] gap-3">
                <SectionShell
                    title="Required Strength %"
                    icon={<Target className="w-3.5 h-3.5 text-blue-600" />}
                    meta="Efficiency Ratio"
                >
                    <RequiredStrengthBars planets={sortedPlanets} maxRatio={maxPctReq} />
                </SectionShell>

                <SectionShell
                    title="Rupa Strength Overview"
                    icon={<Gauge className="w-3.5 h-3.5 text-amber-700" />}
                    meta="Vigor Gauges"
                >
                    <div className="flex flex-wrap items-start justify-center gap-4 px-4 py-4">
                        {sortedPlanets.map((planet) => (
                            <CompactRupaGauge key={`gauge-${planet.planet}`} planet={planet} />
                        ))}
                    </div>
                </SectionShell>
            </div>
        </div>
    );
}

function LegacyShadbalaDashboard({ displayData }: { displayData: ShadbalaData }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    // Average planetary efficiency for the overall strength card
    const averageEfficiency = sortedPlanets.reduce((sum, p) => sum + p.percentOfRequired, 0) / sortedPlanets.length;

    // Compute max values for heatmap scaling
    const tableMaxValues: Record<string, number> = {};
    BALA_AXES.forEach(axis => {
        tableMaxValues[axis.key] = Math.max(...displayData.planets.map(p => Math.abs((p as unknown as Record<string, number>)[axis.key] || 0)));
    });

    const strongestTheme = PLANET_THEMES[strongest.planet];
    const weakestTheme = PLANET_THEMES[weakest.planet];

    // Max Ishta/Kashta for scaling
    const maxIshtaKashta = Math.max(
        ...displayData.planets.map(p => Math.max(p.ishtaKashta.ishta, p.ishtaKashta.kashta)),
        1
    );
    void maxIshtaKashta;

    // Max % of required for scaling
    const maxPctReq = Math.max(...displayData.planets.map(p => p.percentOfRequired), 1);

    return (
        <div className="space-y-5">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: Hero Intelligence Cards
                ───────────────────────────────────────────────────────────────
                Three-card intelligence row designed for instant comprehension:
                strongest planet, weakest planet, and overall chart balance.
                Each card is a fixed 96px height with a 4px semantic accent on
                the left (green = strong, red = weak, amber = average) so the
                eye can parse state before reading a single word.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Strongest Planet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 h-24 relative overflow-hidden group hover:shadow-md transition-shadow border-l-4 border-l-emerald-500"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${strongestTheme.color}12, transparent)` }}
                    />
                    <div className="relative z-10 h-full flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <h3 className={cn(TYPOGRAPHY.microLabel, "text-[10px] text-stone-500")}>Strongest Planet</h3>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[26px] leading-none", strongestTheme.twText)}>{PLANET_SYMBOLS[strongest.planet]}</span>
                                <div className="min-w-0">
                                    <span className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] block leading-none mb-0.5 truncate")}>{strongest.planet}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold text-stone-700 tabular-nums">{strongest.rupaBala.toFixed(2)} Rupa</span>
                                        <span className="text-[11px] text-stone-400">·</span>
                                        <span className="px-1.5 py-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">#{strongest.rank}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <MiniRing value={strongest.percentOfRequired} max={2.5} color={strongestTheme.color} />
                        </div>
                    </div>
                </motion.div>

                {/* Weakest Planet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 h-24 relative overflow-hidden group hover:shadow-md transition-shadow border-l-4 border-l-red-500"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${weakestTheme.color}12, transparent)` }}
                    />
                    <div className="relative z-10 h-full flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                <h3 className={cn(TYPOGRAPHY.microLabel, "text-[10px] text-stone-500")}>Weakest Planet</h3>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[26px] leading-none", weakestTheme.twText)}>{PLANET_SYMBOLS[weakest.planet]}</span>
                                <div className="min-w-0">
                                    <span className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] block leading-none mb-0.5 truncate")}>{weakest.planet}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold text-stone-700 tabular-nums">{weakest.rupaBala.toFixed(2)} Rupa</span>
                                        <span className="text-[11px] text-stone-400">·</span>
                                        <span className="px-1.5 py-0 bg-red-50 text-red-700 text-[10px] font-bold rounded">#{weakest.rank}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <MiniRing value={weakest.percentOfRequired} max={2.5} color={weakestTheme.color} />
                        </div>
                    </div>
                </motion.div>

                {/* Overall Strength */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 h-24 relative overflow-hidden group hover:shadow-md transition-shadow border-l-4 border-l-amber-500"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, #F59E0B12, transparent)` }}
                    />
                    <div className="relative z-10 h-full flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Gauge className="w-3.5 h-3.5 text-amber-600" />
                                <h3 className={cn(TYPOGRAPHY.microLabel, "text-[10px] text-stone-500")}>Overall Strength</h3>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[24px] font-bold text-stone-800 leading-none tabular-nums">{averageEfficiency.toFixed(2)}×</span>
                                <span className="text-[11px] text-stone-500 mt-0.5 truncate">Average efficiency ratio</span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            {/* Compact sparkline of rupa values across sorted planets */}
                            <svg width="64" height="36" viewBox="0 0 64 36" className="overflow-visible">
                                {(() => {
                                    const values = sortedPlanets.map(p => p.rupaBala);
                                    const min = Math.min(...values);
                                    const max = Math.max(...values);
                                    const range = Math.max(max - min, 0.1);
                                    const points = values.map((v, i) => {
                                        const x = (i / (values.length - 1)) * 64;
                                        const y = 36 - ((v - min) / range) * 28 - 4;
                                        return `${x},${y}`;
                                    }).join(' ');
                                    return (
                                        <>
                                            <polyline
                                                fill="none"
                                                stroke="#F59E0B"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                points={points}
                                            />
                                            {values.map((v, i) => {
                                                const x = (i / (values.length - 1)) * 64;
                                                const y = 36 - ((v - min) / range) * 28 - 4;
                                                return (
                                                    <circle
                                                        key={i}
                                                        cx={x}
                                                        cy={y}
                                                        r="2.5"
                                                        fill="#FEFAEA"
                                                        stroke="#F59E0B"
                                                        strokeWidth="1.5"
                                                    />
                                                );
                                            })}
                                        </>
                                    );
                                })()}
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Shadbala Summary Table
                ───────────────────────────────────────────────────────────────
                Professional analytical table. Improvements:
                • Stronger header separation with uppercase, high-contrast labels
                • Increased row height (px-4 py-3.5) for readability
                • Consistent one-decimal formatting for the six bala columns
                • Tabular numerals across all numeric cells
                • Smaller, bordered status badges (Strong/Average/Weak)
                • Subtle but visible row borders
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 bg-amber-50/30 flex items-center gap-2">
                    <Table2 className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Shadbala Summary</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comprehensive breakdown of all six planetary strength factors measured in Virupas.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-amber-700 font-medium text-[10px]")}>Complete Strength Matrix</span>
                </div>
                <DataGrid
                    columns={[
                        {
                            key: 'planet',
                            header: 'Planet',
                            width: 'w-32',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: 'px-4',
                            render: (row: ShadbalaPlanet) => {
                                const theme = PLANET_THEMES[row.planet];
                                return (
                                    <div className="flex items-center gap-2.5">
                                        <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[13px] font-bold shadow-sm", theme.twBg)}>
                                            {ASTRO_SYMBOLS[row.planet]}
                                        </span>
                                        <span className="text-[14px] font-semibold text-stone-800">{row.planet}</span>
                                    </div>
                                );
                            },
                        },
                        ...BALA_AXES.map(axis => ({
                            key: axis.key,
                            header: axis.label,
                            align: 'center' as const,
                            width: 'w-20',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: "text-[13px] tabular-nums text-stone-600",
                            render: (row: ShadbalaPlanet) => {
                                const val = (row as unknown as Record<string, number>)[axis.key] || 0;
                                return <span>{val.toFixed(1)}</span>;
                            },
                        })),
                        {
                            key: 'totalBala',
                            header: 'Virupas',
                            align: 'center' as const,
                            width: 'w-24',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-amber-700 bg-amber-50/80',
                            cellClassName: "text-[13px] font-semibold text-amber-700 bg-amber-50/60 tabular-nums",
                            sortable: true,
                            render: (row: ShadbalaPlanet) => row.totalBala.toFixed(1),
                        },
                        {
                            key: 'rupaBala',
                            header: 'Rupas',
                            align: 'center' as const,
                            width: 'w-20',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: "text-[13px] font-bold text-stone-800 tabular-nums",
                            render: (row: ShadbalaPlanet) => row.rupaBala.toFixed(2),
                        },
                        {
                            key: 'rank',
                            header: 'Rank',
                            align: 'center' as const,
                            width: 'w-16',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: "text-[13px] font-bold text-stone-700 tabular-nums",
                            render: (row: ShadbalaPlanet) => `#${row.rank}`,
                        },
                        {
                            key: 'percentOfRequired',
                            header: '% Req',
                            align: 'center' as const,
                            width: 'w-24',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: "text-[13px] font-semibold tabular-nums",
                            render: (row: ShadbalaPlanet) => {
                                const meets = row.percentOfRequired >= 1.0;
                                return (
                                    <span className={meets ? "text-emerald-600" : "text-rose-500"}>
                                        {row.percentOfRequired.toFixed(2)}×
                                    </span>
                                );
                            },
                        },
                        {
                            key: 'isStrong',
                            header: 'Status',
                            align: 'center' as const,
                            width: 'w-20',
                            headerClassName: '!uppercase !text-[11px] !font-bold !tracking-wider !text-stone-500',
                            cellClassName: "px-2",
                            render: (row: ShadbalaPlanet) => {
                                const pct = row.percentOfRequired;
                                const status = pct >= 1.0 ? 'Strong' : pct >= 0.8 ? 'Average' : 'Weak';
                                const statusClasses = pct >= 1.0
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : pct >= 0.8
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-red-50 text-red-700 border-red-200';
                                return (
                                    <span className={cn(
                                        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border",
                                        statusClasses
                                    )}>
                                        {status}
                                    </span>
                                );
                            },
                        },
                    ] satisfies DataGridColumn<ShadbalaPlanet>[]}
                    data={sortedPlanets}
                    rowKey={(row) => row.planet}
                    cellPadding="px-4 py-3.5"
                    headerClassName="bg-amber-50/70 border-b border-amber-200/80"
                    ariaLabel="Shadbala complete strength summary"
                    scrollShadows={true}
                />
            </div>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Ishta & Kashta Phala
                ───────────────────────────────────────────────────────────────
                Transformed from vertical columns into a planetary benefit-vs-
                challenge analysis. One horizontal stacked bar per planet makes
                it possible to instantly spot the most benefic planet (longest
                green segment) and the most challenged planet (longest red
                segment). Exact values are always visible.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Ishta & Kashta Phala</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p><b>Ishta Phala</b> represents beneficial strength (happiness, success).<br/><b>Kashta Phala</b> represents challenging strength (obstacles).</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-amber-700 font-medium text-[10px]")}>Benefit vs Challenge</span>
                </div>
                <div className="p-5 space-y-3">
                    {(() => {
                        const maxIshta = Math.max(...sortedPlanets.map(p => p.ishtaKashta.ishta), 1);
                        const maxKashta = Math.max(...sortedPlanets.map(p => p.ishtaKashta.kashta), 1);

                        return sortedPlanets.map((p, idx) => {
                            const theme = PLANET_THEMES[p.planet];
                            const ishtaVal = p.ishtaKashta.ishta;
                            const kashtaVal = p.ishtaKashta.kashta;
                            const total = Math.max(ishtaVal + kashtaVal, 1);
                            const ishtaWidth = (ishtaVal / total) * 100;
                            const isMostBenefic = ishtaVal === maxIshta;
                            const isMostChallenged = kashtaVal === maxKashta;

                            return (
                                <motion.div
                                    key={`phala-${p.planet}`}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl border transition-colors",
                                        isMostBenefic && "bg-emerald-50/40 border-emerald-200",
                                        isMostChallenged && "bg-red-50/40 border-red-200",
                                        !isMostBenefic && !isMostChallenged && "bg-white border-transparent hover:bg-amber-50/30"
                                    )}
                                >
                                    {/* Planet identity */}
                                    <div className="flex items-center gap-2.5 w-[100px] shrink-0">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-bold shadow-sm", theme.twBg)}>
                                            {PLANET_SYMBOLS[p.planet]}
                                        </div>
                                        <div>
                                            <span className="text-[13px] font-bold text-stone-800 block leading-none">{p.planet}</span>
                                            {isMostBenefic && <span className="text-[9px] font-bold text-emerald-600">Most Benefic</span>}
                                            {isMostChallenged && <span className="text-[9px] font-bold text-red-600">Most Challenged</span>}
                                        </div>
                                    </div>

                                    {/* Stacked horizontal bar */}
                                    <div className="flex-1 min-w-0">
                                        <div className="h-5 w-full rounded-lg overflow-hidden flex shadow-inner">
                                            <motion.div
                                                className="h-full bg-emerald-500 flex items-center justify-center"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${ishtaWidth}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                            >
                                                {ishtaWidth > 12 && (
                                                    <span className="text-white text-[10px] font-bold drop-shadow">{ishtaVal.toFixed(1)}</span>
                                                )}
                                            </motion.div>
                                            <div className="h-full flex-1 bg-red-500 flex items-center justify-center">
                                                {ishtaWidth < 88 && (
                                                    <span className="text-white text-[10px] font-bold drop-shadow">{kashtaVal.toFixed(1)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exact values */}
                                    <div className="flex items-center gap-3 w-[110px] shrink-0 justify-end">
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Ishta</span>
                                            <span className="text-[13px] font-bold text-emerald-700 tabular-nums">{ishtaVal.toFixed(1)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider block">Kashta</span>
                                            <span className="text-[13px] font-bold text-red-700 tabular-nums">{kashtaVal.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        });
                    })()}

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 pt-3 border-t border-amber-200/60 mt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm" />
                            <span className={cn(TYPOGRAPHY.label, "text-amber-700 font-medium lowercase text-[10px]")}>Ishta (Auspicious)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-red-500 shadow-sm" />
                            <span className={cn(TYPOGRAPHY.label, "text-amber-700 font-medium lowercase text-[10px]")}>Kashta (Inauspicious)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: Six-Fold Strength Profile
                ───────────────────────────────────────────────────────────────
                Planet Strength Intelligence Cards. Each card is a self-contained
                planetary summary. Bars are scaled against the GLOBAL maximum for
                each bala (reusing tableMaxValues), so an astrologer can compare
                the *same* bala across planets at a glance rather than only seeing
                a planet's internal distribution.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Six-Fold Strength Profile</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Per-planet analysis of the 6 primary strength components. Bars use a shared scale for cross-planet comparison.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-amber-700 font-medium text-[10px]")}>Planetary Intelligence</span>
                </div>
                <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedPlanets.map((p, idx) => {
                        const theme = PLANET_THEMES[p.planet];
                        const balas = BALA_AXES.map(axis => ({
                            label: axis.shortLabel,
                            fullLabel: axis.label,
                            desc: axis.desc,
                            key: axis.key,
                            value: (p as unknown as Record<string, number>)[axis.key] || 0,
                        }));
                        const pct = p.percentOfRequired;
                        const status = pct >= 1.0 ? 'Strong' : pct >= 0.8 ? 'Average' : 'Weak';
                        const statusClasses = pct >= 1.0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : pct >= 0.8
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200';

                        return (
                            <motion.div
                                key={`profile-${p.planet}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                className="rounded-2xl border bg-white p-4 transition-all hover:shadow-md overflow-hidden"
                                style={{ borderColor: `${theme.color}25` }}
                            >
                                {/* Top accent bar */}
                                <div className="h-1 w-full -mt-4 mb-3" style={{ backgroundColor: theme.color }} />

                                {/* Planet Header */}
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-amber-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-[15px] font-bold shadow-sm", theme.twBg)}>
                                            {ASTRO_SYMBOLS[p.planet]}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[14px] font-bold text-stone-800 leading-none mb-0.5 truncate">{p.planet}</h4>
                                            <p className="text-[11px] font-semibold text-stone-500 tabular-nums">
                                                {p.rupaBala.toFixed(2)} Rupa · #{p.rank}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border",
                                        statusClasses
                                    )}>
                                        {status}
                                    </span>
                                </div>

                                {/* 6 Bala Bars — globally scaled */}
                                <div className="space-y-2">
                                    {balas.map((bala) => {
                                        const isNegative = bala.value < 0;
                                        const globalMax = tableMaxValues[bala.key] || 1;
                                        return (
                                            <div key={bala.label} className="flex items-center gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="w-[78px] shrink-0 text-right text-[11px] font-medium text-stone-500 cursor-help truncate">
                                                                {bala.fullLabel}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p><b>{bala.label} Bala</b>: {bala.desc}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <AnimatedBar value={bala.value} maxVal={globalMax} color={theme.color} isNegative={isNegative} height="h-[6px]" />
                                                <span className={cn(
                                                    "w-[40px] text-right tabular-nums text-[11px] font-bold shrink-0",
                                                    isNegative ? "text-rose-500" : "text-stone-700"
                                                )}>
                                                    {bala.value.toFixed(1)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5: Sthana Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Analytical verification section. Ranking bars show the overall
                Positional Strength order, while the cards below preserve every
                sub-component value with improved spacing and typography.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Sthana Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deep dive into the 5 sub-components of Positional Strength.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.sthalaBala - a.sthalaBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.sthalaBala} />
                    {(() => {
                        const globalMaxes: Record<string, number> = {};
                        STHANA_SUB_AXES.forEach(axis => {
                            globalMaxes[axis.key] = Math.max(...sortedPlanets.map(p => Math.abs((p.sthanaSubBalas as unknown as Record<string, number>)[axis.key] || 0)));
                        });
                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-amber-200/60">
                                {sortedPlanets.map((p, idx) => (
                                    <SubBalaBreakdownCard
                                        key={`sthana-${p.planet}`}
                                        planet={p}
                                        axes={STHANA_SUB_AXES}
                                        values={p.sthanaSubBalas as unknown as Record<string, number>}
                                        theme={PLANET_THEMES[p.planet]}
                                        idx={idx}
                                        globalMaxes={globalMaxes}
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6: Kala Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Analytical verification section for Temporal Strength. Ranking
                bars at the top reveal the planetary order; cards below preserve
                every sub-component with improved readability.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Kala Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deep dive into the 8 sub-components of Temporal Strength.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.kalaBala - a.kalaBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.kalaBala} />
                    {(() => {
                        const globalMaxes: Record<string, number> = {};
                        KALA_SUB_AXES.forEach(axis => {
                            globalMaxes[axis.key] = Math.max(...sortedPlanets.map(p => Math.abs((p.kalaSubBalas as unknown as Record<string, number>)[axis.key] || 0)));
                        });
                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-amber-200/60">
                                {sortedPlanets.map((p, idx) => (
                                    <SubBalaBreakdownCard
                                        key={`kala-${p.planet}`}
                                        planet={p}
                                        axes={KALA_SUB_AXES}
                                        values={p.kalaSubBalas as unknown as Record<string, number>}
                                        theme={PLANET_THEMES[p.planet]}
                                        idx={idx}
                                        globalMaxes={globalMaxes}
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6b: Dig Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Directional Strength analytical verification. Ranking bars plus
                a compact data table let astrologers verify which planets are
                directionally strongest and weakest.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Dig Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Directional strength based on the house/direction a planet occupies.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.digBala - a.digBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.digBala} />
                    <div className="pt-4 border-t border-amber-200/60">
                        <SimpleBalaTable planets={sortedPlanets} valueExtractor={p => p.digBala} columnLabel="Dig Bala" />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6c: Cheshta Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Motional Strength analytical verification.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Cheshta Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Motional strength related to planetary speed and retrograde motion.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.cheshtaBala - a.cheshtaBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.cheshtaBala} />
                    <div className="pt-4 border-t border-amber-200/60">
                        <SimpleBalaTable planets={sortedPlanets} valueExtractor={p => p.cheshtaBala} columnLabel="Cheshta Bala" />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6d: Naisargika Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Natural Strength analytical verification.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Naisargika Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Inherent natural brightness of each planet.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.naisargikaBala - a.naisargikaBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.naisargikaBala} />
                    <div className="pt-4 border-t border-amber-200/60">
                        <SimpleBalaTable planets={sortedPlanets} valueExtractor={p => p.naisargikaBala} columnLabel="Naisargika Bala" />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6e: Drik Bala Breakdown
                ───────────────────────────────────────────────────────────────
                Aspectual Strength analytical verification.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Drik Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Aspectual strength gained or lost from planetary aspects (Drishti).</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.drikBala - a.drikBala);
                        const highest = ranked[0];
                        const lowest = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    {highest.planet} leads
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    {lowest.planet} weakest
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-5">
                    <BalaRankingBars planets={sortedPlanets} valueExtractor={p => p.drikBala} />
                    <div className="pt-4 border-t border-amber-200/60">
                        <SimpleBalaTable planets={sortedPlanets} valueExtractor={p => p.drikBala} columnLabel="Drik Bala" />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7: Planetary Efficiency Analysis
                ───────────────────────────────────────────────────────────────
                Formerly "Required Strength %". Now framed as efficiency analysis
                with strongest/weakest badges and ranked bars. Planets are sorted
                by efficiency so the astrologer can instantly verify which
                celestial bodies exceed their Shastric requirement and by how much.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Planetary Efficiency Analysis</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comparison of actual strength against the Shastric minimum requirement.<br/>Ratio ≥ 1.0 means the planet is functionally strong.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.percentOfRequired - a.percentOfRequired);
                        const strongestEff = ranked[0];
                        const weakestEff = ranked[ranked.length - 1];
                        return (
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Strongest: {strongestEff.planet} {strongestEff.percentOfRequired.toFixed(2)}×
                                </span>
                                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                    Weakest: {weakestEff.planet} {weakestEff.percentOfRequired.toFixed(2)}×
                                </span>
                            </div>
                        );
                    })()}
                </div>
                <div className="p-5 space-y-3">
                    {(() => {
                        const ranked = [...sortedPlanets].sort((a, b) => b.percentOfRequired - a.percentOfRequired);
                        const thresholdPos = Math.min((1.0 / maxPctReq) * 100, 100);

                        return ranked.map((p, idx) => {
                            const theme = PLANET_THEMES[p.planet];
                            const pct = p.percentOfRequired;
                            const meetsMin = pct >= 1.0;
                            const barWidth = Math.min((pct / maxPctReq) * 100, 100);

                            return (
                                <motion.div
                                    key={`pct-${p.planet}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm", theme.twBg)}>
                                        {PLANET_SYMBOLS[p.planet]}
                                    </div>
                                    <span className="w-[60px] shrink-0 text-[13px] font-semibold text-stone-700">{p.planet}</span>
                                    <div className="flex-1 relative h-4">
                                        <div className="h-full w-full bg-amber-50 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                className="h-full rounded-full relative overflow-hidden"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${barWidth}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                style={{
                                                    background: meetsMin
                                                        ? `linear-gradient(90deg, ${theme.color}CC, ${theme.color})`
                                                        : `linear-gradient(90deg, #f59e0bcc, #ef4444)`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-1/2 -skew-x-12 translate-x-[-150%] animate-[shimmer_4s_infinite]" />
                                            </motion.div>
                                        </div>
                                        {/* 1.0x threshold line */}
                                        <div
                                            className="absolute top-0 bottom-0 w-0.5 bg-copper-900/30 z-10"
                                            style={{ left: `${thresholdPos}%` }}
                                        />
                                    </div>
                                    <span className={cn(
                                        "w-[52px] text-right tabular-nums text-[13px] font-bold shrink-0",
                                        meetsMin ? "text-emerald-600" : "text-rose-500"
                                    )}>
                                        {pct.toFixed(2)}×
                                    </span>
                                </motion.div>
                            );
                        });
                    })()}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8: Rupa Strength Overview
                ───────────────────────────────────────────────────────────────
                Visual highlight of the page. Gauges are now larger (160px),
                values are more prominent, and each planet gets generous,
                consistent spacing so rankings read instantly left-to-right.
            ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[12px] leading-none font-semibold text-amber-900")}>Rupa Strength Overview</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Planetary strength measured in Rupas (1 Rupa = 60 Virupas).<br/>The red tick marks the minimum required threshold.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-amber-700 font-medium text-[10px]")}>Vigor Gauges</span>
                </div>
                <div className="p-6 md:p-8 flex flex-wrap items-start justify-center gap-6 md:gap-8">
                    {sortedPlanets.map((p) => {
                        const theme = PLANET_THEMES[p.planet];
                        const minRequiredRupa = p.minBalaRequired / 60;
                        return (
                            <RadialGauge
                                key={`gauge-wrapper-${p.planet}`}
                                planet={p.planet}
                                rupaBala={p.rupaBala}
                                minRequired={minRequiredRupa}
                                isStrong={p.isStrong}
                                color={theme.color}
                                rank={p.rank}
                            />
                        );
                    })}
                </div>
            </div>


        </div>
    );
}

void LegacyShadbalaDashboard;
