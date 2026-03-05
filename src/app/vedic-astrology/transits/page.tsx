"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, AlertTriangle, ShieldAlert, Loader2, Calendar, Info, Clock, CalendarDays, CalendarRange } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { cn, formatPlanetDegree } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import NorthIndianChart, { ChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import { clientApi } from '@/lib/api';
import ParchmentDatePicker from '@/components/ui/ParchmentDatePicker';

import { parseChartData, signNameToId, signIdToName } from '@/lib/chart-helpers';

interface TransitPlanet {
    planet: string;
    sign: string;
    degree: string;
    house: number;
    status: string;
    isRetro: boolean;
    nakshatra: string;
}

// Map API data to transit format using robust parser
function mapChartToTransits(chartData: Record<string, unknown> | null | undefined, natalAscendant: number): TransitPlanet[] {
    const { planets } = parseChartData(chartData || {});
    if (planets.length === 0) return [];

    return planets
        .filter(p => p.name !== 'As')
        .map(p => {
            const normalized = p.signId;
            const house = ((normalized - natalAscendant + 12) % 12) + 1;
            return {
                planet: p.name,
                sign: signIdToName[p.signId] || 'Unknown',
                degree: p.degree,
                house,
                status: 'Neutral',
                isRetro: p.isRetro || false,
                nakshatra: p.nakshatra || '—',
            };
        });
}

// ============ DAILY TRANSIT VIEW ============

type DurationTab = 'day' | 'week' | 'month' | 'year' | 'custom';

const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// Planet emoji/symbol for visual appeal
const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

