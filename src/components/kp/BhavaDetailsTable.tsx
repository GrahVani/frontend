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
            <div className="flex flex-col items-center justify-center py-16 text-ink">
                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                <p>No bhava details available for this chart</p>
            </div>
        );
    }

    // Sort keys to ensure 1-12 order
    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("w-full overflow-hidden flex flex-col h-full", className)}>
            <div className="flex-1 overflow-auto w-full scrollbar-thin rounded-b-lg">
                <table className="w-full text-[12px] border-collapse font-sans text-ink">
                    <thead className="tracking-wide sticky top-0 z-10">
                        <tr className="bg-surface-warm/60 backdrop-blur-sm border-b border-gold-primary/15">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left w-24")}>House</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Sign & degree</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-left")}>Nakshatra</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")}>Pada</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")}><KnowledgeTooltip term="sign_lord">RL</KnowledgeTooltip></th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")}><KnowledgeTooltip term="star_lord">NL</KnowledgeTooltip></th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center !text-gold-dark w-12")}><KnowledgeTooltip term="sub_lord">SL</KnowledgeTooltip></th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-3 text-center w-12")}><KnowledgeTooltip term="sub_sub_lord">SS</KnowledgeTooltip></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/15">
                        {sortedKeys.map((key) => {
                            const bhava = bhavaDetails[key];
                            const isAngular = ['1', '4', '7', '10'].includes(key);

                            return (
                                <tr
                                    key={key}
                                    className={cn(
                                        "transition-colors hover:bg-gold-primary/5",
                                        isAngular ? "bg-surface-warm/50" : "bg-transparent"
                                    )}
                                >
                                    <td className="py-1 px-3">
                                        <span className={cn(TYPOGRAPHY.value, "text-ink text-[14px]")}>
                                            {key}<sup className="text-[10px] ml-0.2">H</sup>
                                        </span>
                                    </td>
                                    <td className="py-1 px-3">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-warm border border-gold-primary/20 text-[16px] text-ink font-serif"
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
                                    <td className="py-1 px-3 text-ink font-medium">
                                        <span className={cn(TYPOGRAPHY.value, "text-[11px]")}>{bhava.nakshatra}</span>
                                    </td>
                                    <td className="py-1 px-3 text-center">
                                        <span className={cn(
                                            TYPOGRAPHY.label,
                                            "inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gold-primary/20 text-[10px] text-ink"
                                        )}>
                                            {bhava.pada}
                                        </span>
                                    </td>
                                    {['RL', 'NL', 'SL', 'SS'].map((lordType) => (
                                        <td key={lordType} className="py-1 px-3 text-center">
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

            <div className="pt-3 pb-2 mt-auto shrink-0 flex justify-end gap-5 text-[10px] text-ink font-sans border-t border-gold-primary/10">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">RL: <KnowledgeTooltip term="sign_lord">Rashi lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">NL: <KnowledgeTooltip term="star_lord">Nakshatra lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-primary shadow-[0_0_4px_rgba(201,162,77,0.5)]"></span>
                    <span className="uppercase tracking-wider font-bold text-gold-dark">SL: <KnowledgeTooltip term="sub_lord">Sub lord</KnowledgeTooltip></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="uppercase tracking-wider font-semibold">SS: <KnowledgeTooltip term="sub_sub_lord">Sub-sub lord</KnowledgeTooltip></span>
                </div>
            </div>
        </div>
    );
}
