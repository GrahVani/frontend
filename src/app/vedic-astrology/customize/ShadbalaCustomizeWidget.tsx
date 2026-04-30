"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Table2,
    BarChart3,
    PieChart,
    Gauge,
    Percent,
    TrendingUp,
    TrendingDown,
    ArrowUpDown,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { PLANET_COLORS } from '@/design-tokens/colors';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

interface ShadbalaPlanetData {
    planet: string;
    sthalaBala: number;
    digBala: number;
    kalaBala: number;
    cheshtaBala: number;
    naisargikaBala: number;
    drikBala: number;
    totalBala: number;    // virupas
    rupaBala: number;
    minBalaRequired: number;
    ratio: number;
    rank: number;
    isStrong: boolean;
    percentOfRequired: number;
    ishtaKashta: { ishta: number; kashta: number };
    sthanaSubBalas?: Record<string, number>;
    kalaSubBalas?: Record<string, number>;
}

interface ShadbalaDisplayData {
    planets: ShadbalaPlanetData[];
    ayanamsa: string;
    system: string;
    userName: string;
    raw?: Record<string, unknown>;
}

export type ShadbalaViewTab = 'table' | 'percentage' | 'bar' | 'pie' | 'gauge';

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa'
};

const BALA_AXES = [
    { key: 'sthalaBala', label: 'Sthana', shortLabel: 'Positional', color: '#F59E0B' },
    { key: 'digBala', label: 'Dig', shortLabel: 'Directional', color: '#3B82F6' },
    { key: 'kalaBala', label: 'Kala', shortLabel: 'Temporal', color: '#8B5CF6' },
    { key: 'cheshtaBala', label: 'Cheshta', shortLabel: 'Motional', color: '#10B981' },
    { key: 'naisargikaBala', label: 'Naisargik', shortLabel: 'Natural', color: '#EC4899' },
    { key: 'drikBala', label: 'Drik', shortLabel: 'Aspectual', color: '#06B6D4' },
];

const TABS: { id: ShadbalaViewTab; label: string; icon: React.ElementType; tip: string }[] = [
    { id: 'table', label: 'Table', icon: Table2, tip: 'Summary Table' },
    { id: 'percentage', label: 'Strength', icon: Percent, tip: 'Percentage of Required' },
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, tip: 'Stacked Bar' },
    { id: 'pie', label: 'Composition', icon: PieChart, tip: 'Strength Composition' },
    { id: 'gauge', label: 'Gauges', icon: Gauge, tip: 'Radial Meters' },
];

function getPlanetHex(planet: string): string {
    return PLANET_COLORS[planet]?.hex || '#9C7A2F';
}



// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ShadbalaCustomizeWidget({ displayData }: { displayData: ShadbalaDisplayData }) {
    const [activeTab, setActiveTab] = useState<ShadbalaViewTab>('table');
    const [sortKey, setSortKey] = useState<string>('rank');
    const [sortAsc, setSortAsc] = useState(true);

    const sortedPlanets = useMemo(() => {
        const arr = [...displayData.planets];
        arr.sort((a, b) => {
            const valA = (a as unknown as Record<string, number>)[sortKey] ?? 0;
            const valB = (b as unknown as Record<string, number>)[sortKey] ?? 0;
            return sortAsc ? valA - valB : valB - valA;
        });
        return arr;
    }, [displayData.planets, sortKey, sortAsc]);

    const strongest = useMemo(() =>
        [...displayData.planets].sort((a, b) => a.rank - b.rank)[0],
        [displayData.planets]
    );
    const weakest = useMemo(() =>
        [...displayData.planets].sort((a, b) => b.rank - a.rank)[0],
        [displayData.planets]
    );

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(key === 'rank');
        }
    };

    if (!strongest || !weakest) return null;

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* ── Hero Badges ── */}
            <div className="flex items-stretch gap-1.5 px-3 pt-3 pb-0.5 shrink-0">
                <HeroBadge planet={strongest} type="strongest" />
                <HeroBadge planet={weakest} type="weakest" />
            </div>

            {/* ── Tab Navigation ── */}
            <div className="flex items-center gap-0.5 px-3 pt-2 pb-1 shrink-0 border-b border-amber-200/40">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={tab.tip}
                            className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-t-lg text-[9px] font-medium tracking-wider transition-all",
                                isActive
                                    ? "bg-white text-amber-900 border border-amber-200/60 border-b-white shadow-sm -mb-px z-10"
                                    : "text-amber-900/50 hover:text-amber-900/80 hover:bg-amber-50/50"
                            )}
                        >
                            <Icon className="w-3 h-3" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Content Area ── */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                {activeTab === 'table' && (
                    <TableView
                        planets={sortedPlanets}
                        sortKey={sortKey}
                        sortAsc={sortAsc}
                        onSort={handleSort}
                    />
                )}
                {activeTab === 'percentage' && (
                    <PercentageView planets={sortedPlanets} />
                )}
                {activeTab === 'bar' && (
                    <BarChartView planets={displayData.planets} />
                )}
                {activeTab === 'pie' && (
                    <PieChartView planets={displayData.planets} />
                )}
                {activeTab === 'gauge' && (
                    <GaugeView planets={displayData.planets} />
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO BADGES (Strongest / Weakest)
// ═══════════════════════════════════════════════════════════════════════════════

function HeroBadge({ planet, type }: { planet: ShadbalaPlanetData; type: 'strongest' | 'weakest' }) {
    const isStrongest = type === 'strongest';
    const hex = getPlanetHex(planet.planet);

    return (
        <div className={cn(
            "flex-1 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition-shadow hover:shadow-md",
            isStrongest
                ? "bg-emerald-50/80 border-emerald-200/60"
                : "bg-rose-50/80 border-rose-200/60"
        )}>
            <div className="flex items-center gap-1">
                {isStrongest
                    ? <TrendingUp className="w-3 h-3 text-emerald-600" />
                    : <TrendingDown className="w-3 h-3 text-rose-500" />
                }
                <span className={cn(
                    "text-[8px] font-bold tracking-widest",
                    isStrongest ? "text-emerald-700" : "text-rose-700"
                )}>
                    {isStrongest ? 'Strongest' : 'Weakest'}
                </span>
            </div>
            <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0"
                style={{ backgroundColor: hex }}
            >
                {PLANET_SYMBOLS[planet.planet]}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-primary truncate leading-tight">{planet.planet}</p>
                <p className={cn(
                    "text-[9px] font-medium",
                    isStrongest ? "text-emerald-600" : "text-rose-500"
                )}>
                    {planet.percentOfRequired.toFixed(2)}× · #{planet.rank}
                </p>
            </div>
            {/* Mini ring */}
            <MiniRing
                value={planet.percentOfRequired}
                max={2}
                color={hex}
                size={36}
            />
        </div>
    );
}

function MiniRing({ value, max, color, size = 36 }: { value: number; max: number; color: string; size?: number }) {
    const r = size * 0.35;
    const circumference = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const dashOffset = circumference * (1 - pct);
    const cx = size / 2;
    const cy = size / 2;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 ml-auto">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8DCC8" strokeWidth={3} />
            <motion.circle
                cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={3}
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 3px ${color}40)` }}
            />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                fontSize={size * 0.22} fontWeight="600" fill={color}>
                {value.toFixed(1)}×
            </text>
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: SUMMARY TABLE
// ═══════════════════════════════════════════════════════════════════════════════

function TableView({ planets, sortKey, sortAsc, onSort }: {
    planets: ShadbalaPlanetData[];
    sortKey: string;
    sortAsc: boolean;
    onSort: (key: string) => void;
}) {
    // Compute max values for heatmap
    const maxValues = useMemo(() => {
        const m: Record<string, number> = {};
        BALA_AXES.forEach(axis => {
            m[axis.key] = Math.max(...planets.map(p => Math.abs((p as unknown as Record<string, number>)[axis.key] || 0)), 1);
        });
        return m;
    }, [planets]);

    const columns = [
        { key: 'planet', label: 'Planet', align: 'left' as const, width: 'w-20' },
        ...BALA_AXES.map(a => ({ key: a.key, label: a.label, align: 'center' as const, width: 'w-14' })),
        { key: 'totalBala', label: 'Virupas', align: 'center' as const, width: 'w-14', highlight: true },
        { key: 'rupaBala', label: 'Rupas', align: 'center' as const, width: 'w-14' },
        { key: 'rank', label: 'Rank', align: 'center' as const, width: 'w-10' },
        { key: 'percentOfRequired', label: 'Required', align: 'center' as const, width: 'w-14' },
    ];

    return (
        <div className="p-2">
            <div className="overflow-x-auto">
                <table className="w-full text-[10px] border-collapse">
                    <thead>
                        <tr className="bg-amber-50/70 border-b border-amber-200/30">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.key !== 'planet' && onSort(col.key)}
                                    className={cn(
                                        "py-1 px-1.5 font-bold tracking-wider text-amber-900 whitespace-nowrap",
                                        col.align === 'center' ? 'text-center' : 'text-left',
                                        col.key !== 'planet' && "cursor-pointer hover:text-amber-950 select-none",
                                        col.width,
                                    )}
                                >
                                    <span className="inline-flex items-center gap-0.5">
                                        {col.label}
                                        {sortKey === col.key && (
                                            <ArrowUpDown className="w-2.5 h-2.5 text-amber-600" />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {planets.map((p, idx) => {
                            const hex = getPlanetHex(p.planet);
                            return (
                                <motion.tr
                                    key={p.planet}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="border-b border-amber-200/30 hover:bg-amber-50/20 transition-colors"
                                >
                                    {/* Planet */}
                                    <td className="py-1 px-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                                                style={{ backgroundColor: hex }}
                                            >
                                                {PLANET_SYMBOLS[p.planet]}
                                            </div>
                                            <span className="font-medium text-primary text-[11px]">{p.planet}</span>
                                        </div>
                                    </td>

                                    {/* Six Bala Values with heatmap */}
                                    {BALA_AXES.map(axis => {
                                        const val = (p as unknown as Record<string, number>)[axis.key] || 0;
                                        const intensity = Math.min(Math.abs(val) / maxValues[axis.key], 1);
                                        const isNeg = val < 0;
                                        return (
                                            <td key={axis.key} className="py-1 px-1 text-center">
                                                <span
                                                    className={cn(
                                                        "font-mono tabular-nums font-medium text-[9px]",
                                                        isNeg ? "text-red-600" : "text-primary"
                                                    )}
                                                >
                                                    {val.toFixed(0)}
                                                </span>
                                            </td>
                                        );
                                    })}

                                    {/* Virupas */}
                                    <td className="py-1.5 px-1 text-center">
                                        <span className="font-medium text-amber-900 tabular-nums">
                                            {p.totalBala.toFixed(0)}
                                        </span>
                                    </td>

                                    {/* Rupas */}
                                    <td className="py-1.5 px-1 text-center font-medium tabular-nums text-primary">
                                        {p.rupaBala.toFixed(2)}
                                    </td>

                                    {/* Rank */}
                                    <td className="py-1.5 px-1 text-center font-medium tabular-nums text-primary/60">
                                        #{p.rank}
                                    </td>

                                    {/* % Required */}
                                    <td className="py-1.5 px-1 text-center">
                                        <span className={cn(
                                            "font-medium tabular-nums text-[9px]",
                                            p.percentOfRequired >= 1.0
                                                ? "text-emerald-600"
                                                : p.percentOfRequired >= 0.8
                                                    ? "text-amber-600"
                                                    : "text-rose-600"
                                        )}>
                                            {p.percentOfRequired.toFixed(2)}×
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Ishta · Kashta Phala — Prominent Section ── */}
            <div className="mt-2 pt-2 border-t-2 border-amber-200/20">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-500 to-rose-500 flex items-center justify-center">
                        <span className="text-[7px] text-white font-bold">i/k</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-primary leading-none">Ishta & Kashta Phala</p>
                        <p className="text-[7px] text-primary mt-0.5 opacity-70">Higher Ishta = planet delivers auspicious results</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2.5 text-[7px]">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded-sm bg-gradient-to-r from-emerald-400 to-emerald-500" /> Ishta</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded-sm bg-gradient-to-r from-rose-400 to-rose-500" /> Kashta</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    {planets.map((p, idx) => {
                        const hex = getPlanetHex(p.planet);
                        const ishta = p.ishtaKashta.ishta;
                        const kashta = p.ishtaKashta.kashta;
                        const total = Math.max(ishta + kashta, 1);
                        const ishtaPct = (ishta / total) * 100;
                        const isIshtaDominant = ishta > kashta;

                        return (
                            <motion.div
                                key={`ik-${p.planet}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.03 }}
                                className="flex items-center gap-2 py-0.5 group hover:bg-amber-50/30 rounded-lg px-1 transition-colors"
                            >
                                {/* Planet badge */}
                                <div
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-sm"
                                    style={{ backgroundColor: hex }}
                                >
                                    {PLANET_SYMBOLS[p.planet]}
                                </div>
                                <span className="text-[10px] font-medium text-primary w-14 shrink-0 truncate">{p.planet}</span>

                                {/* Ishta value */}
                                <span className="text-[10px] font-medium tabular-nums text-emerald-600 w-8 text-right shrink-0">
                                    {ishta.toFixed(0)}
                                </span>

                                {/* Dual bar */}
                                <div className="flex-1 h-4 rounded-full overflow-hidden flex shadow-inner border border-amber-200/30">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center transition-all"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${ishtaPct}%` }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                    >
                                        {ishtaPct > 25 && (
                                            <span className="text-[8px] text-white font-bold drop-shadow-sm">{ishtaPct.toFixed(0)}%</span>
                                        )}
                                    </motion.div>
                                    <div className="h-full flex-1 bg-gradient-to-r from-rose-400 to-rose-500 flex items-center justify-center">
                                        {ishtaPct < 75 && (
                                            <span className="text-[8px] text-white font-bold drop-shadow-sm">{(100 - ishtaPct).toFixed(0)}%</span>
                                        )}
                                    </div>
                                </div>

                                {/* Kashta value */}
                                <span className="text-[10px] font-medium tabular-nums text-rose-500 w-8 shrink-0">
                                    {kashta.toFixed(0)}
                                </span>

                                {/* Dominance indicator */}
                                <span className={cn(
                                    "text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded-full shrink-0 w-12 text-center",
                                    isIshtaDominant
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-rose-50 text-rose-700"
                                )}>
                                    {isIshtaDominant ? '✓ Good' : '⚠ Hard'}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: PERCENTAGE STRENGTH VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function PercentageView({ planets }: { planets: ShadbalaPlanetData[] }) {
    const maxPct = Math.max(...planets.map(p => p.percentOfRequired), 1.5);

    // Sort by ratio descending for this view
    const sorted = useMemo(() =>
        [...planets].sort((a, b) => b.percentOfRequired - a.percentOfRequired),
        [planets]
    );

    const thresholdPos = Math.min((1.0 / maxPct) * 100, 100);

    return (
        <div className="p-2 space-y-0.5">
            <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[8px] font-medium tracking-wider text-primary/70 uppercase">
                    Actual vs Required Strength
                </p>
                <div className="flex items-center gap-2 text-[7px]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ≥ 1.0×</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 0.8–1.0×</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> &lt; 0.8×</span>
                </div>
            </div>

            {sorted.map((p, idx) => {
                const hex = getPlanetHex(p.planet);
                const pct = p.percentOfRequired;
                const barWidth = Math.min((pct / maxPct) * 100, 100);
                const meetsMin = pct >= 1.0;

                return (
                    <motion.div
                        key={p.planet}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="flex items-center gap-2 py-0.5 px-1 hover:bg-amber-50/50 rounded-md transition-colors"
                    >
                        {/* Planet badge */}
                        <div
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-sm"
                            style={{ backgroundColor: hex }}
                        >
                            {PLANET_SYMBOLS[p.planet]}
                        </div>
                        <span className="text-[10px] font-medium text-primary w-14 shrink-0">{p.planet}</span>

                        {/* Bar */}
                        <div className="flex-1 relative h-4">
                            <div className="absolute inset-0 bg-amber-50/50 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{
                                        background: meetsMin
                                            ? `linear-gradient(90deg, ${hex}cc, ${hex})`
                                            : pct >= 0.8
                                                ? `linear-gradient(90deg, #F59E0Bcc, #F59E0B)`
                                                : `linear-gradient(90deg, #EF4444cc, #EF4444)`,
                                    }}
                                />
                            </div>
                            {/* 1.0× threshold line */}
                            <div
                                className="absolute top-0 bottom-0 w-px bg-primary/30"
                                style={{ left: `${thresholdPos}%` }}
                            >
                                {idx === 0 && (
                                    <span className="absolute -top-3.5 -translate-x-1/2 text-[7px] font-bold text-primary/50 whitespace-nowrap">
                                        1.0× min
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Value */}
                        <span className={cn(
                            "text-[10px] font-medium tabular-nums w-10 text-right shrink-0",
                            meetsMin ? "text-emerald-600" : pct >= 0.8 ? "text-amber-600" : "text-rose-600"
                        )}>
                            {pct.toFixed(2)}×
                        </span>

                        {/* Status pill */}
                        <span className={cn(
                            "text-[6px] font-bold tracking-wider px-1.5 py-0.5 rounded-full shrink-0 uppercase",
                            meetsMin
                                ? "bg-emerald-50 text-emerald-700"
                                : pct >= 0.8
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                        )}>
                            {meetsMin ? 'Strong' : pct >= 0.8 ? 'Fair' : 'Weak'}
                        </span>
                    </motion.div>
                );
            })}

            {/* Rupas summary at bottom */}
            <div className="mt-3 pt-2 border-t border-amber-200/40 grid grid-cols-7 gap-1">
                {sorted.map(p => (
                    <div key={`rupa-${p.planet}`} className="text-center">
                        <span className="text-[8px] font-medium text-primary block">{PLANET_SYMBOLS[p.planet]}</span>
                        <span className="text-[10px] font-medium text-primary block">{p.rupaBala.toFixed(2)}</span>
                        <span className="text-[7px] text-primary">rupa</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: CLASSIC VERTICAL BAR CHART (pure SVG)
// ═══════════════════════════════════════════════════════════════════════════════

function BarChartView({ planets }: { planets: ShadbalaPlanetData[] }) {
    const sorted = useMemo(() => [...planets].sort((a, b) => a.rank - b.rank), [planets]);

    // Chart layout - Optimized for Wide Viewports
    const svgW = 1120;
    const svgH = 240;
    const marginL = 50;
    const marginR = 20;
    const marginT = 25;
    const marginB = 50;
    const chartW = svgW - marginL - marginR;
    const chartH = svgH - marginT - marginB;

    const maxVal = Math.max(...sorted.map(p => p.totalBala), 1);
    // Round up to nearest 100 for clean gridlines
    const yMax = Math.ceil(maxVal / 100) * 100;

    const barCount = sorted.length;
    const barGroupW = chartW / barCount;
    const barW = Math.min(barGroupW * 0.55, 52);

    // Y-axis ticks (5 steps)
    const yTickCount = 5;
    const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round((yMax / yTickCount) * i));

    return (
        <div className="p-2 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 px-1 shrink-0">
                <p className="text-[8px] font-medium tracking-wider text-primary/70 uppercase">
                    Total Strength Comparison (Virupas)
                </p>
                <span className="text-[7px] text-primary/50 uppercase tracking-tighter">Ranked by strength</span>
            </div>

            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full flex-1 min-h-0">
                {/* Definitions — bar gradients */}
                <defs>
                    {sorted.map(p => {
                        const hex = getPlanetHex(p.planet);
                        return (
                            <linearGradient key={`grad-${p.planet}`} id={`barGrad-${p.planet}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={hex} stopOpacity={0.95} />
                                <stop offset="100%" stopColor={hex} stopOpacity={0.65} />
                            </linearGradient>
                        );
                    })}
                </defs>

                {/* Y-axis gridlines + labels */}
                {yTicks.map((tick, i) => {
                    const y = marginT + chartH - (tick / yMax) * chartH;
                    return (
                        <g key={`yt-${i}`}>
                            <line
                                x1={marginL} y1={y} x2={svgW - marginR} y2={y}
                                stroke={i === 0 ? '#C4B89A' : '#E8DCC8'}
                                strokeWidth={i === 0 ? 1 : 0.5}
                                strokeDasharray={i === 0 ? 'none' : '4,3'}
                            />
                            <text x={marginL - 6} y={y + 3} textAnchor="end"
                                fontSize={9} fill="#9C7A2F" fontWeight="600" fontFamily="system-ui">
                                {tick}
                            </text>
                        </g>
                    );
                })}

                {/* Y-axis label */}
                <text
                    x={12} y={marginT + chartH / 2}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#9C7A2F"
                    fontWeight="700"
                    transform={`rotate(-90, 12, ${marginT + chartH / 2})`}
                    letterSpacing={1}
                >
                    Virupas
                </text>

                {/* Bars */}
                {sorted.map((p, i) => {
                    const hex = getPlanetHex(p.planet);
                    const cx = marginL + barGroupW * i + barGroupW / 2;
                    const barH = (p.totalBala / yMax) * chartH;
                    const barY = marginT + chartH - barH;

                    return (
                        <g key={p.planet}>
                            {/* Bar shadow */}
                            <rect
                                x={cx - barW / 2 + 2}
                                y={barY + 2}
                                width={barW}
                                height={barH}
                                rx={4}
                                fill="rgba(0,0,0,0.04)"
                            />

                            {/* Actual bar */}
                            <motion.rect
                                x={cx - barW / 2}
                                width={barW}
                                rx={4}
                                fill={`url(#barGrad-${p.planet})`}
                                initial={{ y: marginT + chartH, height: 0 }}
                                animate={{ y: barY, height: barH }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.07 }}
                            />

                            {/* Value on top */}
                            <motion.text
                                x={cx}
                                textAnchor="middle"
                                fontSize={10}
                                fontWeight="600"
                                fill={hex}
                                fontFamily="system-ui"
                                initial={{ y: marginT + chartH - 4, opacity: 0 }}
                                animate={{ y: barY - 6, opacity: 1 }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.07 + 0.2 }}
                            >
                                {p.totalBala.toFixed(0)}
                            </motion.text>

                            {/* Planet symbol below X-axis */}
                            <g>
                                <circle cx={cx} cy={marginT + chartH + 16} r={11}
                                    fill={hex} opacity={0.12} />
                                <text x={cx} y={marginT + chartH + 19}
                                    textAnchor="middle" dominantBaseline="central"
                                    fontSize={11} fontWeight="800" fill={hex}>
                                    {PLANET_SYMBOLS[p.planet]}
                                </text>
                                <text x={cx} y={marginT + chartH + 36}
                                    textAnchor="middle"
                                    fontSize={8} fontWeight="600" fill="#6B5F52">
                                    {p.planet}
                                </text>
                                {/* Rank */}
                                <text x={cx} y={marginT + chartH + 46}
                                    textAnchor="middle"
                                    fontSize={7} fontWeight="500" fill="#9C7A2F">
                                    #{p.rank}
                                </text>
                            </g>

                            {/* Strong/Weak indicator inside bar (if bar tall enough) */}
                            {barH > 30 && (
                                <text x={cx} y={barY + 14}
                                    textAnchor="middle"
                                    fontSize={7} fontWeight="700"
                                    fill="white" opacity={0.85}
                                    letterSpacing={0.8}>
                                    {p.isStrong ? '✓' : '⚠'}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Strength/Weakness summary strip */}
            <div className="flex items-center justify-center gap-3 mt-0.5 text-[7px] shrink-0">
                <span className="flex items-center gap-1 text-amber-900/40">
                    <span className="text-emerald-500">✓</span> Meets min. required
                </span>
                <span className="flex items-center gap-1 text-amber-900/40">
                    <span className="text-amber-500">⚠</span> Below required
                </span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4: PIE / DONUT CHART (pure SVG)
// ═══════════════════════════════════════════════════════════════════════════════

function PieChartView({ planets }: { planets: ShadbalaPlanetData[] }) {
    const sorted = useMemo(() => [...planets].sort((a, b) => a.rank - b.rank), [planets]);

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[8px] font-medium tracking-wider text-primary/70 uppercase">
                    Strength Composition per Planet
                </p>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {sorted.map((p, idx) => (
                    <MiniDonut key={p.planet} planet={p} idx={idx} />
                ))}
            </div>

            {/* Shared Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-3 pt-2 border-t border-amber-200/40">
                {BALA_AXES.map(axis => (
                    <div key={axis.key} className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: axis.color }} />
                        <span className="text-[8px] text-primary font-medium">{axis.shortLabel}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MiniDonut({ planet, idx }: { planet: ShadbalaPlanetData; idx: number }) {
    const size = 80;
    const cx = size / 2;
    const cy = size / 2;
    const innerR = 24;
    const outerR = 40;
    const hex = getPlanetHex(planet.planet);
    const [hovered, setHovered] = useState<{ label: string; value: number; pct: number; color: string } | null>(null);

    // Compute positive values only for pie segments
    const values = BALA_AXES.map(axis => ({
        key: axis.key,
        label: axis.shortLabel,
        color: axis.color,
        value: Math.max((planet as unknown as Record<string, number>)[axis.key] || 0, 0),
    }));
    const total = Math.max(values.reduce((s, v) => s + v.value, 0), 1);

    // Build arc paths
    let startAngle = -90; // Start from top
    const arcs = values.map(v => {
        const sweep = (v.value / total) * 360;
        const arc = describeDonutArc(cx, cy, innerR, outerR, startAngle, startAngle + sweep);
        startAngle += sweep;
        return { ...v, arc, sweep, pct: (v.value / total) * 100 };
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="flex flex-col items-center relative"
        >
            <svg
                width={size} height={size}
                viewBox={`0 0 ${size} ${size}`}
                onMouseLeave={() => setHovered(null)}
            >
                {/* Background ring */}
                <circle cx={cx} cy={cy} r={(innerR + outerR) / 2} fill="none" stroke="#F0E8D8" strokeWidth={outerR - innerR} />

                {/* Segments */}
                {arcs.map(a => a.sweep > 0.5 && (
                    <path
                        key={a.key}
                        d={a.arc}
                        fill={a.color}
                        opacity={hovered ? (hovered.label === a.label ? 1 : 0.4) : 0.85}
                        className="transition-all duration-150 cursor-pointer"
                        style={{
                            transform: hovered?.label === a.label ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: `${cx}px ${cy}px`,
                        }}
                        onMouseEnter={() => setHovered({ label: a.label, value: a.value, pct: a.pct, color: a.color })}
                    />
                ))}

                {/* Center info */}
                <circle cx={cx} cy={cy} r={innerR - 1} fill="white" />
                <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="central"
                    fontSize={12} fontWeight="600" fill={hex}>
                    {PLANET_SYMBOLS[planet.planet]}
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central"
                    fontSize={7} fontWeight="600" fill="#6B5F52">
                    {planet.rupaBala.toFixed(1)}R
                </text>
            </svg>

            {/* Planet name & status */}
            <span className="text-[9px] font-medium text-primary mt-0.5">{planet.planet}</span>
            <span className={cn(
                "text-[7px] font-medium px-1 py-0.5 rounded-full mt-0.5",
                planet.isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
            )}>
                {planet.isStrong ? 'Strong' : 'Weak'}
            </span>

            {/* Tooltip */}
            {hovered && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full z-50 pointer-events-none">
                    <div className="bg-[#1E140A] text-white rounded-lg px-3 py-2 shadow-xl border border-amber-200/60 whitespace-nowrap min-w-[120px]">
                        {/* Arrow */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#1E140A]" />
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: hovered.color }} />
                            <span className="text-[10px] font-medium">{hovered.label}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-medium tabular-nums text-amber-300">{hovered.value.toFixed(1)}</span>
                            <span className="text-[9px] text-white/60">virupas</span>
                            <span className="text-[10px] font-medium tabular-nums text-emerald-400 ml-auto">{hovered.pct.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// SVG Donut arc path helper
function describeDonutArc(cx: number, cy: number, innerR: number, outerR: number, startDeg: number, endDeg: number): string {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const sweep = endDeg - startDeg;
    const largeArc = sweep > 180 ? 1 : 0;

    const outerStart = { x: cx + outerR * Math.cos(toRad(startDeg)), y: cy + outerR * Math.sin(toRad(startDeg)) };
    const outerEnd = { x: cx + outerR * Math.cos(toRad(endDeg)), y: cy + outerR * Math.sin(toRad(endDeg)) };
    const innerStart = { x: cx + innerR * Math.cos(toRad(endDeg)), y: cy + innerR * Math.sin(toRad(endDeg)) };
    const innerEnd = { x: cx + innerR * Math.cos(toRad(startDeg)), y: cy + innerR * Math.sin(toRad(startDeg)) };

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        'Z',
    ].join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5: RADIAL GAUGE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function GaugeView({ planets }: { planets: ShadbalaPlanetData[] }) {
    const sorted = useMemo(() => [...planets].sort((a, b) => a.rank - b.rank), [planets]);

    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-medium tracking-wider text-primary">
                    Rupa Strength Meters — Red tick = minimum required
                </p>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-3">
                {sorted.map((p, idx) => (
                    <RadialGaugeMeter
                        key={p.planet}
                        planet={p}
                        idx={idx}
                    />
                ))}
            </div>
        </div>
    );
}

function RadialGaugeMeter({ planet, idx }: { planet: ShadbalaPlanetData; idx: number }) {
    const size = 90;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2 - 6;
    const center = size / 2;
    const maxVal = 12;
    const startAngle = 135;
    const sweepAngle = 270;
    const hex = getPlanetHex(planet.planet);
    const minRequiredRupa = planet.minBalaRequired / 60;

    const valueAngle = Math.min(planet.rupaBala / maxVal, 1) * sweepAngle;
    const minAngle = Math.min(minRequiredRupa / maxVal, 1) * sweepAngle;

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

    // Min-required tick marks
    const minTickInner = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius - strokeWidth / 2 - 3;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();
    const minTickOuter = (() => {
        const angleRad = ((minAngle + startAngle) * Math.PI) / 180;
        const r2 = radius + strokeWidth / 2 + 3;
        return { x: center + r2 * Math.cos(angleRad), y: center + r2 * Math.sin(angleRad) };
    })();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.07 }}
            className="flex flex-col items-center py-1"
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Track */}
                <path d={describeArc(0, sweepAngle)} fill="none" stroke="#E8DCC8" strokeWidth={strokeWidth} strokeLinecap="round" />

                {/* Value arc */}
                <motion.path
                    d={describeArc(0, valueAngle)}
                    fill="none"
                    stroke={hex}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ filter: `drop-shadow(0 0 4px ${hex}40)` }}
                />

                {/* Min-required tick */}
                <line
                    x1={minTickInner.x} y1={minTickInner.y}
                    x2={minTickOuter.x} y2={minTickOuter.y}
                    stroke="#EF4444" strokeWidth={2} strokeLinecap="round"
                />

                {/* Planet symbol */}
                <text x={center} y={center - 5} textAnchor="middle" dominantBaseline="central"
                    fontSize={18} fill={hex} fontWeight="600" fontFamily="serif">
                    {PLANET_SYMBOLS[planet.planet]}
                </text>

                {/* Rupa value */}
                <text x={center} y={center + 14} textAnchor="middle" dominantBaseline="central"
                    fontSize={11} fill={hex} fontWeight="600">
                    {planet.rupaBala.toFixed(2)}
                </text>

                {/* "RUPA" label */}
                <text x={center} y={center + 25} textAnchor="middle" dominantBaseline="central"
                    fontSize={6} fill="#9C7A2F" fontWeight="600" letterSpacing={1.5}>
                    Rupa
                </text>
            </svg>

            {/* Planet name and status */}
            <p className="text-[10px] font-medium text-primary mt-0.5">{planet.planet}</p>
            <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[8px] font-normal text-primary">#{planet.rank}</span>
                <span className={cn(
                    "text-[7px] font-medium px-1.5 py-0.5 rounded-full tracking-wider",
                    planet.isStrong ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                )}>
                    {planet.isStrong ? 'Potent' : 'Weak'}
                </span>
            </div>
        </motion.div>
    );
}
