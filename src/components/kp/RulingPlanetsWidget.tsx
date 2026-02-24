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

    return (
        <div className={cn("w-full bg-white rounded-2xl border border-antique shadow-sm p-6", className)}>
            {/* Header / Toolbar */}
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-serif font-bold text-primary border-b border-antique pb-1 mb-2 inline-block">
                    Ruling Planets
                </h3>
                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            className={cn("p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500", isLoading && "animate-spin")}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="py-8 flex justify-center text-gold-primary animate-pulse">Loading...</div>
            ) : data && data.ruling_planets ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-[15px] text-primary">
                    {/* Left Column: Lords */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Day lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["1_day_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Lagna lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["2_lagna_sign_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Lagna Nak Lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["3_lagna_star_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Lagna Sub Lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["4_lagna_sub_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center mt-3 pt-3 border-t border-antique/50">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Moon Rashi lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["5_moon_sign_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Moon Nak. lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["6_moon_star_lord"]}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Moon Sub lord</span>
                            <span className="font-semibold text-primary">: {data.ruling_planets.components["7_moon_sub_lord"]}</span>
                        </div>
                    </div>

                    {/* Right Column: Calculations */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-antique/50 pt-4 md:pt-0 md:pl-8">
                        {fortunaStr && (
                            <div className="grid grid-cols-[120px_1fr] items-center">
                                <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Fortuna</span>
                                <span className="font-semibold text-primary">: {fortunaStr}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[120px_1fr] items-center">
                            <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">Bal. of dasha</span>
                            {/* Placeholder or TODO if data unavailable */}
                            <span className="font-semibold text-primary">: <span className="opacity-50 font-normal">-</span></span>
                        </div>
                        {data.ayanamsa && (
                            <div className="grid grid-cols-[120px_1fr] items-center">
                                <span className="text-muted-refined font-semibold uppercase tracking-wide text-xs">KP Ayanamsa</span>
                                <span className="font-semibold text-primary">: <span className="font-mono text-xs">{toAngleDMS(data.ayanamsa.value)}</span></span>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
