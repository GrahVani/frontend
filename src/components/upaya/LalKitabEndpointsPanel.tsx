"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import {
    Home,
    Orbit,
    Timer,
    ScrollText,
    CalendarDays,
    Loader2,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Sparkles,
} from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import type { ChartGenerateResponse } from '@/lib/api/types';

interface EndpointState {
    data?: ChartGenerateResponse;
    isLoading: boolean;
    isError: boolean;
    error?: Error | null;
}

interface LalKitabEndpointsPanelProps {
    housePosition: EndpointState;
    planetaryPosition: EndpointState;
    dasha: EndpointState;
    teva: EndpointState;
    varshphalTimeline: EndpointState;
}

const ENDPOINTS = [
    { key: 'housePosition', label: 'House Position', icon: Home, color: 'amber' },
    { key: 'planetaryPosition', label: 'Planetary Position', icon: Orbit, color: 'sky' },
    { key: 'dasha', label: 'Dasha', icon: Timer, color: 'emerald' },
    { key: 'teva', label: 'Teva', icon: ScrollText, color: 'violet' },
    { key: 'varshphalTimeline', label: 'Varshphal Timeline', icon: CalendarDays, color: 'rose' },
] as const;

type EndpointKey = typeof ENDPOINTS[number]['key'];

// Extract actual payload from chart record
function extractPayload(response?: ChartGenerateResponse): Record<string, unknown> | null {
    if (!response) return null;
    // Chart record from generateChart has chartData containing the raw payload
    const chartData = (response as any).chartData;
    if (chartData && typeof chartData === 'object') return chartData as Record<string, unknown>;
    // Fallback: some endpoints wrap in { data: ... }
    const data = (response as any).data;
    if (data && typeof data === 'object') return data as Record<string, unknown>;
    return null;
}

