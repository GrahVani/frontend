"use client";

import React from 'react';
import {
    Sparkles,
    BookOpen,
    Heart,
    Flower2,
    Compass,
    CheckCircle2,
    Crown,
    ScrollText
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DashaRemediesCard from '@/components/upaya/DashaRemediesCard';
import DoshaRemedyGrid from '@/components/upaya/DoshaRemedyGrid';
import VedicStrengthPanel from '@/components/upaya/VedicStrengthPanel';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import DashaMantraPanel from '@/components/upaya/DashaMantraPanel';
import WeakPlanetSadhana from '@/components/upaya/WeakPlanetSadhana';
import MantraTimingCard from '@/components/upaya/MantraTimingCard';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';

interface VedicRemediesDashboardProps {
    data: Record<string, unknown>;
}

const VedicRemediesDashboard: React.FC<VedicRemediesDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Extract data from the complex nested structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analysis = (data?.analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remedies = (data?.remedies || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mantraAnalysis = (data?.mantra_analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detailedAnalysis = (data?.detailed_analysis || {}) as any;

    const dashaRemedies = remedies?.dasha_remedies || {};
    const doshaRemedies = remedies?.dosha_remedies || {};
    const planetaryStrength = analysis?.planetary_strength || {};
    const generalRecommendations = remedies?.general_recommendations || [];

    const timing = mantraAnalysis?.current_timing || {};
    const dashaMantras = mantraAnalysis?.dasha_mantras || [];
    const weakPlanets = mantraAnalysis?.weak_planets || [];
    const recommendations = mantraAnalysis?.recommendations || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yantras = (data?.yantra_recommendations as any[]) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const planetaryStrengths = (data?.planetary_strengths as any) || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const functionalNature = (data?.functional_nature as any) || {};
    const currentDasha = data?.current_dasha as string;

    // Fallback for D1 Chart
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("animate-in fade-in duration-700 flex flex-col h-full overflow-hidden", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between border-b border-divider pb-3">
                    <div className="flex items-center gap-3">
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] lg:text-[22px] font-bold tracking-tight")}>
                            Vedic Remedies : {String(data.user_name || "User")}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Karmic diagnostics</span>
                    </div>
                </div>
            </div>

            {/* Main Split Layout: Fixed Left + Scrollable Right */}
            <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0 relative z-10">

                {/* LEFT COLUMN - Fixed/Sticky Chart & Planetary Vigor */}
                <div className="w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                    <VedicStrengthPanel planetaryStrength={planetaryStrength} />
                </div>

                {/* RIGHT COLUMN - Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(180,83,9,0.2) transparent'
                    }}>

                    {/* 1. Dasha Remedies */}
                    <DashaRemediesCard dashaData={dashaRemedies} />

                    {/* 2. Spiritual Focus (Mantras & Yantras) */}
                    <div className="rounded-[2rem] bg-[rgba(254,250,234,0.6)] border border-antique shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-3 space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] font-bold tracking-tight")}>Spiritual Focus (Mantras & Yantras)</h2>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            {dashaMantras.length > 0 && <DashaMantraPanel mantras={dashaMantras} />}
                            {yantras.length > 0 && <MantraFocusPanel currentDasha={currentDasha} yantras={yantras} />}

                            {weakPlanets.length > 0 && (
                                <>
                                    <div className="h-px bg-amber-900/10 mx-1" />
                                    <WeakPlanetSadhana weakPlanets={weakPlanets} />
                                </>
                            )}

                            {Object.keys(planetaryStrengths).length > 0 && (
                                <>
                                    <div className="h-px bg-amber-900/10 mx-1" />
                                    <StrengtheningPanel
                                        planetaryStrengths={planetaryStrengths}
                                        functionalNature={functionalNature}
                                    />
                                </>
                            )}

                            {timing && Object.keys(timing).length > 0 && (
                                <>
                                    <div className="h-px bg-amber-900/10 mx-1" />
                                    <MantraTimingCard timing={timing} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* 3. Active Dosha Analysis */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4 px-4">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <ScrollText className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <h3 className={cn(TYPOGRAPHY.label, "mb-0 text-ink tracking-[0.2em] text-[13px]")}>Active dosha analysis</h3>
                                <p className={cn(TYPOGRAPHY.subValue, "uppercase tracking-wider text-[11px] font-bold")}>Karmic afflictions & remedial directives</p>
                            </div>
                        </div>
                        <DoshaRemedyGrid
                            doshaRemedies={doshaRemedies}
                            doshaAnalysis={analysis?.doshas || {}}
                        />
                    </div>

                    {/* 4. General Recommendations */}
                    {generalRecommendations.length > 0 && (
                        <div className="border-t border-antique pt-6 bg-white/30 rounded-[2.5rem] p-5">
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em]">General daily alignment</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {generalRecommendations.slice(0, 4).map((rec: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 text-[11px] p-4 rounded-2xl border border-antique bg-white/50 backdrop-blur-sm hover:border-purple-200 transition-all group text-body">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] font-semibold leading-relaxed">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VedicRemediesDashboard;
