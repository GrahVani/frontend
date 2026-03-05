"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpBhavaRaw } from '@/types/kp.types';
import { Sparkles } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface BhavaDetailsTableProps {
    bhavaDetails: Record<string, KpBhavaRaw>;
    className?: string;
}

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const houseNames: Record<string, string> = {
    '1': 'First House', '2': 'Second House', '3': 'Third House', '4': 'Fourth House',
    '5': 'Fifth House', '6': 'Sixth House', '7': 'Seventh House', '8': 'Eighth House',
    '9': 'Ninth House', '10': 'Tenth House', '11': 'Eleventh House', '12': 'Twelfth House'
};

/**
 * KP Bhava Details Table
 * Displays detailed house cusps with lords (RL, NL, SL, SS)
 */
export default function BhavaDetailsTable({ bhavaDetails, className }: BhavaDetailsTableProps) {
    if (!bhavaDetails || Object.keys(bhavaDetails).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-primary">
                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                <p>No bhava details available for this chart</p>
            </div>
        );
    }

    // Sort keys to ensure 1-12 order
    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("overflow-hidden w-full", className)}>
            <div className="overflow-x-auto h-[450px] overflow-y-auto w-full">
                <table className="w-full h-full text-xs border-collapse font-sans text-primary">
                    <thead className="tracking-wide sticky top-0 z-10">
                        <tr className="bg-parchment/60 backdrop-blur-sm border-b border-antique">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left w-24")}>House</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Sign & degree</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Nakshatra</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")}>Pada</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")} title="Rashi Lord">RL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")} title="Nakshatra Lord">NL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center !text-accent-gold w-12")} title="Sub Lord">SL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")} title="Sub-Sub Lord">SS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50">
                        {sortedKeys.map((key) => {
                            const bhava = bhavaDetails[key];
                            const isAngular = ['1', '4', '7', '10'].includes(key);

                            return (
                                <tr
                                    key={key}
                                    className={cn(
                                        "transition-colors hover:bg-gold-primary/5",
                                        isAngular ? "bg-softwhite/50" : "bg-transparent"
                                    )}
                                >
                                    <td className="py-0.5 px-3">
                                        <span className={cn(TYPOGRAPHY.value, "text-primary text-sm")}>
                                            {key}<sup className="text-[10px] ml-0.2">H</sup>
                                        </span>
                                    </td>
                                    <td className="py-0.5 px-3">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-parchment border border-antique text-base text-primary font-serif"
                                                title={bhava.sign}
                                            >
                                                {signSymbols[bhava.sign] || ''}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className={cn(TYPOGRAPHY.value, "text-[11px] leading-tight")}>{bhava.sign}</span>
                                                <span className="font-mono text-[10px] text-ink font-semibold leading-tight">
                                                    {bhava.longitude_dms.replace(/["]/g, '')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-0.5 px-3 text-primary font-medium">
                                        <span className={cn(TYPOGRAPHY.value, "text-[11px]")}>{bhava.nakshatra}</span>
                                    </td>
                                    <td className="py-0.5 px-3 text-center">
                                        <span className={cn(
                                            TYPOGRAPHY.label,
                                            "inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-antique text-[10px] text-primary"
                                        )}>
                                            {bhava.pada}
                                        </span>
                                    </td>
                                    {['RL', 'NL', 'SL', 'SS'].map((lordType) => (
                                        <td key={lordType} className="py-0.5 px-3 text-center">
                                            <span className={cn(
                                                TYPOGRAPHY.label,
                                                "text-[10px] rounded px-1.5 py-0",
                                                lordType === 'SL' ? "text-ink !font-bold bg-gold-soft/10 border border-gold-primary/20 shadow-sm" : "text-ink !font-bold"
                                            )}>
                                                {/* @ts-ignore - dynamic access */}
                                                {(bhava[lordType] || '-').slice(0, 2)}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end gap-5 text-[10px] text-ink font-sans">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">RL: Rashi lord</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">NL: Nakshatra lord</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_4px_rgba(201,162,77,0.5)]"></span>
                    <span className="uppercase tracking-wider font-bold text-accent-gold">SL: Sub lord</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">SS: Sub-sub lord</span>
                </div>
            </div>
        </div>
    );
}
