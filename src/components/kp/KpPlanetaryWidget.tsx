"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface KpPlanetItem {
    name: string;
    fullName: string;
    sign: string;
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

const shortNames: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra',
    'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl',
    'Ascendant': 'As', 'Lagna': 'As'
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/**
 * KpPlanetaryWidget
 * A specialized high-density component for the Customize Dashboard.
 * Matches the requested screenshot design: 2-letter planet codes and analytical table.
 */
export default function KpPlanetaryWidget({ planets, className }: KpPlanetaryWidgetProps) {
    if (!planets || planets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/50">No KP Planetary Data (DB)</p>
            </div>
        );
    }

    const formatShortName = (name: string) => {
        const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return shortNames[normalized] || name.slice(0, 2);
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#FDFBF7]", className)}>
            <div className="px-3 py-2 border-b border-gold-primary/10 bg-surface-warm/30">
                <h3 className="text-[10px] font-black text-gold-dark uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                    Planetary positions with star & sub lords
                </h3>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
                        <tr className="border-b border-gold-primary/20">
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[22%]">Planet</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[18%]">Sign</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[16%]">Degree</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider text-center w-[10%]">H</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[14%]">Nak</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[10%]">Star</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider text-right w-[10%]">Sub</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/5">
                        {planets.map((planet, idx) => {
                            const name = planet.fullName || planet.name;
                            const short = formatShortName(name);
                            
                            return (
                                <tr key={planet.name} className="hover:bg-gold-primary/5 transition-colors group">
                                    <td className="py-2 px-3 whitespace-nowrap overflow-hidden">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[14px] text-ink/50 group-hover:text-primary transition-colors shrink-0">
                                                {planetEmojis[name] || '●'}
                                            </span>
                                            <div className="flex items-baseline gap-1 min-w-0">
                                                <span className="text-[11px] font-black text-ink tracking-tight shrink-0">{short}</span>
                                                <span className="text-[8px] font-bold text-ink/20 uppercase tracking-tighter truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {name}
                                                </span>
                                            </div>
                                            {planet.isRetrograde && (
                                                <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-0.5 rounded shrink-0">R</span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[12px] text-indigo-500/50">
                                                {signSymbols[planet.sign] || ''}
                                            </span>
                                            <span className="text-[9px] font-bold text-ink/70 truncate">
                                                {planet.sign}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        <span className="text-[9px] font-mono font-bold text-ink/50 tracking-tighter">
                                            {planet.degreeFormatted}
                                        </span>
                                    </td>
                                    
                                    <td className="py-2 px-3 text-center">
                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-gold-primary/20 bg-white text-[9px] font-black text-gold-dark shadow-sm">
                                            {planet.house}
                                        </span>
                                    </td>
                                    
                                    <td className="py-2 px-3">
                                        <span className="text-[10px] font-black text-ink tracking-tight truncate block">
                                            {planet.nakshatra}
                                        </span>
                                    </td>
                                    
                                    <td className="py-2 px-3">
                                        <div className="inline-flex items-center px-1 py-0 rounded bg-surface-warm border border-gold-primary/10">
                                            <span className="text-[9px] font-bold text-ink/70">
                                                {formatShortName(planet.nakshatraLord)}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td className="py-2 px-3 text-right">
                                        <div className="inline-flex items-center px-1 py-0 rounded bg-gold-primary/10 border border-gold-primary/20">
                                            <span className="text-[9px] font-black text-gold-dark">
                                                {formatShortName(planet.subLord)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
