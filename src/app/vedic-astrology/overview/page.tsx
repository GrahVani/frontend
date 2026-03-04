"use client";

import React, { useEffect, useState } from 'react';
import { ChartWithPopup } from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import { useDasha } from "@/hooks/queries/useCalculations";
import {
    Maximize2,
    TrendingUp,
    ArrowRight,
    Loader2,
    Calendar,
    Clock,
    MapPin,
    Sparkle,
    X,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DashaResponse } from '@/lib/api';
import DoshaAnalysis from '@/components/astrology/DoshaAnalysis';
import YogaAnalysisView from '@/components/astrology/YogaAnalysis';
import PlanetaryTable from '@/components/astrology/PlanetaryTable';
import { parseChartData, signIdToName, type ProcessedChartData } from '@/lib/chart-helpers';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';
import BirthPanchanga from '@/components/astrology/BirthPanchanga';
import { TYPOGRAPHY } from '@/design-tokens/typography';

// Helper for formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
        if (timeStr.includes('T')) {
            const timePart = timeStr.split('T')[1];
            const cleanTime = timePart.replace('Z', '').split('+')[0].split('.')[0];
            const [hours, minutes] = cleanTime.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${ampm}`;
        }
        const date = new Date(`1970-01-01T${timeStr}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        return timeStr;
    } catch (e) {
        return timeStr;
    }
};

