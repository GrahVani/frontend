"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Calendar, Compass, Layers, ChevronDown, ChevronUp, Star, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PlanetaryInfo {
    degree: number;
    house: number;
    is_debilitated: boolean;
    is_exalted: boolean;
    is_retrograde: boolean;
    nakshatra: string;
    sign: string;
}

interface ShadbalStatus {
    current_rupas: number;
    is_weak: boolean;
    percentage: number;
    required_rupas: number;
    strength_category: string;
}

interface YantraDetails {
    beej_mantra: string;
    benefits: string;
    day: string;
    deity: string;
    direction: string;
    gemstone: string;
    mantra: string;
    metal: string;
    sanskrit_name: string;
    time: string;
    wearing: string;
}

interface YantraRecommendation {
    planet: string;
    functional_nature: string;
    priority_score: number;
    reasons: string[];
    rules_important_houses: boolean;
    planetary_info: PlanetaryInfo;
    shadbala_status: ShadbalStatus;
    yantra_details: YantraDetails;
}

interface MantraFocusPanelProps {
    currentDasha: string;
    yantras: YantraRecommendation[];
}

const functionalBadge = (nature: string) => {
    if (nature.toLowerCase().includes('yogakaraka')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (nature.toLowerCase().includes('benefic')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (nature.toLowerCase().includes('malefic')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
};

const MiniBar = ({ pct, color }: { pct: number; color: string }) => (
    <div className="flex items-center gap-1.5">
        <div className="flex-1 h-0.5 bg-black/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, pct)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn("h-full rounded-full", color)}
            />
        </div>
        <span className="text-[11px] font-bold text-slate-400 w-8 text-right shrink-0">{pct.toFixed(0)}%</span>
    </div>
);

const YantraCard = ({ yantra, idx, isTopPriority }: { yantra: YantraRecommendation; idx: number; isTopPriority: boolean }) => {
    const [expanded, setExpanded] = useState(isTopPriority);
    const d = yantra.yantra_details;
    const p = yantra.planetary_info;
    const s = yantra.shadbala_status;
    const pct = s.percentage;
    const barColor = isTopPriority ? 'bg-amber-400' : pct < 80 ? 'bg-rose-400' : 'bg-indigo-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={cn(
                "rounded-2xl border overflow-hidden transition-all",
                isTopPriority
                    ? "bg-amber-500/5 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.06)]"
                    : "bg-white/40 border-antique/20 hover:bg-white/60"
            )}
        >
            {/* Card Header — always visible */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left"
            >
                {/* Priority badge */}
                <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 border",
                    isTopPriority
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-white text-amber-700 border-amber-200"
                )}>
                    {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-bold text-ink tracking-tight">{d.sanskrit_name}</span>
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider", functionalBadge(yantra.functional_nature))}>
                            {yantra.functional_nature}
                        </span>
                        {p.is_exalted && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">Exalted</span>}
                        {p.is_retrograde && <span className="text-[10px] px-1 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">℞</span>}
                    </div>

                    {/* Shadbala bar */}
                    <MiniBar pct={pct} color={barColor} />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400">{s.current_rupas.toFixed(0)}/{s.required_rupas}R</span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {/* Expanded details */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 space-y-2 border-t border-antique/15 pt-2">

                            {/* Beej Mantra */}
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-amber-900/40 mb-0.5">Beej Mantra</p>
                                <p className="text-sm font-serif text-ink tracking-tight leading-snug">{d.beej_mantra}</p>
                            </div>

                            {/* 4-col metadata grid */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="text-[11px] text-slate-500 font-medium truncate">{d.deity}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="text-[11px] text-slate-500 font-medium truncate">{d.day} · {d.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="text-[11px] text-slate-500 font-medium truncate">{d.direction}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                    <span className="text-[11px] text-slate-500 font-medium truncate">{d.metal}</span>
                                </div>
                                <div className="flex items-center gap-1.5 col-span-2">
                                    <Gem className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                    <span className="text-[11px] text-slate-500 font-medium">{d.gemstone}</span>
                                </div>
                            </div>

                            {/* Planet info strip */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold bg-white/50 rounded-lg px-2 py-1.5">
                                <span className="text-ink font-black">{yantra.planet}</span>
                                <span className="text-slate-300">·</span>
                                <span>H{p.house}</span>
                                <span className="text-slate-300">·</span>
                                <span>{p.sign}</span>
                                <span className="text-slate-300">·</span>
                                <span>{p.nakshatra} Nak.</span>
                                <span className="text-slate-300">·</span>
                                <span>{p.degree.toFixed(2)}°</span>
                            </div>

                            {/* Benefits */}
                            <p className="text-[11px] text-slate-500 leading-snug">{d.benefits}</p>

                            {/* Wearing */}
                            <p className="text-[10px] text-slate-400 leading-tight italic">{d.wearing}</p>

                            {/* Reasons */}
                            {yantra.reasons.map((r, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-slate-500 leading-tight">{r}</p>
                                </div>
                            ))}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function MantraFocusPanel({ currentDasha, yantras }: MantraFocusPanelProps) {
    if (!yantras?.length) return null;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-amber-900/70">
                    Auspicious Yantra Recommendations
                </h3>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full ml-auto">
                    Dasha: {currentDasha}
                </span>
            </div>

            <div className="space-y-1.5">
                {yantras.map((yantra, idx) => (
                    <YantraCard key={yantra.planet} yantra={yantra} idx={idx} isTopPriority={idx === 0} />
                ))}
            </div>
        </div>
    );
}

