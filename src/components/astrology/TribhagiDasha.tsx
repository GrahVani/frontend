"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, Milestone } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';


interface TribhagiDashaProps {
    periods: DashaNode[];
    onDrillDown?: (period: DashaNode) => void;
}


const ERA_NAMES: Record<number, string> = {
    1: "First Era (Childhood To Youth)",
    2: "Second Era (Adulthood)",
    3: "Third Era (Maturity & Wisdom)",
    4: "Fourth Era (Legacy)"
};

export default function TribhagiDasha({ periods, onDrillDown }: TribhagiDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);

    // Group periods by cycle dynamically
    const cycles = useMemo(() => {
        const grouped: Record<number, DashaNode[]> = {};
        periods.forEach((p, idx) => {
            const cNum = (p.raw?.cycle as number) || Math.floor(idx / 9) + 1;
            if (!grouped[cNum]) grouped[cNum] = [];
            grouped[cNum].push(p);
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

    const currentCyclePeriods = cycles[selectedCycle] || [];

    return (
        <div className="space-y-3 animate-in fade-in duration-700">
            {/* Cycle/Era Navigation - Compact Tabs */}
            <div className="flex flex-wrap gap-2 items-center px-4 pt-2">
                <div className="flex bg-gold-soft/40 rounded-lg p-0.5 gap-1 border border-gold-primary/10 backdrop-blur-sm overflow-x-auto scrollbar-hide">
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

                <div className="ml-auto hidden sm:flex items-center gap-2">
                    <h3 className="text-[10px] font-bold text-ink/55 flex items-center gap-2 uppercase tracking-wider bg-gold-soft/30 px-2 py-1 rounded-md border border-gold-primary/10">
                        <Milestone className="w-3 h-3 text-gold-dark" />
                        {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                    </h3>
                </div>
            </div>

            <div className="flex items-center justify-end sm:hidden px-4">
                <h3 className="text-[10px] font-bold text-ink/55 flex items-center gap-2 uppercase tracking-wider">
                    <Milestone className="w-3.5 h-3.5 text-gold-dark" />
                    {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                </h3>
            </div>

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
                    <tbody className="divide-y divide-gold-primary/10 font-medium">
                        {currentCyclePeriods.map((mahadasha, mIdx) => {
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);

                            return (
                                <tr
                                    key={mIdx}
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
                                        {standardizeDuration((mahadasha.raw?.duration_years as number) || (mahadasha.raw?.years as number) || 0, mahadasha.raw?.duration_days as number)}
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
        </div>
    );
}