export default function VedicOverviewPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts, refreshCharts, isGeneratingCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [zoomedChart, setZoomedChart] = React.useState<{ varga: string, label: string } | null>(null);
    const [dashaData, setDashaData] = useState<DashaResponse | null>(null);
    const [analysisModal, setAnalysisModal] = useState<{ type: 'yoga' | 'dosha', subType: string, label: string } | null>(null);


    const activeSystem = settings.ayanamsa.toLowerCase();

    // Dasha Query
    const { data: dashaDataVal, isLoading: dashaLoading } = useDasha(
        clientDetails?.id || '',
        'mahadasha',
        settings.ayanamsa.toLowerCase()
    );

    useEffect(() => {
        if (dashaDataVal) setDashaData(dashaDataVal);
    }, [dashaDataVal]);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, settings.ayanamsa]);

    // Memoize chart data transformations
    const d1Data = React.useMemo(() => parseChartData(processedCharts[`D1_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d9Data = React.useMemo(() => parseChartData(processedCharts[`D9_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d10Data = React.useMemo(() => parseChartData(processedCharts[`D10_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d60Data = React.useMemo(() => parseChartData(processedCharts[`D60_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);

    const zoomedData = React.useMemo(() => {
        if (!zoomedChart) return { planets: [], ascendant: 1 };
        const key = `${zoomedChart.varga}_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [zoomedChart, processedCharts, activeSystem]);

    // Prepare Planetary Data for Table
    const planetaryTableData = React.useMemo(() => {
        return d1Data.planets.filter(p => p.name !== 'As').map(p => ({
            planet: p.name,
            sign: signIdToName[p.signId] || '-',
            degree: p.degree,
            nakshatra: p.nakshatra || '-',
            nakshatraPart: p.pada ? (typeof p.pada === 'number' ? p.pada : parseInt(String(p.pada).replace('Pada ', ''))) : undefined,
            house: p.house || 0,
            isRetro: p.isRetro
        }));
    }, [d1Data]);

    const isLoading = isGeneratingCharts || (isLoadingCharts && Object.keys(processedCharts).length === 0);

    const analysisItems = React.useMemo(() => {
        return Object.values(processedCharts)
            .filter((c: Record<string, unknown>) => (c.chartType as string)?.startsWith('yoga_') || (c.chartType as string)?.startsWith('dosha_') || c.chartType === 'sade_sati' || c.chartType === 'dhaiya')
            .map((c: Record<string, unknown>) => {
                const chartType = c.chartType as string;
                const isYoga = chartType.startsWith('yoga_');
                // Normalize type for display and modal
                let subType = chartType;
                if (subType.startsWith('yoga_')) subType = subType.replace('yoga_', '');
                if (subType.startsWith('dosha_')) subType = subType.replace('dosha_', '');

                const label = subType.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

                return {
                    name: label,
                    subType: subType,
                    type: isYoga ? 'yoga' : 'dosha'
                };
            });
    }, [processedCharts]);

    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData;

    return (
        <div className="p-0 w-full min-h-screen animate-in fade-in duration-500">
            {/* Header / Client Context - Removed and moved to Profile Card */}
            {isLoading && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gold-primary/90 text-white rounded-full font-sans text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing Chart...
                </div>
            )}

            <div className="grid grid-cols-12 gap-2">
                {/* LEFT COLUMN: D1 & Planetary Details */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-2">
                    {/* D1 Chart Window */}
                    <div className="border border-border-warm rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm flex justify-between items-center">
                            <h3 className={TYPOGRAPHY.sectionTitle}>Birth Chart (D1)</h3>
                            <button onClick={() => setZoomedChart({ varga: "D1", label: "Birth Chart (D1)" })} className="text-primary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                        </div>
                        <div className="w-full h-[380px] bg-surface-warm">
                            <ChartWithPopup
                                ascendantSign={d1Data.ascendant}
                                planets={d1Data.planets}
                                className="bg-transparent border-none w-full h-full"
                                preserveAspectRatio="none"
                                showDegrees={true}
                            />
                        </div>
                    </div>

                    {/* Planetary Details Window */}
                    <div className="border border-border-warm rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm">
                            <h3 className={TYPOGRAPHY.sectionTitle}>Birth Planetary Positions</h3>
                        </div>
                        <div className="overflow-x-auto text-[10px] md:text-xs bg-surface-warm">
                            <PlanetaryTable
                                planets={planetaryTableData}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Divisional Charts, Dasha, Profile */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-2">

                    {/* Client Identity Bar */}
                    {clientDetails && (
                        <div className="border border-border-warm rounded-lg overflow-hidden shadow-sm bg-surface-warm">
                            <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm">
                                <h3 className={TYPOGRAPHY.sectionTitle}>Client Profile</h3>
                            </div>
                            <div className="px-3 py-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                {/* Name & Details */}
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-lg bg-gold-primary flex items-center justify-center text-white shrink-0 shadow-sm", TYPOGRAPHY.value)}>
                                        {clientDetails.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={TYPOGRAPHY.profileName}>{clientDetails.name}</div>
                                        <div className={cn(TYPOGRAPHY.profileDetail, "flex flex-wrap gap-x-2 mt-1")}>
                                            <span>{formatDate(clientDetails.dateOfBirth)}</span>
                                            <span className="text-primary opacity-60">•</span>
                                            <span>{formatTime(clientDetails.timeOfBirth)}</span>
                                            <span className="text-primary opacity-60">•</span>
                                            <span className="truncate max-w-[250px]">{clientDetails.placeOfBirth.city}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lagna / Moon / Sun — inline chips */}
                                <div className="flex items-center gap-1.5 ml-auto">
                                    <div className="bg-softwhite px-2.5 py-1 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors flex items-center gap-1.5">
                                        <span className={TYPOGRAPHY.badgeLabel}>Lagna :</span>
                                        <span className={cn(TYPOGRAPHY.badgeValue, "group-hover:text-accent-gold transition-colors")}>{signIdToName[(d1Data.ascendant || 1) as number]}</span>
                                    </div>
                                    <div className="bg-softwhite px-2.5 py-1 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors flex items-center gap-1.5">
                                        <span className={TYPOGRAPHY.badgeLabel}>Moon :</span>
                                        <span className={cn(TYPOGRAPHY.badgeValue, "group-hover:text-accent-gold transition-colors")}>{
                                            d1Data.planets.find(p => p.name === "Mo")
                                                ? signIdToName[d1Data.planets.find(p => p.name === "Mo")!.signId]
                                                : "-"
                                        }</span>
                                    </div>
                                    <div className="bg-softwhite px-2.5 py-1 rounded-lg border border-antique/30 shadow-sm group hover:border-gold-primary/30 transition-colors flex items-center gap-1.5">
                                        <span className={TYPOGRAPHY.badgeLabel}>Sun :</span>
                                        <span className={cn(TYPOGRAPHY.badgeValue, "group-hover:text-accent-gold transition-colors")}>{
                                            d1Data.planets.find(p => p.name === "Su")
                                                ? signIdToName[d1Data.planets.find(p => p.name === "Su")!.signId]
                                                : "-"
                                        }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Panchanga & Dasha side-by-side */}
                    <div className="grid grid-cols-12 gap-2">
                        {/* Birth Panchanga Card */}
                        <div className="col-span-12 md:col-span-5 lg:col-span-4 border border-border-warm rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                            <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm flex items-center gap-1.5">
                                <Sparkle className="w-3 h-3 text-accent-gold" />
                                <h3 className={TYPOGRAPHY.sectionTitle}>Birth Panchanga</h3>
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between gap-2">
                                <BirthPanchanga data={birthPanchangaData} />
                                <Link
                                    href="/vedic-astrology/panchanga"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-header-border to-amber-700 text-white text-[11px] font-bold tracking-wide shadow-md hover:shadow-lg hover:from-amber-600 hover:to-amber-800 active:scale-[0.98] transition-all"
                                >
                                    <Sparkle className="w-3 h-3" />
                                    View Full Panchanga Overview
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Vimshottari Dasha */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 border border-border-warm rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                            <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm">
                                <h3 className={TYPOGRAPHY.sectionTitle}>Vimshottari Dasha</h3>
                            </div>
                            <div className="p-0">
                                <VimshottariTreeGrid
                                    data={dashaData ? processDashaResponse(dashaData as unknown as RawDashaPeriod).slice(0, 9) : []}
                                    isLoading={dashaLoading}
                                    className="border-none shadow-none rounded-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: D9 & D10 */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* D9 Navamsha */}
                        <div className="border border-border-warm rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm flex justify-between items-center">
                                <h3 className={TYPOGRAPHY.sectionTitle}>Navamsha (D9)</h3>
                                <button onClick={() => setZoomedChart({ varga: "D9", label: "Navamsha (D9)" })} className="text-primary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                            </div>
                            <div className="w-full h-[320px] bg-surface-warm">
                                {d9Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d9Data.ascendant} planets={d9Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" showDegrees={false} />
                                ) : <div className={cn(TYPOGRAPHY.subValue, "p-2")}>Loading...</div>}
                            </div>
                        </div>

                        {/* D10 Dashamsha */}
                        <div className="border border-border-warm rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-border-warm px-3 py-1.5 border-b border-border-warm flex justify-between items-center">
                                <h3 className={TYPOGRAPHY.sectionTitle}>Dashamsha (D10)</h3>
                                <button onClick={() => setZoomedChart({ varga: "D10", label: "Dashamsha (D10)" })} className="text-primary hover:text-accent-gold transition-colors"><Maximize2 className="w-3 h-3" /></button>
                            </div>
                            <div className="w-full h-[320px] bg-surface-warm">
                                {d10Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d10Data.ascendant} planets={d10Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" showDegrees={false} />
                                ) : <div className={cn(TYPOGRAPHY.subValue, "p-2")}>Loading...</div>}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Modal for Zoom */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-softwhite border border-antique rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button onClick={() => setZoomedChart(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-parchment text-primary hover:bg-gold-primary/20 hover:text-accent-gold transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className={TYPOGRAPHY.sectionTitle}>{zoomedChart.label}</h2>
                            <p className={TYPOGRAPHY.label}>{zoomedChart.varga} Divisional Chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto rounded-2xl p-6 border border-antique">
                            <ChartWithPopup ascendantSign={zoomedData.ascendant} planets={zoomedData.planets} className="bg-transparent border-none" showDegrees={zoomedChart?.varga === 'D1'} />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS MODAL */}
            {analysisModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/60 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-parchment border border-antique rounded-[2.5rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar border-b-8 border-gold-primary">
                        <button onClick={() => setAnalysisModal(null)} className="absolute top-6 right-6 p-2 rounded-2xl bg-white border border-antique text-primary hover:bg-red-50 hover:text-red-500 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="mb-8">
                            <h2 className={TYPOGRAPHY.sectionTitle}>{analysisModal.label}</h2>
                        </div>
                        {analysisModal.type === 'yoga' ? (
                            <YogaAnalysisView clientId={clientDetails?.id || ""} yogaType={analysisModal.subType} ayanamsa={settings.ayanamsa} />
                        ) : (
                            <DoshaAnalysis clientId={clientDetails?.id || ""} doshaType={analysisModal.subType} ayanamsa={settings.ayanamsa} />
                        )}
                    </div>
                </div>
            )}



        </div>
    );
}

// Sub-components

function SmallChartCard({ varga, label, data, onZoom }: { varga: string, label: string, data: ProcessedChartData, onZoom: () => void }) {
    return (
        <div className="flex flex-col items-center transition-colors cursor-pointer group" onClick={onZoom}>
            <div className="w-full aspect-square mb-2 relative overflow-hidden flex items-center justify-center">
                {data.planets.length > 0 ? (
                    <ChartWithPopup ascendantSign={data.ascendant} planets={data.planets} className="bg-transparent border-none scale-[0.8] origin-center" />
                ) : (
                    <div className={cn(TYPOGRAPHY.subValue, "italic")}>loading...</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-4 h-4 text-primary" />
                </div>
            </div>
            <span className={TYPOGRAPHY.value}>{varga}</span>
            <span className={TYPOGRAPHY.subValue}>{label}</span>
        </div>
    );
}

function ProfileItem({ label, value, sub, highlight }: { label: string, value: string, sub?: string, highlight?: boolean }) {
    return (
        <div className={cn("p-3 rounded-xl border transition-colors", highlight ? "bg-gold-primary/5 border-gold-primary/30" : "bg-softwhite border-antique/50 hover:border-gold-primary/20 hidden-scrollbar")}>
            <div className={TYPOGRAPHY.label}>{label}</div>
            <div className={cn(TYPOGRAPHY.value, highlight ? "text-accent-gold" : "")}>{value}</div>
            {sub && <div className={cn(TYPOGRAPHY.subValue, "italic")}>{sub}</div>}
        </div>
    );
}

const DashaRow = ({ planet, start, ends, duration, active }: { planet: string, start: string, ends: string, duration: string, active?: boolean }) => {
    return (
        <div className={cn("grid grid-cols-4 gap-2 p-3 rounded-xl border items-center text-center", active ? "bg-gold-primary/10 border-gold-primary/30" : "bg-parchment border-antique/30")}>
            <span className={cn(TYPOGRAPHY.planetName, "text-left pl-2")}>{planet}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{start}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{ends}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{duration}</span>
        </div>
    );
};

