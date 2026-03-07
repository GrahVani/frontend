"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronDown, ChevronUp, Calendar, Milestone, Info } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';

interface TribhagiDashaProps {
    periods: DashaNode[];
}


const ERA_NAMES: Record<number, string> = {
    1: "First Era (Childhood To Youth)",
    2: "Second Era (Adulthood)",
    3: "Third Era (Maturity & Wisdom)",
    4: "Fourth Era (Legacy)"
};

export default function TribhagiDasha({ periods }: TribhagiDashaProps) {
    const [selectedCycle, setSelectedCycle] = useState<number>(1);
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

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
                <div className="flex bg-gold-soft/40 rounded-lg p-0.5 gap-1 border border-header-border/10 backdrop-blur-sm overflow-x-auto scrollbar-hide">
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
                                        : "hover:bg-primary/5 text-primary/70 font-medium"
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
                    <h3 className="text-[10px] font-bold text-secondary flex items-center gap-2 uppercase tracking-wider bg-gold-soft/30 px-2 py-1 rounded-md border border-header-border/10">
                        <Milestone className="w-3 h-3 text-accent-gold" />
                        {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                    </h3>
                </div>
            </div>

            <div className="flex items-center justify-end sm:hidden px-4">
                <h3 className="text-[10px] font-bold text-secondary flex items-center gap-2 uppercase tracking-wider">
                    <Milestone className="w-3.5 h-3.5 text-accent-gold" />
                    {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                </h3>
            </div>

            {/* Table */}
            <div className="">
                <table className="w-full border-separate border-spacing-0">
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-white border-b border-header-border/20 sticky top-0 z-10 shadow-sm")}>
                        <tr>
                            <th className="px-3 py-2 text-left border-b border-header-border/10">Planet</th>
                            <th className="px-3 py-2 text-left border-b border-header-border/10">Start Date</th>
                            <th className="px-3 py-2 text-left border-b border-header-border/10">End Date</th>
                            <th className="px-3 py-2 text-left border-b border-header-border/10">Duration</th>
                            <th className="px-3 py-2 text-center border-b border-header-border/10">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-header-border/10 font-medium">
                        {currentCyclePeriods.map((mahadasha, mIdx) => {
                            const isExpanded = expandedMahadasha === `${selectedCycle}-${mahadasha.planet}`;
                            const antardashas = mahadasha.sublevel || [];

                            return (
                                <React.Fragment key={mIdx}>
                                    <tr
                                        className={cn(
                                            "hover:bg-accent-gold/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-accent-gold/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : `${selectedCycle}-${mahadasha.planet}`)}
                                    >
                                        <td className="px-3 py-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-sm min-w-[60px] justify-center",
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
                                                <Calendar className="w-3 h-3 text-muted/40" />
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
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-3 h-3 text-accent-gold" /> : <ChevronDown className="w-3 h-3 text-accent-gold" />
                                                ) : (
                                                    <span className="text-accent-gold/40 text-xs">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Antardasha Row */}
                                    {isExpanded && antardashas.length > 0 && (
                                        <tr>
                                            <td colSpan={5} className="bg-parchment/60/60 px-3 py-2">
                                                <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2 pl-2 border-l-2 border-header-border/30 ml-1">
                                                    Sub-Periods
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-header-border/10">
                                                        {antardashas.map((antar, aIdx) => (
                                                            <tr key={aIdx} className={cn(
                                                                "hover:bg-white/50 transition-colors",
                                                                antar.isCurrent && "bg-green-50/50"
                                                            )}>
                                                                <td className="px-3 py-1.5">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border opacity-90",
                                                                        PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                    )}>
                                                                        {antar.planet}
                                                                    </span>
                                                                </td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>{formatDateDisplay(antar.startDate)}</td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>{formatDateDisplay(antar.endDate)}</td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-1.5")}>
                                                                    {standardizeDuration((antar.raw?.duration_years as number) || (antar.raw?.years as number) || 0, antar.raw?.duration_days as number)}
                                                                </td>
                                                                <td className="px-3 py-1.5 text-center">
                                                                    {antar.isCurrent && (
                                                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
