"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';

interface AshtottariDashaProps {
    periods: DashaNode[];
    onDrillDown?: (period: DashaNode) => void;
}

export default function AshtottariDasha({ periods, onDrillDown }: AshtottariDashaProps) {

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-ink/5 border-b border-gold-primary/10")}>
                        <tr>
                            <th className="px-3 py-2 text-left">Planet</th>
                            <th className="px-3 py-2 text-left">Start Date</th>
                            <th className="px-3 py-2 text-left">End Date</th>
                            <th className="px-3 py-2 text-left">Duration</th>
                            <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/10 font-medium">
                        {periods.map((mahadasha, mIdx) => {
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mahadasha.raw?.is_balance === true || mahadasha.isBalance;

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
                                    <td className="px-3 py-2">
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
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}>
                                            <Calendar className="w-3 h-3 text-ink/30" />
                                            {formatDateDisplay(mahadasha.startDate)}
                                        </div>
                                    </td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(mahadasha.endDate)}</td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                        {standardizeDuration((mahadasha.raw?.duration_years as number) || (mahadasha.raw?.years as number) || 0)}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {mahadasha.isCurrent ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                            ) : canDrill ? (
                                                <ChevronRight className="w-4 h-4 text-gold-dark transition-transform group-hover:scale-125" />
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
