"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface YantraDashboardProps {
    data: Record<string, unknown>;
    className?: string;
}

export default function YantraDashboard({ data, className }: YantraDashboardProps) {
    const { processedCharts } = useVedicClient();
    if (!data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    const detailedAnalysis = (data.detailed_analysis || {}) as any;

    // Fallback for D1 Chart
    const d1Chart = detailedAnalysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("animate-in fade-in duration-700 flex flex-col h-full overflow-hidden", styles.dashboardContainer, className)}>
            {/* Header Area */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between border-b border-divider pb-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] lg:text-[22px] font-bold tracking-tight")}>
                        Yantras : {String(data.user_name || "Sadhaka")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                    </div>
                </div>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 flex gap-4 px-4 pb-4 min-h-0 relative z-10">
                {/* LEFT COLUMN - Fixed D1 Chart & Insights */}
                <div className="w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={detailedAnalysis?.doshas || {}}
                    />

                    {/* Legend / Subtle Footer */}
                    <div className="bg-white/30 rounded-2xl px-3 py-2 border border-antique/20 flex items-center gap-4">
                        <h4 className="text-[9px] font-medium uppercase tracking-[0.15em] text-amber-900/50 shrink-0">Insights</h4>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Karmic
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Dasha
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Growth
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(180,83,9,0.2) transparent'
                    }}>

                    <div className="rounded-[2rem] bg-[rgba(254,250,234,0.6)] border border-antique shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-4 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] font-bold tracking-tight")}>Today&apos;s yantra focus (priority)</h2>
                        </div>

                        <div className="space-y-4">
                            <MantraFocusPanel
                                currentDasha={data.current_dasha as string}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                                yantras={data.yantra_recommendations as any[]}
                            />

                            <div className="h-px bg-amber-900/10 mx-1" />

                            <StrengtheningPanel
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                                planetaryStrengths={data.planetary_strengths as any}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
