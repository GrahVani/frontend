"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, Info, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';

interface ShattrimshatsamaDashaProps {
    periods: DashaNode[];
    isApplicable?: boolean;
    onDrillDown?: (period: DashaNode) => void;
}


const FIXED_DURATIONS: Record<string, number> = {
    'Saturn': 6,
    'Venus': 7,
    'Rahu': 8,
    'Moon': 1,
    'Sun': 2,
    'Jupiter': 3,
    'Mars': 4,
    'Mercury': 5
};

export default function ShattrimshatsamaDasha({ periods, isApplicable = true, onDrillDown }: ShattrimshatsamaDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number | string>(1);

    // Group periods by cycle dynamically (8 planets per cycle for Shattrimshatsama)
    const cycles = useMemo(() => {
        const grouped: Record<string | number, DashaNode[]> = {};
        if (!Array.isArray(periods)) return grouped;
        periods.forEach((p: DashaNode, idx: number) => {
            const cNum = (p.raw?.cycle || p.raw?.cycle_number || Math.floor(idx / 8) + 1) as string | number;
            if (!grouped[cNum]) grouped[cNum] = [];
            grouped[cNum].push(p);
        });
        return grouped;
    }, [periods]);

    const availableCycles = useMemo(() => {
        return Object.keys(cycles).sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        });
    }, [cycles]);

    const activeCycleNum = useMemo(() => {
        if (!availableCycles.length) return "1";
        for (const cKey of availableCycles) {
            const cyclePeriods = cycles[cKey as any];
            if (cyclePeriods && Array.isArray(cyclePeriods) && cyclePeriods.some((p: DashaNode) => p.isCurrent)) {
                return cKey;
            }
        }
        return availableCycles[0];
    }, [cycles, availableCycles]);

    // Auto-select active cycle on load
    React.useEffect(() => {
        if (activeCycleNum !== undefined && cycles[activeCycleNum as any]) {
            setSelectedCycle(activeCycleNum);
        } else if (availableCycles.length > 0) {
            setSelectedCycle(availableCycles[0]);
        }
    }, [activeCycleNum, cycles, availableCycles]);

    if (availableCycles.length === 0) return null;

    const currentCyclePeriods = cycles[selectedCycle as any] || [];

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Applicability Warning */}
            {!isApplicable && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mx-4 mt-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-[12px] font-bold text-amber-900">Not Highly Applicable</p>
                        <p className="text-[10px] text-amber-700">This Śattriṁśat Samā (36-year) system is specifically for Daytime births with Moon in Lagna.</p>
                    </div>
                </div>
            )}

            {/* Cycle Navigation */}
            {availableCycles.length > 1 && (
                <div className="flex flex-wrap gap-2 items-center px-4 pt-2">
                    <div className="flex bg-amber-50/50 rounded-lg p-0.5 gap-1 border border-amber-200/60 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                        {availableCycles.map((c: string | number) => {
                            const isActive = String(selectedCycle) === String(c);
                            const cyclePeriods = cycles[c as any] || [];
                            const startYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[0].startDate).split(' ').pop() : '';
                            const endYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[cyclePeriods.length - 1].endDate).split(' ').pop() : '';

                            return (
                                <button
                                    key={c}
                                    onClick={() => setSelectedCycle(c as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap",
                                        isActive
                                            ? "bg-amber-600 text-white shadow-sm font-semibold"
                                            : "hover:bg-amber-50 text-amber-700 font-medium"
                                    )}
                                >
                                    <span className="text-[10px] uppercase tracking-wider">Cycle {c}</span>
                                    <span className="text-[10px] opacity-60">|</span>
                                    <span className="text-[10px] font-mono opacity-80">{startYear}-{endYear}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="">
                <table className="w-full border-separate border-spacing-0">
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-white border-b border-amber-200/60 sticky top-0 z-30 shadow-sm")}>
                        <tr>
                            <th className="px-3 py-2 text-left text-amber-800">Planet</th>
                            <th className="px-3 py-2 text-left text-amber-800">Start Date</th>
                            <th className="px-3 py-2 text-left text-amber-800">End Date</th>
                            <th className="px-3 py-2 text-left text-amber-800">Duration</th>
                            <th className="px-3 py-2 text-center text-amber-800">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200/40 font-medium font-sans bg-white/60">
                        {currentCyclePeriods.map((mahadasha, mIdx) => {
                            const uniqueId = `shattrim-${mahadasha.planet}-${mIdx}`;
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mIdx === 0;
                            const fixedYears = FIXED_DURATIONS[mahadasha.planet || ""];

                            return (
                                <tr
                                    key={uniqueId}
                                    className={cn(
                                        "hover:bg-amber-50/60 transition-colors group",
                                        mahadasha.isCurrent && "bg-amber-50/40",
                                        canDrill ? "cursor-pointer" : "cursor-default"
                                    )}
                                    onClick={() => canDrill && onDrillDown?.(mahadasha)}
                                >
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[14px] font-semibold border shadow-sm min-w-[72px] justify-center",
                                                PLANET_COLORS[mahadasha.planet || ''] || "bg-white border-amber-200 text-amber-800"
                                            )}>
                                                <span className="opacity-90 text-[14px]">{getPlanetSymbol(mahadasha.planet)}</span>{mahadasha.planet}
                                            </span>
                                            {mahadasha.isCurrent && (
                                                <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                    Current
                                                </span>
                                            )}
                                            {isBalance && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[8px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                    <AlertCircle className="w-2 h-2" />
                                                    Bal
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5 text-amber-700")}>
                                            <Calendar className="w-3 h-3 text-amber-400" />
                                            {formatDateDisplay(mahadasha.startDate)}
                                        </div>
                                    </td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>{formatDateDisplay(mahadasha.endDate)}</td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>
                                        <div className="flex flex-col">
                                            <span>{calculateDuration(mahadasha.startDate, mahadasha.endDate)}</span>
                                            {fixedYears && (
                                                <span className="text-[11px] text-amber-500 leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {mahadasha.isCurrent ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
                                            ) : canDrill ? (
                                                <ChevronRight className="w-3 h-3 text-amber-600 transition-transform group-hover:scale-125" />
                                            ) : (
                                                <span className="text-amber-400 text-[12px]">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Shastra Timeline Footer */}
            <div className="text-center pt-2">
                <p className="text-[12px] font-semibold text-amber-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Info className="w-3 h-3" />
                    Shastra Timeline End (36 Years)
                </p>
            </div>
        </div>
    );
}
