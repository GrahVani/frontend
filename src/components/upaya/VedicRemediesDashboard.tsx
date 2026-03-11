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
                    <div className="p-4 space-y-3">

                        {/* Section 1: Dasha Remedies */}
                        <DashaRemediesCard dashaData={dashaRemedies} />

                        {/* Section 2: Planetary Strength */}
                        <VedicStrengthPanel planetaryStrength={planetaryStrength} />

                        {/* Section 3: Dosha Remedies */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                            <div className="flex items-center gap-3 mb-4 px-1">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <ScrollText className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className={cn(TYPOGRAPHY.label, "mb-0 text-ink tracking-[0.2em]")}>Active <KnowledgeTooltip term="dosha_system">dosha</KnowledgeTooltip> analysis</h3>
                                    <p className={cn(TYPOGRAPHY.subValue, "uppercase tracking-wider text-[10px] font-bold")}>Karmic afflictions & remedial directives</p>
                                </div>
                            </div>
                            <DoshaRemedyGrid
                                doshaRemedies={doshaRemedies}
                                doshaAnalysis={analysis?.doshas || {}}
                            />
                        </div>

                        {/* Section 4: General Recommendations */}
                        {generalRecommendations.length > 0 && (
                            <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/60">General daily alignment</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {generalRecommendations.map((rec: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 text-[11px] p-3 rounded-xl border border-gold-primary/15 bg-white/50 hover:bg-white transition-all group">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            <span className="font-semibold leading-relaxed">{rec}</span>
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
