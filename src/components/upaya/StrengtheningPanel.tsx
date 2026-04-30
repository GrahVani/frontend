"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';
import { 
    Info, 
    ChevronDown, 
    ChevronUp, 
    Play,
    Target,
    TrendingUp,
    Clock,
    Sparkles
} from 'lucide-react';

interface PlanetStrengthData {
    is_weak: boolean;
    percentage_of_required: number;
    strength_category: string;
    total_rupas?: number;
    minimum_required?: number;
}

interface StrengtheningPanelProps {
    planetaryStrengths: Record<string, PlanetStrengthData>;
}

// Beej mantras for each planet
const PLANET_MANTRAS: Record<string, { beej: string; meaning: string }> = {
    'Sun': { 
        beej: 'Om Hraam Hreem Hraum Sah Suryaya Namah', 
        meaning: 'Salutations to Lord Surya, the Sun God' 
    },
    'Moon': { 
        beej: 'Om Shraam Shreem Shraum Sah Chandraya Namah', 
        meaning: 'Salutations to Lord Chandra, the Moon God' 
    },
    'Mars': { 
        beej: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', 
        meaning: 'Salutations to Lord Bhauma (Mars)' 
    },
    'Mercury': { 
        beej: 'Om Braam Breem Braum Sah Budhaya Namah', 
        meaning: 'Salutations to Lord Budha (Mercury)' 
    },
    'Jupiter': { 
        beej: 'Om Graam Greem Graum Sah Gurave Namah', 
        meaning: 'Salutations to Guru (Jupiter), the teacher' 
    },
    'Venus': { 
        beej: 'Om Draam Dreem Draum Sah Shukraya Namah', 
        meaning: 'Salutations to Lord Shukra (Venus)' 
    },
    'Saturn': { 
        beej: 'Om Praam Preem Praum Sah Shanishcharaya Namah', 
        meaning: 'Salutations to Lord Shani (Saturn)' 
    },
    'Rahu': { 
        beej: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', 
        meaning: 'Salutations to Rahu, the North Node' 
    },
    'Ketu': { 
        beej: 'Om Straam Streem Straum Sah Ketave Namah', 
        meaning: 'Salutations to Ketu, the South Node' 
    },
};

const CircularProgress = ({ 
    percentage, 
    color = "amber",
    size = "md"
}: { 
    percentage: number; 
    color?: "amber" | "indigo" | "red";
    size?: "sm" | "md" | "lg";
}) => {
    const radius = size === "lg" ? 36 : size === "md" ? 28 : 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const strokeWidth = size === "lg" ? 6 : size === "md" ? 5 : 4;

    const colorClasses = {
        amber: "text-amber-500",
        indigo: "text-indigo-500",
        red: "text-red-500"
    };

    const dimensions = size === "lg" ? "w-20 h-20" : size === "md" ? "w-16 h-16" : "w-14 h-14";

    return (
        <div className={cn("relative flex items-center justify-center", dimensions)}>
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx={size === "lg" ? 40 : size === "md" ? 32 : 28}
                    cy={size === "lg" ? 40 : size === "md" ? 32 : 28}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-amber-900/5"
                />
                <motion.circle
                    cx={size === "lg" ? 40 : size === "md" ? 32 : 28}
                    cy={size === "lg" ? 40 : size === "md" ? 32 : 28}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(colorClasses[color], "drop-shadow-sm")}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={cn(
                    "font-bold text-amber-900",
                    size === "lg" ? "text-[18px]" : size === "md" ? "text-[15px]" : "text-[13px]"
                )}>{percentage}%</span>
                <span className="text-[9px] text-amber-700/40 font-medium">strength</span>
            </div>
        </div>
    );
};

const InfoTooltip = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="group relative">
        <Info className="w-4 h-4 text-amber-400 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-amber-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <h5 className="text-[12px] font-bold text-amber-900 mb-1">{title}</h5>
            <p className="text-[11px] text-amber-800/70 leading-relaxed">{children}</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border-r border-b border-amber-100 rotate-45" />
        </div>
    </div>
);