export default function LalKitabEndpointsPanel({
    housePosition,
    planetaryPosition,
    dasha,
    teva,
    varshphalTimeline,
}: LalKitabEndpointsPanelProps) {
    const [expanded, setExpanded] = useState<Record<EndpointKey, boolean>>({
        housePosition: true,
        planetaryPosition: false,
        dasha: false,
        teva: false,
        varshphalTimeline: false,
    });

    const stateMap: Record<EndpointKey, EndpointState> = {
        housePosition,
        planetaryPosition,
        dasha,
        teva,
        varshphalTimeline,
    };

    const toggle = (key: EndpointKey) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-3">
            {ENDPOINTS.map(({ key, label, icon: Icon, color }) => {
                const state = stateMap[key];
                const isOpen = expanded[key];
                const payload = extractPayload(state.data);
                const hasData = !!payload;

                const colorMap: Record<string, { border: string; bg: string; text: string; badge: string; iconBg: string }> = {
                    amber:   { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-200 text-amber-900', iconBg: 'bg-amber-200' },
                    sky:     { border: 'border-sky-300', bg: 'bg-sky-50', text: 'text-sky-900', badge: 'bg-sky-200 text-sky-900', iconBg: 'bg-sky-200' },
                    emerald: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-900', badge: 'bg-emerald-200 text-emerald-900', iconBg: 'bg-emerald-200' },
                    violet:  { border: 'border-violet-300', bg: 'bg-violet-50', text: 'text-violet-900', badge: 'bg-violet-200 text-violet-900', iconBg: 'bg-violet-200' },
                    rose:    { border: 'border-rose-300', bg: 'bg-rose-50', text: 'text-rose-900', badge: 'bg-rose-200 text-rose-900', iconBg: 'bg-rose-200' },
                };
                const c = colorMap[color];

                return (
                    <div
                        key={key}
                        className={cn(
                            "rounded-xl border overflow-hidden transition-all",
                            c.border,
                            isOpen ? "shadow-sm" : "shadow-none"
                        )}
                    >
                        {/* Header */}
                        <button
                            onClick={() => toggle(key)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 transition-colors",
                                c.bg,
                                "hover:opacity-80"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("p-1.5 rounded-lg", c.iconBg)}>
                                    <Icon className={cn("w-4 h-4", c.text)} />
                                </div>
                                <span className={cn(TYPOGRAPHY.label, "!mb-0", c.text)}>
                                    {label}
                                </span>
                                {hasData && (
                                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-bold", c.badge)}>
                                        Ready
                                    </span>
                                )}
                            </div>
                            {isOpen ? (
                                <ChevronUp className={cn("w-4 h-4", c.text)} />
                            ) : (
                                <ChevronDown className={cn("w-4 h-4", c.text)} />
                            )}
                        </button>

                        {/* Content */}
                        {isOpen && (
                            <div className="bg-white px-4 py-3">
                                {state.isLoading ? (
                                    <div className="flex items-center gap-2 py-4">
                                        <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                                        <span className="text-sm font-medium text-amber-800">
                                            Calculating {label.toLowerCase()}...
                                        </span>
                                    </div>
                                ) : state.isError ? (
                                    <div className="flex items-start gap-2 py-3 bg-red-50 rounded-lg px-3">
                                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-red-800 font-bold">Failed to load {label}</p>
                                            <p className="text-sm text-red-700">{state.error?.message || 'Unknown error'}</p>
                                        </div>
                                    </div>
                                ) : hasData ? (
                                    key === 'housePosition'
                                        ? <HousePositionView data={payload} />
                                        : <GenericDataView data={payload} />
                                ) : (
                                    <p className="text-sm text-amber-700 py-2">
                                        No data available.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================================
// House Position — Specific Rich UI
// ============================================================================
function HousePositionView({ data }: { data: Record<string, unknown> }) {
    const activeChart = (data.active_chart || []) as Array<{
        planet: string;
        lal_kitab_house: number;
        longitude: number;
        dignity: string;
    }>;
    const referenceTable = (data.reference_table_image || []) as Array<{
        KhanaNo: number;
        Maalik: string;
        Kismat: string;
        PakkaGhar: string;
        Exallt: string;
        Deblt: string;
        Soya: string;
    }>;

    return (
        <div className="space-y-4">
            {/* Active Chart — Planet Positions */}
            {activeChart.length > 0 && (
                <div>
                    <h4 className="font-sans text-sm font-semibold text-amber-900 tracking-wide mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        Planet Positions
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {activeChart.map((p) => (
                            <div
                                key={p.planet}
                                className={cn(
                                    "rounded-lg border p-3 text-center shadow-sm",
                                    p.dignity === 'Exalted'
                                        ? "bg-emerald-50 border-emerald-300"
                                        : "bg-amber-50 border-amber-300"
                                )}
                            >
                                <p className="text-sm font-black text-amber-900">{p.planet}</p>
                                <p className="text-xs text-amber-800 mt-1">House {p.lal_kitab_house}</p>
                                {p.dignity && p.dignity !== 'Neutral' && (
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-bold mt-1.5 inline-block",
                                        p.dignity === 'Exalted' ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900"
                                    )}>
                                        {p.dignity}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reference Table — 12 House Grid */}
            {referenceTable.length > 0 && (
                <div>
                    <h4 className="font-sans text-sm font-semibold text-amber-900 tracking-wide mb-3 flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-amber-700" />
                        Lal Kitab Reference Table (12 Houses)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-amber-300 rounded-lg overflow-hidden">
                            <thead className="bg-amber-100">
                                <tr>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Khana</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Maalik</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Kismat</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Pakka Ghar</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Exalted</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Debilitated</th>
                                    <th className="px-3 py-2 text-left font-black text-amber-900">Soya</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-200">
                                {referenceTable.map((row) => (
                                    <tr key={row.KhanaNo} className="hover:bg-amber-50">
                                        <td className="px-3 py-2 font-bold text-amber-950">{row.KhanaNo}</td>
                                        <td className="px-3 py-2 text-amber-900">{row.Maalik}</td>
                                        <td className="px-3 py-2 text-amber-900">{row.Kismat}</td>
                                        <td className="px-3 py-2 text-amber-900">{row.PakkaGhar}</td>
                                        <td className="px-3 py-2 text-emerald-800 font-semibold">{row.Exallt}</td>
                                        <td className="px-3 py-2 text-rose-800 font-semibold">{row.Deblt}</td>
                                        <td className="px-3 py-2 text-amber-900">{row.Soya}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Generic View — For endpoints where we don't know the exact shape yet
// ============================================================================
function GenericDataView({ data }: { data: Record<string, unknown> }) {
    return (
        <div className="space-y-3 max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {Object.entries(data).map(([key, value]) => {
                if (['cached', 'calculatedAt', 'success', 'ayanamsa', 'system', 'id', 'chartType', 'chartName', 'clientId'].includes(key)) return null;

                return (
                    <div key={key} className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                        <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1.5">
                            {key.replace(/_/g, ' ')}
                        </p>
                        <ValueRenderer value={value} />
                    </div>
                );
            })}
        </div>
    );
}

function ValueRenderer({ value }: { value: unknown }) {
    if (value === null || value === undefined) {
        return <span className="text-sm text-amber-500 italic">—</span>;
    }

    if (typeof value === 'string') {
        return <p className="text-sm text-amber-950 font-medium leading-relaxed">{value}</p>;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return <p className="text-sm text-amber-950 font-medium">{String(value)}</p>;
    }

    if (Array.isArray(value)) {
        return (
            <div className="space-y-2">
                {value.map((item, idx) => (
                    <div key={idx} className="bg-white rounded border border-amber-200 p-2.5 shadow-sm">
                        <ValueRenderer value={item} />
                    </div>
                ))}
            </div>
        );
    }

    if (typeof value === 'object') {
        return (
            <div className="space-y-1.5">
                {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-700 font-bold min-w-[120px] shrink-0">{k.replace(/_/g, ' ')}</span>
                        <span className="text-amber-950">{typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}</span>
                    </div>
                ))}
            </div>
        );
    }

    return <span className="text-sm text-amber-950">{String(value)}</span>;
}
