"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpPlanet } from '@/types/kp.types';
import { ArrowDown } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface KpPlanetaryTableProps {
    planets: KpPlanet[];
    className?: string;
}

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊',
    'Ketu': '☋', 'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿',
    'Ju': '♃', 'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋',
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/**
 * KP Planetary Table
 * Displays planets with Nakshatra, Sub-Lord, Sub-Sub-Lord (key for KP)
 */
export default function KpPlanetaryTable({ planets, className }: KpPlanetaryTableProps) {
    if (!planets || planets.length === 0) {
        return (
            <div className="text-center py-8 text-primary text-[14px]">
                No planetary data available
            </div>
        );
    }

    return (
        <div className={cn("w-full h-full overflow-auto scrollbar-thin", className)}>
            <table className="w-full text-[12px] border-collapse font-sans">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-surface-warm/60 border-y border-gold-primary/20 backdrop-blur-sm">
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Planet</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Sign</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Degree</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>House</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Nakshatra</th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            <KnowledgeTooltip term="star_lord">Star Lord</KnowledgeTooltip>
                        </th>
                        <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>
                            <KnowledgeTooltip term="sub_lord">Sub Lord</KnowledgeTooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((planet, idx) => (
                        <tr
                            key={planet.name}
                            className={cn(
                                "border-b border-gold-primary/15 hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-surface-warm"
                            )}
                        >
                            {/* Planet */}
                            <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className="flex items-center gap-2">
                                    <span className="text-[16px] text-primary font-serif">
                                        {planetEmojis[planet.name] || planetEmojis[planet.fullName || ''] || '●'}
                                    </span>
                                    <span className="text-[14px] text-primary font-medium">
                                        {planet.fullName || planet.name}
                                    </span>
                                    {planet.isRetrograde && (
                                        <span className="flex items-center text-rose-500" title="Retrograde">
                                            <ArrowDown className="w-2.5 h-2.5" />
                                            <span className="text-[9px] font-semibold text-rose-500">R</span>
                                        </span>
                                    )}
                                </span>
                            </td>

                            {/* Sign */}
                            <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className="flex items-center gap-1.5">
                                    <span className="text-[14px] text-primary font-serif">
                                        {signSymbols[planet.sign] || ''}
                                    </span>
                                    <span className="text-[14px] text-primary font-medium">
                                        {planet.sign}
                                    </span>
                                </span>
                            </td>

                            {/* Degree */}
                            <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className="text-[14px] text-primary font-medium">
                                    {planet.degreeFormatted || `${planet.degree.toFixed(2)}°`}
                                </span>
                            </td>

                            {/* House */}
                            <td className="py-1.5 px-3">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-gold-primary/20 bg-white text-primary text-[10px] font-semibold shadow-sm">
                                    {planet.house}
                                </span>
                            </td>

                            {/* Nakshatra */}
                            <td className="py-1.5 px-3 whitespace-nowrap">
                                <span className="text-[14px] text-primary font-medium">
                                    {planet.nakshatra}
                                </span>
                            </td>

                            {/* Star Lord */}
                            <td className="py-1.5 px-3">
                                <span className="inline-block px-2 py-0.5 bg-surface-warm border border-gold-primary/20 text-primary rounded text-[13px] font-medium shadow-sm">
                                    {planet.nakshatraLord}
                                </span>
                            </td>

                            {/* Sub Lord */}
                            <td className="py-1.5 px-3">
                                <span className="inline-block px-2 py-0.5 bg-gold-primary/10 border border-gold-primary/30 text-primary rounded text-[13px] font-medium shadow-sm">
                                    {planet.subLord}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
