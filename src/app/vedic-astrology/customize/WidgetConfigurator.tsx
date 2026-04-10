"use client";

import React, { useState, useCallback } from 'react';
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

// Size presets - Updated to match smart defaults for optimal first view
const SIZE_PRESETS = [
    { name: 'Small', width: 320, height: 340, icon: 'S', desc: 'Compact view' },
    { name: 'Medium', width: 470, height: 500, icon: 'M', desc: 'Chart optimized' },
    { name: 'Large', width: 580, height: 620, icon: 'L', desc: 'Detailed view' },
    { name: 'Wide', width: 650, height: 380, icon: 'W', desc: 'Table optimized' },
    { name: 'Tall', width: 450, height: 520, icon: 'T', desc: 'Analysis view' },
];

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
                <label className="text-[12px] font-bold text-ink/70 flex items-center gap-2">
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
                        className="w-20 px-2 py-1.5 text-right text-[14px] font-bold text-primary bg-white border border-[#E6D5B8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all",
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
                <span className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Preview</span>
                <span className="text-[11px] font-bold text-primary">
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
                                className="truncate font-bold"
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
                                <span className="text-[11px] font-bold" style={{ color: theme.textColor }}>
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
                className="w-full flex items-center justify-between p-3 bg-surface-warm/50 rounded-xl text-[12px] font-bold text-ink/70 hover:bg-surface-warm transition-colors"
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
                                    "flex-1 py-2 rounded-lg border text-[10px] font-bold capitalize transition-all",
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

    // Reset when chart changes
    React.useEffect(() => {
        if (chart) {
            const defaultDims = chart.defaultDimensions || DEFAULT_DIMENSIONS;
            setDimensions({ ...defaultDims });
            setTheme({ ...DEFAULT_WIDGET_THEME, ...chart.defaultTheme });
            setCustomTitle('');
            setShowHeader(true);
            setShowBorder(true);
            setActiveTab('size');
        }
    }, [chart?.id]);

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
        });
        onClose();
    }, [dimensions, theme, customTitle, showHeader, showBorder, onAdd, onClose]);

    if (!isOpen || !chart) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E6D5B8]/30 bg-surface-warm shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                                <Maximize2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-black text-ink leading-tight">Configure Widget</h2>
                                <p className="text-[12px] text-gold-dark font-bold mt-0.5">{chart.name} • {currentAyanamsa}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gold-primary/20 rounded-xl transition-colors text-ink/40 hover:text-ink">
                            <X className="w-6 h-6" />
                        </button>
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
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all",
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
                                    {/* Size Presets */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {SIZE_PRESETS.map((preset) => (
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
                                                <span className="text-[14px] font-black block">{preset.icon}</span>
                                                <span className="text-[9px] font-bold">{preset.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Width Control */}
                                    <PixelSizeControl
                                        label="Width"
                                        value={dimensions.width}
                                        min={dimensions.minWidth}
                                        max={dimensions.maxWidth}
                                        onChange={(width) => setDimensions({ ...dimensions, width })}
                                        step={10}
                                    />

                                    {/* Height Control */}
                                    <PixelSizeControl
                                        label="Height"
                                        value={dimensions.height}
                                        min={dimensions.minHeight}
                                        max={dimensions.maxHeight}
                                        onChange={(height) => setDimensions({ ...dimensions, height })}
                                        step={10}
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
                                                <span className="text-[13px] font-bold text-ink">Show Header</span>
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
                                                <span className="text-[13px] font-bold text-ink">Show Border</span>
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
