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
    Grid3X3,
    Settings,
    Settings2,
    Plus,
    Minus,
    X
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
const PanchadhaMaitriTable = dynamic(() => import('@/components/astrology/PanchadhaMaitriTable'));
const NaisargikMaitriTable = dynamic(() => import('@/components/astrology/NaisargikMaitriTable'));

const SIGN_MAP: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

interface AshtakavargaData {
    sarva?: Record<string, unknown>;
    bhinna?: Record<string, unknown>;
    shodasha?: Record<string, unknown>;
    temporal?: Record<string, unknown>;
    panchadha?: Record<string, unknown>;
    ascendant?: number;
}

const PLANETS = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AnalyzeCard = ({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: 'amber' | 'rose' | 'copper' }) => (
    <div className={cn(
        "p-4 rounded-3xl border transition-all hover:shadow-lg",
        color === 'amber' ? "bg-amber-50/50 border-amber-100" :
            color === 'rose' ? "bg-rose-50/50 border-rose-100" :
                "bg-orange-50/50 border-orange-100"
    )}>
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm",
            color === 'amber' ? "bg-amber-100 text-amber-900" :
                color === 'rose' ? "bg-rose-100 text-rose-600" :
                    "bg-orange-100 text-orange-700"
        )}>
            {icon}
        </div>
        <h4 className={cn(TYPOGRAPHY.value, "!text-[14px] mb-2 text-amber-900")}>{title}</h4>
        <p className={cn(TYPOGRAPHY.subValue, "!text-[10px] leading-relaxed text-amber-900")}>{desc}</p>
    </div>
);

import { parseChartData } from '@/lib/chart-helpers';

