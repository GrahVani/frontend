"use client";

import React from 'react';
import {
    Sparkles,
    CheckCircle2,
    ScrollText
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DashaRemediesCard from '@/components/upaya/DashaRemediesCard';
import DoshaRemedyGrid from '@/components/upaya/DoshaRemedyGrid';
import VedicStrengthPanel from '@/components/upaya/VedicStrengthPanel';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { KnowledgeTooltip } from '@/components/knowledge';


interface VedicRemediesDashboardProps {
    data: Record<string, unknown>;
}

const VedicRemediesDashboard: React.FC<VedicRemediesDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Extract data from the complex nested structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    const analysis = (data?.analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    const remedies = (data?.remedies || {}) as any;

    const dashaRemedies = remedies?.dasha_remedies || {};
    const doshaRemedies = remedies?.dosha_remedies || {};
    const planetaryStrength = analysis?.planetary_strength || {};
    const generalRecommendations = remedies?.general_recommendations || [];

    // Fallback for D1 Chart
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("h-full overflow-hidden flex flex-col", styles.dashboardContainer)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-gold-primary/20 px-5 py-2.5 shrink-0 bg-surface-warm/50">
                <div className="flex items-center gap-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold tracking-tight !mb-0")}>
                        Vedic <KnowledgeTooltip term="general_upaya">Remedies</KnowledgeTooltip> : {String(data.user_name || "User")}
                    </h2>
                </div>
            </div>

            {/* Main Split Layout: 30% Chart | 70% Data */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-gold-primary/15">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                </div>

                {/* RIGHT SIDE: Scrollable Content, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-3 space-y-2">

                        {/* Section 1: Dasha Remedies */}
                        <DashaRemediesCard dashaData={dashaRemedies} />

                        {/* Section 2: Planetary Strength */}
                        <VedicStrengthPanel planetaryStrength={planetaryStrength} />

                        {/* Section 3: Dosha Remedies */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/10 p-3">
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <ScrollText className="w-3.5 h-3.5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black text-ink tracking-[0.1em] leading-none mb-1">Active Dosha Analysis</h3>
                                    <p className="text-[8px] tracking-widest text-ink/40 font-bold">Karmic Afflictions & Strategic Protocol</p>
                                </div>
                            </div>
                            <DoshaRemedyGrid
                                doshaRemedies={doshaRemedies}
                                doshaAnalysis={analysis?.doshas || {}}
                            />
                        </div>

                        {/* Section 4: General Recommendations */}
                        {generalRecommendations.length > 0 && (
                            <div className="rounded-2xl bg-white/60 border border-gold-primary/10 p-3">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    <h4 className="text-[9px] font-black tracking-[0.2em] text-ink/40">General Daily Alignment</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {generalRecommendations.map((rec: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-[10px] p-2 rounded-xl border border-gold-primary/5 bg-white transition-all group">
                                            <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <CheckCircle2 className="w-2.5 h-2.5" />
                                            </div>
                                            <span className="font-semibold leading-tight text-ink/80">{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VedicRemediesDashboard;
