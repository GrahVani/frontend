"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    LayoutGrid,
    Sparkles,
    History,
    Settings2,
    Maximize2,
    Loader2,
    Search,
    RefreshCw,
    Shield,
    Zap,
    Target,
    BarChart2,
    Plus,
    X,
    Trash2,
    AlertCircle,
    ChevronDown,
    Filter,
    Star,
    Globe,
    Gem,
    Layers,
    House,
    BookOpen,
    Eye,
    EyeOff,
    Minimize2
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore, type ChartColorTheme } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { parseChartData } from '@/lib/chart-helpers';
import { useCustomizeCharts, type CustomizeChartItem, type WidgetSize, type SelectedItemDetail } from '@/hooks/useCustomizeCharts';
import { renderWidget, getWidgetSizeClasses } from './WidgetBoxes';

// Components
import { ChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import SouthIndianChart, { ChartColorMode } from '@/components/astrology/SouthIndianChart';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import OtherDashaTable from '@/components/astrology/OtherDashaTable';
import dynamic from 'next/dynamic';

const YogaAnalysisView = dynamic(() => import('@/components/astrology/YogaAnalysis'));
const DoshaAnalysis = dynamic(() => import('@/components/astrology/DoshaAnalysis'));
const ShadbalaDashboard = dynamic(() => import('@/components/astrology/ShadbalaDashboard'));
const ShodashaVargaTable = dynamic(() => import('@/components/astrology/ShodashaVargaTable'));
const DivisionalChartZoomModal = dynamic(() => import('@/components/astrology/DivisionalChartZoomModal'));
const DivisionalChartInsights = dynamic(() => import('@/components/astrology/DivisionalChartInsights'));
const ChartCustomizationPanel = dynamic(() => import('@/components/astrology/ChartCustomizationPanel'));

// KP Components — lazy loaded (below fold)
const KpPlanetaryTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpPlanetaryTable })));
const KpCuspalChart = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpCuspalChart })), { ssr: false });
const SignificationMatrix = dynamic(() => import('@/components/kp').then(m => ({ default: m.SignificationMatrix })));
const RulingPlanetsWidget = dynamic(() => import('@/components/kp').then(m => ({ default: m.RulingPlanetsWidget })));
const BhavaDetailsTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.BhavaDetailsTable })));

// Hooks
import {
    useDasha,
    useOtherDasha,
    useAshtakavarga,
    useShadbala,
} from '@/hooks/queries/useCalculations';
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpSignifications,
} from '@/hooks/queries/useKP';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';

type SectionId =
    | 'vedic-foundation' | 'vedic-charts' | 'vedic-dashas' | 'vedic-analysis' | 'vedic-strength'
    | 'kp-foundation' | 'kp-structures' | 'kp-insights' | 'kp-ruling';

