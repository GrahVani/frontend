import React from 'react';
import { Planet } from './NorthIndianChart/NorthIndianChart';
import { cn } from "@/lib/utils";

interface PlanetComparisonTableProps {
    planetsA: Planet[];
    planetsB: Planet[];
    chartAName?: string;
    chartBName?: string;
}

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function PlanetComparisonTable({
    planetsA,
    planetsB,
    chartAName = "Chart A",
    chartBName = "Chart B"
}: PlanetComparisonTableProps) {

    // Sort logic or fixed list of planets can be used. 
    // For now assuming both lists have same planets in same order or needed mapping.
    // Let's create a map of standard planets to ensure order.
    const PLANET_ORDER = ['Asc', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

    const getPlanetData = (list: Planet[], name: string) => list.find(p => p.name === name);

    return (
        <div className="w-full border border-divider rounded-md overflow-hidden bg-softwhite">
            <table className="w-full text-sm font-serif">
                <thead
                    className="border-b border-divider bg-header-gradient"
                >
                    <tr>
                        <th className="py-2 px-4 text-left text-softwhite uppercase tracking-wider font-bold">Planet</th>
                        <th className="py-2 px-4 text-left text-softwhite uppercase tracking-wider font-bold">{chartAName}</th>
                        <th className="py-2 px-4 text-left text-softwhite uppercase tracking-wider font-bold">{chartBName}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-divider/30">
                    {PLANET_ORDER.map((planetName) => {
                        const pA = getPlanetData(planetsA, planetName);
                        const pB = getPlanetData(planetsB, planetName);

                        if (!pA && !pB) return null;

                        return (
                            <tr key={planetName} className="hover:bg-parchment-soft/20 transition-colors">
                                <td className="py-2 px-4 font-bold text-ink">{planetName}</td>
                                <td className="py-2 px-4 text-body">
                                    {pA ? (
                                        <span className="flex items-center gap-2">
                                            <span>{ZODIAC_SIGNS[pA.signId - 1]}</span>
                                            <span className="text-xs">({pA.degree})</span>
                                            {pA.isRetro && <span className="text-xs text-red-600 font-bold">(R)</span>}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="py-2 px-4 text-body">
                                    {pB ? (
                                        <span className="flex items-center gap-2">
                                            <span>{ZODIAC_SIGNS[pB.signId - 1]}</span>
                                            <span className="text-xs">({pB.degree})</span>
                                            {pB.isRetro && <span className="text-xs text-red-600 font-bold">(R)</span>}
                                        </span>
                                    ) : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
