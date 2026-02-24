"use client";

import React from 'react';
import type { KpSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';

interface SignificationMatrixProps {
    significations: KpSignification[];
    className?: string;
}

export default function SignificationMatrix({ significations, className }: SignificationMatrixProps) {
    // Helper to format house list
    const formatHouses = (houses: number[] | undefined) => {
        if (!houses || houses.length === 0) return '';
        return houses.join('  ');
    };

    return (
        <div className={cn("w-full overflow-hidden bg-white rounded-2xl border border-antique shadow-sm", className)}>
            <div className="p-4 bg-parchment/30 border-b border-antique">
                <h3 className="text-lg font-serif font-bold text-center text-primary">
                    Houses Signified by Planets
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-parchment/60 text-primary font-sans tracking-wide">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm">
                                Planet
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-antique shadow-sm text-center">
                                <span className="block font-semibold text-primary">Very strong</span>
                                <span className="text-[10px] font-normal lowercase opacity-80 text-muted-refined">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-antique shadow-sm text-center">
                                <span className="block font-semibold text-primary">Strong</span>
                                <span className="text-[10px] font-normal lowercase opacity-80 text-muted-refined">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-antique shadow-sm text-center">
                                <span className="block font-semibold text-primary">Normal</span>
                                <span className="text-[10px] font-normal lowercase opacity-80 text-muted-refined">significator</span>
                            </th>
                            <th scope="col" className="px-6 py-3 border-b border-antique shadow-sm text-center">
                                <span className="block font-semibold text-primary">Weak</span>
                                <span className="text-[10px] font-normal lowercase opacity-80 text-muted-refined">significator</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50 font-sans">
                        {significations.map((row) => (
                            <tr key={row.planet} className="hover:bg-gold-primary/5 transition-colors bg-white">
                                <th scope="row" className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                                    {row.planet}
                                </th>
                                <td className="px-6 py-4 text-center font-medium text-primary">
                                    {row.levelA?.length ? <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-sm shadow-sm">{formatHouses(row.levelA)}</span> : <span className="text-muted-refined/50">-</span>}
                                </td>
                                <td className="px-6 py-4 text-center text-secondary font-medium">
                                    {row.levelB?.length ? <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 rounded text-sm shadow-sm">{formatHouses(row.levelB)}</span> : <span className="text-muted-refined/50">-</span>}
                                </td>
                                <td className="px-6 py-4 text-center text-secondary">
                                    {row.levelC?.length ? <span className="inline-block px-2 py-0.5 bg-parchment text-secondary border border-antique rounded text-sm shadow-sm">{formatHouses(row.levelC)}</span> : <span className="text-muted-refined/50">-</span>}
                                </td>
                                <td className="px-6 py-4 text-center text-muted-refined italic">
                                    {row.levelD?.length ? <span className="inline-block px-2 py-0.5 bg-softwhite border border-antique/50 text-muted-refined rounded text-sm shadow-sm">{formatHouses(row.levelD)}</span> : <span className="text-muted-refined/50">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
