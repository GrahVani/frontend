"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChartWithPopup } from "@/components/astrology/NorthIndianChart";
import { cn } from "@/lib/utils";
import { useDasha } from "@/hooks/queries/useCalculations";
import { CHART_METADATA } from '@/lib/api';
const DivisionalChartZoomModal = dynamic(() => import('@/components/astrology/DivisionalChartZoomModal'));
const KundliAnalyticsPanel = dynamic(() => import('@/components/astrology/KundliAnalyticsPanel'));
const KpCuspalChartCard = dynamic(() => import('@/components/kp/KpKundliPanel').then(mod => ({ default: mod.KpCuspalChartCard })));
const KpPlanetaryTableCard = dynamic(() => import('@/components/kp/KpKundliPanel').then(mod => ({ default: mod.KpPlanetaryTableCard })));
const KpBhavaDetailsCard = dynamic(() => import('@/components/kp/KpKundliPanel').then(mod => ({ default: mod.KpBhavaDetailsCard })));
const KpFortunaCard = dynamic(() => import('@/components/kp/KpKundliPanel').then(mod => ({ default: mod.KpFortunaCard })));
import {
    Maximize2,
    TrendingUp,
    Loader2,
    Calendar,
    Clock,
    MapPin,
    Sparkle,
    X,
    LayoutDashboard,
    Star,
    Moon,
    Sun,
    Activity,
    Hexagon,
    Shield,
    Anchor,
    Feather,
    Disc,
    Zap,
    RefreshCcw,
    CalendarDays,
    Sunrise,
    Sunset,
    AlertTriangle,
    LayoutTemplate,
    Plus,
    Minus,
    Settings,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DashaResponse, clientApi } from '@/lib/api';
