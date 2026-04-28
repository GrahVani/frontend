"use client";

import React, { useState, useEffect } from 'react';
import { Compass, Loader2, RefreshCw } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PlanetInfo {
    planet: string;
    sign: string;
    signLord: string;
    degree: string;
    longitude: string;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    house: number;
    dignity: string;
    retrograde: boolean;
}

// Nakshatra lords mapping
const NAKSHATRA_LORDS: Record<string, string> = {
    'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
    'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
    'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
    'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
    'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
    'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
    'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury',
};

// Sign lords
const SIGN_LORDS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter',
};



import { parseChartData, signIdToName } from '@/lib/chart-helpers';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';

const SIGN_SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const SIGN_ELEMENT_COLORS: Record<string, string> = {
    'Aries': '#D97706', 'Leo': '#D97706', 'Sagittarius': '#D97706',
    'Taurus': '#65A30D', 'Virgo': '#65A30D', 'Capricorn': '#65A30D',
    'Gemini': '#7C3AED', 'Libra': '#7C3AED', 'Aquarius': '#7C3AED',
    'Cancer': '#0EA5E9', 'Scorpio': '#0EA5E9', 'Pisces': '#0EA5E9',
};

function mapChartToPlanetInfo(chartData: unknown): PlanetInfo[] {
    // Leverage the robust parser we alread fixed
    const { planets } = parseChartData(chartData);

    if (planets.length === 0) return [];

    const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    // Map of short names to long names if needed for sorting or display
    const longNames: Record<string, string> = {
        'Su': 'Sun', 'Mo': 'Moon', 'Ma': 'Mars', 'Me': 'Mercury',
        'Ju': 'Jupiter', 'Ve': 'Venus', 'Sa': 'Saturn', 'Ra': 'Rahu', 'Ke': 'Ketu'
    };

    return planets
        .filter(p => p.name !== 'As') // Exclude Ascendant from planets list
        .map(p => {
            const longName = longNames[p.name] || p.name;
            const signName = signIdToName[p.signId] || 'Unknown';
            // Determine Nakshatra Lord
            const nakLord = p.nakshatra ? NAKSHATRA_LORDS[p.nakshatra] || 'Unknown' : '—';

            return {
                planet: longName,
                sign: signName,
                signLord: SIGN_LORDS[signName] || '—',
                degree: p.degree,
                longitude: '—', // Normalized parser handles degree formatting, raw longitude might be lost but degree is present
                nakshatra: p.nakshatra || '—',
                pada: p.pada || 1,
                nakshatraLord: nakLord,
                house: p.house || 1,
                dignity: 'Neutral', // Dignity is complex to calculate, placeholder or needs robust calc
                retrograde: p.isRetro || false,
            };
        })
        .sort((a, b) => {
            const idxA = planetOrder.indexOf(a.planet);
            const idxB = planetOrder.indexOf(b.planet);
            // Handle if names mismatch (e.g. Su vs Sun)
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });
}

export default function VedicPlanetsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const activeSystem = settings.ayanamsa.toLowerCase();

    const planetData = React.useMemo(() => {
        const key = `D1_${activeSystem}`;
        const d1Chart = processedCharts[key];
        if (d1Chart?.chartData) {
            return mapChartToPlanetInfo(d1Chart.chartData);
        }
        return [];
    }, [processedCharts, activeSystem]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, isGeneratingCharts]);

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-[20px] text-amber-800">Please select a client to view planetary diagnostics</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Compass className="w-8 h-8 text-amber-700" />
                    <div>
                        <h1 className="text-[24px] font-serif text-amber-900 font-black tracking-tight">Planetary Diagnostics</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-amber-700 font-serif text-[14px]">Natal positions for {clientDetails.name}</p>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full border border-amber-200/60">
                                {settings.ayanamsa}
                            </span>
                            {isGeneratingCharts && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100/80 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Generating...
                                </span>
                            )}
                            {isRefreshingCharts && !isGeneratingCharts && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/80 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Refreshing...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={refreshCharts}
                    disabled={isLoadingCharts}
                    className="p-2 rounded-lg bg-white border border-amber-200/60 hover:bg-amber-50 text-amber-700 disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-4 h-4", isRefreshingCharts && "animate-spin")} />
                </button>
            </div>

            {/* Loading State - Only show if NO data exists */}
            {isLoadingCharts && Object.keys(processedCharts).length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-amber-700 animate-spin mb-3" />
                    <p className="font-serif text-amber-700">Loading planetary positions...</p>
                </div>
            )}

            {/* No Data State */}
            {!isLoadingCharts && planetData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-serif text-amber-800 text-[18px] mb-2">No planetary data available</p>
                    <p className="text-[14px] text-amber-700/60 mb-4">Charts are being generated for this client</p>
                    <button
                        onClick={refreshCharts}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Planets Table */}
            {planetData.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[14px]">
                            <thead className="bg-amber-50/80 text-amber-800/70 font-black uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 text-left sticky left-0 bg-white z-10">Planet</th>
                                    <th className="px-4 py-3 text-left">Sign</th>
                                    <th className="px-4 py-3 text-left">Sign Lord</th>
                                    <th className="px-4 py-3 text-left">Degree</th>
                                    <th className="px-4 py-3 text-left">Longitude</th>
                                    <th className="px-4 py-3 text-left">Nakshatra</th>
                                    <th className="px-4 py-3 text-center">Pada</th>
                                    <th className="px-4 py-3 text-left">Nak Lord</th>
                                    <th className="px-4 py-3 text-center">House</th>
                                    <th className="px-4 py-3 text-left">Dignity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-200/40">
                                {planetData.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-amber-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-amber-900 sticky left-0 bg-white z-10">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="text-[18px] font-serif"
                                                    style={{ color: PLANET_SVG_FILLS[p.planet] || '#92400E' }}
                                                >
                                                    {getPlanetSymbol(p.planet)}
                                                </span>
                                                <span>{p.planet}</span>
                                                {p.retrograde && (
                                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">R</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-serif text-amber-900">
                                            <span className="flex items-center gap-1.5">
                                                <span
                                                    className="text-[16px] font-serif opacity-80"
                                                    style={{ color: SIGN_ELEMENT_COLORS[p.sign] || '#B45309' }}
                                                >
                                                    {SIGN_SYMBOLS[p.sign] || ''}
                                                </span>
                                                <span>{p.sign}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-amber-700">{p.signLord}</td>
                                        <td className="px-4 py-3 font-mono text-amber-900 font-medium">{p.degree}</td>
                                        <td className="px-4 py-3 font-mono text-[12px] text-amber-700">{p.longitude}</td>
                                        <td className="px-4 py-3 text-amber-900">{p.nakshatra}</td>
                                        <td className="px-4 py-3 text-center font-bold text-amber-700">{p.pada}</td>
                                        <td className="px-4 py-3 text-amber-700">{p.nakshatraLord}</td>
                                        <td className="px-4 py-3 text-center font-bold text-amber-900">{p.house}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                                p.dignity === 'Exalted' ? 'bg-emerald-100 text-emerald-700' :
                                                    p.dignity === 'Debilitated' ? 'bg-red-100 text-red-700' :
                                                        p.dignity === 'Own Sign' ? 'bg-blue-100 text-blue-700' :
                                                            p.dignity === 'Moolatrikona' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-amber-100 text-amber-700'
                                            )}>
                                                {p.dignity}
                                            </span>
                                        </td>
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
