"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import StrengtheningPanel from '@/components/upaya/StrengtheningPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import { 
    Gem, 
    Sun, 
    Clock, 
    Compass, 
    Crown, 
    CircleDot, 
    Sparkles,
    AlertCircle,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface YantraDashboardProps {
    data: Record<string, unknown>;
    className?: string;
}

// Planet icon mapping
const PlanetIcon = ({ planet, className }: { planet: string; className?: string }) => {
    const colors: Record<string, string> = {
        Sun: 'text-amber-500',
        Moon: 'text-slate-400',
        Mars: 'text-red-500',
        Mercury: 'text-emerald-500',
        Jupiter: 'text-yellow-600',
        Venus: 'text-pink-500',
        Saturn: 'text-indigo-500',
        Rahu: 'text-violet-600',
        Ketu: 'text-teal-600',
    };
    return <CircleDot className={cn(colors[planet] || 'text-amber-500', className)} />;
};

// Yantra Card Component
interface YantraDetails {
    planet: string;
    priority_score: number;
    functional_nature: string;
    reasons: string[];
    rules_important_houses?: boolean;
    shadbala_status: {
        current_rupas: number;
        is_weak: boolean;
        percentage: number;
        required_rupas: number;
        strength_category: string;
    };
    yantra_details: {
        sanskrit_name: string;
        beej_mantra: string;
        mantra: string;
        deity: string;
        benefits: string;
        day: string;
        time: string;
        direction: string;
        metal: string;
        gemstone: string;
        wearing: string;
    };
    planetary_info?: {
        degree: number;
        house: number;
        sign: string;
        nakshatra: string;
        is_exalted?: boolean;
        is_debilitated?: boolean;
        is_retrograde?: boolean;
    };
}

