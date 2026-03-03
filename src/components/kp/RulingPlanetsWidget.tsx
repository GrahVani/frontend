"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpRulingPlanetsResponse } from '@/types/kp.types';
import { RefreshCw, Clock } from 'lucide-react';

interface RulingPlanetsWidgetProps {
    data: KpRulingPlanetsResponse['data'] | null;
    isLoading?: boolean;
    onRefresh?: () => void;
    calculatedAt?: string;
    className?: string;
}

// Planet symbols
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

    // Helper: Convert Decimal Degrees to DMS String (Sign DD:MM:SS)
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

    // Helper: Convert Decimal to DMS (Angle only, for Ayanamsa)
    const toAngleDMS = (val: number) => {
        const isNeg = val < 0;
        const absVal = Math.abs(val);
        const deg = Math.floor(absVal);
        const min = Math.floor((absVal % 1) * 60);
        const sec = Math.round(((absVal % 1) * 60 % 1) * 60);
        return `${isNeg ? '-' : ''}${deg}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Calculate Fortuna (Asc + Moon - Sun)
    const calculateFortuna = () => {
        if (!data || !data.lagna?.longitude || !data.moon?.longitude || !data.all_planets?.Sun?.longitude) return null;
        // Formula: Asc + Moon - Sun
        const asc = Number(data.lagna.longitude); // Ensure number
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
        <div className={cn("border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm w-full", className)}>
            {/* Header / Toolbar */}
            <div className="bg-border-warm px-4 py-2.5 border-b border-antique flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-primary leading-tight tracking-wide">
                        Ruling Planets (RP)
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className={cn("p-1.5 rounded-full hover:bg-black/5 text-primary transition-colors border border-antique/20", isLoading && "animate-spin")}
                            title="Refresh RP"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-5">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <RefreshCw className="w-6 h-6 text-gold-primary animate-spin" />
                        <span className="text-xs font-sans text-primary animate-pulse">Calculating Ruling Planets...</span>
                    </div>
                ) : (
                    <>
                        {/* 1. Unique Planets Hero Section */}
                        <div className="relative p-4 bg-gradient-to-br from-parchment to-white rounded-xl border border-antique shadow-inner text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-50" />
                            <h4 className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em] mb-2.5">Unique Ruling Planets by Strength</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {uniquePlanets.map((planet, idx) => (
                                    <div key={planet} className="group flex flex-col items-center">
                                        <div className="w-11 h-11 rounded-lg bg-white border border-antique shadow-sm flex items-center justify-center text-primary group-hover:border-gold-primary group-hover:scale-105 transition-all duration-300">
                                            <span className="text-xl font-serif">{PLANET_SYMBOLS[planet] || '☉'}</span>
                                        </div>
                                        <span className="mt-1.5 text-xs font-bold text-primary leading-none">{planet}</span>
                                        <span className="text-[8px] text-primary/50 uppercase tracking-tighter">Rank {idx + 1}</span>
                                    </div>
                                ))}
                                {uniquePlanets.length === 0 && <span className="text-primary italic opacity-50 text-xs">No data available</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* 2. Component Lords Breakdown */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest border-b border-antique pb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                                    Thematic Components
                                </h4>

                                {/* Lagna Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-antique/40">
                                    <h5 className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">Lagna (Ascendant)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["2_lagna_sign_lord"]} />
                                        <ComponentRow label="Star Lord" value={components?.["3_lagna_star_lord"]} />
                                        <ComponentRow label="Sub Lord" value={components?.["4_lagna_sub_lord"]} highlight />
                                    </div>
                                </div>

                                {/* Moon Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-antique/40">
                                    <h5 className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">Moon (Mind)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["5_moon_sign_lord"]} />
                                        <ComponentRow label="Star Lord" value={components?.["6_moon_star_lord"]} />
                                        <ComponentRow label="Sub Lord" value={components?.["7_moon_sub_lord"]} />
                                    </div>
                                </div>

                                {/* Day Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-antique/40">
                                    <h5 className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">Time (Day)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Day Lord" value={components?.["1_day_lord"]} />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Strength Hierarchy Visual Map */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest border-b border-antique pb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    Strength Hierarchy
                                </h4>
                                <div className="relative pl-4 space-y-3">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-gold-primary via-antique to-antique/10" />
                                    {Object.entries(strengthOrder).map(([rank, title]) => (
                                        <div key={rank} className="relative flex items-center gap-4 group">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 border-antique bg-white z-10 flex items-center justify-center text-[10px] font-bold",
                                                rank.includes('1') || rank.includes('strongest') ? "border-gold-primary text-gold-dark shadow-sm scale-110" : "text-primary/60"
                                            )}>
                                                {rank.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    rank.includes('1') || rank.includes('strongest') ? "text-primary font-bold" : "text-primary/80"
                                                )}>
                                                    {title}
                                                </span>
                                                <span className="text-[10px] text-primary/40 uppercase tracking-tighter">
                                                    {rank.includes('strongest') ? 'Primary Factor' : rank.includes('weakest') ? 'Secondary Influence' : `Strength Level ${rank.charAt(0)}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculation Stats Footer */}
                                <div className="mt-5 pt-4 border-t border-antique/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {fortunaStr && <CalcBadge icon={<span className="text-xs">⊗</span>} label="Pars Fortuna" value={fortunaStr} />}
                                    {data?.ayanamsa && <CalcBadge icon={<Clock className="w-3 h-3" />} label="KP Ayanamsa" value={toAngleDMS(data.ayanamsa.value)} mono />}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Sub-components for cleaner code
function ComponentRow({ label, value, highlight = false }: { label: string, value: string | undefined, highlight?: boolean }) {
    return (
        <div className={cn(
            "grid grid-cols-[100px_1fr] items-center py-1 px-3 rounded-lg transition-colors",
            highlight ? "bg-gold-primary/10 border border-gold-primary/20" : "hover:bg-white/60"
        )}>
            <span className="text-[9px] font-semibold text-primary/60 uppercase tracking-wider">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">{value || '-'}</span>
                {highlight && <span className="text-[8px] bg-gold-primary text-white px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter shadow-sm">Strong</span>}
            </div>
        </div>
    );
}

function CalcBadge({ icon, label, value, mono = false }: { icon: React.ReactNode, label: string, value: string, mono?: boolean }) {
    return (
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-antique/50 shadow-sm">
            <div className="w-8 h-8 rounded bg-parchment flex items-center justify-center text-accent-gold border border-antique/30">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-primary/50 uppercase tracking-widest">{label}</span>
                <span className={cn("text-xs font-semibold text-primary", mono ? "font-mono" : "font-sans")}>{value}</span>
            </div>
        </div>
    );
}
