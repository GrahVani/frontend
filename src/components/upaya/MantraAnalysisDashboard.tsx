"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Flame,
    Droplets,
    CheckCircle2,
    Sparkles,
    ScrollText,
    Flower2,
    Calendar,
    Sunrise,
    Sun,
    Moon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import MantraTimingCard from '@/components/upaya/MantraTimingCard';
import DashaMantraPanel from '@/components/upaya/DashaMantraPanel';
import WeakPlanetSadhana from '@/components/upaya/WeakPlanetSadhana';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import { useVedicClient } from '@/context/VedicClientContext';
import styles from './RemedialShared.module.css';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface MantraAnalysisDashboardProps {
    data: Record<string, unknown>;
}

const MantraAnalysisDashboard: React.FC<MantraAnalysisDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Extract data from the nested structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic mantra analysis response
    const analysis = (data?.analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mantraAnalysis = (data?.mantra_analysis || {}) as any;

    // Fallback for D1 Chart
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    const timing = mantraAnalysis?.current_timing || {};
    const dashaMantras = mantraAnalysis?.dasha_mantras || [];
    const weakPlanets = mantraAnalysis?.weak_planets || [];
    const recommendations = mantraAnalysis?.recommendations || [];

    return (
        <div className={cn("animate-in fade-in duration-700 flex flex-col h-full overflow-hidden", styles.dashboardContainer)}>
            {/* Header Area */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between border-b border-divider pb-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] lg:text-[22px] font-bold tracking-tight")}>
                        Mantras : {String(data.user_name || "Sadhaka")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                    </div>
                </div>
            </div>

            {/* Main Split Layout: Fixed Left Chart + Scrollable Right */}
            <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0 relative z-10">
                {/* LEFT COLUMN - Fixed D1 Chart */}
                <div className="w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
                    {d1Chart && (
                        <SadhanaChartPanel
                            chartData={d1Chart}
                            doshaStatus={analysis?.doshas || {}}
                        />
                    )}
                </div>

                {/* RIGHT COLUMN - Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(180,83,9,0.2) transparent'
                    }}>

                    <div className="rounded-[2rem] bg-[rgba(254,250,234,0.6)] border border-antique shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-4 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] font-bold tracking-tight")}>Today's mantra focus (priority)</h2>
                        </div>

                        <div className="space-y-4">
                            <DashaMantraPanel mantras={dashaMantras} />

                            <div className="h-px bg-amber-900/10 mx-1" />

                            {weakPlanets.length > 0 ? (
                                <WeakPlanetSadhana weakPlanets={weakPlanets} />
                            ) : (
                                <div className="p-4 text-center bg-white/40 rounded-xl border border-antique/20">
                                    <Sparkles className="w-5 h-5 text-amber-300 mx-auto mb-1 opacity-50" />
                                    <p className="text-[13px] font-medium tracking-[0.05em] text-amber-900/40">Harmonic balance achieved</p>
                                </div>
                            )}

                            <div className="h-px bg-amber-900/10 mx-1" />

                            <div className="space-y-2">
                                <h3 className="text-[13px] font-bold tracking-[0.05em] text-amber-900/60 px-1 uppercase">Daily ritual sequence</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {recommendations.map((item: { category: string; action: string; note: string }, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-white/40 border-antique/20 hover:bg-white/60 transition-all group cursor-pointer"
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 rounded-full border border-antique/30 flex items-center justify-center text-[12px] font-bold bg-white group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 text-muted transition-all">
                                                {idx + 1}
                                            </div>
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/40 shrink-0">{item.category}</span>
                                                    <span className="text-sm font-semibold text-ink/80 truncate">{item.action}</span>
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-400 mt-0.5">{item.note}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-amber-900/10 mx-1" />

                            {/* Sacred Timing — compact horizontal strip */}
                            <MantraTimingCard timing={timing} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MantraAnalysisDashboard;
