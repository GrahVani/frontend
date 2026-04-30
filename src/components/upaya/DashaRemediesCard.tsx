"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Flame,
    Shield,
    Sparkles,
    Star,
    Zap,
    Shapes,
    HeartHandshake
} from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';
import { KnowledgeTooltip } from '@/components/knowledge';
import { PLANET_COLORS } from '@/design-tokens/colors';

interface DashaRemedy {
    category: string;
    priority: string;
    mantra?: string;
    deity?: string;
    count?: number;
    day?: string;
    items?: string[];
    yantra?: string;
    rudraksha?: string;
    color?: string;
    suggestions?: string[];
}

interface DashaRemediesCardProps {
    dashaData: {
        current_dasha_lord: string;
        importance: string;
        period: {
            planet: string;
            start_date: string;
            end_date: string;
            duration_years: number;
        };
        remedies: DashaRemedy[];
    };
}

const DashaRemediesCard: React.FC<DashaRemediesCardProps> = ({ dashaData }) => {
    const { period, remedies, current_dasha_lord } = dashaData;

    // Calculate progress
    const start = new Date(period.start_date || "").getTime();
    const end = new Date(period.end_date || "").getTime();
    const now = Date.now();
    const total = end - start;
    const current = now - start;
    const progress = Math.min(Math.max((current / total) * 100, 0), 100);

    // Get planet theme
    const planetTheme = PLANET_COLORS[current_dasha_lord] || PLANET_COLORS.Sun;

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            default: return 'text-amber-700/50 bg-ink/5 border-ink/10';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'mantra': return <Flame className="w-3.5 h-3.5" />;
            case 'yantra': return <Shield className="w-3.5 h-3.5" />;
            case 'charity': return <HeartHandshake className="w-3.5 h-3.5" />;
            case 'lifestyle': return <Zap className="w-3.5 h-3.5" />;
            default: return <Star className="w-3.5 h-3.5" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-4 relative overflow-hidden flex flex-col rounded-[1.5rem] border border-amber-200/60", styles.glassPanel)}
        >
            {/* Header Area — More compact */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 bg-gradient-to-br", planetTheme.gradient)}>
                        <span className="text-xl font-serif leading-none mt-0.5">{planetTheme.symbol}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 leading-none mb-1">
                            <h2 className="text-xl font-black text-amber-900">{current_dasha_lord}</h2>
                            <span className="text-[9px] font-black tracking-[0.2em] text-amber-700/40">Mahadasha</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700/60">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(period.start_date).getFullYear()} – {new Date(period.end_date).getFullYear()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 min-w-[140px] max-w-[200px] flex-1">
                    <div className="flex justify-between w-full text-[9px] font-black tracking-wider text-amber-700/40">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-ink/5 relative overflow-hidden border border-ink/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={cn("h-full relative shadow-sm bg-gradient-to-r", planetTheme.gradient)}
                        />
                    </div>
                </div>
            </div>

            {/* Strategic Protocol Grid — High Density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {remedies.map((remedy, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white/40 hover:bg-white border border-transparent hover:border-amber-300/60 p-2.5 rounded-xl transition-all group flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center transition-colors", planetTheme.bgSoft, planetTheme.textOnSoft)}>
                                    {getCategoryIcon(remedy.category)}
                                </div>
                                <span className="text-[10px] font-black tracking-wider text-amber-800/70">{remedy.category}</span>
                            </div>
                            <span className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest border border-transparent",
                                getPriorityColor(remedy.priority)
                            )}>
                                {remedy.priority}
                            </span>
                        </div>

                        <div className="mb-2">
                            {remedy.mantra && (
                                <p className="text-[11px] font-bold leading-tight text-amber-900 line-clamp-2 italic mb-1">"{remedy.mantra}"</p>
                            )}
                            {remedy.items && (
                                <p className="text-[10px] font-medium text-amber-800/80 leading-snug">
                                    <span className="font-black text-[8px] tracking-tighter opacity-40 mr-1">Donate:</span>
                                    {remedy.items.join(', ')}
                                </p>
                            )}
                            {remedy.yantra && (
                                <p className="text-[10px] font-medium text-amber-800/80 leading-snug">
                                    <span className="font-black text-[8px] tracking-tighter opacity-40 mr-1">Worship:</span>
                                    {remedy.yantra}
                                </p>
                            )}
                            {remedy.suggestions && (
                                <p className="text-[10px] font-medium text-amber-800/80 leading-snug">{remedy.suggestions[0]}</p>
                            )}
                        </div>

                        {/* Dense Meta Info Tags */}
                        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-ink/5 group-hover:border-amber-200/60">
                            {remedy.deity && (
                                <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-md", planetTheme.bgSoft, planetTheme.textOnSoft)}>
                                    {remedy.deity}
                                </span>
                            )}
                            {remedy.count && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700">
                                    {remedy.count.toLocaleString()} Chants
                                </span>
                            )}
                            {remedy.day && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                                    {remedy.day}s
                                </span>
                            )}
                            {!remedy.deity && !remedy.count && !remedy.day && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-ink/5 text-amber-700/40">
                                    Protocol Step
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default DashaRemediesCard;
