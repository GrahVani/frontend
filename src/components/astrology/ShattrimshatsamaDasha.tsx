"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, Info, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';

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
    const [selectedCycle, setSelectedCycle] = useState<number>(1);

    // Group periods by cycle dynamically
    const cycles = useMemo(() => {
        const grouped: Record<number, DashaNode[]> = {};
        periods.forEach((p, idx) => {
            const cNum = (p.raw?.cycle || p.raw?.cycle_number || Math.floor(idx / 8) + 1) as string | number;
            const cycleKey: number = typeof cNum === 'string' ? parseInt(cNum, 10) : cNum;
            if (!grouped[cycleKey]) grouped[grouped[cycleKey] ? cycleKey : cycleKey] = []; // Fixed duplicate check logic
            if (!grouped[cycleKey]) grouped[cycleKey] = [];
            grouped[cycleKey].push(p);
        });
        return grouped;
    }, [periods]);

    const availableCycles = useMemo(() => {
        return Object.keys(cycles).map(Number).sort((a, b) => a - b);
    }, [cycles]);

    const activeCycleNum = useMemo(() => {
        for (const cNum of availableCycles) {
            if (cycles[cNum].some(p => p.isCurrent)) return cNum;
        }
        return availableCycles.length > 0 ? availableCycles[0] : 1;
    }, [cycles, availableCycles]);

    React.useEffect(() => {
        if (activeCycleNum) setSelectedCycle(activeCycleNum);
    }, [activeCycleNum]);

    if (availableCycles.length === 0) return null;

    const finalPeriods = (cycles[selectedCycle] || []).slice(0, 8);

    return (
        <div className="space-y-3 animate-in fade-in duration-700">
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

            {/* Cycle Toggle Navigation */}
            {availableCycles.length > 1 && (
                <div className="px-4 pt-2">
                    <div className="flex bg-gold-soft/40 rounded-lg p-0.5 gap-1 border border-gold-primary/10 backdrop-blur-sm overflow-x-auto scrollbar-hide w-fit max-w-full">
                        {availableCycles.map((c) => {
                            const isActive = selectedCycle === c;
                            const cyclePeriods = cycles[c];
                            const startYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[0].startDate).split(' ').pop() : '';
                            const endYear = cyclePeriods.length > 0 ? formatDateDisplay(cyclePeriods[cyclePeriods.length - 1].endDate).split(' ').pop() : '';

                            return (
                                <button
                                    key={c}
                                    onClick={() => setSelectedCycle(c)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap",
                                        isActive
                                            ? "bg-primary text-active-glow shadow-sm font-semibold"
                                            : "hover:bg-primary/5 text-ink/70 font-medium"
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
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-white border-b border-gold-primary/15 sticky top-0 z-10 shadow-sm")}>
                        <tr>
                            <th className="px-3 py-2 text-left border-b border-gold-primary/10">Planet</th>
                            <th className="px-3 py-2 text-left border-b border-gold-primary/10">Start Date</th>
                            <th className="px-3 py-2 text-left border-b border-gold-primary/10">End Date</th>
                            <th className="px-3 py-2 text-left border-b border-gold-primary/10">Duration</th>
                            <th className="px-3 py-2 text-center border-b border-gold-primary/10">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/10 font-medium font-sans">
                        {finalPeriods.map((mahadasha, mIdx) => {
                            const uniqueId = `shattrim-${mahadasha.planet}-${mIdx}`;
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mIdx === 0;
                            const fixedYears = FIXED_DURATIONS[mahadasha.planet || ""];

                            return (
                                <tr
                                    key={uniqueId}
                                    className={cn(
                                        "hover:bg-gold-primary/10 transition-colors group",
                                        mahadasha.isCurrent && "bg-gold-primary/5",
                                        canDrill ? "cursor-pointer" : "cursor-default"
                                    )}
                                    onClick={() => canDrill && onDrillDown?.(mahadasha)}
                                >
                                    <td className="px-3 py-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border shadow-sm min-w-[60px] justify-center",
                                                PLANET_COLORS[mahadasha.planet || ''] || "bg-white"
                                            )}>
                                                {mahadasha.planet}
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
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}>
                                            <Calendar className="w-3 h-3 text-ink/30" />
                                            {formatDateDisplay(mahadasha.startDate)}
                                        </div>
                                    </td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>{formatDateDisplay(mahadasha.endDate)}</td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>
                                        <div className="flex flex-col">
                                            <span>{calculateDuration(mahadasha.startDate, mahadasha.endDate)}</span>
                                            {fixedYears && (
                                                <span className="text-[9px] text-gold-dark leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-1.5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {mahadasha.isCurrent ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
                                            ) : canDrill ? (
                                                <ChevronRight className="w-3 h-3 text-gold-dark transition-transform group-hover:scale-125" />
                                            ) : (
                                                <span className="text-gold-dark/40 text-[12px]">—</span>
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
                <p className="text-[12px] font-semibold text-ink/25 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Info className="w-3 h-3" />
                    Shastra Timeline End (36 Years)
                </p>
            </div>
        </div>
    );
}
