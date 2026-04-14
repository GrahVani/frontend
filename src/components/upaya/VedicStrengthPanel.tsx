"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    ShieldAlert,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';
import { PLANET_COLORS } from '@/design-tokens/colors';

interface PlanetStrength {
    strength_score: number;
    is_weak: boolean;
    severity: string;
    benefic_factors: string[];
    afflictions: string[];
}

interface VedicStrengthPanelProps {
    planetaryStrength: Record<string, PlanetStrength>;
}

/**
 * Semi-circular Gauge for Vigor
 */
const VigorGauge = ({ score, isWeak, color }: { score: number; isWeak: boolean; color: string }) => {
    const size = 60;
    const center = size / 2;
    const radius = 24;
    const strokeWidth = 5;
    const circumference = Math.PI * radius; // Half circle
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size / 2 + 5} viewBox={`0 0 ${size} ${size / 2 + 5}`}>
                {/* Track */}
                <path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Progress */}
                <motion.path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
                <span className="text-[12px] font-black text-ink">{Math.round(score)}</span>
            </div>
        </div>
    );
};

const VedicStrengthPanel: React.FC<VedicStrengthPanelProps> = ({ planetaryStrength }) => {
    // Sort planets: weak ones first, then by score
    const planets = Object.entries(planetaryStrength).sort((a, b) => {
        if (a[1].is_weak !== b[1].is_weak) return a[1].is_weak ? -1 : 1;
        return a[1].strength_score - b[1].strength_score;
    });

    const getScoreColor = (score: number, isWeak: boolean) => {
        if (isWeak) return "#F43F5E"; // rose-500
        if (score >= 80) return "#8B5CF6"; // violet-500
        if (score >= 60) return "#10B981"; // emerald-500
        return "#F59E0B"; // amber-500
    };

    return (
        <div className={cn("p-4 relative overflow-hidden flex flex-col rounded-[1.5rem] border border-gold-primary/10", styles.glassPanel)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h3 className="text-[15px] font-bold tracking-tight flex items-center gap-2 text-ink/80">
                        <Zap className="w-4 h-4 text-purple-600 fill-purple-600/20" />
                        Planetary Vigor
                    </h3>
                    <p className="text-[9px] tracking-widest font-black text-ink/30 mt-0.5">Potency & Affliction Analysis</p>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black tracking-widest">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span>Strong</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100/50">
                        <TrendingDown className="w-2.5 h-2.5" />
                        <span>Weak</span>
                    </div>
                </div>
            </div>

            {/* High-Density Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {planets.map(([name, data], idx) => {
                    const theme = PLANET_COLORS[name] || PLANET_COLORS.Sun;
                    const scoreColor = getScoreColor(data.strength_score, data.is_weak);

                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            className={cn(
                                "group relative border rounded-xl p-2.5 transition-all flex flex-col gap-2 bg-white/30 hover:bg-white",
                                data.is_weak ? "border-rose-100 shadow-sm" : "border-gold-primary/5 hover:border-gold-primary/20"
                            )}
                        >
                            {/* Card Top: Planet + Gauge */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white font-serif text-sm shadow-md bg-gradient-to-br", theme.gradient)}>
                                        {theme.symbol}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-ink tracking-tight leading-none mb-1">{name}</h4>
                                        <span className={cn(
                                            "text-[8px] font-black tracking-widest px-1 py-0.5 rounded",
                                            data.is_weak ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                        )}>
                                            {data.is_weak ? 'Weak' : 'High'}
                                        </span>
                                    </div>
                                </div>
                                <VigorGauge score={data.strength_score} isWeak={data.is_weak} color={scoreColor} />
                            </div>

                            {/* Card Middle: Factors (Dense) */}
                            <div className="flex flex-wrap gap-1 min-h-[40px] content-start">
                                {data.afflictions.length > 0 && data.afflictions.map((aff, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 bg-rose-500/[0.03] text-rose-600 border border-rose-500/10 rounded-md font-bold flex items-center gap-1">
                                        <ShieldAlert className="w-2 h-2 shrink-0" /> {aff}
                                    </span>
                                ))}
                                {data.benefic_factors.length > 0 && data.benefic_factors.map((ben, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 bg-emerald-500/[0.03] text-emerald-600 border border-emerald-500/10 rounded-md font-bold flex items-center gap-1">
                                        <ShieldCheck className="w-2 h-2 shrink-0" /> {ben}
                                    </span>
                                ))}
                                {data.afflictions.length === 0 && data.benefic_factors.length === 0 && (
                                    <span className="text-[8px] italic text-ink/30 px-1 py-1">Neutral position</span>
                                )}
                            </div>

                            {/* Priority Indicator */}
                            {data.is_weak && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-rose-400/30 rounded-full blur-[1px]" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default VedicStrengthPanel;

