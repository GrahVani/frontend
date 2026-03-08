"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpRulingPlanetsResponse } from '@/types/kp.types';
import { RefreshCw, Clock } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

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
        <div className={cn("border border-gold-primary/20 rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm w-full", className)}>
            {/* Header / Toolbar */}
            <div className="bg-gold-primary/10 px-4 py-2.5 border-b border-gold-primary/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] leading-tight")}>
                        Ruling planets (RP)
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className={cn("p-1.5 rounded-full hover:bg-black/5 text-ink transition-colors border border-gold-primary/15", isLoading && "animate-spin")}
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
                        <span className="text-[12px] font-sans text-ink animate-pulse">Calculating Ruling Planets...</span>
                    </div>
                ) : (
                    <>
                        {/* 1. Unique Planets Hero Section */}
                        <div className="relative p-4 bg-gradient-to-br from-surface-warm to-white/80 rounded-xl border border-gold-primary/20 shadow-inner text-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-50" />
                            <h4 className={cn(TYPOGRAPHY.label, "text-[10px] !text-gold-dark uppercase tracking-[0.2em] mb-2.5")}>Unique ruling planets by strength</h4>
                            <div className="flex flex-wrap justify-center gap-3">
                                {uniquePlanets.map((planet, idx) => (
                                    <div key={planet} className="group flex flex-col items-center">
                                        <div className="w-11 h-11 rounded-lg bg-white border border-gold-primary/20 shadow-sm flex items-center justify-center text-ink group-hover:border-gold-primary group-hover:scale-105 transition-all duration-300">
                                            <span className="text-[20px] font-serif">{PLANET_SYMBOLS[planet] || '☉'}</span>
                                        </div>
                                        <span className={cn(TYPOGRAPHY.value, "mt-1.5 text-[12px] font-bold leading-none")}>{planet}</span>
                                        <span className={cn(TYPOGRAPHY.label, "text-[8px] opacity-50 uppercase tracking-tighter")}>Rank {idx + 1}</span>
                                    </div>
                                ))}
                                {uniquePlanets.length === 0 && <span className="text-ink italic opacity-50 text-[12px]">No data available</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* 2. Component Lords Breakdown */}
                            <div className="space-y-4">
                                <h4 className={cn(TYPOGRAPHY.label, "flex items-center gap-2 text-[10px] uppercase tracking-widest border-b border-gold-primary/20 pb-2")}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                                    Thematic components
                                </h4>

                                {/* Lagna Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-gold-primary/15">
                                    <h5 className={cn(TYPOGRAPHY.label, "text-[9px] !text-gold-dark uppercase tracking-wider")}>Lagna (ascendant)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["2_lagna_sign_lord"]} />
                                        <ComponentRow label="Star Lord" value={components?.["3_lagna_star_lord"]} />
                                        <ComponentRow label="Sub Lord" value={components?.["4_lagna_sub_lord"]} highlight />
                                    </div>
                                </div>

                                {/* Moon Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-gold-primary/15">
                                    <h5 className={cn(TYPOGRAPHY.label, "text-[9px] !text-gold-dark uppercase tracking-wider")}>Moon (mind)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Sign Lord" value={components?.["5_moon_sign_lord"]} />
                                        <ComponentRow label="Star Lord" value={components?.["6_moon_star_lord"]} />
                                        <ComponentRow label="Sub Lord" value={components?.["7_moon_sub_lord"]} />
                                    </div>
                                </div>

                                {/* Day Group */}
                                <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-gold-primary/15">
                                    <h5 className={cn(TYPOGRAPHY.label, "text-[9px] !text-gold-dark uppercase tracking-wider")}>Time (day)</h5>
                                    <div className="flex flex-col space-y-1.5">
                                        <ComponentRow label="Day Lord" value={components?.["1_day_lord"]} />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Strength Hierarchy Visual Map */}
                            <div className="space-y-4">
                                <h4 className={cn(TYPOGRAPHY.label, "flex items-center gap-2 text-[10px] uppercase tracking-widest border-b border-gold-primary/20 pb-2")}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    Strength hierarchy
                                </h4>
                                <div className="relative pl-4 space-y-3">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-gold-primary via-gold-primary/30 to-gold-primary/10" />
                                    {Object.entries(strengthOrder).map(([rank, title]) => (
                                        <div key={rank} className="relative flex items-center gap-4 group">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 border-gold-primary/20 bg-white z-10 flex items-center justify-center text-[10px] font-bold",
                                                rank.includes('1') || rank.includes('strongest') ? "border-gold-primary text-gold-dark shadow-sm scale-110" : "text-ink/60"
                                            )}>
                                                {rank.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    TYPOGRAPHY.value,
                                                    "text-[14px]",
                                                    rank.includes('1') || rank.includes('strongest') ? "!font-bold" : "opacity-80"
                                                )}>
                                                    {title}
                                                </span>
                                                <span className={cn(TYPOGRAPHY.label, "text-[10px] opacity-40 uppercase tracking-tighter")}>
                                                    {rank.includes('strongest') ? 'Primary factor' : rank.includes('weakest') ? 'Secondary influence' : `Strength level ${rank.charAt(0)}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculation Stats Footer */}
                                <div className="mt-5 pt-4 border-t border-gold-primary/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {fortunaStr && <CalcBadge icon={<span className="text-[12px]">⊗</span>} label="Pars fortuna" value={fortunaStr} />}
                                    {data?.ayanamsa && <CalcBadge icon={<Clock className="w-3 h-3" />} label="KP ayanamsa" value={toAngleDMS(data.ayanamsa.value)} mono />}
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
            highlight ? "bg-gold-primary/10 border border-gold-primary/20 shadow-sm" : "hover:bg-white/60"
        )}>
            <span className={cn(TYPOGRAPHY.label, "text-[9px] opacity-60 uppercase tracking-wider")}>{label}</span>
            <div className="flex items-center gap-2">
                <span className={cn(TYPOGRAPHY.value, "text-[14px] font-bold")}>{value || '-'}</span>
                {highlight && <span className={cn(TYPOGRAPHY.label, "text-[8px] bg-gold-primary !text-white px-1.5 py-0.5 rounded-full uppercase !font-bold tracking-tighter shadow-sm")}>Strong</span>}
            </div>
        </div>
    );
}

function CalcBadge({ icon, label, value, mono = false }: { icon: React.ReactNode, label: string, value: string, mono?: boolean }) {
    return (
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gold-primary/15 shadow-sm">
            <div className="w-8 h-8 rounded bg-surface-warm flex items-center justify-center text-gold-dark border border-gold-primary/20">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className={cn(TYPOGRAPHY.label, "text-[9px] opacity-50 uppercase tracking-widest")}>{label}</span>
                <span className={cn(TYPOGRAPHY.value, "text-[12px] font-semibold", mono && "font-mono")}>{value}</span>
            </div>
        </div>
    );
}
