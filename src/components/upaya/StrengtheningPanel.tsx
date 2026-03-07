"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface PlanetComponents {
    cheshta_bala: number;
    dig_bala: number;
    drik_bala: number;
    kala_bala: number;
    naisargika_bala: number;
    sthana_bala: number;
}

interface PlanetStrengthData {
    is_weak: boolean;
    percentage_of_required: number;
    strength_category: string;
    total_rupas: number;
    minimum_required: number;
    components: PlanetComponents;
}

interface StrengtheningPanelProps {
    planetaryStrengths: Record<string, PlanetStrengthData>;
    functionalNature?: {
        benefics: string[];
        malefics: string[];
        neutral: string[];
        yogakaraka: string[];
    };
}

const categoryConfig: Record<string, { dot: string; text: string }> = {
    'Strong': { dot: 'bg-emerald-400', text: 'text-emerald-700' },
    'Average': { dot: 'bg-amber-400', text: 'text-amber-700' },
    'Weak': { dot: 'bg-rose-400', text: 'text-rose-700' },
};

const getFunctionalLabel = (planet: string, nature?: StrengtheningPanelProps['functionalNature']) => {
    if (!nature) return null;
    if (nature.yogakaraka?.includes(planet)) return { label: 'YK', cls: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (nature.benefics?.includes(planet)) return { label: 'B', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (nature.malefics?.includes(planet)) return { label: 'M', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (nature.neutral?.includes(planet)) return { label: 'N', cls: 'bg-slate-50 text-slate-500 border-slate-200' };
    return null;
};

export default function StrengtheningPanel({ planetaryStrengths, functionalNature }: StrengtheningPanelProps) {
    if (!planetaryStrengths) return null;

    const allPlanets = Object.entries(planetaryStrengths)
        .sort((a, b) => a[1].percentage_of_required - b[1].percentage_of_required);

    return (
        <div className="space-y-1.5">
            <h3 className="text-[13px] font-bold tracking-[0.05em] text-amber-900/70 px-1">2. Planetary Strength (Shadbala)</h3>

            <div className="grid grid-cols-3 gap-1.5">
                {allPlanets.map(([name, data], idx) => {
                    const pct = Math.round(data.percentage_of_required);
                    const cat = categoryConfig[data.strength_category] || categoryConfig['Average'];
                    const fnLabel = getFunctionalLabel(name, functionalNature);
                    const c = data.components;
                    const barColor = data.strength_category === 'Strong' ? 'bg-emerald-400'
                        : data.strength_category === 'Weak' ? 'bg-rose-400' : 'bg-amber-400';

                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="rounded-lg border p-2 bg-white/40 border-antique/20 hover:bg-white/60 transition-all"
                        >
                            {/* Row 1: planet + category dot + functional badge */}
                            <div className="flex items-center gap-1 mb-1">
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", cat.dot)} />
                                <span className="text-[13px] font-bold text-ink tracking-tight leading-none">{name}</span>
                                {fnLabel && (
                                    <span className={cn("text-[10px] font-black px-1 py-0.5 rounded border ml-auto", fnLabel.cls)}>
                                        {fnLabel.label}
                                    </span>
                                )}
                            </div>

                            {/* Row 2: rupas */}
                            <div className="flex items-baseline gap-1 mb-0.5">
                                <span className={cn("text-[12px] font-bold", cat.text)}>{data.total_rupas.toFixed(0)}</span>
                                <span className="text-[11px] text-slate-400 font-medium">/{data.minimum_required}R</span>
                            </div>

                            {/* Row 3: progress bar + pct */}
                            <div className="flex items-center gap-1 mb-1.5">
                                <div className="flex-1 h-0.5 bg-black/8 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, pct)}%` }}
                                        transition={{ duration: 1.1, ease: 'easeOut', delay: idx * 0.05 }}
                                        className={cn("h-full rounded-full", barColor)}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 w-8 text-right shrink-0">{pct}%</span>
                            </div>

                            {/* Row 4: compact bala breakdown */}
                            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                                {[
                                    ['Kala', c.kala_bala],
                                    ['Stha', c.sthana_bala],
                                    ['Dig', c.dig_bala],
                                    ['Drik', c.drik_bala],
                                ].map(([label, val]) => (
                                    <div key={label as string} className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-slate-400">{label as string}</span>
                                        <span className={cn("text-[10px] font-bold", (val as number) < 0 ? 'text-rose-500' : 'text-slate-500')}>
                                            {(val as number).toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

