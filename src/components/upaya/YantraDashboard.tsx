"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import MantraFocusPanel from '@/components/upaya/MantraFocusPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

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
        <div className={cn("h-full overflow-hidden flex flex-col", styles.dashboardContainer, className)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-gold-primary/20 px-5 py-2.5 shrink-0 bg-surface-warm/50">
                <div className="flex items-center gap-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold tracking-tight !mb-0")}>
                        <KnowledgeTooltip term="general_yantra">Yantras</KnowledgeTooltip> : {String(data.user_name || "Sadhaka")}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                </div>
            </div>

            {/* Main Split Layout: 30% Chart | 70% Data */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-gold-primary/15">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={detailedAnalysis?.doshas || {}}
                    />
                </div>

                {/* RIGHT SIDE: Scrollable Content, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-4 space-y-3">
                        {/* Today's Yantra Focus */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] font-bold tracking-tight !mb-0")}>Today&apos;s <KnowledgeTooltip term="general_yantra">yantra</KnowledgeTooltip> focus (priority)</h2>
                            </div>

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

                        {/* Legend / Insights */}
                        <div className="bg-white/30 rounded-xl px-3 py-2.5 border border-gold-primary/15 flex items-center gap-4">
                            <h4 className="text-[9px] font-medium uppercase tracking-[0.15em] text-amber-900/50 shrink-0">Insights</h4>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Karmic
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <KnowledgeTooltip term="dasha_system">Dasha</KnowledgeTooltip>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Growth
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
