"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronDown, ChevronUp, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { DashaNode, formatDateDisplay, standardizeDuration } from '@/lib/dasha-utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { captureException } from '@/lib/monitoring';

interface AshtottariDashaProps {
    periods: DashaNode[];
    onFetchPratyantar?: (mahaLord: string, antarLord: string) => Promise<DashaNode[]>;
}

export default function AshtottariDasha({ periods, onFetchPratyantar }: AshtottariDashaProps) {
    const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);
    const [expandedAntardasha, setExpandedAntardasha] = useState<string | null>(null);
    const [pratyantarData, setPratyantarData] = useState<Record<string, DashaNode[]>>({});
    const [loadingPratyantar, setLoadingPratyantar] = useState<string | null>(null);

    const handleAntarClick = async (mahaLord: string, antarLord: string) => {
        const key = `${mahaLord}:${antarLord}`;

        // Toggle if already expanded
        if (expandedAntardasha === key) {
            setExpandedAntardasha(null);
            return;
        }

        setExpandedAntardasha(key);

        // Fetch if not already loaded and callback is available
        if (!pratyantarData[key] && onFetchPratyantar) {
            setLoadingPratyantar(key);
            try {
                const subPeriods = await onFetchPratyantar(mahaLord, antarLord);
                setPratyantarData(prev => ({ ...prev, [key]: subPeriods }));
            } catch (err) {
                captureException(err, { tags: { section: 'ashtottari-dasha', action: 'fetch-pratyantar' } });
            } finally {
                setLoadingPratyantar(null);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-ink/5 border-b border-gold-primary/10")}>
                        <tr>
                            <th className="px-3 py-2 text-left">Planet</th>
                            <th className="px-3 py-2 text-left">Start Date</th>
                            <th className="px-3 py-2 text-left">End Date</th>
                            <th className="px-3 py-2 text-left">Duration</th>
                            <th className="px-3 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/10 font-medium">
                        {periods.map((mahadasha, mIdx) => {
                            const isExpanded = expandedMahadasha === mahadasha.planet;
                            const antardashas = mahadasha.sublevel || [];
                            const isBalance = mahadasha.raw?.is_balance === true || mahadasha.isBalance;

                            return (
                                <React.Fragment key={mIdx}>
                                    <tr
                                        className={cn(
                                            "hover:bg-gold-primary/10 transition-colors group cursor-pointer",
                                            mahadasha.isCurrent && "bg-gold-primary/5"
                                        )}
                                        onClick={() => setExpandedMahadasha(isExpanded ? null : mahadasha.planet)}
                                    >
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border shadow-sm min-w-[60px] justify-center",
                                                    PLANET_COLORS[mahadasha.planet || ''] || "bg-white"
                                                )}>
                                                    {mahadasha.planet}
                                                </span>
                                                {mahadasha.isCurrent && (
                                                    <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-semibold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">
                                                        Current Active
                                                    </span>
                                                )}
                                                {isBalance && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0 rounded-full text-[9px] font-semibold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                                        <AlertCircle className="w-2.5 h-2.5" />
                                                        Balance
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                            <div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}>
                                                <Calendar className="w-3 h-3 text-ink/30" />
                                                {formatDateDisplay(mahadasha.startDate)}
                                            </div>
                                        </td>
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(mahadasha.endDate)}</td>
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                            {standardizeDuration((mahadasha.raw?.duration_years as number) || (mahadasha.raw?.years as number) || 0)}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {mahadasha.isCurrent ? (
                                                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm animate-pulse">ACTIVE</span>
                                                ) : antardashas.length > 0 ? (
                                                    isExpanded ? <ChevronUp className="w-4 h-4 text-gold-dark" /> : <ChevronDown className="w-4 h-4 text-gold-dark" />
                                                ) : (
                                                    <span className="text-gold-dark/40 text-[12px]">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Antardasha Row */}
                                    {isExpanded && antardashas.length > 0 && (
                                        <tr>
                                            <td colSpan={5} className="bg-surface-warm/60/60 px-3 py-2">
                                                <div className="text-2xs font-black text-ink/45 uppercase tracking-[0.2em] mb-2 pl-2">
                                                    Antardasha Sub-Periods (Ashtottari)
                                                </div>
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-gold-primary/10">
                                                        {antardashas.map((antar, aIdx) => {
                                                            const antarKey = `${mahadasha.planet}:${antar.planet}`;
                                                            const isAntarExpanded = expandedAntardasha === antarKey;
                                                            const pratyantarPeriods = pratyantarData[antarKey] || antar.sublevel || [];
                                                            const isLoading = loadingPratyantar === antarKey;
                                                            const hasPratyantar = pratyantarPeriods.length > 0 || onFetchPratyantar;

                                                            return (
                                                                <React.Fragment key={aIdx}>
                                                                    <tr
                                                                        className={cn(
                                                                            "hover:bg-white/50 transition-colors",
                                                                            antar.isCurrent && "bg-green-50/50",
                                                                            hasPratyantar && "cursor-pointer"
                                                                        )}
                                                                        onClick={() => hasPratyantar && handleAntarClick(mahadasha.planet!, antar.planet!)}
                                                                    >
                                                                        <td className="px-3 py-2">
                                                                            <span className={cn(
                                                                                "inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-bold border",
                                                                                PLANET_COLORS[antar.planet || ''] || "bg-white"
                                                                            )}>
                                                                                {antar.planet}
                                                                            </span>
                                                                        </td>
                                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(antar.startDate)}</td>
                                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateDisplay(antar.endDate)}</td>
                                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>
                                                                            {standardizeDuration((antar.raw?.duration_years as number) || (antar.raw?.years as number) || 0, antar.raw?.duration_days as number)}
                                                                        </td>
                                                                        <td className="px-3 py-2 text-center">
                                                                            {isLoading ? (
                                                                                <Loader2 className="w-3 h-3 text-gold-dark animate-spin mx-auto" />
                                                                            ) : antar.isCurrent ? (
                                                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
                                                                            ) : hasPratyantar ? (
                                                                                isAntarExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gold-dark mx-auto" /> : <ChevronDown className="w-3.5 h-3.5 text-gold-dark mx-auto" />
                                                                            ) : null}
                                                                        </td>
                                                                    </tr>

                                                                    {/* Expanded Pratyantardasha Row */}
                                                                    {isAntarExpanded && pratyantarPeriods.length > 0 && (
                                                                        <tr>
                                                                            <td colSpan={5} className="bg-gold-soft/60 px-4 py-2">
                                                                                <div className="text-2xs font-black text-gold-dark uppercase tracking-[0.2em] mb-1.5 pl-2">
                                                                                    Pratyantardasha ({mahadasha.planet} → {antar.planet})
                                                                                </div>
                                                                                <table className="w-full">
                                                                                    <tbody className="divide-y divide-gold-primary/5">
                                                                                        {pratyantarPeriods.map((pd, pIdx) => (
                                                                                            <tr key={pIdx} className={cn(
                                                                                                "hover:bg-white/30 transition-colors",
                                                                                                pd.isCurrent && "bg-green-50/30"
                                                                                            )}>
                                                                                                <td className="px-3 py-1.5">
                                                                                                    <span className={cn(
                                                                                                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                                                                                        PLANET_COLORS[pd.planet || ''] || "bg-white"
                                                                                                    )}>
                                                                                                        {pd.planet}
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td className="px-3 py-1.5 text-[10px] text-ink font-mono">{formatDateDisplay(pd.startDate)}</td>
                                                                                                <td className="px-3 py-1.5 text-[10px] text-ink font-mono">{formatDateDisplay(pd.endDate)}</td>
                                                                                                <td className="px-3 py-1.5 text-[10px] text-ink/45 font-bold">
                                                                                                    {standardizeDuration((pd.raw?.duration_years as number) || 0, pd.raw?.duration_days as number)}
                                                                                                </td>
                                                                                                <td className="px-3 py-1.5 text-center">
                                                                                                    {pd.isCurrent && (
                                                                                                        <span className="text-[8px] font-black text-green-600 bg-green-50 px-1 py-0.5 rounded border border-green-200 animate-pulse">ACTIVE</span>
                                                                                                    )}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
