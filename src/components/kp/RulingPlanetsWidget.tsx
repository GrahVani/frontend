"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpRulingPlanetsResponse } from '@/types/kp.types';
import { RefreshCw, Clock } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface RulingPlanetsWidgetProps {
    data: KpRulingPlanetsResponse['data'] | null;
    isLoading?: boolean;
    onRefresh?: () => void;
    calculatedAt?: string;
    className?: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿', 'Jupiter': '♃',
    'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
    'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿', 'Ju': '♃',
    'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋'
};

export default function RulingPlanetsWidget({
    data,
    isLoading,
    onRefresh,
    calculatedAt,
    className,
}: RulingPlanetsWidgetProps) {

    const toDMS = (decimal: number) => {
        const signNames = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aq", "Pis"];
        let lon = decimal;
        if (lon < 0) lon += 360;
        lon = lon % 360;

        const signIdx = Math.floor(lon / 30);
        const sign = signNames[signIdx];
        const deg = Math.floor(lon % 30);
        const min = Math.floor((lon % 1) * 60);
        const sec = Math.round(((lon % 1) * 60 % 1) * 60);

        return `${sign} ${deg.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const toAngleDMS = (val: number) => {
        const isNeg = val < 0;
        const absVal = Math.abs(val);
        const deg = Math.floor(absVal);
        const min = Math.floor((absVal % 1) * 60);
        const sec = Math.round(((absVal % 1) * 60 % 1) * 60);
        return `${isNeg ? '-' : ''}${deg}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const calculateFortuna = () => {
        if (!data || !data.lagna?.longitude || !data.moon?.longitude || !data.all_planets?.Sun?.longitude) return null;
        const asc = Number(data.lagna.longitude);
        const moon = Number(data.moon.longitude);
        const sun = Number(data.all_planets.Sun.longitude);

        let fortuna = asc + moon - sun;
        if (fortuna < 0) fortuna += 360;
        if (fortuna >= 360) fortuna -= 360;

        return toDMS(fortuna);
    };

    const fortunaStr = calculateFortuna();

    if (!data && !isLoading) {
        return null;
    }

    const uniquePlanets = data?.ruling_planets?.unique_planets_by_strength || [];
    const components = data?.ruling_planets?.components;
    const strengthOrder = data?.ruling_planets?.strength_order_explanation || {};

    return (
        <div className={cn("border border-amber-200/60 rounded-lg overflow-hidden shadow-sm flex flex-col bg-white w-full", className)}>
            {/* Header */}
            <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] text-amber-900 leading-tight")}>
                        <KnowledgeTooltip term="ruling_planets">Ruling planets</KnowledgeTooltip> (RP)
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className={cn("p-1.5 rounded-full hover:bg-amber-50 text-amber-700 transition-colors border border-amber-200/60", isLoading && "animate-spin")}
                            title="Refresh RP"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <RefreshCw className="w-6 h-6 text-gold-primary animate-spin" />
                        <span className="text-[13px] font-sans text-amber-700 font-medium animate-pulse">Calculating Ruling Planets...</span>
                    </div>
                ) : (
                    <>
                        {/* Unique Planets Hero */}
                        <div className="relative p-5 bg-gradient-to-br from-amber-50/80 to-white/80 rounded-xl border border-amber-200/60 shadow-inner text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
                            <h4 className="text-[11px] text-amber-700 uppercase tracking-[0.2em] mb-3 font-semibold">Unique ruling planets by strength</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {uniquePlanets.map((planet, idx) => (
                                    <div key={planet} className="group flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-lg bg-white border border-amber-200/60 shadow-sm flex items-center justify-center text-amber-900 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300">
                                            <span className="text-[22px] font-serif">{PLANET_SYMBOLS[planet] || '☉'}</span>
                                        </div>
                                        <span className="mt-1.5 text-[13px] font-semibold text-amber-900 leading-none">{planet}</span>
                                        <span className="text-[10px] text-amber-600 uppercase tracking-tighter font-medium">Rank {idx + 1}</span>
                                    </div>
                                ))}
                                {uniquePlanets.length === 0 && <span className="text-amber-700/50 italic text-[13px] font-medium">No data available</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Component Lords Breakdown */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-amber-200/50 pb-2 text-amber-900 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Thematic components
                                </h4>

                                {/* Lagna Group */}
                                <div className="space-y-2 bg-amber-50/40 p-3 rounded-xl border border-amber-200/40">
                                    <h5 className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Lagna (ascendant)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["2_lagna_sign_lord"]} termKey="sign_lord" />
                                        <ComponentRow label="Star Lord" value={components?.["3_lagna_star_lord"]} termKey="star_lord" />
                                        <ComponentRow label="Sub Lord" value={components?.["4_lagna_sub_lord"]} termKey="sub_lord" highlight />
                                    </div>
                                </div>

                                {/* Moon Group */}
                                <div className="space-y-2 bg-amber-50/40 p-3 rounded-xl border border-amber-200/40">
                                    <h5 className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Moon (mind)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["5_moon_sign_lord"]} termKey="sign_lord" />
                                        <ComponentRow label="Star Lord" value={components?.["6_moon_star_lord"]} termKey="star_lord" />
                                        <ComponentRow label="Sub Lord" value={components?.["7_moon_sub_lord"]} termKey="sub_lord" />
                                    </div>
                                </div>

                                {/* Day Group */}
                                <div className="space-y-2 bg-amber-50/40 p-3 rounded-xl border border-amber-200/40">
                                    <h5 className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Time (day)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Day Lord" value={components?.["1_day_lord"]} termKey="ruling_planets" />
                                    </div>
                                </div>
                            </div>

                            {/* Strength Hierarchy Visual Map */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-amber-200/50 pb-2 text-amber-900 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                    Strength hierarchy
                                </h4>
                                <div className="relative pl-4 space-y-3">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400 via-amber-300/30 to-amber-200/10" />
                                    {Object.entries(strengthOrder).map(([rank, title]) => (
                                        <div key={rank} className="relative flex items-center gap-4 group">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 border-amber-300/50 bg-white z-10 flex items-center justify-center text-[10px] font-semibold",
                                                rank.includes('1') || rank.includes('strongest') ? "border-amber-500 text-amber-800 shadow-sm scale-110" : "text-amber-700"
                                            )}>
                                                {rank.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[14px] font-medium",
                                                    rank.includes('1') || rank.includes('strongest') ? "text-amber-900 font-semibold" : "text-amber-800/80"
                                                )}>
                                                    {title}
                                                </span>
                                                <span className="text-[11px] text-amber-600 uppercase tracking-tighter font-medium">
                                                    {rank.includes('strongest') ? 'Primary factor' : rank.includes('weakest') ? 'Secondary influence' : `Strength level ${rank.charAt(0)}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculation Stats Footer */}
                                <div className="mt-5 pt-4 border-t border-amber-200/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {fortunaStr && <CalcBadge icon={<span className="text-[12px]">⊗</span>} label="Pars fortuna" value={fortunaStr} termKey="kp_fortuna" />}
                                    {data?.ayanamsa && <CalcBadge icon={<Clock className="w-3 h-3" />} label="KP ayanamsa" value={toAngleDMS(data.ayanamsa.value)} mono termKey="kp_ayanamsa" />}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ComponentRow({ label, value, highlight = false, termKey }: { label: string, value: string | undefined, highlight?: boolean, termKey?: string }) {
    return (
        <div className={cn(
            "grid grid-cols-[100px_1fr] items-center py-1 px-3 rounded-lg transition-colors",
            highlight ? "bg-amber-100 border border-amber-200/60 shadow-sm" : "hover:bg-amber-50/60"
        )}>
            <span className="text-[11px] text-amber-700 uppercase tracking-wider font-medium">{termKey ? <KnowledgeTooltip term={termKey}>{label}</KnowledgeTooltip> : label}</span>
            <div className="flex items-center gap-2">
                <span className="text-[14px] text-amber-900 font-semibold">{value || '-'}</span>
                {highlight && <span className="text-[8px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full uppercase font-semibold tracking-tighter shadow-sm">Strong</span>}
            </div>
        </div>
    );
}

function CalcBadge({ icon, label, value, mono = false, termKey }: { icon: React.ReactNode, label: string, value: string, mono?: boolean, termKey?: string }) {
    return (
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-amber-200/60 shadow-sm">
            <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/60">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-amber-700 uppercase tracking-widest font-medium">{termKey ? <KnowledgeTooltip term={termKey}>{label}</KnowledgeTooltip> : label}</span>
                <span className={cn("text-[13px] text-amber-900 font-semibold", mono && "font-mono")}>{value}</span>
            </div>
        </div>
    );
}
