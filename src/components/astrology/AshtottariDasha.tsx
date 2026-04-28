"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';

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
                        {periods.map((mahadasha, mIdx) => {
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mahadasha.raw?.is_balance === true || mahadasha.isBalance;

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
                                        {standardizeDuration((mahadasha.raw?.duration_years as number) || (mahadasha.raw?.years as number) || 0)}
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
