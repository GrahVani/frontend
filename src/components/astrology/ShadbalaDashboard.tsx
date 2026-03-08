"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Compass,
    Activity,
    BarChart2,
    Layers
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS } from '@/design-tokens/colors';

// ============================================================================
// Shadbala Types & Interfaces
// ============================================================================

export interface IshtaKashta {
    ishta: number;
    kashta: number;
}

export interface ShadbalaPlanet {
    planet: string;
    sthalaBala: number;   // Positional
    digBala: number;      // Directional
    kalaBala: number;     // Temporal
    cheshtaBala: number;  // Motional
    naisargikaBala: number; // Natural
    drikBala: number;     // Aspectual
    totalBala: number;    // Total in Virupas
    rupaBala: number;     // Total in Rupas (total/60)
    minBalaRequired: number;
    ratio: number;
    rank: number;
    isStrong: boolean;
    ishtaKashta?: IshtaKashta;
}

export interface ShadbalaData {
    planets: ShadbalaPlanet[];
    ayanamsa: string;
    system: string;
    raw?: Record<string, unknown>;
}

// Planet themes derived from centralized design tokens
const PLANET_THEMES: Record<string, { color: string, twText: string, twBg: string }> = Object.fromEntries(
    Object.entries(PLANET_COLORS).map(([name, c]) => [name, { color: c.hex, twText: c.text, twBg: c.bg }])
);

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa'
};

const BALA_AXES = [
    { key: 'sthalaBala', label: 'Positional', shortLabel: 'Positional' },
    { key: 'digBala', label: 'Directional', shortLabel: 'Directional' },
    { key: 'kalaBala', label: 'Temporal', shortLabel: 'Temporal' },
    { key: 'cheshtaBala', label: 'Motional', shortLabel: 'Motional' },
    { key: 'naisargikaBala', label: 'Natural', shortLabel: 'Natural' },
    { key: 'drikBala', label: 'Aspectual', shortLabel: 'Aspectual' },
];

function RadialGauge({ planet, rupaBala, minRequired, isStrong, color, rank }: {
    planet: string; rupaBala: number; minRequired: number; isStrong: boolean; color: string; rank: number;
}) {
    const size = 110;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2 - 5;
    const center = size / 2;
    const maxVal = 12;
    const sweepAngle = 270;
    const startAngle = 135;

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
        <div className="flex flex-col items-center group">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <path d={describeArc(0, sweepAngle)} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" />
                <motion.path
                    d={describeArc(0, valueAngle)}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                />
                <line x1={minTickInner.x} y1={minTickInner.y} x2={minTickOuter.x} y2={minTickOuter.y} stroke="#ef4444" strokeWidth={2} />
                <text x={center} y={center - 4} textAnchor="middle" fontSize="18" fill={color} fontWeight="bold">{PLANET_SYMBOLS[planet]}</text>
                <text x={center} y={center + 14} textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">{rupaBala.toFixed(2)}</text>
            </svg>
            <p className="text-[10px] font-bold text-ink/45 uppercase mt-1">#{rank} {isStrong ? 'Potent' : 'Weak'}</p>
        </div>
    );
}

export default function ShadbalaDashboard({ displayData }: { displayData: ShadbalaData }) {
    const sortedPlanets = [...displayData.planets].sort((a, b) => a.rank - b.rank);
    const strongest = sortedPlanets[0];
    const weakest = sortedPlanets[sortedPlanets.length - 1];

    if (!strongest || !weakest) return null;

    const strongestTheme = PLANET_THEMES[strongest.planet];
    const weakestTheme = PLANET_THEMES[weakest.planet];

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gold-primary/10 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-ink/30 tracking-widest">Strongest</span>
                        </div>
                        <h4 className="text-[20px] font-bold text-ink">{strongest.planet}</h4>
                        <p className="text-[12px] text-emerald-600 font-bold">{strongest.rupaBala.toFixed(2)} Rupa</p>
                    </div>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-[18px] font-bold shadow-lg", strongestTheme.twBg)}>
                        {PLANET_SYMBOLS[strongest.planet]}
                    </div>
                </div>

                <div className="bg-white border border-gold-primary/10 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-rose-500" />
                            <span className="text-[10px] font-black uppercase text-ink/30 tracking-widest">Weakest</span>
                        </div>
                        <h4 className="text-[20px] font-bold text-ink">{weakest.planet}</h4>
                        <p className="text-[12px] text-rose-500 font-bold">{weakest.rupaBala.toFixed(2)} Rupa</p>
                    </div>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-[18px] font-bold shadow-lg", weakestTheme.twBg)}>
                        {PLANET_SYMBOLS[weakest.planet]}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gold-primary/10 rounded-3xl p-4 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="w-5 h-5 text-gold-dark" />
                    <h3 className="text-[14px] font-black uppercase tracking-widest text-ink">Rupa Strength Overview</h3>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8">
                    {sortedPlanets.map((p) => (
                        <RadialGauge
                            key={p.planet}
                            planet={p.planet}
                            rupaBala={p.rupaBala}
                            minRequired={p.minBalaRequired / 60}
                            isStrong={p.isStrong}
                            color={PLANET_THEMES[p.planet].color}
                            rank={p.rank}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gold-primary/10 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Compass className="w-5 h-5 text-gold-dark" />
                        <h3 className="text-[14px] font-black uppercase tracking-widest text-ink">Strength Profile</h3>
                    </div>
                    <div className="space-y-4">
                        {sortedPlanets.map(p => (
                            <div key={p.planet} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-ink">{p.planet}</span>
                                    <span className="text-ink/60">{p.rupaBala.toFixed(2)} Rupa</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-warm rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gold-primary transition-all duration-1000"
                                        style={{ width: `${(p.rupaBala / 12) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gold-primary/10 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-[14px] font-black uppercase tracking-widest text-ink">Ishta & Kashta Phala</h3>
                    </div>
                    <div className="space-y-4">
                        {sortedPlanets.map(p => {
                            if (!p.ishtaKashta) return null;
                            const total = Math.max(p.ishtaKashta.ishta + p.ishtaKashta.kashta, 1);
                            const ishtaPct = (p.ishtaKashta.ishta / total) * 100;
                            return (
                                <div key={p.planet} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-ink">{p.planet}</span>
                                        <div className="flex gap-2">
                                            <span className="text-emerald-600">I:{p.ishtaKashta.ishta.toFixed(1)}</span>
                                            <span className="text-rose-500">K:{p.ishtaKashta.kashta.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-gold-primary/8 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-emerald-500" style={{ width: `${ishtaPct}%` }} />
                                        <div className="h-full bg-rose-500 flex-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
