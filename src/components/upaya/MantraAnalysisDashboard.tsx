"use client";

import React from 'react';
import {
    Sparkles,
    Star,
    Clock,
    Info,
    ChevronRight,
    Zap,
    Target,
    BookOpen,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import MantraTimingCard from '@/components/upaya/MantraTimingCard';
import DashaMantraPanel from '@/components/upaya/DashaMantraPanel';
import WeakPlanetSadhana from '@/components/upaya/WeakPlanetSadhana';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import { useVedicClient } from '@/context/VedicClientContext';
import styles from './RemedialShared.module.css';
import { KnowledgeTooltip } from '@/components/knowledge';

import { TYPOGRAPHY } from '@/design-tokens/typography';

interface MantraAnalysisDashboardProps {
    data: Record<string, unknown>;
}

const MantraAnalysisDashboard: React.FC<MantraAnalysisDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analysis = (data?.analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mantraAnalysis = (data?.mantra_analysis || {}) as any;

    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    const timing = mantraAnalysis?.current_timing || {};
    const dashaMantras = mantraAnalysis?.dasha_mantras || [];
    const weakPlanets = mantraAnalysis?.weak_planets || [];
    const recommendations = mantraAnalysis?.recommendations || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartSummary = (data?.chart_summary || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const planetaryPositions = (data?.planetary_positions || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const systemInfo = (data?.system_info || {}) as any;

    const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    return (
        <div className={cn("h-full overflow-hidden flex flex-col", styles.dashboardContainer)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area - Compact */}
            <div className="flex items-center justify-between border-b border-gold-primary/20 px-5 py-2.5 shrink-0 bg-surface-warm/50">
                <div className="flex items-center gap-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold tracking-tight !mb-0")}>
                        <KnowledgeTooltip term="general_mantra">Mantras</KnowledgeTooltip> : {String(data.user_name || "Sadhaka")}
                    </h2>
                </div>
                {chartSummary?.sun_sign && (
                    <div className="flex items-center gap-3 text-[11px] font-medium text-ink/50">
                        <span>☉ {chartSummary.sun_sign}</span>
                        <span>☽ {chartSummary.moon_sign}</span>
                        <span>Asc {chartSummary.ascendant}</span>
                        <span>☆ {chartSummary.moon_nakshatra}</span>
                    </div>
                )}
            </div>

            {/* Main Dashboard Layout: 40% Chart Left (fixed) | 60% Data Right (scroll) */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-gold-primary/15">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={analysis?.doshas || {}}
                    />
                </div>

                {/* RIGHT SIDE: All Data — Scrollable, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-4 space-y-3">

                        {/* Sacred Timing Analysis */}
                        <MantraTimingCard timing={timing} />

                        {/* Section 1: Dasha Period Mantras */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold tracking-tight text-ink">
                                        1. High Priority: <KnowledgeTooltip term="dasha_system">Dasha</KnowledgeTooltip> Period <KnowledgeTooltip term="general_mantra">Mantras</KnowledgeTooltip>
                                    </h3>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse" />
                            </div>
                            <DashaMantraPanel mantras={dashaMantras} />
                        </div>

                        {/* Section 2: Weak Planets Sadhana */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                                </div>
                                <h3 className="text-[14px] font-semibold tracking-tight text-ink">
                                    2. Long-Term Strengthening (Weak Planets)
                                </h3>
                            </div>
                            {weakPlanets.length > 0 ? (
                                <WeakPlanetSadhana weakPlanets={weakPlanets} />
                            ) : (
                                <div className="p-5 text-center bg-white/40 rounded-xl border border-gold-primary/10">
                                    <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-2 opacity-50" />
                                    <p className="text-[11px] font-medium tracking-[0.05em] text-amber-900/40">Harmonic balance achieved — no weak planets</p>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Recommendations */}
                        <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <h3 className="text-[14px] font-semibold tracking-tight text-ink">
                                    3. Daily Ritual Sequence & Recommendations
                                </h3>
                            </div>
                            {recommendations.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {recommendations.map((item: { category: string; action: string; note: string; priority: number }, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 p-3 rounded-xl border bg-white/80 transition-all group cursor-pointer border-gold-primary/15 hover:bg-white hover:shadow-sm"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gold-primary/20 flex items-center justify-center text-[11px] font-bold transition-all mt-0.5 bg-white group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-600 text-ink/45">
                                                {item.priority}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-[11px] font-bold tracking-widest mb-0.5 group-hover:text-amber-600 transition-colors text-ink/60 uppercase">{item.category}</h4>
                                                <p className="text-[13px] font-medium leading-snug mb-1.5 text-ink/80">{item.action}</p>
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50/60 border border-gold-primary/10 text-[10px] font-medium italic text-ink/45">
                                                    <Info className="w-2.5 h-2.5 shrink-0" />
                                                    <span className="truncate" title={item.note}>{item.note}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-ink/15 group-hover:text-amber-500 transition-colors shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 text-center bg-white/40 rounded-xl border border-gold-primary/10">
                                    <p className="text-[11px] font-medium text-ink/40">No specific recommendations</p>
                                </div>
                            )}
                        </div>

                        {/* Section 4: Planetary Positions Table */}
                        {Object.keys(planetaryPositions).length > 0 && (
                            <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Star className="w-3.5 h-3.5 text-purple-600" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold tracking-tight text-ink">
                                        4. Planetary Positions
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px]">
                                        <thead>
                                            <tr className="border-b border-gold-primary/15">
                                                <th className="text-left py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">Planet</th>
                                                <th className="text-left py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">Sign</th>
                                                <th className="text-right py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">Degree</th>
                                                <th className="text-right py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">Longitude</th>
                                                <th className="text-center py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">House</th>
                                                <th className="text-center py-2 px-2 font-bold text-ink/50 uppercase tracking-wider text-[10px]">Motion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {planetOrder.filter(p => planetaryPositions[p]).map((planet, idx) => {
                                                const pos = planetaryPositions[planet];
                                                return (
                                                    <tr key={planet} className={cn("border-b border-gold-primary/8 hover:bg-amber-50/30 transition-colors", idx % 2 === 0 ? "bg-white/30" : "")}>
                                                        <td className="py-1.5 px-2 font-semibold text-ink/90">{planet}</td>
                                                        <td className="py-1.5 px-2 text-ink/70">{pos.sign}</td>
                                                        <td className="py-1.5 px-2 text-right font-mono text-ink/70">{Number(pos.degree).toFixed(2)}°</td>
                                                        <td className="py-1.5 px-2 text-right font-mono text-ink/70">{Number(pos.longitude).toFixed(2)}°</td>
                                                        <td className="py-1.5 px-2 text-center font-semibold text-ink/70">{pos.house}</td>
                                                        <td className="py-1.5 px-2 text-center">
                                                            {pos.retrograde ? (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200/50">℞ Retro</span>
                                                            ) : (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200/50">Direct</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Section 5: System Info */}
                        {systemInfo?.version && (
                            <div className="rounded-2xl bg-white/60 border border-gold-primary/15 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-500/10 flex items-center justify-center">
                                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold tracking-tight text-ink">
                                        5. System Information
                                    </h3>
                                    <span className="ml-auto text-[10px] font-mono font-bold text-ink/30 bg-white/60 px-2 py-0.5 rounded border border-gold-primary/10">{systemInfo.version}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {systemInfo.corrections_applied?.length > 0 && (
                                        <div className="rounded-xl bg-white/50 border border-gold-primary/10 p-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-2">Corrections Applied</h4>
                                            <ul className="space-y-1">
                                                {systemInfo.corrections_applied.map((c: string, i: number) => (
                                                    <li key={i} className="text-[10px] text-ink/60 leading-snug flex items-start gap-1.5">
                                                        <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                                                        <span>{c}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {systemInfo.features?.length > 0 && (
                                        <div className="rounded-xl bg-white/50 border border-gold-primary/10 p-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-2">Features</h4>
                                            <ul className="space-y-1">
                                                {systemInfo.features.map((f: string, i: number) => (
                                                    <li key={i} className="text-[10px] text-ink/60 leading-snug flex items-start gap-1.5">
                                                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MantraAnalysisDashboard;
