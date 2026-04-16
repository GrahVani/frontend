"use client";

import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import {
    LayoutGrid,
    Sparkles,
    Plus,
    X,
    Trash2,
    AlertCircle,
    Shield,
    Loader2,
    Maximize2,
    House,
    BookOpen,
    Settings,

    Minus,
    Move,
    ChevronDown,
    Filter,
    Globe,
    Search,
    RefreshCw,
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore, type ChartColorTheme } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

import { parseChartData } from '@/lib/chart-helpers';
import {
    useCustomizePages,
    type WidgetTheme,
    type WidgetDimensions,
    CHART_CATALOG,
    DEFAULT_WIDGET_THEME,
    DEFAULT_DIMENSIONS,
} from '@/hooks/useCustomizePages';
import {
    useWidgetAutoScale,
    type AutoScaleResult
} from '@/hooks/useWidgetAutoScale';
import { renderWidget, renderWidgetContent } from './WidgetBoxes';
import WidgetConfigurator from './WidgetConfigurator';
import CompactWidgetPanel from './CompactWidgetPanel';
import ChartSelectorModal from './ChartSelectorModal';
import AyanamsaSelect from './AyanamsaSelect';
import PageTabs from './PageTabs';

// Components - Use CompactChartWithPopup for dashboard density as requested
import { CompactChartWithPopup, Planet, type ChartDisplayOptions } from '@/components/astrology/NorthIndianChart';
import SouthIndianChart, { ChartColorMode } from '@/components/astrology/SouthIndianChart';
import CompactSouthIndianChart from '@/components/astrology/CompactSouthIndianChart';
import dynamic from 'next/dynamic';

const DivisionalChartZoomModal = dynamic(() => import('@/components/astrology/DivisionalChartZoomModal'));

// ═══════════════════════════════════════════════════════════════════════════════
// SMART DEFAULT DIMENSIONS BY CONTENT TYPE
// ═══════════════════════════════════════════════════════════════════════════════

const SMART_DEFAULTS: Record<string, WidgetDimensions> = {
    // Charts - square aspect ratio for optimal first view (matching Kundali page)
    divisional: {
        width: 470, height: 500,
        minWidth: 280, minHeight: 300,
        maxWidth: 900, maxHeight: 900
    },
    lagna: {
        width: 470, height: 500,
        minWidth: 280, minHeight: 300,
        maxWidth: 900, maxHeight: 900
    },
    rare_shodash: {
        width: 450, height: 480,
        minWidth: 280, minHeight: 300,
        maxWidth: 800, maxHeight: 800
    },

    // Tables - wider for data readability
    ashtakavarga: {
        width: 1000, height: 428,
        minWidth: 400, minHeight: 300,
        maxWidth: 1000, maxHeight: 700
    },
    widget_shodasha: {
        width: 650, height: 380,
        minWidth: 500, minHeight: 300,
        maxWidth: 1200, maxHeight: 600
    },

    // Analysis widgets - balanced proportions
    dasha: {
        width: 800, height: 516,
        minWidth: 350, minHeight: 400,
        maxWidth: 1000, maxHeight: 1000
    },
    widget_shadbala: {
        width: 680, height: 520,
        minWidth: 450, minHeight: 380,
        maxWidth: 1100, maxHeight: 900
    },
    widget_yoga: {
        width: 500, height: 480,
        minWidth: 380, minHeight: 350,
        maxWidth: 900, maxHeight: 800
    },
    widget_dosha: {
        width: 500, height: 480,
        minWidth: 380, minHeight: 350,
        maxWidth: 900, maxHeight: 800
    },

    // Others
    widget_transit: {
        width: 480, height: 320,
        minWidth: 380, minHeight: 250,
        maxWidth: 900, maxHeight: 600
    },
    widget_remedy: {
        width: 520, height: 450,
        minWidth: 400, minHeight: 350,
        maxWidth: 900, maxHeight: 800
    },
    widget_pushkara: {
        width: 480, height: 380,
        minWidth: 380, minHeight: 300,
        maxWidth: 900, maxHeight: 700
    },
    widget_karaka: {
        width: 400, height: 380,
        minWidth: 320, minHeight: 300,
        maxWidth: 800, maxHeight: 700
    },
    widget_chakra: {
        width: 560, height: 552,
        minWidth: 380, minHeight: 380,
        maxWidth: 900, maxHeight: 900
    },
    kp_module: {
        width: 480, height: 420,
        minWidth: 380, minHeight: 320,
        maxWidth: 900, maxHeight: 800
    },
};

