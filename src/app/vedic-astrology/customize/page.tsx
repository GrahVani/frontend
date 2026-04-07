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
import { useCustomizeCharts, type CustomizeChartItem, type WidgetSize, type SelectedItemDetail, CHART_CATALOG } from '@/hooks/useCustomizeCharts';
import { renderWidget, getWidgetSizeClasses, WIDGET_SCALE_CONFIG } from './WidgetBoxes';

// Components
import { ChartWithPopup, CompactChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import SouthIndianChart, { ChartColorMode } from '@/components/astrology/SouthIndianChart';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import OtherDashaTable from '@/components/astrology/OtherDashaTable';
import IntegratedDashaViewer from '@/components/astrology/IntegratedDashaViewer';
import { AYANAMSA_HIERARCHY, AYANAMSA_CONFIGS, AYANAMSA_SYSTEMS, type AyanamsaSystem, isChartCompatible } from './ayana-types';
import AyanamsaSelect from './AyanamsaSelect';
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
    useKpHouseSignifications,
    useKpPlanetSignificators,
} from '@/hooks/queries/useKP';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';

type SectionId =
    | 'vedic-foundation' | 'vedic-charts' | 'vedic-dashas' | 'vedic-analysis' | 'vedic-strength'
    | 'kp-foundation' | 'kp-structures' | 'kp-insights' | 'kp-ruling';

