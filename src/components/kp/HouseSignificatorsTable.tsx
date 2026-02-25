"use client";

import React from 'react';
import type { KpHouseSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';

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
        if (!planets || planets.length === 0) return '';
        // Map short names if needed, or use as is. Reference uses 'Sa', 'Su'. 
        // The API returns full names usually ("Sun"). We can shorten them.
        return planets.map(p => p.substring(0, 2)).join(', ');
    };

    return (
        <div className={cn("w-full overflow-hidden", className)}>
            <div className="overflow-x-auto h-[450px] overflow-y-auto w-full">
                <table className="w-full h-full text-xs text-left">
                    <thead className="text-[10px] uppercase bg-parchment/60 backdrop-blur-sm border-b border-antique text-primary font-sans tracking-wide sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-3 py-1.5 font-semibold w-28">
                                House
                            </th>
                            <th scope="col" className="px-3 py-1.5 font-semibold">
                                Planets in nak. of occupants
                            </th>
                            <th scope="col" className="px-3 py-1.5 font-semibold">
                                Occupants
                            </th>
                            <th scope="col" className="px-3 py-1.5 font-semibold">
                                Planets in nak. of cusp sign lord
                            </th>
                            <th scope="col" className="px-3 py-1.5 font-semibold">
                                Cusp sign lord
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50 font-sans">
                        {data.map((row) => (
                            <tr key={row.house} className="hover:bg-gold-primary/5 transition-colors bg-white">
                                <th scope="row" className="px-3 py-1 font-semibold text-primary whitespace-nowrap">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-antique bg-white text-[10px] font-semibold shadow-sm mr-2">{row.house}</span>
                                    <span className="text-xs font-serif">{houseNames[row.house - 1]}</span>
                                </th>
                                <td className="px-3 py-1 text-primary text-[11px]">
                                    {formatPlanets(row.levelB)}
                                </td>
                                <td className="px-3 py-1 text-primary font-medium text-[11px]">
                                    {formatPlanets(row.levelA)}
                                </td>
                                <td className="px-3 py-1 text-primary text-[11px]">
                                    {formatPlanets(row.levelD)}
                                </td>
                                <td className="px-3 py-1 text-primary text-[11px]">
                                    {formatPlanets(row.levelC)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
