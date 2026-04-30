"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
    Scroll,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Utensils,
    BookOpen,
    Sun,
    Moon
} from 'lucide-react';

import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';

interface LalKitabDashboardProps {
    data: Record<string, unknown>;
    className?: string;
}

export default function LalKitabDashboard({ data, className }: LalKitabDashboardProps) {
    const { processedCharts } = useVedicClient();
    if (!data || !data.data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic Lal Kitab response shape
    const remedyData = data.data as any;
    const details = remedyData.details || {};
    const planetInfo = remedyData.planet_info || {};

    // Fallback for D1 Chart
    const d1Chart = processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("h-full overflow-hidden flex flex-col", styles.dashboardContainer, className)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-amber-300/60 px-5 py-2.5 shrink-0 bg-amber-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/40 rounded-xl border border-white/20">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold tracking-tight !mb-0")}>
                            <KnowledgeTooltip term="general_lal_kitab">Lal Kitab</KnowledgeTooltip> : {String(data.user_name || "Sadhaka")}
                        </h2>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200/60 text-center">
                        <p className="text-[9px] uppercase font-black text-amber-700">Cycle</p>
                        <p className="text-[12px] font-serif font-bold text-amber-800/80">{remedyData.remedy_cycle || "43 Days"}</p>
                    </div>
                    <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200/60 text-center">
                        <p className="text-[9px] uppercase font-black text-amber-700">Focus</p>
                        <p className="text-[12px] font-serif font-bold text-amber-800/80">{remedyData.planet} in {remedyData.house}{getOrdinal(remedyData.house)}</p>
                    </div>
                </div>
            </div>

            {/* Main Split Layout: 30% Chart | 70% Data */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-amber-200/60">
                    {d1Chart ? (
                        <SadhanaChartPanel
                            chartData={d1Chart as Record<string, unknown>}
                            doshaStatus={{} as Record<string, boolean>}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-amber-50/40">
                            <div className="text-center p-4">
                                <Scroll className="w-12 h-12 text-amber-500/30 mx-auto mb-2" />
                                <p className="text-[11px] text-amber-700/40 font-medium">Chart unavailable</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: Scrollable Content, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-4 space-y-3">

                        {/* Section 1: Main Remedy Card */}
                        <div className="rounded-2xl bg-white border-2 border-amber-200/60 overflow-hidden">
                            <div className="p-3 bg-gradient-to-r from-gold-primary to-amber-700 text-white">
                                <h4 className="text-[13px] font-serif font-black uppercase tracking-tight">
                                    {remedyData.planet} ({remedyData.planet === 'Ketu' ? "Dragon's Tail" : remedyData.planet})
                                    <span className="mx-2 opacity-50">|</span>
                                    {remedyData.house}{getOrdinal(remedyData.house)} House Stability
                                </h4>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-16 h-16 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-center">
                                        {remedyData.planet === 'Sun' ? <Sun className="w-8 h-8 text-amber-700 opacity-80" /> :
                                            remedyData.planet === 'Moon' ? <Moon className="w-8 h-8 text-amber-700 opacity-80" /> :
                                                <Sparkles className="w-8 h-8 text-amber-700 opacity-80" />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Diagnosis</p>
                                            <p className="text-[12px] text-amber-800/70 font-bold leading-snug mt-0.5">{details.malefic || "Planetary imbalance detected."}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider"><KnowledgeTooltip term="general_upaya">Remedy</KnowledgeTooltip></p>
                                            <p className="text-[12px] text-amber-800/70 font-medium leading-relaxed mt-0.5">{details.remedies?.[0] || "Consult expert for guidance."}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                                        <p className="text-[9px] font-black text-amber-700/40 uppercase">Time</p>
                                        <p className="text-[10px] text-amber-800/70 font-bold">{remedyData.best_time || "Daylight"}</p>
                                    </div>
                                    <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                                        <p className="text-[9px] font-black text-amber-700/40 uppercase">Cycle</p>
                                        <p className="text-[10px] text-amber-800/70 font-bold">{remedyData.remedy_cycle || "43 Days"}</p>
                                    </div>
                                    <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                                        <p className="text-[9px] font-black text-amber-700/40 uppercase">Status</p>
                                        <p className="text-[10px] text-emerald-600 font-bold">Recommended</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Scriptural Diagnosis */}
                        <div className="rounded-2xl bg-white/60 border border-amber-200/60 p-4">
                            <h3 className="text-[13px] font-serif font-black text-amber-800/80 mb-3 uppercase tracking-widest flex items-center gap-2">
                                <Scroll className="w-4 h-4 text-amber-700" />
                                Scriptural diagnosis
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                                    <p className="text-[10px] font-black text-amber-700 uppercase mb-1">Karmic trigger</p>
                                    <p className="text-[12px] text-amber-700/60 font-medium leading-relaxed italic">
                                        &quot;{details.why || "Planetary energy requires specific material grounding to stabilize."}&quot;
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                                        <p className="text-[10px] font-bold text-amber-700/45 mb-1 uppercase">Positive</p>
                                        <p className="text-[11px] text-emerald-600 font-bold">{details.benefic || "Neutral"}</p>
                                    </div>
                                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                                        <p className="text-[10px] font-bold text-rose-800 mb-1 uppercase">Warning</p>
                                        <p className="text-[11px] text-rose-700 font-bold">{details.malefic?.split(',')[0] || "Alert"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Practical Logic */}
                        <div className="rounded-xl bg-sky-50/50 border border-sky-100 p-4 flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[11px] font-black text-sky-800 uppercase tracking-wider mb-1">Practical logic</h4>
                                <p className="text-[12px] text-sky-700 leading-snug">{details.practical || "Ensure consistency in actions for best results."}</p>
                            </div>
                        </div>

                        {/* Section 4: Supplementary Measures */}
                        {details.remedies?.length > 1 && (
                            <div className="rounded-2xl bg-white/60 border border-amber-200/60 p-4">
                                <h3 className="text-[13px] font-serif font-black text-amber-800/80 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-amber-700" />
                                    Supplementary measures
                                </h3>
                                <div className="space-y-2">
                                    {details.remedies?.slice(1).map((r: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="text-[11px] text-amber-800/70 font-medium leading-tight">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section 5: Cautions */}
                        {details.cautions?.length > 0 && (
                            <div className="rounded-2xl bg-rose-50/30 border border-rose-200/30 p-4">
                                <h4 className="text-[12px] font-black text-rose-800 uppercase mb-2.5 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Major cautions
                                </h4>
                                <ul className="space-y-1.5">
                                    {details.cautions?.map((c: string, idx: number) => (
                                        <li key={idx} className="text-[11px] text-rose-700 font-bold flex items-start gap-2">
                                            <span className="shrink-0 mt-1.5 w-1 h-1 bg-rose-400 rounded-full"></span>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Section 6: Golden Rules */}
                        <div className="rounded-2xl bg-white/60 border border-amber-200/60 p-4">
                            <div className="flex items-center gap-3 mb-3 justify-center">
                                <div className="h-[1px] w-8 bg-amber-500/30"></div>
                                <h3 className="text-amber-800/70 font-serif font-black text-[12px] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                    Golden rules for success
                                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                </h3>
                                <div className="h-[1px] w-8 bg-amber-500/30"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-white/60 rounded-lg border border-amber-200/60">
                                        <Sun className="w-4 h-4 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="text-amber-700 font-black text-[9px] uppercase tracking-wider mb-0.5">Rule 1</p>
                                        <p className="text-amber-800/70 text-[10px] leading-tight font-bold">Perform during daylight (Sunrise to Sunset) only.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-white/60 rounded-lg border border-amber-200/60">
                                        <Utensils className="w-4 h-4 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="text-amber-700 font-black text-[9px] uppercase tracking-wider mb-0.5">Rule 2</p>
                                        <p className="text-amber-800/70 text-[10px] leading-tight font-bold">Initiate only one new remedy per progression day.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-white/60 rounded-lg border border-amber-200/60">
                                        <Calendar className="w-4 h-4 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="text-amber-700 font-black text-[9px] uppercase tracking-wider mb-0.5">Rule 3</p>
                                        <p className="text-amber-800/70 text-[10px] leading-tight font-bold">Maintain 43-day continuity for permanent effects.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for ordinal suffix
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
