"use client";

import React, { useMemo, useState } from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface DashaPeriod {
    planet?: string;
    lord?: string;
    start_date?: string;
    end_date?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    is_current?: boolean;
    isCurrent?: boolean;
    years?: number;
    months?: number;
    days?: number;
}

interface OtherDashaTableProps {
    data: {
        mahadashas?: DashaPeriod[];
        current_dasha?: DashaPeriod;
    } | null;
    dashaName?: string;
    isLoading?: boolean;
    className?: string;
}

const PLANET_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Sun': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Moon': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
    'Mars': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Mercury': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Jupiter': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Venus': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Saturn': { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
    'Rahu': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    'Ketu': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    } catch {
        return dateStr;
    }
};

const formatDuration = (period: DashaPeriod): string => {
    if (period.duration) return period.duration;
    if (period.years !== undefined) {
        const parts: string[] = [];
        if (period.years > 0) parts.push(`${period.years}y`);
        if (period.months && period.months > 0) parts.push(`${period.months}m`);
        if (period.days && period.days > 0) parts.push(`${period.days}d`);
        return parts.join(' ') || '—';
    }
    // Calculate from dates
    if (period.start_date && period.end_date) {
        const start = new Date(period.start_date);
        const end = new Date(period.end_date);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const diffMs = end.getTime() - start.getTime();
            const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
            const diffMonths = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
            const parts: string[] = [];
            if (diffYears > 0) parts.push(`${diffYears}y`);
            if (diffMonths > 0) parts.push(`${diffMonths}m`);
            return parts.join(' ') || '—';
        }
    }
    return '—';
};

const getPlanetStyles = (planet?: string) => {
    if (!planet) return PLANET_COLORS['Saturn'];
    const normalizedPlanet = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase();
    return PLANET_COLORS[normalizedPlanet] || PLANET_COLORS['Saturn'];
};

