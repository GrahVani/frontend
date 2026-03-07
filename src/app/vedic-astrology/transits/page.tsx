"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ShieldAlert, Loader2, Calendar, Info } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { captureException } from '@/lib/monitoring';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { ChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import { clientApi } from '@/lib/api';
import { parseChartData, signNameToId, signIdToName } from '@/lib/chart-helpers';
import { mapChartToTransits, PLANET_SYMBOLS } from '@/lib/transit-helpers';
import DailyTransitView from '@/components/transits/DailyTransitView';

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
                                                                <span className="text-base text-primary/70">{PLANET_SYMBOLS[row.planet] || '\u25CF'}</span>
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

                                    {/* Legend */}
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
