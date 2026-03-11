"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    RefreshCw,
    Info,
    LayoutGrid,
    Map as MapIcon,
    Loader2,
    Zap,
    Compass,
    Grid3X3
} from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useAshtakavarga } from '@/hooks/queries/useCalculations';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import NorthIndianChart from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import AshtakavargaChart from '@/components/astrology/AshtakavargaChart';
import dynamic from 'next/dynamic';

const ShodashaVargaTable = dynamic(() => import('@/components/astrology/ShodashaVargaTable'));
const TemporalRelationshipTable = dynamic(() => import('@/components/astrology/TemporalRelationshipTable'));

const SIGN_MAP: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

interface AshtakavargaData {
    sarva?: Record<string, unknown>;
    bhinna?: Record<string, unknown>;
    shodasha?: Record<string, unknown>;
    temporal?: Record<string, unknown>;
    ascendant?: number;
}

const PLANETS = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AnalyzeCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: 'amber' | 'rose' | 'copper' }) => (
    <div className={cn(
        "p-4 rounded-3xl border transition-all hover:shadow-lg",
        color === 'amber' ? "bg-amber-50/50 border-amber-100" :
            color === 'rose' ? "bg-rose-50/50 border-rose-100" :
                "bg-copper-50/50 border-copper-100"
    )}>
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm",
            color === 'amber' ? "bg-amber-100 text-ink" :
                color === 'rose' ? "bg-rose-100 text-rose-600" :
                    "bg-copper-100 text-ink"
        )}>
            {icon}
        </div>
        <h4 className={cn(TYPOGRAPHY.value, "!text-[14px] mb-2 text-ink")}>{title}</h4>
        <p className={cn(TYPOGRAPHY.subValue, "!text-[10px] leading-relaxed text-ink")}>{desc}</p>
    </div>
);

import { parseChartData } from '@/lib/chart-helpers';