function getDateRange(tab: DurationTab): { start: string; end: string } {
    const today = new Date();
    const end = new Date(today);
    switch (tab) {
        case 'day': end.setDate(end.getDate()); break; // Today only (1 day)
        case 'week': end.setDate(end.getDate() + 6); break; // 7 days inclusive
        case 'month': end.setDate(end.getDate() + 29); break; // 30 days inclusive
        case 'year': end.setDate(end.getDate() + 364); break; // 365 days inclusive
    }
    return {
        start: today.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}

function getSafeDateRange(tab: DurationTab, custom?: { start: string; end: string }): { start: string; end: string } {
    if (tab === 'custom' && custom) return custom;
    return getDateRange(tab);
}

function formatDateLabel(dateStr: string): { day: string; monthYear: string; weekday: string; isToday: boolean } {
    // dateStr is "YYYY-MM-DD"
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { day: '?', monthYear: '', weekday: '', isToday: false };
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const dayNum = parseInt(parts[2]);
    const dateObj = new Date(year, month, dayNum);
    const todayStr = new Date().toISOString().split('T')[0];
    return {
        day: String(dayNum),
        monthYear: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: dateStr === todayStr,
    };
}

function DailyTransitView({ clientId }: { clientId: string }) {
    const [durationTab, setDurationTab] = useState<DurationTab>('week');
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Custom Date Range State
    const [customStart, setCustomStart] = useState<string>(new Date().toISOString().split('T')[0]);
    const [customEnd, setCustomEnd] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isConfirmingCustom, setIsConfirmingCustom] = useState(false);

    // UI State for selected date
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchTransits = useCallback(async (tab: DurationTab) => {
        setLoading(true);
        setError(null);
        setActiveIndex(0); // Reset to today/first day
        try {
            const { start, end } = getSafeDateRange(tab, { start: customStart, end: customEnd }); const response = await clientApi.generateDailyTransit(clientId, start, end) as any;


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

    // Data Helpers
    const currentEntry = data[activeIndex] || null;
    const nextEntry = data[activeIndex + 1] || null;
    const chartData = currentEntry ? parseChartData(currentEntry) : null;

    // Detection Logic: Transit Shifts (Planets moving house/sign)
    const getTransitInsights = () => {
        if (!currentEntry || !nextEntry) return [];

        interface TransitEvent {
            planet: string;
            type: 'sign' | 'house' | 'nakshatra' | 'retro';
            from: string | number;
            to: string | number;
            description: string;
            severity: 'high' | 'medium' | 'low';
            time?: string; // Future proofing for when time is available
        }

        const events: TransitEvent[] = [];
        const currPlanets = (currentEntry as any).planetary_positions || {};
        const nextPlanets = (nextEntry as any).planetary_positions || {};

        Object.keys(currPlanets).forEach(pName => {
            const curr = currPlanets[pName];
            const next = nextPlanets[pName];
            if (!curr || !next) return;

            // 1. Sign Change (High Impact)
            if (curr.sign !== next.sign) {
                events.push({
                    planet: pName,
                    type: 'sign',
                    from: curr.sign,
                    to: next.sign,
                    description: `${pName} enters ${next.sign}`,
                    severity: 'high'
                });
            }

            // 2. House Change (Medium Impact)
            if (curr.house !== next.house) {
                events.push({
                    planet: pName,
                    type: 'house',
                    from: curr.house,
                    to: next.house,
                    description: `${pName} moves into House ${next.house}`,
                    severity: 'medium'
                });
            }

            // 3. Nakshatra Change (Low/Detail Impact)
            // Handle both 'nakshatra' and 'star' keys just in case
            const currNak = curr.nakshatra || curr.star;
            const nextNak = next.nakshatra || next.star;
            if (currNak && nextNak && currNak !== nextNak) {
                events.push({
                    planet: pName,
                    type: 'nakshatra',
                    from: currNak,
                    to: nextNak,
                    description: `${pName} transits to ${nextNak}`,
                    severity: 'low'
                });
            }

            // 4. Retrograde Status Change (High Impact)
            const currRetro = !!(curr.retrograde === 'R' || curr.retrograde === true);
            const nextRetro = !!(next.retrograde === 'R' || next.retrograde === true);
            if (currRetro !== nextRetro) {
                const status = nextRetro ? 'Retrograde' : 'Direct';
                events.push({
                    planet: pName,
                    type: 'retro',
                    from: currRetro ? 'Rx' : 'D',
                    to: nextRetro ? 'Rx' : 'D',
                    description: `${pName} turns ${status}`,
                    severity: 'high'
                });
            }
        });

        // Sort events by severity (High first)
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return events.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    };

    const insights = getTransitInsights();

    // Mapping for UI
    const getPlanetRows = (entry: Record<string, unknown>) => {
        const planets: Record<string, any> = (entry as any)?.planetary_positions || (entry as any)?.planets || {};
        const keys = Object.keys(planets).filter(k => typeof planets[k] === 'object' && planets[k] !== null);

        const sorted = PLANET_ORDER.filter(p => keys.some(k => k.toLowerCase() === p.toLowerCase()))
            .map(p => keys.find(k => k.toLowerCase() === p.toLowerCase()) || p);

        return sorted.map(key => {
            const p = planets[key];
            return {
                name: key,
                sign: p.sign || '—',
                degree: formatPlanetDegree(p.degrees || p.degree || p.longitude),
                nakshatra: p.nakshatra || p.star || '—',
                pada: p.pada != null ? String(p.pada) : '—',
                house: p.house != null ? String(p.house) : '—',
                isRetro: !!(p.retrograde === 'R' || p.retrograde === true),
            };
        });
    };

    const DURATION_TABS: { key: DurationTab; label: string; icon: React.ReactNode }[] = [
        { key: 'day', label: 'Today', icon: <Clock className="w-3.5 h-3.5" /> },
        { key: 'week', label: 'Week', icon: <Calendar className="w-3.5 h-3.5" /> },
        { key: 'month', label: 'Month', icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { key: 'year', label: 'Year', icon: <CalendarRange className="w-3.5 h-3.5" /> },
        { key: 'custom', label: 'Custom', icon: <Calendar className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="flex flex-col min-h-[740px] h-auto bg-antique/30 rounded-2xl border border-antique">
            {/* 1. Header & Duration Selection */}
            <div className="px-6 py-4 bg-white/80 border-b border-antique flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-1.5 bg-antique/50 p-1 rounded-xl border border-antique/20">
                    {DURATION_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setDurationTab(tab.key)}
                            className={cn(
                                TYPOGRAPHY.value,
                                "px-4 py-2 uppercase tracking-wider rounded-lg transition-all flex items-center gap-2",
                                durationTab === tab.key
                                    ? cn("text-white shadow-md shadow-header-border/20", COLORS.wbActiveTab)
                                    : "text-primary hover:text-primary hover:bg-white/50"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {loading && <Loader2 className="w-4 h-4 text-header-border animate-spin" />}
                    <div className="text-right">
                        <p className={cn(TYPOGRAPHY.label, "leading-none")}>Status</p>
                        <p className={cn(TYPOGRAPHY.value, "mt-1")}>
                            {loading ? "Calculating..." : "Live feed"}
                        </p>
                    </div>
                </div>
            </div>

            {/* 1.5. Custom Date Range Picker (Conditional) */}
            {durationTab === 'custom' && (
                <div className="px-6 py-4 bg-white/40 border-b border-antique flex flex-wrap items-end gap-6 animate-in slide-in-from-top-4 duration-300">
                    <ParchmentDatePicker
                        label="Start Date"
                        date={customStart}
                        setDate={(d) => d && setCustomStart(d)}
                        className="w-48"
                    />
                    <ParchmentDatePicker
                        label="End Date"
                        date={customEnd}
                        setDate={(d) => d && setCustomEnd(d)}
                        className="w-48"
                    />
                    <button
                        onClick={() => fetchTransits('custom')}
                        disabled={loading}
                        className={cn(TYPOGRAPHY.value, "text-white px-6 py-2 rounded-xl uppercase tracking-widest shadow-md transition-all flex items-center gap-2 mb-1 disabled:opacity-50", COLORS.premiumGradient)}
                    >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CalendarRange className="w-3.5 h-3.5" />}
                        Confirm & project
                    </button>
                    <p className={cn(TYPOGRAPHY.subValue, "mb-2.5 max-w-[200px]")}>
                        Select a range (max 365 days) to see daily movement.
                    </p>
                </div>
            )}

            {/* Error Message rendering */}
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

            {/* 2. Horizontal Date Slider */}
            {!loading && data.length > 0 && (
                <div className="flex bg-white/40 border-b border-antique overflow-x-auto scrollbar-hide shrink-0 snap-x">
                    {data.map((entry, idx) => {
                        const dateStr = String(entry.date || entry.transit_date || '');
                        const { day, weekday, isToday } = formatDateLabel(dateStr);
                        const isSelected = activeIndex === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[70px] py-3 transition-all border-r border-antique/10 snap-start",
                                    isSelected
                                        ? "bg-white border-b-2 border-b-header-border"
                                        : "hover:bg-white/60 opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className={cn(
                                    TYPOGRAPHY.label,
                                    "mb-0.5",
                                    isToday && !isSelected ? "text-header-border" : "text-primary"
                                )}>{weekday}</span>
                                <span className={cn(
                                    TYPOGRAPHY.sectionTitle,
                                    "text-lg",
                                    isSelected ? "text-primary" : "text-primary"
                                )}>{day}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 3. Main Dashboard Body (Flexible Height) */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-header-border animate-spin mb-4" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl")}>Projecting Transits</h3>
                        <p className={cn(TYPOGRAPHY.value, "text-sm mt-2")}>Calculating planetary motions for {durationTab}...</p>
                    </div>
                ) : data.length > 0 ? (
                    <>
                        {/* Column 1: Gochar Chart (Visual) */}
                        <div className="lg:w-[380px] w-full border-r border-antique flex flex-col p-6 bg-white shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.2em]")}>Gochar chart</h3>
                                <div className="px-2 py-0.5 bg-header-border/10 rounded border border-header-border/20">
                                    <span className={cn(TYPOGRAPHY.label, "text-header-border")}>Lahiri</span>
                                </div>
                            </div>

                            <div className="flex-1 relative aspect-square max-w-[340px] mx-auto min-h-[300px]">
                                {chartData && (
                                    <ChartWithPopup
                                        planets={chartData.planets}
                                        ascendantSign={chartData.ascendant}
                                        className="w-full h-full"
                                        showDegrees={false} // Cleaner for dash view
                                    />
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-antique/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-antique rounded-xl">
                                        <Info className="w-5 h-5 text-header-border" />
                                    </div>
                                    <div>
                                        <p className={cn(TYPOGRAPHY.label, "tracking-widest")}>Astro tip</p>
                                        <p className={cn(TYPOGRAPHY.subValue, "italic leading-relaxed whitespace-normal")}>
                                            Planets in the 1st, 5th, and 9th houses from Lagos exert the strongest transit influence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Positions Table (High Density) */}
                        <div className="flex-1 bg-white/60 flex flex-col border-b lg:border-b-0">
                            <div className="px-6 py-4 border-b border-antique flex items-center justify-between shrink-0">
                                <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.2em]")}>Planetary coordinates</h3>
                            </div>

                            <div className="flex-1">
                                <table className="w-full border-collapse">
                                    <thead className="sticky top-[6.5rem] bg-surface-pure z-10 shadow-sm">
                                        <tr>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-6 py-3 text-left border-b border-antique/10")}>Planet</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 text-left border-b border-antique/10")}>Sign</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 text-left border-b border-antique/10")}>Degree</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 text-left border-b border-antique/10")}>Nakshatra</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-6 py-3 text-right border-b border-antique/10")}>House</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-antique/5">
                                        {getPlanetRows(currentEntry).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-white transition-colors group">
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg leading-none">{PLANET_SYMBOLS[row.name] || '●'}</span>
                                                        <div className="flex flex-col">
                                                            <span className={cn(TYPOGRAPHY.value, "text-xs")}>{row.name}</span>
                                                            {row.isRetro && (
                                                                <span className={cn(TYPOGRAPHY.label, "text-[7px] text-red-500")}>Retrograde</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(TYPOGRAPHY.value, "text-xs font-serif")}>{row.sign}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(TYPOGRAPHY.subValue, "font-mono")}>{row.degree}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className={cn(TYPOGRAPHY.value, "text-xs")}>{row.nakshatra}</span>
                                                        <span className={cn(TYPOGRAPHY.subValue)}>{row.pada}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <span className={cn(TYPOGRAPHY.value, "px-2 py-1 bg-antique text-[10px] rounded-md")}>
                                                        H{row.house}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Column 3: Insights & Shifts (Log) */}
                        <div className="lg:w-[320px] w-full border-l border-antique bg-white p-6 flex flex-col shrink-0">
                            <h3 className={cn(TYPOGRAPHY.label, "tracking-[0.2em] mb-6")}>Daily insights</h3>

                            {/* Lagna Box */}
                            <div className="bg-header-border/5 rounded-2xl p-5 border border-header-border/10 mb-6">
                                <p className={cn(TYPOGRAPHY.label, "text-header-border mb-3")}>Lagna (Ascendant)</p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl")}>{String((currentEntry.ascendant as Record<string, unknown>)?.sign || '')}</h4>
                                    <span className={cn(TYPOGRAPHY.subValue, "font-mono")}>{String((currentEntry.ascendant as Record<string, unknown>)?.degrees || '')}</span>
                                </div>
                                <p className={cn(TYPOGRAPHY.subValue, "mt-1 whitespace-normal")}>Starting point of planetary influence today.</p>
                            </div>

                            {/* Daily Planetary Log */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={cn(TYPOGRAPHY.label)}>Daily planetary log</h4>
                                    <span className={cn(TYPOGRAPHY.label, "bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100")}>{insights.length} events</span>
                                </div>

                                {/* Date Header */}
                                <div className="flex items-center gap-2 mb-4 px-1">
                                    <div className={cn(TYPOGRAPHY.label, "px-2 py-1 bg-antique/30 rounded border border-antique/20")}>
                                        {formatDateLabel(String(currentEntry.date || currentEntry.transit_date || '')).day} {formatDateLabel(String(currentEntry.date || currentEntry.transit_date || '')).monthYear}
                                    </div>
                                    <span className="text-primary">→</span>
                                    <div className={cn(TYPOGRAPHY.label, "px-2 py-1 bg-antique/30 rounded border border-antique/20")}>
                                        {formatDateLabel(String(nextEntry?.date || nextEntry?.transit_date || '')).day} {formatDateLabel(String(nextEntry?.date || nextEntry?.transit_date || '')).monthYear}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {insights.length > 0 ? (
                                        insights.map((event, k) => (
                                            <div key={k} className="p-3 bg-white border border-antique/30 rounded-lg group hover:border-header-border/40 transition-all shadow-sm">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm" title={event.planet}>{PLANET_SYMBOLS[event.planet]}</span>
                                                        <span className={cn(
                                                            TYPOGRAPHY.value,
                                                            "text-xs",
                                                            event.severity === 'high' ? "text-header-border" : "text-primary"
                                                        )}>
                                                            {event.planet}
                                                        </span>
                                                    </div>
                                                    <span className={cn(
                                                        TYPOGRAPHY.label,
                                                        "px-1.5 py-0.5 rounded",
                                                        event.type === 'sign' ? "bg-purple-50 text-purple-700" :
                                                            event.type === 'house' ? "bg-blue-50 text-blue-700" :
                                                                event.type === 'retro' ? "bg-red-50 text-red-700" :
                                                                    "bg-gray-50 text-gray-600"
                                                    )}>
                                                        {event.type}
                                                    </span>
                                                </div>

                                                <p className={cn(TYPOGRAPHY.subValue, "whitespace-normal text-primary leading-snug border-l-2 border-antique/20 pl-2 mb-1")}>
                                                    {event.description}
                                                </p>

                                                <div className="flex items-center gap-2 mt-1 pl-2">
                                                    <span className={cn(TYPOGRAPHY.subValue)}>
                                                        {event.from} <span className="text-primary">→</span> <span className={cn(TYPOGRAPHY.value, "text-[11px]")}>{event.to}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-antique/20 flex items-center justify-center mb-2">
                                                <span className="text-lg">—</span>
                                            </div>
                                            <p className={cn(TYPOGRAPHY.label, "!text-[10px] !font-black uppercase tracking-widest !mb-0")}>No Transits</p>
                                            <p className={cn(TYPOGRAPHY.subValue, "!text-[9px] italic mt-1")}>Stable planetary energies today.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Footer */}
                            <div className="mt-auto pt-6 border-t border-antique/10 text-center">
                                <p className={cn(TYPOGRAPHY.label, "tracking-[0.3em] mb-2")}>Transit summary</p>
                                <div className={cn(TYPOGRAPHY.subValue, "italic leading-relaxed whitespace-normal")}>
                                    {String((currentEntry as any).notes?.chart_type || "Standard Daily Gochar Analysis")}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                        <Info className="w-16 h-16 text-primary mb-4" />
                        <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-xl !mb-0")}>Data feed interrupted</h4>
                        <p className={cn(TYPOGRAPHY.subValue, "mt-2 max-w-md mx-6")}>
                            We couldn't retrieve the transit feed for this duration. Please try a different tab or check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============ MAIN TRANSITS PAGE ============

type GocharTab = 'gochar' | 'daily_transit';

export default function TransitsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const activeSystem = settings.ayanamsa.toLowerCase();
    const isLahiri = activeSystem === 'lahiri';
    const [activeTab, setActiveTab] = useState<GocharTab>(isLahiri ? 'daily_transit' : 'gochar');
    const [liveTransitChart, setLiveTransitChart] = useState<Record<string, unknown> | null>(null);
    const [isLiveLoading, setIsLiveLoading] = useState(false);

    // Auto-switch tab when system changes: non-Lahiri systems don't have Daily Transit
    useEffect(() => {
        if (!isLahiri && activeTab === 'daily_transit') {
            setActiveTab('gochar');
        }
    }, [activeSystem, isLahiri, activeTab]);

    const fetchLiveTransit = useCallback(async () => {
        if (!clientDetails?.id) return;
        setIsLiveLoading(true);
        try {
            const res = await clientApi.generateChart(clientDetails.id, 'transit', activeSystem);
            setLiveTransitChart(res);
        } catch (err) { } finally {
            setIsLiveLoading(false);
        }
    }, [clientDetails?.id, activeSystem]);

    // Reset live transit when system changes or client changes
    useEffect(() => {
        setLiveTransitChart(null);
        if (activeTab === 'gochar') {
            fetchLiveTransit();
        }
    }, [activeSystem, clientDetails?.id, activeTab, fetchLiveTransit]);


    const { transitData, natalAscendant, transitPlanets } = React.useMemo(() => {
        const d1Key = `D1_${activeSystem}`;
        const d1Chart = processedCharts[d1Key];
        // Prefer live fetched transit, fallback to context (though context likely empty for transit)
        const transitChart = liveTransitChart || processedCharts[`transit_${activeSystem}`];
        if (!transitChart?.chartData) {
            return { transitData: [], natalAscendant: 1, transitPlanets: [] };
        }

        const transit = transitChart.chartData;

        // Use natal D1 ascendant if available, otherwise fall back to transit chart's own ascendant
        let ascSign: number;
        if (d1Chart?.chartData) {
            const natalParsed = parseChartData(d1Chart.chartData);
            ascSign = natalParsed.ascendant;
        } else {
            // Fallback: use transit chart's own ascendant
            const transitParsed = parseChartData(transit);
            ascSign = transitParsed.ascendant;
        }

        const transits = mapChartToTransits(transit, ascSign);

        const planets: Planet[] = transits.map(t => ({
            name: t.planet.substring(0, 2),
            signId: signNameToId[t.sign] || 1,
            degree: t.degree,
            isRetro: t.isRetro
        }));

        return { transitData: transits, natalAscendant: ascSign, transitPlanets: planets };
    }, [processedCharts, activeSystem, liveTransitChart]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, isGeneratingCharts]);

    const retroPlanets = transitData.filter(t => t.isRetro);
    const debilitatedPlanets = transitData.filter(t => t.status === 'Debilitated');

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-xl text-primary">Please select a client to view transit analysis</p>
            </div>
        );
    }


    return (
        <div className="space-y-3 animate-in fade-in duration-500 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-xl flex items-center gap-2")}>
                        <RefreshCcw className="w-5 h-5 text-header-border" />
                        Transit impact analysis
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className={cn(TYPOGRAPHY.value, "text-sm font-serif font-normal")}>Gochar positions for {clientDetails.name}</p>
                        <span className={cn(TYPOGRAPHY.label, "px-2 py-0.5 bg-header-border/10 text-header-border rounded-full border border-header-border/30")}>
                            {settings.ayanamsa}
                        </span>
                        {(isGeneratingCharts || isLiveLoading) && (
                            <span className={cn(TYPOGRAPHY.label, "flex items-center gap-1.5 px-2 py-0.5 bg-green-100/80 text-green-700 rounded-full border border-green-200 animate-pulse")}>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {isGeneratingCharts ? 'Generating...' : 'Fetching Live Gochar...'}
                            </span>
                        )}
                        {isRefreshingCharts && !isGeneratingCharts && !isLiveLoading && (
                            <span className={cn(TYPOGRAPHY.label, "flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/80 text-blue-700 rounded-full border border-blue-200")}>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Refreshing...
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => activeTab === 'gochar' ? fetchLiveTransit() : refreshCharts()}
                        disabled={isLoadingCharts || isLiveLoading}
                        className="p-2 rounded-lg bg-white border border-header-border/30 hover:bg-header-border/10 text-bronze disabled:opacity-50"
                    >
                        <RefreshCcw className={cn("w-4 h-4", (isRefreshingCharts || isLiveLoading) && "animate-spin")} />
                    </button>
                    <div className="bg-green-100 px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className={cn(TYPOGRAPHY.label, "text-green-700")}>Live</span>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 bg-surface-pure rounded-xl p-1 border border-antique">
                {isLahiri && (
                    <button
                        onClick={() => setActiveTab('daily_transit')}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5",
                            TYPOGRAPHY.value,
                            activeTab === 'daily_transit'
                                ? cn("text-primary shadow-sm border border-header-border/20", COLORS.wbActiveTab)
                                : "text-primary hover:text-primary"
                        )}
                    >
                        Daily transit
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('gochar')}
                    className={cn(
                        "flex-1 px-4 py-2 rounded-lg transition-all",
                        TYPOGRAPHY.value,
                        activeTab === 'gochar'
                            ? cn("text-primary shadow-sm border border-header-border/20", COLORS.wbActiveTab)
                            : "text-primary hover:text-primary"
                    )}
                >
                    Gochar
                </button>
            </div>

            {/* ========== GOCHAR TAB ========== */}
            {activeTab === 'gochar' && (
                <>
                    {(isLiveLoading || (isLoadingCharts && Object.keys(processedCharts).length === 0)) && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-header-border animate-spin mb-3" />
                            <p className="font-serif text-primary">Calculating transit positions...</p>
                        </div>
                    )}

                    {!isLiveLoading && !isLoadingCharts && transitData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Info className="w-12 h-12 text-primary mb-3" />
                            <p className="font-serif text-primary text-lg mb-2">Transit data unavailable</p>
                            <p className="text-sm text-primary mb-4">Charts are being generated for this client</p>
                            <button
                                onClick={refreshCharts}
                                className="px-4 py-2 bg-header-border text-white rounded-lg font-medium hover:bg-header-border/90"
                            >
                                Refresh
                            </button>
                        </div>
                    )}

                    {transitData.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {retroPlanets.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                                        <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900")}>Retrograde alert</h3>
                                            <p className={cn(TYPOGRAPHY.subValue, "text-red-800 mt-0.5 whitespace-normal")}>
                                                {retroPlanets.map(p => p.planet).join(', ')} {retroPlanets.length === 1 ? 'is' : 'are'} retrograde.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-header-border/10 border border-header-border/30 rounded-xl p-3 flex items-start gap-3">
                                    <div className="p-1.5 bg-header-border/20 rounded-lg text-primary">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Transit Summary</h3>
                                        <p className={cn(TYPOGRAPHY.subValue, "mt-0.5 whitespace-normal")}>
                                            {debilitatedPlanets.length > 0
                                                ? `${debilitatedPlanets.map(p => p.planet).join(', ')} in challenging positions.`
                                                : 'No major planetary afflictions.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="bg-softwhite border border-antique rounded-xl p-4">
                                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-sm text-center mb-3")}>Gochar Chart</h3>
                                    <div className="aspect-square bg-surface-warm rounded-lg border border-header-border/10 p-3 flex items-center justify-center">
                                        <ChartWithPopup
                                            ascendantSign={natalAscendant}
                                            planets={transitPlanets}
                                            className="bg-transparent border-none w-full h-full"
                                            showDegrees={false}
                                        />
                                    </div>
                                    <p className={cn(TYPOGRAPHY.subValue, "text-center mt-2")}>
                                        Natal Ascendant: {signIdToName[natalAscendant]}
                                    </p>
                                </div>

                                <div className="lg:col-span-2 bg-softwhite border border-antique rounded-xl overflow-hidden">
                                    <div className="p-3 border-b border-header-border/10 bg-surface-pure flex justify-between items-center">
                                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-sm")}>Transit Positions</h3>
                                        <div className={cn(TYPOGRAPHY.subValue, "flex items-center gap-1")}>
                                            <Calendar className="w-3 h-3" />
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead className="bg-ink/5 border-b border-header-border/10">
                                                <tr>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left uppercase")}>Planet</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left uppercase")}>Sign</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left uppercase")}>Degree</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left uppercase")}>Nakshatra</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-center uppercase")}>House</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-header-border/10">
                                                {transitData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-ink/5 transition-colors">
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.value, "flex items-center gap-1.5 text-xs")}>
                                                                {row.planet}
                                                                {row.isRetro && (
                                                                    <span className={cn(TYPOGRAPHY.label, "text-[9px] text-red-500 bg-red-50 px-1 py-0.5 rounded animate-pulse")}>R</span>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.value, "font-serif text-xs font-normal")}>{row.sign}</span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.subValue, "font-mono")}>{row.degree}</span>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.subValue, "whitespace-normal")}>{row.nakshatra}</span>
                                                        </td>
                                                        <td className="px-3 py-2 text-center">
                                                            <span className={cn(TYPOGRAPHY.value, "text-xs")}>{row.house}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ========== DAILY TRANSIT TAB ========== */}
            {activeTab === 'daily_transit' && (
                <>
                    {!isLahiri ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Info className="w-12 h-12 text-amber-400 mb-3" />
                            <p className={cn(TYPOGRAPHY.sectionTitle, "text-lg mb-2")}>Lahiri System Required</p>
                            <p className={cn(TYPOGRAPHY.subValue, "text-sm whitespace-normal")}>
                                Daily Transit is currently available only for the <strong>Lahiri</strong> ayanamsa system.
                                <br />Switch to Lahiri in your settings to use this feature.
                            </p>
                        </div>
                    ) : clientDetails?.id ? (
                        <DailyTransitView clientId={clientDetails.id} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Info className="w-12 h-12 text-primary mb-3" />
                            <p className={cn(TYPOGRAPHY.sectionTitle, "text-lg")}>Client ID required</p>
                            <p className={cn(TYPOGRAPHY.subValue, "text-sm mt-1")}>Please select a saved client to fetch daily transit data.</p>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
