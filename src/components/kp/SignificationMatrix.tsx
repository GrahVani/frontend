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
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-left text-[13px]")}>
                            Planet
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center text-[13px]")}>
                            Very Strong
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center text-[13px]")}>
                            Strong
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center text-[13px]")}>
                            Normal
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-4 text-center text-[13px]")}>
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
                                <span className="text-[14px] text-primary font-medium">
                                    {row.planet}
                                </span>
                            </td>

                            {/* Very Strong */}
                            <td className="py-2 px-4 text-center">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatHouses(row.levelA)}
                                </span>
                            </td>

                            {/* Strong */}
                            <td className="py-2 px-4 text-center">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatHouses(row.levelB)}
                                </span>
                            </td>

                            {/* Normal */}
                            <td className="py-2 px-4 text-center">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatHouses(row.levelC)}
                                </span>
                            </td>

                            {/* Weak */}
                            <td className="py-2 px-4 text-center">
                                <span className="text-[14px] text-primary font-medium">
                                    {formatHouses(row.levelD)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
