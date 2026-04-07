"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface KpCuspItem {
    cusp: number;
    sign: string;
    degreeFormatted: string;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
}

interface KpCuspsWidgetProps {
    cusps: KpCuspItem[];
    className?: string;
}

const shortNames: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra',
    'Ketu': 'Ke'
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/**
 * KpCuspsWidget
 * High-density technical table for KP house cusps.
 * Matches the requested "Sub-Header" design with 2-letter codes.
 */
export default function KpCuspsWidget({ cusps, className }: KpCuspsWidgetProps) {
    if (!cusps || cusps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/50">No KP Cusp Data (DB)</p>
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
                    Cuspal technical positions & sub-lords
                </h3>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
                        <tr className="border-b border-gold-primary/20">
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[15%]">Cusp</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[25%]">Sign</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[20%]">Degree</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider w-[20%]">Star Lord</th>
                            <th className="py-2 px-3 text-[9px] font-black text-ink/40 uppercase tracking-wider text-right w-[20%]">Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/5">
                        {cusps.map((cusp, idx) => (
                            <tr key={cusp.cusp} className="hover:bg-gold-primary/5 transition-colors group">
                                <td className="py-2 px-3">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-gold-primary/20 bg-white text-[10px] font-black text-ink shadow-sm group-hover:border-primary group-hover:text-primary transition-all">
                                        {cusp.cusp}
                                    </span>
                                </td>
                                
                                <td className="py-2 px-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[12px] text-indigo-500/50">
                                            {signSymbols[cusp.sign] || '○'}
                                        </span>
                                        <span className="text-[10px] font-bold text-ink">
                                            {cusp.sign}
                                        </span>
                                    </div>
                                </td>
                                
                                <td className="py-2 px-3 whitespace-nowrap">
                                    <span className="text-[10px] font-mono font-bold text-ink/50 tracking-tighter">
                                        {cusp.degreeFormatted}
                                    </span>
                                </td>
                                
                                <td className="py-2 px-3">
                                    <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-warm border border-gold-primary/10">
                                        <span className="text-[9px] font-bold text-ink/70">
                                            {formatShortName(cusp.nakshatraLord)}
                                        </span>
                                    </div>
                                </td>
                                
                                <td className="py-2 px-3 text-right">
                                    <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-gold-primary/10 border border-gold-primary/20">
                                        <span className="text-[9px] font-black text-gold-dark">
                                            {formatShortName(cusp.subLord)}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
