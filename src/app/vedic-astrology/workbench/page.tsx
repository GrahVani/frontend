"use client";

import React, { useState, useEffect } from 'react';
import NorthIndianChart, { ChartWithPopup, Planet } from "@/components/astrology/NorthIndianChart";
import ShodashaDignity from '@/components/astrology/ShodashaDignity';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Calendar,
    FileText,
    ArrowRight,
    Sparkles,
    Activity,
    Target,
    Eye,
    Loader2,
    RefreshCw,
    Layers,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import BirthPanchanga from '@/components/astrology/BirthPanchanga';
import PlanetaryTable from '@/components/astrology/PlanetaryTable';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useSystemCapabilities } from "@/hooks/queries/useCalculations";
import { useChartMutations } from "@/hooks/mutations/useChartMutations";

import { parseChartData, signIdToName, fullPlanetNames } from '@/lib/chart-helpers';

const CHART_NAMES: Record<string, string> = {
    // Divisional Charts
    'D1': 'Rashi (Birth chart)',
    'D2': 'Hora (Wealth)',
    'D3': 'Drekkana (Siblings)',
    'D4': 'Chaturthamsha (Fortune)',
    'D7': 'Saptamsha (Children)',
    'D9': 'Navamsha (Spouse & dharma)',
    'D10': 'Dashamsha (Career)',
    'D12': 'Dwadashamsha (Parents)',
    'D16': 'Shodashamsha (Vehicles)',
    'D20': 'Vimshamsha (Spirituality)',
    'D24': 'Chaturvimshamsha (Education)',
    'D27': 'Bhamsha (Strength)',
    'D30': 'Trimshamsha (Misfortunes)',
    'D40': 'Khavedamsha (Auspiciousness)',
    'D45': 'Akshavedamsha (General)',
    'D60': 'Shashtiamsha (Past karma)',

    // Chandra & Surya Lagna
    'moon_chart': 'Chandra lagna (Moon chart)',
    'sun_chart': 'Surya lagna (Sun chart)',

    // Special Lagnas & Analysis
    'arudha_lagna': 'Arudha lagna (Perception)',
    'bhava_lagna': 'Bhava lagna (Relative strength)',
    'hora_lagna': 'Hora lagna (Prosperity)',
    'karkamsha_d1': 'Karkamsha D1 (Life purpose)',
    'karkamsha_d9': 'Karkamsha D9 (Inner nature)',
    'sripathi_bhava': 'Sripathi bhava (House analysis)',
    'kp_bhava': 'KP bhava (Stellar system)',
    'equal_bhava': 'Equal bhava',
    'gl_chart': 'Gati kalagna (GL chart)',
    'transit': 'Transit (Gochar)',
    'mandi': 'Mandi (Karmic obstacles)',
    'gulika': 'Gulika (Instant karma)',
};

export default function AnalyticalWorkbenchPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const { generateChart } = useChartMutations();

    const [selectedChartType, setSelectedChartType] = useState('D1');
    const [activeTab, setActiveTab] = useState<'chart' | 'dignity' | 'lagna'>('chart');
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);
    const [generateError, setGenerateError] = useState<string | null>(null);

    // Handler for generating individual charts
    const handleGenerateChart = async () => {
        if (!clientDetails?.id) return;
        setIsGeneratingLocal(true);
        setGenerateError(null);
        try {
            await clientApi.generateChart(clientDetails.id, selectedChartType, settings.ayanamsa.toLowerCase());
            await refreshCharts();
        } catch (err: unknown) {
            setGenerateError(`Failed to generate ${selectedChartType}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    const systemCapabilities = useSystemCapabilities(settings.ayanamsa);
    const divisionalCharts = systemCapabilities.charts.divisional.filter(c => !c.toLowerCase().includes('shodasha_varga'));
    const lagnaCharts = systemCapabilities.charts.lagna;

    const activeSystem = settings.ayanamsa.toLowerCase();

    // Use global pre-processed charts for O(1) lookup
    const currentChart = React.useMemo(() => {
        const key = `${selectedChartType}_${activeSystem}`;
        return processedCharts[key];
    }, [selectedChartType, activeSystem, processedCharts]);

    // Use shared parser
    const { planets: displayPlanets, ascendant: ascendantSign } = parseChartData(currentChart?.chartData);

    // Prepare Planetary Data for Table
    const planetaryTableData = React.useMemo(() => {
        return displayPlanets.map(p => ({
            planet: fullPlanetNames[p.name] || p.name,
            sign: signIdToName[p.signId] || '-',
            degree: p.degree,
            nakshatra: p.nakshatra || '-',
            nakshatraPart: p.pada ? (typeof p.pada === 'number' ? p.pada : parseInt(String(p.pada).replace('Pada ', ''))) : undefined,
            house: p.house || 0,
            isRetro: p.isRetro
        }));
    }, [displayPlanets]);

    if (!clientDetails) return <div className="flex flex-col items-center justify-center min-h-[400px] text-center"><p className="font-serif text-[20px] text-ink">Please select a client to begin analysis</p></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-[24px] font-serif font-bold text-ink">Analytical workbench</h1>
                        <div className="flex items-center gap-2">

                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isGeneratingCharts && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/80 text-green-700 text-2xs font-bold rounded-full border border-green-200 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Generating...
                        </span>
                    )}
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex bg-white/50 p-1 rounded-2xl prem-card w-fit">
                {(['chart', 'dignity', 'lagna'] as const).map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'lagna') setSelectedChartType('arudha_lagna'); else if (tab === 'chart') setSelectedChartType('D1'); }} className={cn("px-6 py-2 rounded-xl text-[12px] font-bold transition-all", activeTab === tab ? COLORS.wbActiveTab : "text-ink hover:bg-surface-warm")}>
                        {tab === 'lagna' ? 'Lagna analysis' : tab === 'dignity' ? 'Dignity matrix' : 'Interactive chart'}
                    </button>
                ))}
            </div>

            {/* Error Banner */}
            {generateError && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-800 text-[14px] rounded-lg px-4 py-2">
                    <span className="font-serif">{generateError}</span>
                    <button onClick={() => setGenerateError(null)} className="ml-2 text-red-600 hover:text-red-800 font-bold">✕</button>
                </div>
            )}

            {/* Content Area */}
            <div className={cn("grid grid-cols-1 gap-3", activeTab === 'dignity' ? "md:grid-cols-1" : "md:grid-cols-12")}>
                <div className={cn("space-y-6", activeTab === 'dignity' ? "md:col-span-1" : "md:col-span-5")}>
                    {activeTab === 'chart' || activeTab === 'lagna' ? (
                        <div className="prem-card rounded-lg overflow-hidden shadow-sm bg-surface-warm">
                            <div className="bg-gold-primary/10 px-3 py-1.5 border-b border-gold-primary/15 flex justify-between items-center">
                                <h3 className="font-serif text-[18px] font-semibold text-ink leading-tight tracking-wide">
                                    {activeTab === 'lagna' ? 'Lagna manifestation' : 'Interactive visualization'}
                                </h3>
                                <select
                                    className="text-[12px] bg-white/50 border border-gold-primary/20 rounded-lg px-2 py-0.5 focus:outline-none focus:border-gold-primary font-bold"
                                    value={selectedChartType}
                                    onChange={e => setSelectedChartType(e.target.value)}
                                >
                                    {activeTab === 'chart' ? (
                                        <>
                                            <optgroup label="Divisional charts (Vargas)">
                                                {divisionalCharts.map(c => <option key={c} value={c}>{c} - {CHART_NAMES[c] || c}</option>)}
                                            </optgroup>
                                        </>
                                    ) : (
                                        <optgroup label="Lagna analysis">
                                            {lagnaCharts.map(c => <option key={c} value={c}>{CHART_NAMES[c] || c.toUpperCase() + ' analysis'}</option>)}
                                        </optgroup>
                                    )}
                                </select>
                            </div>
                            <div className="w-full min-h-[300px] h-[50vh] max-h-[500px] bg-surface-warm">
                                {isLoadingCharts && Object.keys(processedCharts).length === 0 ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-gold-primary animate-spin" /></div>
                                ) : displayPlanets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={ascendantSign} planets={displayPlanets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" showDegrees={selectedChartType === 'D1'} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-6 h-full">
                                        <p className="text-ink italic mb-4">No data for {CHART_NAMES[selectedChartType] || selectedChartType}</p>
                                        <button
                                            onClick={handleGenerateChart}
                                            className="px-6 py-2 bg-gold-primary text-ink rounded-xl font-bold hover:shadow-lg transition-all"
                                        >
                                            {isGeneratingLocal ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                `Generate ${selectedChartType}`
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {processedCharts[`shodasha_varga_signs_${activeSystem}`] || Object.values(processedCharts).some(c => c.chartType && c.chartType.startsWith('D')) ? (
                                <ShodashaDignity data={{ charts: Object.values(processedCharts) }} activeSystem={activeSystem} />
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-copper-100 border-dashed p-12 text-center shadow-xl">
                                    <div className="p-6 bg-copper-50 rounded-full mb-6">
                                        <Shield className="w-12 h-12 text-copper-300" />
                                    </div>
                                    <h3 className="text-[24px] font-serif font-bold text-copper-900 mb-3">Shodasha analysis required</h3>
                                    <p className="text-copper-600 mb-8 max-w-md leading-relaxed font-medium">
                                        To view the complete Dignity Matrix and Vimsopaka strengths, we need to generate the Shodasha varga summary.
                                    </p>
                                    <button
                                        onClick={() => clientApi.generateChart(clientDetails.id!, 'shodasha_varga_signs', activeSystem).then(refreshCharts)}
                                        className="px-10 py-4 bg-copper-900 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3 group"
                                    >
                                        {isGeneratingLocal ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                                        )}
                                        Generate dignity analysis
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                {activeTab !== 'dignity' && (
                    <div className="space-y-4 h-full md:col-span-7">
                        <div className="prem-card rounded-lg overflow-hidden shadow-sm bg-surface-warm flex flex-col h-full">
                            <div className="bg-gold-primary/10 px-4 py-2 border-b border-gold-primary/15 shrink-0">
                                <h3 className="font-serif text-[18px] font-semibold text-ink leading-tight tracking-wide">Birth planetary positions</h3>
                            </div>

                            <div className="p-0 flex-1 overflow-auto scrollbar-hide">
                                <PlanetaryTable
                                    planets={planetaryTableData}
                                    variant="expanded"
                                    rowClassName="py-2.5"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickToolCard({ href, icon, title, desc, disabled = false }: { href: string; icon: React.ReactNode; title: string; desc: string; disabled?: boolean }) {
    return (
        <Link href={disabled ? '#' : href} className={cn("block group p-4 rounded-2xl border transition-all", disabled ? "opacity-50 grayscale cursor-not-allowed border-gold-primary/20" : "bg-surface-pure border-gold-primary/20 hover:border-gold-primary hover:shadow-lg")}>
            <div className="w-10 h-10 rounded-xl bg-gold-primary/10 flex items-center justify-center mb-3 group-hover:bg-gold-primary group-hover:text-white transition-all">{icon}</div>
            <h3 className="font-bold text-ink text-[14px] mb-1">{title}</h3>
            <p className="text-2xs text-ink leading-tight">{desc}</p>
        </Link>
    );
}