export default function CustomizePage() {
    const { clientDetails, processedCharts, isGeneratingCharts, isLoadingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa: globalAyanamsa, chartStyle, chartColorTheme } = useAstrologerStore();
    const [localAyanamsa, setLocalAyanamsa] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('grahvani_customize_ayanamsa') || globalAyanamsa;
        }
        return 'Lahiri';
    });

    useEffect(() => {
        localStorage.setItem('grahvani_customize_ayanamsa', localAyanamsa);
    }, [localAyanamsa]);
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
        isLahiri,
        updateChartAyanamsa
    } = useCustomizeCharts();

    const activeSystem = localAyanamsa.toLowerCase();
    const activeIsKp = activeSystem.includes('kp');
    const isKpSystem = activeIsKp; // Page-local system indicator
    const clientId = clientDetails?.id || '';

    // State
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
    const [customizationPanel, setCustomizationPanel] = useState<{ isOpen: boolean; selectedChart?: string }>({ isOpen: false });

    // Column count for grid layout (like divisional charts)
    const [columnCount, setColumnCount] = useState<1 | 2 | 3 | 4 | 5>(3);

    // --- KP DATA (FORCED DISABLED IN DASHBOARD - DB ONLY) ---
    // We only need the presence of data for 'ready' indicators if needed, 
    // but we'll stick to database-only lookups in components.
    const kpPlanetsCuspsRaw = processedCharts[`kp_planets_cusps_kp`]?.chartData;
    const kpPlanetsCusps = kpPlanetsCuspsRaw ? (kpPlanetsCuspsRaw.data || kpPlanetsCuspsRaw) : null;

    // Shodasha varga data for analysis section
    const shodashaData = useMemo(() => {
        const shodashaKey = `ashtakavarga_shodasha_${activeSystem}`;
        const shodashaKpKey = `shodasha_varga_signs_${activeSystem}`;
        const raw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
        return raw ? (raw.data || raw) : null;
    }, [processedCharts, activeSystem]);

    // --- VEDIC DATA (Database-first lookup) ---
    const { dashaResponse, dashaLoading } = useMemo(() => {
        const dashaKey = `vimshottari_${activeSystem}`;
        const raw = processedCharts[dashaKey]?.chartData;
        return {
            dashaResponse: raw ? { data: raw } : null,
            dashaLoading: !raw && isLoadingCharts
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    const ashtakavargaRaw = processedCharts[`ashtakavarga_sarva_${activeSystem}`]?.chartData;
    const ashtakavargaData = useMemo(() => {
        return ashtakavargaRaw ? (ashtakavargaRaw.data || ashtakavargaRaw) : null;
    }, [ashtakavargaRaw]);
    const ashtakavargaLoading = !ashtakavargaData && isGeneratingCharts;

    const { shadbalaResult, shadbalaLoading } = useMemo(() => {
        const raw = processedCharts[`shadbala_lahiri`]?.chartData;
        return {
            shadbalaResult: raw ? { data: raw } : null,
            shadbalaLoading: !raw && isLoadingCharts
        };
    }, [processedCharts, isLoadingCharts]);

    // Normalized Shadbala Data
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

    const sections = useMemo(() => [
        { id: 'customize-charts', name: 'Customize Charts', icon: LayoutGrid, desc: 'Add, remove and arrange your charts' },
    ], []);

    // Handle adding a chart
    const handleAddChart = async (chartId: string, customSystem?: string) => {
        // Find the catalog entry to check for required systems
        const chartCatalog = CHART_CATALOG.find((c: CustomizeChartItem) => c.id === chartId);
        const requiredSystem = chartCatalog?.requiredSystem;
        const targetAyanamsa = customSystem || requiredSystem || activeSystem;

        addChart(chartId, targetAyanamsa);
        setIsChartSelectorOpen(false);

        // Check if this is a widget (widgets don't need chart generation)
        const category = chartCatalog?.category || '';
        const isWidget = category.startsWith('widget_') ||
            category === 'kp_module';

        // Check if chart exists, if not generate it (skip for widgets/dashas)
        /* 
        const chartKey = `${chartId}_${targetAyanamsa}`;
        if (!isWidget && !processedCharts[chartKey] && clientId) {
            setGeneratingCharts(prev => new Set(prev).add(chartId));
            try {
                await generateMissingChart(clientId, chartId, targetAyanamsa);
                await refreshCharts();
            } catch (err: any) {
                console.warn(`Feature generation skipped for ${chartId}: ${err.message || err}`);
            }
            setGeneratingCharts(prev => {
                const next = new Set(prev);
                next.delete(chartId);
                return next;
            });
        }
        */
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
    const getChartProps = (id: string, itemAyanamsa?: string) => {
        const targetSystem = (itemAyanamsa || activeSystem).toLowerCase();
        const chartData = processedCharts[`${id}_${targetSystem}`]?.chartData || null;
        return parseChartData(chartData);
    };

    // Check if a chart is available
    const isChartAvailable = (chartId: string, itemAyanamsa?: string) => {
        const targetSystem = (itemAyanamsa || activeSystem).toLowerCase();
        if (targetSystem === 'kp') {
            if (chartId === 'kp_planets') return !!kpPlanetsCusps;
        }
        return !!processedCharts[`${chartId}_${targetSystem}`];
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
    const renderWorkbench = () => {
        return (
            <section className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
                {/* Workbench Toolbar — matching mockup */}
                <div
                    className="flex items-center gap-4 px-6 py-2 bg-surface-warm/95 backdrop-blur-sm border-b border-gold-primary/20 sticky top-0 z-30 shadow-sm w-full"
                >
                    {/* Left: Brand + Actions */}
                    <span
                        className="font-serif font-bold text-[16px] tracking-[0.12em] uppercase select-none shrink-0"
                        style={{
                            background: 'linear-gradient(to bottom, #D4AD5A 0%, #C9A24D 40%, #9C7A2F 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Grahvani
                    </span>

                    <button
                        onClick={() => setIsChartSelectorOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shrink-0 active:scale-95 transition-all hover:brightness-110 shadow-sm"
                        style={{
                            background: 'linear-gradient(180deg, #E6C97A 0%, #C9A24D 50%, #9C7A2F 100%)',
                            border: '1px solid #9C7A2F',
                            color: '#3E2A1F',
                        }}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Widget
                    </button>

                    {selectedItems.length > 0 && (
                        <button
                            onClick={resetToDefaults}
                            className="text-[11px] font-black uppercase tracking-widest text-ink hover:text-red-700 transition-all shrink-0 bg-red-50/50 px-2 py-0.5 rounded-md border border-red-200/30"
                        >
                            Clear All
                        </button>
                    )}

                    <div className="flex-1" />

                    {/* Right: Column Selection + Widget Count */}
                    {selectedItems.length > 0 && (
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-ink/80 hidden md:inline">
                                Column Selection
                            </span>
                            <div className="flex items-center gap-0.5" role="group" aria-label="Grid column count">
                                {([1, 2, 3, 4, 5] as const).map((col) => (
                                    <button
                                        key={col}
                                        onClick={() => setColumnCount(col)}
                                        className={cn(
                                            "w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold transition-all",
                                            columnCount === col
                                                ? "text-white shadow-md font-black scale-110"
                                                : "text-gold-dark/80 hover:text-gold-dark hover:bg-gold-primary/10 font-bold"
                                        )}
                                        style={columnCount === col ? {
                                            background: 'linear-gradient(180deg, #D4AD5A 0%, #C9A24D 50%, #9C7A2F 100%)',
                                            boxShadow: '0 1px 3px rgba(156,122,47,0.4)',
                                        } : undefined}
                                        aria-label={`${col} column${col > 1 ? 's' : ''}`}
                                        aria-pressed={columnCount === col}
                                    >
                                        {col}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-5 bg-gold-primary/20" />

                            <div className="flex items-center gap-1.5">
                                <LayoutGrid className="w-3.5 h-3.5 text-gold-dark/50" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-gold-dark/70">
                                    {selectedItems.length} Active Widget{selectedItems.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts Grid */}
                {selectedItems.length === 0 ? (
                    <EmptyChartsState
                        onAddClick={() => setIsChartSelectorOpen(true)}
                    />
                ) : (
                    <div className={cn(
                        "grid gap-0",
                        columnCount === 1 && "grid-cols-1",
                        columnCount === 2 && "grid-cols-2",
                        columnCount === 3 && "grid-cols-3",
                        columnCount === 4 && "grid-cols-4",
                        columnCount === 5 && "grid-cols-5"
                    )} style={{ gridTemplateRows: 'repeat(auto-fill, minmax(280px, 1fr))', maxHeight: 'calc(100vh - 145px)', overflow: 'auto' }}>
                        {/* Render All Items in Order */}
                        {selectedChartDetails.map((item) => {
                            const isWidget = item.category.startsWith('widget_') || item.category === 'kp_module';
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
                                            onAyanamsaChange: (a) => updateChartAyanamsa(item.instanceId, a),
                                        }, clientId, item.ayanamsa || activeSystem)
                                    ) : item.category === 'dasha' ? (
                                        <DashaBox
                                            dasha={item}
                                            clientId={clientId}
                                            activeSystem={item.ayanamsa || activeSystem}
                                            onRemove={() => handleRemoveChart(item.instanceId)}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            {...commonProps}
                                        />
                                    ) : item.category === 'ashtakavarga' ? (
                                        <AshtakavargaBox
                                            ashtakavarga={item}
                                            clientId={clientId}
                                            activeSystem={item.ayanamsa || activeSystem}
                                            onRemove={() => handleRemoveChart(item.instanceId)}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            {...commonProps}
                                        />
                                    ) : (
                                        <DraggableChartBox
                                            chart={item}
                                            chartProps={getChartProps(item.id, item.ayanamsa)}
                                            isAvailable={isChartAvailable(item.id, item.ayanamsa)}
                                            isGenerating={generatingCharts.has(item.id)}
                                            theme={chartColorTheme}
                                            style={chartStyle}
                                            onRemove={() => handleRemoveChart(item.instanceId)}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            {...commonProps}
                                            clientId={clientId}
                                            activeSystem={item.ayanamsa || activeSystem}
                                            refreshCharts={refreshCharts}
                                            isKpSystem={isKpSystem}
                                            // Divisional charts features
                                            isHouseDetailsOpen={openHouseDetails.has(item.instanceId)}
                                            onToggleHouseDetails={() => toggleHouseDetails(item.instanceId)}
                                            colorMode={chartColorModes[item.instanceId]}
                                            onToggleColorMode={() => toggleChartColorMode(item.instanceId)}
                                            onZoom={() => {
                                                const zoomProps = getChartProps(item.id, item.ayanamsa);
                                                setZoomModalData({
                                                    isOpen: true,
                                                    chartType: item.id,
                                                    chartName: item.name,
                                                    chartDesc: item.description,
                                                    planets: zoomProps.planets,
                                                    ascendant: zoomProps.ascendant,
                                                    chartData: processedCharts[`${item.id}_${item.ayanamsa || activeSystem}`]?.chartData || null
                                                });
                                            }}
                                            onLearn={() => setCustomizationPanel({ isOpen: true, selectedChart: item.id })}
                                            houseData={(() => {
                                                const hProps = getChartProps(item.id, item.ayanamsa);
                                                return getHouseDistributionFromPlanets(hProps.planets, hProps.ascendant);
                                            })()}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        {/* Ghost Add Card — only visible if space permits or as a fallback */}
                        {selectedItems.length < 6 && (
                            <div
                                onClick={() => !draggedIdRef.current && setIsChartSelectorOpen(true)}
                                onDragOver={(e) => handleDragOver(e, '__ghost__')}
                                onDragLeave={handleDragLeave}
                                onDrop={handleGhostDrop}
                                className={cn(
                                    "border border-dashed rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 min-h-[280px] h-full",
                                    dragOverInstanceId === '__ghost__'
                                        ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                                        : "border-gold-primary/60 hover:border-gold-primary/80 hover:bg-white/30 bg-white/10 shadow-sm"
                                )}
                            >
                                <Plus className={cn(
                                    "w-4 h-4 transition-colors pointer-events-none",
                                    dragOverInstanceId === '__ghost__' ? "text-primary/60" : "text-gold-primary/70"
                                )} />
                                <span className={cn(
                                    "text-[10px] font-bold transition-colors pointer-events-none",
                                    dragOverInstanceId === '__ghost__' ? "text-primary/70" : "text-ink/60"
                                )}>
                                    {dragOverInstanceId === '__ghost__' ? 'Drop' : '+ Add'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </section>
        );
    };



    const renderPageContent = () => {
        return renderWorkbench();
    };

    return (
        <div className="flex flex-col gap-0 animate-in fade-in duration-700 w-[calc(100%+2rem)] -mx-4 -mt-4" style={{ height: 'calc(100vh - 104px)' }}>
            <div className="flex-1 flex flex-col min-h-0">
                <main className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 flex flex-col min-h-0">
                        {renderPageContent()}
                    </div>
                </main>
            </div>

            {/* CHART SELECTOR MODAL */}
            <ChartSelectorModal
                isOpen={isChartSelectorOpen}
                onClose={() => setIsChartSelectorOpen(false)}
                availableCharts={availableCharts}
                selectedCharts={selectedChartDetails.map(i => `${i.id}_${(i.ayanamsa || activeSystem).toLowerCase()}`)}
                onSelect={handleAddChart}
                currentAyanamsa={localAyanamsa}
                onAyanamsaChange={setLocalAyanamsa}
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

            {/* CUSTOMIZATION PANEL */}
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
    ayanamsa?: string;
    onAyanamsaChange?: (a: AyanamsaSystem) => void;
    disableContentZoom?: boolean;
}

function DashboardCard({ title, description, badge, size, collapsed, children, onRemove, onDuplicate, onCollapseToggle, onSizeChange, ayanamsa, onAyanamsaChange, disableContentZoom }: DashboardCardProps) {
    const scaleConfig = WIDGET_SCALE_CONFIG[size] || WIDGET_SCALE_CONFIG.medium;
    const effectiveZoom = disableContentZoom ? 1 : scaleConfig.zoom;

    return (
        <div
            className="bg-[#FDFBF7] border border-[#E6D5B8]/40 rounded p-1 shadow-sm relative group hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            style={{ height: 'calc((100vh - 200px) / 2)', minHeight: scaleConfig.minHeight }}
            data-widget-size={size}
        >
            <div className="flex items-center justify-between mb-1 shrink-0 px-0.5 pt-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1 flex-wrap shrink-0">{badge}</div>
                    <h4 className={cn(
                        "font-black text-ink uppercase tracking-tight truncate",
                        scaleConfig.titleMaxW
                    )} style={{ fontSize: `max(9px, ${10 * scaleConfig.zoom}px)` }}>
                        {title}
                    </h4>
                    {onAyanamsaChange && (
                        <div className="ml-auto mr-2">
                            <AyanamsaSelect
                                value={ayanamsa || 'Lahiri'}
                                onChange={onAyanamsaChange}
                                compact
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className={cn("flex items-center gap-1.5 font-black text-ink/30 mr-1 uppercase", scaleConfig.headerText)}>
                        {(['S', 'M', 'L', 'F'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    if (!onSizeChange) return;
                                    const map: Record<string, WidgetSize> = { S: 'small', M: 'medium', L: 'large', F: 'full' };
                                    onSizeChange(map[s]);
                                }}
                                className={cn(
                                    "hover:text-gold-dark transition-colors",
                                    (size === 'small' && s === 'S') ||
                                        (size === 'medium' && s === 'M') ||
                                        (size === 'large' && s === 'L') ||
                                        (size === 'full' && s === 'F')
                                        ? "text-gold-dark font-black"
                                        : ""
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={onRemove}
                        className="text-ink/20 hover:text-red-500 transition-colors"
                        title="Remove"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            {!collapsed && (
                <div className={cn(
                    "flex-1 relative bg-transparent rounded min-h-0",
                    disableContentZoom ? "overflow-hidden" : "overflow-auto"
                )}>
                    {disableContentZoom ? children : (
                        <div style={{ zoom: effectiveZoom, minHeight: '100%' }}>
                            {children}
                        </div>
                    )}
                </div>
            )}
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
    onAyanamsaChange?: (a: string) => void;
    // Divisional charts features
    isHouseDetailsOpen?: boolean;
    onToggleHouseDetails?: () => void;
    colorMode?: ChartColorMode;
    onToggleColorMode?: () => void;
    onZoom?: () => void;
    onLearn?: () => void;
    houseData?: Record<number, { planets: { name: string; degree: string; isRetro: boolean }[]; signName: string }>;
    isKpSystem?: boolean;
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
    isHouseDetailsOpen,
    onToggleHouseDetails,
    colorMode,
    onToggleColorMode,
    onZoom,
    onLearn,
    houseData,
    isKpSystem,
    onAyanamsaChange
}: DraggableChartBoxProps) {
    const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

    const handleGenerate = async () => {
        if (!clientId) return;
        setIsGeneratingLocal(true);
        const targetAyanamsa = chart.ayanamsa || activeSystem;
        try {
            await clientApi.generateChart(clientId, chart.id, targetAyanamsa);
            await refreshCharts();
        } catch (error) {
            console.error(`Failed to generate ${chart.id} (${targetAyanamsa}):`, error);
        } finally {
            setIsGeneratingLocal(false);
        }
    };

    const chartAyanamsa = chart.ayanamsa || activeSystem;

    return (
        <DashboardCard
            title={`${chart.name} (${chartAyanamsa})`}
            description={chart.description}
            badge={
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-medium capitalize tracking-wide",
                    chart.category === 'rare_shodash' ? "bg-amber-100 text-amber-700" :
                        chart.category === 'lagna' ? "bg-blue-100 text-blue-700" :
                            "bg-gold-primary/10 text-gold-dark"
                )}>
                    {chart.category === 'rare_shodash' ? 'Rare' : chart.category}
                </span>
            }
            size={size}
            collapsed={collapsed}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onCollapseToggle={onCollapseToggle}
            onSizeChange={onSizeChange}
            ayanamsa={chartAyanamsa}
            onAyanamsaChange={onAyanamsaChange}
            disableContentZoom
        >
            {!isAvailable ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {!isChartCompatible(chart.id, chartAyanamsa) ? (
                        <>
                            <Shield className="w-8 h-8 text-gold-dark/40 mb-3" />
                            <p className="text-[10px] font-black uppercase text-gold-dark/60 tracking-wider mb-1 leading-tight px-4">
                                {chart.name}
                            </p>
                            <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest px-2">
                                Not compatible with {chartAyanamsa}
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-8 h-8 text-gold-dark/30 mb-3" />
                            <p className="text-[11px] text-ink/50 mb-4">{chart.name} not generated</p>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || isGeneratingLocal}
                                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                                {(isGenerating || isGeneratingLocal) ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Generating...
                                    </div>
                                ) : 'Generate Now'}
                            </button>
                        </>
                    )}
                    {isKpSystem && isChartCompatible(chart.id, chartAyanamsa) && (
                        <div className="mt-4 text-[9px] text-gold-dark/60 font-medium px-4">
                            Fetch from main KP dashboard
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full flex flex-col p-1">
                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1 mb-1 shrink-0 overflow-x-auto no-scrollbar">
                        {onToggleHouseDetails && (
                            <button
                                onClick={onToggleHouseDetails}
                                className={cn(
                                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-all border",
                                    isHouseDetailsOpen
                                        ? "bg-gold-primary border-gold-dark text-white shadow-sm font-bold"
                                        : "bg-white border-[#E6D5B8]/40 text-primary hover:border-gold-primary hover:text-gold-dark"
                                )}
                            >
                                <House className="w-2.5 h-2.5" />
                                Houses
                            </button>
                        )}

                        {onLearn && (
                            <button
                                onClick={onLearn}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-white border border-[#E6D5B8]/40 text-ink hover:border-purple-300 hover:text-purple-600 transition-all text-xs"
                            >
                                <BookOpen className="w-2.5 h-2.5" />
                                Learn
                            </button>
                        )}

                        {onToggleColorMode && style === 'South Indian' && (
                            <button
                                onClick={onToggleColorMode}
                                className={cn(
                                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-all border",
                                    colorMode === 'blackwhite'
                                        ? "bg-zinc-800 border-zinc-900 text-white"
                                        : "bg-white border-[#E6D5B8]/40 text-primary hover:border-blue-300 hover:text-blue-600"
                                )}
                            >
                                <Sparkles className="w-2.5 h-2.5" />
                                Color
                            </button>
                        )}

                        {onZoom && (
                            <button
                                onClick={onZoom}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-white border border-[#E6D5B8]/40 text-ink hover:border-gold-primary hover:text-gold-dark transition-all ml-auto"
                            >
                                <Maximize2 className="w-2.5 h-2.5" />
                                Zoom
                            </button>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 relative">
                        {isGenerating ? (
                            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : null}

                        <div className="w-full h-full p-0">
                            {style === 'South Indian' ? (
                                <SouthIndianChart
                                    ascendantSign={chartProps.ascendant}
                                    planets={chartProps.planets}
                                    colorMode={colorMode || 'color'}
                                    colorTheme={theme}
                                    className="w-full h-full"
                                />
                            ) : (
                                <CompactChartWithPopup
                                    ascendantSign={chartProps.ascendant}
                                    planets={chartProps.planets}
                                    className="w-full h-full"
                                    showDegrees={chart.id === 'D1'}
                                />
                            )}
                        </div>
                    </div>

                    {/* House Details Panel */}
                    {isHouseDetailsOpen && houseData && (
                        <div className="bg-white rounded-lg border border-gold-primary/10 p-1.5 overflow-hidden">
                            <div className={cn(TYPOGRAPHY.label, "mb-1 text-ink/70 font-bold uppercase tracking-wider text-[9px]")}>House-wise Positions</div>
                            <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                    <div key={h} className={cn(
                                        "overflow-hidden rounded border border-gold-primary/10 transition-all",
                                        houseData[h]?.planets.length ? "bg-white shadow-sm" : "bg-gold-primary/5 opacity-60"
                                    )}>
                                        <div className={cn(
                                            "px-1.5 py-0.5 flex items-center justify-between border-b border-gold-primary/5",
                                            houseData[h]?.planets.length ? "bg-gold-primary/5" : "bg-transparent"
                                        )}>
                                            <span className="font-bold text-ink text-[9px]">H{h}</span>
                                            <span className="text-[8px] font-medium text-gold-dark">{houseData[h]?.signName?.substring(0, 3)}</span>
                                        </div>
                                        <div className="p-0.5 px-1 min-h-[16px] flex flex-col gap-0">
                                            {houseData[h]?.planets.length > 0 ? (
                                                houseData[h].planets.map((p, pIdx) => (
                                                    <div key={pIdx} className="flex items-center justify-between gap-1 text-[8px] leading-tight">
                                                        <span className="font-bold text-ink">{p.name}</span>
                                                        <span className="text-ink/60 font-sans text-[7px]">
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
                </div>
            )}
        </DashboardCard>
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
    onAyanamsaChange?: (a: string) => void;
}

function DashaBox({ dasha, clientId, activeSystem, onRemove, size, collapsed, onSizeChange, onDuplicate, onCollapseToggle, onAyanamsaChange }: DashaBoxProps) {
    const { processedCharts } = useVedicClient();
    const dashaKey = `${dasha.id}_${activeSystem}`;
    const cachedData = processedCharts[dashaKey]?.chartData;

    // Use vimshottari hook for vimshottari and tribhagi (tribhagi is a variation of vimshottari)
    const isVimshottari = dasha.id === 'vimshottari' || dasha.id === 'tribhagi';
    const { data: vimshottariData, isLoading: isVimshottariLoading } = useDasha(
        isVimshottari && !cachedData ? clientId : '',
        'mahadasha',
        activeSystem
    );
    // Use other dasha hook for non-vimshottari dashas
    const { data: otherDashaData, isLoading: isOtherDashaLoading } = useOtherDasha(
        !isVimshottari && !cachedData ? clientId : '',
        dasha.id,
        activeSystem,
        'mahadasha'
    );
    const dashaData = cachedData || (isVimshottari ? vimshottariData : otherDashaData);
    const isDashaLoading = !dashaData && (isVimshottari ? isVimshottariLoading : isOtherDashaLoading);
    const hasData = !!dashaData;

    return (
        <DashboardCard
            title={`${dasha.name} (${activeSystem})`}
            description={dasha.description}
            badge={<span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">Dasha</span>}
            size={size}
            collapsed={collapsed}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onCollapseToggle={onCollapseToggle}
            onSizeChange={onSizeChange}
            ayanamsa={activeSystem}
            onAyanamsaChange={onAyanamsaChange}
        >
            {!hasData ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {!isChartCompatible(dasha.id, activeSystem) ? (
                        <>
                            <Shield className="w-8 h-8 text-purple-300/40 mb-3" />
                            <p className="text-[10px] font-black uppercase text-purple-700/60 tracking-wider mb-1 px-4">
                                {dasha.name}
                            </p>
                            <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest px-2">
                                Not compatible with {activeSystem}
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-8 h-8 text-purple-300 mb-3" />
                            <p className="text-[11px] text-ink/50 mb-4">Dasha data loading...</p>
                            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        </>
                    )}
                </div>
            ) : (
                <div className="h-full overflow-hidden flex flex-col">
                    <IntegratedDashaViewer
                        dashaType={dasha.id}
                        clientId={clientId}
                        ayanamsa={activeSystem}
                        dashaData={dashaData}
                        isLoading={isDashaLoading}
                        compact
                    />
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
    onAyanamsaChange?: (a: string) => void;
}

import PremiumAshtakavargaMatrix from '@/components/astrology/PremiumAshtakavargaMatrix';

function AshtakavargaBox({
    ashtakavarga,
    activeSystem,
    clientId,
    size,
    collapsed,
    onRemove,
    onDuplicate,
    onCollapseToggle,
    onSizeChange,
    onAyanamsaChange,
}: {
    ashtakavarga: CustomizeChartItem;
    activeSystem: string;
    clientId: string;
    size: WidgetSize;
    collapsed: boolean;
    onRemove: () => void;
    onDuplicate: () => void;
    onCollapseToggle: () => void;
    onSizeChange: (s: WidgetSize) => void;
    onAyanamsaChange: (a: string) => void;
}) {
    const ashtakaKey = `${ashtakavarga.id}_${activeSystem}`;
    const { processedCharts, isGeneratingCharts } = useVedicClient();
    const rawData = processedCharts[ashtakaKey]?.chartData;
    const isAshtakaLoading = !rawData && isGeneratingCharts;
    const isBhinna = ashtakavarga.id === 'ashtakavarga_bhinna';
    const ashtakaType = ashtakavarga.id === 'ashtakavarga_sarva' ? 'sarva' : 'bhinna';

    const ashtakaData = useMemo(() => {
        if (!rawData) return null;
        const apiData = (rawData.data || rawData) as any;
        const SIGN_MAP: Record<string, number> = {
            'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
            'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12,
            'ARI': 1, 'TAU': 2, 'GEM': 3, 'CAN': 4, 'LEO': 5, 'VIR': 6, 'LIB': 7, 'SCO': 8, 'SAG': 9, 'CAP': 10, 'AQU': 11, 'PIS': 12
        };

        // Standardized lookup roots
        const sarvaRoot = apiData.sarvashtakavarga || apiData.ashtakvarga?.sarvashtakavarga || apiData.ashtakvarga || apiData.summary || apiData;
        const bhinnaRoot = apiData.bhinnashtakavarga || apiData.ashtakvarga?.bhinnashtakavarga || apiData.ashtakvarga || apiData;

        // 1. Process Sarvashtakavarga Matrix (Total bindus per sign)
        let sarvaMatrix: Record<number, number> = {};
        const sSigns = sarvaRoot.signs || sarvaRoot.houses_matrix || sarvaRoot.houses || sarvaRoot.sarvashtakavarga_summary || {};
        const houseMatrix = sarvaRoot.house_strength_matrix || apiData.house_strength_matrix;

        if (Array.isArray(houseMatrix)) {
            houseMatrix.forEach((h: any) => {
                const signId = SIGN_MAP[h.sign_name?.toString().charAt(0).toUpperCase() + h.sign_name?.toString().slice(1)] || h.house_number as number;
                if (signId && signId >= 1 && signId <= 12) sarvaMatrix[signId] = (h.total_points as number) || 0;
            });
        } else {
            Object.entries(sSigns).forEach(([s, v]) => {
                const signId = SIGN_MAP[s] || SIGN_MAP[s.toUpperCase()] || parseInt(s);
                if (signId && signId >= 1 && signId <= 12) sarvaMatrix[signId] = v as number;
            });
        }

        // 2. Process Bhinnashtakavarga Tables (All planets simultaneously)
        const bhinnaTables: Record<string, any> = {};
        const planetKeys = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        const aliases: Record<string, string[]> = {
            'Lagna': ['Lagna', 'Ascendant', 'Asc', 'As'],
            'Sun': ['Sun', 'Su'],
            'Moon': ['Moon', 'Moo', 'Mo'],
            'Mars': ['Mars', 'Mar', 'Ma'],
            'Mercury': ['Mercury', 'Mer', 'Me'],
            'Jupiter': ['Jupiter', 'Jup', 'Ju'],
            'Venus': ['Venus', 'Ven', 'Ve'],
            'Saturn': ['Saturn', 'Sat', 'Sa']
        };

        // Strategy A: Nested tables array (Common in Bhinna responses)
        // KP/Raman often return an array directly for 'ashtakvarga'
        const tables = Array.isArray(bhinnaRoot) ? bhinnaRoot : (bhinnaRoot.tables || bhinnaRoot.matrix_table || []);
        if (Array.isArray(tables)) {
            tables.forEach((t: any) => {
                const pName = t.planet || t.name;
                if (pName) {
                    const stdKey = planetKeys.find(pk => [pk, ...aliases[pk]].some(a => a.toLowerCase() === pName.toLowerCase()));
                    if (stdKey) bhinnaTables[stdKey] = t;
                }
            });
        }

        // Strategy B: Direct planet keys (Common in Sarva responses that include individual binnas)
        planetKeys.forEach(pk => {
            if (bhinnaTables[pk]) return; 
            const foundAlias = [pk, ...aliases[pk]].find(a => bhinnaRoot[a] !== undefined || (typeof bhinnaRoot === 'object' && bhinnaRoot[a.toLowerCase()] !== undefined));
            if (foundAlias) {
                const raw = bhinnaRoot[foundAlias] || bhinnaRoot[foundAlias.toLowerCase()];
                bhinnaTables[pk] = raw;
            }
        });

        return { 
            ...apiData, 
            sarvashtakavarga: sarvaMatrix, 
            bhinnashtakavarga: bhinnaTables 
        };
    }, [rawData]);

    const hasData = !!ashtakaData && !isAshtakaLoading;

    const d1Raw = processedCharts['D1_lahiri']?.chartData as any;
    const ascendantSign = d1Raw?.ascendant?.sign || d1Raw?.ascendant?.sign_number || ((rawData?.data || rawData) as any)?.ascendant_sign;

    return (
        <DashboardCard
            title={`${ashtakavarga.name} (${activeSystem})`}
            description={ashtakavarga.description}
            badge={<span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100/50 text-emerald-800 border border-emerald-500/10">Ashtakavarga</span>}
            size={size}
            collapsed={collapsed}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onCollapseToggle={onCollapseToggle}
            onSizeChange={onSizeChange}
            ayanamsa={activeSystem}
            onAyanamsaChange={onAyanamsaChange}
        >
            {!hasData ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {!isChartCompatible(ashtakavarga.id, activeSystem) ? (
                        <>
                            <Shield className="w-8 h-8 text-emerald-300/40 mb-3" />
                            <p className="text-[10px] font-black uppercase text-emerald-700/60 tracking-wider mb-1 px-4">
                                {ashtakavarga.name}
                            </p>
                            <p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest px-2">
                                Not compatible with {activeSystem}
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-8 h-8 text-emerald-300 mb-3" />
                            <p className="text-[11px] text-ink/50 mb-4">Ashtakavarga data loading...</p>
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                        </>
                    )}
                </div>
            ) : (
                <div className="h-full overflow-auto">
                    <PremiumAshtakavargaMatrix type={ashtakaType} data={ashtakaData} lagnaSign={ascendantSign} />
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
                            <h2 className="text-[24px] font-black text-ink tracking-tight uppercase leading-none mb-1">
                                {AYANAMSA_CONFIGS[ayanamsa as AyanamsaSystem]?.title || 'Celestial Navigator'}
                            </h2>
                            <p className="text-[10px] text-gold-dark uppercase font-bold tracking-[0.2em]">
                                {AYANAMSA_CONFIGS[ayanamsa as AyanamsaSystem]?.subtitle || 'Lahiri Optimization Hub'}
                            </p>
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
    selectedCharts: string[]; // now expects format: `${chartId}_${ayanamsa}`
    onSelect: (chartId: string, system?: string) => void;
    currentAyanamsa: string;
    onAyanamsaChange: (ayanamsa: string) => void;
    activeSection?: string;
}

function ChartSelectorModal({
    isOpen,
    onClose,
    availableCharts,
    selectedCharts,
    onSelect,
    currentAyanamsa,
    onAyanamsaChange,
    activeSection
}: ChartSelectorModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const selectedAyanamsa = currentAyanamsa.toLowerCase();

    const activeHierarchy = AYANAMSA_HIERARCHY.find(
        h => h.value.toLowerCase() === selectedAyanamsa
    );
    const dynamicCategories = activeHierarchy ? activeHierarchy.categories : [];

    // Default category fallback
    useEffect(() => {
        if (activeCategory !== 'all' && !dynamicCategories.find(c => c.id === activeCategory)) {
            setActiveCategory('all');
        }
    }, [activeHierarchy, activeCategory, dynamicCategories]);

    const categories = [{ id: 'all', name: 'All Items' }, ...dynamicCategories].map(cat => {
        let count = 0;
        if (cat.id === 'all') {
            count = activeHierarchy?.categories.reduce((acc, c) => {
                return acc + c.widgets.filter(w => {
                    const exists = availableCharts.find(ac => ac.id === w.id);
                    return exists && !selectedCharts.includes(`${w.id}_${selectedAyanamsa}`);
                }).length;
            }, 0) || 0;
        } else {
            const hCat = dynamicCategories.find(c => c.id === cat.id);
            if (hCat) {
                count = hCat.widgets.filter(w => {
                    const exists = availableCharts.find(ac => ac.id === w.id);
                    return exists && !selectedCharts.includes(`${w.id}_${selectedAyanamsa}`);
                }).length;
            }
        }
        return { ...cat, count };
    }).filter(c => c.count > 0 || c.id === 'all');

    const filteredCharts = useMemo(() => {
        if (!activeHierarchy) return [];
        let widgetsInCat: { id: string }[] = [];

        if (activeCategory === 'all') {
            activeHierarchy.categories.forEach(cat => {
                widgetsInCat = [...widgetsInCat, ...cat.widgets];
            });
        } else {
            const cat = activeHierarchy.categories.find(c => c.id === activeCategory);
            if (cat) widgetsInCat = cat.widgets;
        }

        return widgetsInCat
            .map(w => availableCharts.find(ac => ac.id === w.id))
            .filter((c): c is CustomizeChartItem => !!c)
            .filter(chart => {
                const matchesSearch = chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chart.description.toLowerCase().includes(searchQuery.toLowerCase());
                const notSelected = !selectedCharts.includes(`${chart.id}_${selectedAyanamsa}`);
                return matchesSearch && notSelected;
            });
    }, [activeHierarchy, activeCategory, availableCharts, searchQuery, selectedCharts, selectedAyanamsa]);

    if (!isOpen) return null;

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
                            <div className="flex items-center gap-2.5">
                                <div>
                                    <h2 className="text-[18px] font-black text-ink tracking-tight uppercase leading-none inline-flex items-center gap-3">
                                        Add Widgets
                                    </h2>
                                    <p className="text-[10px] text-gold-dark uppercase font-bold tracking-[0.12em] mt-1.5 opacity-80">Select charts, widgets & tools</p>
                                </div>
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
                                    value={currentAyanamsa}
                                    onChange={(e) => onAyanamsaChange(e.target.value)}
                                    className="w-full appearance-none pl-10 pr-10 py-3 bg-white border border-gold-primary/20 rounded-xl text-[13px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer hover:border-gold-primary/40"
                                >
                                    {AYANAMSA_HIERARCHY.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                                            onSelect(e.target.value, selectedAyanamsa);
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