import DoshaAnalysis from '@/components/astrology/DoshaAnalysis';
import YogaAnalysisView from '@/components/astrology/YogaAnalysis';
import PlanetaryTable from '@/components/astrology/PlanetaryTable';
import { parseChartData, signIdToName, fullPlanetNames, type ProcessedChartData } from '@/lib/chart-helpers';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';
import BirthPanchanga, { type BirthPanchangaData } from '@/components/astrology/BirthPanchanga';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { KnowledgeTooltip } from '@/components/knowledge';
import { CHART_CATALOG } from '@/hooks/useCustomizeCharts';

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
            const [hours, minutes, seconds] = cleanTime.split(':');
            return seconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
        }
        const date = new Date(`1970-01-01T${timeStr}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        }
        return timeStr;
    } catch (e) {
        return timeStr;
    }
};

// Icon components for Avakhada items
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TypeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    );
}

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
    const zoomedData = React.useMemo(() => {
        if (!zoomedChart) return { planets: [], ascendant: 1 };
        const key = `${zoomedChart.varga}_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [zoomedChart, processedCharts, activeSystem]);

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

            <KundaliContent
                key={activeSystem}
                clientDetails={clientDetails}
                d1Data={d1Data}
                birthPanchangaData={birthPanchangaData}
                dashaData={dashaData}
                dashaLoading={dashaLoading}
                setZoomedChart={setZoomedChart}
            />

            {/* Modal for Zoom - Advanced Version */}
            {zoomedChart && (
                <DivisionalChartZoomModal
                    isOpen={!!zoomedChart}
                    onClose={() => setZoomedChart(null)}
                    chartType={zoomedChart.varga}
                    chartName={zoomedChart.label || CHART_METADATA[zoomedChart.varga]?.name || 'Chart'}
                    chartDesc={CHART_METADATA[zoomedChart.varga]?.desc || 'Divisional Chart'}
                    planets={zoomedData.planets}
                    ascendantSign={zoomedData.ascendant}
                    chartData={processedCharts[`${zoomedChart.varga}_${activeSystem}`]?.chartData || undefined}
                />
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

// ============================================================================
// Constants for Chart Slots
// ============================================================================
const KUNDALI_SLOTS_KEY = 'grahvani_kundali_chart_slots';
const KUNDALI_SETTINGS_KEY = 'grahvani_kundali_chart_settings';
const DEFAULT_SLOTS: (string | null)[] = ['D1', 'D9', 'D10'];

interface ChartSlotSettings {
    planetSize: number;
    houseSize: number;
    degreeSize: number;
    showDegrees: boolean;
}

const DEFAULT_CHART_SETTINGS: ChartSlotSettings = {
    planetSize: 14,
    houseSize: 18,
    degreeSize: 9,
    showDegrees: true
};
const PICKER_CATEGORIES = ['divisional', 'lagna', 'rare_shodash'];

const HEADER_STYLE = {
    background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
    borderBottom: '1px solid rgba(220,201,166,0.25)',
};

// ============================================================================
// Chart Picker Modal
// ============================================================================
function ChartPickerModal({
    onClose,
    onSelect,
    ayanamsa,
}: {
    onClose: () => void;
    onSelect: (chartId: string) => void;
    ayanamsa: string;
}) {
    const isLahiri = ayanamsa.toLowerCase() === 'lahiri';
    const filteredCharts = CHART_CATALOG.filter(chart => {
        if (!PICKER_CATEGORIES.includes(chart.category)) return false;
        if (!isLahiri && (chart.lahiriOnly || chart.category === 'rare_shodash')) return false;
        if (chart.requiredSystem && chart.requiredSystem !== ayanamsa.toLowerCase()) return false;
        return true;
    });

    const grouped = filteredCharts.reduce((acc, chart) => {
        const cat = chart.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(chart);
        return acc;
    }, {} as Record<string, typeof filteredCharts>);

    const categoryLabels: Record<string, string> = {
        'divisional': 'Divisional Charts',
        'lagna': 'Lagna Charts',
        'rare_shodash': 'Rare Shodash Varga',
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300"
            role="dialog" aria-modal="true" aria-label="Select a chart"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto relative rounded-3xl p-6 custom-scrollbar"
                style={{
                    background: 'linear-gradient(165deg, rgba(255,253,249,0.97) 0%, rgba(250,245,234,0.95) 50%, rgba(255,253,249,0.96) 100%)',
                    border: '1px solid rgba(220,201,166,0.35)',
                    borderBottom: '4px solid rgba(201,162,77,0.60)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 25px 60px rgba(62,46,22,0.22)',
                    backdropFilter: 'blur(20px)',
                }}>
                <button onClick={onClose} aria-label="Close chart picker"
                    className="absolute top-4 right-4 p-2 rounded-2xl text-ink/40 hover:text-status-error transition-all"
                    style={{
                        background: 'rgba(255,253,249,0.80)',
                        border: '1px solid rgba(220,201,166,0.30)',
                    }}>
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-[18px] font-serif font-bold text-ink mb-1">Select a Chart</h2>
                <p className={cn(TYPOGRAPHY.profileDetail, "mb-5")}>Choose a divisional or lagna chart to display</p>

                {Object.entries(grouped).map(([category, charts]) => (
                    <div key={category} className="mb-5">
                        <h3 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-widest mb-2 opacity-60")}>{categoryLabels[category] || category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {charts.map(chart => (
                                <button
                                    key={chart.id}
                                    onClick={() => onSelect(chart.id)}
                                    className="p-3 rounded-xl text-left transition-all hover:shadow-md group cursor-pointer"
                                    style={{
                                        background: 'rgba(255,253,249,0.70)',
                                        border: '1px solid rgba(220,201,166,0.25)',
                                    }}
                                >
                                    <div className={cn(TYPOGRAPHY.value, "text-[12px] group-hover:text-gold-dark transition-colors")}>{chart.name}</div>
                                    <div className={cn(TYPOGRAPHY.profileDetail, "text-[10px] mt-0.5 line-clamp-2")}>{chart.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Empty Chart Slot (Add Chart Placeholder)
// ============================================================================
function EmptyChartSlot({ height, onClick }: { height: string; onClick: () => void }) {
    return (
        <div className="prem-card overflow-hidden">
            <div
                className={cn("w-full flex flex-col items-center justify-center cursor-pointer group transition-all hover:bg-gold-primary/3", height)}
                onClick={onClick}
            >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all group-hover:scale-110"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,162,77,0.08) 0%, rgba(201,162,77,0.03) 100%)',
                        border: '1px solid rgba(220,201,166,0.25)',
                    }}>
                    <Plus className="w-5 h-5 text-gold-primary/40 group-hover:text-gold-primary/70 transition-colors" />
                </div>
                <span className={cn(TYPOGRAPHY.profileDetail, "text-[11px] text-ink/30 group-hover:text-ink/50 transition-colors")}>Add Chart</span>
            </div>
        </div>
    );
}

// ============================================================================
// Rendered Chart Slot (with X dismiss + Zoom)
// ============================================================================
function RenderedChartSlot({
    chartId,
    height,
    settings,
    onUpdateSettings,
    onZoom,
    onDismiss,
}: {
    chartId: string;
    height: string;
    settings: ChartSlotSettings;
    onUpdateSettings: (s: Partial<ChartSlotSettings>) => void;
    onZoom: () => void;
    onDismiss: () => void;
}) {
    const { processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const key = `${chartId}_${activeSystem}`;
    const data = React.useMemo(() => parseChartData(processedCharts[key]?.chartData), [processedCharts, key]);
    const meta = CHART_METADATA[chartId] || { name: chartId, desc: 'Chart' };
    const displayName = `${meta.name} (${chartId})`;

    useEffect(() => {
        if (!showSettings) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSettings]);

    return (
        <div className="prem-card overflow-hidden relative">
            <div className="px-3 py-1.5 flex justify-between items-center" style={HEADER_STYLE}>
                <h2 className={TYPOGRAPHY.sectionTitle}>{displayName}</h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={cn("p-1 transition-colors", showSettings ? "text-primary" : "text-primary/70 hover:text-primary")}
                        aria-label="Chart Settings"
                    >
                        <Settings className="w-3 h-3" />
                    </button>
                    <button onClick={onZoom} className="p-1 text-primary/70 hover:text-primary transition-colors" aria-label={`Zoom ${displayName}`}>
                        <Maximize2 className="w-3 h-3" />
                    </button>
                    {!(activeSystem === 'kp' && chartId === 'D1') && (
                        <button onClick={onDismiss} className="p-1 text-primary/50 hover:text-rose-500 transition-colors" aria-label={`Remove ${displayName}`}>
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {showSettings && (
                <div
                    ref={settingsRef}
                    className="absolute top-9 right-2 z-50 w-56 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        background: 'rgba(255, 253, 249, 0.98)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(220, 201, 166, 0.4)',
                        boxShadow: '0 10px 30px -5px rgba(62, 46, 22, 0.2), 0 4px 12px -2px rgba(62, 46, 22, 0.1)',
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={cn(TYPOGRAPHY.label, "text-[10px] opacity-60 uppercase tracking-wider")}>Planet Size</label>
                                <span className={cn(TYPOGRAPHY.value, "text-[11px] text-primary")}>{settings.planetSize ?? DEFAULT_CHART_SETTINGS.planetSize}px</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onUpdateSettings({ planetSize: Math.max(8, settings.planetSize - 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-primary/20 hover:border-primary/40 text-primary/80"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <input
                                    type="range" min="8" max="24" value={settings.planetSize ?? DEFAULT_CHART_SETTINGS.planetSize}
                                    onChange={(e) => onUpdateSettings({ planetSize: parseInt(e.target.value) })}
                                    className="flex-1 accent-primary h-1 bg-primary/10 rounded-full appearance-none cursor-pointer"
                                />
                                <button
                                    onClick={() => onUpdateSettings({ planetSize: Math.min(24, settings.planetSize + 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-gold-primary/10 hover:border-gold-primary/30 text-gold-primary/70"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={cn(TYPOGRAPHY.label, "text-[10px] opacity-60 uppercase tracking-wider")}>Degree Size</label>
                                <span className={cn(TYPOGRAPHY.value, "text-[11px] text-primary")}>{settings.degreeSize ?? DEFAULT_CHART_SETTINGS.degreeSize}px</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onUpdateSettings({ degreeSize: Math.max(6, settings.degreeSize - 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-gold-primary/10 hover:border-gold-primary/30 text-gold-primary/70"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <input
                                    type="range" min="6" max="18" value={settings.degreeSize ?? DEFAULT_CHART_SETTINGS.degreeSize}
                                    onChange={(e) => onUpdateSettings({ degreeSize: parseInt(e.target.value) })}
                                    className="flex-1 accent-gold-primary h-1 bg-gold-primary/10 rounded-full appearance-none cursor-pointer"
                                />
                                <button
                                    onClick={() => onUpdateSettings({ degreeSize: Math.min(18, settings.degreeSize + 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-gold-primary/10 hover:border-gold-primary/30 text-gold-primary/70"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={cn(TYPOGRAPHY.label, "text-[10px] opacity-60 uppercase tracking-wider")}>House Number Size</label>
                                <span className={cn(TYPOGRAPHY.value, "text-[11px] text-primary")}>{settings.houseSize ?? DEFAULT_CHART_SETTINGS.houseSize}px</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onUpdateSettings({ houseSize: Math.max(10, settings.houseSize - 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-gold-primary/10 hover:border-gold-primary/30 text-gold-primary/70"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <input
                                    type="range" min="10" max="40" value={settings.houseSize ?? DEFAULT_CHART_SETTINGS.houseSize}
                                    onChange={(e) => onUpdateSettings({ houseSize: parseInt(e.target.value) })}
                                    className="flex-1 accent-gold-primary h-1 bg-gold-primary/10 rounded-full appearance-none cursor-pointer"
                                />
                                <button
                                    onClick={() => onUpdateSettings({ houseSize: Math.min(40, settings.houseSize + 1) })}
                                    className="p-1 rounded-md bg-surface-warm border border-gold-primary/10 hover:border-gold-primary/30 text-gold-primary/70"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                            <label className={cn(TYPOGRAPHY.label, "text-[10px] opacity-60 uppercase tracking-wider")}>Show Degrees</label>
                            <button
                                onClick={() => onUpdateSettings({ showDegrees: !settings.showDegrees })}
                                className={cn(
                                    "w-8 h-4 rounded-full transition-colors relative",
                                    settings.showDegrees ? "bg-primary" : "bg-ink/20"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                                    settings.showDegrees ? "left-4.5" : "left-0.5"
                                )} style={{ left: settings.showDegrees ? '1.125rem' : '0.125rem' }} />
                            </button>
                        </div>

                        <button
                            onClick={() => onUpdateSettings(DEFAULT_CHART_SETTINGS)}
                            className="w-full mt-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-gold-primary/5 border border-gold-primary/20 text-gold-primary/60 hover:text-gold-primary/90"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,162,77,0.05) 0%, rgba(201,162,77,0.02) 100%)',
                            }}
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            )}

            <div className={cn("w-full bg-surface-warm", height)}>
                {data.planets.length > 0 ? (
                    <ChartWithPopup
                        ascendantSign={data.ascendant}
                        planets={data.planets}
                        className="bg-transparent border-none w-full h-full"
                        preserveAspectRatio="none"
                        showDegrees={settings.showDegrees}
                        planetFontSize={settings.planetSize}
                        degreeFontSize={settings.degreeSize}
                        signNumberFontSize={settings.houseSize}
                    />
                ) : (
                    <div className={cn(TYPOGRAPHY.subValue, "p-4 text-ink/35 italic flex items-center justify-center h-full")}>
                        No {meta.name} chart data available
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Kundali Tab Content
// ============================================================================
function KundaliContent({
    clientDetails,
    d1Data,
    birthPanchangaData,
    dashaData,
    dashaLoading,
    setZoomedChart
}: {
    clientDetails: any;
    d1Data: any;
    birthPanchangaData: BirthPanchangaData | null;
    dashaData: DashaResponse | null;
    dashaLoading: boolean;
    setZoomedChart: (chart: { varga: string, label: string } | null) => void;
}) {
    const { ayanamsa } = useAstrologerStore();
    const { processedCharts } = useVedicClient();
    const activeSystem = ayanamsa.toLowerCase();

    // ── Guard against cross-system overwrites during transitions ──
    const [mountSystem] = useState(activeSystem);

    // ── Chart Slots State (persisted to localStorage) ──
    const [chartSlots, setChartSlots] = useState<(string | null)[]>(() => {
        if (typeof window === 'undefined') return DEFAULT_SLOTS;
        const systemKey = `${KUNDALI_SLOTS_KEY}_${activeSystem}`;
        try {
            // Priority 1: System-specific layout (e.g. _lahiri)
            const storedSystem = localStorage.getItem(systemKey);
            if (storedSystem) {
                const parsed = JSON.parse(storedSystem);
                if (Array.isArray(parsed) && parsed.length === 3) return parsed;
            }
            // Priority 2: Global legacy layout (fallback for existing users)
            const storedGlobal = localStorage.getItem(KUNDALI_SLOTS_KEY);
            if (storedGlobal) {
                const parsed = JSON.parse(storedGlobal);
                if (Array.isArray(parsed) && parsed.length === 3) return parsed;
            }
        } catch { /* ignore */ }
        return DEFAULT_SLOTS;
    });

    const [chartSettings, setChartSettings] = useState<Record<number, ChartSlotSettings>>(() => {
        const defaults: Record<number, ChartSlotSettings> = { 0: { ...DEFAULT_CHART_SETTINGS }, 1: { ...DEFAULT_CHART_SETTINGS }, 2: { ...DEFAULT_CHART_SETTINGS } };
        if (typeof window === 'undefined') return defaults;
        const systemKey = `${KUNDALI_SETTINGS_KEY}_${activeSystem}`;
        try {
            // Priority 1: System-specific settings
            const storedSystem = localStorage.getItem(systemKey);
            if (storedSystem) {
                const parsed = JSON.parse(storedSystem);
                if (parsed && typeof parsed === 'object') {
                    const migrated: Record<number, ChartSlotSettings> = { ...defaults };
                    Object.keys(parsed).forEach(key => {
                        const idx = parseInt(key);
                        if (!isNaN(idx) && parsed[key]) {
                            migrated[idx] = { ...DEFAULT_CHART_SETTINGS, ...parsed[key] };
                        }
                    });
                    return migrated;
                }
            }
            // Priority 2: Global legacy settings
            const storedGlobal = localStorage.getItem(KUNDALI_SETTINGS_KEY);
            if (storedGlobal) {
                const parsed = JSON.parse(storedGlobal);
                if (parsed && typeof parsed === 'object') {
                    const migrated: Record<number, ChartSlotSettings> = { ...defaults };
                    Object.keys(parsed).forEach(key => {
                        const idx = parseInt(key);
                        if (!isNaN(idx) && parsed[key]) {
                            migrated[idx] = { ...DEFAULT_CHART_SETTINGS, ...parsed[key] };
                        }
                    });
                    return migrated;
                }
            }
        } catch { /* ignore */ }
        return defaults;
    });

    const [addChartModalSlot, setAddChartModalSlot] = useState<number | null>(null);

    // Persist slots to localStorage on change (System Aware + Guarded)
    useEffect(() => {
        if (activeSystem === mountSystem) {
            localStorage.setItem(`${KUNDALI_SLOTS_KEY}_${activeSystem}`, JSON.stringify(chartSlots));
        }
    }, [chartSlots, activeSystem, mountSystem]);

    // Persist settings to localStorage on change (System Aware + Guarded)
    useEffect(() => {
        if (activeSystem === mountSystem) {
            localStorage.setItem(`${KUNDALI_SETTINGS_KEY}_${activeSystem}`, JSON.stringify(chartSettings));
        }
    }, [chartSettings, activeSystem, mountSystem]);

    // Escape key to close modal
    useEffect(() => {
        if (addChartModalSlot === null) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAddChartModalSlot(null);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [addChartModalSlot]);

    // ── Slot Actions ──
    const dismissSlot = (index: number) => {
        setChartSlots(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    const selectChart = (chartId: string) => {
        if (addChartModalSlot === null) return;
        setChartSlots(prev => {
            const next = [...prev];
            next[addChartModalSlot] = chartId;
            return next;
        });
        setAddChartModalSlot(null);
    };

    const updateSlotSettings = (index: number, newSettings: Partial<ChartSlotSettings>) => {
        setChartSettings(prev => ({
            ...prev,
            [index]: { ...prev[index], ...newSettings }
        }));
    };

    // ── Fixed Planetary Table Data (Always from D1 / Rashi) ──
    const planetaryTableData = React.useMemo(() => {
        return d1Data.planets.map((p: any) => ({
            planet: fullPlanetNames[p.name] || p.name,
            sign: signIdToName[p.signId] || '-',
            degree: p.degree,
            nakshatra: p.nakshatra || '-',
            nakshatraPart: p.pada ? (typeof p.pada === 'number' ? p.pada : parseInt(String(p.pada).replace('Pada ', ''))) : undefined,
            house: p.house || 0,
            isRetro: p.isRetro
        }));
    }, [d1Data]);

    const planetaryTableTitle = 'Rashi planetary positions';

    // ── Render Helpers ──
    const renderSlot = (index: number, height: string) => {
        const chartId = chartSlots[index];
        if (!chartId) {
            return <EmptyChartSlot height={height} onClick={() => setAddChartModalSlot(index)} />;
        }
        const meta = CHART_METADATA[chartId] || { name: chartId, desc: 'Chart' };
        const settings = chartSettings[index] || DEFAULT_CHART_SETTINGS;

        return (
            <RenderedChartSlot
                chartId={chartId}
                height={height}
                settings={settings}
                onUpdateSettings={(s) => updateSlotSettings(index, s)}
                onZoom={() => setZoomedChart({ varga: chartId, label: `${meta.name} (${chartId})` })}
                onDismiss={() => dismissSlot(index)}
            />
        );
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* LEFT COLUMN: Slot 0 & Planetary Details */}
                <div className="md:col-span-5 flex flex-col gap-2">
                    {/* Slot 0: Main Chart */}
                    {renderSlot(0, 'h-[405px]')}

                    {/* Planetary Details Window (dynamic from Slot 0) — hidden for KP */}
                    {activeSystem !== 'kp' && (
                        <div className="prem-card overflow-hidden">
                            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                                <h2 className={TYPOGRAPHY.sectionTitle}>
                                    Rashi <KnowledgeTooltip term="planetary_positions" unstyled>planetary positions</KnowledgeTooltip>
                                </h2>
                            </div>
                            <div className="bg-surface-warm">
                                {planetaryTableData.length > 0 ? (
                                    <PlanetaryTable
                                        planets={planetaryTableData}
                                        variant="compact"
                                        rowClassName="py-1"
                                    />
                                ) : (
                                    <div className={cn(TYPOGRAPHY.subValue, "p-6 text-center text-ink/30 italic")}>
                                        Select a chart above to see positions
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* KP Cuspal Chart — shown only for KP ayanamsa, replaces Rashi table */}
                    {activeSystem === 'kp' && (
                        <>
                            <KpCuspalChartCard />
                            <KpBhavaDetailsCard />
                        </>
                    )}
                </div>

                {/* RIGHT COLUMN: Divisional Charts, Dasha, Profile */}
                <div className="md:col-span-7 flex flex-col gap-2">
                    {/* Client Identity Bar */}
                    {clientDetails && (
                        <div className="prem-card">
                            <div className="px-3 py-1.5" style={HEADER_STYLE}>
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

                                {/* Lagna / Moon / Sun — always from D1 */}
                                <div className="flex items-center gap-1.5 ml-auto">
                                    {[
                                        { key: 'lagna', label: <KnowledgeTooltip term="lagna" unstyled>Lagna</KnowledgeTooltip> as React.ReactNode, value: signIdToName[(d1Data.ascendant || 1) as number] },
                                        { key: 'moon', label: 'Moon' as React.ReactNode, value: d1Data.planets.find((p: any) => p.name === "Mo") ? signIdToName[d1Data.planets.find((p: any) => p.name === "Mo")!.signId] : "-" },
                                        { key: 'sun', label: 'Sun' as React.ReactNode, value: d1Data.planets.find((p: any) => p.name === "Su") ? signIdToName[d1Data.planets.find((p: any) => p.name === "Su")!.signId] : "-" },
                                    ].map((chip) => (
                                        <div key={chip.key}
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
                            <div className="px-3 py-1.5 flex items-center gap-1.5" style={HEADER_STYLE}>
                                <Sparkle className="w-3 h-3 text-gold-dark" />
                                <h2 className={TYPOGRAPHY.sectionTitle}>Birth <KnowledgeTooltip term="panchanga" unstyled>panchanga</KnowledgeTooltip></h2>
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between gap-2 bg-surface-warm">
                                <BirthPanchanga data={birthPanchangaData} />
                            </div>
                        </div>

                        {/* Vimshottari Dasha */}
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 prem-card overflow-hidden flex flex-col">
                            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                                <h2 className={TYPOGRAPHY.sectionTitle}><KnowledgeTooltip term="dasha_vimshottari" unstyled>Vimshottari</KnowledgeTooltip> dasha</h2>
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

                    {/* Middle Row: Slot 1 & Slot 2 - Hidden for KP Ayanamsa */}
                    {activeSystem !== 'kp' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {renderSlot(1, 'h-[335px]')}
                            {renderSlot(2, 'h-[335px]')}
                        </div>
                    )}

                    {/* KP Planetary Positions Table — full width (shown only for KP Ayanamsa) */}
                    {activeSystem === 'kp' && (
                        <>
                            <KpPlanetaryTableCard />
                            <KpFortunaCard />
                        </>
                    )}
                </div>
            </div>

            {/* Shadbala + Sarvashtakavarga — Lahiri Only (Full Width) */}
            {activeSystem === 'lahiri' && (
                <div className="mt-2">
                    <KundliAnalyticsPanel />
                </div>
            )}

            {/* Chart Picker Modal */}
            {addChartModalSlot !== null && (
                <ChartPickerModal
                    onClose={() => setAddChartModalSlot(null)}
                    onSelect={selectChart}
                    ayanamsa={ayanamsa}
                />
            )}
        </>
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