// Get smart defaults for a widget type
function getSmartDefaults(category: string): WidgetDimensions {
    return SMART_DEFAULTS[category] || SMART_DEFAULTS.divisional;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CHART WIDGET - Optimized for customization page
// Uses ChartWithPopup (square) like Kundali page, NOT CompactChartWithPopup
// ═══════════════════════════════════════════════════════════════════════════════

interface CustomChartWidgetProps extends ChartDisplayOptions {
    planets: Planet[];
    ascendantSign: number;
    width: number;
    height: number;
    chartStyle?: 'North Indian' | 'South Indian';
    colorTheme?: ChartColorTheme;
}

// Memoized chart widget to prevent unnecessary re-renders
// Only D1 chart shows degrees by default; other charts hide degrees
const CustomChartWidget = React.memo(function CustomChartWidget({
    planets,
    ascendantSign,
    width,
    height,
    chartStyle = 'North Indian',
    colorTheme = 'classic',
    planetDisplayMode = 'name',
    planetFontSize,
    planetFontWeight = '600',
    showDegrees,
    degreeFormat = 'short',
    degreeFontSize,
    showHouseNumbers = true,
    showGridLines = true,
    gridLineColor = '#D4C4A8',
    gridLineWidth = 2,
    showRetrogradeIndicator = true,
    retrogradeStyle = 'R',
    planetSpacing = 'normal',
    labelDensity = 'normal',
    chartId = '',
}: CustomChartWidgetProps & { chartId?: string }) {
    // Determine if degrees should be shown: use explicit value if provided, 
    // otherwise only show for D1 (Rashi) chart
    const shouldShowDegrees = showDegrees !== undefined ? showDegrees : (chartId === 'D1');

    if (chartStyle === 'South Indian') {
        return (
            <div className="w-full h-full overflow-hidden">
                <CompactSouthIndianChart
                    ascendantSign={ascendantSign}
                    planets={planets}
                    colorMode="color"
                    colorTheme={colorTheme}
                    className="w-full h-full"
                    planetFontSize={planetFontSize}
                    degreeFontSize={degreeFontSize}
                    showDegrees={shouldShowDegrees}
                    planetDisplayMode={planetDisplayMode}
                    showHouseNumbers={showHouseNumbers}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-hidden">
            <CompactChartWithPopup
                ascendantSign={ascendantSign}
                planets={planets}
                className="w-full h-full"
                preserveAspectRatio="none"
                showDegrees={shouldShowDegrees}
                planetFontSize={planetFontSize}
                degreeFontSize={degreeFontSize}
                planetDisplayMode={planetDisplayMode}
                showHouseNumbers={showHouseNumbers}
                planetSpacing={planetSpacing}
            />
        </div>
    );
}, (prev, next) => {
    return prev.ascendantSign === next.ascendantSign &&
        prev.width === next.width &&
        prev.height === next.height &&
        prev.chartStyle === next.chartStyle &&
        prev.planetDisplayMode === next.planetDisplayMode &&
        prev.planetFontSize === next.planetFontSize &&
        prev.planetFontWeight === next.planetFontWeight &&
        prev.showDegrees === next.showDegrees &&
        prev.chartId === next.chartId &&
        prev.degreeFormat === next.degreeFormat &&
        prev.degreeFontSize === next.degreeFontSize &&
        prev.showHouseNumbers === next.showHouseNumbers &&
        prev.showGridLines === next.showGridLines &&
        prev.gridLineColor === next.gridLineColor &&
        prev.gridLineWidth === next.gridLineWidth &&
        prev.showRetrogradeIndicator === next.showRetrogradeIndicator &&
        prev.retrogradeStyle === next.retrogradeStyle &&
        prev.planetSpacing === next.planetSpacing &&
        prev.labelDensity === next.labelDensity &&
        JSON.stringify(prev.planets) === JSON.stringify(next.planets);
});

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type SelectedItemDetail = {
    id: string;
    name: string;
    description: string;
    category: string;
    instanceId: string;
    size: 'small' | 'medium' | 'large' | 'wide' | 'full' | 'custom';
    collapsed: boolean;
    ayanamsa?: string;
    dimensions: WidgetDimensions;
    theme: WidgetTheme;
    customTitle?: string;
    showHeader: boolean;
    showBorder: boolean;
    position?: { x: number; y: number };
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESIZABLE WIDGET BOX
// ═══════════════════════════════════════════════════════════════════════════════

interface ResizableWidgetBoxProps {
    item: SelectedItemDetail;
    onRemove: () => void;
    onCustomize: () => void;
    onAyanamsaChange?: (ayanamsa: string) => void;
    onUpdateDimensions: (dims: Partial<WidgetDimensions>) => void;
    onUpdateTheme: (theme: Partial<WidgetTheme>) => void;
    children: React.ReactNode;
    isAvailable?: boolean;
    isGenerating?: boolean;
    isLoading?: boolean;
    onGenerate?: () => void;
    autoScale?: boolean;
}

const ResizableWidgetBox = React.memo(function ResizableWidgetBox({
    item,
    onRemove,
    onCustomize,
    onAyanamsaChange,
    onUpdateDimensions,
    onUpdateTheme,
    children,
    isAvailable,
    isGenerating,
    isLoading,
    onGenerate,
    autoScale = true,
}: ResizableWidgetBoxProps) {
    const { theme, customTitle, showHeader, showBorder, dimensions, ayanamsa } = item;
    const displayTitle = customTitle || item.name;

    const shadowClass = {
        'none': '',
        'light': 'shadow-sm',
        'medium': 'shadow-md',
        'heavy': 'shadow-lg',
    }[theme.shadowIntensity];

    const [isResizing, setIsResizing] = useState(false);
    const [needsScroll, setNeedsScroll] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const isAutoScaleEnabled = theme.autoScale !== false;
    const scaleResult = useWidgetAutoScale(
        dimensions,
        item.category,
        autoScale && isAutoScaleEnabled,
        {
            minScale: 0.7,
            maxScale: 1.5,
            mode: item.category === 'dasha' ? 'cover' : (item.category === 'divisional' ? 'fit' : 'geometric')
        }
    );

    const finalScale = useMemo(() => {
        const manualScale = theme.contentTextScale ?? 1;
        if (manualScale !== 1) {
            return {
                ...scaleResult,
                scale: scaleResult.scale * manualScale,
                fontSizeMultiplier: scaleResult.fontSizeMultiplier * manualScale,
                scalePercentage: Math.round(scaleResult.scale * manualScale * 100),
            };
        }
        return scaleResult;
    }, [scaleResult, theme.contentTextScale]);

    useEffect(() => {
        const defaults = getSmartDefaults(item.category);
        const isCompressed = dimensions.width < defaults.minWidth || dimensions.height < defaults.minHeight;
        setNeedsScroll(isCompressed);
    }, [dimensions, item.category]);

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: dimensions.width,
            height: dimensions.height,
        };

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - resizeStart.current.x;
            const deltaY = e.clientY - resizeStart.current.y;

            let newWidth = resizeStart.current.width;
            let newHeight = resizeStart.current.height;

            if (direction.includes('e')) newWidth += deltaX;
            if (direction.includes('w')) newWidth -= deltaX;
            if (direction.includes('s')) newHeight += deltaY;
            if (direction.includes('n')) newHeight -= deltaY;

            newWidth = Math.max(dimensions.minWidth, Math.min(dimensions.maxWidth, newWidth));
            newHeight = Math.max(dimensions.minHeight, Math.min(dimensions.maxHeight, newHeight));

            onUpdateDimensions({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={cn(
                "relative flex flex-col transition-shadow",
                shadowClass,
                showBorder && "border",
                isResizing && "select-none",
                "group"
            )}
            style={{
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: theme.backgroundColor,
                borderColor: showBorder ? theme.borderColor : 'transparent',
                borderWidth: showBorder ? theme.borderWidth : 0,
                borderRadius: theme.borderRadius,
            }}
        >
            {showHeader && (
                <div
                    className="flex items-center justify-between px-3 shrink-0 cursor-move relative z-10"
                    style={{
                        background: theme.headerBackground,
                        color: theme.headerTextColor,
                        height: theme.headerHeight ?? 36,
                    }}
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1" style={{ justifyContent: theme.titleAlign ?? 'flex-start' }}>
                        <span
                            className="font-bold truncate min-w-[20px]"
                            style={{
                                color: theme.headerTextColor,
                                fontSize: Math.min(
                                    (theme.headerFontSize ?? 12) * finalScale.scale,
                                    dimensions.width / 20
                                ),
                                maxWidth: theme.titleMaxWidth ?? dimensions.width * 0.5,
                                textAlign: theme.titleAlign ?? 'left',
                            }}
                            title={displayTitle}
                        >
                            {displayTitle}
                        </span>

                        <div className="flex items-center gap-1.5 bg-black/5 px-1.5 py-0.5 rounded-md border border-black/5 shadow-inner">
                            {/* Width Control */}
                            <div className="flex items-center gap-1 group/w">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ width: dimensions.width - 10 }); }}
                                    className="p-0.5 hover:bg-black/10 rounded-sm transition-colors"
                                >
                                    <Minus className="w-2.5 h-2.5 opacity-50" />
                                </button>
                                <span className="text-[9px] font-black text-ink/40 min-w-[42px] text-center uppercase">
                                    W: {dimensions.width}
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ width: dimensions.width + 10 }); }}
                                    className="p-0.5 hover:bg-black/10 rounded-sm transition-colors"
                                >
                                    <Plus className="w-2.5 h-2.5 opacity-50" />
                                </button>
                            </div>

                            <div className="w-px h-2.5 bg-black/10 mx-0.5" />

                            {/* Height Control */}
                            <div className="flex items-center gap-1 group/h">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ height: dimensions.height - 10 }); }}
                                    className="p-0.5 hover:bg-black/10 rounded-sm transition-colors"
                                >
                                    <Minus className="w-2.5 h-2.5 opacity-50" />
                                </button>
                                <span className="text-[9px] font-black text-ink/40 min-w-[42px] text-center uppercase">
                                    H: {dimensions.height}
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ height: dimensions.height + 10 }); }}
                                    className="p-0.5 hover:bg-black/10 rounded-sm transition-colors"
                                >
                                    <Plus className="w-2.5 h-2.5 opacity-50" />
                                </button>
                            </div>
                        </div>

                        {/* Granular Zoom Control */}
                        <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/10 shadow-inner">
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    const currentScale = theme.contentTextScale ?? 1;
                                    onUpdateTheme({ contentTextScale: Math.max(0.5, currentScale - 0.05) }); 
                                }}
                                className="p-0.5 hover:bg-primary/20 rounded-sm transition-colors"
                            >
                                <Minus className="w-2.5 h-2.5 text-primary opacity-60" />
                            </button>
                            <span className="text-[9px] font-black text-primary min-w-[30px] text-center">
                                {finalScale.scalePercentage}%
                            </span>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    const currentScale = theme.contentTextScale ?? 1;
                                    onUpdateTheme({ contentTextScale: Math.min(2, currentScale + 0.05) }); 
                                }}
                                className="p-0.5 hover:bg-primary/20 rounded-sm transition-colors"
                            >
                                <Plus className="w-2.5 h-2.5 text-primary opacity-60" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {onAyanamsaChange && (
                            <div className="mr-1 relative opacity-80 hover:opacity-100 transition-opacity">
                                <AyanamsaSelect
                                    value={ayanamsa || 'Lahiri'}
                                    onChange={onAyanamsaChange}
                                    compact
                                />
                            </div>
                        )}

                        <button
                            onClick={onCustomize}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors opacity-60 hover:opacity-100"
                            title="Customize"
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={onRemove}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors opacity-60 hover:opacity-100"
                            title="Remove"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={contentRef}
                className={cn(
                    "flex-1 relative min-h-0",
                    needsScroll ? "overflow-auto" : "overflow-hidden"
                )}
            >
                {isGenerating && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                )}

                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <Loader2 className="w-8 h-8 text-primary/30 animate-spin mb-3" />
                        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">Synchronizing Data...</p>
                    </div>
                ) : !isAvailable && onGenerate ? (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-gold-dark/30 mb-2" />
                        <p className="text-[11px] text-ink/50 mb-3">{item.name} not generated</p>
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] font-bold transition-all"
                        >
                            Generate
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full h-full widget-scaled-content"
                        style={{
                            color: theme.textColor,
                            zoom: finalScale.zoom,
                            transformOrigin: 'top left',
                        }}
                    >
                        {children}
                    </div>
                )}
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                >
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </div>

                <div
                    className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 's')}
                />

                <div
                    className="absolute top-4 bottom-4 right-0 w-2 cursor-e-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 'e')}
                />
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.item.instanceId === next.item.instanceId &&
        prev.item.dimensions.width === next.item.dimensions.width &&
        prev.item.dimensions.height === next.item.dimensions.height &&
        prev.item.showHeader === next.item.showHeader &&
        prev.item.showBorder === next.item.showBorder &&
        prev.autoScale === next.autoScale &&
        JSON.stringify(prev.item.theme) === JSON.stringify(next.item.theme);
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function CustomizePage() {
    const { clientDetails, processedCharts, isGeneratingCharts, isLoadingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa: globalAyanamsa, chartStyle, chartColorTheme } = useAstrologerStore();

    // Local state
    const [localAyanamsa, setLocalAyanamsa] = useState(globalAyanamsa);
    useEffect(() => { localStorage.setItem('grahvani_customize_ayanamsa', localAyanamsa); }, [localAyanamsa]);

    const prevGlobalAyanamsaRef = useRef(globalAyanamsa);
    useEffect(() => {
        if (prevGlobalAyanamsaRef.current !== globalAyanamsa) {
            setLocalAyanamsa(globalAyanamsa);
            prevGlobalAyanamsaRef.current = globalAyanamsa;
        }
    }, [globalAyanamsa]);

    // Multi-page hook
    const {
        pages,
        activePageId,
        activePage,
        selectedItems,
        selectedChartDetails,
        availableCharts,
        createPage,
        deletePage,
        duplicatePage,
        renamePage,
        setActivePage,
        canCreateMorePages,
        canDeletePage,
        addChart,
        removeChart,
        duplicateChart,
        updateChartAyanamsa,
        updateDimensions,
        resizeByDelta,
        updateTheme,
        applyThemePreset,
        updateCustomTitle,
        toggleHeader,
        toggleBorder,
        reorderItems,
        resetCurrentPage,
    } = useCustomizePages();

    const activeSystem = localAyanamsa.toLowerCase();
    const clientId = clientDetails?.id || '';

    // UI State
    const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
    const [isWidgetConfiguratorOpen, setIsWidgetConfiguratorOpen] = useState(false);
    const [selectedChartForConfig, setSelectedChartForConfig] = useState<{ id: string, name: string, description: string, category: string } | null>(null);
    const [customizationPanel, setCustomizationPanel] = useState<{ isOpen: boolean; selectedWidget?: SelectedItemDetail }>({ isOpen: false });
    const [generatingCharts, setGeneratingCharts] = useState<Set<string>>(new Set());

    // Drag state
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // Chart helpers
    const getChartProps = (id: string, itemAyanamsa?: string) => {
        const targetSystem = (itemAyanamsa || activeSystem).toLowerCase();
        const chartData = processedCharts[`${id}_${targetSystem}`]?.chartData || null;
        return parseChartData(chartData);
    };

    const isChartAvailable = (chartId: string, itemAyanamsa?: string) => {
        const targetSystem = (itemAyanamsa || activeSystem).toLowerCase();
        return !!processedCharts[`${chartId}_${targetSystem}`];
    };

    // Handlers
    const handleSelectChart = useCallback((chart: { id: string, name: string, description: string, category: string }, ayanamsa: string) => {
        setSelectedChartForConfig(chart);
        setLocalAyanamsa(ayanamsa as typeof localAyanamsa);
        setIsWidgetConfiguratorOpen(true);
        setIsChartSelectorOpen(false);
    }, []);

    const handleAddConfiguredChart = useCallback((config: {
        dimensions: WidgetDimensions;
        theme: WidgetTheme;
        customTitle?: string;
        showHeader: boolean;
        showBorder: boolean;
        ayanamsa: string;
    }) => {
        if (!selectedChartForConfig) return;
        addChart(selectedChartForConfig.id, config.ayanamsa, config);
        setIsWidgetConfiguratorOpen(false);
        setSelectedChartForConfig(null);
    }, [addChart, selectedChartForConfig]);

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, instanceId: string) => {
        setDraggedId(instanceId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, targetId?: string) => {
        e.preventDefault();
        if (targetId && targetId !== draggedId) {
            setDragOverId(targetId);
        }
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }

        const currentOrder = [...selectedItems];
        const draggedIdx = currentOrder.findIndex(i => i.instanceId === draggedId);
        const targetIdx = currentOrder.findIndex(i => i.instanceId === targetId);

        if (draggedIdx === -1 || targetIdx === -1) return;

        const [moved] = currentOrder.splice(draggedIdx, 1);
        currentOrder.splice(targetIdx, 0, moved);
        reorderItems(currentOrder);

        setDraggedId(null);
        setDragOverId(null);
    };

    // Empty state
    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 bg-white/50 backdrop-blur-md rounded-[2rem] prem-card mx-4 my-8">
                <Shield className="w-16 h-16 text-gold-dark mb-6 opacity-30" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-ink")}>Select a Profile</h2>
                <p className={cn(TYPOGRAPHY.label, "max-w-xs mx-auto")}>Choose a client to begin analysis.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-104px)] w-[calc(100%+2rem)] -mx-4 -mt-4">
            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 bg-surface-warm/95 border-b border-gold-primary/20 shrink-0">
                {/* Brand */}
                <span
                    className="font-serif font-bold text-[16px] tracking-[0.12em] uppercase shrink-0"
                    style={{
                        background: 'linear-gradient(to bottom, #D4AD5A 0%, #C9A24D 40%, #9C7A2F 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Grahvani
                </span>

                {/* Divider */}
                <div className="w-px h-6 bg-gold-primary/20 shrink-0" />

                {/* Page Tabs - Multi-page navigation */}
                <PageTabs
                    pages={pages}
                    activePageId={activePageId}
                    onSelectPage={setActivePage}
                    onAddPage={createPage}
                    onDeletePage={deletePage}
                    onRenamePage={renamePage}
                    canCreateMore={canCreateMorePages}
                    canDelete={canDeletePage}
                />

                {/* Divider */}
                <div className="w-px h-6 bg-gold-primary/20 shrink-0" />

                {/* Add Widget Button */}
                <button
                    onClick={() => setIsChartSelectorOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all hover:brightness-110 shadow-sm"
                    style={{
                        background: 'linear-gradient(180deg, #E6C97A 0%, #C9A24D 50%, #9C7A2F 100%)',
                        border: '1px solid #9C7A2F',
                        color: '#3E2A1F',
                    }}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Widget
                </button>

                {/* Clear Current Page */}
                {selectedItems.length > 0 && (
                    <button
                        onClick={resetCurrentPage}
                        className="text-[11px] font-black uppercase tracking-widest text-ink hover:text-red-700 transition-all bg-red-50/50 px-2 py-0.5 rounded-md border border-red-200/30"
                    >
                        Clear All
                    </button>
                )}

                <div className="flex-1" />

                {/* Widget Count */}
                {selectedItems.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5 text-gold-dark/50" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-gold-dark/70">
                            {selectedItems.length} Widget{selectedItems.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                {/* Page Count */}
                {pages.length > 1 && (
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-[11px] font-medium text-ink/50">
                            {pages.length} Pages
                        </span>
                    </div>
                )}
            </div>

            {/* Canvas Area - Free Form Layout */}
            <div className="flex-1 overflow-auto bg-[#FAF9F6] p-6">
                {selectedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <h3 className="text-[24px] font-black text-ink mb-3">
                            {activePage?.name || 'Your Canvas'} is Empty
                        </h3>
                        <p className="text-[14px] text-ink/50 max-w-md mb-6">
                            Add charts, dashas, and analysis widgets. Resize freely with drag handles or quick buttons.
                        </p>
                        <button
                            onClick={() => setIsChartSelectorOpen(true)}
                            className="px-8 py-4 bg-primary text-white rounded-2xl text-[13px] font-bold shadow-xl hover:bg-black transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add First Widget
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 content-start">
                        {selectedChartDetails.map((item) => {
                            const isWidget = item.category.startsWith('widget_') || item.category === 'kp_module' || item.category === 'dasha' || item.category === 'ashtakavarga';
                            const isDragged = draggedId === item.instanceId;
                            const isDragOver = dragOverId === item.instanceId && !isDragged;

                            return (
                                <div
                                    key={item.instanceId}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item.instanceId)}
                                    onDragOver={(e) => handleDragOver(e, item.instanceId)}
                                    onDrop={(e) => handleDrop(e, item.instanceId)}
                                    onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                                    className={cn(
                                        "transition-all duration-200",
                                        isDragged && "opacity-50 scale-95",
                                        isDragOver && "ring-2 ring-primary/50 ring-offset-4 rounded-xl"
                                    )}
                                >
                                    {isWidget ? (
                                        <ResizableWidgetBox
                                            item={item}
                                            onRemove={() => removeChart(item.instanceId)}
                                            onCustomize={() => setCustomizationPanel({ isOpen: true, selectedWidget: item })}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            onUpdateDimensions={(dims) => updateDimensions(item.instanceId, dims)}
                                            onUpdateTheme={(theme) => updateTheme(item.instanceId, theme)}
                                            isLoading={isLoadingCharts}
                                        >
                                            {renderWidgetContent({
                                                ...item,
                                                onRemove: () => removeChart(item.instanceId),
                                                onSizeChange: () => { },
                                                onDuplicate: () => duplicateChart(item.instanceId),
                                                onCollapseToggle: () => { },
                                                onAyanamsaChange: (a) => updateChartAyanamsa(item.instanceId, a),
                                            }, clientId, activeSystem)}
                                        </ResizableWidgetBox>
                                    ) : (
                                        <ResizableWidgetBox
                                            item={item}
                                            onRemove={() => removeChart(item.instanceId)}
                                            onCustomize={() => setCustomizationPanel({ isOpen: true, selectedWidget: item })}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            onUpdateDimensions={(dims) => updateDimensions(item.instanceId, dims)}
                                            onUpdateTheme={(theme) => updateTheme(item.instanceId, theme)}
                                            isAvailable={isChartAvailable(item.id, item.ayanamsa)}
                                            isGenerating={generatingCharts.has(item.id)}
                                            isLoading={isLoadingCharts}
                                            onGenerate={async () => {
                                                setGeneratingCharts(prev => new Set(prev).add(item.id));
                                                await clientApi.generateChart(clientId, item.id, item.ayanamsa || activeSystem);
                                                await refreshCharts();
                                                setGeneratingCharts(prev => {
                                                    const next = new Set(prev);
                                                    next.delete(item.id);
                                                    return next;
                                                });
                                            }}
                                        >
                                            <div className="w-full h-full p-2">
                                                {(() => {
                                                    const { planets, ascendant } = getChartProps(item.id, item.ayanamsa);
                                                    const widgetChartStyle = item.theme.chartStyle || 'North Indian';
                                                    const widgetColorTheme = item.theme.colorTheme || chartColorTheme;

                                                    return widgetChartStyle === 'South Indian' ? (
                                                        <div className="w-full h-full overflow-hidden">
                                                            <CompactSouthIndianChart
                                                                ascendantSign={ascendant}
                                                                planets={planets}
                                                                colorMode="color"
                                                                colorTheme={widgetColorTheme}
                                                                className="w-full h-full"
                                                                planetFontSize={item.theme.planetFontSize}
                                                                planetFontWeight={item.theme.planetFontWeight}
                                                                degreeFontSize={item.theme.degreeFontSize}
                                                                showDegrees={item.theme.showDegrees !== false}
                                                                planetDisplayMode={item.theme.planetDisplayMode}
                                                                showHouseNumbers={item.theme.showHouseNumbers !== false}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <CustomChartWidget
                                                            ascendantSign={ascendant}
                                                            planets={planets}
                                                            width={item.dimensions.width - 16}
                                                            height={item.dimensions.height - (item.showHeader ? (item.theme.headerHeight ?? 36) : 0) - 16}
                                                            chartStyle="North Indian"
                                                            colorTheme={widgetColorTheme}
                                                            chartId={item.id}
                                                            planetDisplayMode={item.theme.planetDisplayMode}
                                                            planetFontSize={item.theme.planetFontSize}
                                                            planetFontWeight={item.theme.planetFontWeight}
                                                            showDegrees={item.theme.showDegrees}
                                                            degreeFormat={item.theme.degreeFormat}
                                                            degreeFontSize={item.theme.degreeFontSize}
                                                            showHouseNumbers={item.theme.showHouseNumbers}
                                                            showGridLines={item.theme.showGridLines}
                                                            gridLineColor={item.theme.gridLineColor}
                                                            gridLineWidth={item.theme.gridLineWidth}
                                                            showRetrogradeIndicator={item.theme.showRetrogradeIndicator}
                                                            retrogradeStyle={item.theme.retrogradeStyle}
                                                            planetSpacing={item.theme.planetSpacing}
                                                            labelDensity={item.theme.labelDensity}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </ResizableWidgetBox>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Chart Selector */}
            <ChartSelectorModal
                isOpen={isChartSelectorOpen}
                onClose={() => setIsChartSelectorOpen(false)}
                availableCharts={availableCharts}
                selectedCharts={selectedChartDetails.map(i => `${i.id}_${(i.ayanamsa || activeSystem).toLowerCase()}`)}
                onSelect={handleSelectChart}
                currentAyanamsa={localAyanamsa}
            />

            {/* Widget Configurator */}
            <WidgetConfigurator
                isOpen={isWidgetConfiguratorOpen}
                onClose={() => {
                    setIsWidgetConfiguratorOpen(false);
                    setSelectedChartForConfig(null);
                }}
                chart={selectedChartForConfig}
                currentAyanamsa={localAyanamsa}
                onAdd={handleAddConfiguredChart}
            />

            {/* Compact Customization Panel */}
            <CompactWidgetPanel
                isOpen={customizationPanel.isOpen}
                onClose={() => setCustomizationPanel({ isOpen: false })}
                widget={customizationPanel.selectedWidget
                    ? selectedChartDetails.find(w => w.instanceId === customizationPanel.selectedWidget?.instanceId) || customizationPanel.selectedWidget
                    : null}
                onUpdateTheme={useCallback((t) => {
                    if (customizationPanel.selectedWidget) {
                        updateTheme(customizationPanel.selectedWidget.instanceId, t);
                    }
                }, [customizationPanel.selectedWidget, updateTheme])}
                onUpdateDimensions={useCallback((d) => {
                    if (customizationPanel.selectedWidget) {
                        updateDimensions(customizationPanel.selectedWidget.instanceId, d);
                    }
                }, [customizationPanel.selectedWidget, updateDimensions])}
                onUpdateCustomTitle={useCallback((title) => {
                    if (customizationPanel.selectedWidget) {
                        updateCustomTitle(customizationPanel.selectedWidget.instanceId, title);
                    }
                }, [customizationPanel.selectedWidget, updateCustomTitle])}
                onToggleHeader={useCallback(() => {
                    if (customizationPanel.selectedWidget) {
                        toggleHeader(customizationPanel.selectedWidget.instanceId);
                    }
                }, [customizationPanel.selectedWidget, toggleHeader])}
                onToggleBorder={useCallback(() => {
                    if (customizationPanel.selectedWidget) {
                        toggleBorder(customizationPanel.selectedWidget.instanceId);
                    }
                }, [customizationPanel.selectedWidget, toggleBorder])}
                onDuplicate={useCallback(() => {
                    if (customizationPanel.selectedWidget) {
                        duplicateChart(customizationPanel.selectedWidget.instanceId);
                        setCustomizationPanel({ isOpen: false });
                    }
                }, [customizationPanel.selectedWidget, duplicateChart])}
                onRemove={useCallback(() => {
                    if (customizationPanel.selectedWidget) {
                        removeChart(customizationPanel.selectedWidget.instanceId);
                        setCustomizationPanel({ isOpen: false });
                    }
                }, [customizationPanel.selectedWidget, removeChart])}
                onApplyThemePreset={useCallback((preset) => {
                    if (customizationPanel.selectedWidget) {
                        applyThemePreset(customizationPanel.selectedWidget.instanceId, preset);
                    }
                }, [customizationPanel.selectedWidget, applyThemePreset])}
            />
        </div>
    );
}
