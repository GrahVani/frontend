"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Loader2, Calendar, Info } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { captureException } from '@/lib/monitoring';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';

import { ChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import { clientApi } from '@/lib/api';
import { parseChartData, signNameToId, signIdToName } from '@/lib/chart-helpers';
import { mapChartToTransits, PLANET_SYMBOLS } from '@/lib/transit-helpers';
import { PLANET_COLORS } from '@/design-tokens/colors';
import DailyTransitView from '@/components/transits/DailyTransitView';

type GocharTab = 'gochar' | 'daily_transit';

export default function TransitsPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts, openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const activeSystem = settings.ayanamsa.toLowerCase();
    const isLahiri = activeSystem === 'lahiri';
    const [activeTab, setActiveTab] = useState<GocharTab>(isLahiri ? 'daily_transit' : 'gochar');
    const [liveTransitChart, setLiveTransitChart] = useState<Record<string, unknown> | null>(null);
    const [isLiveLoading, setIsLiveLoading] = useState(false);

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
        } catch (err) {
            captureException(err, { tags: { section: 'transits', action: 'generate-chart' } });
        } finally {
            setIsLiveLoading(false);
        }
    }, [clientDetails?.id, activeSystem]);

    useEffect(() => {
        setLiveTransitChart(null);
        if (activeTab === 'gochar') {
            fetchLiveTransit();
        }
    }, [activeSystem, clientDetails?.id, activeTab, fetchLiveTransit]);

    const { transitData, natalAscendant, transitPlanets } = React.useMemo(() => {
        const d1Key = `D1_${activeSystem}`;
        const d1Chart = processedCharts[d1Key];
        const transitChart = liveTransitChart || processedCharts[`transit_${activeSystem}`];
        if (!transitChart?.chartData) {
            return { transitData: [], natalAscendant: 1, transitPlanets: [] };
        }

        const transit = transitChart.chartData;

        let ascSign: number;
        if (d1Chart?.chartData) {
            const natalParsed = parseChartData(d1Chart.chartData);
            ascSign = natalParsed.ascendant;
        } else {
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


    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-[20px] text-amber-800">Please select a client to view transit analysis</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 -mx-4 -mt-4 px-4 pb-6 pt-0">
            {/* Page Heading + Tab Switcher */}
            <div className={cn("sticky z-30 bg-amber-50/95 backdrop-blur-sm py-3 border-b border-amber-200/30 mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4", hasClientBar ? "top-36" : "top-[104px]")}>
                <div>
                    <h1 className="text-[28px] font-bold text-amber-900">Transit Analysis</h1>
                    <p className="text-[16px] text-amber-600 mt-1">Current planetary positions and their influences</p>
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

                {/* Tab Switcher — Right Side Top */}
                <div className="inline-flex items-center gap-1 bg-white rounded-xl p-1 border border-amber-200/60 shadow-sm shrink-0 self-start sm:mt-2">
                {isLahiri && (
                    <button
                        onClick={() => setActiveTab('daily_transit')}
                        className={cn(
                            "px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-[13px] font-bold",
                            activeTab === 'daily_transit'
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : "text-amber-500 hover:text-amber-700 hover:bg-amber-50/50"
                        )}
                    >
                        Daily Transit
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('gochar')}
                    className={cn(
                        "px-4 py-2 rounded-lg transition-all whitespace-nowrap text-[13px] font-bold",
                        activeTab === 'gochar'
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "text-amber-500 hover:text-amber-700 hover:bg-amber-50/50"
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
                            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
                            <p className="font-serif text-amber-800">Calculating transit positions...</p>
                        </div>
                    )}

                    {!isLiveLoading && !isLoadingCharts && transitData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Info className="w-12 h-12 text-amber-400 mb-3" />
                            <p className="font-serif text-amber-900 text-[18px] mb-2">Transit data unavailable</p>
                            <p className="text-[14px] text-amber-600 mb-4">Charts are being generated for this client</p>
                            <button
                                onClick={refreshCharts}
                                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 shadow-sm"
                            >
                                Refresh
                            </button>
                        </div>
                    )}

                    {transitData.length > 0 && (
                        <>
                            {/* Alert Cards */}
                            {retroPlanets.length > 0 && (
                                <div className="bg-white border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3 shadow-sm max-w-xl">
                                    <div className="p-2 bg-red-50 rounded-xl text-red-600 border border-red-100">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 text-[16px]")}>Retrograde Alert</h3>
                                        <p className={cn(TYPOGRAPHY.subValue, "text-red-700 mt-1 whitespace-normal text-[13px]")}>
                                            {retroPlanets.map(p => p.planet).join(', ')} {retroPlanets.length === 1 ? 'is' : 'are'} currently retrograde.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Main Chart + Table */}
                            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                                <div className="lg:w-[440px] w-full flex flex-col border-r border-amber-200/50 shrink-0 bg-amber-50/30">
                                    <div className="px-4 py-3 border-b border-amber-200/50 flex items-center shrink-0 bg-amber-50/50">
                                        <h3 className="text-[15px] font-bold text-amber-900">Gochar Chart</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-start pt-0">
                                        <div className="w-full aspect-square -mt-3">
                                            <ChartWithPopup
                                                ascendantSign={natalAscendant}
                                                planets={transitPlanets}
                                                className="w-full h-full"
                                                showDegrees={false}
                                                planetFontSize={18}
                                                signNumberFontSize={18}
                                            />
                                        </div>
                                        <p className="text-[13px] text-amber-700 font-medium text-center mt-2 mb-3">
                                            Natal Ascendant: {signIdToName[natalAscendant]}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="px-4 py-3 border-b border-amber-200/50 flex justify-between items-center shrink-0 bg-amber-50/50">
                                        <h3 className="text-[15px] font-bold text-amber-900">Transit Positions</h3>
                                        <div className="flex items-center gap-1.5 text-amber-700 text-[12px] font-semibold">
                                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-white/60 custom-scrollbar">
                                        <table className="w-full border-collapse">
                                            <thead className="sticky top-0 bg-white border-b border-amber-200/60 z-10 shadow-sm">
                                                <tr>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left text-amber-800")}>Planet</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left text-amber-800")}>Sign</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left text-amber-800")}>Degree</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-left text-amber-800")}>Nakshatra</th>
                                                    <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-2 text-center text-amber-800")}>House</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-200/40 font-medium">
                                                {transitData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-amber-50/60 transition-colors group">
                                                        <td className="px-3 py-2">
                                                            <span className={cn(TYPOGRAPHY.planetName, "flex items-center gap-2 text-[18px]")}>
                                                                <span className="text-[20px]" style={{ color: PLANET_COLORS[row.planet]?.hex || '#B45309' }}>{PLANET_SYMBOLS[row.planet] || '\u25CF'}</span>
                                                                {row.planet}
                                                                {row.isRetro && (
                                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">R</span>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2 text-amber-700")}>{row.sign}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 font-mono text-[14px] text-amber-700")}>{row.degree}</td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2 font-medium text-amber-700")}>{row.nakshatra}</td>
                                                        <td className={cn(TYPOGRAPHY.value, "px-3 py-2 text-center text-[18px] text-amber-700")}>{row.house}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Legend */}
                                    <div className="mt-auto px-4 py-2 bg-amber-50/30 border-t border-amber-200/50 flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 shadow-sm">R</span>
                                                <span className="text-[11px] text-amber-700 font-semibold">Retrograde Motion</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <span className="text-[11px] text-amber-700 font-semibold">Strong Influence</span>
                                            </div>
                                        </div>
                                        <div className="text-amber-600 text-[10px] font-mono italic">
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
                            <p className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] mb-2")}>Lahiri System Required</p>
                            <p className={cn(TYPOGRAPHY.subValue, "text-[14px] whitespace-normal")}>
                                Daily Transit is currently available only for the <strong>Lahiri</strong> ayanamsa system.
                                <br />Switch to Lahiri in your settings to use this feature.
                            </p>
                        </div>
                    ) : clientDetails?.id ? (
                        <DailyTransitView clientId={clientDetails.id} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Info className="w-12 h-12 text-amber-400 mb-3" />
                            <p className={cn(TYPOGRAPHY.sectionTitle, "text-[18px]")}>Client ID required</p>
                            <p className={cn(TYPOGRAPHY.subValue, "text-[14px] mt-1")}>Please select a saved client to fetch daily transit data.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
