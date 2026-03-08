"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
    Scroll,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Gem,
    Utensils,
    Gift,
    BookOpen,
    Info,
    Sun,
    Moon
} from 'lucide-react';

import { TYPOGRAPHY } from '@/design-tokens/typography';

interface LalKitabDashboardProps {
    data: Record<string, unknown>;
    className?: string;
}

export default function LalKitabDashboard({ data, className }: LalKitabDashboardProps) {
    if (!data || !data.data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic Lal Kitab response shape
    const remedyData = data.data as any;
    const details = remedyData.details || {};
    const planetInfo = remedyData.planet_info || {};

    return (
        <div className={cn(
            "h-full max-h-[85vh] rounded-[2rem] bg-surface-warm border-4 border-gold-primary/10 shadow-2xl flex flex-col overflow-hidden relative",
            className
        )}>
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,#4A3B2A_1px,transparent_0)] [background-size:24px_24px]"></div>

            {/* Premium Header */}
            <div className="shrink-0 bg-gradient-to-b from-gold-primary/10 to-divider p-4 border-b-2 border-gold-primary/15 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Scroll className="w-20 h-20 text-text-tertiary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/40 rounded-2xl shadow-inner border border-white/20 backdrop-blur-sm">
                            <Sparkles className="w-6 h-6 text-gold-dark" />
                        </div>
                        <div>
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] font-black tracking-tight flex items-center gap-3")}>
                                Lal kitab remedial plan
                            </h2>
                            <p className={cn(TYPOGRAPHY.label, "mt-0.5 text-ink/45")}>
                                Accurate prescription for <span className="text-gold-dark font-bold">{String(data.user_name || "Sadhaka")}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm text-center">
                            <p className="text-[10px] uppercase font-black text-gold-dark mb-0.5">Cycle duration</p>
                            <p className="text-[14px] font-serif font-bold text-text-tertiary">{remedyData.remedy_cycle || "43 Days"}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm text-center">
                            <p className="text-[10px] uppercase font-black text-gold-dark mb-0.5">Primary focus</p>
                            <p className="text-[14px] font-serif font-bold text-text-tertiary">{remedyData.planet} in {remedyData.house}{getOrdinal(remedyData.house)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Flush bottom with footer */}
            <div className="flex-1 px-4 pt-4 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Main Remedy Card */}
                    <RemedyAnalysisCard
                        title={`${remedyData.planet} (${remedyData.planet === 'Ketu' ? 'Dragon\'s Tail' : remedyData.planet})`}
                        focus={`${remedyData.house}${getOrdinal(remedyData.house)} House Stability`}
                        diagnosis={details.malefic || "Planetary imbalance detected."}
                        remedy={details.remedies?.[0] || "Consult expert for guidance."}
                        time={remedyData.best_time}
                        constraint={`Cycle: ${remedyData.remedy_cycle || '43 Days'}`}
                        status="Recommended"
                        icon={remedyData.planet === 'Sun' ? Sun : remedyData.planet === 'Moon' ? Moon : Sparkles}
                        accent="amber"
                    />

                    {/* Technical Analysis Card */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-parchment-soft shadow-sm flex-1 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <h3 className="text-[14px] font-serif font-black text-text-tertiary mb-4 uppercase tracking-widest flex items-center gap-2">
                                <Scroll className="w-4 h-4 text-gold-dark" />
                                Scriptural diagnosis
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-surface-warm p-3 rounded-xl border border-parchment-soft/50">
                                    <p className="text-[10px] font-black text-gold-dark uppercase mb-1">Karmic trigger</p>
                                    <p className="text-[12px] text-text-tertiary font-medium leading-relaxed italic">
                                        "{details.why || "Planetary energy requires specific material grounding to stabilize."}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-surface-warm rounded-xl border border-parchment-soft/30">
                                        <p className="text-[10px] font-bold text-ink/45 mb-1 uppercase">Positive</p>
                                        <p className="text-[11px] text-status-success font-bold">{details.benefic || "Neutral"}</p>
                                    </div>
                                    <div className="p-3 bg-status-error/5 rounded-xl border border-red-100">
                                        <p className="text-[10px] font-bold text-red-800 mb-1 uppercase">Warning</p>
                                        <p className="text-[11px] text-red-700 font-bold">{details.malefic?.split(',')[0] || "Alert"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Practical Karma Box */}
                        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[12px] font-black text-sky-800 uppercase tracking-wider mb-1">Practical logic</h4>
                                <p className="text-[12px] text-sky-700 leading-snug">{details.practical || "Ensure consistency in actions for best results."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Remedies & Cautions */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-parchment-soft shadow-sm flex-1 relative flex flex-col">
                            <h3 className="text-[14px] font-serif font-black text-text-tertiary mb-3 uppercase tracking-widest flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-gold-dark" />
                                Supplementary measures
                            </h3>
                            <div className="flex-1 space-y-2 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                                {details.remedies?.slice(1).map((r: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 bg-surface-pure rounded-xl border border-gold-primary/15">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-[11px] text-text-tertiary font-medium leading-tight">{r}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-parchment-soft">
                                <h4 className="text-[12px] font-black text-red-800 uppercase mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Major cautions
                                </h4>
                                <ul className="space-y-1">
                                    {details.cautions?.map((c: string, idx: number) => (
                                        <li key={idx} className="text-[10px] text-red-700 font-bold flex items-start gap-2">
                                            <span className="shrink-0 mt-1 w-1 h-1 bg-red-400 rounded-full"></span>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Golden Rules Footer - light Premium Scroll Style */}
            <div className="shrink-0 px-4 pb-6 pt-2 bg-gradient-to-t from-gold-primary/10 to-surface-warm relative">
                {/* Subtle Texture */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,#4A3B2A_1px,transparent_0)] [background-size:16px_16px]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-[1px] w-12 bg-gold-primary/30"></div>
                        <h3 className="text-text-tertiary font-serif font-black text-[14px] uppercase tracking-[0.3em] flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-gold-dark" />
                            Golden rules for success
                            <Sparkles className="w-4 h-4 text-gold-dark" />
                        </h3>
                        <div className="h-[1px] w-12 bg-gold-primary/30"></div>
                    </div>

                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-gold-primary/10 group-hover:border-gold-primary transition-colors shadow-sm">
                                <Sun className="w-5 h-5 text-gold-dark" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gold-dark font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 1</p>
                                <p className="text-text-tertiary text-[11px] leading-tight font-bold">Perform during daylight (Sunrise to Sunset) only.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-gold-primary/10 group-hover:border-gold-primary transition-colors shadow-sm">
                                <Utensils className="w-5 h-5 text-gold-dark" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gold-dark font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 2</p>
                                <p className="text-text-tertiary text-[11px] leading-tight font-bold">Initiate only one new remedy per progression day.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="p-2.5 bg-white/60 rounded-xl border-2 border-gold-primary/10 group-hover:border-gold-primary transition-colors shadow-sm">
                                <Calendar className="w-5 h-5 text-gold-dark" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gold-dark font-black text-[10px] uppercase tracking-wider mb-0.5">Rule 3</p>
                                <p className="text-text-tertiary text-[11px] leading-tight font-bold">Maintain 43-day continuity for permanent effects.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for individual remedy cards with Slide 3 premium feel
function RemedyAnalysisCard({ title, focus, diagnosis, remedy, time, constraint, status, icon: Icon, accent }: {
    title: string;
    focus: string;
    diagnosis: string;
    remedy: string;
    time: string;
    constraint: string;
    status: string;
    icon: React.ElementType;
    accent: string;
}) {
    return (
        <div className="bg-white rounded-[2rem] border-2 border-parchment-soft shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-gold-primary/40 transition-all duration-300">
            {/* Card Header */}
            <div className={cn(
                "p-4 border-b-2 text-white",
                accent === 'amber' ? "bg-gradient-to-r from-gold-primary to-copper-dark border-copper-dark" : "bg-gradient-to-r from-sky-700 to-sky-900 border-sky-900"
            )}>
                <h4 className="text-[14px] font-serif font-black uppercase tracking-tight">{title} <span className="mx-2 opacity-50">|</span> {focus}</h4>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-24 h-24 rounded-2xl bg-surface-warm border-2 border-parchment-soft/50 flex items-center justify-center relative overflow-hidden group-hover:bg-surface-warm">
                        <Icon className="w-12 h-12 text-gold-dark opacity-80 group-hover:scale-110 transition-transform" />
                        {/* Status Check */}
                        <div className="absolute top-1 right-1">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-[10px] font-black text-gold-dark uppercase tracking-wider">Diagnosis</p>
                            <p className="text-[12px] text-text-tertiary font-bold leading-snug mt-0.5">{diagnosis}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gold-dark uppercase tracking-wider">Remedy</p>
                            <p className="text-[12px] text-text-tertiary font-medium leading-relaxed mt-0.5">{remedy}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-surface-pure p-2 rounded-xl border border-gold-primary/15">
                        <p className="text-[9px] font-black text-ink/45 uppercase">Time</p>
                        <p className="text-[10px] text-text-tertiary font-bold">{time || "Daylight"}</p>
                    </div>
                    <div className="bg-surface-pure p-2 rounded-xl border border-gold-primary/15">
                        <p className="text-[9px] font-black text-ink/45 uppercase">Constraint</p>
                        <p className="text-[10px] text-text-tertiary font-bold">{constraint}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gold-primary/15">
                    <div className="flex items-center gap-1.5 uppercase text-[10px] font-black text-ink/45">
                        Status: <span className="text-green-600">{status}</span>
                    </div>
                    <div className="w-32 h-2 bg-gold-primary/10 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[12%]" />
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
