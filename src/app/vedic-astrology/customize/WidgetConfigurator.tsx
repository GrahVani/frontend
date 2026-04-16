"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { 
    X, 
    Palette, 
    Type, 
    Sparkles, 
    Check,
    Minus,
    Plus,
    Maximize2,
    Type as TypeIcon,
    Square,
    ChevronLeft,
    ChevronRight,
    Move,
    RotateCcw,
    LayoutGrid,
    Table2,
    List,
    Circle,
    FileText,
    Grid3x3,
    CreditCard,
    Settings,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { 
    CustomizeChartItem, 
    WidgetTheme, 
    WidgetDimensions 
} from '@/hooks/useCustomizeCharts';
import { 
    PRESET_THEMES,
    DEFAULT_WIDGET_THEME,
    DEFAULT_DIMENSIONS,
} from '@/hooks/useCustomizeCharts';
import {
    useContentAwareDimensions,
    type ContentCategory,
} from '@/hooks/useContentAwareDimensions';
import AyanamsaSelect from './AyanamsaSelect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface WidgetConfiguratorProps {
    isOpen: boolean;
    onClose: () => void;
    chart: CustomizeChartItem | null;
    currentAyanamsa: string;
    onAdd: (config: {
        dimensions: WidgetDimensions;
        theme: WidgetTheme;
        customTitle?: string;
        showHeader: boolean;
        showBorder: boolean;
        ayanamsa: string;
    }) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

const THEME_PREVIEWS = [
    { key: 'default', name: 'Classic', desc: 'Traditional warm' },
    { key: 'vedic', name: 'Vedic Gold', desc: 'Sacred gold' },
    { key: 'dark', name: 'Night', desc: 'Dark mode' },
    { key: 'spiritual', name: 'Sage', desc: 'Calm green' },
    { key: 'royal', name: 'Royal', desc: 'Purple' },
    { key: 'ocean', name: 'Ocean', desc: 'Blue' },
];

