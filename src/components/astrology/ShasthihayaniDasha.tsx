"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronDown, ChevronUp, Calendar, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { KnowledgeTooltip } from '@/components/knowledge';

interface ShasthihayaniDashaProps {
    periods: DashaNode[];
    isApplicable?: boolean;
}


const FIXED_DURATIONS: Record<string, number> = {
    'Mercury': 10,
    'Venus': 8,
    'Saturn': 12,
    'Rahu': 12,
    'Jupiter': 10,
    'Sun': 6,
    'Mars': 7,
    'Moon': 5
};

export default function ShasthihayaniDasha({ periods, isApplicable = true }: ShasthihayaniDashaProps) {
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

    // SHASTRA RULE: Render only one complete 60-year cycle.
    const shastraPeriods: DashaNode[] = [];
    let moonFound = false;
    for (const p of periods) {
        shastraPeriods.push(p);
        if (p.planet === 'Moon') {
            moonFound = true;
            break;
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Applicability Banner */}
            {!isApplicable && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mx-4 mt-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                        <p className="text-[14px] font-bold text-amber-900">Not Highly Applicable</p>
                        <p className="text-[12px] text-amber-700">This Ṣaṣṭihāyanī system is not applicable for this chart according to standard rules.</p>
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
                        {shastraPeriods.map((mahadasha, mIdx) => {
                            const uniqueId = `shasthi-${mahadasha.planet}-${mIdx}`;
                            const isExpanded = expandedMahadasha === uniqueId;
                            const antardashas = mahadasha.sublevel || [];
                            const isBalance = mIdx === 0 && (mahadasha.type === "Balance" || mahadasha.isBalance);
                            const fixedYears = FIXED_DURATIONS[mahadasha.planet || ""];

                            return (
                                <React.Fragment key={uniqueId}>
                                    <tr
                                        className={cn(
                                            "hover:bg-gold-primary/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-gold-primary/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : uniqueId)}
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
                                                    <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-semibold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
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
                                                {fixedYears && !isBalance && (
                                                    <span className="text-2xs text-gold-dark leading-none mt-0.5">{fixedYears} Years Fixed</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {mahadasha.isCurrent ? (
                                                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-4 h-4 text-gold-dark" /> : <ChevronDown className="w-4 h-4 text-gold-dark" />
                                                ) : (
                                                    <span className="text-gold-dark/40 text-[12px]">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Antardasha Row */}
                                    {isExpanded && antardashas.length > 0 && (
                                        <tr>
                                            <td colSpan={5} className="bg-surface-pure/60 px-3 py-2">
                                                <div className="text-2xs font-black text-gold-dark uppercase tracking-[0.2em] mb-2 pl-2">
                                                    <KnowledgeTooltip term="dasha_antardasha">Antardasha</KnowledgeTooltip> Sub-Periods
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-gold-primary/10">
                                                        {antardashas.map((antar, aIdx) => (
                                                            <tr key={aIdx} className={cn(
                                                                "hover:bg-white/50 transition-colors",
                                                                antar.isCurrent && "bg-green-50/50"
                                                            )}>
                                                                <td className="px-3 py-2">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-bold border",
                                                                        PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                    )}>
                                                                        {antar.planet}
                                                                    </span>
                                                                </td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(antar.startDate)}</td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(antar.endDate)}</td>
                                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                                                    {calculateDuration(antar.startDate, antar.endDate)}
                                                                </td>
                                                                <td className="px-3 py-2 text-center">
                                                                    {antar.isCurrent && (
                                                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
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

            {/* Shastra Rule Footer */}
            {!moonFound && periods.length > 0 && (
                <div className="text-center pt-2">
                    <p className="text-[12px] font-semibold text-ink/30 uppercase tracking-widest italic">
                        Timeline truncated as per Shastra rules (Single 60-Year Cycle)
                    </p>
                </div>
            )}
        </div>
    );
}
