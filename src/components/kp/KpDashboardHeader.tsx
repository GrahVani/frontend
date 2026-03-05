"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FileDown, GitCompare, Sparkles, HelpCircle, Clock, MapPin, Calendar } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface KpDashboardHeaderProps {
    clientName?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    lagna?: string;
    lagnaSign?: string;
    ayanamsaValue?: string;
    moonSign?: string;
    moonNakshatra?: string;
    onGeneratePrediction?: () => void;
    onRunHorary?: () => void;
    onExportReport?: () => void;
    onCompareCharts?: () => void;
    className?: string;
}

/**
 * KP Dashboard Header
 * Shows client info + birth details + quick actions in a compact top bar
 */
export default function KpDashboardHeader({
    clientName = 'Client',
    birthDate,
    birthTime,
    birthPlace,
    lagna,
    lagnaSign,
    ayanamsaValue,
    moonSign,
    moonNakshatra,
    onGeneratePrediction,
    onRunHorary,
    onExportReport,
    onCompareCharts,
    className,
}: KpDashboardHeaderProps) {
    return (
        <div className={cn("bg-softwhite border border-antique rounded-2xl p-4", className)}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Left: Client Info */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-lg font-serif font-bold text-gold-dark">
                            {clientName[0]}
                        </span>
                    </div>
                    <div>
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-lg leading-tight")}>
                            {clientName}
                        </h2>
                        <div className={cn(TYPOGRAPHY.subValue, "flex items-center gap-3 mt-0.5 text-xs flex-wrap")}>
                            {birthDate && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {birthDate}
                                </span>
                            )}
                            {birthTime && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {birthTime}
                                </span>
                            )}
                            {birthPlace && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {birthPlace}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center: Key KP Indicators */}
                <div className="flex items-center gap-3 flex-wrap">
                    {lagna && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className={cn(TYPOGRAPHY.label, "text-[9px] tracking-widest")}>Lagna</p>
                            <p className={cn(TYPOGRAPHY.value, "text-sm text-primary")}>{lagna}</p>
                        </div>
                    )}
                    {moonSign && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className={cn(TYPOGRAPHY.label, "text-[9px] tracking-widest")}>Moon sign</p>
                            <p className={cn(TYPOGRAPHY.value, "text-sm text-primary")}>{moonSign}</p>
                        </div>
                    )}
                    {moonNakshatra && (
                        <div className="px-3 py-1.5 bg-parchment border border-antique rounded-lg text-center">
                            <p className={cn(TYPOGRAPHY.label, "text-[9px] tracking-widest")}>Nakshatra</p>
                            <p className={cn(TYPOGRAPHY.value, "text-sm text-primary")}>{moonNakshatra}</p>
                        </div>
                    )}
                    {ayanamsaValue && (
                        <div className="px-3 py-1.5 bg-gold-primary/10 border border-gold-primary/30 rounded-lg text-center">
                            <p className={cn(TYPOGRAPHY.label, "text-[9px] tracking-widest !text-gold-dark")}>KP ayanamsa</p>
                            <p className={cn(TYPOGRAPHY.value, "text-sm !text-gold-dark font-sans")}>{ayanamsaValue}</p>
                        </div>
                    )}
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {onGeneratePrediction && (
                        <button
                            onClick={onGeneratePrediction}
                            className={cn(
                                "px-3 py-2 bg-gold-primary text-white rounded-lg transition-colors flex items-center gap-1.5",
                                TYPOGRAPHY.value,
                                "text-xs font-semibold"
                            )}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Predict
                        </button>
                    )}
                    {onRunHorary && (
                        <button
                            onClick={onRunHorary}
                            className={cn(
                                "px-3 py-2 bg-softwhite border border-antique text-primary rounded-lg transition-colors flex items-center gap-1.5",
                                TYPOGRAPHY.value,
                                "text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50"
                            )}
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Horary
                        </button>
                    )}
                    {onExportReport && (
                        <button
                            onClick={onExportReport}
                            className={cn(
                                "px-3 py-2 bg-softwhite border border-antique text-primary rounded-lg transition-colors flex items-center gap-1.5",
                                TYPOGRAPHY.value,
                                "text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50"
                            )}
                        >
                            <FileDown className="w-3.5 h-3.5" />
                            Export
                        </button>
                    )}
                    {onCompareCharts && (
                        <button
                            onClick={onCompareCharts}
                            className={cn(
                                "px-3 py-2 bg-softwhite border border-antique text-primary rounded-lg transition-colors flex items-center gap-1.5",
                                TYPOGRAPHY.value,
                                "text-xs font-semibold hover:bg-gold-primary/10 hover:border-gold-primary/50"
                            )}
                        >
                            <GitCompare className="w-3.5 h-3.5" />
                            Compare
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
