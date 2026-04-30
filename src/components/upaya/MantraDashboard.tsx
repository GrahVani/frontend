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
    Award
} from 'lucide-react';

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

interface MantraDashboardProps {
    data: {
        user_name: string;
        birth_details: {
            date: string;
            time: string;
            latitude: number;
            longitude: number;
        };
        chart_summary: {
            ascendant: string;
            moon_nakshatra: string;
            moon_sign: string;
            sun_sign: string;
        };
        mantra_analysis: MantraAnalysis;
    };
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

export default function MantraDashboard({ data }: MantraDashboardProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [showGuide, setShowGuide] = useState(false);

    if (!data?.mantra_analysis) {
        return (
            <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-8 text-center">
                <Info className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <p className="text-[14px] text-amber-700/50">Mantra analysis data not available</p>
            </div>
        );
    }

    const { mantra_analysis, chart_summary, user_name } = data;
    const { dasha_mantras, weak_planets, current_timing, recommendations, doshas } = mantra_analysis;

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
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200/50 p-5">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[20px] font-bold text-amber-900">
                            Personalized Mantra Guide
                        </h2>
                        <p className="text-[13px] text-amber-800/70 mt-1 leading-relaxed">
                            Namaste {user_name || 'Seeker'}! Based on your birth chart, here are the specific mantras 
                            to help balance planetary energies in your life. These are tailored to your current 
                            life period and weak planets.
                        </p>
                        <button 
                            onClick={() => setShowGuide(!showGuide)}
                            className="mt-3 text-[12px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-lg"
                        >
                            {showGuide ? 'Hide beginner guide' : 'Show me how this works'}
                            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                {/* Beginner Guide */}
                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-amber-200/50"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/70 rounded-xl p-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                                    <span className="text-amber-600 font-bold">1</span>
                                </div>
                                <h4 className="text-[13px] font-bold text-amber-900 mb-2">What are these mantras?</h4>
                                <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                    Mantras are sacred sounds that connect you with planetary energies. 
                                    Each planet has a specific "seed" (Beej) mantra. Chanting them helps 
                                    balance their effects in your life.
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                                    <span className="text-emerald-600 font-bold">2</span>
                                </div>
                                <h4 className="text-[13px] font-bold text-emerald-900 mb-2">How do I practice?</h4>
                                <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                    1. Choose a quiet time daily<br/>
                                    2. Use a mala (108 beads) to count<br/>
                                    3. Chant with focus on the sound<br/>
                                    4. Consistency matters more than quantity
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                                    <span className="text-indigo-600 font-bold">3</span>
                                </div>
                                <h4 className="text-[13px] font-bold text-indigo-900 mb-2">What will I see below?</h4>
                                <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                    • <strong>Dasha Mantras:</strong> Most urgent - planets currently ruling your life<br/>
                                    • <strong>Weak Planets:</strong> Need strengthening for long-term balance<br/>
                                    • <strong>Timing Tips:</strong> Best days and times for each mantra
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Sacred Timing Widget */}
            {current_timing && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-blue-200/50 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <h3 className="text-[14px] font-bold text-blue-900">Sacred Timing for Today</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/70 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span className="text-[11px] font-bold text-amber-700/60 uppercase">Current Hora</span>
                            </div>
                            <p className="text-[15px] font-bold text-amber-900">{current_timing.hora?.hora_lord}</p>
                            <p className="text-[10px] text-amber-700/50 mt-1">Hour #{current_timing.hora?.hora_number}</p>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Moon className="w-4 h-4 text-indigo-500" />
                                <span className="text-[11px] font-bold text-amber-700/60 uppercase">Lunar Tithi</span>
                            </div>
                            <p className="text-[15px] font-bold text-amber-900">{current_timing.tithi?.name}</p>
                            <p className="text-[10px] text-amber-700/50 mt-1">{current_timing.tithi?.paksha} Paksha, Day {current_timing.tithi?.number}</p>
                        </div>
                        <div className="bg-white/70 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Compass className="w-4 h-4 text-violet-500" />
                                <span className="text-[11px] font-bold text-amber-700/60 uppercase">Rahu Kaal</span>
                            </div>
                            <p className="text-[15px] font-bold text-amber-900">{current_timing.rahu_kaal?.duration_minutes} min</p>
                            <p className="text-[10px] text-amber-700/50 mt-1 truncate" title={current_timing.rahu_kaal?.recommendation}>
                                {current_timing.rahu_kaal?.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 1: DASHA MANTRAS (Most Important) */}
            <div className="space-y-4">
                <SectionHeader 
                    icon={Zap} 
                    title="Priority 1: Current Dasha Period Mantras" 
                    subtitle="These planets are actively influencing your life RIGHT NOW. Start here!"
                    color="amber"
                />

                <div className="grid grid-cols-1 gap-4">
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
                                    "rounded-2xl border overflow-hidden transition-all",
                                    isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md",
                                    colors.border
                                )}
                            >
                                {/* Always Visible */}
                                <div 
                                    className="p-5 cursor-pointer"
                                    onClick={() => toggleExpand(`dasha-${dasha.planet}`)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Planet Avatar */}
                                        <div className={cn("w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg", colors.bg)}>
                                            <span className="text-[11px] opacity-80">{dasha.type === 'Mahadasha' ? 'Major' : 'Sub'}</span>
                                            <span className="text-[24px]">{dasha.planet.charAt(0)}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-[20px] font-bold text-amber-900">{dasha.planet}</h4>
                                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", 
                                                    dasha.type === 'Mahadasha' 
                                                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                )}>
                                                    {dasha.type}
                                                </span>
                                                {idx === 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold">
                                                        START HERE
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <p className="text-[13px] text-amber-700 font-medium mt-1">{dasha.priority}</p>
                                            
                                            {/* Quick Stats */}
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1.5 text-[12px] text-amber-700/60">
                                                    <Target className="w-3.5 h-3.5" />
                                                    <span><strong className="text-amber-900">{dasha.daily_count}</strong>/day</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[12px] text-amber-700/60">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span><strong className="text-amber-900">{dasha.remaining_years}</strong> years left</span>
                                                </div>
                                                <span className="text-[12px] text-indigo-600 font-medium flex items-center gap-1">
                                                    {isExpanded ? 'Show less' : 'Show mantra details'}
                                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Mantra Details */}
                                {isExpanded && (
                                    <div className={cn("px-5 pb-5 border-t", colors.border, colors.light)}>
                                        <div className="pt-4">
                                            {/* Mantra Card */}
                                            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[11px] font-bold text-amber-700/50 uppercase tracking-wider">Beej Mantra</span>
                                                    <button className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                                                        <Play className="w-5 h-5 ml-0.5" />
                                                    </button>
                                                </div>
                                                
                                                <p className="text-[22px] font-serif text-amber-900 text-center py-2 leading-relaxed">
                                                    {dasha.mantra.sanskrit}
                                                </p>
                                                <p className="text-[14px] text-amber-800/70 text-center font-medium">
                                                    {dasha.mantra.transliteration}
                                                </p>
                                                <p className="text-[12px] text-amber-700/50 text-center italic mt-2">
                                                    "{dasha.mantra.meaning}"
                                                </p>
                                            </div>

                                            {/* Practice Plan */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white rounded-lg p-3">
                                                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Daily Practice</span>
                                                    <p className="text-[20px] font-bold text-emerald-900">{dasha.daily_count}</p>
                                                    <p className="text-[11px] text-emerald-700/70">repetitions</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-3">
                                                    <span className="text-[10px] font-bold text-amber-700 uppercase">Time Needed</span>
                                                    <p className="text-[20px] font-bold text-amber-900">~10-15</p>
                                                    <p className="text-[11px] text-amber-700/70">minutes daily</p>
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

            {/* SECTION 2: WEAK PLANETS */}
            {weak_planets && weak_planets.length > 0 && (
                <div className="space-y-4">
                    <SectionHeader 
                        icon={TrendingDown} 
                        title="Priority 2: Strengthen Weak Planets" 
                        subtitle="These planets are weak in your birth chart. Work on them after Dasha mantras."
                        color="indigo"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        "rounded-2xl border overflow-hidden transition-all",
                                        isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md",
                                        colors.border
                                    )}
                                >
                                    {/* Header */}
                                    <div 
                                        className="p-4 cursor-pointer"
                                        onClick={() => toggleExpand(`weak-${planet.planet}`)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[18px] shadow-md", colors.bg)}>
                                                {planet.planet.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-[17px] font-bold text-amber-900">{planet.planet}</h5>
                                                    <SeverityBadge severity={planet.severity} />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-700/50">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>House {planet.house}</span>
                                                    <span>•</span>
                                                    <span>Best: {planet.best_day}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[11px] text-amber-700/60">
                                                        Daily: <strong className="text-amber-900">{planet.count.daily_count}</strong>
                                                    </span>
                                                    <span className="text-[11px] text-amber-700/60">
                                                        Total: <strong className="text-amber-900">{planet.count.total_count.toLocaleString()}</strong>
                                                    </span>
                                                    <span className="text-[11px] text-indigo-600 font-medium">
                                                        {isExpanded ? 'Less' : 'More'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded */}
                                    {isExpanded && (
                                        <div className={cn("px-4 pb-4 border-t", colors.border, colors.light)}>
                                            <div className="pt-3 space-y-3">
                                                {/* Why Weak */}
                                                <div className="bg-red-50/70 rounded-lg p-3">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                        <span className="text-[10px] font-bold text-red-700 uppercase">Why is this planet weak?</span>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {planet.reasons.map((reason, i) => (
                                                            <li key={i} className="text-[11px] text-red-800/80 flex items-start gap-2">
                                                                <span className="text-red-400">•</span>
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Mantra */}
                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                    <p className="text-[16px] font-serif text-amber-900 text-center">
                                                        {planet.mantra.sanskrit}
                                                    </p>
                                                    <p className="text-[12px] text-amber-700/60 text-center mt-1">
                                                        {planet.mantra.transliteration}
                                                    </p>
                                                    <p className="text-[10px] text-amber-700/40 text-center italic mt-1">
                                                        "{planet.mantra.meaning}"
                                                    </p>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                    <div className="bg-white/60 rounded p-2">
                                                        <span className="text-amber-700/50">Daily:</span>
                                                        <strong className="ml-1">{planet.count.daily_count}</strong>
                                                        <span className="text-amber-700/40 ml-1">({planet.count.mala_rounds} malas)</span>
                                                    </div>
                                                    <div className="bg-white/60 rounded p-2">
                                                        <span className="text-amber-700/50">Duration:</span>
                                                        <strong className="ml-1">{planet.count.duration_days} days</strong>
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

            {/* SECTION 3: RECOMMENDATIONS */}
            {recommendations && recommendations.length > 0 && (
                <div className="space-y-4">
                    <SectionHeader 
                        icon={Award} 
                        title="Your Personalized Action Plan" 
                        subtitle="Follow these recommendations for best results"
                        color="emerald"
                    />

                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/50 p-4">
                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="text-[14px] font-bold text-amber-900">{rec.category}</h5>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                                                    Priority {rec.priority}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-amber-800/80 mt-1">{rec.action}</p>
                                            <p className="text-[11px] text-amber-700/50 italic mt-1">💡 {rec.note}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Note */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50">
                <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[13px] font-bold text-amber-900">Remember</h4>
                        <p className="text-[12px] text-amber-800/70 mt-1 leading-relaxed">
                            Consistency is more important than quantity. Even 5-10 minutes of daily practice 
                            brings positive changes over time. Start with the Dasha mantras first, then gradually 
                            add weak planet mantras as you build your practice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
