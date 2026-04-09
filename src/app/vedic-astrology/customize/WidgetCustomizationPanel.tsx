"use client";

import React, { useState, useEffect } from 'react';
import { 
    X, 
    Palette, 
    Maximize2, 
    Type, 
    Sparkles, 
    Copy, 
    Trash2,
    Check,
    Minus,
    Plus,
    Type as TypeIcon,
    Square,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { SelectedItemDetail, WidgetTheme, WidgetDimensions } from '@/hooks/useCustomizeCharts';
import { PRESET_THEMES } from '@/hooks/useCustomizeCharts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface WidgetCustomizationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    widget: SelectedItemDetail | null;
    onUpdateTheme: (theme: Partial<WidgetTheme>) => void;
    onUpdateDimensions: (dims: Partial<WidgetDimensions>) => void;
    onUpdateCustomTitle: (title: string | undefined) => void;
    onToggleHeader: () => void;
    onToggleBorder: () => void;
    onDuplicate: () => void;
    onRemove: () => void;
    onApplyThemePreset: (presetName: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

const THEME_PREVIEWS = [
    { key: 'default', name: 'Classic', bg: '#FDFBF7', accent: '#C9A24D', text: '#3E2A1F' },
    { key: 'vedic', name: 'Vedic Gold', bg: '#FFF8E7', accent: '#D4AD5A', text: '#3E2A1F' },
    { key: 'dark', name: 'Night', bg: '#1A1A2E', accent: '#E94560', text: '#E8E8E8' },
    { key: 'spiritual', name: 'Sage', bg: '#F0F4F0', accent: '#5B8A5B', text: '#3E2A1F' },
    { key: 'royal', name: 'Royal', bg: '#FAF5FF', accent: '#7C3AED', text: '#3E2A1F' },
    { key: 'ocean', name: 'Ocean', bg: '#F0F9FF', accent: '#0EA5E9', text: '#3E2A1F' },
];

// Size presets
const SIZE_PRESETS = [
    { name: 'Small', width: 250, height: 200 },
    { name: 'Medium', width: 350, height: 280 },
    { name: 'Large', width: 500, height: 400 },
    { name: 'Wide', width: 600, height: 300 },
    { name: 'Tall', width: 350, height: 500 },
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
    const roundedValue = Math.round(value / step) * step;
    
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-ink/60">{label}</label>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={roundedValue}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || min;
                            onChange(Math.max(min, Math.min(max, val)));
                        }}
                        className="w-16 px-2 py-1 text-right text-[13px] font-bold text-primary bg-white border border-[#E6D5B8]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        min={min}
                        max={max}
                        step={step}
                    />
                    <span className="text-[10px] text-ink/40">px</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(Math.max(min, value - step))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center hover:border-primary transition-colors"
                >
                    <Minus className="w-3 h-3" />
                </button>
                
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                />
                
                <button
                    onClick={() => onChange(Math.min(max, value + step))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center hover:border-primary transition-colors"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function WidgetCustomizationPanel({
    isOpen,
    onClose,
    widget,
    onUpdateTheme,
    onUpdateDimensions,
    onUpdateCustomTitle,
    onToggleHeader,
    onToggleBorder,
    onDuplicate,
    onRemove,
    onApplyThemePreset,
}: WidgetCustomizationPanelProps) {
    const [activeTab, setActiveTab] = useState<'look' | 'size' | 'content'>('look');
    const [customTitle, setCustomTitle] = useState('');
    const [showCustomColors, setShowCustomColors] = useState(false);

    useEffect(() => {
        if (widget) setCustomTitle(widget.customTitle || '');
    }, [widget?.customTitle, widget?.instanceId]);

    if (!isOpen || !widget) return null;

    const { theme, dimensions, showHeader, showBorder, name } = widget;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[70]" onClick={onClose} />

            {/* Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[75] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E6D5B8]/30 bg-surface-warm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-[18px] font-black text-ink">Customize</h3>
                            <p className="text-[12px] text-gold-dark font-bold mt-0.5">{name}</p>
                            <p className="text-[10px] text-ink/40 mt-1">
                                {dimensions.width} × {dimensions.height}px
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gold-primary/20 rounded-lg text-ink/40 hover:text-ink">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4">
                        {[
                            { id: 'look', label: 'Look', icon: Palette },
                            { id: 'size', label: 'Size', icon: Maximize2 },
                            { id: 'content', label: 'Content', icon: Type },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary text-white"
                                        : "bg-white border border-[#E6D5B8]/30 text-ink/60"
                                )}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {activeTab === 'look' && (
                        <div className="space-y-4">
                            {/* Themes */}
                            <div className="grid grid-cols-2 gap-2">
                                {THEME_PREVIEWS.map((preset) => {
                                    const isSelected = theme.backgroundColor === preset.bg;
                                    return (
                                        <button
                                            key={preset.key}
                                            onClick={() => onApplyThemePreset(preset.key)}
                                            className={cn(
                                                "p-3 rounded-xl border-2 transition-all text-left",
                                                isSelected ? "border-primary" : "border-transparent hover:border-[#E6D5B8]"
                                            )}
                                            style={{ backgroundColor: preset.bg }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full border border-black/10"
                                                    style={{ backgroundColor: preset.accent }}
                                                />
                                                <span className="text-[11px] font-bold" style={{ color: preset.text }}>
                                                    {preset.name}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Colors Toggle */}
                            <button
                                onClick={() => setShowCustomColors(!showCustomColors)}
                                className="w-full flex items-center justify-between p-3 bg-surface-warm/50 rounded-xl text-[12px] font-bold text-ink/70"
                            >
                                Custom Colors
                                {showCustomColors ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>

                            {showCustomColors && (
                                <div className="space-y-2 p-3 bg-surface-warm/30 rounded-xl">
                                    {[
                                        { key: 'backgroundColor', label: 'Background' },
                                        { key: 'accentColor', label: 'Accent' },
                                        { key: 'borderColor', label: 'Border' },
                                    ].map((color) => (
                                        <div key={color.key} className="flex items-center justify-between">
                                            <span className="text-[11px] text-ink/70">{color.label}</span>
                                            <input
                                                type="color"
                                                value={(theme as any)[color.key]}
                                                onChange={(e) => onUpdateTheme({ [color.key]: e.target.value })}
                                                className="w-7 h-7 rounded cursor-pointer border-0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Style Options */}
                            <div className="space-y-3 pt-2">
                                <div>
                                    <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Shadow</label>
                                    <div className="flex gap-1">
                                        {(['none', 'light', 'medium', 'heavy'] as const).map((shadow) => (
                                            <button
                                                key={shadow}
                                                onClick={() => onUpdateTheme({ shadowIntensity: shadow })}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg border text-[10px] font-bold capitalize transition-all",
                                                    theme.shadowIntensity === shadow
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white border-[#E6D5B8]/30 text-ink/60"
                                                )}
                                            >
                                                {shadow}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Corner Radius: {theme.borderRadius}px</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={24}
                                        value={theme.borderRadius}
                                        onChange={(e) => onUpdateTheme({ borderRadius: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-2 pt-2">
                                <button
                                    onClick={onToggleHeader}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                        showHeader ? "bg-primary/5 border-primary/20" : "bg-white border-[#E6D5B8]/30"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <TypeIcon className={cn("w-5 h-5", showHeader ? "text-primary" : "text-ink/30")} />
                                        <span className="text-[13px] font-bold text-ink">Show Header</span>
                                    </div>
                                    <div className={cn("w-10 h-5 rounded-full relative", showHeader ? "bg-primary" : "bg-ink/20")}>
                                        <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", showHeader ? "translate-x-5" : "")} />
                                    </div>
                                </button>

                                <button
                                    onClick={onToggleBorder}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                                        showBorder ? "bg-primary/5 border-primary/20" : "bg-white border-[#E6D5B8]/30"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Square className={cn("w-5 h-5", showBorder ? "text-primary" : "text-ink/30")} />
                                        <span className="text-[13px] font-bold text-ink">Show Border</span>
                                    </div>
                                    <div className={cn("w-10 h-5 rounded-full relative", showBorder ? "bg-primary" : "bg-ink/20")}>
                                        <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", showBorder ? "translate-x-5" : "")} />
                                    </div>
                                </button>
                            </div>

                            {/* Header Style - Only when header is shown */}
                            {showHeader && (
                                <div className="space-y-3 pt-4 border-t border-[#E6D5B8]/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TypeIcon className="w-4 h-4 text-primary" />
                                        <span className="text-[12px] font-bold text-ink">Header Style</span>
                                    </div>
                                    
                                    {/* Header Height */}
                                    <div>
                                        <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Height: {theme.headerHeight ?? 36}px</label>
                                        <input
                                            type="range"
                                            min={24}
                                            max={60}
                                            step={2}
                                            value={theme.headerHeight ?? 36}
                                            onChange={(e) => onUpdateTheme({ headerHeight: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Header Font Size */}
                                    <div>
                                        <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Font Size: {theme.headerFontSize ?? 12}px</label>
                                        <input
                                            type="range"
                                            min={10}
                                            max={20}
                                            step={1}
                                            value={theme.headerFontSize ?? 12}
                                            onChange={(e) => onUpdateTheme({ headerFontSize: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Title Max Width */}
                                    <div>
                                        <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Title Max Width: {theme.titleMaxWidth ?? 0}px (0=auto)</label>
                                        <input
                                            type="range"
                                            min={0}
                                            max={400}
                                            step={10}
                                            value={theme.titleMaxWidth ?? 0}
                                            onChange={(e) => onUpdateTheme({ titleMaxWidth: parseInt(e.target.value) || undefined })}
                                            className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>

                                    {/* Title Alignment */}
                                    <div>
                                        <label className="text-[10px] font-bold text-ink/50 mb-1.5 block">Title Alignment</label>
                                        <div className="flex gap-1">
                                            {(['left', 'center', 'right'] as const).map((align) => (
                                                <button
                                                    key={align}
                                                    onClick={() => onUpdateTheme({ titleAlign: align })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-lg border text-[10px] font-bold capitalize transition-all",
                                                        theme.titleAlign === align
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white border-[#E6D5B8]/30 text-ink/60"
                                                    )}
                                                >
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Header Colors */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-ink/50 mb-1 block">Background</label>
                                            <input
                                                type="color"
                                                value={theme.headerBackground}
                                                onChange={(e) => onUpdateTheme({ headerBackground: e.target.value })}
                                                className="w-full h-8 rounded cursor-pointer border-0"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-ink/50 mb-1 block">Text Color</label>
                                            <input
                                                type="color"
                                                value={theme.headerTextColor}
                                                onChange={(e) => onUpdateTheme({ headerTextColor: e.target.value })}
                                                className="w-full h-8 rounded cursor-pointer border-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Text Scaling */}
                            <div className="space-y-3 pt-4 border-t border-[#E6D5B8]/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold text-ink">Content Text Scale</span>
                                    <span className="text-[11px] font-bold text-primary">{Math.round((theme.contentTextScale ?? 1) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.5}
                                    max={1.5}
                                    step={0.1}
                                    value={theme.contentTextScale ?? 1}
                                    onChange={(e) => onUpdateTheme({ contentTextScale: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-[#E6D5B8]/30 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-[10px] text-ink/40">Scales all text proportionally to widget size</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'size' && (
                        <div className="space-y-4">
                            {/* Size Presets */}
                            <div className="grid grid-cols-3 gap-2">
                                {SIZE_PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => onUpdateDimensions({ width: preset.width, height: preset.height })}
                                        className={cn(
                                            "py-2 px-1 rounded-xl border text-center transition-all",
                                            dimensions.width === preset.width && dimensions.height === preset.height
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                                        )}
                                    >
                                        <span className="text-[11px] font-bold block">{preset.name}</span>
                                        <span className="text-[9px] opacity-70">{preset.width}×{preset.height}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Width Control */}
                            <PixelSizeControl
                                label="Width"
                                value={dimensions.width}
                                min={dimensions.minWidth}
                                max={dimensions.maxWidth}
                                onChange={(width) => onUpdateDimensions({ width })}
                                step={10}
                            />

                            {/* Height Control */}
                            <PixelSizeControl
                                label="Height"
                                value={dimensions.height}
                                min={dimensions.minHeight}
                                max={dimensions.maxHeight}
                                onChange={(height) => onUpdateDimensions({ height })}
                                step={10}
                            />

                            {/* Current Size Display */}
                            <div className="flex justify-center">
                                <div className="px-4 py-2 bg-primary/10 rounded-xl">
                                    <span className="text-[14px] font-black text-primary">
                                        {dimensions.width} × {dimensions.height}px
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-ink/50 mb-2 block">Custom Title</label>
                                <input
                                    type="text"
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    onBlur={() => onUpdateCustomTitle(customTitle.trim() || undefined)}
                                    placeholder={name}
                                    className="w-full px-4 py-3 bg-white border border-[#E6D5B8]/30 rounded-xl text-[13px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <p className="mt-1.5 text-[10px] text-ink/40">
                                    Default: <span className="font-medium">{name}</span>
                                </p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-[#E6D5B8]/30">
                                <button
                                    onClick={onDuplicate}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E6D5B8]/30 hover:bg-blue-50/50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Copy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-ink block">Duplicate</span>
                                        <span className="text-[10px] text-ink/50">Copy with same settings</span>
                                    </div>
                                </button>

                                <button
                                    onClick={onRemove}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-red-100 hover:bg-red-50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                                        <Trash2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[13px] font-bold text-red-600 block">Remove</span>
                                        <span className="text-[10px] text-ink/50">Delete from dashboard</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E6D5B8]/30 bg-surface-warm/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-primary text-white text-[14px] font-bold hover:bg-primary/90 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>
    );
}
