"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
    GripVertical,
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
    useCustomizeCharts, 
    type CustomizeChartItem, 
    type SelectedItemDetail, 
    type WidgetTheme,
    type WidgetDimensions,
    CHART_CATALOG,
    DEFAULT_WIDGET_THEME,
    DEFAULT_DIMENSIONS,
} from '@/hooks/useCustomizeCharts';
import { renderWidget } from './WidgetBoxes';
import WidgetConfigurator from './WidgetConfigurator';
import CompactWidgetPanel from './CompactWidgetPanel';
import ChartSelectorModal from './ChartSelectorModal';
import AyanamsaSelect from './AyanamsaSelect';

// Components
import { ChartWithPopup, CompactChartWithPopup, Planet } from '@/components/astrology/NorthIndianChart';
import SouthIndianChart, { ChartColorMode } from '@/components/astrology/SouthIndianChart';
import dynamic from 'next/dynamic';

const DivisionalChartZoomModal = dynamic(() => import('@/components/astrology/DivisionalChartZoomModal'));

// ═══════════════════════════════════════════════════════════════════════════════
// RESIZABLE WIDGET BOX - With resize handles and quick controls
// ═══════════════════════════════════════════════════════════════════════════════

interface ResizableWidgetBoxProps {
    item: SelectedItemDetail;
    onRemove: () => void;
    onCustomize: () => void;
    onAyanamsaChange?: (ayanamsa: string) => void;
    onResize: (deltaWidth: number, deltaHeight: number) => void;
    onUpdateDimensions: (dims: Partial<WidgetDimensions>) => void;
    children: React.ReactNode;
    isAvailable?: boolean;
    isGenerating?: boolean;
    onGenerate?: () => void;
}

