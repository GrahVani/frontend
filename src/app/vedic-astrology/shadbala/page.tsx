"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Info,
    CheckCircle2,
    Layers,
    Smile,
    Frown,
    Activity,
    Target,
    Gauge,
    Table2
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS } from '@/design-tokens/colors';
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

// ============================================================================
// Shadbala Page Component
// ============================================================================

export default function ShadbalaPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [error, setError] = useState<string | null>(null);
    
    const clientId = clientDetails?.id || '';

    // Standard Minimum Rupa Requirements
    const MIN_BALA_REQUIREMENTS: Record<string, number> = {
        'Sun': 6.5,
        'Moon': 6.0,
        'Mars': 5.0,
        'Mercury': 7.0,
        'Jupiter': 6.5,
        'Venus': 7.5,
        'Saturn': 5.0
    };

    /**
     * Normalizes complex Python engine response to clean frontend types
     */
    const normalizeShadbalaData = (raw: Record<string, Record<string, unknown>>): ShadbalaData => {
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
    };

    // Get Shadbala data from database (processedCharts)
    const shadbalaKey = `shadbala_${ayanamsa.toLowerCase()}`;
    const shadbalaRaw = processedCharts[shadbalaKey]?.chartData;
    const rawData = shadbalaRaw?.data || shadbalaRaw;
    
    // Normalize data for display
    const data: ShadbalaData | null = useMemo(() => {
        const raw = rawData as Record<string, Record<string, unknown>> | undefined;
        if (!raw || !raw.shadbala_virupas) return null;
        return normalizeShadbalaData(raw);
    }, [rawData]);
    
    const loading = !data && (isLoadingCharts || isRefreshingCharts);

    // Handle refresh - trigger page reload to refresh charts
    const handleRefresh = () => {
        window.location.reload();
    };

    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Orbit className="w-12 h-12 text-primary mb-4" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] mb-2")}>Shadbala Analysis — Lahiri Only</h2>
                <p className={cn(TYPOGRAPHY.profileDetail, "max-w-md")}>
                    Shadbala (Six-fold planetary strength) analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                </p>
                <Link href="/vedic-astrology/overview" className="mt-6 text-[14px] font-medium text-gold-dark hover:text-gold-primary transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Kundali
                </Link>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="-mt-2 lg:-mt-4 space-y-2 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px]")}>Shadbala</h1>
                </div>
                <div className="flex items-center gap-4">

                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 prem-card rounded-3xl">
                    <Loader2 className="w-10 h-10 text-gold-primary animate-spin mb-4" />
                    <p className={cn(TYPOGRAPHY.value, "italic tracking-wide")}>Calculating celestial potencies...</p>
                </div>
            ) : error ? (
                <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-center">
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
                <div className="p-10 prem-card rounded-2xl text-center lg:py-16">
                    <Orbit className="w-10 h-10 text-primary mx-auto mb-4" />
                    <p className={cn(TYPOGRAPHY.profileDetail)}>No Shadbala data found for this chart.</p>
                </div>
            )}
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
        <div className={cn("flex-1 w-full bg-gold-primary/5 rounded-full overflow-hidden shadow-inner", height)}>
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
// Radial Gauge Sub-component
// ============================================================================
function RadialGauge({ planet, rupaBala, minRequired, isStrong, color, rank }: {
    planet: string; rupaBala: number; minRequired: number; isStrong: boolean; color: string; rank: number;
}) {
    const size = 130;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2 - 8;
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
        const r2 = radius - strokeWidth / 2 - 4;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();
    const minTickOuter = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius + strokeWidth / 2 + 4;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center group"
        >
            <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <path d={describeArc(0, sweepAngle)} fill="none" stroke="var(--cream-light)" strokeWidth={strokeWidth} strokeLinecap="round" />
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
                    <line
                        x1={minTickInner.x} y1={minTickInner.y}
                        x2={minTickOuter.x} y2={minTickOuter.y}
                        stroke="var(--color-red-500)" strokeWidth={2.5} strokeLinecap="round"
                    />
                    <text x={center} y={center - 6} textAnchor="middle" dominantBaseline="central"
                        fontSize="24" fill={color} fontWeight="700" className="font-serif">
                        {PLANET_SYMBOLS[planet]}
                    </text>
                    <text x={center} y={center + 18} textAnchor="middle" dominantBaseline="central"
                        fontSize="13" fill="var(--text-primary)" fontWeight="800">
                        {rupaBala.toFixed(2)}
                    </text>
                    <text x={center} y={center + 32} textAnchor="middle" dominantBaseline="central"
                        fontSize="8" fill="var(--text-primary)" fontWeight="700" letterSpacing="1.5">
                        RUPA
                    </text>
                </svg>
            </div>
            <div className="mt-1 text-center">
                <p className={cn(TYPOGRAPHY.value, "text-[12px] tracking-tight")}>{planet}</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={cn(TYPOGRAPHY.label, "text-[9px] text-primary font-normal lowercase")}>#{rank}</span>
                    <span className={cn(
                        TYPOGRAPHY.label,
                        "px-1.5 py-0.5 rounded-full tracking-wider text-[8px]",
                        isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
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
function SubBalaBreakdownCard({ planet, axes, values, theme, idx }: {
    planet: ShadbalaPlanet;
    axes: { key: string; label: string }[];
    values: Record<string, number>;
    theme: { color: string; twBg: string; twText: string };
    idx: number;
}) {
    const localMax = Math.max(...axes.map(a => Math.abs(values[a.key] || 0)), 1);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="rounded-xl border p-3 transition-all hover:shadow-md"
            style={{ borderColor: `${theme.color}25`, background: `linear-gradient(135deg, ${theme.color}04, transparent)` }}
        >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gold-primary/5">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-sm", theme.twBg)}>
                    {PLANET_SYMBOLS[planet.planet]}
                </div>
                <h4 className={cn(TYPOGRAPHY.value, "text-[12px]")}>{planet.planet}</h4>
            </div>
            <div className="space-y-1.5">
                {axes.map(axis => {
                    const val = values[axis.key] || 0;
                    const isNegative = val < 0;
                    return (
                        <div key={axis.key} className="flex items-center gap-2">
                            <span className={cn(TYPOGRAPHY.label, "w-[65px] shrink-0 text-right font-normal lowercase text-[8.5px] opacity-70")}>
                                {axis.label}
                            </span>
                            <AnimatedBar value={val} maxVal={localMax} color={theme.color} isNegative={isNegative} height="h-[5px]" />
                            <span className={cn(
                                TYPOGRAPHY.subValue,
                                "w-[34px] text-right tabular-nums text-[8.5px]",
                                isNegative ? "text-rose-500" : "text-primary/70"
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
// Heatmap Cell Helper
// ============================================================================
function getHeatmapStyle(value: number, maxVal: number): { style: React.CSSProperties; indicator: string } {
    if (value < 0) {
        const intensity = Math.min(Math.abs(value) / 50, 1);
        return {
            style: { backgroundColor: `rgba(155, 44, 44, ${0.08 + intensity * 0.18})` },
            indicator: intensity > 0.5 ? '\u25BC' : '\u25BD',
        };
    }
    const intensity = Math.min(value / maxVal, 1);
    return {
        style: { backgroundColor: `rgba(156, 122, 47, ${0.06 + intensity * 0.20})` },
        indicator: intensity > 0.66 ? '\u25B2' : intensity > 0.33 ? '\u25B3' : '',
    };
}

// ============================================================================
// Enhanced Dashboard Sub-component
// ============================================================================

export function ShadbalaDashboard({ displayData }: { displayData: ShadbalaData }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    // Compute max values for heatmap scaling
    const tableMaxValues: Record<string, number> = {};
    BALA_AXES.forEach(axis => {
        tableMaxValues[axis.key] = Math.max(...displayData.planets.map(p => Math.abs((p as unknown as Record<string, number>)[axis.key] || 0)));
    });

    const strongestTheme = PLANET_THEMES[strongest.planet];
    const weakestTheme = PLANET_THEMES[weakest.planet];

    // Mini ring SVG for summary cards
    const MiniRing = ({ value, max, color }: { value: number; max: number; color: string }) => {
        const r = 22;
        const circumference = 2 * Math.PI * r;
        const pct = Math.min(value / max, 1);
        const dashOffset = circumference * (1 - pct);
        return (
            <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={r} fill="none" stroke="var(--cream-light)" strokeWidth="5" />
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
    };

    // Max Ishta/Kashta for scaling
    const maxIshtaKashta = Math.max(
        ...displayData.planets.map(p => Math.max(p.ishtaKashta.ishta, p.ishtaKashta.kashta)),
        1
    );

    // Max % of required for scaling
    const maxPctReq = Math.max(...displayData.planets.map(p => p.percentOfRequired), 1);

    return (
        <div className="space-y-5">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: Hero Summary Cards
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="prem-card p-4 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-emerald-500/10"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${strongestTheme.color}15, transparent)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.1em] text-[10px] opacity-70")}>Strongest Planet</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[28px]", strongestTheme.twText)}>{PLANET_SYMBOLS[strongest.planet]}</span>
                                <div>
                                    <span className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] block leading-none mb-1")}>{strongest.planet}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold rounded">#{strongest.rank}</span>
                                        <span className="text-[11px] font-medium text-emerald-600/80 tracking-tight">{strongest.percentOfRequired.toFixed(2)}× req</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 scale-90 md:scale-100">
                           <MiniRing value={strongest.percentOfRequired} max={2.5} color={strongestTheme.color} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="prem-card p-4 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-rose-500/10"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${weakestTheme.color}15, transparent)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.1em] text-[10px] opacity-70")}>Weakest Planet</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[28px]", weakestTheme.twText)}>{PLANET_SYMBOLS[weakest.planet]}</span>
                                <div>
                                    <span className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] block leading-none mb-1")}>{weakest.planet}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-500 text-[9px] font-bold rounded">#{weakest.rank}</span>
                                        <span className="text-[11px] font-medium text-rose-500/80 tracking-tight">{weakest.percentOfRequired.toFixed(2)}× req</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 scale-90 md:scale-100">
                            <MiniRing value={weakest.percentOfRequired} max={2.5} color={weakestTheme.color} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Summary Table (Moved Up)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 bg-surface-warm/5 flex items-center gap-2">
                    <Table2 className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Shadbala Summary</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comprehensive breakdown of all six planetary strength factors measured in Virupas.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Complete Strength Matrix</span>
                </div>
                <DataGrid
                    columns={[
                        {
                            key: 'planet',
                            header: 'Planet',
                            headerClassName: 'px-6',
                            cellClassName: 'px-6',
                            render: (row: ShadbalaPlanet) => {
                                const theme = PLANET_THEMES[row.planet];
                                return (
                                    <div className={cn(TYPOGRAPHY.value, "flex items-center gap-2 text-[14px]")}>
                                        <span className={cn(TYPOGRAPHY.profileName, "text-[16px]", theme.twText)}>{PLANET_SYMBOLS[row.planet]}</span>
                                        {row.planet}
                                    </div>
                                );
                            },
                        },
                        ...BALA_AXES.map(axis => ({
                            key: axis.key,
                            header: axis.label,
                            align: 'center' as const,
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px] tabular-nums"),
                            render: (row: ShadbalaPlanet) => {
                                const val = (row as unknown as Record<string, number>)[axis.key] || 0;
                                const { style, indicator } = getHeatmapStyle(val, tableMaxValues[axis.key]);
                                return (
                                    <span style={style} className="inline-flex items-center gap-0.5 px-1 rounded">
                                        {val.toFixed(0)}
                                        {indicator && <span className="text-[8px] opacity-70" aria-hidden="true">{indicator}</span>}
                                    </span>
                                );
                            },
                        })),
                        {
                            key: 'totalBala',
                            header: 'Virupas',
                            align: 'center' as const,
                            headerClassName: 'bg-gold-primary/5 text-gold-dark',
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px] text-gold-dark bg-gold-primary/5 tabular-nums"),
                            sortable: true,
                            render: (row: ShadbalaPlanet) => row.totalBala.toFixed(1),
                        },
                        {
                            key: 'rupaBala',
                            header: 'Rupas',
                            align: 'center' as const,
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px] tabular-nums"),
                            render: (row: ShadbalaPlanet) => row.rupaBala.toFixed(2),
                        },
                        {
                            key: 'rank',
                            header: 'Rank',
                            align: 'center' as const,
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px] tabular-nums"),
                            render: (row: ShadbalaPlanet) => `#${row.rank}`,
                        },
                        {
                            key: 'percentOfRequired',
                            header: '% Req',
                            align: 'center' as const,
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px] tabular-nums"),
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
                            cellClassName: cn(TYPOGRAPHY.value, "text-[12px]"),
                            render: (row: ShadbalaPlanet) => (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider",
                                    row.isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                )}>
                                    {row.isStrong ? "STRONG" : "WEAK"}
                                </span>
                            ),
                        },
                    ] satisfies DataGridColumn<ShadbalaPlanet>[]}
                    data={sortedPlanets}
                    rowKey={(row) => row.planet}
                    cellPadding="p-3"
                    headerClassName="bg-surface-warm/50 border-b border-gold-primary/15"
                    ariaLabel="Shadbala complete strength summary"
                    scrollShadows={true}
                />
            </div>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Ishta & Kashta Phala (Prominent)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Ishta & Kashta Phala</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p><b>Ishta Phala</b> represents beneficial strength (happiness, success).<br/><b>Kashta Phala</b> represents challenging strength (obstacles).</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Auspicious Ratio</span>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                        {sortedPlanets.map((p, idx) => {
                            const theme = PLANET_THEMES[p.planet];
                            const ishtaVal = p.ishtaKashta.ishta;
                            const kashtaVal = p.ishtaKashta.kashta;
                            const total = Math.max(ishtaVal + kashtaVal, 1);
                            const ishtaWidth = (ishtaVal / total) * 100;
                            const isIshtaDominant = ishtaVal > kashtaVal;

                            return (
                                <motion.div
                                    key={`phala-${p.planet}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="flex flex-col items-center group"
                                >
                                    {/* Planet badge */}
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-[14px] font-bold shadow-sm mb-2", theme.twBg)}>
                                        {PLANET_SYMBOLS[p.planet]}
                                    </div>
                                    <span className={cn(TYPOGRAPHY.value, "text-[11px] mb-1")}>{p.planet}</span>

                                    {/* Vertical stacked bar */}
                                    <div className="w-full h-28 flex flex-col rounded-xl overflow-hidden shadow-inner border border-gold-primary/10">
                                        <motion.div
                                            className="w-full bg-gradient-to-b from-emerald-400 to-emerald-500 flex items-center justify-center"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${ishtaWidth}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        >
                                            <span className="text-white text-[10px] font-bold drop-shadow">{ishtaVal.toFixed(1)}</span>
                                        </motion.div>
                                        <div className="w-full flex-1 bg-gradient-to-b from-rose-400 to-red-500 flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold drop-shadow">{kashtaVal.toFixed(1)}</span>
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 pt-3 border-t border-gold-primary/10 mt-3">
                        <div className="flex items-center gap-1.5 grayscale-[0.5] hover:grayscale-0 transition-all">
                            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-sm" />
                            <span className={cn(TYPOGRAPHY.label, "text-primary font-medium lowercase text-[10px]")}>Ishta (Auspicious)</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale-[0.5] hover:grayscale-0 transition-all">
                            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-rose-400 to-red-500 shadow-sm" />
                            <span className={cn(TYPOGRAPHY.label, "text-primary font-medium lowercase text-[10px]")}>Kashta (Inauspicious)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: Six-Fold Strength Profile (Per Planet Cards)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-gold-primary" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Six-Fold Strength Profile</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Vertical analysis of the 6 primary strength components for each planet.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Systemic Potency</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sortedPlanets.map((p, idx) => {
                        const theme = PLANET_THEMES[p.planet];
                        const balas = BALA_AXES.map(axis => ({
                            label: axis.shortLabel,
                            value: (p as unknown as Record<string, number>)[axis.key] || 0,
                        }));
                        const localMax = Math.max(...balas.map(b => Math.abs(b.value)), 1);

                        return (
                            <motion.div
                                key={`profile-${p.planet}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                className="rounded-2xl border p-4 transition-all hover:shadow-md"
                                style={{ borderColor: `${theme.color}30`, background: `linear-gradient(135deg, ${theme.color}04, transparent)` }}
                            >
                                {/* Planet Header */}
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gold-primary/5">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shadow-sm", theme.twBg)}>
                                            {PLANET_SYMBOLS[p.planet]}
                                        </div>
                                        <div>
                                            <h4 className={cn(TYPOGRAPHY.value, "text-[12px] leading-none mb-0.5")}>{p.planet}</h4>
                                            <p className={cn(TYPOGRAPHY.label, "text-[8.5px] lowercase font-medium opacity-60")}>
                                                {p.rupaBala.toFixed(2)} Rupa · #{p.rank}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider",
                                        p.isStrong ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                        {p.isStrong ? "STRONG" : "WEAK"}
                                    </span>
                                </div>

                                {/* 6 Bala Bars */}
                                <div className="space-y-1.5">
                                    {balas.map((bala, bIdx) => {
                                        const isNegative = bala.value < 0;
                                        const axisInfo = BALA_AXES[bIdx];
                                        return (
                                            <div key={bala.label} className="flex items-center gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className={cn(TYPOGRAPHY.label, "w-[58px] shrink-0 text-right font-medium lowercase text-[9px] border-b border-dotted border-gold-primary/20 hover:text-gold-primary cursor-help transition-colors")}>
                                                                {bala.label}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p><b>{axisInfo.label} Bala</b>: {axisInfo.desc}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <AnimatedBar value={bala.value} maxVal={localMax} color={theme.color} isNegative={isNegative} />
                                                <span className={cn(
                                                    TYPOGRAPHY.subValue,
                                                    "w-[30px] text-right tabular-nums text-[9.5px] font-bold",
                                                    isNegative ? "text-rose-500" : "text-primary/70"
                                                )}>
                                                    {bala.value.toFixed(0)}
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
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Sthana Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deep dive into the 5 sub-components of Positional Strength.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Positional Details</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sortedPlanets.map((p, idx) => (
                        <SubBalaBreakdownCard
                            key={`sthana-${p.planet}`}
                            planet={p}
                            axes={STHANA_SUB_AXES}
                            values={p.sthanaSubBalas as unknown as Record<string, number>}
                            theme={PLANET_THEMES[p.planet]}
                            idx={idx}
                        />
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 6: Kala Bala Breakdown
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Kala Bala Breakdown</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Deep dive into the 8 sub-components of Temporal Strength.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Temporal Details</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sortedPlanets.map((p, idx) => (
                        <SubBalaBreakdownCard
                            key={`kala-${p.planet}`}
                            planet={p}
                            axes={KALA_SUB_AXES}
                            values={p.kalaSubBalas as unknown as Record<string, number>}
                            theme={PLANET_THEMES[p.planet]}
                            idx={idx}
                        />
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7: Percentage of Required Strength
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Required Strength %</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comparison of actual strength against the Shastric minimum requirement.<br/>Ratio ≥ 1.0 means the planet is functionally strong.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Efficiency Ratio</span>
                </div>
                <div className="p-4 space-y-2">
                    {sortedPlanets.map((p, idx) => {
                        const theme = PLANET_THEMES[p.planet];
                        const pct = p.percentOfRequired;
                        const meetsMin = pct >= 1.0;
                        // Scale bar to maxPctReq for visual consistency
                        const barWidth = Math.min((pct / maxPctReq) * 100, 100);
                        // Position of 1.0x threshold line
                        const thresholdPos = Math.min((1.0 / maxPctReq) * 100, 100);

                        return (
                            <motion.div
                                key={`pct-${p.planet}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm", theme.twBg)}>
                                    {PLANET_SYMBOLS[p.planet]}
                                </div>
                                <span className={cn(TYPOGRAPHY.value, "w-[50px] shrink-0 text-[11px]")}>{p.planet}</span>
                                <div className="flex-1 relative h-3.5">
                                    <div className="h-full w-full bg-gold-primary/5 rounded-full overflow-hidden shadow-inner">
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
                                    >
                                        <span className="absolute -top-3.5 -translate-x-1/2 text-[7px] font-bold text-copper-900/60 uppercase tracking-tighter">Min. Required</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    TYPOGRAPHY.value,
                                    "w-[42px] text-right tabular-nums text-[11px] font-bold",
                                    meetsMin ? "text-emerald-600" : "text-rose-500"
                                )}>
                                    {pct.toFixed(2)}×
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8: Radial Gauge Meters
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gold-primary/15 flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-gold-primary" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[10px] leading-none opacity-80 uppercase tracking-widest")}>Rupa Strength Overview</h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-3 h-3 text-gold-primary cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Planetary strength measured in Rupas (1 Rupa = 60 Virupas).<br/>The red tick marks the minimum required threshold.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wide text-[9px]")}>Vigor Gauges</span>
                </div>
                <div className="p-4 flex flex-wrap items-center justify-center gap-2 md:gap-4">
                    {sortedPlanets.map((p) => {
                        const theme = PLANET_THEMES[p.planet];
                        const minRequiredRupa = p.minBalaRequired / 60;
                        return (
                            <div key={`gauge-wrapper-${p.planet}`} className="scale-90 lg:scale-100 origin-center">
                                <RadialGauge
                                    planet={p.planet}
                                    rupaBala={p.rupaBala}
                                    minRequired={minRequiredRupa}
                                    isStrong={p.isStrong}
                                    color={theme.color}
                                    rank={p.rank}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
}
