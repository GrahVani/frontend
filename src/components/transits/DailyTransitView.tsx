"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Loader2, Info, Clock, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { cn, formatPlanetDegree } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';
import { clientApi } from '@/lib/api';
import ParchmentDatePicker from '@/components/ui/ParchmentDatePicker';
import { KnowledgeTooltip } from '@/components/knowledge';
import { parseChartData } from '@/lib/chart-helpers';
import {
    type DurationTab,
    TRANSIT_PLANET_ORDER,
    PLANET_SYMBOLS,
    getSafeDateRange,
    formatDateLabel,
} from '@/lib/transit-helpers';

const DURATION_TABS: { key: DurationTab; label: string; icon: React.ReactNode }[] = [
    { key: 'day', label: 'Today', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'week', label: 'Week', icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: 'month', label: 'Month', icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { key: 'year', label: 'Year', icon: <CalendarRange className="w-3.5 h-3.5" /> },
    { key: 'custom', label: 'Custom', icon: <Calendar className="w-3.5 h-3.5" /> },
];

interface TransitEvent {
    planet: string;
    type: 'sign' | 'house' | 'nakshatra' | 'retro';
    from: string | number;
    to: string | number;
    description: string;
    severity: 'high' | 'medium' | 'low';
}

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

function getTransitInsights(
    currentEntry: Record<string, unknown> | null,
    nextEntry: Record<string, unknown> | null,
): TransitEvent[] {
    if (!currentEntry || !nextEntry) return [];

    const events: TransitEvent[] = [];
    const currPlanets = (currentEntry as any).planetary_positions || {};
    const nextPlanets = (nextEntry as any).planetary_positions || {};

    Object.keys(currPlanets).forEach(pName => {
        // As an astrologer: Rahu and Ketu are slow-moving and almost always retrograde.
        // Their daily status shifts are often noise rather than meaningful "daily insights".
        if (['Rahu', 'Ketu'].includes(pName)) return;

        const curr = currPlanets[pName];
        const next = nextPlanets[pName];
        if (!curr || !next) return;

        if (curr.sign !== next.sign) {
            events.push({ planet: pName, type: 'sign', from: curr.sign, to: next.sign, description: `${pName} enters ${next.sign}`, severity: 'high' });
        }
        if (curr.house !== next.house) {
            events.push({ planet: pName, type: 'house', from: curr.house, to: next.house, description: `${pName} moves into House ${next.house}`, severity: 'medium' });
        }
        const currNak = curr.nakshatra || curr.star;
        const nextNak = next.nakshatra || next.star;
        if (currNak && nextNak && currNak !== nextNak) {
            events.push({ planet: pName, type: 'nakshatra', from: currNak, to: nextNak, description: `${pName} transits to ${nextNak}`, severity: 'low' });
        }
        const currRetro = !!(curr.retrograde === 'R' || curr.retrograde === true);
        const nextRetro = !!(next.retrograde === 'R' || next.retrograde === true);
        if (currRetro !== nextRetro) {
            events.push({ planet: pName, type: 'retro', from: currRetro ? 'Rx' : 'D', to: nextRetro ? 'Rx' : 'D', description: `${pName} turns ${nextRetro ? 'Retrograde' : 'Direct'}`, severity: 'high' });
        }
    });

    return events.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

function getPlanetRows(entry: Record<string, unknown>) {
    const planets: Record<string, any> = (entry as any)?.planetary_positions || (entry as any)?.planets || {};
    const keys = Object.keys(planets).filter(k => typeof planets[k] === 'object' && planets[k] !== null);

    const sorted = TRANSIT_PLANET_ORDER
        .filter(p => keys.some(k => k.toLowerCase() === p.toLowerCase()))
        .map(p => keys.find(k => k.toLowerCase() === p.toLowerCase()) || p);

    return sorted.map(key => {
        const p = planets[key];
        return {
            name: key,
            sign: p.sign || '\u2014',
            degree: formatPlanetDegree(p.degrees || p.degree || p.longitude),
            nakshatra: p.nakshatra || p.star || '\u2014',
            pada: p.pada != null ? String(p.pada) : '\u2014',
            house: p.house != null ? String(p.house) : '\u2014',
            isRetro: !!(p.retrograde === 'R' || p.retrograde === true),
        };
    });
}

export default function DailyTransitView({ clientId }: { clientId: string }) {
    const [durationTab, setDurationTab] = useState<DurationTab>('week');
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [customStart, setCustomStart] = useState<string>(new Date().toISOString().split('T')[0]);
    const [customEnd, setCustomEnd] = useState<string>(new Date().toISOString().split('T')[0]);

    const [activeIndex, setActiveIndex] = useState(0);

    const fetchTransits = useCallback(async (tab: DurationTab) => {
        setLoading(true);
        setError(null);
        setActiveIndex(0);
        try {
            const { start, end } = getSafeDateRange(tab, { start: customStart, end: customEnd });
            const response = await clientApi.generateDailyTransit(clientId, start, end) as any;

            let entries: Record<string, unknown>[] = [];
            if (response?.chartData?.data?.transit_data) {
                entries = response.chartData.data.transit_data;
            } else if (response?.chartData?.transit_data) {
                entries = response.chartData.transit_data;
            } else if (response?.data?.transit_data) {
                entries = response.data.transit_data;
            } else if (Array.isArray(response?.chartData)) {
                entries = response.chartData;
            } else {
                const findTransitData = (obj: Record<string, unknown>): Record<string, unknown>[] | null => {
                    if (!obj || typeof obj !== 'object') return null;
                    if (Array.isArray(obj.transit_data)) return obj.transit_data;
                    for (const key in obj) {
                        const result = findTransitData(obj[key] as Record<string, unknown>);
                        if (result) return result;
                    }
                    return null;
                };
                entries = findTransitData(response) || [];
            }

            setData(entries);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch daily transit data');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [clientId, customStart, customEnd]);

    useEffect(() => {
        if (durationTab !== 'custom') {
            fetchTransits(durationTab);
        }
    }, [durationTab, fetchTransits]);

    const currentEntry = data[activeIndex] || null;
    const nextEntry = data[activeIndex + 1] || null;
    const chartData = currentEntry ? parseChartData(currentEntry) : null;
    const insights = getTransitInsights(currentEntry, nextEntry);

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] bg-gold-primary/5 rounded-2xl border border-gold-primary/20 overflow-hidden">
            {/* Header & Duration Selection */}
            <div className="px-4 py-1.5 bg-white/80 border-b border-gold-primary/20 flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center gap-1 bg-gold-primary/10 p-0.5 rounded-lg border border-gold-primary/15 shrink-0">
                        {DURATION_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setDurationTab(tab.key)}
                                className={cn(
                                    TYPOGRAPHY.value,
                                    "px-2.5 py-1 text-[12px] sm:text-[12px] rounded transition-all flex items-center gap-1",
                                    durationTab === tab.key
                                        ? cn("text-white shadow-sm border border-gold-primary/15", COLORS.wbActiveTab)
                                        : "text-ink hover:text-ink hover:bg-white/50"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {durationTab === 'custom' && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-3 shrink-0">
                                <ParchmentDatePicker label="Start date:-" date={customStart} setDate={(d) => d && setCustomStart(d)} variant="inline" className="w-auto h-7" />
                                <ParchmentDatePicker label="End date:-" date={customEnd} setDate={(d) => d && setCustomEnd(d)} variant="inline" className="w-auto h-7" />
                                <button
                                    onClick={() => fetchTransits('custom')}
                                    disabled={loading}
                                    className={cn(TYPOGRAPHY.value, "text-[11px] sm:text-[12px] text-white px-4 py-1.5 rounded-md tracking-wider shadow-sm transition-all flex items-center gap-2 disabled:opacity-50", COLORS.premiumGradient)}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    {loading && <Loader2 className="w-4 h-4 text-gold-dark animate-spin" />}
                    <div className="text-right">
                        <p className={cn(TYPOGRAPHY.label, "leading-none")}>Status</p>
                        <p className={cn(TYPOGRAPHY.value, "mt-1")}>{loading ? "Calculating..." : "Live feed"}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div className="flex-1">
                        <p className={cn(TYPOGRAPHY.value, "text-red-900")}>Projection error</p>
                        <p className={cn(TYPOGRAPHY.subValue, "text-red-700 mt-0.5")}>{error}</p>
                    </div>
                    <button
                        onClick={() => fetchTransits(durationTab)}
                        className={cn(TYPOGRAPHY.label, "px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 !text-[10px] !font-black uppercase tracking-tighter rounded-lg transition-colors !mb-0")}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Horizontal Date Slider */}
            {!loading && data.length > 0 && (
                <div className="flex bg-white/40 border-b border-gold-primary/20 overflow-x-auto scrollbar-hide shrink-0 snap-x">
                    {data.map((entry, idx) => {
                        const dateStr = String(entry.date || entry.transit_date || '');
                        const { day, weekday, isToday } = formatDateLabel(dateStr);
                        const isSelected = activeIndex === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[44px] py-1 transition-all border-r border-gold-primary/10 snap-start",
                                    isSelected
                                        ? "bg-white border-b-2 border-b-gold-primary"
                                        : "hover:bg-white/60 opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] font-medium mb-0.5 capitalize",
                                    isToday && !isSelected ? "text-gold-dark" : "text-ink/70"
                                )}>{weekday.toLowerCase()}</span>
                                <span className={cn(
                                    TYPOGRAPHY.sectionTitle,
                                    "text-[14px]",
                                    isSelected ? "text-ink" : "text-ink"
                                )}>{day}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Dashboard Body */}
            <div className={cn("flex-1 flex flex-col lg:flex-row min-h-0", COLORS.wbContainer)}>
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-gold-dark animate-spin mb-4" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px]")}>Projecting <KnowledgeTooltip term="transit">Transits</KnowledgeTooltip></h3>
                        <p className={cn(TYPOGRAPHY.value, "text-[14px] mt-2")}>Calculating planetary motions for {durationTab}...</p>
                    </div>
                ) : data.length > 0 ? (
                    <>
                        <div className="lg:w-[420px] w-full border-r border-gold-primary/20 flex flex-col bg-transparent shrink-0">
                            <div className={cn("flex items-center justify-between px-4 py-2 h-11 shrink-0", COLORS.wbSectionHeader)}>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle)}><KnowledgeTooltip term="transit">Gochar</KnowledgeTooltip> chart</h3>
                                <div className="px-2 py-0.5 bg-gold-primary/10 rounded border border-gold-primary/15">
                                    <span className={cn(TYPOGRAPHY.label, "text-ink !mb-0")}><KnowledgeTooltip term="ayanamsa">Lahiri</KnowledgeTooltip></span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-start pt-0 bg-transparent">
                                <div className="w-[420px] aspect-square -mt-3">
                                    {chartData && (
                                        <ChartWithPopup
                                            planets={chartData.planets}
                                            ascendantSign={chartData.ascendant}
                                            className="w-full h-full"
                                            showDegrees={false}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Positions Table */}
                        <div className="bg-transparent flex flex-col border-b lg:border-b-0 shrink-0">
                            <div className={cn("px-4 py-2 h-11 flex items-center justify-between shrink-0", COLORS.wbSectionHeader)}>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Planetary coordinates</h3>
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-left")}>Planet</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-left")}>Sign</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-left")}>Degree</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-left")}><KnowledgeTooltip term="nakshatra">Nakshatra</KnowledgeTooltip></th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-center")}>Pada</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-center")}>House</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gold-primary/10">
                                        {currentEntry && getPlanetRows(currentEntry).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                <td className="px-2 py-1.5">
                                                    <span className={cn(TYPOGRAPHY.planetName, "flex items-center gap-1")}>
                                                        <span className="text-[14px] text-ink/70">{PLANET_SYMBOLS[row.name] || '\u25CF'}</span>
                                                        {row.name}
                                                        {row.isRetro && (
                                                            <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded">R</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className={cn(TYPOGRAPHY.value, "px-2 py-1.5")}>{row.sign}</td>
                                                <td className={cn(TYPOGRAPHY.dateAndDuration, "px-2 py-1.5 font-mono")}>{row.degree}</td>
                                                <td className={cn(TYPOGRAPHY.value, "px-2 py-1.5")}>{row.nakshatra}</td>
                                                <td className={cn(TYPOGRAPHY.value, "px-2 py-1.5 text-center")}>{row.pada}</td>
                                                <td className={cn(TYPOGRAPHY.value, "px-2 py-1.5 text-center")}>{row.house}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Insights & Shifts */}
                        <div className="flex-1 w-full border-l border-gold-primary/20 bg-transparent flex flex-col min-w-[280px]">
                            <div className={cn("px-4 py-2 h-11 flex items-center shrink-0", COLORS.wbSectionHeader)}>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Daily insights</h3>
                            </div>
                            <div className="px-3 py-3 flex flex-col flex-1 min-h-0 overflow-hidden">
                                {/* Lagna Box */}
                                {currentEntry && (
                                    <div className="bg-gold-primary/5 rounded-xl p-4 border border-gold-primary/10 mb-3 shrink-0">
                                        <p className={cn(TYPOGRAPHY.label, "text-ink mb-1")}>Lagna (Ascendant)</p>
                                        <div className="flex items-baseline gap-2">
                                            <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px]")}>{String((currentEntry.ascendant as Record<string, unknown>)?.sign || '')}</h4>
                                            <span className={cn(TYPOGRAPHY.dateAndDuration, "font-mono")}>{String((currentEntry.ascendant as Record<string, unknown>)?.degrees || '')}</span>
                                        </div>
                                        <p className={cn(TYPOGRAPHY.subValue, "mt-1 whitespace-normal")}>Starting point of planetary influence today.</p>
                                    </div>
                                )}

                                {/* Daily Planetary Log */}
                                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <h4 className={cn(TYPOGRAPHY.label)}>Daily planetary log</h4>
                                        <span className={cn(TYPOGRAPHY.label, "bg-green-100/50 text-green-700 px-2 py-0.5 rounded-full border border-green-200/50")}>
                                            {insights.length} events
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white/30">
                                        <table className="w-full border-collapse table-fixed">
                                            <thead className="sticky top-0 bg-surface-warm/80 backdrop-blur-sm z-10">
                                                <tr className="border-b border-gold-primary/15">
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left border-r border-gold-primary/10 w-[70px]")}>Planet</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left border-r border-gold-primary/10 w-[65px]")}>Type</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left")}>Shift</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gold-primary/10">
                                                {insights.length > 0 ? (
                                                    insights.map((event, k) => (
                                                        <tr key={k} className="hover:bg-white/50 transition-colors group">
                                                            <td className="px-3 py-2 border-r border-gold-primary/10">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[12px] text-ink">{PLANET_SYMBOLS[event.planet]}</span>
                                                                    <span className={cn(TYPOGRAPHY.value, "!text-[12px]")}>{event.planet}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 border-r border-gold-primary/10">
                                                                <span className={cn(
                                                                    TYPOGRAPHY.label,
                                                                    "!text-[9px] px-1.5 py-0.5 rounded-md",
                                                                    event.type === 'sign' ? "bg-purple-100/50 text-purple-700" :
                                                                        event.type === 'house' ? "bg-blue-100/50 text-blue-700" :
                                                                            event.type === 'retro' ? "bg-red-100/50 text-red-700" :
                                                                                "bg-gold-primary/8 text-ink/50"
                                                                )}>
                                                                    {event.type}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <p className={cn(TYPOGRAPHY.value, "!text-[12px] !leading-snug whitespace-normal")}>{event.description}</p>
                                                                <div className="flex items-center gap-1 mt-0.5">
                                                                    <span className={cn(TYPOGRAPHY.subValue, "uppercase tracking-tight")}>
                                                                        {event.from} <span className="text-ink mx-0.5">{'\u2192'}</span> <span className="font-bold text-ink">{event.to}</span>
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-10 h-10 rounded-full bg-gold-primary/5 flex items-center justify-center mb-2">
                                                                    <span className="text-[18px] opacity-40">{'\u2014'}</span>
                                                                </div>
                                                                <p className={cn(TYPOGRAPHY.label, "!text-[9px] uppercase tracking-widest opacity-40")}>No <KnowledgeTooltip term="transit">Transits</KnowledgeTooltip></p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                        <Info className="w-16 h-16 text-ink mb-4" />
                        <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] !mb-0")}>Data feed interrupted</h4>
                        <p className={cn(TYPOGRAPHY.subValue, "mt-2 max-w-md mx-6")}>
                            We couldn't retrieve the transit feed for this duration. Please try a different tab or check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
