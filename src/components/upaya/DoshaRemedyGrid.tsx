"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ShieldAlert,
    HandHeart,
    CheckCircle2,
    Search,
    Brain,
    Scale,
    Activity,
    FileWarning,
    Compass,
    Bell,
    HeartHandshake,
    Flame,
    Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';

interface DoshaRemedy {
    dosha_name: string;
    description: string;
    severity: string;
    impact_areas: string[];
    remedies: string[];
}

interface DoshaAnalysis {
    base_score?: number;
    final_score?: number;
    cancellation_factors?: string[] | null;
    classical_basis?: string;
    conjunction_orb?: number;
    positive_note?: string;
}

interface DoshaRemedyGridProps {
    doshaRemedies: Record<string, DoshaRemedy>;
    doshaAnalysis: Record<string, DoshaAnalysis>;
}

const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'high':
            return {
                badge: 'bg-rose-50 text-rose-700 border-rose-100',
                icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
                card: 'border-rose-100 bg-rose-50/10 hover:bg-white'
            };
        case 'medium':
            return {
                badge: 'bg-amber-50 text-amber-700 border-amber-100',
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
                card: 'border-amber-100 bg-amber-50/10 hover:bg-white'
            };
        default:
            return {
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
                card: 'border-emerald-100 bg-emerald-50/10 hover:bg-white'
            };
    }
};

/** Guess icon based on remedy text */
const getRemedyIcon = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('puja') || t.includes('worship') || t.includes('temple')) return <Bell className="w-3 h-3 text-purple-500" />;
    if (t.includes('mantra') || t.includes('chant') || t.includes('recite')) return <Flame className="w-3 h-3 text-orange-500" />;
    if (t.includes('donate') || t.includes('charity') || t.includes('give')) return <HeartHandshake className="w-3 h-3 text-pink-500" />;
    if (t.includes('fast') || t.includes('diet')) return <Zap className="w-3 h-3 text-blue-500" />;
    return <HandHeart className="w-3 h-3 text-emerald-500" />;
};

const DoshaRemedyGrid: React.FC<DoshaRemedyGridProps> = ({ doshaRemedies, doshaAnalysis }) => {
    const doshaList = Object.entries(doshaRemedies);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {doshaList.map(([key, dosha], idx) => {
                const styles = getSeverityStyles(dosha.severity);
                const analysis = doshaAnalysis[key];

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                            "group relative rounded-2xl border p-3.5 transition-all duration-300",
                            styles.card
                        )}
                    >
                        {/* Header: Dense */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gold-primary/10">
                                    {styles.icon}
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black tracking-tight text-ink">{dosha.dosha_name}</h3>
                                    <span className={cn("text-[8px] font-black tracking-widest leading-none mt-1", styles.badge.split(' ').slice(1).join(' '))}>
                                        {dosha.severity} Intensity
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] leading-relaxed text-ink/60 mb-3 ml-1 line-clamp-2">{dosha.description}</p>

                        <div className="space-y-3">
                            {/* Impact Areas: Tighter row */}
                            <div className="flex flex-wrap gap-1">
                                {dosha.impact_areas.map((area, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 bg-ink/5 border border-ink/5 rounded-md font-bold tracking-tight text-ink/70">
                                        {area}
                                    </span>
                                ))}
                            </div>

                            {/* Strategic Mitigation Factors */}
                            {analysis && (analysis.cancellation_factors?.length || analysis.positive_note) && (
                                <div className="p-2.5 rounded-xl border border-indigo-500/10 bg-indigo-50/20">
                                    <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                        <FileWarning className="w-2.5 h-2.5 text-indigo-500" />
                                        <span className="text-[8px] font-black tracking-widest text-indigo-600">Neutralizing Factors</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {analysis.cancellation_factors?.map((factor, i) => (
                                            <li key={i} className="text-[9px] flex items-start gap-1.5 text-ink/70 font-medium">
                                                <span className="text-indigo-400 mt-0.5">•</span>
                                                {factor}
                                            </li>
                                        ))}
                                        {analysis.positive_note && (
                                            <li className="text-[9px] flex items-start gap-1.5 mt-1 text-emerald-800 font-bold bg-emerald-50/50 p-1 rounded-md">
                                                <Compass className="w-2.5 h-2.5 mt-0.5 shrink-0" />
                                                <span>{analysis.positive_note}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Prescribed Actions: 2-Column High Density */}
                            <div className="pt-2">
                                <div className="flex items-center gap-1.5 mb-2 opacity-60">
                                    <HandHeart className="w-2.5 h-2.5 text-ink" />
                                    <span className="text-[8px] font-black tracking-widest text-ink">Actionable Remedies</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {dosha.remedies.map((remedy, i) => (
                                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-white shadow-sm rounded-lg border border-gold-primary/5 hover:border-gold-primary/20 transition-all group/item">
                                            <div className="w-5 h-5 rounded-md bg-ink/5 flex items-center justify-center shrink-0">
                                                {getRemedyIcon(remedy)}
                                            </div>
                                            <span className="text-[10px] font-semibold text-ink/80 leading-tight line-clamp-2">{remedy}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DoshaRemedyGrid;

