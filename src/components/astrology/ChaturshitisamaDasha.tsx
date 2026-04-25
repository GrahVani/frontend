"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { DashaNode, formatDateDisplay, calculateDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';

interface ChaturshitisamaDashaProps {
    periods: DashaNode[];
    onDrillDown?: (period: DashaNode) => void;
}


export default function ChaturshitisamaDasha({ periods, onDrillDown }: ChaturshitisamaDashaProps) {

    return (
        <div className="space-y-3 animate-in fade-in duration-700">
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
                        {periods.map((mahadasha, mIdx) => {
                            const canDrill = mahadasha.canDrillFurther || (mahadasha.sublevel && mahadasha.sublevel.length > 0);
                            const isBalance = mahadasha.raw?.dasha_balance_at_birth != null && mIdx === 0;

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
                                        {calculateDuration(mahadasha.startDate, mahadasha.endDate)}
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
