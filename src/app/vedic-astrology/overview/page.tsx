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
import { parseChartData, signIdToName, fullPlanetNames, type ProcessedChartData } from '@/lib/chart-helpers';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';
import BirthPanchanga, { type BirthPanchangaData } from '@/components/astrology/BirthPanchanga';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';

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

    useEffect(() => {
        if (!zoomedChart && !analysisModal) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (analysisModal) setAnalysisModal(null);
                else if (zoomedChart) setZoomedChart(null);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [zoomedChart, analysisModal]);

    const activeSystem = settings.ayanamsa.toLowerCase();

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

    const d1Data = React.useMemo(() => parseChartData(processedCharts[`D1_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d9Data = React.useMemo(() => parseChartData(processedCharts[`D9_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d10Data = React.useMemo(() => parseChartData(processedCharts[`D10_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);
    const d60Data = React.useMemo(() => parseChartData(processedCharts[`D60_${activeSystem}`]?.chartData), [processedCharts, activeSystem]);

    const zoomedData = React.useMemo(() => {
        if (!zoomedChart) return { planets: [], ascendant: 1 };
        const key = `${zoomedChart.varga}_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [zoomedChart, processedCharts, activeSystem]);

    const planetaryTableData = React.useMemo(() => {
        return d1Data.planets.map(p => ({
            planet: fullPlanetNames[p.name] || p.name,
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

    const birthPanchangaData = (processedCharts['birth_panchanga_universal']?.chartData ?? null) as unknown as BirthPanchangaData | null;

    return (
        <div className="p-0 w-full min-h-screen animate-in fade-in duration-500">
            {isLoading && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold text-white tracking-wide shadow-lg animate-in fade-in slide-in-from-top-2"
                     style={{
                         background: 'linear-gradient(135deg, rgba(201,162,77,0.95) 0%, rgba(180,140,60,0.95) 100%)',
                         boxShadow: '0 4px 12px rgba(201,162,77,0.30)',
                     }}>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing chart...
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* LEFT COLUMN: D1 & Planetary Details */}
                <div className="md:col-span-5 flex flex-col gap-2">
                    {/* D1 Chart Window */}
                    <div className="prem-card overflow-hidden">
                        <div className="px-3 py-1.5 flex justify-between items-center"
                             style={{
                                 background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                 borderBottom: '1px solid rgba(220,201,166,0.25)',
                             }}>
                            <h2 className={TYPOGRAPHY.sectionTitle}>Birth chart (D1)</h2>
                            <button onClick={() => setZoomedChart({ varga: "D1", label: "Birth Chart (D1)" })} className="text-ink/40 hover:text-gold-dark transition-colors"><Maximize2 className="w-3 h-3" /></button>
                        </div>
                        <div className="w-full min-h-[300px] h-[50vh] max-h-[500px] bg-surface-warm">
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
                    <div className="prem-card overflow-hidden">
                        <div className="px-3 py-1.5"
                             style={{
                                 background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                 borderBottom: '1px solid rgba(220,201,166,0.25)',
                             }}>
                            <h2 className={TYPOGRAPHY.sectionTitle}>Birth planetary positions</h2>
                        </div>
                        <div className="bg-surface-warm">
                            <PlanetaryTable
                                planets={planetaryTableData}
                                variant="compact"
                                rowClassName="py-1"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Divisional Charts, Dasha, Profile */}
                <div className="md:col-span-7 flex flex-col gap-2">

                    {/* Client Identity Bar */}
                    {clientDetails && (
                        <div className="prem-card overflow-hidden">
                            <div className="px-3 py-1.5"
                                 style={{
                                     background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                     borderBottom: '1px solid rgba(220,201,166,0.25)',
                                 }}>
                                <h2 className={TYPOGRAPHY.sectionTitle}>Client profile</h2>
                            </div>
                            <div className="px-3 py-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0"
                                         style={{
                                             background: 'linear-gradient(135deg, rgba(201,162,77,0.90) 0%, rgba(139,90,43,0.85) 100%)',
                                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(139,90,43,0.15)',
                                         }}>
                                        <span className={TYPOGRAPHY.value}>{clientDetails.name.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className={TYPOGRAPHY.profileName}>{clientDetails.name}</div>
                                        <div className={cn(TYPOGRAPHY.profileDetail, "flex flex-wrap gap-x-2 mt-1 !font-serif")}>
                                            <span className="!font-serif">{formatDate(clientDetails.dateOfBirth)}</span>
                                            <span className="text-ink/30">•</span>
                                            <span className="!font-serif">{formatTime(clientDetails.timeOfBirth)}</span>
                                            <span className="text-ink/30">•</span>
                                            <span className="truncate max-w-[250px] !font-serif" title={clientDetails.placeOfBirth.city}>{clientDetails.placeOfBirth.city}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lagna / Moon / Sun — inline chips */}
                                <div className="flex items-center gap-1.5 ml-auto">
                                    {[
                                        { label: 'Lagna', value: signIdToName[(d1Data.ascendant || 1) as number] },
                                        { label: 'Moon', value: d1Data.planets.find(p => p.name === "Mo") ? signIdToName[d1Data.planets.find(p => p.name === "Mo")!.signId] : "-" },
                                        { label: 'Sun', value: d1Data.planets.find(p => p.name === "Su") ? signIdToName[d1Data.planets.find(p => p.name === "Su")!.signId] : "-" },
                                    ].map((chip) => (
                                        <div key={chip.label}
                                             className="px-2.5 py-1 rounded-lg group hover:border-gold-primary/30 transition-colors flex items-center gap-1.5"
                                             style={{
                                                 background: 'rgba(255,253,249,0.70)',
                                                 border: '1px solid rgba(220,201,166,0.25)',
                                                 boxShadow: '0 1px 3px rgba(62,46,22,0.04)',
                                             }}>
                                            <span className={TYPOGRAPHY.badgeLabel}>{chip.label} :</span>
                                            <span className={cn(TYPOGRAPHY.badgeValue, "group-hover:text-gold-dark transition-colors")}>{chip.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Panchanga & Dasha side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                        {/* Birth Panchanga Card */}
                        <div className="col-span-12 md:col-span-5 lg:col-span-4 prem-card overflow-hidden flex flex-col">
                            <div className="px-3 py-1.5 flex items-center gap-1.5"
                                 style={{
                                     background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                     borderBottom: '1px solid rgba(220,201,166,0.25)',
                                 }}>
                                <Sparkle className="w-3 h-3 text-gold-dark" />
                                <h2 className={TYPOGRAPHY.sectionTitle}>Birth panchanga</h2>
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between gap-2 bg-surface-warm">
                                <BirthPanchanga data={birthPanchangaData} />
                                <Link
                                    href="/vedic-astrology/panchanga"
                                    className={cn(TYPOGRAPHY.label, "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl !text-white !text-[11px] !font-bold tracking-wide shadow-md active:scale-[0.98] transition-all !mb-0", COLORS.premiumGradient, COLORS.premiumGradientHover)}
                                >
                                    <Sparkle className="w-3 h-3" />
                                    View full panchanga
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Vimshottari Dasha */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 prem-card overflow-hidden flex flex-col">
                            <div className="px-3 py-1.5"
                                 style={{
                                     background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                     borderBottom: '1px solid rgba(220,201,166,0.25)',
                                 }}>
                                <h2 className={TYPOGRAPHY.sectionTitle}>Vimshottari dasha</h2>
                            </div>
                            <div className="p-0 bg-surface-warm">
                                <VimshottariTreeGrid
                                    data={dashaData ? processDashaResponse(dashaData as unknown as RawDashaPeriod).slice(0, 9) : []}
                                    isLoading={dashaLoading}
                                    className="border-none shadow-none rounded-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: D9 & D10 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* D9 Navamsha */}
                        <div className="prem-card overflow-hidden">
                            <div className="px-3 py-1.5 flex justify-between items-center"
                                 style={{
                                     background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                     borderBottom: '1px solid rgba(220,201,166,0.25)',
                                 }}>
                                <h2 className={TYPOGRAPHY.sectionTitle}>Navamsha (D9)</h2>
                                <button onClick={() => setZoomedChart({ varga: "D9", label: "Navamsha (D9)" })} className="p-1.5 text-ink/40 hover:text-gold-dark transition-colors" aria-label="Zoom Navamsha D9 chart"><Maximize2 className="w-4 h-4" /></button>
                            </div>
                            <div className="w-full min-h-[250px] h-[40vh] max-h-[400px] bg-surface-warm">
                                {d9Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d9Data.ascendant} planets={d9Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" showDegrees={false} />
                                ) : <div className={cn(TYPOGRAPHY.subValue, "p-2 text-ink/35 italic")}>No D9 chart data available</div>}
                            </div>
                        </div>

                        {/* D10 Dashamsha */}
                        <div className="prem-card overflow-hidden">
                            <div className="px-3 py-1.5 flex justify-between items-center"
                                 style={{
                                     background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
                                     borderBottom: '1px solid rgba(220,201,166,0.25)',
                                 }}>
                                <h2 className={TYPOGRAPHY.sectionTitle}>Dashamsha (D10)</h2>
                                <button onClick={() => setZoomedChart({ varga: "D10", label: "Dashamsha (D10)" })} className="p-1.5 text-ink/40 hover:text-gold-dark transition-colors" aria-label="Zoom Dashamsha D10 chart"><Maximize2 className="w-4 h-4" /></button>
                            </div>
                            <div className="w-full min-h-[250px] h-[40vh] max-h-[400px] bg-surface-warm">
                                {d10Data.planets.length > 0 ? (
                                    <ChartWithPopup ascendantSign={d10Data.ascendant} planets={d10Data.planets} className="bg-transparent border-none w-full h-full" preserveAspectRatio="none" showDegrees={false} />
                                ) : <div className={cn(TYPOGRAPHY.subValue, "p-2 text-ink/35 italic")}>No D10 chart data available</div>}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Modal for Zoom */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300" role="dialog" aria-modal="true" aria-label={zoomedChart.label}>
                    <div className="max-w-2xl w-full relative rounded-3xl p-8"
                         style={{
                             background: 'linear-gradient(165deg, rgba(255,253,249,0.95) 0%, rgba(250,245,234,0.92) 50%, rgba(255,253,249,0.93) 100%)',
                             border: '1px solid rgba(220,201,166,0.35)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 25px 60px rgba(62,46,22,0.20), 0 8px 24px rgba(62,46,22,0.10)',
                             backdropFilter: 'blur(20px)',
                         }}>
                        <button onClick={() => setZoomedChart(null)} aria-label="Close zoomed chart"
                                className="absolute top-4 right-4 p-2 rounded-xl text-ink/40 hover:text-gold-dark transition-all"
                                style={{
                                    background: 'rgba(250,245,234,0.60)',
                                    border: '1px solid rgba(220,201,166,0.25)',
                                }}>
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className="text-[17px] font-serif font-bold text-ink">{zoomedChart.label}</h2>
                            <p className="text-[12px] text-ink/45 font-medium mt-0.5">{zoomedChart.varga} divisional chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto rounded-2xl p-6"
                             style={{ border: '1px solid rgba(220,201,166,0.25)' }}>
                            <ChartWithPopup ascendantSign={zoomedData.ascendant} planets={zoomedData.planets} className="bg-transparent border-none" showDegrees={zoomedChart?.varga === 'D1'} />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS MODAL */}
            {analysisModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300" role="dialog" aria-modal="true" aria-label={analysisModal.label}>
                    <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto relative rounded-3xl p-8 custom-scrollbar"
                         style={{
                             background: 'linear-gradient(165deg, rgba(255,253,249,0.95) 0%, rgba(250,245,234,0.92) 50%, rgba(255,253,249,0.93) 100%)',
                             border: '1px solid rgba(220,201,166,0.35)',
                             borderBottom: '4px solid rgba(201,162,77,0.60)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 25px 60px rgba(62,46,22,0.22), 0 8px 24px rgba(62,46,22,0.12)',
                             backdropFilter: 'blur(20px)',
                         }}>
                        <button onClick={() => setAnalysisModal(null)} aria-label="Close analysis"
                                className="absolute top-6 right-6 p-2 rounded-2xl text-ink/40 hover:text-status-error transition-all"
                                style={{
                                    background: 'rgba(255,253,249,0.80)',
                                    border: '1px solid rgba(220,201,166,0.30)',
                                }}>
                            <X className="w-6 h-6" />
                        </button>
                        <div className="mb-8">
                            <h2 className="text-[18px] font-serif font-bold text-ink">{analysisModal.label}</h2>
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
        <div
            className="flex flex-col items-center transition-colors cursor-pointer group"
            onClick={onZoom}
            role="button"
            tabIndex={0}
            aria-label={`Zoom ${varga} ${label} chart`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onZoom(); } }}
        >
            <div className="w-full aspect-square mb-2 relative overflow-hidden flex items-center justify-center">
                {data.planets.length > 0 ? (
                    <ChartWithPopup ascendantSign={data.ascendant} planets={data.planets} className="bg-transparent border-none scale-[0.8] origin-center" />
                ) : (
                    <div className={cn(TYPOGRAPHY.subValue, "italic text-ink/35")}>loading...</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-4 h-4 text-ink/50" />
                </div>
            </div>
            <span className={cn(TYPOGRAPHY.value, "!mt-0")}>{varga}</span>
            <span className={cn(TYPOGRAPHY.subValue, "!mt-0")}>{label}</span>
        </div>
    );
}

function ProfileItem({ label, value, sub, highlight }: { label: string, value: string, sub?: string, highlight?: boolean }) {
    return (
        <div className={cn("p-3 rounded-xl transition-colors", highlight ? "hidden-scrollbar" : "hover:border-gold-primary/20 hidden-scrollbar")}
             style={{
                 background: highlight
                     ? 'linear-gradient(135deg, rgba(201,162,77,0.08) 0%, rgba(201,162,77,0.03) 100%)'
                     : 'rgba(255,253,249,0.65)',
                 border: highlight
                     ? '1px solid rgba(201,162,77,0.30)'
                     : '1px solid rgba(220,201,166,0.25)',
             }}>
            <div className={TYPOGRAPHY.label}>{label}</div>
            <div className={cn(TYPOGRAPHY.value, highlight ? "text-gold-dark" : "")}>{value}</div>
            {sub && <div className={cn(TYPOGRAPHY.subValue, "italic")}>{sub}</div>}
        </div>
    );
}

const DashaRow = ({ planet, start, ends, duration, active }: { planet: string, start: string, ends: string, duration: string, active?: boolean }) => {
    return (
        <div className={cn("grid grid-cols-4 gap-2 p-3 rounded-xl items-center text-center")}
             style={{
                 background: active
                     ? 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 100%)'
                     : 'rgba(250,245,234,0.50)',
                 border: active
                     ? '1px solid rgba(201,162,77,0.30)'
                     : '1px solid rgba(220,201,166,0.20)',
             }}>
            <span className={cn(TYPOGRAPHY.planetName, "text-left pl-2")}>{planet}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{start}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{ends}</span>
            <span className={TYPOGRAPHY.dateAndDuration}>{duration}</span>
        </div>
    );
};
