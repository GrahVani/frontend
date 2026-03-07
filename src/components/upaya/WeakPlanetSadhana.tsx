"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Calendar, Home, AlertTriangle } from 'lucide-react';

interface SadhanaCount {
    base_count: number;
    daily_count: number;
    duration_days: number;
    mala_rounds: number;
    multiplier: number;
    total_count: number;
}

interface MantraInfo {
    sanskrit: string;
    transliteration: string;
    meaning: string;
}

interface WeakPlanet {
    planet: string;
    severity: string;
    current_position: string;
    house: number;
    best_day: string;
    reasons: string[];
    mantra: MantraInfo;
    count: SadhanaCount;
}

interface WeakPlanetSadhanaProps {
    weakPlanets: WeakPlanet[];
}

const severityConfig = {
    mild: { label: 'Mild', dot: 'bg-emerald-400' },
    moderate: { label: 'Moderate', dot: 'bg-amber-400' },
    severe: { label: 'Severe', dot: 'bg-rose-400' },
};

const planetColor: Record<string, 'amber' | 'indigo'> = {
    Moon: 'indigo', Jupiter: 'indigo', Saturn: 'indigo',
    Sun: 'amber', Mars: 'amber', Mercury: 'amber', Venus: 'amber',
};

const MiniProgress = ({ value, max, color }: { value: number; max: number; color: 'amber' | 'indigo' }) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
        <div className="flex items-center gap-1">
            <div className="flex-1 h-0.5 bg-black/8 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={cn("h-full rounded-full", color === "amber" ? "bg-amber-400" : "bg-indigo-400")}
                />
            </div>
            <span className="text-[11px] font-bold text-slate-400 shrink-0 w-8 text-right">{pct}%</span>
        </div>
    );
};

const WeakPlanetSadhana: React.FC<WeakPlanetSadhanaProps> = ({ weakPlanets }) => {
    return (
        <div className="space-y-1.5">
            <h3 className="text-[13px] font-bold tracking-[0.05em] text-amber-900/70 px-1 uppercase tracking-widest text-[11px]">Planetary Power & Vigor Alignment</h3>
            <div className="grid grid-cols-3 gap-1.5">
                {weakPlanets.slice(0, 3).map((planet, idx) => {
                    const sev = severityConfig[planet.severity as keyof typeof severityConfig] || severityConfig.mild;
                    const color = planetColor[planet.planet] || 'amber';

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.07 }}
                            className="rounded-2xl border p-2 bg-white/40 border-antique/20 hover:bg-white/60 transition-all"
                        >
                            {/* Row 1: planet + severity dot + house */}
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <div className={cn("w-2 h-2 rounded-full shrink-0", sev.dot)} />
                                <span className="text-[15px] font-bold text-ink tracking-tight leading-none">{planet.planet}</span>
                                <span className="text-[12px] text-slate-400 ml-auto flex items-center gap-1">
                                    <Home className="w-3.5 h-3.5" />H{planet.house}
                                </span>
                            </div>

                            {/* Row 2: Sanskrit (truncated) */}
                            <p className="text-[14px] font-serif text-ink tracking-tight truncate leading-tight mb-0.5">
                                {planet.mantra.sanskrit}
                            </p>

                            {/* Row 3: transliteration */}
                            <p className={cn("text-[12px] font-medium leading-tight truncate mb-1", color === 'amber' ? 'text-amber-600/80' : 'text-indigo-500/70')}>
                                {planet.mantra.transliteration}
                            </p>

                            {/* Row 4: reason micro-badge */}
                            {planet.reasons[0] && (
                                <div className="flex items-center gap-1 mb-1">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <p className="text-[12px] text-slate-400 leading-none truncate">{planet.reasons[0]}</p>
                                </div>
                            )}

                            {/* Row 5: count stats — single line */}
                            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 mb-1 flex-wrap">
                                <span>×{planet.count.daily_count}/d</span>
                                <span className="text-slate-300">·</span>
                                <span>{planet.count.mala_rounds}m</span>
                                <span className="text-slate-300">·</span>
                                <span className={cn("font-bold", color === 'amber' ? 'text-amber-700' : 'text-indigo-600')}>
                                    {planet.count.total_count.toLocaleString()}
                                </span>
                            </div>

                            {/* Row 6: progress bar */}
                            <MiniProgress
                                value={planet.count.daily_count}
                                max={planet.count.total_count / planet.count.duration_days}
                                color={color}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeakPlanetSadhana;
