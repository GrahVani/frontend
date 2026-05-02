"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';
import { 
    Info, 
    ChevronDown, 
    ChevronUp, 
    Play,
    Target,
    Clock,
    Sparkles,
    Calendar,
    MapPin,
    AlertTriangle,
    CheckCircle,
    Sun,
    Moon,
    Zap,
    Compass,
    Star,
    TrendingDown,
    Award,
    Flame
} from 'lucide-react';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import { useVedicClient } from '@/context/VedicClientContext';
import styles from './RemedialShared.module.css';

// Interfaces matching the JSON structure
interface MantraData {
    sanskrit: string;
    transliteration: string;
    meaning: string;
}

interface CountData {
    base_count: number;
    daily_count: number;
    duration_days: number;
    mala_rounds: number;
    multiplier: number;
    total_count: number;
}

interface WeakPlanet {
    planet: string;
    mantra: MantraData;
    count: CountData;
    best_day: string;
    current_position: string;
    house: number;
    reasons: string[];
    severity: 'mild' | 'moderate' | 'severe';
}

interface DashaMantra {
    planet: string;
    type: 'Mahadasha' | 'Antardasha';
    priority: string;
    daily_count: number;
    remaining_years: number;
    mantra: MantraData;
}

interface CurrentTiming {
    hora: {
        day_lord: string;
        hora_lord: string;
        hora_number: number;
        is_day: boolean;
    };
    rahu_kaal: {
        duration_minutes: number;
        recommendation: string;
    };
    tithi: {
        name: string;
        number: number;
        paksha: string;
        is_ekadashi: boolean;
        is_purnima: boolean;
        is_amavasya: boolean;
    };
}

interface Recommendation {
    action: string;
    category: string;
    note: string;
    priority: number;
}

interface MantraAnalysis {
    dasha_mantras: DashaMantra[];
    weak_planets: WeakPlanet[];
    current_timing: CurrentTiming;
    recommendations: Recommendation[];
    doshas: string[];
}

interface MantraAnalysisDashboardProps {
    data: Record<string, unknown>;
}