export default function CustomizePage() {
    const { clientDetails, processedCharts, isGeneratingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, chartColorTheme } = useAstrologerStore();
    const {
        selectedItems,
        selectedChartDetails,
        availableCharts,
        addChart,
        removeChart,
        duplicateChart,
        setItemSize,
        toggleCollapse,
        reorderItems,
        resetToDefaults,
        generateMissingChart,
        isLahiri
    } = useCustomizeCharts();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState<string>('customize-charts');
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);
    const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
    const [generatingCharts, setGeneratingCharts] = useState<Set<string>>(new Set());
    const [draggedInstanceId, setDraggedInstanceId] = useState<string | null>(null);
    const draggedIdRef = useRef<string | null>(null);
    
    // Divisional Charts Features (from divisional page)
    const [openHouseDetails, setOpenHouseDetails] = useState<Set<string>>(new Set());
    const [chartColorModes, setChartColorModes] = useState<Record<string, ChartColorMode>>({});
    const [zoomModalData, setZoomModalData] = useState<{
        isOpen: boolean;
        chartType: string;
        chartName: string;
        chartDesc: string;
        planets: Planet[];
        ascendant: number;
        chartData: Record<string, unknown> | null;
    } | null>(null);
    const [maximizedChart, setMaximizedChart] = useState<string | null>(null);
    const [customizationPanel, setCustomizationPanel] = useState<{ isOpen: boolean; selectedChart?: string }>({ isOpen: false });
    
    // Column count for grid layout (like divisional charts)
    const [columnCount, setColumnCount] = useState<1 | 2 | 3 | 4 | 5>(3);

    const activeSystem = ayanamsa.toLowerCase();
    const isKpSystem = activeSystem.includes('kp');
    const clientId = clientDetails?.id || '';

    // Shodasha varga data for analysis section
    const shodashaData = useMemo(() => {
        const shodashaKey = `ashtakavarga_shodasha_${activeSystem}`;
        const shodashaKpKey = `shodasha_varga_signs_${activeSystem}`;
        const raw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
        return raw ? (raw.data || raw) : null;
    }, [processedCharts, activeSystem]);

    // --- VEDIC DATA ---
    const { data: dashaResponse, isLoading: dashaLoading } = useDasha(
        !isKpSystem ? clientId : '',
        'mahadasha',
        activeSystem
    );

    const ashtakavargaRaw = processedCharts[`ashtakavarga_sarva_${activeSystem}`]?.chartData;
    const ashtakavargaData = useMemo(() => {
        return ashtakavargaRaw ? (ashtakavargaRaw.data || ashtakavargaRaw) : null;
    }, [ashtakavargaRaw]);
    const ashtakavargaLoading = !ashtakavargaData && isGeneratingCharts;

    const { data: shadbalaResult, isLoading: shadbalaLoading } = useShadbala(
        (!isKpSystem && ayanamsa === 'Lahiri') ? clientId : ''
    );

    // --- KP DATA ---
    const { data: kpPlanetsCusps, isLoading: kpPlanetsLoading } = useKpPlanetsCusps(isKpSystem ? clientId : '');
    const { data: kpRulingPlanets, isLoading: kpRulingLoading } = useKpRulingPlanets(isKpSystem ? clientId : '');
    const { data: kpBhavaDetails, isLoading: kpBhavaLoading } = useKpBhavaDetails(isKpSystem ? clientId : '');
    const { data: kpSignifications, isLoading: kpSignificationsLoading } = useKpSignifications(isKpSystem ? clientId : '');

    // Normalize Shadbala Data
    const normalizedShadbala = useMemo(() => {
        const raw = (shadbalaResult?.data?.data || shadbalaResult?.data || shadbalaResult) as any;
        if (!raw || !raw.shadbala_virupas) return null;

        const planets: any[] = [];
        const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        const MIN_BALA: Record<string, number> = { 'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0 };

        planetKeys.forEach(p => {
            const details = (raw[`${p}_details`] || {}) as Record<string, number>;
            const virupas = (raw.shadbala_virupas?.[p]) || 0;
            const rupas = (raw.shadbala_rupas?.[p]) || 0;
            const rank = (raw.relative_rank?.[p]) || 0;
            const strength = (raw.strength_summary?.[p]) || 'Weak';
            const ishKas = (raw.ishta_kashta_phala?.[p]) || { Ishta: 0, Kashta: 0 };

            const kalaBala = [
                details['Ayana Bala'] || 0, details['Natonnata Bala'] || 0, details['Paksha Bala'] || 0,
                details['Tri-Bhaga Bala'] || 0, details['Kaala_Dina_Bala'] || 0, details['Varsha_Bala'] || 0,
                details['Maasa_Bala'] || 0, details['Vaara_Bala'] || 0, details['Hora_Bala'] || 0
            ].reduce((a, b) => a + b, 0);

            planets.push({
                planet: p, sthalaBala: details['STHANA TOTAL'] || 0, digBala: details['Dig Bala'] || 0,
                kalaBala, cheshtaBala: details['Chesta Bala'] || 0, naisargikaBala: details['Naisargika Bala'] || 0,
                drikBala: details['Drik Bala'] || 0, totalBala: virupas, rupaBala: rupas,
                minBalaRequired: (MIN_BALA[p] || 6.0) * 60, ratio: rupas / (MIN_BALA[p] || 6.0),
                rank, isStrong: strength === 'Strong', ishtaKashta: { ishta: ishKas.Ishta || 0, kashta: ishKas.Kashta || 0 }
            });
        });

        return { planets, ayanamsa: 'Lahiri', system: 'Chitrapaksha', raw };
    }, [shadbalaResult]);

    // Sidebar navigation items
    const sections = useMemo(() => {
        if (isKpSystem) {
            return [
                { id: 'kp-ruling', name: 'Ruling Planets', icon: Sparkles, desc: 'Real-time stellar forces governing the moment' },
                { id: 'kp-foundation', name: 'Planets & Cusps', icon: Target, desc: 'Detailed planetary positions and sub-lord analysis' },
                { id: 'kp-structures', name: 'Cuspal Chart', icon: LayoutGrid, desc: 'KP house geometries and bhava details' },
                { id: 'kp-insights', name: 'Significations', icon: Zap, desc: 'Planetary and house thematic significations' },
            ];
        }

        return [
            { id: 'customize-charts', name: 'Customize Charts', icon: LayoutGrid, desc: 'Add, remove and arrange your charts' },
            { id: 'vedic-dashas', name: 'Time Cycles', icon: History, desc: 'Vimshottari Dasha chronological mapping' },
            { id: 'vedic-analysis', name: 'Yoga & Dosha', icon: Sparkles, desc: 'Special planetary combinations and status' },
            ...(ayanamsa === 'Lahiri' ? [{ id: 'vedic-strength', name: 'Shadbala', icon: BarChart2, desc: 'Mathematical strength of planets' }] : [])
        ];
    }, [isKpSystem, ayanamsa]);

    const handleSectionSelect = (id: string) => {
        setActiveSection(id);
        setIsNavModalOpen(false);
    };

    // Handle adding a chart
    const handleAddChart = async (chartId: string) => {
        addChart(chartId);
        setIsChartSelectorOpen(false);

        // Check if this is a widget (widgets don't need chart generation)
        const chartCatalog = availableCharts.find(c => c.id === chartId);
        const isWidget = chartCatalog?.category.startsWith('widget_');

        // Check if chart exists, if not generate it (skip for widgets)
        const chartKey = `${chartId}_${activeSystem}`;
        if (!isWidget && !processedCharts[chartKey] && clientId) {
            setGeneratingCharts(prev => new Set(prev).add(chartId));
            await generateMissingChart(clientId, chartId);
            await refreshCharts();
            setGeneratingCharts(prev => {
                const next = new Set(prev);
                next.delete(chartId);
                return next;
            });
        }
    };

    // Handle removing a chart
    const handleRemoveChart = (instanceId: string) => {
        removeChart(instanceId);
    };

    const handleDuplicate = (instanceId: string) => {
        duplicateChart(instanceId);
    };

    const handleSizeChange = (instanceId: string, size: WidgetSize) => {
        setItemSize(instanceId, size);
    };

    const handleCollapseToggle = (instanceId: string) => {
        toggleCollapse(instanceId);
    };

    const [dragOverInstanceId, setDragOverInstanceId] = useState<string | null>(null);
    const dragOverRef = useRef<string | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent, instanceId: string) => {
        draggedIdRef.current = instanceId;
        setDraggedInstanceId(instanceId);
        e.dataTransfer.setData('text/plain', instanceId);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, targetInstanceId?: string) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        // Only update state when the target actually changes (avoids re-render thrashing)
        if (targetInstanceId && targetInstanceId !== dragOverRef.current) {
            dragOverRef.current = targetInstanceId;
            setDragOverInstanceId(targetInstanceId);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        // Only clear if we're leaving the actual container, not entering a child
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        const currentTarget = e.currentTarget as HTMLElement;
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
            dragOverRef.current = null;
            setDragOverInstanceId(null);
        }
    }, []);

    const handleDragEnd = useCallback(() => {
        draggedIdRef.current = null;
        dragOverRef.current = null;
        setDraggedInstanceId(null);
        setDragOverInstanceId(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetInstanceId: string) => {
        e.preventDefault();
        e.stopPropagation();
        dragOverRef.current = null;
        setDragOverInstanceId(null);
        const currentDraggedId = draggedIdRef.current;
        if (!currentDraggedId || currentDraggedId === targetInstanceId) {
            draggedIdRef.current = null;
            setDraggedInstanceId(null);
            return;
        }
        const currentOrder = [...selectedItems];
        const draggedIdx = currentOrder.findIndex(i => i.instanceId === currentDraggedId);
        const targetIdx = currentOrder.findIndex(i => i.instanceId === targetInstanceId);
        if (draggedIdx === -1 || targetIdx === -1) {
            draggedIdRef.current = null;
            setDraggedInstanceId(null);
            return;
        }
        const [moved] = currentOrder.splice(draggedIdx, 1);
        currentOrder.splice(targetIdx, 0, moved);
        reorderItems(currentOrder);
        draggedIdRef.current = null;
        setDraggedInstanceId(null);
    }, [selectedItems, reorderItems]);

    // Drop handler specifically for the ghost card (moves to end)
    const handleGhostDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragOverRef.current = null;
        setDragOverInstanceId(null);
        const currentDraggedId = draggedIdRef.current;
        if (!currentDraggedId) return;
        const currentOrder = [...selectedItems];
        const draggedIdx = currentOrder.findIndex(i => i.instanceId === currentDraggedId);
        if (draggedIdx === -1) {
            draggedIdRef.current = null;
            setDraggedInstanceId(null);
            return;
        }
        const [moved] = currentOrder.splice(draggedIdx, 1);
        currentOrder.push(moved);
        reorderItems(currentOrder);
        draggedIdRef.current = null;
        setDraggedInstanceId(null);
    }, [selectedItems, reorderItems]);

    // Chart Parsing Helpers
    const getChartProps = (id: string) => {
        const chartData = processedCharts[`${id}_${activeSystem}`]?.chartData || null;
        return parseChartData(chartData);
    };

    // Check if a chart is available
    const isChartAvailable = (chartId: string) => {
        return !!processedCharts[`${chartId}_${activeSystem}`];
    };

    // Toggle house details for a specific chart
    const toggleHouseDetails = (instanceId: string) => {
        setOpenHouseDetails(prev => {
            const newSet = new Set(prev);
            if (newSet.has(instanceId)) {
                newSet.delete(instanceId);
            } else {
                newSet.add(instanceId);
            }
            return newSet;
        });
    };

    // Toggle individual chart color mode
    const toggleChartColorMode = (instanceId: string) => {
        setChartColorModes(prev => ({
            ...prev,
            [instanceId]: prev[instanceId] === 'blackwhite' ? 'color' : 'blackwhite'
        }));
    };

    // Get house distribution for house details panel
    const getHouseDistributionFromPlanets = (planets: Planet[], ascendantSign: number) => {
        const houses: Record<number, { planets: { name: string; degree: string; isRetro: boolean }[]; signName: string }> = {};
        const signIdToName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

        for (let i = 1; i <= 12; i++) {
            const signId = ((ascendantSign + i - 2) % 12) + 1;
            houses[i] = { planets: [], signName: signIdToName[signId - 1] || '' };
        }

        planets.forEach(p => {
            if (p.name === 'As') return;
            const houseNum = ((p.signId - ascendantSign + 12) % 12) + 1;
            houses[houseNum].planets.push({
                name: p.name,
                degree: p.degree || '',
                isRetro: p.isRetro || false
            });
        });

        return houses;
    };

    // Note: Widgets and charts are now rendered in order from selectedChartDetails
    // Category filtering is handled inline in the grid render

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 bg-white/50 backdrop-blur-md rounded-[2rem] prem-card mx-4 my-8">
                <Shield className="w-16 h-16 text-gold-dark mb-6 opacity-30" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-ink")}>Select a Profile</h2>
                <p className={cn(TYPOGRAPHY.label, "max-w-xs mx-auto")}>Choose a client from the global explorer to begin comprehensive celestial analysis.</p>
            </div>
        );
    }

    // Aggregate Section Renderer
    const renderVedicSections = () => {
        switch (activeSection) {
            case 'vedic-dashas':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Chronological Cycles" subtitle="Vimshottari Dasha Hierarchy" icon={<History className="w-6 h-6" />} />
                        <div className="bg-white p-8 rounded-[2.5rem] prem-card max-w-4xl mx-auto">
                            <VimshottariTreeGrid
                                data={dashaResponse ? processDashaResponse(dashaResponse as unknown as RawDashaPeriod).slice(0, 9) : []}
                                isLoading={dashaLoading}
                                className="border-none shadow-none"
                            />
                        </div>
                    </section>
                );
            case 'vedic-analysis':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Stellar Insights" subtitle="Yoga, Dosha, Ashtakavarga & Shodashvarga" icon={<Sparkles className="w-6 h-6" />} />
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnalysisPanel title="Gaja Kesari Analysis">
                                    <YogaAnalysisView clientId={clientId} yogaType="gaja_kesari" ayanamsa={activeSystem} />
                                </AnalysisPanel>
                                <AnalysisPanel title="Sade Sati Status">
                                    <DoshaAnalysis clientId={clientId} doshaType="sade_sati" ayanamsa={activeSystem} />
                                </AnalysisPanel>
                            </div>
                            {ashtakavargaData && (
                                <div className="bg-white p-8 rounded-[2.5rem] prem-card">
                                    <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-[20px]")}>Sarvashtakavarga Matrix</h4>
                                    <AshtakavargaMatrix type="sarva" data={(ashtakavargaData as any)?.data || ashtakavargaData} />
                                </div>
                            )}
                            {shodashaData && (
                                <div className="bg-white p-8 rounded-[2.5rem] prem-card">
                                    <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-[20px]")}>Shodashavarga Summary</h4>
                                    <ShodashaVargaTable data={shodashaData as Record<string, unknown>} />
                                </div>
                            )}
                        </div>
                    </section>
                );
            case 'vedic-strength':
                if (ayanamsa !== 'Lahiri') return null;
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Planetary Potencies" subtitle="Shadbala Strength Analysis" icon={<BarChart2 className="w-6 h-6" />} />
                        <div className="bg-white p-6 rounded-[2.5rem] prem-card">
                            {shadbalaLoading ? <Loader2 className="w-10 h-10 animate-spin mx-auto text-gold-dark" /> :
                                normalizedShadbala ? <ShadbalaDashboard displayData={normalizedShadbala.raw} /> :
                                    <p className="text-center opacity-40 py-12">Shadbala data unavailable.</p>
                            }
                        </div>
                    </section>
                );
            default:
            case 'customize-charts':
                return (
                    <section className="space-y-6 animate-in fade-in duration-500">
                        {/* Controls Bar */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <button
                                onClick={() => setIsChartSelectorOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[12px] font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Add Widget
                            </button>
                            {selectedItems.length > 0 && (
                                <button
                                    onClick={resetToDefaults}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-surface-warm border border-gold-primary/20 text-ink rounded-xl text-[12px] font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear All
                                </button>
                            )}

                            <div className="flex-1" />

                            {/* Column Count Selector - Like Divisional Charts */}
                            {selectedItems.length > 0 && (
                                <div className="flex items-center gap-1 bg-white border border-gold-primary/20 rounded-lg p-1" role="group" aria-label="Grid column count">
                                    {([1, 2, 3, 4, 5] as const).map((col) => (
                                        <button
                                            key={col}
                                            onClick={() => setColumnCount(col)}
                                            className={cn(
                                                "w-8 h-8 rounded-md flex items-center justify-center text-[12px] font-bold transition-all",
                                                columnCount === col
                                                    ? "bg-gold-primary text-white shadow-sm"
                                                    : "text-gold-dark hover:bg-gold-primary/10"
                                            )}
                                            title={`${col} column${col > 1 ? 's' : ''}`}
                                            aria-label={`${col} column${col > 1 ? 's' : ''}`}
                                            aria-pressed={columnCount === col}
                                        >
                                            {col}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedItems.length > 0 && (
                                <span className="text-[11px] text-ink/50 font-medium">
                                    {selectedItems.length} widget{selectedItems.length !== 1 ? 's' : ''} selected
                                </span>
                            )}
                        </div>

                        {/* Charts Grid */}
                        {selectedItems.length === 0 ? (
                            <EmptyChartsState
                                onAddClick={() => setIsChartSelectorOpen(true)}
                            />
                        ) : (
                            <div className={cn(
                                "grid gap-6",
                                columnCount === 1 && "grid-cols-1",
                                columnCount === 2 && "grid-cols-1 md:grid-cols-2",
                                columnCount === 3 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
                                columnCount === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                                columnCount === 5 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                            )}>
                                {/* Render All Items in Order */}
                                {selectedChartDetails.map((item) => {
                                    const isWidget = item.category.startsWith('widget_');
                                    const colSpan = getWidgetSizeClasses(item.size);
                                    const commonProps = {
                                        size: item.size,
                                        collapsed: item.collapsed,
                                        onSizeChange: (s: WidgetSize) => handleSizeChange(item.instanceId, s),
                                        onDuplicate: () => handleDuplicate(item.instanceId),
                                        onCollapseToggle: () => handleCollapseToggle(item.instanceId),
                                    };

                                    return (
                                        <div
                                            key={item.instanceId}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item.instanceId)}
                                            onDragOver={(e) => handleDragOver(e, item.instanceId)}
                                            onDragLeave={handleDragLeave}
                                            onDragEnd={handleDragEnd}
                                            onDrop={(e) => handleDrop(e, item.instanceId)}
                                            className={cn(
                                                colSpan,
                                                "cursor-move transition-all duration-200",
                                                draggedInstanceId === item.instanceId && "opacity-40 scale-[0.97]",
                                                dragOverInstanceId === item.instanceId && draggedInstanceId !== item.instanceId && "ring-2 ring-primary/50 ring-offset-2 rounded-[2.5rem] scale-[1.02]"
                                            )}
                                        >
                                            {isWidget ? (
                                                renderWidget({
                                                    ...item,
                                                    ...commonProps,
                                                    onRemove: () => handleRemoveChart(item.instanceId),
                                                }, clientId, activeSystem)
                                            ) : item.category === 'dasha' ? (
                                                <DashaBox
                                                    dasha={item}
                                                    clientId={clientId}
                                                    activeSystem={activeSystem}
                                                    onRemove={() => handleRemoveChart(item.instanceId)}
                                                    {...commonProps}
                                                />
                                            ) : item.category === 'ashtakavarga' ? (
                                                <AshtakavargaBox
                                                    ashtakavarga={item}
                                                    clientId={clientId}
                                                    activeSystem={activeSystem}
                                                    onRemove={() => handleRemoveChart(item.instanceId)}
                                                    {...commonProps}
                                                />
                                            ) : (
                                                <DraggableChartBox
                                                    chart={item}
                                                    chartProps={getChartProps(item.id)}
                                                    isAvailable={isChartAvailable(item.id)}
                                                    isGenerating={generatingCharts.has(item.id)}
                                                    theme={chartColorTheme}
                                                    style={chartStyle}
                                                    onRemove={() => handleRemoveChart(item.instanceId)}
                                                    {...commonProps}
                                                    clientId={clientId}
                                                    activeSystem={activeSystem}
                                                    refreshCharts={refreshCharts}
                                                    // Divisional charts features
                                                    isHouseDetailsOpen={openHouseDetails.has(item.instanceId)}
                                                    onToggleHouseDetails={() => toggleHouseDetails(item.instanceId)}
                                                    colorMode={chartColorModes[item.instanceId]}
                                                    onToggleColorMode={() => toggleChartColorMode(item.instanceId)}
                                                    onZoom={() => {
                                                        const props = getChartProps(item.id);
                                                        setZoomModalData({
                                                            isOpen: true,
                                                            chartType: item.id,
                                                            chartName: item.name,
                                                            chartDesc: item.description,
                                                            planets: props.planets,
                                                            ascendant: props.ascendant,
                                                            chartData: processedCharts[`${item.id}_${activeSystem}`]?.chartData || null
                                                        });
                                                    }}
                                                    onLearn={() => setCustomizationPanel({ isOpen: true, selectedChart: item.id })}
                                                    houseData={getHouseDistributionFromPlanets(getChartProps(item.id).planets, getChartProps(item.id).ascendant)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Ghost Add Card — also a drop target */}
                                <div
                                    onClick={() => !draggedIdRef.current && setIsChartSelectorOpen(true)}
                                    onDragOver={(e) => handleDragOver(e, '__ghost__')}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleGhostDrop}
                                    className={cn(
                                        "border-2 border-dashed rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[220px] cursor-pointer transition-all duration-200",
                                        dragOverInstanceId === '__ghost__'
                                            ? "border-primary/60 bg-primary/5 ring-2 ring-primary/40 ring-offset-2 scale-[1.02]"
                                            : "border-gold-primary/30 hover:border-gold-primary/60 hover:bg-white/40 bg-white/20"
                                    )}
                                >
                                    <Plus className={cn(
                                        "w-10 h-10 mb-3 transition-colors pointer-events-none",
                                        dragOverInstanceId === '__ghost__' ? "text-primary/60" : "text-gold-primary/40"
                                    )} />
                                    <span className={cn(
                                        "text-[13px] font-bold transition-colors pointer-events-none",
                                        dragOverInstanceId === '__ghost__' ? "text-primary/70" : "text-ink/50"
                                    )}>
                                        {dragOverInstanceId === '__ghost__' ? 'Drop Here' : 'Add Widget'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </section>
                );
        }
    };

    const renderKpSections = () => {
        switch (activeSection) {
            case 'kp-ruling':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Ruling Forces" subtitle="Stellar Time-Dynamics (RP)" icon={<Sparkles className="w-6 h-6" />} />
                        <div className="max-w-4xl mx-auto">
                            <RulingPlanetsWidget data={kpRulingPlanets?.data || null} isLoading={kpRulingLoading} className="shadow-2xl border-gold-primary/20 !bg-white/80" />
                        </div>
                    </section>
                );
            case 'kp-foundation':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Cuspal Foundation" subtitle="Planetary Positions & Sub-Lords" icon={<Target className="w-6 h-6" />} />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            <div className="md:col-span-12 bg-white p-6 rounded-3xl prem-card">
                                <KpPlanetaryTable
                                    planets={Object.entries(kpPlanetsCusps?.data?.planets || {}).map(([name, p]) => ({
                                        name,
                                        fullName: name,
                                        sign: p.sign,
                                        signId: 1,
                                        degree: parseFloat(p.longitude.split(' ')[1] || '0'),
                                        degreeFormatted: p.longitude,
                                        house: p.house,
                                        nakshatra: p.nakshatra,
                                        nakshatraLord: p.star_lord,
                                        subLord: p.sub_lord,
                                        isRetrograde: p.is_retro
                                    }))}
                                    className="border-none"
                                />
                            </div>
                        </div>
                    </section>
                );
            case 'kp-structures':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Cuspal Geometries" subtitle="North Indian KP Chart & Bhava Details" icon={<LayoutGrid className="w-6 h-6" />} />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-5 flex justify-center">
                                <div className="w-full max-w-md aspect-square bg-white prem-card rounded-[2.5rem] p-10 shadow-xl overflow-hidden">
                                    <KpCuspalChart
                                        planets={Object.entries(kpPlanetsCusps?.data?.planets || {}).map(([name, p]) => ({
                                            name: name.substring(0, 2),
                                            degree: p.longitude.split(' ')[1] || p.longitude,
                                            house: p.house,
                                            signId: 1,
                                            isRetro: p.is_retro
                                        }))}
                                        houseSigns={Object.values(kpPlanetsCusps?.data?.house_cusps || {}).map(c => 1) || Array(12).fill(1)}
                                        className="h-full w-full"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-7 bg-white p-6 rounded-3xl prem-card">
                                <BhavaDetailsTable bhavaDetails={kpBhavaDetails?.data?.bhava_details || {}} className="border-none shadow-none" />
                            </div>
                        </div>
                    </section>
                );
            case 'kp-insights':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Thematic Matrices" subtitle="Planetary & House Significations" icon={<Zap className="w-6 h-6" />} />
                        <div className="bg-white p-8 rounded-[2.5rem] prem-card">
                            <SignificationMatrix significations={kpSignifications?.data?.significations || []} />
                        </div>
                    </section>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-12">
                        <div className="w-20 h-20 bg-surface-warm/50 rounded-[2rem] flex items-center justify-center mb-8 prem-card">
                            <Zap className="w-8 h-8 text-gold-dark opacity-50" />
                        </div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] text-ink mb-2")}>Select KP Analysis</h3>
                        <p className={cn(TYPOGRAPHY.label, "max-w-md mx-auto opacity-60")}>Open the Celestial Navigator above to choose a KP module for deep exploration.</p>
                        <button
                            onClick={() => setIsNavModalOpen(true)}
                            className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Open Navigator
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen animate-in fade-in duration-700">
            <div className="flex-1">
                <main className="space-y-12">
                    {/* Dynamic Sections */}
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                        {isKpSystem ? renderKpSections() : renderVedicSections()}
                    </div>
                </main>
            </div>

            {/* NAVIGATION MODAL */}
            <NavigationModal
                isOpen={isNavModalOpen}
                onClose={() => setIsNavModalOpen(false)}
                sections={sections}
                onSelect={handleSectionSelect}
                activeId={activeSection}
                ayanamsa={ayanamsa}
            />

            {/* CHART SELECTOR MODAL */}
            <ChartSelectorModal
                isOpen={isChartSelectorOpen}
                onClose={() => setIsChartSelectorOpen(false)}
                availableCharts={availableCharts}
                selectedCharts={selectedItems.map(i => i.id)}
                onSelect={handleAddChart}
                currentAyanamsa={ayanamsa}
                activeSection={activeSection}
            />

            {/* ZOOM MODAL */}
            {zoomModalData && (
                <DivisionalChartZoomModal
                    isOpen={zoomModalData.isOpen}
                    onClose={() => setZoomModalData(null)}
                    chartType={zoomModalData.chartType}
                    chartName={zoomModalData.chartName}
                    chartDesc={zoomModalData.chartDesc}
                    planets={zoomModalData.planets}
                    ascendantSign={zoomModalData.ascendant}
                    chartData={zoomModalData.chartData ?? undefined}
                />
            )}

            {/* CUSTOMIZATION PANEL (Learn/Educational Content) */}
            <ChartCustomizationPanel
                isOpen={customizationPanel.isOpen}
                onClose={() => setCustomizationPanel({ isOpen: false })}
                selectedChart={customizationPanel.selectedChart}
            />
        </div>
    );
}

// Helper Components
function SectionHeader({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-surface-warm border border-gold-primary/20 flex items-center justify-center text-gold-dark shadow-md">
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="text-[24px] font-black text-ink tracking-tight uppercase leading-none">{title}</h3>
                <p className={cn(TYPOGRAPHY.label, "text-[12px] tracking-[0.2em] font-bold opacity-60")}>{subtitle}</p>
            </div>
            <div className="w-12 h-1 bg-gold-primary rounded-full" />
        </div>
    );
}

const SIZE_OPTIONS: { key: WidgetSize; label: string }[] = [
    { key: 'small', label: 'S' },
    { key: 'medium', label: 'M' },
    { key: 'large', label: 'L' },
    { key: 'full', label: 'F' },
];

function SizeToggle({ size, onChange }: { size: WidgetSize; onChange?: (s: WidgetSize) => void }) {
    return (
        <div className="flex items-center bg-surface-warm rounded-lg p-0.5">
            {SIZE_OPTIONS.map(opt => (
                <button
                    key={opt.key}
                    onClick={() => onChange?.(opt.key)}
                    className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all min-w-[20px]",
                        size === opt.key
                            ? "bg-primary text-white shadow-sm"
                            : "text-ink/40 hover:text-ink hover:bg-white"
                    )}
                    title={`Size: ${opt.label}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    description: string;
    badge: React.ReactNode;
    size: WidgetSize;
    collapsed: boolean;
    children: React.ReactNode;
    onRemove: () => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
    onSizeChange?: (s: WidgetSize) => void;
}

function DashboardCard({ title, description, badge, size, collapsed, children, onRemove, onDuplicate, onCollapseToggle, onSizeChange }: DashboardCardProps) {
    return (
        <div className="bg-white prem-card rounded-[2.5rem] p-6 shadow-xl relative group hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4 shrink-0 gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">{badge}</div>
                    <h4 className={cn(TYPOGRAPHY.value, "mt-2 text-[14px] font-black text-ink truncate")}>{title}</h4>
                    <p className="text-[10px] text-ink/50 line-clamp-1">{description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <SizeToggle size={size} onChange={onSizeChange} />
                    <button onClick={onRemove} className="p-1.5 rounded-lg text-ink/30 hover:text-red-500 hover:bg-red-50 transition-all" title="Remove"><X className="w-3.5 h-3.5" /></button>
                </div>
            </div>
            {!collapsed && <div className="flex-1 relative bg-surface-warm/30 rounded-3xl overflow-hidden min-h-[220px]">{children}</div>}
        </div>
    );
}

function ChartBox({ title, chartId, chartProps, theme, style }: any) {
    const { planets, ascendant } = chartProps;
    return (
        <div className="w-full max-w-md bg-white prem-card rounded-[2.5rem] p-8 shadow-xl relative group hover:shadow-2xl transition-all duration-500">
            <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-[14px] opacity-60 uppercase tracking-widest")}>{title}</h4>
            <div className="aspect-square relative">
                {style === 'South Indian' ? (
                    <SouthIndianChart ascendantSign={ascendant} planets={planets} colorMode="color" colorTheme={theme} />
                ) : (
                    <ChartWithPopup ascendantSign={ascendant} planets={planets} className="bg-transparent border-none w-full h-full" showDegrees={chartId === 'D1'} />
                )}
            </div>
            <div className="absolute top-6 right-6 p-2.5 rounded-xl bg-surface-warm border border-gold-primary/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm">
                <Maximize2 className="w-4 h-4 text-ink" />
            </div>
        </div>
    );
}

interface DraggableChartBoxProps {
    chart: SelectedItemDetail;
    chartProps: { planets: any[]; ascendant: number };
    isAvailable: boolean;
    isGenerating: boolean;
    theme: ChartColorTheme;
    style: string;
    onRemove: () => void;
    clientId: string;
    activeSystem: string;
    refreshCharts: () => Promise<void>;
    size: WidgetSize;
    collapsed: boolean;
    onSizeChange?: (s: WidgetSize) => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
    onCustomize?: () => void;
    // Divisional charts features
    isHouseDetailsOpen?: boolean;
    onToggleHouseDetails?: () => void;
    colorMode?: ChartColorMode;
    onToggleColorMode?: () => void;
    onZoom?: () => void;
    onLearn?: () => void;
    houseData?: Record<number, { planets: { name: string; degree: string; isRetro: boolean }[]; signName: string }>;
}

function DraggableChartBox({
    chart,
    chartProps,
    isAvailable,
    isGenerating,
    theme,
    style,
    onRemove,
    clientId,
    activeSystem,
    refreshCharts,
    size,
    collapsed,
    onSizeChange,
    onDuplicate,
    onCollapseToggle,
    onCustomize,
    isHouseDetailsOpen,
    onToggleHouseDetails,
    colorMode,
    onToggleColorMode,
    onZoom,
    onLearn,
    houseData
}: DraggableChartBoxProps) {
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

    const handleGenerate = async () => {
        if (!clientId) return;
        setIsGeneratingLocal(true);
        try {
            await clientApi.generateChart(clientId, chart.id, activeSystem);
            await refreshCharts();
        } catch (error) {
            console.error(`Failed to generate ${chart.id}:`, error);
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    const badge = (
        <>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                chart.category === 'rare_shodash' ? "bg-amber-100 text-amber-700" :
                    chart.category === 'lagna' ? "bg-blue-100 text-blue-700" :
                        chart.category === 'dasha' ? "bg-purple-100 text-purple-700" :
                            chart.category === 'ashtakavarga' ? "bg-emerald-100 text-emerald-700" :
                                "bg-gold-primary/10 text-gold-dark"
            )}>
                {chart.category === 'rare_shodash' ? 'Rare' : chart.category}
            </span>
            {chart.category === 'rare_shodash' && (
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Lahiri Only</span>
            )}
        </>
    );

    // Sign names for house details
    const signIdToName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    return (
        <div className="bg-white prem-card rounded-[2.5rem] p-6 shadow-xl relative group hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            {/* Header with all controls */}
            <div className="flex items-start justify-between mb-4 shrink-0 gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">{badge}</div>
                    <h4 className={cn(TYPOGRAPHY.value, "mt-2 text-[14px] font-black text-ink truncate")}>{chart.name}</h4>
                    <p className="text-[10px] text-ink/50 line-clamp-1">{chart.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {/* House Details Toggle */}
                    {isAvailable && onToggleHouseDetails && (
                        <button
                            onClick={onToggleHouseDetails}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                isHouseDetailsOpen ? "bg-gold-primary/20 text-gold-dark" : "text-ink/30 hover:text-gold-dark hover:bg-gold-primary/10"
                            )}
                            title="House Details"
                        >
                            <House className="w-3.5 h-3.5" />
                        </button>
                    )}
                    
                    {/* Learn Button */}
                    {isAvailable && onLearn && (
                        <button
                            onClick={onLearn}
                            className="p-1.5 rounded-lg text-ink/30 hover:text-purple-600 hover:bg-purple-50 transition-all"
                            title="Learn about this chart"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                        </button>
                    )}
                    
                    {/* Color Mode Toggle */}
                    {isAvailable && onToggleColorMode && style === 'South Indian' && (
                        <button
                            onClick={onToggleColorMode}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                colorMode === 'blackwhite' ? "bg-gold-primary/20 text-ink/60" : "text-ink/30 hover:text-gold-dark hover:bg-gold-primary/10"
                            )}
                            title={colorMode === 'blackwhite' ? "Switch to Color" : "Switch to B&W"}
                        >
                            {colorMode === 'blackwhite' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                    )}
                    
                    {/* Zoom Button */}
                    {isAvailable && onZoom && (
                        <button
                            onClick={onZoom}
                            className="p-1.5 rounded-lg text-ink/30 hover:text-gold-dark hover:bg-gold-primary/10 transition-all"
                            title="Zoom"
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                    
                    <SizeToggle size={size} onChange={onSizeChange} />
                    
                    {/* Customize Button */}
                    {onCustomize && (
                        <button 
                            onClick={onCustomize} 
                            className="p-1.5 rounded-lg text-ink/30 hover:text-gold-dark hover:bg-gold-primary/10 transition-all" 
                            title="Customize"
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                    
                    <button onClick={onRemove} className="p-1.5 rounded-lg text-ink/30 hover:text-red-500 hover:bg-red-50 transition-all" title="Remove">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            
            {!collapsed && (
                <div className="flex-1 flex flex-col gap-3 min-h-[220px]">
                    {/* Chart Display */}
                    <div className="flex-1 bg-surface-warm/30 rounded-3xl overflow-hidden relative">
                        {!isAvailable ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <AlertCircle className="w-8 h-8 text-gold-dark/30 mb-3" />
                                <p className="text-[11px] text-ink/50 mb-4">Chart not generated yet</p>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGeneratingLocal || isGenerating}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isGeneratingLocal || isGenerating ? (
                                        <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Sparkles className="w-3 h-3" /> Generate</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <>
                                {style === 'South Indian' ? (
                                    <SouthIndianChart
                                        ascendantSign={chartProps.ascendant}
                                        planets={chartProps.planets}
                                        colorMode={colorMode || 'color'}
                                        colorTheme={theme}
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <ChartWithPopup
                                        ascendantSign={chartProps.ascendant}
                                        planets={chartProps.planets}
                                        className="bg-transparent border-none w-full h-full p-4"
                                        showDegrees={chart.id === 'D1'}
                                    />
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* House Details Panel */}
                    {isHouseDetailsOpen && isAvailable && houseData && (
                        <div className="bg-white rounded-2xl border border-gold-primary/10 p-3 overflow-hidden">
                            <div className={cn(TYPOGRAPHY.label, "mb-2 text-ink/70 font-bold uppercase tracking-wider text-[10px]")}>House-wise Positions</div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                    <div key={h} className={cn(
                                        "overflow-hidden rounded-lg border border-gold-primary/10 transition-all",
                                        houseData[h]?.planets.length ? "bg-white shadow-sm" : "bg-gold-primary/5 opacity-60"
                                    )}>
                                        <div className={cn(
                                            "px-2 py-1 flex items-center justify-between border-b border-gold-primary/5",
                                            houseData[h]?.planets.length ? "bg-gold-primary/5" : "bg-transparent"
                                        )}>
                                            <span className="font-bold text-ink text-[11px]">H{h}</span>
                                            <span className="text-[10px] font-medium text-gold-dark">{houseData[h]?.signName?.substring(0, 3)}</span>
                                        </div>
                                        <div className="p-1 px-1.5 min-h-[20px] flex flex-col gap-0.5">
                                            {houseData[h]?.planets.length > 0 ? (
                                                houseData[h].planets.map((p, pIdx) => (
                                                    <div key={pIdx} className="flex items-center justify-between gap-1 text-[10px] leading-tight">
                                                        <span className="font-bold text-ink">{p.name}</span>
                                                        <span className="text-ink/60 font-sans text-[9px]">
                                                            {p.degree}{p.isRetro && <span className="text-rose-500 font-bold ml-0.5">(R)</span>}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-[9px] text-ink/30 italic py-0.5">-</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Quick Stats */}
                    {isAvailable && !isHouseDetailsOpen && (
                        <div className={cn(TYPOGRAPHY.subValue, "flex items-center justify-between px-1")}>
                            <span>Asc: <strong className="text-ink">{signIdToName[chartProps.ascendant - 1] || 'Aries'}</strong></span>
                            <span className="text-ink/70">
                                {chartProps.planets.filter((p: any) => p.isRetro).length > 0 
                                    ? `${chartProps.planets.filter((p: any) => p.isRetro).length} Retro` 
                                    : 'No Retro'}
                            </span>
                        </div>
                    )}
                    
                    {/* Chart Insights */}
                    {isAvailable && !isHouseDetailsOpen && (
                        <DivisionalChartInsights
                            chartType={chart.id}
                            planets={chartProps.planets}
                            ascendant={chartProps.ascendant}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// Dasha Box Component
interface DashaBoxProps {
    dasha: SelectedItemDetail;
    clientId: string;
    activeSystem: string;
    onRemove: () => void;
    size: WidgetSize;
    collapsed: boolean;
    onSizeChange?: (s: WidgetSize) => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
}

function DashaBox({ dasha, clientId, activeSystem, onRemove, size, collapsed, onSizeChange, onDuplicate, onCollapseToggle }: DashaBoxProps) {
    // Use vimshottari hook for vimshottari and tribhagi (tribhagi is a variation of vimshottari)
    const isVimshottari = dasha.id === 'vimshottari' || dasha.id === 'tribhagi';
    const { data: vimshottariData, isLoading: isVimshottariLoading } = useDasha(
        isVimshottari ? clientId : '',
        'mahadasha',
        activeSystem
    );
    // Use other dasha hook for non-vimshottari dashas
    const { data: otherDashaData, isLoading: isOtherDashaLoading } = useOtherDasha(
        !isVimshottari ? clientId : '',
        dasha.id,
        activeSystem,
        'mahadasha'
    );
    const dashaData = isVimshottari ? vimshottariData : otherDashaData;
    const isDashaLoading = isVimshottari ? isVimshottariLoading : isOtherDashaLoading;
    const hasData = !!dashaData && !isDashaLoading;

    return (
        <DashboardCard
            title={dasha.name}
            description={dasha.description}
            badge={<span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">Dasha</span>}
            size={size}
            collapsed={collapsed}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onCollapseToggle={onCollapseToggle}
            onSizeChange={onSizeChange}
        >
            {!hasData ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-purple-300 mb-3" />
                    <p className="text-[11px] text-ink/50 mb-4">Dasha data loading...</p>
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="h-full overflow-auto p-2">
                    {isVimshottari ? (
                        <VimshottariTreeGrid
                            data={processDashaResponse(dashaData as unknown as RawDashaPeriod)}
                            isLoading={false}
                            className="border-none shadow-none"
                        />
                    ) : (
                        <OtherDashaTable
                            data={dashaData?.data || dashaData}
                            dashaName={dasha.name}
                            isLoading={false}
                            className="border-none shadow-none"
                        />
                    )}
                </div>
            )}
        </DashboardCard>
    );
}

// Ashtakavarga Box Component
interface AshtakavargaBoxProps {
    ashtakavarga: SelectedItemDetail;
    clientId: string;
    activeSystem: string;
    onRemove: () => void;
    size: WidgetSize;
    collapsed: boolean;
    onSizeChange?: (s: WidgetSize) => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
}

function AshtakavargaBox({ ashtakavarga, clientId, activeSystem, onRemove, size, collapsed, onSizeChange, onDuplicate, onCollapseToggle }: AshtakavargaBoxProps) {
    const { processedCharts, isGeneratingCharts } = useVedicClient();
    const isBhinna = ashtakavarga.id === 'ashtakavarga_bhinna';
    const ashtakaType: 'sarva' | 'bhinna' = isBhinna ? 'bhinna' : 'sarva';

    const rawData = processedCharts[`${ashtakavarga.id}_${activeSystem}`]?.chartData;
    const isAshtakaLoading = !rawData && isGeneratingCharts;

    const ashtakaData = React.useMemo(() => {
        if (!rawData) return null;
        const apiData = (rawData.data || rawData) as any;
        
        console.log('[AshtakavargaBox] isBhinna:', isBhinna, 'apiData keys:', Object.keys(apiData));
        
        // Handle Bhinna Ashtakavarga (BAV) - individual planetary contributions
        if (isBhinna && apiData.ashtakvarga) {
            const ashtakvarga = apiData.ashtakvarga;
            if (ashtakvarga.tables && Array.isArray(ashtakvarga.tables)) {
                const contributors = ashtakvarga.tables.map((t: any) => ({
                    contributor: t.planet || t.name || 'Unknown',
                    bindus: t.bindus || []
                }));
                return { ...apiData, bhinnashtakavarga: ashtakvarga, contributors };
            }
            const planets = Object.keys(ashtakvarga).filter(k =>
                ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna', 'Ascendant'].includes(k)
            );
            if (planets.length > 0) {
                const contributors = planets.map(planet => ({
                    contributor: planet,
                    bindus: Array.isArray(ashtakvarga[planet]) ? ashtakvarga[planet] : []
                }));
                return { ...apiData, bhinnashtakavarga: ashtakvarga, contributors };
            }
        }
        
        // Handle Sarvashtakavarga (SAV) - combined totals
        // The API returns sarvashtakavarga as: { signs, houses, matrix_table, total_bindus }
        // The matrix_table contains the planet data
        if (!isBhinna) {
            const sarvaData = apiData.sarvashtakavarga || apiData.ashtakvarga?.sarvashtakavarga;
            
            if (sarvaData) {
                console.log('[AshtakavargaBox] Found sarvashtakavarga:', Object.keys(sarvaData));
                
                // Extract planet data from matrix_table if it exists
                // matrix_table format: [{ planet: 'Sun', bindus: [1,2,3...] }, ...]
                if (sarvaData.matrix_table && Array.isArray(sarvaData.matrix_table)) {
                    const planetData: Record<string, number[]> = {};
                    sarvaData.matrix_table.forEach((row: any) => {
                        if (row.planet && Array.isArray(row.bindus)) {
                            planetData[row.planet] = row.bindus;
                        }
                    });
                    console.log('[AshtakavargaBox] Extracted planets from matrix_table:', Object.keys(planetData));
                    return { 
                        ...apiData, 
                        sarvashtakavarga: sarvaData,
                        bhinnashtakavarga: planetData 
                    };
                }
                
                // Fallback: if sarvaData has planet arrays directly
                const hasPlanetArrays = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].some(
                    p => Array.isArray(sarvaData[p]) && sarvaData[p].length === 12
                );
                if (hasPlanetArrays) {
                    return { 
                        ...apiData, 
                        sarvashtakavarga: sarvaData,
                        bhinnashtakavarga: sarvaData 
                    };
                }
            }
        }
        
        // Fallback: return apiData as-is if it has the right structure
        console.log('[AshtakavargaBox] Fallback, apiData keys:', Object.keys(apiData));
        return apiData;
    }, [rawData, isBhinna]);

    const hasData = !!ashtakaData && !isAshtakaLoading;

    return (
        <DashboardCard
            title={ashtakavarga.name}
            description={ashtakavarga.description}
            badge={<span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">Ashtakavarga</span>}
            size={size}
            collapsed={collapsed}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onCollapseToggle={onCollapseToggle}
            onSizeChange={onSizeChange}
        >
            {!hasData ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-emerald-300 mb-3" />
                    <p className="text-[11px] text-ink/50 mb-4">Ashtakavarga data loading...</p>
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="h-full overflow-auto p-2">
                    <AshtakavargaMatrix type={ashtakaType} data={ashtakaData} />
                </div>
            )}
        </DashboardCard>
    );
}

function EmptyChartsState({ onAddClick }: { onAddClick: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-12">
            <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[28px] text-ink mb-3")}>Your Chart Canvas is Empty</h3>
            <p className={cn(TYPOGRAPHY.label, "max-w-lg mx-auto opacity-50 mb-8 text-[14px] leading-relaxed")}>
                Add Divisional Charts, Dashas, Ashtakavargas, Yogas & Doshas, Shadbala, Gochar, Upaya, or Sudarshan Chakra widgets to build your personalized dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                    onClick={onAddClick}
                    className="px-8 py-4 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Widgets
                </button>
            </div>
            <p className="mt-8 text-[10px] text-ink/30 uppercase tracking-widest font-bold">
                Your selection will be saved automatically
            </p>
        </div>
    );
}

function AnalysisPanel({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-3xl prem-card h-full flex flex-col">
            <h4 className={cn(TYPOGRAPHY.value, "mb-4 text-[14px] font-black uppercase tracking-tight text-ink/40 border-b border-gold-primary/20 pb-3")}>{title}</h4>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
}

// Modal Component
function NavigationModal({ isOpen, onClose, sections, onSelect, activeId, ayanamsa }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-2xl bg-white prem-card rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Modal Header */}
                <div className="p-8 border-b border-gold-primary/20 flex items-center justify-between bg-surface-warm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <LayoutGrid className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-black text-ink tracking-tight uppercase leading-none mb-1">Celestial Navigator</h2>
                            <p className="text-[10px] text-gold-dark uppercase font-bold tracking-[0.2em]">{ayanamsa} Optimization Hub</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-gold-primary/20 rounded-xl transition-all text-ink/40 hover:text-ink"
                    >
                        <RefreshCw className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Modal Grid */}
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {sections.map((section: any) => (
                        <button
                            key={section.id}
                            onClick={() => onSelect(section.id)}
                            className={cn(
                                "flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all text-left group",
                                activeId === section.id
                                    ? "bg-primary border-primary shadow-xl ring-2 ring-primary/20"
                                    : "bg-surface-warm/30 border-gold-primary/20 hover:border-primary/40 hover:bg-white"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-xl transition-all",
                                activeId === section.id ? "bg-gold-primary text-white" : "bg-white text-gold-dark group-hover:text-ink shadow-sm"
                            )}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "text-[12px] font-black uppercase tracking-tight mb-1",
                                    activeId === section.id ? "text-white" : "text-ink"
                                )}>
                                    {section.name}
                                </p>
                                <p className={cn(
                                    "text-[10px] leading-snug font-medium line-clamp-1",
                                    activeId === section.id ? "text-white/60" : "text-ink/40"
                                )}>
                                    {section.desc}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-surface-warm/20 text-center border-t border-gold-primary/20">
                    <p className="text-[9px] text-gold-dark uppercase font-black tracking-widest opacity-50">Select a cosmic alignment to recalibrate your view</p>
                </div>
            </div>
        </div>
    );
}

// Chart Selector Modal
interface ChartSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableCharts: CustomizeChartItem[];
    selectedCharts: string[];
    onSelect: (chartId: string) => void;
    currentAyanamsa: string;
    activeSection?: string;
}

const AYANAMSA_OPTIONS = [
    { id: 'lahiri', name: 'Lahiri', label: 'Chitrapaksha (Lahiri)' },
    { id: 'raman', name: 'Raman', label: 'B.V. Raman' },
    { id: 'kp', name: 'KP', label: 'Krishnamurti (KP)' },
    { id: 'yukteswar', name: 'Yukteswar', label: 'Swami Sri Yukteswar' },
    { id: 'bhasin', name: 'Bhasin', label: 'Bhasin' },
];

function ChartSelectorModal({
    isOpen,
    onClose,
    availableCharts,
    selectedCharts,
    onSelect,
    currentAyanamsa,
    activeSection
}: ChartSelectorModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedAyanamsa, setSelectedAyanamsa] = useState<string>(currentAyanamsa.toLowerCase());

    // Filter charts based on selected ayanamsa
    const chartsForAyanamsa = useMemo(() => {
        const isLahiri = selectedAyanamsa === 'lahiri';
        return availableCharts.filter(chart => {
            // Rare shodash and Lahiri-only widgets are only available for Lahiri
            if (chart.category === 'rare_shodash' || chart.lahiriOnly) {
                return isLahiri;
            }
            return true;
        });
    }, [availableCharts, selectedAyanamsa]);

    // Reset category when ayanamsa or section changes
    useEffect(() => {
        setActiveCategory('all');
    }, [selectedAyanamsa, activeSection]);

    if (!isOpen) return null;

    const isLahiri = selectedAyanamsa === 'lahiri';
    const isKp = selectedAyanamsa === 'kp';

    // Categories based on selected ayanamsa (matching subheader sections exactly)
    const getSectionCategories = () => {
        if (isKp) {
            return [
                { id: 'all', name: 'All Items', count: chartsForAyanamsa.length },
                {
                    id: 'kp-ruling',
                    name: 'Ruling Planets',
                    count: chartsForAyanamsa.filter(c => c.id === 'kp_ruling_planets' || c.id === 'kp_pars_fortuna').length
                },
                {
                    id: 'kp-foundation',
                    name: 'Planets & Cusps',
                    count: chartsForAyanamsa.filter(c => c.id === 'kp_planets_cusps').length
                },
                {
                    id: 'kp-structures',
                    name: 'Cuspal Chart',
                    count: chartsForAyanamsa.filter(c => c.id === 'kp_bhava_details').length
                },
                {
                    id: 'kp-insights',
                    name: 'Significations',
                    count: chartsForAyanamsa.filter(c =>
                        c.id === 'kp_house_significations' ||
                        c.id === 'kp_planetary_significators' ||
                        c.id === 'kp_interlinks' ||
                        c.id === 'kp_advanced_ssl' ||
                        c.id === 'kp_nakshatra_nadi'
                    ).length
                },
            ].filter(cat => cat.count > 0 || cat.id === 'all');
        }

        const capabilities = clientApi.getSystemCapabilities(selectedAyanamsa);
        const categories: { id: string; name: string; count: number }[] = [
            { id: 'all', name: 'All Items', count: chartsForAyanamsa.length },
        ];

        // Divisional Charts
        if (capabilities.hasDivisional) {
            categories.push({
                id: 'customize-charts',
                name: 'Divisional Charts',
                count: chartsForAyanamsa.filter(c => c.category === 'divisional' || c.category === 'lagna' || c.category === 'rare_shodash').length
            });
        }

        // Dashas - always available for vedic systems
        categories.push({
            id: 'vedic-dashas',
            name: 'Dashas',
            count: chartsForAyanamsa.filter(c => c.category === 'dasha').length
        });

        // Yogas & Doshas - Lahiri only (matches subheader systemFilter)
        if (['lahiri'].includes(selectedAyanamsa)) {
            categories.push({
                id: 'vedic-analysis',
                name: 'Yogas & Doshas',
                count: chartsForAyanamsa.filter(c => c.category === 'widget_yoga' || c.category === 'widget_dosha').length
            });
        }

        // Ashtakavargas
        if (capabilities.hasAshtakavarga) {
            categories.push({
                id: 'vedic-ashtakavarga',
                name: 'Ashtakavargas',
                count: chartsForAyanamsa.filter(c => c.category === 'ashtakavarga' || c.category === 'widget_shodasha').length
            });
        }

        // Shadbala - Lahiri only
        if (capabilities.features.shadbala.length > 0) {
            categories.push({
                id: 'vedic-strength',
                name: 'Shadbala',
                count: chartsForAyanamsa.filter(c => c.id === 'widget_shadbala').length
            });
        }

        // Gochar - Lahiri, Yukteswar, Bhasin only (matches subheader systemFilter)
        if (capabilities.charts.special.includes('transit') && ['lahiri', 'yukteswar', 'bhasin'].includes(selectedAyanamsa)) {
            categories.push({
                id: 'vedic-gochar',
                name: 'Gochar',
                count: chartsForAyanamsa.filter(c => c.id === 'widget_transit').length
            });
        }

        // Upaya - Lahiri only
        if (['lahiri'].includes(selectedAyanamsa)) {
            categories.push({
                id: 'vedic-upaya',
                name: 'Upaya',
                count: chartsForAyanamsa.filter(c => c.category === 'widget_remedy').length
            });
        }

        // Sudarshan Chakra
        if (capabilities.charts.special.includes('sudarshana')) {
            categories.push({
                id: 'vedic-chakra',
                name: 'Sudarshan Chakra',
                count: chartsForAyanamsa.filter(c => c.id === 'widget_chakra').length
            });
        }

        return categories.filter(cat => cat.count > 0 || cat.id === 'all');
    };

    const categories = getSectionCategories();

    const filteredCharts = chartsForAyanamsa.filter(chart => {
        const matchesSearch = chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chart.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = activeCategory === 'all';
        if (!matchesCategory) {
            // Map category (section) to chart types - matching subheader section IDs
            switch (activeCategory) {
                case 'customize-charts':
                    matchesCategory = chart.category === 'divisional' || chart.category === 'lagna' || chart.category === 'rare_shodash';
                    break;
                case 'vedic-dashas':
                    matchesCategory = chart.category === 'dasha';
                    break;
                case 'vedic-analysis':
                    matchesCategory = chart.category === 'widget_yoga' || chart.category === 'widget_dosha';
                    break;
                case 'vedic-ashtakavarga':
                    matchesCategory = chart.category === 'ashtakavarga' || chart.category === 'widget_shodasha';
                    break;
                case 'vedic-strength':
                    matchesCategory = chart.id === 'widget_shadbala';
                    break;
                case 'vedic-gochar':
                    matchesCategory = chart.id === 'widget_transit';
                    break;
                case 'vedic-upaya':
                    matchesCategory = chart.category === 'widget_remedy';
                    break;
                case 'vedic-chakra':
                    matchesCategory = chart.id === 'widget_chakra';
                    break;
                case 'kp-ruling':
                    matchesCategory = chart.id === 'kp_ruling_planets' || chart.id === 'kp_pars_fortuna';
                    break;
                case 'kp-foundation':
                    matchesCategory = chart.id === 'kp_planets_cusps';
                    break;
                case 'kp-structures':
                    matchesCategory = chart.id === 'kp_bhava_details';
                    break;
                case 'kp-insights':
                    matchesCategory =
                        chart.id === 'kp_house_significations' ||
                        chart.id === 'kp_planetary_significators' ||
                        chart.id === 'kp_interlinks' ||
                        chart.id === 'kp_advanced_ssl' ||
                        chart.id === 'kp_nakshatra_nadi';
                    break;
                default:
                    matchesCategory = chart.category === activeCategory;
            }
        }
        
        const notSelected = !selectedCharts.includes(chart.id);
        return matchesSearch && matchesCategory && notSelected;
    });

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-primary/50 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-3xl bg-white prem-card rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Modal Header */}
                <div className="p-6 border-b border-gold-primary/20 bg-surface-warm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-black text-ink tracking-tight uppercase leading-none">Add Widgets</h2>
                                <p className="text-[10px] text-gold-dark uppercase font-bold tracking-[0.15em] mt-1">Select charts, widgets & tools</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-gold-primary/20 rounded-xl transition-all text-ink/40 hover:text-ink"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dropdowns Only */}
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ayanamsa */}
                        <div className="relative">
                            <label className="block text-[10px] text-gold-dark uppercase font-black tracking-wider mb-2">Ayanamsa</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                                <select
                                    value={selectedAyanamsa}
                                    onChange={(e) => setSelectedAyanamsa(e.target.value)}
                                    className="w-full appearance-none pl-10 pr-10 py-3 bg-white border border-gold-primary/20 rounded-xl text-[13px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer hover:border-gold-primary/40"
                                >
                                    {AYANAMSA_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <label className="block text-[10px] text-gold-dark uppercase font-black tracking-wider mb-2">Category</label>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                                <select
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                    className="w-full appearance-none pl-10 pr-10 py-3 bg-white border border-gold-primary/20 rounded-xl text-[13px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer hover:border-gold-primary/40"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} ({cat.count})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                            </div>
                        </div>

                        {/* Specific Chart */}
                        <div className="relative">
                            <label className="block text-[10px] text-gold-dark uppercase font-black tracking-wider mb-2">Widget</label>
                            <div className="relative">
                                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            onSelect(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                    className="w-full appearance-none pl-10 pr-10 py-3 bg-white border border-gold-primary/20 rounded-xl text-[13px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer hover:border-gold-primary/40 disabled:opacity-50"
                                    disabled={filteredCharts.length === 0}
                                >
                                    <option value="">
                                        {filteredCharts.length === 0 ? "No items available" : `Choose widget (${filteredCharts.length})`}
                                    </option>
                                    {filteredCharts.map(chart => (
                                        <option key={chart.id} value={chart.id}>
                                            {chart.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