export default function AshtakavargaPage() {
    const queryClient = useQueryClient();
    const { clientDetails, processedCharts, isLoadingCharts, openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [activeTab, setActiveTab] = useState<'sarva' | 'bhinna' | 'shodasha' | 'temporal' | 'samudaya'>('sarva');
    const [selectedPlanet, setSelectedPlanet] = useState<string>('Lagna');

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Auto-switch to valid tab when ayanamsa changes
    useEffect(() => {
        const capabilities = clientApi.getSystemCapabilities(ayanamsa);
        const hasSarva = capabilities.features.ashtakavarga.includes('sarva');
        const hasBhinna = capabilities.features.ashtakavarga.includes('bhinna');
        const hasShodasha = capabilities.features.ashtakavarga.includes('shodasha_summary') ||
            capabilities.features.ashtakavarga.includes('shodasha_varga');
        const hasSamudaya = capabilities.features.ashtakavarga.includes('samudaya');

        // If current tab is not available, switch to first available
        if (activeTab === 'sarva' && !hasSarva) {
            if (hasBhinna) setActiveTab('bhinna');
            else if (hasShodasha) setActiveTab('shodasha');
            else if (hasSamudaya) setActiveTab('samudaya');
        } else if (activeTab === 'bhinna' && !hasBhinna) {
            if (hasSarva) setActiveTab('sarva');
            else if (hasShodasha) setActiveTab('shodasha');
            else if (hasSamudaya) setActiveTab('samudaya');
        } else if (activeTab === 'shodasha' && !hasShodasha) {
            if (hasSarva) setActiveTab('sarva');
            else if (hasBhinna) setActiveTab('bhinna');
            else if (hasSamudaya) setActiveTab('samudaya');
        } else if (activeTab === 'samudaya' && !hasSamudaya) {
            if (hasSarva) setActiveTab('sarva');
            else if (hasBhinna) setActiveTab('bhinna');
            else if (hasShodasha) setActiveTab('shodasha');
        }
    }, [ayanamsa, activeTab]);

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
        const panchadhaRaw = processedCharts[`panchadha_maitri_${activeSystem}`]?.chartData;
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
                panchadha: (panchadhaRaw?.data || panchadhaRaw) as any,
                ascendant
            }
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    /* Removed fetchAshtakavarga and useEffect */

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200">
                <Shield className="w-16 h-16 text-amber-900 mb-4 animate-pulse" />
                <h2 className="text-[18px] font-serif text-amber-900 mb-2">No Client Selected</h2>
                <p className="text-[12px] text-amber-900 max-w-md">Please select a client from the workbench to analyze their Ashtakavarga strengths.</p>
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
        <div className="space-y-3 animate-in fade-in duration-500 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 -mx-4 -mt-4 px-4 py-4">
            <div className={cn("sticky z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-3 -mx-4 px-4 border-b border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-3", hasClientBar ? "top-[144px]" : "top-[104px]")}>
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] font-bold")}>
                        Ashtakavarga systems
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-xl border border-amber-200/60 shadow-sm p-1 overflow-x-auto">
                        {(['sarva', 'bhinna', 'shodasha', 'samudaya', 'temporal'] as const)
                            .filter(tab => {
                                const capabilities = clientApi.getSystemCapabilities(ayanamsa);
                                if (tab === 'temporal') return capabilities.features.ashtakavarga.includes('temporal_maitri');
                                if (tab === 'shodasha') return capabilities.features.ashtakavarga.includes('shodasha_summary') || capabilities.features.ashtakavarga.includes('shodasha_varga');
                                if (tab === 'samudaya') return capabilities.features.ashtakavarga.includes('samudaya');
                                if (tab === 'sarva') return capabilities.features.ashtakavarga.includes('sarva');
                                if (tab === 'bhinna') return capabilities.features.ashtakavarga.includes('bhinna');
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
                                            ? "bg-amber-600 text-white shadow-sm scale-[1.02]"
                                            : "text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                                    )}
                                >
                                    {tab === 'sarva' ? 'Sarvashtakavarga' :
                                        tab === 'bhinna' ? 'Bhinnashtakavarga' :
                                            tab === 'shodasha' ? 'Shodasha' :
                                                tab === 'samudaya' ? 'Samudaya' : 'Tatkalik maitri'}
                                </button>
                            ))}
                    </div>

                </div>

            </div>

            {loading && activeTab !== 'samudaya' && !(data as any)?.[activeTab] ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                        <p className={cn(TYPOGRAPHY.sectionTitle, "text-[16px]")}>Compiling bindu matrices...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeTab === 'sarva' || activeTab === 'bhinna' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-12 space-y-3">
                                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                                    <div className="py-2 px-3 border-b border-amber-200/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div>
                                            <h2 className={TYPOGRAPHY.sectionTitle}>
                                                {activeTab === 'sarva' ? 'Sarvashtakavarga (SAV)' : `Bhinnashtakavarga: ${selectedPlanet}`}
                                            </h2>
                                            <p className="text-[12px] text-amber-600 font-sans mt-0.5">
                                                {activeTab === 'sarva'
                                                    ? 'The collective strength of all planets across the 12 signs/houses.'
                                                    : `Individual contributions to ${selectedPlanet}'s strength in each sign.`}
                                            </p>
                                        </div>

                                        {activeTab === 'bhinna' && (
                                            <div className="flex gap-1.5 p-1 rounded-xl bg-white border border-amber-200/60 shadow-sm overflow-x-auto">
                                                {PLANETS.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setSelectedPlanet(p)}
                                                        className={cn(
                                                            "px-3 py-1 text-[14px] font-semibold font-sans rounded-lg transition-all whitespace-nowrap",
                                                            selectedPlanet === p
                                                                ? "bg-amber-600 text-white shadow-sm scale-105"
                                                                : "text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 grid grid-cols-1 lg:grid-cols-[5fr_12fr] gap-5 items-stretch">
                                        <div className="space-y-1.5 flex flex-col h-full">
                                            <h3 className={cn(TYPOGRAPHY.label, "text-amber-900 flex items-center gap-2")}>
                                                <MapIcon className="w-3.5 h-3.5" /> House distribution
                                            </h3>
                                            <div className="flex justify-start w-full flex-1 items-center">
                                                <AshtakavargaChart
                                                    type={activeTab === 'sarva' ? 'sarva' : 'bhinna'}
                                                    ascendantSign={data?.ascendant || 1}
                                                    houseValues={houseValues}
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 w-full">
                                            <h3 className={cn(TYPOGRAPHY.label, "text-amber-900 flex items-center gap-2")}>
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
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ShodashaVargaTable data={data?.shodasha} className="h-full" />
                        </div>
                    ) : activeTab === 'samudaya' ? (
                        <SamudayaTab
                            clientId={clientDetails.id!}
                            activeSystem={activeSystem}
                            processedCharts={processedCharts}
                        />
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="mb-8">
                                <NaisargikMaitriTable />
                            </div>
                            {data?.temporal && (
                                <TemporalRelationshipTable data={data.temporal} />
                            )}
                            {data?.panchadha && (
                                <div className="mt-8">
                                    <PanchadhaMaitriTable data={data.panchadha} />
                                </div>
                            )}
                            {!data?.temporal && !data?.panchadha && (
                                <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-amber-200/60 shadow-sm border-dashed p-12 text-center">
                                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold mb-4")}>No temporal relationship data</h3>
                                    <button
                                        onClick={() => {
                                            clientApi.generateChart(clientDetails.id!, 'tatkalik_maitri_chakra', activeSystem);
                                            clientApi.generateChart(clientDetails.id!, 'panchadha_maitri', activeSystem).then(() => window.location.reload());
                                        }}
                                        className="px-8 py-3 text-white rounded-2xl font-bold hover:shadow-xl transition-all bg-amber-600"
                                    >
                                        Generate maitri systems
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



function SamudayaTab({
    clientId,
    activeSystem,
    processedCharts,
}: {
    clientId: string;
    activeSystem: string;
    processedCharts: Record<string, any>;
}) {
    const queryClient = useQueryClient();
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    type DivSettings = { show: boolean; planetSize: number; houseSize: number; degreeSize: number; showDegrees: boolean };
    type SamSettings = { show: boolean; scoreSize: number; houseSize: number };

    const [divSettings, setDivSettings] = useState<Record<string, DivSettings>>({});
    const [samSettings, setSamSettings] = useState<Record<string, SamSettings>>({});

    const getDivSettings = (key: string): DivSettings =>
        divSettings[key] ?? { show: false, planetSize: 18, houseSize: 14, degreeSize: 9, showDegrees: false };
    const getSamSettings = (key: string): SamSettings =>
        samSettings[key] ?? { show: false, scoreSize: 22, houseSize: 14 };

    const updateDivSettings = (key: string, patch: Partial<DivSettings>) => {
        setDivSettings(prev => ({ ...prev, [key]: { ...getDivSettings(key), ...patch } }));
    };
    const updateSamSettings = (key: string, patch: Partial<SamSettings>) => {
        setSamSettings(prev => ({ ...prev, [key]: { ...getSamSettings(key), ...patch } }));
    };

    const resetDivDefaults = (key: string) => updateDivSettings(key, { planetSize: 18, houseSize: 14, degreeSize: 9, showDegrees: false, show: false });
    const resetSamDefaults = (key: string) => updateSamSettings(key, { scoreSize: 22, houseSize: 14, show: false });

    const SIGN_MAP_LOCAL: Record<string, number> = {
        'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
        'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
    };

    const CHART_PAIRS = [
        { divKey: 'D1', samKey: 'samudaya_d1', label: 'Birth chart' },
        { divKey: 'D2', samKey: 'samudaya_d2', label: 'Hora (wealth)' },
        { divKey: 'D3', samKey: 'samudaya_d3', label: 'Drekkana (happiness siblings)' },
        { divKey: 'D7', samKey: 'samudaya_d7', label: 'Saptamsha (children)' },
        { divKey: 'D9', samKey: 'samudaya_d9', label: 'Navamsha (spouse)' },
        { divKey: 'D10', samKey: 'samudaya_d10', label: 'Dashamsha (great successes)' },
        { divKey: 'D12', samKey: 'samudaya_d12', label: 'Dwadashamsha (parents)' },
        { divKey: 'D16', samKey: 'samudaya_d16', label: 'Shodashamsha (conveyances)' },
        { divKey: 'D30', samKey: 'samudaya_d30', label: 'Trimshamsha (misfortunes)' },
        { divKey: 'D60', samKey: 'samudaya_d60', label: 'Shashtyamsha (all areas)' },
    ];

    const getSamudayaHouseValues = (rawData: any, ascendant: number): Record<number, number> => {
        const data = (rawData?.data || rawData) as Record<string, unknown> | undefined;
        if (!data) return {};

        // Primary: Python Samudaya format — samudaya_ashtakavarga.sign_totals
        // Keys are like "0_Aries", "1_Taurus", ... where the prefix is the 0-based sign index
        const samudaya = (data as Record<string, unknown>).samudaya_ashtakavarga as Record<string, unknown> | undefined;
        const signTotals = samudaya?.sign_totals as Record<string, number> | undefined;
        if (signTotals && typeof signTotals === 'object') {
            const scores: Record<number, number> = {};
            Object.entries(signTotals).forEach(([key, value]) => {
                const prefix = key.split('_')[0];
                const signIndex = parseInt(prefix);
                if (!isNaN(signIndex) && signIndex >= 0 && signIndex <= 11) {
                    scores[signIndex + 1] = value; // convert 0-based index → 1-based sign ID
                }
            });

            const houseValues: Record<number, number> = {};
            if (Object.keys(scores).length > 0 && ascendant) {
                for (let h = 1; h <= 12; h++) {
                    const s = ((ascendant + h - 2) % 12) + 1;
                    houseValues[h] = scores[s] ?? 0;
                }
            }
            return houseValues;
        }

        // Fallback: sarva-style formats (used by some other endpoints)
        const root = (data as Record<string, unknown>).sarvashtakavarga ||
            (data as Record<string, unknown>).sarvashtakavarga_summary ||
            (data as Record<string, unknown>).ashtakvarga ||
            data;
        const signs = (root as Record<string, unknown>).signs ||
            (root as Record<string, unknown>).houses_matrix ||
            (root as Record<string, unknown>).houses ||
            (root as Record<string, unknown>).sarvashtakavarga_summary ||
            {};
        let scores: Record<number, number> = {};

        const houseMatrix = (root as Record<string, unknown>).house_strength_matrix || (data as Record<string, unknown>).house_strength_matrix;
        if (Array.isArray(houseMatrix)) {
            houseMatrix.forEach((h: Record<string, unknown>) => {
                const signId = SIGN_MAP_LOCAL[h.sign_name as string] || h.house_number as number;
                if (signId && signId >= 1 && signId <= 12) {
                    scores[signId] = (h.total_points as number) || 0;
                }
            });
        } else if (typeof signs === 'object' && !Array.isArray(signs)) {
            Object.entries(signs).forEach(([s, v]) => {
                const signId = SIGN_MAP_LOCAL[s] || SIGN_MAP_LOCAL[s.charAt(0).toUpperCase() + s.slice(1)] ||
                    (s.startsWith('House') ? ((ascendant + parseInt(s.split(' ')[1]) - 2) % 12) + 1 : parseInt(s));
                if (signId && signId >= 1 && signId <= 12) {
                    scores[signId] = v as number;
                }
            });
        }

        const houseValues: Record<number, number> = {};
        if (Object.keys(scores).length > 0 && ascendant) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascendant + h - 2) % 12) + 1;
                houseValues[h] = scores[s] || 0;
            }
        }
        return houseValues;
    };

    const missingPairs = CHART_PAIRS.filter(pair => {
        const divRaw = processedCharts[`${pair.divKey}_${activeSystem}`]?.chartData;
        const samRaw = processedCharts[`${pair.samKey}_${activeSystem}`]?.chartData;
        return !divRaw || !samRaw;
    });

    const handleGenerateAll = async () => {
        setGenerating(true);
        try {
            const chartsToGenerate = missingPairs.flatMap(pair => {
                const missing: string[] = [];
                if (!processedCharts[`${pair.divKey}_${activeSystem}`]?.chartData) missing.push(pair.divKey.toLowerCase());
                if (!processedCharts[`${pair.samKey}_${activeSystem}`]?.chartData) missing.push(pair.samKey);
                return missing;
            });

            for (let i = 0; i < chartsToGenerate.length; i++) {
                setProgress(i + 1);
                await clientApi.generateChart(clientId, chartsToGenerate[i], activeSystem);
            }

            await queryClient.invalidateQueries({ queryKey: ['charts'] });
            window.location.reload();
        } catch (e) {
            console.error("Failed to generate charts:", e);
        } finally {
            setGenerating(false);
        }
    };

    if (missingPairs.length > 0) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-amber-200/60 shadow-sm border-dashed p-12 text-center">
                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold mb-4")}>
                    Divisional Charts &amp; Samudaya Ashtakavarga
                </h3>
                <p className="text-amber-700 mb-2 max-w-lg">
                    {missingPairs.length} of {CHART_PAIRS.length} chart pairs are not yet generated.
                </p>
                <p className="text-amber-700 mb-6 text-sm">
                    Missing: {missingPairs.map(c => c.label).join(', ')}
                </p>
                <button
                    onClick={handleGenerateAll}
                    disabled={generating}
                    className="px-8 py-3 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2 bg-amber-600"
                >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {generating ? `Generating ${progress}/${missingPairs.flatMap(p => {
                        const m: string[] = [];
                        if (!processedCharts[`${p.divKey}_${activeSystem}`]?.chartData) m.push(p.divKey.toLowerCase());
                        if (!processedCharts[`${p.samKey}_${activeSystem}`]?.chartData) m.push(p.samKey);
                        return m;
                    }).length}...` : 'Generate All Missing Charts'}
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <div>
                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-lg font-bold")}>
                    Samudaya Ashtakavarga — Divisional Charts
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                    Combined Ashtakavarga bindu counts for all divisional charts.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {CHART_PAIRS.map((pair) => {
                    const divRaw = processedCharts[`${pair.divKey}_${activeSystem}`]?.chartData;
                    const samRaw = processedCharts[`${pair.samKey}_${activeSystem}`]?.chartData;

                    const divParsed = parseChartData(divRaw?.data || divRaw);
                    const houseValues = getSamudayaHouseValues(samRaw, divParsed.ascendant);
                    const dSet = getDivSettings(pair.divKey);
                    const sSet = getSamSettings(pair.divKey);

                    return (
                        <div key={pair.divKey} className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-2">
                            <div className="grid grid-cols-2 gap-3">
                                {/* Divisional Chart */}
                                <div className="flex flex-col items-center">
                                    {/* Title with inline settings toggle */}
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <h4 className={cn(TYPOGRAPHY.label, "text-[13px] text-amber-900 font-bold text-center")}>
                                            {pair.label}
                                        </h4>
                                        <button
                                            onClick={() => updateDivSettings(pair.divKey, { show: !dSet.show })}
                                            className={cn(
                                                "p-1 rounded-md transition-all",
                                                dSet.show
                                                    ? "bg-amber-600 text-white shadow-sm"
                                                    : "text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                            )}
                                            title="Divisional chart settings"
                                        >
                                            <Settings className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="w-full relative">
                                        <NorthIndianChart
                                            planets={divParsed.planets}
                                            ascendantSign={divParsed.ascendant}
                                            showDegrees={dSet.showDegrees}
                                            planetFontSize={dSet.planetSize}
                                            degreeFontSize={dSet.degreeSize}
                                            signNumberFontSize={dSet.houseSize}
                                            showHouseNumbers={true}
                                            valueType="none"
                                        />

                                        {/* Floating settings panel — overlay on top of chart */}
                                        {dSet.show && (
                                            <div
                                                className="absolute top-2 right-2 z-20 w-52 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                                                style={{
                                                    background: 'rgba(255, 252, 246, 0.98)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(217, 119, 6, 0.2)'
                                                }}
                                            >
                                                <div className="space-y-4">
                                                    {/* Planet Size */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>Planet Size</label>
                                                            <span className={cn(TYPOGRAPHY.value, "text-[11px] text-amber-900")}>{dSet.planetSize}px</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { planetSize: Math.max(8, dSet.planetSize - 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="range" min={8} max={36} step={1}
                                                                value={dSet.planetSize}
                                                                onChange={(e) => updateDivSettings(pair.divKey, { planetSize: parseInt(e.target.value) })}
                                                                className="flex-1 accent-amber-600 h-1 bg-amber-100 rounded-full appearance-none cursor-pointer"
                                                            />
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { planetSize: Math.min(36, dSet.planetSize + 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Degree Size */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>Degree Size</label>
                                                            <span className={cn(TYPOGRAPHY.value, "text-[11px] text-amber-900")}>{dSet.degreeSize}px</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { degreeSize: Math.max(6, dSet.degreeSize - 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="range" min={6} max={18} step={1}
                                                                value={dSet.degreeSize}
                                                                onChange={(e) => updateDivSettings(pair.divKey, { degreeSize: parseInt(e.target.value) })}
                                                                className="flex-1 accent-amber-600 h-1 bg-amber-100 rounded-full appearance-none cursor-pointer"
                                                            />
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { degreeSize: Math.min(18, dSet.degreeSize + 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* House Number Size */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>House Number Size</label>
                                                            <span className={cn(TYPOGRAPHY.value, "text-[11px] text-amber-900")}>{dSet.houseSize}px</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { houseSize: Math.max(8, dSet.houseSize - 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="range" min={8} max={24} step={1}
                                                                value={dSet.houseSize}
                                                                onChange={(e) => updateDivSettings(pair.divKey, { houseSize: parseInt(e.target.value) })}
                                                                className="flex-1 accent-amber-600 h-1 bg-amber-100 rounded-full appearance-none cursor-pointer"
                                                            />
                                                            <button
                                                                onClick={() => updateDivSettings(pair.divKey, { houseSize: Math.min(24, dSet.houseSize + 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Show Degrees Toggle */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                                                        <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>Show Degrees</label>
                                                        <button
                                                            onClick={() => updateDivSettings(pair.divKey, { showDegrees: !dSet.showDegrees })}
                                                            className={cn(
                                                                "w-8 h-4 rounded-full transition-colors relative",
                                                                dSet.showDegrees ? "bg-amber-600" : "bg-amber-200"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                                                                dSet.showDegrees ? "left-4.5" : "left-0.5"
                                                            )} style={{ left: dSet.showDegrees ? '1.125rem' : '0.125rem' }} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => resetDivDefaults(pair.divKey)}
                                                        className="w-full mt-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-amber-50 border border-amber-200/60 text-amber-700"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.02) 100%)',
                                                        }}
                                                    >
                                                        Reset to Defaults
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Samudaya Ashtakavarga */}
                                <div className="flex flex-col items-center">
                                    {/* Title with inline settings toggle */}
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <h4 className={cn(TYPOGRAPHY.label, "text-[13px] text-amber-900 font-bold text-center")}>
                                            Samudaya
                                        </h4>
                                        <button
                                            onClick={() => updateSamSettings(pair.divKey, { show: !sSet.show })}
                                            className={cn(
                                                "p-1 rounded-md transition-all",
                                                sSet.show
                                                    ? "bg-amber-600 text-white shadow-sm"
                                                    : "text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                            )}
                                            title="Samudaya chart settings"
                                        >
                                            <Settings className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="w-full relative">
                                        <NorthIndianChart
                                            planets={[]}
                                            ascendantSign={divParsed.ascendant}
                                            houseValues={houseValues}
                                            valueType="bindu"
                                            showHouseNumbers={true}
                                            signNumberFontSize={sSet.houseSize}
                                            valueFontSize={sSet.scoreSize}
                                        />

                                        {/* Floating settings panel — overlay on top of chart */}
                                        {sSet.show && (
                                            <div
                                                className="absolute top-2 right-2 z-20 w-52 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                                                style={{
                                                    background: 'rgba(255, 252, 246, 0.98)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(217, 119, 6, 0.2)'
                                                }}
                                            >
                                                <div className="space-y-4">
                                                    {/* Score Size */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>Score Size</label>
                                                            <span className={cn(TYPOGRAPHY.value, "text-[11px] text-amber-900")}>{sSet.scoreSize}px</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateSamSettings(pair.divKey, { scoreSize: Math.max(12, sSet.scoreSize - 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="range" min={12} max={36} step={1}
                                                                value={sSet.scoreSize}
                                                                onChange={(e) => updateSamSettings(pair.divKey, { scoreSize: parseInt(e.target.value) })}
                                                                className="flex-1 accent-amber-600 h-1 bg-amber-100 rounded-full appearance-none cursor-pointer"
                                                            />
                                                            <button
                                                                onClick={() => updateSamSettings(pair.divKey, { scoreSize: Math.min(36, sSet.scoreSize + 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* House Number Size */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className={cn(TYPOGRAPHY.label, "text-[10px] text-amber-900 uppercase tracking-wider")}>House Number Size</label>
                                                            <span className={cn(TYPOGRAPHY.value, "text-[11px] text-amber-900")}>{sSet.houseSize}px</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateSamSettings(pair.divKey, { houseSize: Math.max(8, sSet.houseSize - 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <input
                                                                type="range" min={8} max={24} step={1}
                                                                value={sSet.houseSize}
                                                                onChange={(e) => updateSamSettings(pair.divKey, { houseSize: parseInt(e.target.value) })}
                                                                className="flex-1 accent-amber-600 h-1 bg-amber-100 rounded-full appearance-none cursor-pointer"
                                                            />
                                                            <button
                                                                onClick={() => updateSamSettings(pair.divKey, { houseSize: Math.min(24, sSet.houseSize + 1) })}
                                                                className="p-1 rounded-md bg-amber-50/60 border border-amber-200/60 hover:border-amber-300 text-amber-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => resetSamDefaults(pair.divKey)}
                                                        className="w-full mt-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-amber-50 border border-amber-200/60 text-amber-700"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.02) 100%)',
                                                        }}
                                                    >
                                                        Reset to Defaults
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