// Planet colors
const PLANET_COLORS: Record<string, { bg: string; text: string; light: string; border: string }> = {
    'Sun': { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
    'Moon': { bg: 'bg-slate-400', text: 'text-slate-700', light: 'bg-slate-50', border: 'border-slate-200' },
    'Mars': { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' },
    'Mercury': { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
    'Jupiter': { bg: 'bg-yellow-600', text: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-200' },
    'Venus': { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-50', border: 'border-pink-200' },
    'Saturn': { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50', border: 'border-indigo-200' },
    'Rahu': { bg: 'bg-violet-600', text: 'text-violet-700', light: 'bg-violet-50', border: 'border-violet-200' },
    'Ketu': { bg: 'bg-teal-600', text: 'text-teal-700', light: 'bg-teal-50', border: 'border-teal-200' },
};

const SeverityBadge = ({ severity }: { severity: string }) => {
    const styles = {
        mild: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        moderate: 'bg-amber-100 text-amber-700 border-amber-200',
        severe: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = {
        mild: 'Mild weakness',
        moderate: 'Moderate weakness',
        severe: 'Severe weakness',
    };
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", styles[severity as keyof typeof styles] || styles.mild)}>
            {labels[severity as keyof typeof labels] || severity}
        </span>
    );
};

const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    color = "amber" 
}: { 
    icon: React.ElementType; 
    title: string; 
    subtitle?: string;
    color?: "amber" | "indigo" | "emerald" | "red";
}) => {
    const colorClasses = {
        amber: "from-amber-500 to-orange-500",
        indigo: "from-indigo-500 to-purple-500",
        emerald: "from-emerald-500 to-teal-500",
        red: "from-red-500 to-rose-500",
    };
    
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", colorClasses[color])}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="text-[17px] font-bold text-amber-900">{title}</h3>
                {subtitle && <p className="text-[12px] text-amber-700/50">{subtitle}</p>}
            </div>
        </div>
    );
};

export default function MantraAnalysisDashboard({ data }: MantraAnalysisDashboardProps) {
    const { processedCharts } = useVedicClient();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [showGuide, setShowGuide] = useState(false);

    // Extract data from the response
    const analysis = (data?.analysis || {}) as Record<string, unknown>;
    const mantraAnalysis = (data?.mantra_analysis || data || {}) as MantraAnalysis;
    const chartSummary = (data?.chart_summary || {}) as Record<string, unknown>;
    const userName = (data?.user_name || 'Seeker') as string;
    
    const d1Chart = analysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    if (!mantraAnalysis) {
        return (
            <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-8 text-center">
                <Info className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <p className="text-[14px] text-amber-700/50">Mantra analysis data not available</p>
            </div>
        );
    }

    const { dasha_mantras, weak_planets, current_timing, recommendations, doshas } = mantraAnalysis;

    const toggleExpand = (key: string) => {
        const newSet = new Set(expandedItems);
        if (newSet.has(key)) {
            newSet.delete(key);
        } else {
            newSet.add(key);
        }
        setExpandedItems(newSet);
    };

    return (
        <div className={cn("h-[510px] overflow-hidden flex flex-col", styles.dashboardContainer)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-300/60 px-5 py-3 shrink-0 bg-amber-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-bold text-amber-900">
                            <KnowledgeTooltip term="general_mantra">Mantras</KnowledgeTooltip> : {userName}
                        </h2>
                        <p className="text-[11px] text-amber-700/50">
                            {String(chartSummary?.ascendant || '')} • Moon: {String(chartSummary?.moon_sign || '')} • {String(chartSummary?.moon_nakshatra || '')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* LEFT: Chart */}
                <div className="w-[35%] shrink-0 flex flex-col overflow-hidden border-r border-amber-200/60">
                    <SadhanaChartPanel
                        chartData={(d1Chart || {}) as Record<string, unknown>}
                        doshaStatus={{} as Record<string, boolean>}
                    />
                </div>

                {/* RIGHT: Mantra Content */}
                <div className="w-[65%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-5 space-y-6">
                        
                        {/* Welcome & Guide */}
                        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200/50 p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-[15px] font-bold text-amber-900">
                                        Your Personalized Mantra Guide
                                    </h3>
                                    <p className="text-[12px] text-amber-800/70 mt-1">
                                        These mantras are specifically chosen based on your birth chart to help balance planetary energies.
                                    </p>
                                    <button 
                                        onClick={() => setShowGuide(!showGuide)}
                                        className="mt-2 text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-white/50 px-3 py-1 rounded-lg"
                                    >
                                        {showGuide ? 'Hide guide' : 'How does this work?'}
                                        {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>

                            {showGuide && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-amber-200/50 grid grid-cols-2 gap-3"
                                >
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <h4 className="text-[12px] font-bold text-amber-900 mb-1">1. Dasha Mantras (Priority)</h4>
                                        <p className="text-[11px] text-amber-700/60">
                                            These planets are currently ruling your life periods. Chant these FIRST for immediate benefits.
                                        </p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <h4 className="text-[12px] font-bold text-amber-900 mb-1">2. Weak Planets (Support)</h4>
                                        <p className="text-[11px] text-amber-700/60">
                                            These planets are weak in your birth chart. Strengthen them for long-term balance.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sacred Timing */}
                        {current_timing && (
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-blue-200/50 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-[13px] font-bold text-blue-900">Sacred Timing for Today</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <span className="text-[10px] font-bold text-amber-700/40 uppercase">Current Hora</span>
                                        <p className="text-[14px] font-bold text-amber-900">{current_timing.hora?.hora_lord}</p>
                                        <p className="text-[9px] text-amber-700/40">Hour #{current_timing.hora?.hora_number}</p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <span className="text-[10px] font-bold text-amber-700/40 uppercase">Lunar Tithi</span>
                                        <p className="text-[14px] font-bold text-amber-900">{current_timing.tithi?.name}</p>
                                        <p className="text-[9px] text-amber-700/40">{current_timing.tithi?.paksha} Paksha</p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <span className="text-[10px] font-bold text-amber-700/40 uppercase">Rahu Kaal</span>
                                        <p className="text-[14px] font-bold text-amber-900">{current_timing.rahu_kaal?.duration_minutes} min</p>
                                        <p className="text-[9px] text-amber-700/40 truncate" title={current_timing.rahu_kaal?.recommendation}>
                                            Rahu/Saturn only
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DASHA MANTRAS */}
                        <div className="space-y-3">
                            <SectionHeader 
                                icon={Zap} 
                                title="Priority 1: Dasha Period Mantras" 
                                subtitle="Start here! These planets are actively influencing your life now."
                                color="amber"
                            />

                            {/* Quick Explanation for Beginners */}
                            <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-100 flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <div className="text-[11px] text-blue-800/80 leading-relaxed">
                                    <strong>How to read this:</strong> Each card shows a planet that's currently affecting your life. 
                                    <span className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">📿 Chant ___x daily</span> = how many times to repeat the mantra each day. 
                                    <span className="bg-blue-100 px-1 py-0.5 rounded text-blue-800">⏱️ Active for ___ years</span> = how long this planet's influence will last.
                                </div>
                            </div>

                            {dasha_mantras?.map((dasha, idx) => {
                                const colors = PLANET_COLORS[dasha.planet] || PLANET_COLORS['Sun'];
                                const isExpanded = expandedItems.has(`dasha-${dasha.planet}`);
                                
                                return (
                                    <motion.div
                                        key={`${dasha.planet}-${dasha.type}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "rounded-xl border overflow-hidden transition-all",
                                            isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md",
                                            colors.border
                                        )}
                                    >
                                        <div 
                                            className="p-4 cursor-pointer"
                                            onClick={() => toggleExpand(`dasha-${dasha.planet}`)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md", colors.bg)}>
                                                    {dasha.planet.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-[16px] font-bold text-amber-900">{dasha.planet}</h4>
                                                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", 
                                                            dasha.type === 'Mahadasha' 
                                                                ? 'bg-amber-100 text-amber-700' 
                                                                : 'bg-blue-100 text-blue-700'
                                                        )}>
                                                            {dasha.type}
                                                        </span>
                                                        {idx === 0 && (
                                                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[8px] font-bold">
                                                                START HERE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-amber-700">{dasha.priority}</p>
                                                    <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                                                        <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">
                                                            📿 Chant <strong>{dasha.daily_count}x</strong> daily
                                                        </span>
                                                        <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700">
                                                            ⏱️ Active for <strong>{dasha.remaining_years} more years</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                                {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-700/40" /> : <ChevronDown className="w-4 h-4 text-amber-700/40" />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className={cn("px-4 pb-4 border-t", colors.border, colors.light)}>
                                                <div className="pt-3">
                                                    {/* Mantra Card */}
                                                    <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold text-amber-700/40 uppercase">Beej Mantra</span>
                                                            <button className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                                                <Play className="w-4 h-4 ml-0.5" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[18px] font-serif text-amber-900 text-center">{dasha.mantra.sanskrit}</p>
                                                        <p className="text-[12px] text-amber-700/60 text-center">{dasha.mantra.transliteration}</p>
                                                        <p className="text-[10px] text-amber-700/40 text-center italic">"{dasha.mantra.meaning}"</p>
                                                    </div>

                                                    {/* Practice Plan - Beginner Friendly */}
                                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
                                                        <h5 className="text-[11px] font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                                                            <Target className="w-3.5 h-3.5" />
                                                            Your Practice Plan
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="bg-white rounded-lg p-2.5">
                                                                <div className="flex items-center gap-1 text-emerald-700 mb-1">
                                                                    <span className="text-lg">📿</span>
                                                                    <span className="text-[10px] font-bold uppercase">Daily Chanting</span>
                                                                </div>
                                                                <p className="text-[20px] font-bold text-emerald-900">{dasha.daily_count}</p>
                                                                <p className="text-[10px] text-emerald-700/70">times per day</p>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-2.5">
                                                                <div className="flex items-center gap-1 text-blue-700 mb-1">
                                                                    <span className="text-lg">⏱️</span>
                                                                    <span className="text-[10px] font-bold uppercase">Time Needed</span>
                                                                </div>
                                                                <p className="text-[20px] font-bold text-blue-900">~10-15</p>
                                                                <p className="text-[10px] text-blue-700/70">minutes daily</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 bg-white/60 rounded-lg p-2 flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                                                            <div>
                                                                <span className="text-[10px] text-amber-700/60">This planetary period ends in: </span>
                                                                <strong className="text-[12px] text-amber-700">{dasha.remaining_years} years</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* WEAK PLANETS */}
                        {weak_planets && weak_planets.length > 0 && (
                            <div className="space-y-3">
                                <SectionHeader 
                                    icon={TrendingDown} 
                                    title="Priority 2: Strengthen Weak Planets" 
                                    subtitle="These need attention for long-term balance."
                                    color="indigo"
                                />

                                <div className="grid grid-cols-1 gap-3">
                                    {weak_planets.map((planet, idx) => {
                                        const colors = PLANET_COLORS[planet.planet] || PLANET_COLORS['Sun'];
                                        const isExpanded = expandedItems.has(`weak-${planet.planet}`);
                                        
                                        return (
                                            <motion.div
                                                key={planet.planet}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={cn(
                                                    "rounded-xl border overflow-hidden transition-all",
                                                    isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md",
                                                    colors.border
                                                )}
                                            >
                                                <div 
                                                    className="p-4 cursor-pointer"
                                                    onClick={() => toggleExpand(`weak-${planet.planet}`)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md", colors.bg)}>
                                                            {planet.planet.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="text-[15px] font-bold text-amber-900">{planet.planet}</h5>
                                                                <SeverityBadge severity={planet.severity} />
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px]">
                                                                <span className="text-amber-700/50">In House {planet.house}</span>
                                                                <span className="text-amber-700/30">•</span>
                                                                <span className="bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-700">
                                                                    Chant on {planet.best_day}s
                                                                </span>
                                                                <span className="text-amber-700/30">•</span>
                                                                <span className="bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700">
                                                                    {planet.count.daily_count}x daily
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-700/40" /> : <ChevronDown className="w-4 h-4 text-amber-700/40" />}
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className={cn("px-4 pb-4 border-t", colors.border, colors.light)}>
                                                        <div className="pt-3 space-y-3">
                                                            <div className="bg-red-50/70 rounded-lg p-2.5">
                                                                <span className="text-[9px] font-bold text-red-700 uppercase">Why weak?</span>
                                                                <p className="text-[11px] text-red-800/80">{planet.reasons[0]}</p>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                <p className="text-[16px] font-serif text-amber-900 text-center">{planet.mantra.sanskrit}</p>
                                                                <p className="text-[11px] text-amber-700/50 text-center">{planet.mantra.transliteration}</p>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-[10px]">
                                                                <div className="bg-emerald-50 rounded p-2 text-center">
                                                                    <span className="text-emerald-700/60 text-[9px] block">📿 Daily Goal</span>
                                                                    <strong className="text-emerald-900 text-[14px]">{planet.count.daily_count}</strong>
                                                                    <span className="text-emerald-700/60 text-[9px]">times</span>
                                                                </div>
                                                                <div className="bg-amber-50 rounded p-2 text-center">
                                                                    <span className="text-amber-700/60 text-[9px] block">🎯 Complete</span>
                                                                    <strong className="text-amber-900 text-[14px]">{planet.count.total_count.toLocaleString()}</strong>
                                                                    <span className="text-amber-700/60 text-[9px]">total</span>
                                                                </div>
                                                                <div className="bg-blue-50 rounded p-2 text-center">
                                                                    <span className="text-blue-700/60 text-[9px] block">📅 In</span>
                                                                    <strong className="text-blue-900 text-[14px]">{planet.count.duration_days}</strong>
                                                                    <span className="text-blue-700/60 text-[9px]">days</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* RECOMMENDATIONS */}
                        {recommendations && recommendations.length > 0 && (
                            <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/50 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-[14px] font-bold text-emerald-900">Action Plan</h3>
                                </div>
                                <div className="space-y-2">
                                    {recommendations.map((rec, idx) => (
                                        <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <div>
                                                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{rec.category}</span>
                                                    <p className="text-[12px] text-amber-900">{rec.action}</p>
                                                    <p className="text-[10px] text-amber-700/50 italic">{rec.note}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/50">
                            <p className="text-[11px] text-amber-800/70 text-center">
                                <strong>Tip:</strong> Consistency matters more than quantity. Start with small counts and build up gradually.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
