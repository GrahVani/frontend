"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { KpBhavaRaw, KpFortunaResponse } from '@/types/kp.types';
import { Sparkles, Calculator, ArrowRight } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

// ─── Symbols ─────────────────────────────────────────────────────────

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

// ─── 1. BhavaDetailsTableDashboard ───────────────────────────────────

interface BhavaTableDashboardProps {
    bhavaDetails: Record<string, KpBhavaRaw>;
    className?: string;
}

export function BhavaTableDashboard({ bhavaDetails, className }: BhavaTableDashboardProps) {
    if (!bhavaDetails || Object.keys(bhavaDetails).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12 text-ink">
                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-[12px] opacity-60 italic">No bhava details available</p>
            </div>
        );
    }

    const sortedKeys = Object.keys(bhavaDetails).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className={cn("w-full h-fit flex flex-col", className)}>
            <div className="w-full">
                <table className="w-full text-[12px] border-collapse font-sans text-ink">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-surface-warm/80 backdrop-blur-sm border-b border-gold-primary/15">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1.5 text-left w-[12%]")}>House</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1.5 text-left w-[25%]")}>Sign & Degree</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1.5 text-left w-[20%]")}>Nakshatra</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1 text-center w-[8%]")}>P</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1 text-center w-[8%]")}>RL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1 text-center w-[8%]")}>NL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1 text-center w-[8%]")}>SL</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-1.5 px-1 text-center w-[11%]")}>SS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/10">
                        {sortedKeys.map((key) => {
                            const bhava = bhavaDetails[key];
                            const isAngular = ['1', '4', '7', '10'].includes(key);

                            return (
                                <tr key={key} className={cn("transition-colors hover:bg-gold-primary/5", isAngular ? "bg-surface-warm/30" : "bg-transparent")}>
                                    <td className="py-1 px-1.5">
                                        <span className={cn(TYPOGRAPHY.planetName, "text-[15px]")}>
                                            {key}<sup className="text-[10px] ml-0.5 font-normal">H</sup>
                                        </span>
                                    </td>
                                    <td className="py-1 px-1.5 min-w-[120px]">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[14px] text-ink font-serif w-4 text-center">
                                                {signSymbols[bhava.sign] || ''}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className={cn(TYPOGRAPHY.planetName, "text-[14px] leading-tight")}>{bhava.sign}</span>
                                                <span className="font-mono text-[9px] text-ink/80 leading-tight">
                                                    {bhava.longitude_dms.replace(/["]/g, '')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-1 px-1.5">
                                        <span className={cn(TYPOGRAPHY.planetName, "text-[14px]")}>{bhava.nakshatra}</span>
                                    </td>
                                    <td className="py-1 px-1 text-center font-mono text-[10px]">
                                        {bhava.pada}
                                    </td>
                                    {['RL', 'NL', 'SL', 'SS'].map((lordType) => (
                                        <td key={lordType} className="py-1 px-1 text-center">
                                            <span className={cn(TYPOGRAPHY.dateAndDuration, "text-[12px] px-1 rounded bg-gold-primary/5")}>
                                                {/* @ts-ignore */}
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

            <div className="pt-2 pb-1 mx-2 flex justify-between text-[11px] !text-ink font-sans border-t border-gold-primary/10">
                <span>RL-Rashi Lord</span>
                <span>NL-Star Lord</span>
                <span>SL-Sub Lord</span>
                <span>SS-SubSub Lord</span>
            </div>
        </div>
    );
}

// ─── 2. KpFortunaDashboard ───────────────────────────────────────────

interface KpFortunaDashboardProps {
    data: KpFortunaResponse;
    className?: string;
}

export function KpFortunaDashboard({ data, className }: KpFortunaDashboardProps) {
    const { fortunaData } = data;
    if (!fortunaData) return <div className="p-8 text-center text-ink italic opacity-40 text-[12px]">Fortuna Data Unavailable</div>;

    const { calculation, fortunaHouse } = fortunaData;

    return (
        <div className={cn("space-y-4 animate-in fade-in duration-500", className)}>
            {/* 1. Calc Table */}
            <div className="bg-white/40 border border-gold-primary/10 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-surface-warm/40 px-4 py-2 border-b border-gold-primary/10 flex items-center justify-between">
                    <h3 className="text-[16px] font-normal !text-ink flex items-center gap-2">
                        <Calculator className="w-4.5 h-4.5 !text-ink" />
                        Derivation
                    </h3>
                    <span className="text-[12px] !text-ink uppercase tracking-wide">Asc + Moon - Sun</span>
                </div>
                <table className="w-full text-left text-[11px] table-fixed">
                        <tr className="bg-surface-warm/20 !text-ink uppercase text-[13px] tracking-widest border-b border-gold-primary/10">
                            <th className="px-4 py-3 font-normal text-left w-[40%]">Item</th>
                            <th className="px-4 py-3 font-normal text-left w-[30%]">Degree</th>
                            <th className="px-4 py-3 font-normal text-left w-[30%]">Sign/H</th>
                        </tr>
                    <tbody className="divide-y divide-gold-primary/5">
                        {(Array.isArray(calculation) ? calculation : Object.values(calculation || {})).map((row: any) => (
                            <tr key={row.component} className="hover:bg-gold-primary/5 transition-colors">
                                <td className="px-4 py-2 font-normal !text-ink text-[16px]">{row.component}</td>
                                <td className="px-4 py-2 font-mono !text-ink text-[16px]">{row.longitude.toFixed(2)}°</td>
                                <td className="px-4 py-2 font-normal !text-ink text-[16px]">{row.sign} ({row.house})</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 2. Placement Box */}
            <div className="p-5 rounded-xl bg-surface-warm/20 border border-gold-primary/10 shadow-sm">
                <h4 className="text-[16px] font-normal !text-ink mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4.5 h-4.5 !text-ink" />
                    Fortuna Placement
                </h4>
                <p className="text-[18px] !text-ink leading-tight font-sans">
                    Fortuna is located in <span className="font-normal underline underline-offset-4 decoration-gold-primary/30">{fortunaHouse.sign}</span> in the <span className="font-normal underline underline-offset-4 decoration-gold-primary/30">House {fortunaHouse.houseNumber}</span>.
                </p>
                <div className="mt-3 text-[12px] !text-ink font-mono tracking-wider uppercase border-t border-gold-primary/10 pt-2">
                    CUSP LONGITUDE: {fortunaHouse.cuspLongitude}
                </div>
            </div>

            {/* 3. Interpretation Box */}
            <div className="p-3 rounded-xl bg-white border border-gold-primary/10 shadow-sm">
                <h4 className="text-[14px] font-normal !text-ink uppercase tracking-[0.2em] mb-4 border-b border-gold-primary/10 pb-2">Interpretation Key</h4>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'House', desc: 'The area of life where material prosperity is most easily accessible.' },
                        { label: 'Sign', desc: 'The manner and qualities through which you achieve success.' }
                    ].map(item => (
                        <div key={item.label} className="flex gap-6 items-center">
                            <span className="text-[13px] font-normal !text-ink uppercase tracking-wide w-20 shrink-0 border-r border-gold-primary/10 pr-4">{item.label}</span>
                            <span className="text-[16px] !text-ink leading-snug">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
