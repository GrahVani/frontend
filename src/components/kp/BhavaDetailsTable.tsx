"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpBhavaRaw } from '@/types/kp.types';
import { Sparkles } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

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
            <div className="flex flex-col items-center justify-center py-16 text-amber-900">
                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-[14px]">No bhava details available for this chart</p>
            </div>
        );
    }

    // Sort keys to ensure 1-12 order
    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("w-full flex flex-col", className)}>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-[12px] border-collapse font-sans">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-amber-50/80 border-y border-amber-200/50 backdrop-blur-sm">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>House</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Degree</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Nakshatra</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center")}>Pada</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center")}>
                                <KnowledgeTooltip term="sign_lord">RL</KnowledgeTooltip>
                            </th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center")}>
                                <KnowledgeTooltip term="star_lord">NL</KnowledgeTooltip>
                            </th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center")}>
                                <KnowledgeTooltip term="sub_lord">SL</KnowledgeTooltip>
                            </th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center")}>
                                <KnowledgeTooltip term="sub_sub_lord">SS</KnowledgeTooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedKeys.map((key, idx) => {
                            const bhava = bhavaDetails[key];
                            const isAngular = ['1', '4', '7', '10'].includes(key);

                            return (
                                <tr
                                    key={key}
                                    className={cn(
                                        "border-b border-gold-primary/15 hover:bg-gold-primary/5 transition-colors",
                                        idx % 2 === 0 ? "bg-white" : "bg-surface-warm"
                                    )}
                                >
                                    {/* House */}
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        <span className="flex items-center gap-2">
                                            <span className="text-amber-900 text-[12px] font-bold shrink-0 w-4">
                                                {key}
                                            </span>
                                            <span className="text-[13px] text-amber-900 font-medium">
                                                {houseNames[key]}
                                            </span>
                                        </span>
                                    </td>

                                    {/* Degree */}
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="text-[14px] text-amber-800/80 font-serif shrink-0"
                                                title={bhava.sign}
                                            >
                                                {signSymbols[bhava.sign] || ''}
                                            </span>
                                            <span className="text-[13px] text-amber-900 font-medium">
                                                {bhava.longitude_dms.replace(/["]/g, '')}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Nakshatra */}
                                    <td className="py-2 px-3 whitespace-nowrap">
                                        <span className="text-[13px] text-amber-900 font-medium">
                                            {bhava.nakshatra}
                                        </span>
                                    </td>

                                    {/* Pada */}
                                    <td className="py-2 px-3 text-center">
                                        <span className="text-amber-900 text-[13px] font-medium">
                                            {bhava.pada}
                                        </span>
                                    </td>

                                    {/* RL, NL, SL, SS */}
                                    {['RL', 'NL', 'SL', 'SS'].map((lordType) => (
                                        <td key={lordType} className="py-2 px-3 text-center">
                                            <span className="text-[14px] font-medium text-amber-900">
                                                {/* @ts-ignore - dynamic access */}
                                                {(bhava[lordType] || '—').slice(0, 2)}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="pt-3 pb-2 mt-auto shrink-0 flex justify-end gap-5 text-[10px] text-amber-900 font-sans border-t border-amber-200/40">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                    <span className="uppercase tracking-wider font-medium">RL: <KnowledgeTooltip term="sign_lord">Rashi lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                    <span className="uppercase tracking-wider font-medium">NL: <KnowledgeTooltip term="star_lord">Nakshatra lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(217,119,6,0.5)]"></span>
                    <span className="uppercase tracking-wider font-medium">SL: <KnowledgeTooltip term="sub_lord">Sub lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                    <span className="uppercase tracking-wider font-medium">SS: <KnowledgeTooltip term="sub_sub_lord">Sub-sub lord</KnowledgeTooltip></span>
                </div>
            </div>
        </div>
    );
}