const YantraCard = ({ yantra, index }: { yantra: YantraDetails; index: number }) => {
    const details = yantra.yantra_details;
    const priorityColors = [
        'from-amber-500 to-orange-500',
        'from-blue-500 to-indigo-500', 
        'from-emerald-500 to-teal-500'
    ];
    const priorityBg = [
        'bg-amber-50 border-amber-200',
        'bg-blue-50 border-blue-200',
        'bg-emerald-50 border-emerald-200'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "rounded-2xl border p-5 space-y-4",
                priorityBg[index] || 'bg-white border-amber-200/60'
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                        priorityColors[index] || 'from-amber-500 to-orange-500'
                    )}>
                        <PlanetIcon planet={yantra.planet} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-bold text-amber-900">{yantra.planet}</h3>
                        <p className="text-[12px] text-amber-700/70 font-medium">{details.sanskrit_name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[11px] font-bold text-amber-900/40 uppercase tracking-wider">Priority</div>
                    <div className="text-[20px] font-black text-amber-600">#{index + 1}</div>
                </div>
            </div>

            {/* Priority Score Badge */}
            <div className="flex items-center gap-2">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide",
                    yantra.priority_score >= 100 ? "bg-red-100 text-red-700" :
                    yantra.priority_score >= 80 ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                )}>
                    {yantra.functional_nature}
                </span>
                <span className="text-[11px] text-amber-700/50 font-medium">
                    Score: {yantra.priority_score}/150
                </span>
            </div>

            {/* Planetary Position */}
            {yantra.planetary_info && (
                <div className="bg-white/40 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <span className="text-[10px] font-medium text-amber-700/60 uppercase tracking-wide">Position</span>
                            <p className="text-[11px] font-semibold text-amber-900">
                                House {yantra.planetary_info.house} • {yantra.planetary_info.sign}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-medium text-amber-700/60 uppercase tracking-wide">Nakshatra</span>
                            <p className="text-[11px] font-semibold text-amber-900">{yantra.planetary_info.nakshatra}</p>
                        </div>
                        <div className="text-right border-l border-amber-200/50 pl-3">
                            <span className="text-[10px] font-medium text-amber-700/60 uppercase tracking-wide">Degree</span>
                            <p className="text-[11px] font-semibold text-amber-900">{yantra.planetary_info.degree.toFixed(1)}°</p>
                        </div>
                    </div>
                    {/* Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {yantra.planetary_info.is_exalted && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wide">
                                Exalted
                            </span>
                        )}
                        {yantra.planetary_info.is_debilitated && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-wide">
                                Debilitated
                            </span>
                        )}
                        {yantra.planetary_info.is_retrograde && (
                            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold uppercase tracking-wide">
                                Retrograde
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Strength Status */}
            {yantra.shadbala_status && (
                <div className="bg-white/60 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-amber-800/70">Shadbala Strength</span>
                        <span className={cn(
                            "text-[12px] font-bold",
                            yantra.shadbala_status.is_weak ? "text-red-600" : "text-emerald-600"
                        )}>
                            {yantra.shadbala_status.strength_category}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full rounded-full transition-all",
                                    yantra.shadbala_status.is_weak ? "bg-red-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${Math.min(yantra.shadbala_status.percentage, 100)}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-bold text-amber-700/60 min-w-[45px] text-right">
                            {yantra.shadbala_status.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="text-[10px] text-amber-700/50">
                        {yantra.shadbala_status.current_rupas.toFixed(1)} / {yantra.shadbala_status.required_rupas} Rupas
                        {yantra.rules_important_houses && (
                            <span className="ml-2 text-amber-600 font-medium">• Rules Important Houses</span>
                        )}
                    </div>
                </div>
            )}

            {/* Yantra Details */}
            <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-amber-900/80 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Yantra Details
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-amber-700/60 mb-1">
                            <Crown className="w-3 h-3" />
                            <span className="font-medium uppercase tracking-wide">Deity</span>
                        </div>
                        <p className="font-semibold text-amber-900">{details.deity}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-amber-700/60 mb-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium uppercase tracking-wide">Day</span>
                        </div>
                        <p className="font-semibold text-amber-900">{details.day}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-amber-700/60 mb-1">
                            <Sun className="w-3 h-3" />
                            <span className="font-medium uppercase tracking-wide">Time</span>
                        </div>
                        <p className="font-semibold text-amber-900">{details.time}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-amber-700/60 mb-1">
                            <Compass className="w-3 h-3" />
                            <span className="font-medium uppercase tracking-wide">Direction</span>
                        </div>
                        <p className="font-semibold text-amber-900">{details.direction}</p>
                    </div>
                </div>

                {/* Metal & Gemstone */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-amber-100/50 rounded-lg p-2.5">
                        <span className="text-[10px] font-medium text-amber-700/60 uppercase tracking-wide">Metal</span>
                        <p className="text-[12px] font-bold text-amber-900">{details.metal}</p>
                    </div>
                    <div className="flex-1 bg-emerald-100/50 rounded-lg p-2.5">
                        <span className="text-[10px] font-medium text-emerald-700/60 uppercase tracking-wide">Gemstone</span>
                        <p className="text-[12px] font-bold text-emerald-900">{details.gemstone}</p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white/60 rounded-xl p-3">
                    <h5 className="text-[11px] font-bold text-amber-900/70 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Benefits
                    </h5>
                    <p className="text-[12px] text-amber-800/80 leading-relaxed">{details.benefits}</p>
                </div>

                {/* Wearing Instructions */}
                <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/50">
                    <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        How to Use
                    </h5>
                    <p className="text-[11px] text-amber-900/70 leading-relaxed">{details.wearing}</p>
                </div>

                {/* Beej Mantra */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-200/50">
                    <h5 className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-2">Beej Mantra</h5>
                    <p className="text-[14px] font-serif text-amber-900 text-center py-1">{details.beej_mantra}</p>
                </div>
            </div>

            {/* Reasons */}
            {yantra.reasons && yantra.reasons.length > 0 && (
                <div className="pt-2 border-t border-amber-200/50">
                    <h5 className="text-[10px] font-bold text-amber-900/60 uppercase tracking-wide mb-2">Why This Yantra?</h5>
                    <ul className="space-y-1">
                        {yantra.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-amber-800/70">
                                <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default function YantraDashboard({ data, className }: YantraDashboardProps) {
    const { processedCharts } = useVedicClient();
    if (!data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    const detailedAnalysis = (data.detailed_analysis || {}) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
    const yantraRecommendations = (data.yantra_recommendations || []) as YantraDetails[];

    // Fallback for D1 Chart
    const d1Chart = detailedAnalysis?.chart || processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("h-[510px] overflow-hidden flex flex-col", styles.dashboardContainer, className)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-amber-300/60 px-5 py-2.5 shrink-0 bg-amber-50/50">
                <div className="flex items-center gap-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold tracking-tight !mb-0")}>
                        <KnowledgeTooltip term="general_yantra">Yantras</KnowledgeTooltip> : {String(data.user_name || "Sadhaka")}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                </div>
            </div>

            {/* Main Split Layout: 30% Chart | 70% Data */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-amber-200/60">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={detailedAnalysis?.doshas || {}}
                    />
                </div>

                {/* RIGHT SIDE: Scrollable Content, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-4 space-y-4">
                        
                        {/* Yantra Recommendations Section */}
                        {yantraRecommendations.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <Gem className="w-5 h-5 text-amber-600" />
                                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] font-bold tracking-tight !mb-0")}>
                                        Recommended <KnowledgeTooltip term="general_yantra">Yantras</KnowledgeTooltip>
                                    </h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent ml-2" />
                                </div>
                                
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {yantraRecommendations.map((yantra, index) => (
                                        <YantraCard 
                                            key={yantra.planet} 
                                            yantra={yantra} 
                                            index={index} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-amber-50/40 rounded-2xl border-2 border-dashed border-amber-200/60">
                                <Gem className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
                                <p className="text-[14px] font-medium text-amber-700/45 italic">No specific yantras recommended at this time.</p>
                            </div>
                        )}

                        <div className="h-px bg-amber-900/10 mx-1" />

                        {/* Strengthening Panel */}
                        <StrengtheningPanel
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                            planetaryStrengths={data.planetary_strengths as any}
                        />

                        {/* Legend / Insights */}
                        <div className="bg-white/30 rounded-xl px-3 py-2.5 border border-amber-200/60 flex items-center gap-4">
                            <h4 className="text-[9px] font-medium uppercase tracking-[0.15em] text-amber-900/50 shrink-0">Insights</h4>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-900">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Karmic
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-900">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <KnowledgeTooltip term="dasha_system">Dasha</KnowledgeTooltip>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-900">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Growth
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
