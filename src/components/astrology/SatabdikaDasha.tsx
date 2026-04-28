"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';

interface SatabdikaDashaProps {
    periods: DashaNode[];
    onDrillDown?: (period: DashaNode) => void;
}


export default function SatabdikaDasha({ periods, onDrillDown }: SatabdikaDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);

    // Group periods by cycle dynamically (7 planets per cycle for Satabdika)
    const cycles = useMemo(() => {
        const grouped: Record<number, DashaNode[]> = {};
        periods.forEach((p: DashaNode, idx: number) => {
            const cNum = Math.floor(idx / 7) + 1;
            if (!grouped[cNum]) grouped[cNum] = [];
            grouped[cNum].push(p);
        });
        return grouped;
    }, [periods]);

    const availableCycles = useMemo(() => {
        return Object.keys(cycles).map(Number).sort((a: number, b: number) => a - b);
    }, [cycles]);

    const activeCycleNum = useMemo(() => {
        for (const cNum of availableCycles) {
            if (cycles[cNum].some((p: DashaNode) => p.isCurrent)) return cNum;
        }
        return availableCycles.length > 0 ? availableCycles[0] : 1;
    }, [cycles, availableCycles]);

    // Auto-select active cycle on load
    React.useEffect(() => {
        if (activeCycleNum) setSelectedCycle(activeCycleNum);
    }, [activeCycleNum]);

    if (availableCycles.length === 0) return null;

    const currentCyclePeriods = cycles[selectedCycle] || [];

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Cycle Navigation */}
            <div className="flex flex-wrap gap-2 items-center px-4 pt-2">
                <div className="flex bg-amber-50/50 rounded-lg p-0.5 gap-1 border border-amber-200/60 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                    {availableCycles.map((c: number) => {
                        const isActive = selectedCycle === c;
                        const cyclePeriods = cycles[c];
                        const startYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[0].startDate).split(' ').pop() : '';
                        const endYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[cyclePeriods.length - 1].endDate).split(' ').pop() : '';

                        return (
                            <button
                                key={c}
                                onClick={() => setSelectedCycle(c)}
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
                    <tbody className="divide-y divide-amber-200/40 font-medium bg-white/60">
                        {currentCyclePeriods.map((mahadasha: DashaNode, mIdx: number) => {
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mahadasha.raw?.dasha_balance_at_birth != null && mIdx === 0;

                            return (
                                <tr
                                    key={mIdx}
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
                                                    Current Active
                                                </span>
                                            )}
                                            {isBalance && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[9px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                    <AlertCircle className="w-2.5 h-2.5" />
                                                    Balance
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
                                        {calculateDuration(mahadasha.startDate, mahadasha.endDate)}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {mahadasha.isCurrent ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
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
        </div>
    );
}