export default function OtherDashaTable({ data, dashaName, isLoading, className }: OtherDashaTableProps) {
    const [activeCycle, setActiveCycle] = useState<1 | 2>(1);

    const periods = useMemo(() => {
        if (!data?.mahadashas) return [];
        return data.mahadashas;
    }, [data]);

    // Split periods into two cycles based on the total period length
    const { cycle1, cycle2 } = useMemo(() => {
        if (periods.length === 0) return { cycle1: [], cycle2: [] };

        // For dashas with cycles, typically cycle 1 is the first complete set
        // We'll split based on whether the period extends beyond ~70 years from birth
        // or simply split in half if we can't determine
        const midPoint = Math.ceil(periods.length / 2);

        // Check if there's a clear year-based split (cycle 1: ~0-70 years, cycle 2: ~70+ years)
        const firstPeriodStart = periods[0]?.start_date || periods[0]?.startDate;
        if (firstPeriodStart) {
            const startYear = new Date(firstPeriodStart).getFullYear();
            const cycle1End: DashaPeriod[] = [];
            const cycle2Items: DashaPeriod[] = [];

            periods.forEach((period) => {
                const periodStart = period.start_date || period.startDate;
                if (periodStart) {
                    const year = new Date(periodStart).getFullYear();
                    // If period starts within ~72 years of birth, it's cycle 1
                    if (year - startYear < 72) {
                        cycle1End.push(period);
                    } else {
                        cycle2Items.push(period);
                    }
                } else {
                    cycle1End.push(period);
                }
            });

            if (cycle2Items.length > 0) {
                return { cycle1: cycle1End, cycle2: cycle2Items };
            }
        }

        // Fallback: split in half
        return {
            cycle1: periods.slice(0, midPoint),
            cycle2: periods.slice(midPoint)
        };
    }, [periods]);

    const currentPeriods = activeCycle === 1 ? cycle1 : cycle2;

    // Get cycle year ranges
    const getCycleYears = (items: DashaPeriod[]): string => {
        if (items.length === 0) return '';
        const first = items[0];
        const last = items[items.length - 1];
        const startYear = new Date(first.start_date || first.startDate || '').getFullYear();
        const endYear = new Date(last.end_date || last.endDate || '').getFullYear();
        if (isNaN(startYear) || isNaN(endYear)) return '';
        return `${startYear}-${endYear}`;
    };

    const isCurrentPeriod = (period: DashaPeriod): boolean => {
        return period.is_current || period.isCurrent || false;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-2" />
                <p className={cn(TYPOGRAPHY.label, "text-ink/50")}>Loading dasha data...</p>
            </div>
        );
    }

    if (!data || periods.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className={cn(TYPOGRAPHY.label, "text-ink/50")}>No dasha data available</p>
            </div>
        );
    }

    return (
        <div className={cn("w-full flex flex-col", className)}>
            {/* Cycle Tabs */}
            {cycle2.length > 0 && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveCycle(1)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all",
                            activeCycle === 1
                                ? "bg-primary text-white shadow-md"
                                : "bg-surface-warm text-ink/60 hover:bg-surface-warm/80"
                        )}
                    >
                        <span>CYCLE 1</span>
                        <span className={cn(
                            "text-[10px] font-medium",
                            activeCycle === 1 ? "text-white/70" : "text-ink/40"
                        )}>
                            {getCycleYears(cycle1)}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveCycle(2)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all",
                            activeCycle === 2
                                ? "bg-primary text-white shadow-md"
                                : "bg-surface-warm text-ink/60 hover:bg-surface-warm/80"
                        )}
                    >
                        <span>CYCLE 2</span>
                        <span className={cn(
                            "text-[10px] font-medium",
                            activeCycle === 2 ? "text-white/70" : "text-ink/40"
                        )}>
                            {getCycleYears(cycle2)}
                        </span>
                    </button>
                </div>
            )}

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-surface-warm/50 rounded-t-xl border-b border-gold-primary/10">
                <div className="col-span-3 text-[11px] font-bold text-ink/60 uppercase tracking-wider">Planet</div>
                <div className="col-span-3 text-[11px] font-bold text-ink/60 uppercase tracking-wider">Start Date</div>
                <div className="col-span-3 text-[11px] font-bold text-ink/60 uppercase tracking-wider">End Date</div>
                <div className="col-span-2 text-[11px] font-bold text-ink/60 uppercase tracking-wider">Duration</div>
                <div className="col-span-1 text-[11px] font-bold text-ink/60 uppercase tracking-wider text-right">Status</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gold-primary/5">
                {currentPeriods.map((period, index) => {
                    const planet = period.planet || period.lord || 'Unknown';
                    const styles = getPlanetStyles(planet);
                    const isCurrent = isCurrentPeriod(period);

                    return (
                        <div
                            key={index}
                            className={cn(
                                "grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors hover:bg-surface-warm/30",
                                isCurrent && "bg-gold-primary/5"
                            )}
                        >
                            {/* Planet Badge */}
                            <div className="col-span-3 flex items-center gap-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[12px] font-bold border",
                                    styles.bg,
                                    styles.text,
                                    styles.border
                                )}>
                                    {planet}
                                </span>
                                {index === 0 && activeCycle === 1 && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100">
                                        BAL
                                    </span>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="col-span-3 flex items-center gap-2 text-[13px] text-ink/80">
                                <svg className="w-4 h-4 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(period.start_date || period.startDate)}
                            </div>

                            {/* End Date */}
                            <div className="col-span-3 text-[13px] text-ink/80">
                                {formatDate(period.end_date || period.endDate)}
                            </div>

                            {/* Duration */}
                            <div className="col-span-2 text-[13px] font-medium text-ink/70">
                                {formatDuration(period)}
                            </div>

                            {/* Status */}
                            <div className="col-span-1 flex justify-end">
                                {isCurrent ? (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-200">
                                        ACTIVE
                                    </span>
                                ) : (
                                    <button className="p-1 text-ink/20 hover:text-ink/40 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
