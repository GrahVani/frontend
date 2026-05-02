"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ArrowDown } from 'lucide-react';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';

interface KpPlanetItem {
    name: string;
    fullName: string;
    sign: string;
    degree?: number;
    degreeFormatted?: string;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
    isRetrograde: boolean;
}

interface KpPlanetaryWidgetProps {
    planets: KpPlanetItem[];
    className?: string;
}

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊',
    'Ketu': '☋', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇',
    'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿',
    'Ju': '♃', 'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋',
    'Ur': '♅', 'Ne': '♆', 'Pl': '♇', 'As': 'ASC'
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const SIGN_ELEMENT_COLORS: Record<string, string> = {
    'Aries': '#D97706', 'Leo': '#D97706', 'Sagittarius': '#D97706',
    'Taurus': '#65A30D', 'Virgo': '#65A30D', 'Capricorn': '#65A30D',
    'Gemini': '#7C3AED', 'Libra': '#7C3AED', 'Aquarius': '#7C3AED',
    'Cancer': '#0EA5E9', 'Scorpio': '#0EA5E9', 'Pisces': '#0EA5E9',
};

/** Standard Vedic planet order: Sun→Saturn, then nodes, then outer planets last */
const PLANET_ORDER: Record<string, number> = {
    'Sun': 1, 'Su': 1,
    'Moon': 2, 'Mo': 2,
    'Mars': 3, 'Ma': 3,
    'Mercury': 4, 'Me': 4,
    'Jupiter': 5, 'Ju': 5,
    'Venus': 6, 'Ve': 6,
    'Saturn': 7, 'Sa': 7,
    'Rahu': 8, 'Ra': 8,
    'Ketu': 9, 'Ke': 9,
    'Uranus': 10, 'Ur': 10,
    'Neptune': 11, 'Ne': 11,
    'Pluto': 12, 'Pl': 12,
};

/**
 * KpPlanetaryWidget
 * Workbench widget version that matches the main KP System planetary table
 * colors and text elements exactly.
 */
export default function KpPlanetaryWidget({ planets, className }: KpPlanetaryWidgetProps) {
    if (!planets || planets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                <p className="text-[14px] font-medium text-amber-900/50">No KP Planetary Data</p>
            </div>
        );
    }

    const sortedPlanets = [...planets].sort((a, b) => {
        const orderA = PLANET_ORDER[a.name] || PLANET_ORDER[a.fullName || ''] || 99;
        const orderB = PLANET_ORDER[b.name] || PLANET_ORDER[b.fullName || ''] || 99;
        return orderA - orderB;
    });

    return (
        <div className={cn("flex flex-col h-full bg-white", className)}>
            {/* Sub-header — matches main KP tab section title style */}
            <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200/50 shrink-0">
                <h3 className={cn(TYPOGRAPHY.value, "text-[14px] text-amber-900 font-semibold leading-tight tracking-wide !mb-0 text-balance")}>
                    Planetary positions with star & sub lords
                </h3>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="w-full text-[12px] border-collapse font-sans">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-amber-50/80 border-y border-amber-200/50 backdrop-blur-sm">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Planet</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Sign</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Degree</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>House</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Nakshatra</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Star Lord</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlanets.map((planet, idx) => (
                            <tr
                                key={planet.name}
                                className={cn(
                                    "border-b border-amber-200/40 hover:bg-amber-50 transition-colors",
                                    idx % 2 === 0 ? "bg-white" : "bg-amber-50/40"
                                )}
                            >
                                {/* Planet */}
                                <td className="py-1.5 px-3 whitespace-nowrap">
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="text-[16px] font-serif"
                                            style={{ color: PLANET_SVG_FILLS[planet.fullName || planet.name] || PLANET_SVG_FILLS[planet.name] || '#92400E' }}
                                        >
                                            {planetEmojis[planet.name] || planetEmojis[planet.fullName || ''] || '●'}
                                        </span>
                                        <span className="text-[14px] text-amber-900 font-medium">
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
                                        <span
                                            className="text-[14px] font-serif opacity-80"
                                            style={{ color: SIGN_ELEMENT_COLORS[planet.sign] || '#B45309' }}
                                        >
                                            {signSymbols[planet.sign] || ''}
                                        </span>
                                        <span className="text-[14px] text-amber-900 font-medium">
                                            {planet.sign}
                                        </span>
                                    </span>
                                </td>

                                {/* Degree */}
                                <td className="py-1.5 px-3 whitespace-nowrap">
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {planet.degreeFormatted || `${planet.degree?.toFixed(2)}°`}
                                    </span>
                                </td>

                                {/* House */}
                                <td className="py-1.5 px-3">
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {planet.house}
                                    </span>
                                </td>

                                {/* Nakshatra */}
                                <td className="py-1.5 px-3 whitespace-nowrap">
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {planet.nakshatra}
                                    </span>
                                </td>

                                {/* Star Lord */}
                                <td className="py-1.5 px-3">
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {planet.nakshatraLord}
                                    </span>
                                </td>

                                {/* Sub Lord */}
                                <td className="py-1.5 px-3">
                                    <span className="text-[14px] text-amber-900 font-medium">
                                        {planet.subLord}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
