"use client";

import { cn } from "@/lib/utils";
import type { Planet } from "./NorthIndianChart/NorthIndianChart";

interface ChartTableViewProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
}

const ZODIAC_NAMES = [
    "", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export default function ChartTableView({ planets, ascendantSign, className }: ChartTableViewProps) {
    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1;
        const signNum = ((ascendantSign + i - 1) % 12) || 12;
        const housePlanets = planets.filter(
            (p) => (p.house ? p.house === houseNum : p.signId === signNum),
        );
        return { house: houseNum, sign: ZODIAC_NAMES[signNum], signId: signNum, planets: housePlanets };
    });

    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-[14px] border-collapse" aria-label="Chart data in tabular format">
                <thead>
                    <tr className="border-b border-gold-primary/20 bg-surface-warm/30">
                        <th className="px-3 py-2 text-left font-serif font-semibold text-ink text-[12px]">House</th>
                        <th className="px-3 py-2 text-left font-serif font-semibold text-ink text-[12px]">Sign</th>
                        <th className="px-3 py-2 text-left font-serif font-semibold text-ink text-[12px]">Planets</th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map((h) => (
                        <tr key={h.house} className="border-b border-gold-primary/15 hover:bg-surface-warm/20">
                            <td className="px-3 py-1.5 font-medium tabular-nums">{h.house}</td>
                            <td className="px-3 py-1.5 text-ink/45">{h.sign}</td>
                            <td className="px-3 py-1.5">
                                {h.planets.length > 0
                                    ? h.planets.map((p) => (
                                        <span key={p.name} className="inline-flex items-center gap-1 mr-2">
                                            <span className="font-medium">{p.name}</span>
                                            {p.isRetro && <span className="text-status-error text-[12px]" title="Retrograde">R</span>}
                                            {p.degree && <span className="text-[12px] text-ink/45">({p.degree})</span>}
                                        </span>
                                    ))
                                    : <span className="text-disabled text-[12px] italic">Empty</span>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
