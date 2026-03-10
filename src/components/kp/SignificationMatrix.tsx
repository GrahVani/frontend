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
        if (!houses || houses.length === 0) return '';
        return houses.join(', ');
    };

    return (
        <div className={cn("w-full overflow-hidden", className)}>
            <div className="overflow-x-auto min-h-[300px] max-h-[calc(100vh-280px)] overflow-y-auto w-full">
                <table className="w-full h-full text-[12px] text-left">
                    <thead className="bg-surface-warm/60 backdrop-blur-sm border-b border-gold-primary/15 tracking-wide sticky top-0 z-10">
                        <tr>
                            <th scope="col" className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5")}>
                                Planet
                            </th>
                            <th scope="col" className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-center")}>
                                <span className="block font-bold">Very strong</span>
                                <span className="text-[9px] font-normal lowercase opacity-70"><KnowledgeTooltip term="kp_significator">significator</KnowledgeTooltip></span>
                            </th>
                            <th scope="col" className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-center")}>
                                <span className="block font-bold">Strong</span>
                                <span className="text-[9px] font-normal lowercase opacity-70"><KnowledgeTooltip term="kp_significator">significator</KnowledgeTooltip></span>
                            </th>
                            <th scope="col" className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-center")}>
                                <span className="block font-bold">Normal</span>
                                <span className="text-[9px] font-normal lowercase opacity-70"><KnowledgeTooltip term="kp_significator">significator</KnowledgeTooltip></span>
                            </th>
                            <th scope="col" className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-center")}>
                                <span className="block font-bold">Weak</span>
                                <span className="text-[9px] font-normal lowercase opacity-70"><KnowledgeTooltip term="kp_significator">significator</KnowledgeTooltip></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/15 font-sans">
                        {significations.map((row) => (
                            <tr key={row.planet} className="hover:bg-gold-primary/5 transition-colors bg-white">
                                <th scope="row" className={cn(TYPOGRAPHY.value, "px-3 py-1 font-bold text-ink whitespace-nowrap")}>
                                    {row.planet}
                                </th>
                                <td className="px-3 py-1 text-center font-medium">
                                    {row.levelA?.length ? <span className={cn(TYPOGRAPHY.label, "inline-block px-1.5 py-0 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[11px] shadow-sm")}>{formatHouses(row.levelA)}</span> : <span className="text-ink opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center font-medium">
                                    {row.levelB?.length ? <span className={cn(TYPOGRAPHY.label, "inline-block px-1.5 py-0 bg-sky-50 text-sky-700 border border-sky-100 rounded text-[11px] shadow-sm")}>{formatHouses(row.levelB)}</span> : <span className="text-ink opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center">
                                    {row.levelC?.length ? <span className={cn(TYPOGRAPHY.label, "inline-block px-1.5 py-0 bg-surface-warm text-ink border border-gold-primary/20 rounded text-[11px] shadow-sm")}>{formatHouses(row.levelC)}</span> : <span className="text-ink opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center">
                                    {row.levelD?.length ? <span className={cn(TYPOGRAPHY.label, "inline-block px-1.5 py-0 bg-white/80 border border-gold-primary/15 text-ink rounded text-[11px] shadow-sm")}>{formatHouses(row.levelD)}</span> : <span className="text-ink opacity-30 text-[10px]">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
