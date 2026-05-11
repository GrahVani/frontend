"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Grid3X3, Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { PLANET_COLORS } from '@/design-tokens/colors';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { useVedicClient } from '@/context/VedicClientContext';
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import AshtakavargaChart from '@/components/astrology/AshtakavargaChart';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';

// ============================================================================
// Types
// ============================================================================

interface ShadbalaPlanet {
    planet: string;
    totalBala: number;
    rupaBala: number;
    rank: number;
    isStrong: boolean;
    percentOfRequired: number;
}

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa'
};

function getPlanetHex(planet: string): string {
    return PLANET_COLORS[planet]?.hex || '#9C7A2F';
}

const SIGN_NAMES = ['', 'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

// ============================================================================
// Shadbala Bar Chart (compact, self-contained SVG)
// ============================================================================

function ShadbalaBarChart({ planets }: { planets: ShadbalaPlanet[] }) {
    const sorted = useMemo(() => [...planets].sort((a, b) => a.rank - b.rank), [planets]);

    const svgW = 680;
    const svgH = 340; // Increased height for better detail
    const marginL = 40;
    const marginR = 10;
    const marginT = 15; // Minimal top margin
    const marginB = 35; // Space for labels at bottom
    const chartW = svgW - marginL - marginR;
    const chartH = svgH - marginT - marginB;

    const maxVal = Math.max(...sorted.map(p => p.totalBala), 1);
    const yMax = Math.ceil(maxVal / 50) * 50; // Tighter padding

    const barCount = sorted.length;
    const barGroupW = chartW / barCount;
    const barW = Math.min(barGroupW * 0.65, 54);

    const yTickCount = 5;
    const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round((yMax / yTickCount) * i));

    return (
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                {sorted.map(p => {
                    const hex = getPlanetHex(p.planet);
                    return (
                        <linearGradient key={`grad-${p.planet}`} id={`kundliBarGrad-${p.planet}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={hex} stopOpacity={1} />
                            <stop offset="100%" stopColor={hex} stopOpacity={0.7} />
                        </linearGradient>
                    );
                })}
            </defs>

            {/* Y-axis gridlines (Background) */}
            {yTicks.map((tick, i) => {
                const y = marginT + chartH - (tick / yMax) * chartH;
                return (
                    <g key={`yt-${i}`}>
                        <line
                            x1={marginL} y1={y} x2={svgW - marginR} y2={y}
                            stroke={i === 0 ? '#C4B89A' : '#E8DCC8'}
                            strokeWidth={i === 0 ? 1 : 0.5}
                            opacity={0.4}
                        />
                    </g>
                );
            })}

            {/* Bars */}
            {sorted.map((p, i) => {
                const hex = getPlanetHex(p.planet);
                const cx = marginL + barGroupW * i + barGroupW / 2;
                const barH = (p.totalBala / yMax) * chartH;
                const barY = marginT + chartH - barH;

                return (
                    <g key={p.planet}>
                        {/* Shadow/Glow Bar */}
                        <rect
                            x={cx - barW / 2 + 2}
                            y={barY + 2}
                            width={barW}
                            height={barH}
                            rx={4}
                            fill="rgba(0,0,0,0.05)"
                        />
                        {/* Main Bar */}
                        <motion.rect
                            x={cx - barW / 2}
                            width={barW}
                            rx={4}
                            fill={`url(#kundliBarGrad-${p.planet})`}
                            initial={{ y: marginT + chartH, height: 0 }}
                            animate={{ y: barY, height: barH }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.05 }}
                        />

                        {/* Value on top */}
                        <motion.text
                            x={cx}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight="700"
                            fill={hex}
                            initial={{ y: marginT + chartH - 4, opacity: 0 }}
                            animate={{ y: barY - 8, opacity: 1 }}
                            transition={{ duration: 0.8, delay: i * 0.05 + 0.3 }}
                        >
                            {p.totalBala.toFixed(0)}
                        </motion.text>

                        {/* Planet Symbol overlaid at base or just below */}
                        <g>
                            <text x={cx} y={marginT + chartH + 16}
                                textAnchor="middle"
                                fontSize={13} fontWeight="700" fill={hex} opacity={1}>
                                {PLANET_SYMBOLS[p.planet]}
                            </text>
                            <text x={cx} y={marginT + chartH + 28}
                                textAnchor="middle"
                                fontSize={11} fontWeight="600" fill="#3D3228">
                                {p.planet}
                            </text>
                        </g>

                        {/* Strength Badge Overlay */}
                        {barH > 40 && (
                            <circle cx={cx + barW / 2 - 8} cy={barY + 8} r={7} fill="white" fillOpacity={0.3} />
                        )}
                        {barH > 40 && (
                            <text x={cx + barW / 2 - 8} y={barY + 11.5}
                                textAnchor="middle" fontSize={10} fontWeight="bold" fill="white">
                                {p.isStrong ? '✓' : '⚠'}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Virupas Label at side */}
            <text
                x={marginL - 14} y={marginT + chartH / 2}
                textAnchor="middle"
                fontSize={12}
                fill="black"
                fontWeight="600"
                transform={`rotate(-90, ${marginL - 14}, ${marginT + chartH / 2})`}
            >
                Virupas
            </text>
        </svg>
    );
}

// ============================================================================
// Sarvashtakavarga Compact Chart (12-house bar)
// ============================================================================

function SarvashtakavargaChart({ houseValues, ascendant }: { houseValues: Record<number, number>; ascendant: number }) {
    const maxVal = Math.max(...Object.values(houseValues), 1);
    const total = Object.values(houseValues).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[12px] text-primary tracking-wider">Total Bindus: <span className="text-primary font-bold">{total}</span></span>
            </div>
            <div className="flex gap-0.5 items-end h-[120px] px-1">
                {Array.from({ length: 12 }, (_, i) => {
                    const house = i + 1;
                    const signId = ((ascendant + i - 1) % 12) + 1;
                    const val = houseValues[house] || houseValues[signId] || 0;
                    const height = maxVal > 0 ? (val / maxVal) * 100 : 0;
                    const isHigh = val >= 30;
                    const isLow = val <= 22;

                    return (
                        <div key={house} className="flex-1 flex flex-col items-center gap-0.5">
                            {/* Value */}
                            <span className={cn(
                                "text-[11px] font-bold tabular-nums",
                                isHigh ? "text-emerald-600" : isLow ? "text-rose-500" : "text-primary"
                            )}>
                                {val}
                            </span>
                            {/* Bar */}
                            <motion.div
                                className={cn(
                                    "w-full rounded-t-sm min-h-[2px]",
                                    isHigh ? "bg-emerald-500" : isLow ? "bg-rose-400" : "bg-amber-400"
                                )}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.04 }}
                                style={{ opacity: 0.75 }}
                            />
                            {/* Sign label */}
                            <span className="text-[10px] text-primary font-medium leading-tight">{SIGN_NAMES[signId]}</span>
                            <span className="text-[9px] text-primary font-bold">H{house}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] text-primary font-bold mt-1">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ≥30 Strong</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Average</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-400" /> ≤22 Weak</span>
            </div>
        </div>
    );
}

// ============================================================================
// Main Panel — Shadbala + Sarvashtakavarga for Kundli Page
// ============================================================================

const HEADER_STYLE = {
    background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
    borderBottom: '1px solid rgba(220,201,166,0.25)',
};

export default function KundliAnalyticsPanel() {
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // ── Shadbala Data ──
    const shadbalaKey = 'shadbala_lahiri';
    const shadbalaRaw = processedCharts[shadbalaKey]?.chartData;
    const shadbalaResult = (shadbalaRaw?.data || shadbalaRaw) as any;

    const shadbalaData = useMemo<ShadbalaPlanet[] | null>(() => {
        if (!shadbalaResult?.shadbala_virupas) return null;
        const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        return planetKeys.map(p => {
            const virupas = shadbalaResult.shadbala_virupas?.[p] || 0;
            const rupas = shadbalaResult.shadbala_rupas?.[p] || 0;
            const rank = shadbalaResult.relative_rank?.[p] || 0;
            const strength = shadbalaResult.strength_summary?.[p] || 'Weak';
            const pctReq = shadbalaResult.percentage_of_required?.[p] || 0;
            return {
                planet: p,
                totalBala: virupas,
                rupaBala: rupas,
                rank,
                isStrong: strength === 'Strong',
                percentOfRequired: pctReq,
            };
        });
    }, [shadbalaResult]);

    // ── Sarvashtakavarga Data ──
    const sarvaKey = 'ashtakavarga_sarva_lahiri';
    const sarvaRaw = processedCharts[sarvaKey]?.chartData;
    const sarvaFullData = (sarvaRaw?.data || sarvaRaw) as any;

    const d1Key = 'D1_lahiri';
    const d1Raw = processedCharts[d1Key]?.chartData;
    const { ascendant: ascSign } = useMemo(() => parseChartData(d1Raw), [d1Raw]);

    const sarvaHouseValues = useMemo<Record<number, number>>(() => {
        if (!sarvaFullData) return {};
        const scores: Record<number, number> = {};

        const sarvaData = sarvaFullData.sarvashtakavarga || sarvaFullData.sarvashtakavarga_summary || sarvaFullData.ashtakvarga || sarvaFullData;
        const signs = sarvaData.signs || sarvaData.houses_matrix || sarvaData.houses || sarvaData.sarvashtakavarga_summary || {};
        const houseMatrix = sarvaData.house_strength_matrix || sarvaFullData.house_strength_matrix;

        if (Array.isArray(houseMatrix)) {
            houseMatrix.forEach((h: any) => {
                const signId = signNameToId[h.sign_name as string] || h.house_number as number;
                if (signId && signId >= 1 && signId <= 12) scores[signId] = (h.total_points as number) || 0;
            });
        } else if (typeof signs === 'object' && !Array.isArray(signs)) {
            Object.entries(signs).forEach(([s, v]) => {
                const signId = signNameToId[s] || signNameToId[s.charAt(0).toUpperCase() + s.slice(1)] ||
                    (s.startsWith('House') ? ((ascSign + parseInt(s.split(' ')[1]) - 2) % 12) + 1 : parseInt(s));
                if (signId && signId >= 1 && signId <= 12) scores[signId] = v as number;
            });
        }

        // Convert sign-based (1=Aries) to house-based (1=Ascendant)
        const hVals: Record<number, number> = {};
        if (Object.keys(scores).length > 0 && ascSign) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascSign + h - 2) % 12) + 1;
                hVals[h] = scores[s] || 0;
            }
        }
        return hVals;
    }, [sarvaFullData, ascSign]);

    const hasShadbala = shadbalaData && shadbalaData.length > 0;
    const hasSarva = Object.keys(sarvaHouseValues).length > 0;
    const loading = isLoadingCharts && !hasShadbala && !hasSarva;

    if (!loading && !hasShadbala && !hasSarva) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 w-full">
            {/* Shadbala Bar Chart */}
            <div className="col-span-12 md:col-span-5 prem-card overflow-hidden flex flex-col">
                <div className="px-3 py-1.5 flex items-center justify-between gap-1.5" style={HEADER_STYLE}>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <BarChart3 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "truncate")}>Shadbala strength</h2>
                    </div>
                </div>
                <div className="flex-1 bg-surface-warm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                        </div>
                    ) : hasShadbala ? (
                        <div className="h-full w-full">
                            <ShadbalaBarChart planets={shadbalaData!} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <AlertCircle className="w-6 h-6 text-gold-primary/30 mb-2" />
                            <p className="text-[11px] text-ink/40">Shadbala data not available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sarvashtakavarga Chart (Official North Indian Style) */}
            <div className="col-span-12 md:col-span-7 prem-card overflow-hidden flex flex-col">
                <div className="px-3 py-1.5 flex items-center justify-between gap-1.5" style={HEADER_STYLE}>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Grid3X3 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "truncate")}>Sarvashtakavarga</h2>
                    </div>
                </div>
                <div className="flex-1 p-3 bg-surface-warm min-h-[180px] flex flex-col xl:flex-row items-stretch gap-6 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                        </div>
                    ) : (hasSarva && ascSign) ? (
                        <>
                            {/* Left Side: Chart (Centered vertically to match table height) */}
                            <div className="shrink-0 w-full max-w-[380px] mx-auto xl:mx-0 flex flex-col justify-center py-2">
                                <AshtakavargaChart
                                    type="sarva"
                                    ascendantSign={ascSign}
                                    houseValues={sarvaHouseValues}
                                />
                            </div>

                            {/* Right Side: Matrix Table */}
                            <div className="flex-1 w-full overflow-hidden flex flex-col justify-start">
                                <div className="text-[12px] text-black font-semibold mb-1.5 px-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    Bindu Matrix
                                </div>
                                <div className="overflow-x-auto custom-scrollbar rounded-xl border border-primary/10 bg-white/30 flex-1">
                                    <AshtakavargaMatrix
                                        type="sarva"
                                        data={sarvaFullData}
                                        className="!text-[11px]"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <AlertCircle className="w-6 h-6 text-gold-primary/30 mb-2" />
                            <p className="text-[11px] text-ink/40">Sarvashtakavarga data not available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

