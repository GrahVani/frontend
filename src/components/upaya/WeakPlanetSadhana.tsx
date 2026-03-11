"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

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
    current_position: string;
    house: number;
    severity: string;
    best_day: string;
    reasons: string[];
    mantra: MantraInfo;
    count: SadhanaCount;
}

interface WeakPlanetSadhanaProps {
    weakPlanets: WeakPlanet[];
}

const CircularProgress = ({ percentage, color = "amber" }: { percentage: number, color?: "amber" | "indigo" | "rose" }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClass = color === "amber" ? "text-amber-500/80" : color === "rose" ? "text-rose-500/80" : "text-indigo-500/80";

    return (
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-amber-900/5"
                />
                <motion.circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={colorClass}
                />
            </svg>
            <span className="absolute text-[11px] font-bold text-ink">{percentage}%</span>
        </div>
    );
};

const severityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
        case 'severe': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/50', progressColor: 'rose' as const };
        case 'moderate': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/50', progressColor: 'amber' as const };
        case 'mild': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200/50', progressColor: 'indigo' as const };
        default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200/50', progressColor: 'amber' as const };
    }
};

const WeakPlanetSadhana: React.FC<WeakPlanetSadhanaProps> = ({ weakPlanets }) => {
    // Mock percentages for visual match (in real app, calculate from progress)
    const mockPercentages: Record<string, number> = {
        'Mercury': 25,
        'Moon': 40,
        'Jupiter': 15,
        'Sun': 50,
        'Venus': 35,
        'Mars': 20,
        'Saturn': 10,
        'Rahu': 5,
        'Ketu': 5,
    };

    return (
        <div className="space-y-2">
            {weakPlanets.map((planet, idx) => {
                const percentage = mockPercentages[planet.planet] || 30;
                const sev = severityColor(planet.severity);

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="rounded-xl border border-gold-primary/15 bg-white/50 hover:bg-white/70 transition-all p-3"
                    >
                        <div className="flex items-start gap-3">
                            {/* Progress Circle */}
                            <CircularProgress percentage={percentage} color={sev.progressColor} />

                            {/* Planet Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-[14px] font-semibold text-ink tracking-tight">
                                        {planet.planet}
                                    </h4>
                                    <span className="text-[10px] text-ink/40 font-medium">
                                        {planet.current_position}
                                    </span>
                                    <span className="text-[10px] text-ink/35 font-medium">
                                        House {planet.house}
                                    </span>
                                    <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded", sev.bg, sev.text, sev.border)}>
                                        {planet.severity}
                                    </span>
                                    <span className="text-[9px] font-semibold text-ink/35 ml-auto">
                                        Best: {planet.best_day}
                                    </span>
                                </div>

                                {/* Mantra Sanskrit */}
                                <p className="text-[14px] font-serif text-ink leading-snug">
                                    {planet.mantra?.sanskrit}
                                </p>
                                {/* Transliteration */}
                                <p className="text-[10px] text-amber-700/50 font-medium italic mt-0.5">
                                    {planet.mantra?.transliteration}
                                </p>
                                {/* Meaning */}
                                <p className="text-[9px] text-ink/35 mt-0.5">
                                    {planet.mantra?.meaning}
                                </p>

                                {/* Reasons */}
                                {planet.reasons?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {planet.reasons.map((reason, ri) => (
                                            <span key={ri} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50/80 text-amber-800/60 border border-amber-200/30">
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Count Details */}
                                {planet.count && (
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-ink/45 font-medium">
                                        <span>Daily: <span className="text-ink/70 font-semibold">{planet.count.daily_count}</span></span>
                                        <span className="text-ink/15">|</span>
                                        <span>Total: <span className="text-ink/70 font-semibold">{planet.count.total_count?.toLocaleString()}</span></span>
                                        <span className="text-ink/15">|</span>
                                        <span>Base: <span className="text-ink/70 font-semibold">{planet.count.base_count?.toLocaleString()}</span></span>
                                        <span className="text-ink/15">|</span>
                                        <span>Mala: <span className="text-ink/70 font-semibold">{planet.count.mala_rounds}×</span></span>
                                        <span className="text-ink/15">|</span>
                                        <span>Duration: <span className="text-ink/70 font-semibold">{planet.count.duration_days}d</span></span>
                                        <span className="text-ink/15">|</span>
                                        <span>Mult: <span className="text-ink/70 font-semibold">{planet.count.multiplier}×</span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default WeakPlanetSadhana;
