"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Info,
    ChevronDown,
    ChevronUp,
    Award,
    Activity,
    Clock,
    Compass,
    Zap,
    Target,
    BarChart3,
    Medal,
    HelpCircle,
    BookOpen,
    Lightbulb
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';

// ============================================================================
// Types matching the JSON structure
// ============================================================================

interface PlanetDetails {
    [key: string]: number;
}

interface IshtaKashta {
    Ishta: number;
    Kashta: number;
}

interface ShadbalaData {
    [key: string]: PlanetDetails | IshtaKashta | Record<string, number> | Record<string, string>;
}

// Planet colors
const PLANET_COLORS: Record<string, { bg: string; text: string; border: string; light: string }> = {
    'Sun': { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
    'Moon': { bg: 'bg-slate-400', text: 'text-slate-700', border: 'border-slate-200', light: 'bg-slate-50' },
    'Mars': { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', light: 'bg-red-50' },
    'Mercury': { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
    'Jupiter': { bg: 'bg-yellow-600', text: 'text-yellow-700', border: 'border-yellow-200', light: 'bg-yellow-50' },
    'Venus': { bg: 'bg-pink-500', text: 'text-pink-700', border: 'border-pink-200', light: 'bg-pink-50' },
    'Saturn': { bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-200', light: 'bg-indigo-50' },
    'Rahu': { bg: 'bg-violet-600', text: 'text-violet-700', border: 'border-violet-200', light: 'bg-violet-50' },
    'Ketu': { bg: 'bg-teal-600', text: 'text-teal-700', border: 'border-teal-200', light: 'bg-teal-50' },
};

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
};

// Beginner-friendly explanations
const BALA_EXPLANATIONS: Record<string, { name: string; emoji: string; description: string; short: string }> = {
    'Sthana Bala': { name: 'Positional Strength', emoji: '📍', short: 'Position', description: 'Planet\'s strength based on its zodiac position (own sign, exaltation, moolatrikona, friendly sign, etc.)' },
    'Dig Bala': { name: 'Directional Strength', emoji: '🧭', short: 'Direction', description: 'Planet\'s strength based on the direction it faces (Jupiter/Mercury in East, Sun/Mars in South, Saturn in West, Moon/Venus in North)' },
    'Kala Bala': { name: 'Temporal Strength', emoji: '⏰', short: 'Time', description: 'Planet\'s strength based on time factors — day/night, season, month, week, and hora (planetary hour)' },
    'Chesta Bala': { name: 'Motional Strength', emoji: '🚀', short: 'Motion', description: 'Planet\'s strength based on its speed. Slower/faster than normal = stronger. Retrograde planets get extra strength.' },
    'Naisargika Bala': { name: 'Natural Strength', emoji: '🌟', short: 'Natural', description: 'Inherent strength of planets. Sun is strongest, followed by Moon, then Venus, Mercury, Mars, Jupiter, Saturn.' },
    'Drik Bala': { name: 'Aspectual Strength', emoji: '👁️', short: 'Aspect', description: 'Strength from being aspected by friendly/benefic planets (+) or enemy/malefic planets (-).' },
};

// Column headers with beginner-friendly labels
const COLUMN_HEADERS = [
    { key: 'Planet', label: 'Planet', description: 'The 9 celestial bodies in Vedic astrology', width: 'w-20' },
    { key: 'Sthana', label: 'Sthana', full: 'Positional', description: 'Strength from zodiac position', width: 'w-14' },
    { key: 'Dig', label: 'Dig', full: 'Directional', description: 'Strength from facing direction', width: 'w-12' },
    { key: 'Kala', label: 'Kala', full: 'Temporal', description: 'Strength from time factors', width: 'w-12' },
    { key: 'Chesta', label: 'Chesta', full: 'Motional', description: 'Strength from speed/movement', width: 'w-14' },
    { key: 'Naisargik', label: 'Naisargik', full: 'Natural', description: 'Inherent natural strength', width: 'w-16' },
    { key: 'Drik', label: 'Drik', full: 'Aspectual', description: 'Strength from aspects', width: 'w-12' },
    { key: 'Virupas', label: 'Virupas', description: 'Total strength in virupas (1 Rupa = 60 Virupas)', width: 'w-16' },
    { key: 'Rupas', label: 'Rupas', description: 'Total strength in rupas (main measure)', width: 'w-14' },
    { key: 'Rank', label: 'Rank', description: 'Relative strength ranking among planets', width: 'w-12' },
    { key: 'PctReq', label: '% Req', full: '% Required', description: 'Percentage of required minimum strength (100% = strong)', width: 'w-14' },
    { key: 'Status', label: 'Status', description: 'Planet strength status', width: 'w-16' },
];

// Helper tooltip component
const HeaderTooltip = ({ label, full, description, children }: { label: string; full?: string; description: string; children: React.ReactNode }) => (
    <div className="group relative flex flex-col items-center cursor-help">
        {children}
        <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl">
            <p className="font-bold text-amber-300">{full || label}</p>
            <p className="text-slate-300 mt-0.5">{description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
    </div>
);

// Helper to extract planet name from key like "Jupiter_details"
const getPlanetFromKey = (key: string): string => {
    return key.replace('_details', '').replace('_', ' ');
};

// Helper to check if key is a planet details key
const isPlanetDetails = (key: string): boolean => {
    return key.endsWith('_details');
};

// Helper to format bala names
const formatBalaName = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function ShadbalaDashboard({ displayData }: { displayData: ShadbalaData }) {
    const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState(false);

    if (!displayData) return null;

    // Extract data from JSON
    const meta = (displayData.meta || {}) as Record<string, unknown>;
    const strengthSummary = (displayData.strength_summary || {}) as Record<string, string>;
    const shadbalaRupas = (displayData.shadbala_rupas || {}) as Record<string, number>;
    const shadbalaVirupas = (displayData.shadbala_virupas || {}) as Record<string, number>;
    const relativeRank = (displayData.relative_rank || {}) as Record<string, number>;
    const percentageOfRequired = (displayData.percentage_of_required || {}) as Record<string, number>;
    const ishtaKashtaPhala = (displayData.ishta_kashta_phala || {}) as unknown as Record<string, IshtaKashta>;

    // Get planet details
    const planetDetails: Record<string, PlanetDetails> = {};
    Object.keys(displayData).forEach(key => {
        if (isPlanetDetails(key)) {
            const planet = getPlanetFromKey(key);
            planetDetails[planet] = displayData[key] as PlanetDetails;
        }
    });

    // Get sorted planets by rupas
    const planets = Object.keys(shadbalaRupas).sort((a, b) => shadbalaRupas[b] - shadbalaRupas[a]);
    const strongest = planets[0];
    const weakest = planets[planets.length - 1];

    const toggleExpand = (planet: string) => {
        setExpandedPlanet(expandedPlanet === planet ? null : planet);
    };

    return (
        <div className="space-y-3">
            {/* Compact Subheader */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                        <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[16px] font-bold text-amber-900">Shadbala</h2>
                            <span className="text-[10px] px-2 py-0.5 bg-amber-200/50 text-amber-800 rounded-full font-medium">Six-Fold Strength</span>
                        </div>
                        <p className="text-[11px] text-amber-800/70 leading-tight mt-0.5">
                            Measures how strong each planet is. Stronger planets = better results in their areas.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowGuide(!showGuide)}
                        className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-amber-700 hover:text-amber-800 bg-white/60 hover:bg-white px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        {showGuide ? 'Hide' : 'Learn'}
                        {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>

                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-amber-200/50"
                    >
                        <div className="bg-white/60 rounded-lg p-2.5 mb-2">
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                                <strong>Shadbala</strong> (Sanskrit: षड्बल) means "Six-fold Strength". It's a comprehensive 
                                system to measure planetary strength in Vedic astrology. Each planet's strength is calculated 
                                from 6 factors. A planet with <strong>100%+ strength</strong> is considered strong and gives 
                                good results. Weak planets may need remedies.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                            {Object.entries(BALA_EXPLANATIONS).map(([key, info]) => (
                                <div key={key} className="bg-white/70 rounded-lg p-2 border border-amber-100">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base">{info.emoji}</span>
                                        <span className="text-[10px] font-bold text-amber-900">{info.name}</span>
                                    </div>
                                    <p className="text-[9px] text-ink/60 leading-tight mt-0.5">{info.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Strongest & Weakest Cards - Compact */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[9px] font-bold uppercase text-emerald-700 tracking-wide">Strongest</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md", PLANET_COLORS[strongest]?.bg || 'bg-amber-500')}>
                            {PLANET_SYMBOLS[strongest]}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[14px] font-bold text-ink truncate">{strongest}</h3>
                            <p className="text-[12px] font-bold text-emerald-700">{shadbalaRupas[strongest]?.toFixed(2)} <span className="text-[9px] font-normal">Rupas</span></p>
                            <p className="text-[9px] text-emerald-600">#{(percentageOfRequired[strongest] * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-[9px] font-bold uppercase text-red-700 tracking-wide">Weakest</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md", PLANET_COLORS[weakest]?.bg || 'bg-red-500')}>
                            {PLANET_SYMBOLS[weakest]}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[14px] font-bold text-ink truncate">{weakest}</h3>
                            <p className="text-[12px] font-bold text-red-700">{shadbalaRupas[weakest]?.toFixed(2)} <span className="text-[9px] font-normal">Rupas</span></p>
                            <p className="text-[9px] text-red-600">#{(percentageOfRequired[weakest] * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Legend */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Guide:
                </span>
                <span className="flex items-center gap-1 text-slate-600"><span className="text-emerald-500 font-bold">●</span> 100%+ = Strong</span>
                <span className="flex items-center gap-1 text-slate-600"><span className="text-amber-500 font-bold">●</span> 80-99% = Average</span>
                <span className="flex items-center gap-1 text-slate-600"><span className="text-red-500 font-bold">●</span> &lt;80% = Weak</span>
                <span className="flex items-center gap-1 text-slate-600"><HelpCircle className="w-3 h-3" /> Hover columns for details</span>
            </div>

            {/* All Planets Summary Table */}
            <div className="bg-white rounded-2xl border border-gold-primary/10 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <h3 className="text-[13px] font-bold text-ink">Complete Strength Table</h3>
                    <span className="text-[9px] text-slate-500 ml-auto">Click planet for details</span>
                </div>
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-wide border-b border-slate-200">
                    <div className="col-span-2">Planet</div>
                    <div className="col-span-1 text-center" title="Positional Strength">Sthana</div>
                    <div className="col-span-1 text-center" title="Directional Strength">Dig</div>
                    <div className="col-span-1 text-center" title="Temporal Strength">Kala</div>
                    <div className="col-span-1 text-center" title="Motional Strength">Chesta</div>
                    <div className="col-span-1 text-center" title="Natural Strength">Naisar</div>
                    <div className="col-span-1 text-center" title="Aspectual Strength">Drik</div>
                    <div className="col-span-1 text-center" title="Total in Virupas">Viru</div>
                    <div className="col-span-1 text-center" title="Total in Rupas">Rupas</div>
                    <div className="col-span-1 text-center" title="Percentage of Required">%Req</div>
                    <div className="col-span-1 text-center" title="Status">Status</div>
                </div>
                {/* Table Body */}
                <div className="divide-y divide-slate-100">
                    {planets.map((planet, idx) => {
                        const colors = PLANET_COLORS[planet] || PLANET_COLORS['Sun'];
                        const percentage = (percentageOfRequired[planet] || 0) * 100;
                        const isExpanded = expandedPlanet === planet;
                        const details = planetDetails[planet];
                        const sthana = details?.Sthana_Bala || details?.Sthana || 0;
                        const dig = details?.Dig_Bala || details?.Dig || 0;
                        const kala = details?.Kala_Bala || details?.Kala || 0;
                        const chesta = details?.Chesta_Bala || details?.Chesta || 0;
                        const naisargik = details?.Naisargika_Bala || details?.Naisargik || 0;
                        const drik = details?.Drik_Bala || details?.Drik || 0;

                        return (
                            <motion.div
                                key={planet}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                className={cn(
                                    "transition-colors",
                                    isExpanded ? colors.light : "hover:bg-slate-50"
                                )}
                            >
                                {/* Table Row */}
                                <div 
                                    className="grid grid-cols-12 gap-1 px-3 py-2 items-center cursor-pointer text-[11px]"
                                    onClick={() => toggleExpand(planet)}
                                >
                                    {/* Planet Name */}
                                    <div className="col-span-2 flex items-center gap-1.5">
                                        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold", colors.bg)}>
                                            {PLANET_SYMBOLS[planet]}
                                        </div>
                                        <span className="font-semibold text-ink truncate">{planet}</span>
                                    </div>
                                    
                                    {/* Six Bala Values */}
                                    <div className="col-span-1 text-center font-mono text-slate-600">{sthana ? sthana.toFixed(0) : '-'}</div>
                                    <div className="col-span-1 text-center font-mono text-slate-600">{dig ? dig.toFixed(0) : '-'}</div>
                                    <div className="col-span-1 text-center font-mono text-slate-600">{kala ? kala.toFixed(0) : '-'}</div>
                                    <div className="col-span-1 text-center font-mono text-slate-600">{chesta ? chesta.toFixed(0) : '-'}</div>
                                    <div className="col-span-1 text-center font-mono text-slate-600">{naisargik ? naisargik.toFixed(0) : '-'}</div>
                                    <div className="col-span-1 text-center font-mono text-slate-600">{drik ? drik.toFixed(0) : '-'}</div>
                                    
                                    {/* Totals */}
                                    <div className="col-span-1 text-center font-mono font-semibold text-amber-700">{shadbalaVirupas[planet]?.toFixed(0)}</div>
                                    <div className="col-span-1 text-center font-mono font-bold text-ink">{shadbalaRupas[planet]?.toFixed(2)}</div>
                                    
                                    {/* Percentage with mini bar */}
                                    <div className="col-span-1 text-center">
                                        <div className="flex items-center gap-1">
                                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        percentage >= 100 ? 'bg-emerald-500' : 
                                                        percentage >= 80 ? 'bg-amber-500' : 'bg-red-500'
                                                    )}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                />
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold w-7",
                                                percentage >= 100 ? 'text-emerald-600' : 
                                                percentage >= 80 ? 'text-amber-600' : 'text-red-600'
                                            )}>{percentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Status Badge */}
                                    <div className="col-span-1 text-center flex justify-center">
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                            percentage >= 100 ? 'bg-emerald-100 text-emerald-700' :
                                            percentage >= 80 ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        )}>
                                            {percentage >= 100 ? 'Strong' : percentage >= 80 ? 'Avg' : 'Weak'}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && details && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={cn("px-3 pb-3 border-t", colors.border)}
                                    >
                                        <div className="pt-3 space-y-3">
                                            {/* Six-fold Breakdown with Explanations */}
                                            <div>
                                                <h5 className="text-[10px] font-bold text-ink/70 uppercase mb-2 flex items-center gap-1.5">
                                                    <Target className="w-3 h-3" />
                                                    Six-Fold Strength Breakdown for {planet}
                                                </h5>
                                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                    {Object.entries(BALA_EXPLANATIONS).map(([key, info]) => {
                                                        const value = details[key.replace(/ /g, '_')] || details[key] || 0;
                                                        return (
                                                            <div key={key} className="bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <span className="text-sm">{info.emoji}</span>
                                                                    <span className="text-[9px] font-bold text-ink/70 leading-tight">{info.short}</span>
                                                                </div>
                                                                <p className="text-[14px] font-bold text-ink">{value ? value.toFixed(1) : '0'}</p>
                                                                <p className="text-[8px] text-ink/50 leading-tight mt-0.5">{info.name}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* What This Means */}
                                            <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                                                <p className="text-[10px] text-amber-900 leading-relaxed">
                                                    <strong>{planet}</strong> has <strong>{shadbalaRupas[planet]?.toFixed(2)} Rupas</strong> 
                                                    ({percentage.toFixed(0)}% of required strength). 
                                                    {percentage >= 100 
                                                        ? ` This is a strong ${planet}, indicating positive results in the areas of life it governs.` 
                                                        : percentage >= 80 
                                                            ? ` This is an average ${planet} — results will be mixed in its areas.` 
                                                            : ` This is a weak ${planet} — challenges may arise in areas it governs. Remedial measures may help.`}
                                                </p>
                                            </div>

                                            {/* Raw Scores */}
                                            <div className="grid grid-cols-4 gap-2">
                                                <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                                                    <span className="text-[9px] text-ink/50 block">Virupas</span>
                                                    <p className="text-[14px] font-bold text-ink">{shadbalaVirupas[planet]?.toFixed(0)}</p>
                                                    <span className="text-[8px] text-ink/40">(60 Viru = 1 Rupa)</span>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                                                    <span className="text-[9px] text-ink/50 block">Rupas</span>
                                                    <p className="text-[14px] font-bold text-ink">{shadbalaRupas[planet]?.toFixed(2)}</p>
                                                    <span className="text-[8px] text-ink/40">(Main measure)</span>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                                                    <span className="text-[9px] text-ink/50 block">Rank</span>
                                                    <p className="text-[14px] font-bold text-ink">#{relativeRank[planet]} of {planets.length}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                                                    <span className="text-[9px] text-ink/50 block">Status</span>
                                                    <p className={cn(
                                                        "text-[12px] font-bold",
                                                        percentage >= 100 ? 'text-emerald-600' : 
                                                        percentage >= 80 ? 'text-amber-600' : 'text-red-600'
                                                    )}>
                                                        {percentage >= 100 ? 'Strong 💪' : percentage >= 80 ? 'Average 👍' : 'Weak ⚠️'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Ishta Kashta Phala - Compact */}
            {ishtaKashtaPhala && Object.keys(ishtaKashtaPhala).length > 0 && (
                <div className="bg-white rounded-xl border border-gold-primary/10 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/50">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-[13px] font-bold text-ink">Ishta & Kashta Phala</h3>
                        <span className="text-[9px] text-slate-500 ml-auto">Good vs Challenging Results</span>
                    </div>
                    <div className="p-3">
                    <div className="space-y-2">
                        {planets.map(planet => {
                            const ik = ishtaKashtaPhala[planet];
                            if (!ik) return null;
                            const total = ik.Ishta + ik.Kashta;
                            const ishtaPct = total > 0 ? (ik.Ishta / total) * 100 : 50;
                            
                            return (
                                <div key={planet} className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-ink w-16">{planet}</span>
                                    <div className="flex-1">
                                        <div className="h-3 w-full rounded-full overflow-hidden flex">
                                            <div 
                                                className="h-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold"
                                                style={{ width: `${ishtaPct}%` }}
                                            >
                                                {ishtaPct > 20 && `${ik.Ishta.toFixed(0)}`}
                                            </div>
                                            <div 
                                                className="h-full bg-rose-500 flex items-center justify-center text-[8px] text-white font-bold"
                                                style={{ width: `${100 - ishtaPct}%` }}
                                            >
                                                {ishtaPct < 80 && `${ik.Kashta.toFixed(0)}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] w-20 justify-end">
                                        <span className="text-emerald-600 font-bold">{ik.Ishta.toFixed(1)}</span>
                                        <span className="text-ink/30">/</span>
                                        <span className="text-rose-500 font-bold">{ik.Kashta.toFixed(1)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                        <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-slate-500">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Ishta (Auspicious/Good)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                <span>Kashta (Challenging/Difficult)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Note - Compact */}
            <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200/50">
                <p className="text-[10px] text-amber-800/70 text-center leading-relaxed">
                    <strong>💡 For Beginners:</strong> Planets with <strong>100%+</strong> strength give good results. 
                    Weaker planets (&lt;80%) may benefit from remedies like mantras or gemstones. 
                    Click on any planet row above to see detailed breakdown.
                </p>
            </div>
        </div>
    );
}
