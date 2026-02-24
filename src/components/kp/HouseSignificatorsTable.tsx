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
        <div className={cn("w-full overflow-hidden bg-white rounded-2xl border border-antique shadow-sm", className)}>
            <div className="p-4 bg-parchment/30 border-b border-antique">
                <h3 className="text-lg font-serif font-bold text-center text-primary">
                    Significations of the Houses
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-parchment/60 text-primary font-sans tracking-wide">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm w-32">
                                House
                            </th>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm">
                                Planets in nak. of occupants
                            </th>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm">
                                Occupants
                            </th>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm">
                                Planets in nak. of cusp sign lord
                            </th>
                            <th scope="col" className="px-6 py-3 font-semibold border-b border-antique shadow-sm">
                                Cusp sign lord
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50 font-sans">
                        {data.map((row) => (
                            <tr key={row.house} className="hover:bg-gold-primary/5 transition-colors bg-white">
                                <th scope="row" className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-antique bg-white text-primary text-xs font-semibold shadow-sm mr-2">{row.house}</span>
                                    {houseNames[row.house - 1]}
                                </th>
                                <td className="px-6 py-4 text-secondary">
                                    {formatPlanets(row.levelB)}
                                </td>
                                <td className="px-6 py-4 text-primary font-medium">
                                    {formatPlanets(row.levelA)}
                                </td>
                                <td className="px-6 py-4 text-secondary">
                                    {formatPlanets(row.levelD)}
                                </td>
                                <td className="px-6 py-4 text-muted-refined italic">
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
