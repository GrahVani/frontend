"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    ArrowLeft,
    Loader2,
    AlertTriangle,
    Star,
    User,
    CheckCircle2,
    Info,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

// ============================================================================
// Types
// ============================================================================

export interface KarakaData {
    planet: string;
    karaka_full: string;
    karaka_short: string;
    degree: string;
    sign: string;
}

export interface CharaKarakasResponse {
    karakas: KarakaData[];
    all_planet_positions?: Record<string, unknown>;
}

// ============================================================================
// Constants
// ============================================================================

const KARAKA_DESCRIPTIONS: Record<string, string> = {
    'AK': 'Soul indicator, highest degree. Represents the self.',
    'AmK': 'Career and intellect indicator. Represents counselors and advisors.',
    'BK': 'Siblings and courage indicator. Represents siblings and associates.',
    'MK': 'Mother and happiness indicator. Represents mother and landed property.',
    'PiK': 'Father and ancestors indicator. Represents father and status.',
    'PuK': 'Children and creativity indicator. Represents children and pupils.',
    'GK': 'Relatives and obstacles indicator. Represents relatives and rivals.',
    'DK': 'Spouse and partnership indicator. Represents husband or wife.'
};

const PLANET_ICON_COLORS: Record<string, string> = {
    'Sun': 'text-orange-500',
    'Moon': 'text-blue-400',
    'Mars': 'text-red-500',
    'Mercury': 'text-emerald-500',
    'Jupiter': 'text-yellow-600',
    'Venus': 'text-pink-500',
    'Saturn': 'text-slate-600',
    'Rahu': 'text-indigo-600',
    'Ketu': 'text-violet-600',
};

// ============================================================================
// Page Component
// ============================================================================

export default function CharaKarakasPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, isGeneratingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

    const clientId = clientDetails?.id || '';

    // Get Chara Karakas data from database (processedCharts)
    const data: CharaKarakasResponse | null = useMemo(() => {
        const chartKey = `chara_karakas_${ayanamsa.toLowerCase()}`;
        const chart = processedCharts[chartKey];
        const rawData = (chart?.chartData?.data || chart?.chartData) as Record<string, unknown> | undefined;

        if (!rawData) return null;

        // If the data returns 'karakas' directly, use it
        const rawKarakas = rawData.karakas as KarakaData[] | undefined;
        if (rawKarakas) {
            return {
                karakas: rawKarakas,
                all_planet_positions: (rawData.all_planet_positions as Record<string, unknown>) || undefined
            };
        }
        // If it only returns planet positions, calculate them (7-karaka system)
        const rawPlanetPositions = rawData.all_planet_positions as Record<string, { degree_in_sign: number; dms_in_sign?: string; sign_name?: string }> | undefined;
        if (rawPlanetPositions) {
            const planetsToProcess = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

            const extractedPlanets = planetsToProcess
                .filter(name => rawPlanetPositions[name])
                .map(name => ({
                    name,
                    degreeVal: rawPlanetPositions[name].degree_in_sign,
                    degreeFormatted: rawPlanetPositions[name].dms_in_sign || '',
                    sign: rawPlanetPositions[name].sign_name || ''
                }))
                .sort((a, b) => b.degreeVal - a.degreeVal);

            const karakaShort = ['AK', 'AmK', 'BK', 'MK', 'PuK', 'GK', 'DK'];
            const karakaFull = [
                'Atma Karaka', 'Amatya Karaka', 'Bhatra Karaka',
                'Matra Karaka', 'Putra Karaka', 'Gnati Karaka', 'Dara Karaka'
            ];

            const computedKarakas: KarakaData[] = extractedPlanets.map((p, i) => ({
                planet: p.name,
                karaka_full: karakaFull[i] || 'Karaka',
                karaka_short: karakaShort[i] || 'K',
                degree: p.degreeFormatted,
                sign: p.sign
            }));

            return {
                karakas: computedKarakas,
                all_planet_positions: rawPlanetPositions
            };
        }
        return null;
    }, [processedCharts, ayanamsa]);

    // Show loading while: initial fetch, auto-generating, or refreshing
    const loading = !data && (isLoadingCharts || isGeneratingCharts || isRefreshingCharts || isGeneratingLocal);

    // Handle generate - for when specific chart is missing
    const handleGenerate = async () => {
        if (!clientId) return;
        setIsGeneratingLocal(true);
        try {
            await clientApi.generateChart(clientId, 'chara_karakas', ayanamsa.toLowerCase());
            await refreshCharts();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to generate Chara Karakas');
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    // Handle refresh - trigger page reload
    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (!data && !isLoadingCharts && !isGeneratingCharts && !isRefreshingCharts && !isGeneratingLocal) {
            setError("No Chara Karakas data found.");
        } else {
            setError(null);
        }
    }, [data, isLoadingCharts, isGeneratingCharts, isRefreshingCharts, isGeneratingLocal]);

    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-10 max-w-md">
                    <Shield className="w-10 h-10 text-amber-600 mb-3 mx-auto" />
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "!text-amber-900 !text-lg !mb-1")}>Chara Karakas — Lahiri Only</h2>
                    <p className={cn(TYPOGRAPHY.subValue, "!text-amber-700 !text-[13px] max-w-sm !mt-0")}>
                        Available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                    </p>
                    <Link href="/vedic-astrology/overview" className={cn(TYPOGRAPHY.label, "!mt-4 !text-[13px] !text-amber-700 hover:!text-amber-500 transition-colors flex items-center gap-1")}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                </div>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-12 animate-in fade-in duration-500">
            <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <div>
                    <h1 className="text-[28px] font-bold text-amber-900 tracking-tight">Chara Karakas</h1>
                    <p className="text-[16px] text-amber-600 mt-1">Variable significators by planetary degrees</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60">Lahiri System</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                    <p className={cn(TYPOGRAPHY.subValue, "!text-amber-700 italic !text-[13px] !mt-0")}>Calculating...</p>
                </div>
            ) : error ? (
                <div className="p-8 bg-red-50/50 border border-red-200 rounded-2xl text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 !text-base !mb-2")}>Data Not Available</h3>
                    <p className={cn(TYPOGRAPHY.subValue, "!text-red-600 !text-[13px] !mb-4")}>{error}</p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={isGeneratingLocal}
                            className={cn(TYPOGRAPHY.label, "px-5 py-2 bg-amber-500 text-white rounded-lg !text-[12px] !font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2")}
                        >
                            {isGeneratingLocal ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                            ) : (
                                <><RefreshCw className="w-4 h-4" /> Generate Karakas</>
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshingCharts}
                            className={cn(TYPOGRAPHY.label, "px-5 py-2 bg-red-100 text-red-700 rounded-lg !text-[12px] !font-bold hover:bg-red-200 transition-colors disabled:opacity-50")}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            ) : data ? (
                <KarakaDashboard data={data} />
            ) : null}
            </div>
        </div>
    );
}