export default function StrengtheningPanel({ planetaryStrengths }: StrengtheningPanelProps) {
    const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    if (!planetaryStrengths) return null;

    // Filter for weak planets to display
    const weakPlanets = Object.entries(planetaryStrengths)
        .filter(([_, data]: [string, PlanetStrengthData]) => data.is_weak || data.percentage_of_required < 100)
        .sort((a: [string, PlanetStrengthData], b: [string, PlanetStrengthData]) => a[1].percentage_of_required - b[1].percentage_of_required);

    if (weakPlanets.length === 0) {
        return (
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 text-center">
                <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-[16px] font-bold text-emerald-800 mb-1">All Planets are Strong! 🎉</h4>
                <p className="text-[13px] text-emerald-700/70">
                    Your planetary strengths are balanced. No major strengthening remedies are needed at this time.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Section Header with Explanation */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-bold text-amber-900">
                                Strengthen Weak Planets
                            </h3>
                            <button 
                                onClick={() => setShowInfo(!showInfo)}
                                className="text-[11px] text-amber-600 font-medium hover:underline"
                            >
                                {showInfo ? 'Hide info' : 'What is this?'}
                            </button>
                        </div>
                        <p className="text-[12px] text-amber-800/70 mt-1">
                            These planets need spiritual strengthening through mantra practice (Sadhana)
                        </p>
                    </div>
                </div>

                {/* Expandable Info Section */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-amber-200/50 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-4 h-4 text-amber-500" />
                                            <span className="text-[12px] font-bold text-amber-900">What is Shadbala?</span>
                                        </div>
                                        <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                            Shadbala means "six-fold strength" - a Vedic astrology measure of how strong a planet is in your birth chart. 
                                            Higher percentage = stronger planet.
                                        </p>
                                    </div>
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            <span className="text-[12px] font-bold text-amber-900">Why Mantra Japa?</span>
                                        </div>
                                        <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                            Chanting a planet's beej (seed) mantra activates its positive energies. 
                                            Regular practice helps balance weak planetary influences in your life.
                                        </p>
                                    </div>
                                    <div className="bg-white/70 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Play className="w-4 h-4 text-amber-500" />
                                            <span className="text-[12px] font-bold text-amber-900">How to Practice?</span>
                                        </div>
                                        <p className="text-[11px] text-amber-800/70 leading-relaxed">
                                            1. Click on a planet card below<br/>
                                            2. Learn its beej mantra<br/>
                                            3. Chant daily (108x or as advised)<br/>
                                            4. Complete the target repetitions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Planet Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {weakPlanets.slice(0, 4).map(([name, data]: [string, PlanetStrengthData], idx) => {
                    const percentage = Math.round(data.percentage_of_required);
                    const isExpanded = expandedPlanet === name;
                    const mantra = PLANET_MANTRAS[name];
                    const targetCount = getTargetCount(name);
                    
                    // Determine color based on strength
                    let color: "amber" | "indigo" | "red" = "amber";
                    if (percentage < 70) color = "red";
                    else if (name === 'Moon' || name === 'Jupiter' || name === 'Mars') color = "indigo";

                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "rounded-2xl border transition-all cursor-pointer overflow-hidden",
                                isExpanded 
                                    ? "bg-white border-amber-300 shadow-lg" 
                                    : "bg-white/60 border-amber-200/60 hover:bg-white hover:border-amber-200"
                            )}
                            onClick={() => setExpandedPlanet(isExpanded ? null : name)}
                        >
                            {/* Card Header - Always Visible */}
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    <CircularProgress percentage={percentage} color={color} size="md" />
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[17px] font-bold text-amber-900">{name}</h4>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                data.strength_category === 'Weak' ? "bg-red-100 text-red-700" :
                                                data.strength_category === 'Average' ? "bg-amber-100 text-amber-700" :
                                                "bg-emerald-100 text-emerald-700"
                                            )}>
                                                {data.strength_category}
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-[11px] mb-1">
                                                <span className="text-amber-700/50">Current Strength</span>
                                                <span className="font-bold text-amber-900">{percentage}%</span>
                                            </div>
                                            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        percentage < 70 ? "bg-red-500" : 
                                                        percentage < 90 ? "bg-amber-500" : "bg-emerald-500"
                                                    )}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Target Info */}
                                        <div className="flex items-center gap-4 mt-3 text-[11px]">
                                            <div className="flex items-center gap-1.5 text-amber-700/60">
                                                <Target className="w-3.5 h-3.5" />
                                                <span>Target: <strong className="text-amber-900">{targetCount.toLocaleString()}</strong> repetitions</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-600">
                                                <span>{isExpanded ? 'Show less' : 'Click for mantra'}</span>
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content - Mantra & Details */}
                            <AnimatePresence>
                                {isExpanded && mantra && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-2 border-t border-amber-100">
                                            {/* Beej Mantra Box */}
                                            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 mb-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                                                        Beej Mantra (Seed Sound)
                                                    </span>
                                                    <button className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors">
                                                        <Play className="w-4 h-4 ml-0.5" />
                                                    </button>
                                                </div>
                                                <p className="text-[16px] font-serif text-amber-900 text-center py-2 leading-relaxed">
                                                    {mantra.beej}
                                                </p>
                                                <p className="text-[11px] text-amber-700/60 text-center italic">
                                                    "{mantra.meaning}"
                                                </p>
                                            </div>

                                            {/* Daily Practice Guide */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-amber-50 rounded-lg p-3">
                                                    <span className="text-[10px] font-bold text-amber-700 uppercase">Daily Practice</span>
                                                    <p className="text-[13px] font-bold text-amber-900 mt-1">108 times</p>
                                                    <p className="text-[10px] text-amber-700/70">(~10-15 minutes)</p>
                                                </div>
                                                <div className="bg-emerald-50 rounded-lg p-3">
                                                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Best Time</span>
                                                    <p className="text-[13px] font-bold text-emerald-900 mt-1">
                                                        {name === 'Sun' ? 'Sunrise' : 
                                                         name === 'Moon' ? 'Evening' :
                                                         name === 'Saturn' ? 'Saturday Eve' : 'Morning'}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-700/70">
                                                        {name === 'Saturn' ? 'or Saturday morning' : 'before breakfast'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Tips */}
                                            <div className="mt-3 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-blue-800/80 leading-relaxed">
                                                    <strong>Tip:</strong> Use a mala (prayer beads) to keep count. 
                                                    Start with {Math.min(targetCount, 1080).toLocaleString()} repetitions 
                                                    ({Math.ceil(Math.min(targetCount, 1080) / 108)} days) and gradually increase.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary Footer */}
            <div className="bg-amber-50/50 rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    <strong>Remember:</strong> Consistency is more important than quantity. 
                    Even 5-10 minutes of daily practice brings positive changes over time. 
                    Complete the target repetitions over weeks or months as comfortable.
                </p>
            </div>
        </div>
    );
}

// Helper function for target counts
function getTargetCount(name: string): number {
    const targets: Record<string, number> = {
        'Mercury': 18036,
        'Moon': 11016,
        'Jupiter': 19008,
        'Sun': 7000,
        'Mars': 10000,
        'Venus': 16000,
        'Saturn': 23000
    };
    return targets[name] || 15000;
}
