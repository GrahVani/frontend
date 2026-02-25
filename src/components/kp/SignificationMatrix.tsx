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
        return houses.join(', ');
    };

    return (
        <div className={cn("w-full overflow-hidden", className)}>
            <div className="overflow-x-auto h-[450px] overflow-y-auto w-full">
                <table className="w-full h-full text-xs text-left">
                    <thead className="text-[10px] uppercase bg-parchment/60 backdrop-blur-sm border-b border-antique text-primary font-sans tracking-wide sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-3 py-1.5 font-semibold">
                                Planet
                            </th>
                            <th scope="col" className="px-3 py-1.5 text-center">
                                <span className="block font-semibold text-primary">Very strong</span>
                                <span className="text-[9px] font-normal lowercase text-primary">significator</span>
                            </th>
                            <th scope="col" className="px-3 py-1.5 text-center">
                                <span className="block font-semibold text-primary">Strong</span>
                                <span className="text-[9px] font-normal lowercase text-primary">significator</span>
                            </th>
                            <th scope="col" className="px-3 py-1.5 text-center">
                                <span className="block font-semibold text-primary">Normal</span>
                                <span className="text-[9px] font-normal lowercase text-primary">significator</span>
                            </th>
                            <th scope="col" className="px-3 py-1.5 text-center">
                                <span className="block font-semibold text-primary">Weak</span>
                                <span className="text-[9px] font-normal lowercase text-primary">significator</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50 font-sans">
                        {significations.map((row) => (
                            <tr key={row.planet} className="hover:bg-gold-primary/5 transition-colors bg-white">
                                <th scope="row" className="px-3 py-1 font-semibold text-primary whitespace-nowrap">
                                    {row.planet}
                                </th>
                                <td className="px-3 py-1 text-center font-medium text-primary">
                                    {row.levelA?.length ? <span className="inline-block px-1.5 py-0 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[11px] shadow-sm">{formatHouses(row.levelA)}</span> : <span className="text-primary opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center text-primary font-medium">
                                    {row.levelB?.length ? <span className="inline-block px-1.5 py-0 bg-sky-50 text-sky-700 border border-sky-100 rounded text-[11px] shadow-sm">{formatHouses(row.levelB)}</span> : <span className="text-primary opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center text-primary">
                                    {row.levelC?.length ? <span className="inline-block px-1.5 py-0 bg-parchment text-primary border border-antique rounded text-[11px] shadow-sm">{formatHouses(row.levelC)}</span> : <span className="text-primary opacity-30 text-[10px]">-</span>}
                                </td>
                                <td className="px-3 py-1 text-center text-primary">
                                    {row.levelD?.length ? <span className="inline-block px-1.5 py-0 bg-softwhite border border-antique/50 text-primary rounded text-[11px] shadow-sm">{formatHouses(row.levelD)}</span> : <span className="text-primary opacity-30 text-[10px]">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
