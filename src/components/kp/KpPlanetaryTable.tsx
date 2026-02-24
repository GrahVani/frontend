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
            <div className="text-center py-8 text-muted-refined text-sm">
                No planetary data available
            </div>
        );
    }

    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-sm border-collapse font-sans text-primary">
                <thead>
                    <tr className="bg-parchment/60 border-y border-antique">
                        <th className="py-3 px-4 text-left font-serif font-semibold text-primary">Planet</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-primary">Sign</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-primary">Degree</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-primary">House</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-primary">Nakshatra</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-muted-refined">Star Lord</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-accent-gold">Sub Lord</th>
                        <th className="py-3 px-4 text-left font-serif font-semibold text-muted-refined">Sub-Sub</th>
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
                            <td className="py-2.5 px-4">
                                <span className="flex items-center gap-2">
                                    <span className="text-xl text-muted-refined font-serif">{planetEmojis[planet.name] || planetEmojis[planet.fullName || ''] || '●'}</span>
                                    <span className="font-semibold text-primary">
                                        {planet.fullName || planet.name}
                                    </span>
                                    {planet.isRetrograde && (
                                        <span className="flex items-center text-rose-500" title="Retrograde">
                                            <ArrowDown className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">R</span>
                                        </span>
                                    )}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="flex items-center gap-1">
                                    <span className="text-base text-muted-refined font-serif">{signSymbols[planet.sign] || ''}</span>
                                    <span className="text-secondary font-medium">{planet.sign}</span>
                                </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono text-xs text-muted-refined">
                                {planet.degreeFormatted || `${planet.degree.toFixed(2)}°`}
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded border border-antique bg-white text-primary text-xs font-semibold shadow-sm">
                                    {planet.house}
                                </span>
                            </td>
                            <td className="py-2.5 px-4 text-secondary font-medium text-xs">
                                {planet.nakshatra}
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-parchment border border-antique text-secondary rounded font-medium text-xs shadow-sm">
                                    {planet.nakshatraLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-gold-primary/10 border border-gold-primary/30 text-accent-gold rounded font-semibold text-xs shadow-sm">
                                    {planet.subLord}
                                </span>
                            </td>
                            <td className="py-2.5 px-4">
                                {planet.subSubLord && (
                                    <span className="px-2 py-0.5 bg-white border border-antique text-muted-refined rounded font-medium text-xs shadow-sm">
                                        {planet.subSubLord}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
