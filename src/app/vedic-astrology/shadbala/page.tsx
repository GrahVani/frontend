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

// Bala axis labels
const BALA_AXES = [
    { key: 'sthalaBala', label: 'Sthana', shortLabel: 'Positional' },
    { key: 'digBala', label: 'Dig', shortLabel: 'Directional' },
    { key: 'kalaBala', label: 'Kala', shortLabel: 'Temporal' },
    { key: 'cheshtaBala', label: 'Cheshta', shortLabel: 'Motional' },
    { key: 'naisargikaBala', label: 'Naisargik', shortLabel: 'Natural' },
    { key: 'drikBala', label: 'Drik', shortLabel: 'Aspectual' },
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
function AnimatedBar({ value, maxVal, color, isNegative, height = 'h-[7px]' }: {
    value: number; maxVal: number; color: string; isNegative?: boolean; height?: string;
}) {
    const barWidth = Math.min((Math.abs(value) / Math.max(maxVal, 1)) * 100, 100);
    return (
        <div className={cn("flex-1 w-full bg-gold-primary/8 rounded-full overflow-hidden", height)}>
            <motion.div
                className={cn("h-full rounded-full")}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    backgroundColor: isNegative ? 'var(--color-red-500, #ef4444)' : color,
                    opacity: isNegative ? 0.7 : 0.85,
                }}
            />
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
            className="rounded-2xl border p-4 transition-all hover:shadow-md"
            style={{ borderColor: `${theme.color}30`, background: `linear-gradient(135deg, ${theme.color}04, transparent)` }}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center text-white text-[12px] font-bold shadow-sm", theme.twBg)}>
                    {PLANET_SYMBOLS[planet.planet]}
                </div>
                <h4 className={cn(TYPOGRAPHY.value, "text-[13px]")}>{planet.planet}</h4>
            </div>
            <div className="space-y-2">
                {axes.map(axis => {
                    const val = values[axis.key] || 0;
                    const isNegative = val < 0;
                    return (
                        <div key={axis.key} className="flex items-center gap-2">
                            <span className={cn(TYPOGRAPHY.label, "w-[70px] shrink-0 text-right font-normal lowercase text-[9px]")}>
                                {axis.label}
                            </span>
                            <AnimatedBar value={val} maxVal={localMax} color={theme.color} isNegative={isNegative} />
                            <span className={cn(
                                TYPOGRAPHY.subValue,
                                "w-[36px] text-right tabular-nums text-[9px]",
                                isNegative ? "text-rose-500" : "text-primary"
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
                    className="prem-card p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${strongestTheme.color}10, ${strongestTheme.color}05)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.15em]")}>Strongest</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[24px]", strongestTheme.twText)}>{PLANET_SYMBOLS[strongest.planet]}</span>
                                <span className={cn(TYPOGRAPHY.sectionTitle, "text-[20px]")}>{strongest.planet}</span>
                            </div>
                            <p className={cn(TYPOGRAPHY.label, "text-emerald-600 mt-1 lowercase")}>
                                {strongest.percentOfRequired.toFixed(2)}× Strength · Rank #{strongest.rank}
                            </p>
                        </div>
                        <MiniRing value={strongest.percentOfRequired} max={2} color={strongestTheme.color} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="prem-card p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[60px] -mr-4 -mt-4 transition-all group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${weakestTheme.color}10, ${weakestTheme.color}05)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.15em]")}>Weakest</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(TYPOGRAPHY.profileName, "text-[24px]", weakestTheme.twText)}>{PLANET_SYMBOLS[weakest.planet]}</span>
                                <span className={cn(TYPOGRAPHY.sectionTitle, "text-[20px]")}>{weakest.planet}</span>
                            </div>
                            <p className={cn(TYPOGRAPHY.label, "text-rose-500 mt-1 lowercase")}>
                                {weakest.percentOfRequired.toFixed(2)}× Strength · Rank #{weakest.rank}
                            </p>
                        </div>
                        <MiniRing value={weakest.percentOfRequired} max={2} color={weakestTheme.color} />
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Summary Table (Moved Up)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 bg-surface-warm/5 flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Shadbala Summary</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Complete planetary strength overview</span>
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
                    cellPadding="p-4"
                    headerClassName="bg-surface-warm/50 border-b border-gold-primary/15"
                    ariaLabel="Shadbala complete strength summary"
                    scrollShadows={true}
                />
            </div>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Ishta & Kashta Phala (Prominent)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Ishta & Kashta Phala</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Auspicious vs Inauspicious strength</span>
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
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gold-primary/10 mt-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-500" />
                            <span className={cn(TYPOGRAPHY.label, "text-primary font-normal lowercase")}>Ishta (Auspicious)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-rose-400 to-red-500" />
                            <span className={cn(TYPOGRAPHY.label, "text-primary font-normal lowercase")}>Kashta (Inauspicious)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: Six-Fold Strength Profile (Per Planet Cards)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-gold-primary" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Six-Fold Strength Profile</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Sthana · Dig · Kala · Cheshta · Naisargik · Drik</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white text-[14px] font-bold shadow-sm", theme.twBg)}>
                                            {PLANET_SYMBOLS[p.planet]}
                                        </div>
                                        <div>
                                            <h4 className={cn(TYPOGRAPHY.value, "text-[14px]")}>{p.planet}</h4>
                                            <p className={cn(TYPOGRAPHY.label, "text-[9px] lowercase", theme.twText)}>
                                                {p.rupaBala.toFixed(2)} Rupa · #{p.rank}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        TYPOGRAPHY.label,
                                        "px-1.5 py-0.5 rounded-full text-[8px]",
                                        p.isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        {p.isStrong ? "STRONG" : "WEAK"}
                                    </span>
                                </div>

                                {/* 6 Bala Bars */}
                                <div className="space-y-2">
                                    {balas.map((bala) => {
                                        const isNegative = bala.value < 0;
                                        return (
                                            <div key={bala.label} className="flex items-center gap-2">
                                                <span className={cn(TYPOGRAPHY.label, "w-[62px] shrink-0 text-right font-normal lowercase")}>
                                                    {bala.label}
                                                </span>
                                                <AnimatedBar value={bala.value} maxVal={localMax} color={theme.color} isNegative={isNegative} />
                                                <span className={cn(
                                                    TYPOGRAPHY.subValue,
                                                    "w-[32px] text-right tabular-nums",
                                                    isNegative ? "text-rose-500" : "text-primary"
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
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Sthana Bala Breakdown</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Positional strength sub-components</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Kala Bala Breakdown</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Temporal strength sub-components</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Percentage of Required Strength</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Ratio ≥ 1.0 = meets minimum</span>
                </div>
                <div className="p-5 space-y-3">
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
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm", theme.twBg)}>
                                    {PLANET_SYMBOLS[p.planet]}
                                </div>
                                <span className={cn(TYPOGRAPHY.value, "w-[60px] shrink-0 text-[12px]")}>{p.planet}</span>
                                <div className="flex-1 relative">
                                    <div className="h-4 w-full bg-gold-primary/8 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barWidth}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            style={{
                                                background: meetsMin
                                                    ? `linear-gradient(90deg, ${theme.color}cc, ${theme.color})`
                                                    : `linear-gradient(90deg, #f59e0bcc, #ef4444)`,
                                            }}
                                        />
                                    </div>
                                    {/* 1.0x threshold line */}
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-primary"
                                        style={{ left: `${thresholdPos}%` }}
                                    >
                                        <span className="absolute -top-4 -translate-x-1/2 text-[8px] font-bold text-primary">1.0×</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    TYPOGRAPHY.value,
                                    "w-[40px] text-right tabular-nums text-[12px]",
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
            <div className="prem-card rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-gold-primary" />
                    <h3 className={cn(TYPOGRAPHY.label, "md:text-[11px] leading-none")}>Rupa Strength Overview</h3>
                    <span className={cn(TYPOGRAPHY.label, "ml-auto text-primary font-normal lowercase tracking-wider")}>Red tick = min. required</span>
                </div>
                <div className="p-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {sortedPlanets.map((p) => {
                        const theme = PLANET_THEMES[p.planet];
                        const minRequiredRupa = p.minBalaRequired / 60;
                        return (
                            <RadialGauge
                                key={`gauge-${p.planet}`}
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
