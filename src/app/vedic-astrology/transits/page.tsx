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
        <div className="flex flex-col h-[calc(100vh-180px)] bg-antique/30 rounded-2xl border border-antique overflow-hidden">
            {/* 1. Header & Duration Selection */}
            <div className="px-4 py-1.5 bg-white/80 border-b border-antique flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center gap-1 bg-antique/50 p-0.5 rounded-lg border border-antique/20 shrink-0">
                        {DURATION_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setDurationTab(tab.key)}
                                className={cn(
                                    TYPOGRAPHY.value,
                                    "px-2.5 py-1 text-xs sm:text-[12px] rounded transition-all flex items-center gap-1",
                                    durationTab === tab.key
                                        ? cn("text-white shadow-sm border border-header-border/20", COLORS.wbActiveTab)
                                        : "text-primary hover:text-primary hover:bg-white/50"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Ultra-compact Inline Custom Date Range Picker */}
                    {durationTab === 'custom' && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-3 shrink-0">
                                <ParchmentDatePicker
                                    label="Start date:-"
                                    date={customStart}
                                    setDate={(d) => d && setCustomStart(d)}
                                    variant="inline"
                                    className="w-auto h-7"
                                />
                                <ParchmentDatePicker
                                    label="End date:-"
                                    date={customEnd}
                                    setDate={(d) => d && setCustomEnd(d)}
                                    variant="inline"
                                    className="w-auto h-7"
                                />
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
                    {loading && <Loader2 className="w-4 h-4 text-header-border animate-spin" />}
                    <div className="text-right">
                        <p className={cn(TYPOGRAPHY.label, "leading-none")}>Status</p>
                        <p className={cn(TYPOGRAPHY.value, "mt-1")}>
                            {loading ? "Calculating..." : "Live feed"}
                        </p>
                    </div>
                </div>
            </div>


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
                                    "flex flex-col items-center justify-center min-w-[44px] py-1 transition-all border-r border-antique/10 snap-start",
                                    isSelected
                                        ? "bg-white border-b-2 border-b-header-border"
                                        : "hover:bg-white/60 opacity-60 hover:opacity-100"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] font-medium mb-0.5 capitalize",
                                    isToday && !isSelected ? "text-header-border" : "text-primary/70"
                                )}>{weekday.toLowerCase()}</span>
                                <span className={cn(
                                    TYPOGRAPHY.sectionTitle,
                                    "text-sm",
                                    isSelected ? "text-primary" : "text-primary"
                                )}>{day}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 3. Main Dashboard Body (Flexible Height) */}
            <div className={cn("flex-1 flex flex-col lg:flex-row min-h-0", COLORS.wbContainer)}>
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-header-border animate-spin mb-4" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl")}>Projecting Transits</h3>
                        <p className={cn(TYPOGRAPHY.value, "text-sm mt-2")}>Calculating planetary motions for {durationTab}...</p>
                    </div>
                ) : data.length > 0 ? (
                    <>
                        <div className="lg:w-[420px] w-full border-r border-antique flex flex-col bg-transparent shrink-0">
                            <div className={cn("flex items-center justify-between px-4 py-2 h-11 shrink-0", COLORS.wbSectionHeader)}>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Gochar chart</h3>
                                <div className="px-2 py-0.5 bg-header-border/10 rounded border border-header-border/20">
                                    <span className={cn(TYPOGRAPHY.label, "text-primary !mb-0")}>Lahiri</span>
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

                        {/* Column 2: Positions Table (High Density) */}
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
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-left")}>Nakshatra</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-center")}>Pada</th>
                                            <th className={cn(TYPOGRAPHY.tableHeader, "px-2 py-1.5 text-center")}>House</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-header-border/10">
                                        {getPlanetRows(currentEntry).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                <td className="px-2 py-1.5">
                                                    <span className={cn(TYPOGRAPHY.planetName, "flex items-center gap-1")}>
                                                        <span className="text-sm text-primary/70">{PLANET_SYMBOLS[row.name] || '●'}</span>
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

                        {/* Column 3: Insights & Shifts (Log) */}
                        <div className="flex-1 w-full border-l border-antique bg-transparent flex flex-col min-w-[280px]">
                            <div className={cn("px-4 py-2 h-11 flex items-center shrink-0", COLORS.wbSectionHeader)}>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Daily insights</h3>
                            </div>
                            <div className="px-3 py-3 flex flex-col flex-1 min-h-0 overflow-hidden">
                                {/* Lagna Box */}
                                <div className="bg-header-border/5 rounded-xl p-4 border border-header-border/10 mb-3 shrink-0">
                                    <p className={cn(TYPOGRAPHY.label, "text-primary mb-1")}>Lagna (Ascendant)</p>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl")}>{String((currentEntry.ascendant as Record<string, unknown>)?.sign || '')}</h4>
                                        <span className={cn(TYPOGRAPHY.dateAndDuration, "font-mono")}>{String((currentEntry.ascendant as Record<string, unknown>)?.degrees || '')}</span>
                                    </div>
                                    <p className={cn(TYPOGRAPHY.subValue, "mt-1 whitespace-normal")}>Starting point of planetary influence today.</p>
                                </div>

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
                                            <thead className="sticky top-0 bg-parchment/80 backdrop-blur-sm z-10">
                                                <tr className="border-b border-antique/20">
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left border-r border-antique/10 w-[70px]")}>Planet</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left border-r border-antique/10 w-[65px]")}>Type</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "!text-[10px] px-3 py-2 text-left")}>Shift</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-antique/10">
                                                {insights.length > 0 ? (
                                                    insights.map((event, k) => (
                                                        <tr key={k} className="hover:bg-white/50 transition-colors group">
                                                            <td className="px-3 py-2 border-r border-antique/10">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs text-primary">{PLANET_SYMBOLS[event.planet]}</span>
                                                                    <span className={cn(TYPOGRAPHY.value, "!text-xs")}>{event.planet}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 border-r border-antique/10">
                                                                <span className={cn(
                                                                    TYPOGRAPHY.label,
                                                                    "!text-[9px] px-1.5 py-0.5 rounded-md",
                                                                    event.type === 'sign' ? "bg-purple-100/50 text-purple-700" :
                                                                        event.type === 'house' ? "bg-blue-100/50 text-blue-700" :
                                                                            event.type === 'retro' ? "bg-red-100/50 text-red-700" :
                                                                                "bg-gray-100/50 text-gray-600"
                                                                )}>
                                                                    {event.type}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <p className={cn(TYPOGRAPHY.value, "!text-xs !leading-snug whitespace-normal")}>
                                                                    {event.description}
                                                                </p>
                                                                <div className="flex items-center gap-1 mt-0.5">
                                                                    <span className={cn(TYPOGRAPHY.subValue, "uppercase tracking-tight")}>
                                                                        {event.from} <span className="text-primary mx-0.5">→</span> <span className="font-bold text-primary">{event.to}</span>
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-10 h-10 rounded-full bg-antique/20 flex items-center justify-center mb-2">
                                                                    <span className="text-lg opacity-40">—</span>
                                                                </div>
                                                                <p className={cn(TYPOGRAPHY.label, "!text-[9px] uppercase tracking-widest opacity-40")}>No Transits</p>
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
        <div className="space-y-2 animate-in fade-in duration-500 pt-0 overflow-hidden">
            {/* Header with inline Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-xl flex items-center gap-2")}>
                        Transit impact analysis
                    </h1>
                    {(isGeneratingCharts || isLiveLoading || isRefreshingCharts) && (
                        <div className="flex items-center gap-2 mt-2">
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
                    )}
                </div>

                {/* Compact Tab Switcher */}
                <div className="inline-flex items-center gap-1 bg-surface-pure rounded-lg p-1 border border-antique shrink-0 mt-2 sm:mt-0 shadow-sm">
                    {isLahiri && (
                        <button
                            onClick={() => setActiveTab('daily_transit')}
                            className={cn(
                                "px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap",
                                TYPOGRAPHY.value,
                                "!text-xs",
                                activeTab === 'daily_transit'
                                    ? COLORS.wbActiveTab
                                    : "text-primary hover:bg-black/5"
                            )}
                        >
                            Daily transit
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('gochar')}
                        className={cn(
                            "px-3 py-1.5 rounded-md transition-all whitespace-nowrap",
                            TYPOGRAPHY.value,
                            "!text-xs",
                            activeTab === 'gochar'
                                ? COLORS.wbActiveTab
                                : "text-primary hover:bg-black/5"
                        )}
                    >
                        Gochar
                    </button>
                </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {retroPlanets.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3">
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

                                <div className="bg-header-border/10 border border-header-border/30 rounded-md p-3 flex items-start gap-3">
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

                            <div className={cn("flex flex-col lg:flex-row overflow-hidden", COLORS.wbContainer)}>
                                <div className="lg:w-[440px] w-full flex flex-col border-r border-antique shrink-0 bg-white/20">
                                    <div className={cn("px-4 py-2 h-11 flex items-center shrink-0", COLORS.wbSectionHeader)}>
                                        <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Gochar chart</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-start pt-0">
                                        <div className="w-full aspect-square -mt-3">
                                            <ChartWithPopup
                                                ascendantSign={natalAscendant}
                                                planets={transitPlanets}
                                                className="w-full h-full"
                                                showDegrees={false}
                                            />
                                        </div>
                                        <p className={cn(TYPOGRAPHY.subValue, "text-center mt-2 font-medium text-primary")}>
                                            Natal Ascendant: {signIdToName[natalAscendant]}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className={cn("px-4 py-2 h-11 flex justify-between items-center shrink-0", COLORS.wbSectionHeader)}>
                                        <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Transit positions</h3>
                                        <div className={cn(TYPOGRAPHY.label, "flex items-center gap-1.5 text-primary !mb-0")}>
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-white/40">
                                        <table className="w-full border-collapse">
                                            <thead className="sticky top-0 bg-parchment/90 backdrop-blur-md z-10 border-b border-antique/20">
                                                <tr>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-left")}>Planet</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-left")}>Sign</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-left")}>Degree</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-left")}>Nakshatra</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 text-center")}>House</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-header-border/10">
                                                {transitData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-primary/5 transition-colors border-b border-header-border/5 last:border-0">
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.planetName, "flex items-center gap-2")}>
                                                                <span className="text-base text-primary/70">{PLANET_SYMBOLS[row.planet] || '●'}</span>
                                                                {row.planet}
                                                                {row.isRetro && (
                                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded ml-1">R</span>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2")}>{row.sign}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 font-mono text-sm")}>{row.degree}</td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2 font-medium")}>{row.nakshatra}</td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2 text-center text-base")}>{row.house}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Legend / Key Area to use bottom gap */}
                                    <div className="mt-auto px-4 py-1.5 bg-parchment/30 border-t border-antique flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">R</span>
                                                <span className={cn(TYPOGRAPHY.label, "!mb-0 text-[11px]")}>Retrograde Motion</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary/70"></div>
                                                <span className={cn(TYPOGRAPHY.label, "!mb-0 text-[11px]")}>Strong Influence</span>
                                            </div>
                                        </div>
                                        <div className={cn(TYPOGRAPHY.label, "text-header-border text-[10px] font-mono italic")}>
                                            Refreshed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
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