export default function AshtakavargaPage() {
    const queryClient = useQueryClient();
    const { clientDetails, processedCharts, isLoadingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [activeTab, setActiveTab] = useState<'sarva' | 'bhinna' | 'shodasha' | 'temporal'>('sarva');
    const [selectedPlanet, setSelectedPlanet] = useState<string>('Lagna');

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Replaced slow useAshtakavarga hooks with instant pre-fetched data from context
    const { data, loading } = React.useMemo(() => {
        const sarvaKey = `ashtakavarga_sarva_${activeSystem}`;
        const bhinnaKey = `ashtakavarga_bhinna_${activeSystem}`;
        const shodashaKey = `ashtakavarga_shodasha_${activeSystem}`;
        const shodashaKpKey = `shodasha_varga_signs_${activeSystem}`;
        const d1Key = `D1_${activeSystem}`;

        const sarvaRaw = processedCharts[sarvaKey]?.chartData;
        const bhinnaRaw = processedCharts[bhinnaKey]?.chartData;
        const shodashaRaw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
        const temporalRaw = processedCharts[`tatkalik_maitri_chakra_${activeSystem}`]?.chartData;
        const d1Raw = processedCharts[d1Key]?.chartData;

        // Still loading if context is empty and client is active
        if (!sarvaRaw && !bhinnaRaw && !shodashaRaw && isLoadingCharts) {
            return { data: null, loading: true };
        }

        // Get ascendant via robust parser
        const { ascendant } = parseChartData(d1Raw);

        return {
            loading: false,
            data: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Polymorphic Astro Engine API; duck-typed throughout page
                sarva: (sarvaRaw?.data || sarvaRaw) as any,
                bhinna: (bhinnaRaw?.data || bhinnaRaw) as any,
                shodasha: (shodashaRaw?.data || shodashaRaw) as any,
                temporal: (temporalRaw?.data || temporalRaw) as any,
                ascendant
            }
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    /* Removed fetchAshtakavarga and useEffect */

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-copper-50/30 rounded-2xl border border-dashed border-copper-200">
                <Shield className="w-16 h-16 text-ink mb-4 animate-pulse" />
                <h2 className="text-[18px] font-serif text-ink mb-2">No Client Selected</h2>
                <p className="text-[12px] text-ink max-w-md">Please select a client from the workbench to analyze their Ashtakavarga strengths.</p>
            </div>
        );
    }

    const houseValues: Record<number, number> = {};
    const ascSign = data?.ascendant || 1;

    if (data) {
        let scores: Record<number, number> = {};

        if (activeTab === 'sarva' && data.sarva) {
            const sarvaData = data.sarva.sarvashtakavarga || data.sarva.sarvashtakavarga_summary || data.sarva.ashtakvarga || data.sarva;
            const signs = sarvaData.signs || sarvaData.houses_matrix || sarvaData.houses || sarvaData.sarvashtakavarga_summary || {};

            // Handle house_strength_matrix array format (Bhasin): [{house_number, sign_name, total_points}]
            const houseMatrix = sarvaData.house_strength_matrix || data.sarva.house_strength_matrix;
            if (Array.isArray(houseMatrix)) {
                houseMatrix.forEach((h: Record<string, unknown>) => {
                    const signId = SIGN_MAP[h.sign_name as string] || h.house_number as number;
                    if (signId && signId >= 1 && signId <= 12) {
                        scores[signId] = (h.total_points as number) || 0;
                    }
                });
            } else if (typeof signs === 'object' && !Array.isArray(signs)) {
                Object.entries(signs).forEach(([s, v]) => {
                    const signId = SIGN_MAP[s] || SIGN_MAP[s.charAt(0).toUpperCase() + s.slice(1)] ||
                        (s.startsWith('House') ? ((ascSign + parseInt(s.split(' ')[1]) - 2) % 12) + 1 : parseInt(s));

                    if (signId && signId >= 1 && signId <= 12) {
                        scores[signId] = v as number;
                    }
                });
            }
        } else if (activeTab === 'bhinna' && data.bhinna) {
            const bhinnaRoot = data.bhinna.bhinnashtakavarga || data.bhinna.ashtakvarga || data.bhinna;
            const planetKey = selectedPlanet === 'Lagna' ? 'Ascendant' : selectedPlanet;

            // Handle array of tables from some backend versions
            const tables = bhinnaRoot.tables || [];
            const specificTable = Array.isArray(tables) ? tables.find((t: Record<string, unknown>) => t.planet === planetKey || t.planet === selectedPlanet) : null;

            // Priority: direct total_bindus array > 'total' field in matrix > 'total_bindus' field in matrix
            let planetData = specificTable?.total_bindus || bhinnaRoot[planetKey] || bhinnaRoot[planetKey.toLowerCase()] || {};

            // If planetData contains a 'total' or 'total_bindus' property, that's our BAV scores
            if (planetData && typeof planetData === 'object' && !Array.isArray(planetData)) {
                if (planetData.total) planetData = planetData.total;
                else if (planetData.total_bindus) planetData = planetData.total_bindus;
                else if (planetData.bindus && Array.isArray(planetData.bindus)) planetData = planetData.bindus;
            }

            if (Array.isArray(planetData)) {
                planetData.forEach((v, idx) => { scores[idx + 1] = v; });
            } else {
                Object.entries(planetData).forEach(([s, v]) => {
                    const signId = SIGN_MAP[s] || SIGN_MAP[s.charAt(0).toUpperCase() + s.slice(1)] || parseInt(s);
                    if (signId && signId >= 1 && signId <= 12) {
                        scores[signId] = (typeof v === 'number' ? v : (v as Record<string, unknown>).total as number) || 0;
                    }
                });
            }
        }

        if (Object.keys(scores).length > 0 && ascSign) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascSign + h - 2) % 12) + 1;
                houseValues[h] = scores[s] || 0;
            }
        }
    }

    return (
        <div className="space-y-3 pt-2 px-1 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] font-bold")}>
                        Ashtakavarga systems
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex prem-card p-1 rounded-xl overflow-x-auto">
                        {(['sarva', 'bhinna', 'shodasha', 'temporal'] as const)
                            .filter(tab => {
                                const capabilities = clientApi.getSystemCapabilities(ayanamsa);
                                if (tab === 'temporal') return capabilities.features.ashtakavarga.includes('temporal_maitri');
                                if (tab === 'shodasha') return capabilities.features.ashtakavarga.includes('shodasha_summary') || capabilities.features.ashtakavarga.includes('shodasha_varga');
                                return true;
                            })
                            .map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-3 py-1 rounded-lg transition-all whitespace-nowrap",
                                        TYPOGRAPHY.label,
                                        "!text-[14px] !font-bold !mb-0",
                                        activeTab === tab
                                            ? cn("text-ink shadow-sm scale-[1.02]", COLORS.wbActiveTab)
                                            : "text-ink/55 hover:bg-gold-primary/10 hover:text-ink"
                                    )}
                                >
                                    {tab === 'sarva' ? 'Sarvashtakavarga' :
                                        tab === 'bhinna' ? 'Bhinnashtakavarga' :
                                            tab === 'shodasha' ? 'Shodasha' : 'Tatkalik maitri'}
                                </button>
                            ))}
                    </div>

                </div>

            </div>

            {loading && !data?.[activeTab] ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-ink animate-spin mx-auto mb-4" />
                        <p className={cn(TYPOGRAPHY.sectionTitle, "text-[16px]")}>Compiling bindu matrices...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeTab === 'sarva' || activeTab === 'bhinna' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-12 space-y-3">
                                <div className="prem-card rounded-xl overflow-hidden">
                                    <div className="p-3 border-b border-gold-primary/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div>
                                            <h2 className={TYPOGRAPHY.sectionTitle}>
                                                {activeTab === 'sarva' ? 'Sarvashtakavarga (SAV)' : `Bhinnashtakavarga: ${selectedPlanet}`}
                                            </h2>
                                            <p className="text-[12px] text-ink/55 font-sans mt-0.5">
                                                {activeTab === 'sarva'
                                                    ? 'The collective strength of all planets across the 12 signs/houses.'
                                                    : `Individual contributions to ${selectedPlanet}'s strength in each sign.`}
                                            </p>
                                        </div>

                                        {activeTab === 'bhinna' && (
                                            <div className="flex gap-1.5 p-1 rounded-xl prem-card overflow-x-auto">
                                                {PLANETS.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPlanet(p)}
                                                        className={cn(
                                                            "px-3 py-1 text-[14px] font-semibold font-sans rounded-lg transition-all whitespace-nowrap",
                                                            selectedPlanet === p
                                                                ? cn("text-ink shadow-sm scale-105", COLORS.wbActiveTab)
                                                                : "text-ink/55 hover:bg-gold-primary/10 hover:text-ink"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 grid grid-cols-1 lg:grid-cols-[5fr_12fr] gap-5 items-start">
                                        <div className="space-y-3">
                                            <h3 className={cn(TYPOGRAPHY.label, "text-ink flex items-center gap-2")}>
                                                <MapIcon className="w-3.5 h-3.5" /> House distribution
                                            </h3>
                                            <div className="flex justify-start w-full max-w-lg mx-auto lg:mx-0">
                                                <AshtakavargaChart
                                                    type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                    ascendantSign={data?.ascendant || 1}
                                                    houseValues={houseValues}
                                                    className="items-start"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 w-full">
                                            <h3 className={cn(TYPOGRAPHY.label, "text-ink flex items-center gap-2")}>
                                                <Grid3X3 className="w-3.5 h-3.5" /> Bindu matrix
                                            </h3>
                                            <AshtakavargaMatrix
                                                type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                data={activeTab === 'sarva' ? data?.sarva : ((data?.bhinna as Record<string, Record<string, unknown>> | undefined)?.ashtakvarga?.tables as Record<string, unknown>[] | undefined)?.find((t: Record<string, unknown>) =>
                                                    t.planet === selectedPlanet ||
                                                    (selectedPlanet === 'Lagna' && (t.planet === 'Ascendant' || t.planet === 'Lagna'))
                                                ) || (data?.bhinna as Record<string, Record<string, unknown>> | undefined)?.bhinnashtakavarga?.[selectedPlanet] || (data?.bhinna as Record<string, Record<string, unknown>> | undefined)?.bhinnashtakavarga?.[selectedPlanet.toLowerCase()] || (data?.bhinna as Record<string, unknown> | undefined)?.[selectedPlanet.toLowerCase()]}
                                                planet={selectedPlanet}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'shodasha' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[calc(100vh-220px)]">
                            <ShodashaVargaTable data={data?.shodasha} className="h-full" />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {data?.temporal ? (
                                <TemporalRelationshipTable data={data.temporal} />
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[300px] prem-card rounded-3xl border-dashed p-12 text-center">
                                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold mb-4")}>No temporal relationship data</h3>
                                    <button
                                        onClick={() => clientApi.generateChart(clientDetails.id!, 'tatkalik_maitri_chakra', activeSystem).then(() => window.location.reload())}
                                        className={cn("px-8 py-3 text-ink rounded-2xl font-bold hover:shadow-xl transition-all", COLORS.premiumGradient)}
                                    >
                                        Generate tatkalik maitri
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