// ============================================================================
// Dashboard Component
// ============================================================================

export function KarakaDashboard({ data }: { data: CharaKarakasResponse }) {
    const karakas = data.karakas || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-amber-200/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-3 border-b border-amber-200/60 bg-amber-50/20 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className={cn(TYPOGRAPHY.label, "!text-[11px] font-bold tracking-wider !text-amber-900 !mb-0")}>Principal Karakas</h3>
                </div>
                <div className="overflow-x-auto max-h-[calc(100vh-250px)] no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="border-b border-amber-200/60">
                                <th className={cn(TYPOGRAPHY.label, "px-4 py-2 !text-[9px] !font-bold text-amber-700/40 uppercase tracking-widest")}>Karaka</th>
                                <th className={cn(TYPOGRAPHY.label, "px-4 py-2 !text-[9px] !font-bold text-amber-700/40 uppercase tracking-widest")}>Planet</th>
                                <th className={cn(TYPOGRAPHY.label, "px-4 py-2 !text-[9px] !font-bold text-amber-700/40 uppercase tracking-widest text-right")}>Degree</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                            {karakas.map((item, idx) => (
                                <motion.tr
                                    key={item.karaka_short}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-amber-50 transition-colors group"
                                >
                                    <td className="px-4 py-2.5">
                                        <div className="flex flex-col">
                                            <span className={cn(TYPOGRAPHY.value, "!text-[13px] font-bold !text-amber-900")}>{item.karaka_full}</span>
                                            <span className={cn(TYPOGRAPHY.label, "!text-[9px] font-bold text-amber-700 !mb-0")}>{item.karaka_short}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-7 h-7 rounded-lg bg-amber-50/60 flex items-center justify-center font-bold text-[11px] border border-amber-200/60")}>
                                                {item.planet.substring(0, 2)}
                                            </div>
                                            <span className={cn(TYPOGRAPHY.value, "!text-[13px] !font-medium !text-amber-900", PLANET_ICON_COLORS[item.planet])}>
                                                {item.planet}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn(TYPOGRAPHY.subValue, "!text-amber-900 font-medium !text-[12px] !mt-0")}>{item.degree}</span>
                                            <span className={cn(TYPOGRAPHY.label, "!text-[9px] text-amber-700/40 !mb-0")}>{item.sign}</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Card */}
            <div className="lg:col-span-4 space-y-3">
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm rounded-2xl p-4 bg-luxury-radial h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-amber-500" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "!text-[14px] !mb-0")}>Significance</h3>
                    </div>
                    <p className={cn(TYPOGRAPHY.subValue, "!text-amber-800/80 leading-snug !text-[12px] !mt-0")}>
                        Variable significators based on planetary longitudinal degrees within signs.
                    </p>
                    <div className="mt-4 space-y-3">
                        {karakas.slice(0, 4).map(item => (
                            <div key={item.karaka_short} className="flex gap-2.5">
                                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <div>
                                    <p className={cn(TYPOGRAPHY.label, "!text-[10px] font-bold !text-amber-900 !mb-0")}>{item.karaka_full}</p>
                                    <p className={cn(TYPOGRAPHY.label, "!text-[9px] !text-amber-700/50 !mb-0 leading-tight")}>{KARAKA_DESCRIPTIONS[item.karaka_short] || ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-amber-200/60">
                        <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <h4 className={cn(TYPOGRAPHY.label, "!text-[11px] font-bold !text-amber-900 !mb-0")}>Standard Calculation</h4>
                        </div>
                        <p className={cn(TYPOGRAPHY.label, "!text-[9px] !text-amber-700/50 !mb-0")}>
                            Using the 7-Karaka system (excluding Rahu/Ketu) as per BPHS guidelines for Lahiri.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
