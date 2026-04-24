"use client";

import React from 'react';
import type { KpSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface SignificationMatrixProps {
    significations: KpSignification[];
    className?: string;
}

export default function SignificationMatrix({ significations, className }: SignificationMatrixProps) {
    // Helper to format house list
    const formatHouses = (houses: number[] | undefined) => {
        if (!houses || houses.length === 0) return '—';
        return houses.join(', ');
    };

    return (
        <div className={cn("w-full overflow-auto scrollbar-thin", className)}>
            <table className="w-full text-[12px] border-collapse font-sans">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-surface-warm/60 border-y border-gold-primary/20 backdrop-blur-sm">
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-left")}>
                            Planet
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center")}>
                            Very Strong
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center")}>
                            Strong
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center")}>
                            Normal
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center")}>
                            Weak
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {significations.map((row, idx) => (
                        <tr
                            key={row.planet}
                            className={cn(
                                "border-b border-gold-primary/15 hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-surface-warm"
                            )}
                        >
                            {/* Planet */}
                            <td className="py-2 px-4 whitespace-nowrap">
                                <span className="text-[15px] text-primary font-medium">
                                    {row.planet}
                                </span>
                            </td>

                            {/* Very Strong */}
                            <td className="py-2 px-4 text-center">
                                {row.levelA?.length ? (
                                    <span className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded text-[14px] text-primary font-medium shadow-sm">
                                        {formatHouses(row.levelA)}
                                    </span>
                                ) : (
                                    <span className="text-[15px] text-primary opacity-30">—</span>
                                )}
                            </td>

                            {/* Strong */}
                            <td className="py-2 px-4 text-center">
                                {row.levelB?.length ? (
                                    <span className="inline-block px-2.5 py-1 bg-sky-50 border border-sky-100 rounded text-[14px] text-primary font-medium shadow-sm">
                                        {formatHouses(row.levelB)}
                                    </span>
                                ) : (
                                    <span className="text-[15px] text-primary opacity-30">—</span>
                                )}
                            </td>

                            {/* Normal */}
                            <td className="py-2 px-4 text-center">
                                {row.levelC?.length ? (
                                    <span className="inline-block px-2.5 py-1 bg-surface-warm border border-gold-primary/20 rounded text-[14px] text-primary font-medium shadow-sm">
                                        {formatHouses(row.levelC)}
                                    </span>
                                ) : (
                                    <span className="text-[15px] text-primary opacity-30">—</span>
                                )}
                            </td>

                            {/* Weak */}
                            <td className="py-2 px-4 text-center">
                                {row.levelD?.length ? (
                                    <span className="inline-block px-2.5 py-1 bg-white/80 border border-gold-primary/15 rounded text-[14px] text-primary font-medium shadow-sm">
                                        {formatHouses(row.levelD)}
                                    </span>
                                ) : (
                                    <span className="text-[15px] text-primary opacity-30">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
