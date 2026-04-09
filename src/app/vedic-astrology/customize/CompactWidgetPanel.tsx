"use client";

import React, { useState, useEffect } from 'react';
import { 
    X, 
    Palette, 
    Type, 
    Maximize2,
    Copy, 
    Trash2,
    Check,
    Minus,
    Plus,
    Settings,
    ChevronDown,
    ChevronUp,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { SelectedItemDetail, WidgetTheme, WidgetDimensions } from '@/hooks/useCustomizeCharts';
import { PRESET_THEMES } from '@/hooks/useCustomizeCharts';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CompactWidgetPanelProps {
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
// COMPACT SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Section({ 
    title, 
    children, 
    isOpen, 
    onToggle,
    badge
}: { 
    title: string; 
    children: React.ReactNode; 
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
}) {
    return (
        <div className="border-b border-[#E6D5B8]/20 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-warm/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-ink">{title}</span>
                    {badge && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                            {badge}
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4">
                    {children}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUMBER STEPPER
// ═══════════════════════════════════════════════════════════════════════════════

function NumberStepper({ 
    label, 
    value, 
    min, 
    max, 
    onChange, 
    unit = '',
    step = 1
}: { 
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    unit?: string;
    step?: number;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink/60">{label}</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(Math.max(min, value - step))}
                    disabled={value <= min}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary hover:text-primary disabled:opacity-30"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <div className="w-16 text-center">
                    <span className="text-[13px] font-bold text-primary">{value}</span>
                    {unit && <span className="text-[10px] text-ink/40 ml-0.5">{unit}</span>}
                </div>
                <button
                    onClick={() => onChange(Math.min(max, value + step))}
                    disabled={value >= max}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary hover:text-primary disabled:opacity-30"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - Compact Slide-out Panel
// ═══════════════════════════════════════════════════════════════════════════════

export default function CompactWidgetPanel({
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
}: CompactWidgetPanelProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        size: true,
        header: false,
        colors: false,
        style: false,
    });
    const [customTitle, setCustomTitle] = useState('');

    useEffect(() => {
        if (widget) {
            setCustomTitle(widget.customTitle || '');
            // Auto-open header section if header is visible
            if (widget.showHeader) {
                setOpenSections(prev => ({ ...prev, header: true }));
            }
        }
    }, [widget?.customTitle, widget?.instanceId, widget?.showHeader]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!isOpen || !widget) return null;

    const { theme, dimensions, showHeader, showBorder, name } = widget;

    // Calculate text scale based on widget size
    const textScale = Math.min(
        dimensions.width / 300,
        dimensions.height / 250,
        1.5
    );

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-primary/10 backdrop-blur-[2px] z-[70] animate-in fade-in duration-200" 
                onClick={onClose}
            />

            {/* Compact Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[75] animate-in slide-in-from-right duration-200 flex flex-col">
                {/* Compact Header */}
                <div className="px-4 py-3 border-b border-[#E6D5B8]/30 bg-surface-warm flex items-center justify-between shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-[14px] font-black text-ink truncate">{name}</h3>
                        <p className="text-[10px] text-ink/40">{dimensions.width}×{dimensions.height}px</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onDuplicate}
                            className="p-2 hover:bg-gold-primary/20 rounded-lg text-ink/50 hover:text-ink"
                            title="Duplicate"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onRemove}
                            className="p-2 hover:bg-red-100 rounded-lg text-ink/50 hover:text-red-600"
                            title="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gold-primary/20 rounded-lg text-ink/50 hover:text-ink"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* SIZE SECTION */}
                    <Section 
                        title="Size" 
                        isOpen={openSections.size} 
                        onToggle={() => toggleSection('size')}
                        badge={`${dimensions.width}×${dimensions.height}`}
                    >
                        <div className="space-y-3">
                            <NumberStepper
                                label="Width"
                                value={dimensions.width}
                                min={dimensions.minWidth}
                                max={dimensions.maxWidth}
                                onChange={(w) => onUpdateDimensions({ width: w })}
                                unit="px"
                                step={10}
                            />
                            <NumberStepper
                                label="Height"
                                value={dimensions.height}
                                min={dimensions.minHeight}
                                max={dimensions.maxHeight}
                                onChange={(h) => onUpdateDimensions({ height: h })}
                                unit="px"
                                step={10}
                            />
                            
                            {/* Size presets */}
                            <div className="flex gap-1 pt-2">
                                {[
                                    { w: 250, h: 200, l: 'S' },
                                    { w: 350, h: 280, l: 'M' },
                                    { w: 500, h: 400, l: 'L' },
                                    { w: 600, h: 300, l: 'W' },
                                ].map((preset) => (
                                    <button
                                        key={preset.l}
                                        onClick={() => onUpdateDimensions({ width: preset.w, height: preset.h })}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                            dimensions.width === preset.w && dimensions.height === preset.h
                                                ? "bg-primary text-white"
                                                : "bg-surface-warm text-ink/60 hover:bg-surface-warm/80"
                                        )}
                                    >
                                        {preset.l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* HEADER SECTION */}
                    <Section 
                        title="Header" 
                        isOpen={openSections.header} 
                        onToggle={() => toggleSection('header')}
                        badge={showHeader ? 'On' : 'Off'}
                    >
                        <div className="space-y-3">
                            {/* Show/Hide Header */}
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-[11px] text-ink/60">Show Header</span>
                                <button
                                    onClick={onToggleHeader}
                                    className={cn(
                                        "w-9 h-5 rounded-full relative transition-colors",
                                        showHeader ? "bg-primary" : "bg-ink/20"
                                    )}
                                >
                                    <span className={cn(
                                        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                                        showHeader ? "translate-x-4" : ""
                                    )} />
                                </button>
                            </label>

                            {showHeader && (
                                <>
                                    {/* Custom Title */}
                                    <div>
                                        <label className="text-[10px] text-ink/40 mb-1 block">Title</label>
                                        <input
                                            type="text"
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            onBlur={() => onUpdateCustomTitle(customTitle.trim() || undefined)}
                                            placeholder={name}
                                            className="w-full px-3 py-2 bg-white border border-[#E6D5B8]/30 rounded-lg text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    {/* Header Height */}
                                    <NumberStepper
                                        label="Header Height"
                                        value={theme.headerHeight || 32}
                                        min={24}
                                        max={60}
                                        onChange={(h) => onUpdateTheme({ headerHeight: h })}
                                        unit="px"
                                    />

                                    {/* Header Font Size */}
                                    <NumberStepper
                                        label="Title Size"
                                        value={theme.headerFontSize || 12}
                                        min={9}
                                        max={20}
                                        onChange={(s) => onUpdateTheme({ headerFontSize: s })}
                                        unit="px"
                                    />

                                    {/* Content Text Size (scales with widget) */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-ink/60">Content Text Size</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUpdateTheme({ contentTextScale: Math.max(0.7, (theme.contentTextScale || 1) - 0.1) })}
                                                className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-[13px] font-bold text-primary w-12 text-center">
                                                {Math.round((theme.contentTextScale || 1) * 100)}%
                                            </span>
                                            <button
                                                onClick={() => onUpdateTheme({ contentTextScale: Math.min(1.5, (theme.contentTextScale || 1) + 0.1) })}
                                                className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title Alignment */}
                                    <div>
                                        <label className="text-[10px] text-ink/40 mb-1 block">Title Align</label>
                                        <div className="flex gap-1">
                                            {[
                                                { icon: AlignLeft, align: 'left' },
                                                { icon: AlignCenter, align: 'center' },
                                                { icon: AlignRight, align: 'right' },
                                            ].map(({ icon: Icon, align }) => (
                                                <button
                                                    key={align}
                                                    onClick={() => onUpdateTheme({ titleAlign: align as any })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-lg border transition-all",
                                                        theme.titleAlign === align
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white border-[#E6D5B8]/30 text-ink/50 hover:border-primary/50"
                                                    )}
                                                >
                                                    <Icon className="w-4 h-4 mx-auto" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Section>

                    {/* COLORS SECTION */}
                    <Section 
                        title="Colors" 
                        isOpen={openSections.colors} 
                        onToggle={() => toggleSection('colors')}
                    >
                        <div className="space-y-3">
                            {/* Quick Themes */}
                            <div className="grid grid-cols-4 gap-1">
                                {Object.entries(PRESET_THEMES).slice(0, 8).map(([key, presetTheme]) => (
                                    <button
                                        key={key}
                                        onClick={() => onApplyThemePreset(key)}
                                        className={cn(
                                            "h-10 rounded-lg border-2 transition-all",
                                            theme.backgroundColor === presetTheme.backgroundColor
                                                ? "border-primary"
                                                : "border-transparent hover:border-[#E6D5B8]"
                                        )}
                                        style={{ backgroundColor: presetTheme.backgroundColor }}
                                        title={key}
                                    />
                                ))}
                            </div>

                            {/* Color Pickers */}
                            <div className="space-y-2 pt-2">
                                {[
                                    { key: 'backgroundColor', label: 'Background' },
                                    { key: 'headerBackground', label: 'Header BG' },
                                    { key: 'headerTextColor', label: 'Title Color' },
                                    { key: 'textColor', label: 'Content Text' },
                                    { key: 'accentColor', label: 'Accent' },
                                    { key: 'borderColor', label: 'Border' },
                                ].map((color) => (
                                    <div key={color.key} className="flex items-center justify-between">
                                        <span className="text-[11px] text-ink/60">{color.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono text-ink/30">
                                                {(theme as any)[color.key]?.slice(0, 7) || '#000000'}
                                            </span>
                                            <input
                                                type="color"
                                                value={(theme as any)[color.key] || '#000000'}
                                                onChange={(e) => onUpdateTheme({ [color.key]: e.target.value })}
                                                className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* STYLE SECTION */}
                    <Section 
                        title="Style" 
                        isOpen={openSections.style} 
                        onToggle={() => toggleSection('style')}
                    >
                        <div className="space-y-3">
                            {/* Border Toggle */}
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-[11px] text-ink/60">Show Border</span>
                                <button
                                    onClick={onToggleBorder}
                                    className={cn(
                                        "w-9 h-5 rounded-full relative transition-colors",
                                        showBorder ? "bg-primary" : "bg-ink/20"
                                    )}
                                >
                                    <span className={cn(
                                        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                                        showBorder ? "translate-x-4" : ""
                                    )} />
                                </button>
                            </label>

                            {/* Border Width */}
                            {showBorder && (
                                <NumberStepper
                                    label="Border Width"
                                    value={theme.borderWidth}
                                    min={0}
                                    max={5}
                                    onChange={(w) => onUpdateTheme({ borderWidth: w })}
                                    unit="px"
                                />
                            )}

                            {/* Border Radius */}
                            <NumberStepper
                                label="Corner Radius"
                                value={theme.borderRadius}
                                min={0}
                                max={24}
                                onChange={(r) => onUpdateTheme({ borderRadius: r })}
                                unit="px"
                            />

                            {/* Shadow */}
                            <div>
                                <label className="text-[10px] text-ink/40 mb-1 block">Shadow</label>
                                <div className="flex gap-1">
                                    {(['none', 'light', 'medium', 'heavy'] as const).map((shadow) => (
                                        <button
                                            key={shadow}
                                            onClick={() => onUpdateTheme({ shadowIntensity: shadow })}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-lg text-[9px] font-bold capitalize transition-all",
                                                theme.shadowIntensity === shadow
                                                    ? "bg-primary text-white"
                                                    : "bg-surface-warm text-ink/60 hover:bg-surface-warm/80"
                                            )}
                                        >
                                            {shadow}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-[#E6D5B8]/30 bg-surface-warm/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>
    );
}
