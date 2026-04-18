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
    User,
    Calendar,
    Clock,
    MapPin,
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
        width: 1470, height: 840,
        minWidth: 600, minHeight: 400,
        maxWidth: 2400, maxHeight: 1200
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
                maxWidth: '100%',
                backgroundColor: theme.backgroundColor,
                borderColor: showBorder ? theme.borderColor : 'transparent',
                borderWidth: showBorder ? theme.borderWidth : 0,
                borderRadius: theme.borderRadius,
            }}
        >
            {showHeader && (() => {
                // Responsive breakpoints based on actual widget width
                const w = dimensions.width;
                const showDimensionControls = w >= 380;
                const showZoomControl = w >= 450;
                const showAyanamsa = w >= 320;
                const isCompact = w < 300;

                // Dynamic title max-width: leave room for controls
                const titleMaxWidth = isCompact
                    ? Math.max(40, w - 80)
                    : showDimensionControls
                        ? Math.max(30, w * 0.18)
                        : Math.max(40, w * 0.38);

                return (
                    <div
                        className="flex items-center justify-between px-2.5 shrink-0 cursor-move relative z-10 overflow-hidden border-b"
                        style={{
                            background: 'linear-gradient(180deg, #F8F3EB 0%, #F0E8DA 100%)',
                            borderBottomColor: '#D4C4A8',
                            height: theme.headerHeight ?? 38,
                        }}
                    >
                        {/* Left side: Title + dimension/zoom controls */}
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                            {/* Title — bold, dark, prominent */}
                            <span
                                className="font-medium truncate shrink-0 tracking-wide"
                                style={{
                                    color: '#3E2A1F',
                                    fontSize: Math.min(
                                        (theme.headerFontSize ?? 12) * finalScale.scale,
                                        isCompact ? 10 : Math.max(11, dimensions.width / 25)
                                    ),
                                    maxWidth: titleMaxWidth,
                                }}
                                title={displayTitle}
                            >
                                {displayTitle}
                            </span>

                            {/* W/H Controls — warm gold pill, high contrast */}
                            {showDimensionControls && (
                                <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg border border-[#C9B896] shrink-0">
                                    {/* Width */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ width: dimensions.width - 10 }); }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D4C4A8] active:scale-90 transition-all"
                                    >
                                        <Minus className="w-3 h-3 text-[#6B5B4E]" />
                                    </button>
                                    <span className="text-[10px] font-medium text-[#5A4A3A] text-center uppercase whitespace-nowrap min-w-[42px] tracking-wide">
                                        W: {dimensions.width}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ width: dimensions.width + 10 }); }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D4C4A8] active:scale-90 transition-all"
                                    >
                                        <Plus className="w-3 h-3 text-[#6B5B4E]" />
                                    </button>

                                    <div className="w-px h-3.5 bg-[#C9B896] mx-1" />

                                    {/* Height */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ height: dimensions.height - 10 }); }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D4C4A8] active:scale-90 transition-all"
                                    >
                                        <Minus className="w-3 h-3 text-[#6B5B4E]" />
                                    </button>
                                    <span className="text-[10px] font-medium text-[#5A4A3A] text-center uppercase whitespace-nowrap min-w-[42px] tracking-wide">
                                        H: {dimensions.height}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateDimensions({ height: dimensions.height + 10 }); }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#D4C4A8] active:scale-90 transition-all"
                                    >
                                        <Plus className="w-3 h-3 text-[#6B5B4E]" />
                                    </button>
                                </div>
                            )}

                            {/* Zoom Control — vibrant primary pill */}
                            {showZoomControl && (
                                <div className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg border border-primary/30 shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentScale = theme.contentTextScale ?? 1;
                                            onUpdateTheme({ contentTextScale: Math.max(0.5, currentScale - 0.05) });
                                        }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-primary/20 active:scale-90 transition-all"
                                    >
                                        <Minus className="w-3 h-3 text-primary" />
                                    </button>
                                    <span className="text-[10px] font-medium text-primary whitespace-nowrap text-center min-w-[32px] tracking-wide">
                                        {finalScale.scalePercentage}%
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentScale = theme.contentTextScale ?? 1;
                                            onUpdateTheme({ contentTextScale: Math.min(2, currentScale + 0.05) });
                                        }}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-primary/20 active:scale-90 transition-all"
                                    >
                                        <Plus className="w-3 h-3 text-primary" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right side: Ayanamsa + Settings + Close — always visible */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                            {onAyanamsaChange && showAyanamsa && (
                                <div className="relative">
                                    <AyanamsaSelect
                                        value={ayanamsa || 'Lahiri'}
                                        onChange={onAyanamsaChange}
                                        compact
                                    />
                                </div>
                            )}

                            <button
                                onClick={onCustomize}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#D4C4A8] hover:bg-white hover:border-primary/40 text-[#7A6A5A] hover:text-primary transition-all active:scale-95"
                                title="Customize"
                            >
                                <Settings className="w-3.5 h-3.5" />
                            </button>

                            <button
                                onClick={onRemove}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#D4C4A8] hover:bg-red-50 hover:border-red-300 text-[#7A6A5A] hover:text-red-500 transition-all active:scale-95"
                                title="Remove"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                );
            })()}

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
                        <p className="text-[10px] font-medium text-ink/30 uppercase tracking-[0.2em]">Synchronizing Data...</p>
                    </div>
                ) : !isAvailable && onGenerate ? (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-gold-dark/30 mb-2" />
                        <p className="text-[11px] text-ink/50 mb-3">{item.name} not generated</p>
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] font-medium transition-all"
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
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

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
        <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full">
            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 bg-surface-warm/95 border-b border-gold-primary/20 shrink-0">
                {/* Client Identity Context */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif shrink-0 shadow-sm"
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.90) 0%, rgba(139,90,43,0.85) 100%)',
                             border: '1px solid rgba(255,255,255,0.15)',
                         }}>
                        <span className="text-[16px] font-bold">{(clientDetails?.name?.[0] || 'U').toUpperCase()}</span>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="font-serif text-[16px] font-bold text-ink leading-tight truncate max-w-[180px]" title={clientDetails.name}>
                                {clientDetails.name}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3 mt-1 overflow-hidden">
                            <div className="flex items-center gap-1 shrink-0">
                                <Calendar className="w-3 h-3 text-gold-dark/60" />
                                <span className="text-[11px] font-medium text-ink/70 font-serif whitespace-nowrap">
                                    {formatDate(clientDetails.dateOfBirth)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-gold-dark/60" />
                                <span className="text-[11px] font-medium text-ink/70 font-serif whitespace-nowrap">
                                    {formatTime(clientDetails.timeOfBirth)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 overflow-hidden">
                                <MapPin className="w-3 h-3 text-gold-dark/60 shrink-0" />
                                <span className="text-[11px] font-medium text-ink/70 font-serif truncate max-w-[150px]" title={clientDetails.placeOfBirth.city}>
                                    {clientDetails.placeOfBirth.city}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gold-primary/20 shrink-0" />

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
