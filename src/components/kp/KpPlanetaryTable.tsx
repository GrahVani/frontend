"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpPlanet } from '@/types/kp.types';
import { ArrowDown } from 'lucide-react';

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
            <div className="text-center py-8 text-primary text-sm">
                No planetary data available
            </div>
        );
    }

    return (
        <div className={cn("overflow-x-auto h-[450px] overflow-y-auto", className)}>
            <table className="w-full h-full text-xs border-collapse font-sans text-primary">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-parchment/60 border-y border-antique backdrop-blur-sm">
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">Planet</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">Sign</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">Degree</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">House</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">Nakshatra</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-primary">Star Lord</th>
                        <th className="py-1.5 px-3 text-left font-serif font-semibold text-accent-gold">Sub Lord</th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((planet, idx) => (
                        <tr
                            key={planet.name}
                            className={cn(
                                "border-b border-antique/50 hover:bg-gold-primary/5 transition-colors",
                                idx % 2 === 0 ? "bg-white" : "bg-softwhite"
                            )}
                        >
                            <td className="py-1 px-3">
                                <span className="flex items-center gap-2">
                                    <span className="text-lg text-primary font-serif">{planetEmojis[planet.name] || planetEmojis[planet.fullName || ''] || '●'}</span>
                                    <span className="font-semibold text-primary">
                                        {planet.fullName || planet.name}
                                    </span>
                                    {planet.isRetrograde && (
                                        <span className="flex items-center text-rose-500" title="Retrograde">
                                            <ArrowDown className="w-2.5 h-2.5" />
                                            <span className="text-[9px] font-bold">R</span>
                                        </span>
                                    )}
                                </span>
                            </td>
                            <td className="py-1 px-3">
                                <span className="flex items-center gap-1">
                                    <span className="text-sm text-primary font-serif">{signSymbols[planet.sign] || ''}</span>
                                    <span className="text-primary font-medium">{planet.sign}</span>
                                </span>
                            </td>
                            <td className="py-1 px-3 font-mono text-[11px] text-primary">
                                {planet.degreeFormatted || `${planet.degree.toFixed(2)}°`}
                            </td>
                            <td className="py-1 px-3">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-antique bg-white text-primary text-[10px] font-semibold shadow-sm">
                                    {planet.house}
                                </span>
                            </td>
                            <td className="py-1 px-3 text-primary font-medium text-[11px]">
                                {planet.nakshatra}
                            </td>
                            <td className="py-1 px-3">
                                <span className="px-1.5 py-0 bg-parchment border border-antique text-primary rounded font-medium text-[11px] shadow-sm">
                                    {planet.nakshatraLord}
                                </span>
                            </td>
                            <td className="py-1 px-3">
                                <span className="px-1.5 py-0 bg-gold-primary/10 border border-gold-primary/30 text-accent-gold rounded font-semibold text-[11px] shadow-sm">
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