// Size presets by content category - Content-aware defaults
const SIZE_PRESETS_BY_CATEGORY: Record<ContentCategory, Array<{name: string; width: number; height: number; icon: string; desc: string}>> = {
    chart: [
        { name: 'Small', width: 320, height: 340, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 470, height: 500, icon: 'M', desc: 'Chart optimized' },
        { name: 'Large', width: 620, height: 660, icon: 'L', desc: 'Detailed view' },
    ],
    circular: [
        { name: 'Small', width: 380, height: 380, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 480, height: 480, icon: 'M', desc: 'Default view' },
        { name: 'Large', width: 600, height: 600, icon: 'L', desc: 'Detailed view' },
    ],
    table_wide: [
        { name: 'Small', width: 500, height: 320, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 650, height: 380, icon: 'M', desc: 'Table optimized' },
        { name: 'Large', width: 800, height: 450, icon: 'L', desc: 'Full data' },
    ],
    table_tall: [
        { name: 'Small', width: 350, height: 420, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 450, height: 520, icon: 'M', desc: 'List view' },
        { name: 'Large', width: 550, height: 650, icon: 'L', desc: 'Full view' },
    ],
    analysis_card: [
        { name: 'Small', width: 380, height: 360, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 500, height: 480, icon: 'M', desc: 'Default view' },
        { name: 'Large', width: 650, height: 620, icon: 'L', desc: 'Detailed view' },
    ],
    data_grid: [
        { name: 'Small', width: 400, height: 340, icon: 'S', desc: 'Compact view' },
        { name: 'Medium', width: 580, height: 420, icon: 'M', desc: 'Grid view' },
        { name: 'Large', width: 720, height: 480, icon: 'L', desc: 'Full grid' },
    ],
    compact_card: [
        { name: 'Small', width: 200, height: 180, icon: 'XS', desc: 'Minimal' },
        { name: 'Medium', width: 280, height: 220, icon: 'M', desc: 'Default view' },
        { name: 'Large', width: 350, height: 280, icon: 'L', desc: 'Expanded' },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_ICONS: Record<ContentCategory, React.ElementType> = {
    chart: LayoutGrid,
    table_wide: Table2,
    table_tall: List,
    circular: Circle,
    analysis_card: FileText,
    data_grid: Grid3x3,
    compact_card: CreditCard,
};

const CATEGORY_COLORS: Record<ContentCategory, { bg: string; text: string }> = {
    chart: { bg: 'bg-amber-100', text: 'text-amber-700' },
    table_wide: { bg: 'bg-blue-100', text: 'text-blue-700' },
    table_tall: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    circular: { bg: 'bg-violet-100', text: 'text-violet-700' },
    analysis_card: { bg: 'bg-rose-100', text: 'text-rose-700' },
    data_grid: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    compact_card: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE DIMENSIONS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface LiveDimensionsBadgeProps {
    width: number;
    height: number;
    isRecommended: boolean;
}

function LiveDimensionsBadge({ width, height, isRecommended }: LiveDimensionsBadgeProps) {
    return (
        <span className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded transition-colors duration-200",
            isRecommended 
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
        )}>
            {width} × {height}px
            {isRecommended && <Check className="w-3 h-3 inline ml-1" />}
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIXEL SIZE CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

function PixelSizeControl({ 
    label, 
    value, 
    min, 
    max, 
    onChange,
    step = 10,
}: { 
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    step?: number;
}) {
    // Round to nearest step
    const roundedValue = Math.round(value / step) * step;
    
    return (
        <div className="bg-surface-warm/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <label className="text-[12px] font-medium text-ink/70 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-gold-dark" />
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={roundedValue}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || min;
                            onChange(Math.max(min, Math.min(max, val)));
                        }}
                        className="w-20 px-2 py-1.5 text-right text-[14px] font-medium text-primary bg-white border border-[#E6D5B8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        min={min}
                        max={max}
                        step={step}
                    />
                    <span className="text-[11px] text-ink/40">px</span>
                </div>
            </div>
            
            {/* Slider */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - step))}
                    className="w-10 h-10 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center transition-all hover:border-primary hover:text-primary active:scale-95"
                >
                    <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex-1 relative">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                </div>
                
                <button
                    onClick={() => onChange(Math.min(max, value + step))}
                    className="w-10 h-10 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center transition-all hover:border-primary hover:text-primary active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Quick values */}
            <div className="flex gap-2 mt-3">
                {[min, Math.round((min + max) / 2), max].map((val) => (
                    <button
                        key={val}
                        onClick={() => onChange(val)}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                            Math.abs(value - val) < step
                                ? "bg-primary text-white"
                                : "bg-white border border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                        )}
                    >
                        {val}px
                    </button>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET PREVIEW - Shows actual pixel size
// ═══════════════════════════════════════════════════════════════════════════════

function WidgetPreview({ 
    chart, 
    config 
}: { 
    chart: CustomizeChartItem; 
    config: {
        dimensions: WidgetDimensions;
        theme: WidgetTheme;
        customTitle?: string;
        showHeader: boolean;
        showBorder: boolean;
    };
}) {
    const { theme, customTitle, showHeader, showBorder, dimensions } = config;
    const displayTitle = customTitle || chart.name;
    
    // Scale down for preview (max 280px width in preview)
    const maxPreviewWidth = 280;
    const maxPreviewHeight = 200;
    const scale = Math.min(
        maxPreviewWidth / dimensions.width,
        maxPreviewHeight / dimensions.height,
        1
    );
    
    const previewWidth = Math.round(dimensions.width * scale);
    const previewHeight = Math.round(dimensions.height * scale);

    return (
        <div className="bg-[#F5F3EF] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-ink/40 uppercase tracking-wider">Preview</span>
                <span className="text-[11px] font-medium text-primary">
                    {dimensions.width} × {dimensions.height}px
                </span>
            </div>
            
            {/* Preview Container */}
            <div 
                className="bg-white rounded-lg border-2 border-dashed border-[#D4C4A8] flex items-center justify-center overflow-hidden"
                style={{ 
                    width: maxPreviewWidth, 
                    height: maxPreviewHeight 
                }}
            >
                {/* Scaled Widget */}
                <div
                    className={cn(
                        "transition-all duration-200 flex flex-col overflow-hidden",
                        showBorder && "border"
                    )}
                    style={{
                        width: previewWidth,
                        height: previewHeight,
                        backgroundColor: theme.backgroundColor,
                        borderColor: showBorder ? theme.borderColor : 'transparent',
                        borderWidth: showBorder ? theme.borderWidth : 0,
                        borderRadius: theme.borderRadius * scale,
                        boxShadow: theme.shadowIntensity === 'heavy' ? `0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.15)` : 
                                  theme.shadowIntensity === 'medium' ? `0 ${2 * scale}px ${8 * scale}px rgba(0,0,0,0.1)` :
                                  theme.shadowIntensity === 'light' ? `0 ${1 * scale}px ${3 * scale}px rgba(0,0,0,0.05)` : 'none',
                    }}
                >
                    {showHeader && (
                        <div
                            className="px-2 py-1 shrink-0 flex items-center justify-between"
                            style={{
                                background: theme.headerBackground,
                                height: `${24 * scale}px`,
                            }}
                        >
                            <span 
                                className="truncate font-medium"
                                style={{ 
                                    color: theme.headerTextColor,
                                    fontSize: `${9 * scale}px`,
                                }}
                            >
                                {displayTitle}
                            </span>
                        </div>
                    )}
                    
                    {/* Content placeholder */}
                    <div 
                        className="flex-1 flex items-center justify-center p-2"
                        style={{ color: theme.textColor }}
                    >
                        <div 
                            className="w-full h-full rounded opacity-20"
                            style={{ backgroundColor: theme.accentColor }}
                        />
                    </div>
                </div>
            </div>

            {/* Size info */}
            <div className="flex items-center justify-center gap-4 mt-3">
                <div className="text-center">
                    <span className="text-[10px] text-ink/40 block">Width</span>
                    <span className="text-[13px] font-bold text-ink">{dimensions.width}px</span>
                </div>
                <span className="text-ink/20">×</span>
                <div className="text-center">
                    <span className="text-[10px] text-ink/40 block">Height</span>
                    <span className="text-[13px] font-bold text-ink">{dimensions.height}px</span>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════

function ThemeSelector({ 
    value, 
    onChange,
    onApplyPreset,
}: { 
    value: WidgetTheme; 
    onChange: (theme: Partial<WidgetTheme>) => void;
    onApplyPreset: (presetKey: string) => void;
}) {
    const [showCustom, setShowCustom] = useState(false);

    return (
        <div className="space-y-3">
            {/* Quick Themes */}
            <div className="grid grid-cols-2 gap-2">
                {THEME_PREVIEWS.map((preset) => {
                    const theme = PRESET_THEMES[preset.key];
                    const isSelected = value.backgroundColor === theme.backgroundColor;
                    
                    return (
                        <button
                            key={preset.key}
                            onClick={() => onApplyPreset(preset.key)}
                            className={cn(
                                "p-2.5 rounded-xl border-2 transition-all text-left",
                                isSelected ? "border-primary ring-1 ring-primary/20" : "border-transparent hover:border-[#E6D5B8]"
                            )}
                            style={{ backgroundColor: theme.backgroundColor }}
                        >
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full border border-black/10"
                                    style={{ backgroundColor: theme.accentColor }}
                                />
                                <span className="text-[11px] font-medium" style={{ color: theme.textColor }}>
                                    {preset.name}
                                </span>
                                {isSelected && <Check className="w-3 h-3 text-primary ml-auto" />}
                            </div>
                            <p className="text-[9px] opacity-60 mt-0.5" style={{ color: theme.textColor }}>
                                {preset.desc}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Custom Colors Toggle */}
            <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full flex items-center justify-between p-3 bg-surface-warm/50 rounded-xl text-[12px] font-medium text-ink/70 hover:bg-surface-warm transition-colors"
            >
                <span>Custom Colors</span>
                {showCustom ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {showCustom && (
                <div className="space-y-2 p-3 bg-surface-warm/30 rounded-xl">
                    {[
                        { key: 'backgroundColor', label: 'Background' },
                        { key: 'accentColor', label: 'Accent' },
                        { key: 'borderColor', label: 'Border' },
                        { key: 'headerTextColor', label: 'Header Text' },
                    ].map((color) => (
                        <div key={color.key} className="flex items-center justify-between">
                            <span className="text-[11px] text-ink/70">{color.label}</span>
                            <input
                                type="color"
                                value={(value as any)[color.key]}
                                onChange={(e) => onChange({ [color.key]: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer border-0"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Style Options */}
            <div className="space-y-2 pt-2">
                <div>
                    <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Shadow</label>
                    <div className="flex gap-1">
                        {(['none', 'light', 'medium', 'heavy'] as const).map((shadow) => (
                            <button
                                key={shadow}
                                onClick={() => onChange({ shadowIntensity: shadow })}
                                className={cn(
                                    "flex-1 py-2 rounded-lg border text-[10px] font-medium capitalize transition-all",
                                    value.shadowIntensity === shadow
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                                )}
                            >
                                {shadow}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Corner Radius</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min={0}
                            max={24}
                            value={value.borderRadius}
                            onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <span className="text-[11px] font-bold text-primary w-10 text-right">{value.borderRadius}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function WidgetConfigurator({ 
    isOpen, 
    onClose, 
    chart, 
    currentAyanamsa,
    onAdd 
}: WidgetConfiguratorProps) {
    const [activeTab, setActiveTab] = useState<'size' | 'theme' | 'advanced'>('size');
    
    // State with default dimensions from chart
    const [dimensions, setDimensions] = useState<WidgetDimensions>(DEFAULT_DIMENSIONS);
    const [theme, setTheme] = useState<WidgetTheme>(DEFAULT_WIDGET_THEME);
    const [customTitle, setCustomTitle] = useState('');
    const [showHeader, setShowHeader] = useState(true);
    const [showBorder, setShowBorder] = useState(true);
    const [selectedAyanamsa, setSelectedAyanamsa] = useState(currentAyanamsa);

    // Content-aware dimensions based on selected chart
    const contentAware = useContentAwareDimensions(chart?.id || '', dimensions);

    // Check if current dimensions match recommended size
    const isRecommendedSize = useMemo(() => {
        const recommended = contentAware.dimensions;
        return dimensions.width === recommended.width && 
               dimensions.height === recommended.height;
    }, [dimensions, contentAware.dimensions]);

    // Get category icon and colors
    const CategoryIcon = CATEGORY_ICONS[contentAware.profile.category];
    const categoryColors = CATEGORY_COLORS[contentAware.profile.category];

    // Reset when chart changes
    React.useEffect(() => {
        if (chart) {
            // Use content-aware dimensions as default
            const defaultDims = chart.defaultDimensions || contentAware.dimensions;
            setDimensions({ ...defaultDims });
            setTheme({ ...DEFAULT_WIDGET_THEME, ...chart.defaultTheme });
            setCustomTitle('');
            setShowHeader(true);
            setShowBorder(true);
            setSelectedAyanamsa(currentAyanamsa);
            setActiveTab('size');
        }
    }, [chart?.id, currentAyanamsa]);

    // Get size presets based on content category
    const sizePresets = chart 
        ? SIZE_PRESETS_BY_CATEGORY[contentAware.profile.category] 
        : SIZE_PRESETS_BY_CATEGORY.analysis_card;

    const handleApplyThemePreset = useCallback((presetKey: string) => {
        const preset = PRESET_THEMES[presetKey];
        if (preset) setTheme({ ...preset });
    }, []);

    const handleAdd = useCallback(() => {
        onAdd({
            dimensions,
            theme,
            customTitle: customTitle.trim() || undefined,
            showHeader,
            showBorder,
            ayanamsa: selectedAyanamsa,
        });
        onClose();
    }, [dimensions, theme, customTitle, showHeader, showBorder, selectedAyanamsa, onAdd, onClose]);

    if (!isOpen || !chart) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E6D5B8]/30 bg-surface-warm shrink-0">
                    <div className="flex items-start justify-between">
                        {/* Left: Category Icon + Info */}
                        <div className="flex items-start gap-3">
                            {/* Dynamic Category Icon */}
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0",
                                categoryColors.bg,
                                categoryColors.text
                            )}>
                                <CategoryIcon className="w-6 h-6" />
                            </div>
                            
                            {/* Widget Info */}
                            <div className="min-w-0">
                                <h2 className="text-[18px] font-medium text-ink leading-tight truncate">{chart.name}</h2>
                                <p className="text-[11px] text-ink/60 mt-0.5 truncate">{chart.description}</p>
                                
                                {/* Tags Row: Content Type + Live Dimensions */}
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className={cn(
                                        "text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded",
                                        categoryColors.bg,
                                        categoryColors.text
                                    )}>
                                        {contentAware.contentInfo.label}
                                    </span>
                                    <span className="text-ink/20">•</span>
                                    <LiveDimensionsBadge 
                                        width={dimensions.width}
                                        height={dimensions.height}
                                        isRecommended={isRecommendedSize}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Ayanamsa Selector */}
                            <AyanamsaSelect
                                value={selectedAyanamsa}
                                onChange={setSelectedAyanamsa}
                                compact
                            />
                            
                            {/* Settings Button - Switch to Advanced tab */}
                            <button
                                onClick={() => setActiveTab('advanced')}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    activeTab === 'advanced'
                                        ? "bg-primary text-white"
                                        : "hover:bg-gold-primary/20 text-ink/40 hover:text-ink"
                                )}
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            
                            {/* Close Button */}
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-gold-primary/20 rounded-lg transition-colors text-ink/40 hover:text-ink"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        {[
                            { id: 'size', label: 'Size', icon: Maximize2 },
                            { id: 'theme', label: 'Theme', icon: Palette },
                            { id: 'advanced', label: 'More', icon: Sparkles },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary text-white shadow-sm"
                                        : "bg-white border border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Controls */}
                    <div className="w-[360px] border-r border-[#E6D5B8]/30 overflow-y-auto custom-scrollbar">
                        <div className="p-5">
                            {activeTab === 'size' && (
                                <div className="space-y-4">
                                    {/* Content Type Info */}
                                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                        <p className="text-[11px] text-blue-700 leading-relaxed">
                                            <strong>{contentAware.contentInfo.label}</strong>: {contentAware.contentInfo.description}
                                        </p>
                                        <p className="text-[10px] text-blue-600 mt-1">
                                            Recommended: {contentAware.contentInfo.defaultSize} • Free resize
                                        </p>
                                    </div>

                                    {/* Size Presets - Dynamic based on content type */}
                                    <div>
                                        <label className="text-[10px] font-bold text-ink/50 mb-2 block uppercase tracking-wider">
                                            Recommended Sizes
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {sizePresets.map((preset) => (
                                                <button
                                                    key={preset.name}
                                                    onClick={() => setDimensions({ ...dimensions, width: preset.width, height: preset.height })}
                                                    className={cn(
                                                        "p-2 rounded-xl border text-center transition-all",
                                                        dimensions.width === preset.width && dimensions.height === preset.height
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                                                    )}
                                                >
                                                    <span className="text-[14px] font-semibold block">{preset.icon}</span>
                                                    <span className="text-[9px] font-medium">{preset.name}</span>
                                                    <span className="text-[8px] opacity-70 block">{preset.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Width Control - Use content-aware min/max */}
                                    <PixelSizeControl
                                        label="Width"
                                        value={dimensions.width}
                                        min={contentAware.dimensions.minWidth}
                                        max={contentAware.dimensions.maxWidth}
                                        onChange={(width) => setDimensions({ ...dimensions, width })}
                                        step={contentAware.resizeStep}
                                    />

                                    {/* Height Control - Use content-aware min/max */}
                                    <PixelSizeControl
                                        label="Height"
                                        value={dimensions.height}
                                        min={contentAware.dimensions.minHeight}
                                        max={contentAware.dimensions.maxHeight}
                                        onChange={(height) => setDimensions({ ...dimensions, height })}
                                        step={contentAware.resizeStep}
                                    />
                                </div>
                            )}

                            {activeTab === 'theme' && (
                                <ThemeSelector 
                                    value={theme}
                                    onChange={(t) => setTheme({ ...theme, ...t })}
                                    onApplyPreset={handleApplyThemePreset}
                                />
                            )}

                            {activeTab === 'advanced' && (
                                <div className="space-y-4">
                                    {/* Custom Title */}
                                    <div>
                                        <label className="text-[11px] font-bold text-ink/50 mb-2 block">Custom Title</label>
                                        <input
                                            type="text"
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            placeholder={chart.name}
                                            className="w-full px-4 py-3 bg-white border border-[#E6D5B8]/30 rounded-xl text-[13px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <p className="mt-1.5 text-[10px] text-ink/40">
                                            Leave empty to use default: <span className="font-medium">{chart.name}</span>
                                        </p>
                                    </div>

                                    {/* Toggles */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setShowHeader(!showHeader)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                                showHeader ? "bg-primary/5 border-primary/20" : "bg-white border-[#E6D5B8]/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <TypeIcon className={cn("w-5 h-5", showHeader ? "text-primary" : "text-ink/30")} />
                                                <span className="text-[13px] font-medium text-ink">Show Header</span>
                                            </div>
                                            <div className={cn("w-11 h-5 rounded-full relative transition-colors", showHeader ? "bg-primary" : "bg-ink/20")}>
                                                <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", showHeader ? "translate-x-6" : "")} />
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setShowBorder(!showBorder)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                                showBorder ? "bg-primary/5 border-primary/20" : "bg-white border-[#E6D5B8]/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Square className={cn("w-5 h-5", showBorder ? "text-primary" : "text-ink/30")} />
                                                <span className="text-[13px] font-medium text-ink">Show Border</span>
                                            </div>
                                            <div className={cn("w-11 h-5 rounded-full relative transition-colors", showBorder ? "bg-primary" : "bg-ink/20")}>
                                                <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", showBorder ? "translate-x-6" : "")} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="flex-1 bg-white p-5 overflow-hidden flex flex-col">
                        <WidgetPreview 
                            chart={chart}
                            config={{
                                dimensions,
                                theme,
                                customTitle: customTitle.trim() || undefined,
                                showHeader,
                                showBorder,
                            }}
                        />
                        
                        {/* Info */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-[11px] text-blue-700 leading-relaxed">
                                <strong>Tip:</strong> You can also resize widgets directly on the dashboard using the resize handles, or use the +/- buttons in the widget header for quick adjustments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#E6D5B8]/30 bg-surface-warm shrink-0">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => {
                                const defaultDims = chart.defaultDimensions || DEFAULT_DIMENSIONS;
                                setDimensions({ ...defaultDims });
                                setTheme({ ...DEFAULT_WIDGET_THEME, ...chart.defaultTheme });
                                setCustomTitle('');
                                setShowHeader(true);
                                setShowBorder(true);
                            }}
                            className="flex items-center gap-2 text-[12px] font-bold text-ink/50 hover:text-ink/70 px-3 py-2 rounded-lg hover:bg-ink/5 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #D4AD5A 0%, #C9A24D 50%, #9C7A2F 100%)' }}
                            >
                                <Check className="w-4 h-4" />
                                Add Widget
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
