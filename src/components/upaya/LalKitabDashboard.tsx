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
    Moon,
    RefreshCw
} from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import { useVedicClient } from '@/context/VedicClientContext';

interface LalKitabDashboardProps {
    data: Record<string, unknown>;
    className?: string;
    selectedPlanet?: string;
    selectedHouse?: string;
    onPlanetChange?: (val: string) => void;
    onHouseChange?: (val: string) => void;
    onGetRemedies?: () => void;
}

const LK_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const LK_HOUSES = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function LalKitabDashboard({ data, className, selectedPlanet, selectedHouse, onPlanetChange, onHouseChange, onGetRemedies }: LalKitabDashboardProps) {
    const { processedCharts } = useVedicClient();

    if (!data || !data.data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic Lal Kitab response shape
    const remedyData = data.data as any;
    const details = remedyData.details || {};
    const planetInfo = remedyData.planet_info || {};

    // D1 Chart fallback from context
    const d1Chart = processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn(
            "rounded-[2rem] bg-surface-warm border-4 border-divider shadow-2xl flex flex-col overflow-hidden relative h-full",
            className
        )}>
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,#4A3B2A_1px,transparent_0)] [background-size:24px_24px]"></div>

            {/* Compact Premium Header with Inline Controls */}
            <div className="shrink-0 bg-gradient-to-r from-border-warm to-divider/80 px-4 py-2 border-b-2 border-border-warm relative">
                <div className="relative z-10 flex items-center justify-between gap-3">
                    {/* Left: Title */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="p-1.5 bg-white/40 rounded-lg shadow-inner border border-white/20 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-accent-gold" />
                        </div>
                        <div>
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[15px] font-black tracking-tight leading-tight")}>
                                Lal Kitab Remedial Plan
                            </h2>
                            <p className="text-[9px] font-bold text-muted-refined">
                                For <span className="text-accent-gold font-bold">{String(data.user_name || "Sadhaka")}</span>
                            </p>
                        </div>
                    </div>

                    {/* Center: Inline Selectors */}
                    {onPlanetChange && onHouseChange && (
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedPlanet || ''}
                                onChange={(e) => onPlanetChange(e.target.value)}
                                className="px-2 py-1.5 rounded-lg border border-white/50 bg-white/60 text-[11px] font-bold text-text-tertiary focus:outline-none focus:ring-1 focus:ring-gold-primary/30 min-w-[100px] backdrop-blur-sm"
                            >
                                <option value="">All Planets</option>
                                {LK_PLANETS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <select
                                value={selectedHouse || ''}
                                onChange={(e) => onHouseChange(e.target.value)}
                                className="px-2 py-1.5 rounded-lg border border-white/50 bg-white/60 text-[11px] font-bold text-text-tertiary focus:outline-none focus:ring-1 focus:ring-gold-primary/30 min-w-[90px] backdrop-blur-sm"
                            >
                                <option value="">All Houses</option>
                                {LK_HOUSES.map(h => (
                                    <option key={h} value={h}>{h} House</option>
                                ))}
                            </select>
                            <button
                                onClick={onGetRemedies}
                                className="px-3 py-1.5 bg-gold-primary text-white text-[11px] font-bold rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Get
                            </button>
                        </div>
                    )}

                    {/* Right: Info Badges */}
                    <div className="flex gap-1.5 shrink-0">
                        <div className="bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/50 shadow-sm text-center">
                            <p className="text-[7px] uppercase font-black text-accent-gold mb-0">Cycle</p>
                            <p className="text-[11px] font-serif font-bold text-text-tertiary">{remedyData.remedy_cycle || "43 Days"}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/50 shadow-sm text-center">
                            <p className="text-[7px] uppercase font-black text-accent-gold mb-0">Focus</p>
                            <p className="text-[11px] font-serif font-bold text-text-tertiary">{remedyData.planet} {remedyData.house}{getOrdinal(remedyData.house)}</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/50 shadow-sm text-center">
                            <p className="text-[7px] uppercase font-black text-accent-gold mb-0">Time</p>
                            <p className="text-[11px] font-serif font-bold text-text-tertiary">{remedyData.best_time || "Daylight"}</p>
                        </div>
                        <div className="bg-emerald-50/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-200/50 shadow-sm text-center">
                            <p className="text-[7px] uppercase font-black text-emerald-700 mb-0">Status</p>
                            <p className="text-[11px] font-serif font-bold text-emerald-700 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Split Layout: Fixed Left Chart + Scrollable Right */}
            <div className="flex-1 flex gap-4 px-4 py-4 min-h-0 relative z-10">

                {/* LEFT COLUMN - Fixed D1 Chart */}
                <div className="w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
                    {d1Chart && (
                        <SadhanaChartPanel
                            chartData={d1Chart}
                        />
                    )}
                </div>

                {/* RIGHT COLUMN - Scrollable Content - Dense Layout */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-3"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(180,83,9,0.2) transparent'
                    }}>

                    {!remedyData.planet ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-parchment-soft shadow-inner mb-4">
                                <Scroll className="w-8 h-8 text-accent-gold" />
                            </div>
                            <p className="text-sm font-serif font-bold text-text-tertiary">Select Analysis Parameters</p>
                            <p className="text-[11px] text-muted-refined mt-1">Select planet and house above to begin</p>
                        </div>
                    ) : (
                        <>
                            {/* TOP ROW: Primary Remedy + Diagnosis side by side */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {/* Primary Remedy */}
                                <div className="bg-white rounded-[1.5rem] border-2 border-parchment-soft shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-3 border-b-2 text-white bg-gradient-to-r from-header-border to-copper-dark border-copper-dark flex items-center justify-between">
                                        <h4 className="text-[11px] font-serif font-black uppercase tracking-tight">
                                            {remedyData.planet} | {remedyData.house}{getOrdinal(remedyData.house)} House
                                        </h4>
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white/50 shadow-sm">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 space-y-3">
                                        <div>
                                            <p className="text-[9px] font-black text-accent-gold uppercase tracking-wider">Diagnosis</p>
                                            <p className="text-[12px] text-text-tertiary font-bold leading-snug mt-0.5">{details.malefic || "Planetary imbalance detected."}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-accent-gold uppercase tracking-wider">Primary remedy</p>
                                            <p className="text-[12px] text-text-tertiary font-medium leading-relaxed mt-0.5">{details.remedies?.[0] || "Consult expert for guidance."}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="bg-[#FAFAFA] p-2 rounded-lg border border-gray-100">
                                                <p className="text-[8px] font-black text-muted-refined uppercase">Best time</p>
                                                <p className="text-[10px] text-text-tertiary font-bold">{remedyData.best_time || "Daylight"}</p>
                                            </div>
                                            <div className="bg-[#FAFAFA] p-2 rounded-lg border border-gray-100">
                                                <p className="text-[8px] font-black text-muted-refined uppercase">Cycle</p>
                                                <p className="text-[10px] text-text-tertiary font-bold">{remedyData.remedy_cycle || "43 Days"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scriptural Diagnosis + Practical Logic */}
                                <div className="flex flex-col gap-3">
                                    <div className="bg-white p-4 rounded-[1.5rem] border-2 border-parchment-soft shadow-sm flex-1">
                                        <h3 className="text-[11px] font-serif font-black text-text-tertiary mb-3 uppercase tracking-widest flex items-center gap-2">
                                            <Scroll className="w-3.5 h-3.5 text-accent-gold" />
                                            Scriptural diagnosis
                                        </h3>
                                        <div className="bg-[#FFF9E5] p-2.5 rounded-xl border border-parchment-soft/50 mb-3">
                                            <p className="text-[9px] font-black text-accent-gold uppercase mb-0.5">Karmic trigger</p>
                                            <p className="text-[11px] text-text-tertiary font-medium leading-relaxed">
                                                {details.why || "Planetary energy requires specific material grounding to stabilize."}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2.5 bg-surface-warm rounded-lg border border-parchment-soft/30">
                                                <p className="text-[9px] font-bold text-muted-refined mb-0.5 uppercase">Benefic</p>
                                                <p className="text-[11px] text-status-success font-bold">{details.benefic || "Neutral"}</p>
                                            </div>
                                            <div className="p-2.5 bg-[#FFF5F5] rounded-lg border border-red-100">
                                                <p className="text-[9px] font-bold text-red-800 mb-0.5 uppercase">Malefic</p>
                                                <p className="text-[11px] text-red-700 font-bold">{details.malefic?.split(',')[0] || "Alert"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Practical Logic - Compact */}
                                    <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 flex items-start gap-2.5">
                                        <BookOpen className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-[10px] font-black text-sky-800 uppercase tracking-wider mb-0.5">Practical logic</h4>
                                            <p className="text-[11px] text-sky-700 leading-snug">{details.practical || "Ensure consistency in actions for best results."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE ROW: Supplementary Measures + Cautions side by side */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {/* Supplementary Measures */}
                                <div className="bg-white p-4 rounded-[1.5rem] border-2 border-parchment-soft shadow-sm">
                                    <h3 className="text-[11px] font-serif font-black text-text-tertiary mb-3 uppercase tracking-widest flex items-center gap-2">
                                        <Utensils className="w-3.5 h-3.5 text-accent-gold" />
                                        Supplementary measures
                                    </h3>
                                    <div className="space-y-1.5">
                                        {details.remedies?.slice(1).map((r: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2 p-2 bg-[#FAFAFA] rounded-lg border border-gray-100">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                                                <span className="text-[11px] text-text-tertiary font-medium leading-tight">{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cautions */}
                                <div className="bg-white p-4 rounded-[1.5rem] border-2 border-parchment-soft shadow-sm">
                                    <h4 className="text-[11px] font-black text-red-800 uppercase mb-3 flex items-center gap-1.5 tracking-widest">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Major cautions & warnings
                                    </h4>
                                    {details.cautions && details.cautions.length > 0 ? (
                                        <ul className="space-y-1.5">
                                            {details.cautions.map((c: string, idx: number) => (
                                                <li key={idx} className="text-[11px] text-red-700 font-bold flex items-start gap-2 p-2 bg-red-50/50 rounded-lg border border-red-100/50">
                                                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-[11px] text-emerald-700 font-bold">No major cautions for this configuration.</span>
                                        </div>
                                    )}

                                    {/* Planet Info Quick Reference */}
                                    {Object.keys(planetInfo).length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-parchment-soft/50">
                                            <p className="text-[9px] font-black text-muted-refined uppercase mb-2">Planet reference</p>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {Object.entries(planetInfo).slice(0, 6).map(([key, val]) => (
                                                    <div key={key} className="px-2 py-1 bg-surface-warm rounded border border-parchment-soft/30">
                                                        <span className="text-[9px] font-bold text-muted-refined uppercase">{key.replace(/_/g, ' ')}: </span>
                                                        <span className="text-[10px] text-text-tertiary font-bold">{String(val)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* BOTTOM ROW: Golden Rules - Horizontal */}
                            <div className="bg-gradient-to-r from-border-warm/40 to-divider/40 backdrop-blur-md rounded-[1.5rem] border-2 border-parchment-soft/50 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-accent-gold" />
                                    <h3 className="text-text-tertiary font-serif font-black text-[11px] uppercase tracking-[0.2em]">Golden rules for success</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex items-start gap-2.5 bg-white/50 p-3 rounded-xl border border-white/60">
                                        <Sun className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-accent-gold font-black text-[8px] uppercase tracking-wider mb-0.5">Rule 1</p>
                                            <p className="text-text-tertiary text-[10px] leading-tight font-bold">Perform during daylight (Sunrise to Sunset) only.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-white/50 p-3 rounded-xl border border-white/60">
                                        <Utensils className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-accent-gold font-black text-[8px] uppercase tracking-wider mb-0.5">Rule 2</p>
                                            <p className="text-text-tertiary text-[10px] leading-tight font-bold">Initiate only one new remedy per day.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-white/50 p-3 rounded-xl border border-white/60">
                                        <Calendar className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-accent-gold font-black text-[8px] uppercase tracking-wider mb-0.5">Rule 3</p>
                                            <p className="text-text-tertiary text-[10px] leading-tight font-bold">Maintain 43-day continuity for effects.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
                accent === 'amber' ? "bg-gradient-to-r from-header-border to-copper-dark border-copper-dark" : "bg-gradient-to-r from-sky-700 to-sky-900 border-sky-900"
            )}>
                <h4 className="text-sm font-serif font-black uppercase tracking-tight">{title} <span className="mx-2 opacity-50">|</span> {focus}</h4>
            </div>

            <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-24 h-24 rounded-2xl bg-surface-warm border-2 border-parchment-soft/50 flex items-center justify-center relative overflow-hidden group-hover:bg-[#FFF9E5]">
                        <Icon className="w-12 h-12 text-header-border opacity-80 group-hover:scale-110 transition-transform" />
                        {/* Status Check */}
                        <div className="absolute top-1 right-1">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-[10px] font-black text-accent-gold uppercase tracking-wider">Diagnosis</p>
                            <p className="text-xs text-text-tertiary font-bold leading-snug mt-0.5">{diagnosis}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-accent-gold uppercase tracking-wider">Remedy</p>
                            <p className="text-xs text-text-tertiary font-medium leading-relaxed mt-0.5">{remedy}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                        <p className="text-[9px] font-black text-muted-refined uppercase">Time</p>
                        <p className="text-[10px] text-text-tertiary font-bold">{time || "Daylight"}</p>
                    </div>
                    <div className="bg-[#FAFAFA] p-2 rounded-xl border border-gray-100">
                        <p className="text-[9px] font-black text-muted-refined uppercase">Constraint</p>
                        <p className="text-[10px] text-text-tertiary font-bold">{constraint}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 uppercase text-[10px] font-black text-muted-refined">
                        Status: <span className="text-green-600">{status}</span>
                    </div>
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 w-[12%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for ordinal suffix
function getOrdinal(n: number | string): string {
    const num = typeof n === 'string' ? parseInt(n) : n;
    if (isNaN(num)) return "";
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
