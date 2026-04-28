"use client";

import React from 'react';
import type { KpHouseSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface HouseSignificatorsTableProps {
    data: KpHouseSignification[];
    className?: string;
}

export default function HouseSignificatorsTable({ data, className }: HouseSignificatorsTableProps) {
    const houseNames = [
        "First", "Second", "Third", "Fourth", "Fifth", "Sixth",
        "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"
    ];

    const formatPlanets = (planets: string[]) => {
        if (!planets || planets.length === 0) return '—';
        return planets.map(p => p.substring(0, 2)).join(', ');
    };

    return (
        <div className={cn("w-full h-full overflow-auto scrollbar-thin", className)}>
            <table className="w-full text-[12px] border-collapse font-sans">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-amber-50/80 border-y border-amber-200/50 backdrop-blur-sm">
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>House</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            In Nak. of <KnowledgeTooltip term="occupant">Occupants</KnowledgeTooltip>
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            <KnowledgeTooltip term="occupant">Occupants</KnowledgeTooltip>
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            In Nak. of <KnowledgeTooltip term="sign_lord">Sign Lord</KnowledgeTooltip>
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            <KnowledgeTooltip term="kp_cusp">Cusp</KnowledgeTooltip>{' '}
                            <KnowledgeTooltip term="sign_lord">Sign Lord</KnowledgeTooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={row.house}
                            className={cn(
                                "border-b border-amber-200/40 hover:bg-amber-50 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-amber-50/40"
                            )}
                        >
                            {/* House */}
                            <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-amber-200/60 bg-white text-amber-900 text-[10px] font-semibold shadow-sm shrink-0">
                                        {row.house}
                                    </span>
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {houseNames[row.house - 1]}
                                    </span>
                                </span>
                            </td>

                            {/* Planets in nak. of occupants */}
                            <td className="py-1.5 px-3">
                                <span className="text-[14px] text-amber-900 font-medium">
                                    {formatPlanets(row.levelB)}
                                </span>
                            </td>

                            {/* Occupants */}
                            <td className="py-1.5 px-3">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatPlanets(row.levelA)}
                                </span>
                            </td>

                            {/* Planets in nak. of cusp sign lord */}
                            <td className="py-1.5 px-3">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatPlanets(row.levelD)}
                                </span>
                            </td>

                            {/* Cusp sign lord */}
                            <td className="py-1.5 px-3">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatPlanets(row.levelC)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