function ResizableWidgetBox({
    item,
    onRemove,
    onCustomize,
    onAyanamsaChange,
    onResize,
    onUpdateDimensions,
    children,
    isAvailable,
    isGenerating,
    onGenerate,
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
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

    // Quick resize handlers
    const handleQuickResize = (deltaW: number, deltaH: number) => {
        onResize(deltaW, deltaH);
    };

    // Mouse resize handlers
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
                "relative flex flex-col overflow-hidden transition-shadow",
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
            {/* Header with Quick Controls */}
            {showHeader && (
                <div
                    className="flex items-center justify-between px-3 shrink-0 cursor-move overflow-hidden"
                    style={{
                        background: theme.headerBackground,
                        color: theme.headerTextColor,
                        height: theme.headerHeight ?? 36,
                    }}
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1" style={{ justifyContent: theme.titleAlign ?? 'flex-start' }}>
                        {/* Drag Handle */}
                        <GripVertical className="opacity-40 shrink-0" style={{ width: (theme.headerFontSize ?? 12) + 2, height: (theme.headerFontSize ?? 12) + 2 }} />
                        
                        {/* Title - with scaling based on widget width */}
                        <span 
                            className="font-bold truncate"
                            style={{ 
                                color: theme.headerTextColor,
                                fontSize: Math.min(
                                    (theme.headerFontSize ?? 12) * (theme.contentTextScale ?? 1),
                                    dimensions.width / 20  // Scale based on widget width
                                ),
                                maxWidth: theme.titleMaxWidth ?? dimensions.width * 0.5,
                                textAlign: theme.titleAlign ?? 'left',
                            }}
                        >
                            {displayTitle}
                        </span>
                        
                        {/* Size Indicator */}
                        <span 
                            className="opacity-50 shrink-0"
                            style={{ fontSize: Math.max(9, (theme.headerFontSize ?? 12) * 0.75 * (theme.contentTextScale ?? 1)) }}
                        >
                            {dimensions.width}×{dimensions.height}
                        </span>
                    </div>

                    {/* Quick Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Quick Resize Buttons */}
                        <div className="flex items-center bg-black/10 rounded-lg p-0.5 mr-2">
                            <button
                                onClick={() => handleQuickResize(-20, 0)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Decrease width"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[9px] px-1 opacity-70">W</span>
                            <button
                                onClick={() => handleQuickResize(20, 0)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Increase width"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex items-center bg-black/10 rounded-lg p-0.5 mr-2">
                            <button
                                onClick={() => handleQuickResize(0, -20)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Decrease height"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[9px] px-1 opacity-70">H</span>
                            <button
                                onClick={() => handleQuickResize(0, 20)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Increase height"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Ayanamsa Selector */}
                        {onAyanamsaChange && (
                            <div className="mr-1">
                                <AyanamsaSelect
                                    value={ayanamsa || 'Lahiri'}
                                    onChange={onAyanamsaChange}
                                    compact
                                />
                            </div>
                        )}

                        {/* Settings */}
                        <button
                            onClick={onCustomize}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            title="Customize"
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove */}
                        <button
                            onClick={onRemove}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            title="Remove"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative overflow-auto min-h-0">
                {isGenerating && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                )}
                
                {!isAvailable && onGenerate ? (
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
                        style={{ 
                            color: theme.textColor,
                            fontSize: `${(theme.contentTextScale ?? 1) * 100}%`,
                        }}
                    >
                        {children}
                    </div>
                )}
            </div>

            {/* Resize Handles */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Bottom-right corner */}
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                >
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </div>
                
                {/* Bottom edge */}
                <div
                    className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 's')}
                />
                
                {/* Right edge */}
                <div
                    className="absolute top-4 bottom-4 right-0 w-2 cursor-e-resize pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleResizeStart(e, 'e')}
                />
            </div>
        </div>
    );
}

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

    // Hook
    const {
        selectedItems,
        selectedChartDetails,
        availableCharts,
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
        resetToDefaults,
    } = useCustomizeCharts();

    const activeSystem = localAyanamsa.toLowerCase();
    const clientId = clientDetails?.id || '';

    // UI State
    const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
    const [isWidgetConfiguratorOpen, setIsWidgetConfiguratorOpen] = useState(false);
    const [selectedChartForConfig, setSelectedChartForConfig] = useState<CustomizeChartItem | null>(null);
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
    const handleSelectChart = useCallback((chart: CustomizeChartItem, ayanamsa: string) => {
        setSelectedChartForConfig(chart);
        setLocalAyanamsa(ayanamsa as typeof localAyanamsa); // Update local ayanamsa to match selection
        setIsWidgetConfiguratorOpen(true);
        setIsChartSelectorOpen(false);
    }, []);

    const handleAddConfiguredChart = useCallback((config: {
        dimensions: WidgetDimensions;
        theme: WidgetTheme;
        customTitle?: string;
        showHeader: boolean;
        showBorder: boolean;
    }) => {
        if (!selectedChartForConfig) return;
        addChart(selectedChartForConfig.id, localAyanamsa, config);
        setIsWidgetConfiguratorOpen(false);
        setSelectedChartForConfig(null);
    }, [addChart, localAyanamsa, selectedChartForConfig]);

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
                <span
                    className="font-serif font-bold text-[16px] tracking-[0.12em] uppercase"
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

                {selectedItems.length > 0 && (
                    <button
                        onClick={resetToDefaults}
                        className="text-[11px] font-black uppercase tracking-widest text-ink hover:text-red-700 transition-all bg-red-50/50 px-2 py-0.5 rounded-md border border-red-200/30"
                    >
                        Clear All
                    </button>
                )}

                <div className="flex-1" />

                {selectedItems.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5 text-gold-dark/50" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-gold-dark/70">
                            {selectedItems.length} Widget{selectedItems.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Canvas Area - Free Form Layout */}
            <div className="flex-1 overflow-auto bg-[#FAF9F6] p-6">
                {selectedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <h3 className="text-[24px] font-black text-ink mb-3">Your Canvas is Empty</h3>
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
                            const isWidget = item.category.startsWith('widget_') || item.category === 'kp_module';
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
                                            onResize={(dw, dh) => resizeByDelta(item.instanceId, dw, dh)}
                                            onUpdateDimensions={(dims) => updateDimensions(item.instanceId, dims)}
                                        >
                                            <div className="p-4 text-[10px]">
                                                Widget: {item.name}
                                            </div>
                                        </ResizableWidgetBox>
                                    ) : (
                                        <ResizableWidgetBox
                                            item={item}
                                            onRemove={() => removeChart(item.instanceId)}
                                            onCustomize={() => setCustomizationPanel({ isOpen: true, selectedWidget: item })}
                                            onAyanamsaChange={(a) => updateChartAyanamsa(item.instanceId, a)}
                                            onResize={(dw, dh) => resizeByDelta(item.instanceId, dw, dh)}
                                            onUpdateDimensions={(dims) => updateDimensions(item.instanceId, dims)}
                                            isAvailable={isChartAvailable(item.id, item.ayanamsa)}
                                            isGenerating={generatingCharts.has(item.id)}
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
                                            <div className="h-full p-2">
                                                {(() => {
                                                    const { planets, ascendant } = getChartProps(item.id, item.ayanamsa);
                                                    return chartStyle === 'South Indian' ? (
                                                        <SouthIndianChart
                                                            ascendantSign={ascendant}
                                                            planets={planets}
                                                            colorMode="color"
                                                            colorTheme={chartColorTheme}
                                                            className="w-full h-full"
                                                        />
                                                    ) : (
                                                        <CompactChartWithPopup
                                                            ascendantSign={ascendant}
                                                            planets={planets}
                                                            className="w-full h-full"
                                                            showDegrees={item.id === 'D1'}
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

            {/* Chart Selector - Step by Step */}
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
                widget={customizationPanel.selectedWidget || null}
                onUpdateTheme={(t) => customizationPanel.selectedWidget && updateTheme(customizationPanel.selectedWidget.instanceId, t)}
                onUpdateDimensions={(d) => customizationPanel.selectedWidget && updateDimensions(customizationPanel.selectedWidget.instanceId, d)}
                onUpdateCustomTitle={(title) => customizationPanel.selectedWidget && updateCustomTitle(customizationPanel.selectedWidget.instanceId, title)}
                onToggleHeader={() => customizationPanel.selectedWidget && toggleHeader(customizationPanel.selectedWidget.instanceId)}
                onToggleBorder={() => customizationPanel.selectedWidget && toggleBorder(customizationPanel.selectedWidget.instanceId)}
                onDuplicate={() => {
                    if (customizationPanel.selectedWidget) {
                        duplicateChart(customizationPanel.selectedWidget.instanceId);
                        setCustomizationPanel({ isOpen: false });
                    }
                }}
                onRemove={() => {
                    if (customizationPanel.selectedWidget) {
                        removeChart(customizationPanel.selectedWidget.instanceId);
                        setCustomizationPanel({ isOpen: false });
                    }
                }}
                onApplyThemePreset={(preset) => customizationPanel.selectedWidget && applyThemePreset(customizationPanel.selectedWidget.instanceId, preset)}
            />
        </div>
    );
}
