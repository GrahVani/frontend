"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    Eye,
    Grid3X3,
    Sparkles,
    RefreshCw,
    Save,
    Undo,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { SelectedItemDetail, WidgetTheme, WidgetDimensions } from '@/hooks/useCustomizeCharts';
import { PRESET_THEMES, DEFAULT_WIDGET_THEME } from '@/hooks/useCustomizeCharts';

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
    badge,
    icon: Icon
}: { 
    title: string; 
    children: React.ReactNode; 
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
    icon?: React.ElementType;
}) {
    return (
        <div className="border-b border-[#E6D5B8]/20 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-warm/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gold-dark" />}
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
// QUICK BUTTON - For immediate toggle feedback
// ═══════════════════════════════════════════════════════════════════════════════

function QuickButton({ 
    label, 
    isActive, 
    onClick,
    icon: Icon
}: { 
    label: string; 
    isActive: boolean; 
    onClick: () => void;
    icon?: React.ElementType;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all active:scale-95",
                isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-[#E6D5B8]/50 text-ink/60 hover:border-primary/50"
            )}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUMBER STEPPER - With immediate feedback
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
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary hover:text-primary disabled:opacity-30 active:scale-95 transition-all"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <div className="w-14 text-center bg-white border border-[#E6D5B8]/30 rounded-lg py-1">
                    <span className="text-[13px] font-bold text-primary">{value}</span>
                    {unit && <span className="text-[9px] text-ink/40 ml-0.5">{unit}</span>}
                </div>
                <button
                    onClick={() => onChange(Math.min(max, value + step))}
                    disabled={value >= max}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary hover:text-primary disabled:opacity-30 active:scale-95 transition-all"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOGGLE SWITCH - With immediate feedback
// ═══════════════════════════════════════════════════════════════════════════════

function ToggleSwitch({ 
    label, 
    checked, 
    onChange,
    icon: Icon
}: { 
    label: string; 
    checked: boolean; 
    onChange: () => void;
    icon?: React.ElementType;
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-ink/40 group-hover:text-gold-dark transition-colors" />}
                <span className="text-[11px] text-ink/70">{label}</span>
            </div>
            <button
                type="button"
                onClick={onChange}
                className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-200",
                    checked ? "bg-primary" : "bg-ink/20"
                )}
            >
                <span className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                    checked ? "translate-x-5" : ""
                )} />
            </button>
        </label>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - Optimized for immediate feedback
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
    // ═══════════════════════════════════════════════════════════════════════════
    // LOCAL STATE - For immediate UI feedback (no lag)
    // ═══════════════════════════════════════════════════════════════════════════
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        size: true,
        header: false,
        chart: true,  // Auto-open chart section for astrologers
        colors: false,
        style: false,
    });
    
    // Local state mirrors widget state for immediate feedback
    const [localTheme, setLocalTheme] = useState<Partial<WidgetTheme>>({});
    const [localTitle, setLocalTitle] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    
    // Track original values for reset
    const originalValues = useRef<{ theme: Partial<WidgetTheme>; title: string }>({ theme: {}, title: '' });

    // Sync with widget props when opened
    useEffect(() => {
        if (widget && isOpen) {
            setLocalTheme(widget.theme);
            setLocalTitle(widget.customTitle || '');
            originalValues.current = { theme: { ...widget.theme }, title: widget.customTitle || '' };
            setHasChanges(false);
        }
    }, [widget?.instanceId, isOpen]);

    // ═══════════════════════════════════════════════════════════════════════════
    // OPTIMIZED UPDATE HANDLERS - Immediate local update + debounced parent update
    // ═══════════════════════════════════════════════════════════════════════════
    
    const updateTheme = useCallback((updates: Partial<WidgetTheme>) => {
        // 1. Update local state immediately (no lag in UI)
        setLocalTheme(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
        
        // 2. Update parent immediately for this panel (separate from chart re-render)
        onUpdateTheme(updates);
    }, [onUpdateTheme]);

    const updateTitle = useCallback((title: string) => {
        setLocalTitle(title);
        setHasChanges(true);
        onUpdateCustomTitle(title.trim() || undefined);
    }, [onUpdateCustomTitle]);

    const resetToOriginal = useCallback(() => {
        if (widget) {
            setLocalTheme(originalValues.current.theme);
            setLocalTitle(originalValues.current.title);
            onUpdateTheme(originalValues.current.theme);
            onUpdateCustomTitle(originalValues.current.title || undefined);
            setHasChanges(false);
        }
    }, [widget, onUpdateTheme, onUpdateCustomTitle]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!isOpen || !widget) return null;

    const { dimensions, showHeader, showBorder, name } = widget;
    const theme = localTheme as WidgetTheme;

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════
    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-primary/10 backdrop-blur-[2px] z-[70] animate-in fade-in duration-200" 
                onClick={onClose}
            />

            {/* Compact Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[75] animate-in slide-in-from-right duration-200 flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-[#E6D5B8]/30 bg-surface-warm flex items-center justify-between shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-[14px] font-black text-ink truncate">{name}</h3>
                        <p className="text-[10px] text-ink/40">{dimensions.width}×{dimensions.height}px</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {hasChanges && (
                            <button
                                onClick={resetToOriginal}
                                className="p-2 hover:bg-amber-100 rounded-lg text-ink/50 hover:text-amber-600"
                                title="Reset changes"
                            >
                                <Undo className="w-4 h-4" />
                            </button>
                        )}
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
                    
                    {/* ═══════════════════════════════════════════════════════════════════
                        SIZE SECTION
                    ═══════════════════════════════════════════════════════════════════ */}
                    <Section 
                        title="Size & Position" 
                        isOpen={openSections.size} 
                        onToggle={() => toggleSection('size')}
                        badge={`${dimensions.width}×${dimensions.height}`}
                        icon={Maximize2}
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
                            
                            {/* Quick size presets */}
                            <div className="grid grid-cols-4 gap-1.5 pt-2">
                                {[
                                    { w: 320, h: 340, l: 'S', desc: 'Small' },
                                    { w: 470, h: 500, l: 'M', desc: 'Medium' },
                                    { w: 580, h: 620, l: 'L', desc: 'Large' },
                                    { w: 650, h: 380, l: 'W', desc: 'Wide' },
                                ].map((preset) => (
                                    <button
                                        key={preset.l}
                                        onClick={() => onUpdateDimensions({ width: preset.w, height: preset.h })}
                                        className={cn(
                                            "py-2 rounded-lg text-center transition-all active:scale-95",
                                            dimensions.width === preset.w && dimensions.height === preset.h
                                                ? "bg-primary text-white"
                                                : "bg-surface-warm text-ink/60 hover:bg-surface-warm/80"
                                        )}
                                        title={preset.desc}
                                    >
                                        <span className="text-[12px] font-black">{preset.l}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════════════
                        HEADER SECTION
                    ═══════════════════════════════════════════════════════════════════ */}
                    <Section 
                        title="Header" 
                        isOpen={openSections.header} 
                        onToggle={() => toggleSection('header')}
                        badge={showHeader ? 'On' : 'Off'}
                        icon={Type}
                    >
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Show Header"
                                checked={showHeader}
                                onChange={onToggleHeader}
                            />

                            {showHeader && (
                                <>
                                    {/* Custom Title */}
                                    <div>
                                        <label className="text-[10px] text-ink/40 mb-1.5 block">Widget Title</label>
                                        <input
                                            type="text"
                                            value={localTitle}
                                            onChange={(e) => updateTitle(e.target.value)}
                                            placeholder={name}
                                            className="w-full px-3 py-2 bg-white border border-[#E6D5B8]/30 rounded-lg text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <NumberStepper
                                            label="Height"
                                            value={theme.headerHeight || 36}
                                            min={24}
                                            max={60}
                                            onChange={(h) => updateTheme({ headerHeight: h })}
                                            unit="px"
                                        />
                                        <NumberStepper
                                            label="Font Size"
                                            value={theme.headerFontSize || 12}
                                            min={9}
                                            max={20}
                                            onChange={(s) => updateTheme({ headerFontSize: s })}
                                            unit="px"
                                        />
                                    </div>

                                    {/* Content Scale */}
                                    <div>
                                        <label className="text-[10px] text-ink/40 mb-1.5 block">Content Scale</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateTheme({ contentTextScale: Math.max(0.7, (theme.contentTextScale || 1) - 0.1) })}
                                                className="w-8 h-8 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary active:scale-95 transition-all"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <div className="flex-1 h-2 bg-[#E6D5B8]/30 rounded-full relative">
                                                <div 
                                                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${((theme.contentTextScale || 1) - 0.7) / 0.8 * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[13px] font-bold text-primary w-12 text-center">
                                                {Math.round((theme.contentTextScale || 1) * 100)}%
                                            </span>
                                            <button
                                                onClick={() => updateTheme({ contentTextScale: Math.min(1.5, (theme.contentTextScale || 1) + 0.1) })}
                                                className="w-8 h-8 rounded-lg bg-white border border-[#E6D5B8]/50 flex items-center justify-center text-ink/60 hover:border-primary active:scale-95 transition-all"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title Alignment */}
                                    <div>
                                        <label className="text-[10px] text-ink/40 mb-1.5 block">Title Alignment</label>
                                        <div className="flex gap-1">
                                            {[
                                                { icon: AlignLeft, align: 'left', label: 'Left' },
                                                { icon: AlignCenter, align: 'center', label: 'Center' },
                                                { icon: AlignRight, align: 'right', label: 'Right' },
                                            ].map(({ icon: Icon, align, label }) => (
                                                <button
                                                    key={align}
                                                    onClick={() => updateTheme({ titleAlign: align as any })}
                                                    className={cn(
                                                        "flex-1 py-2 rounded-lg border transition-all flex items-center justify-center gap-1.5 active:scale-95",
                                                        theme.titleAlign === align
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white border-[#E6D5B8]/30 text-ink/50 hover:border-primary/50"
                                                    )}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════════════
                        CHART DISPLAY SECTION - For Astrologers
                    ═══════════════════════════════════════════════════════════════════ */}
                    <Section 
                        title="Chart Display" 
                        isOpen={openSections.chart} 
                        onToggle={() => toggleSection('chart')}
                        badge={theme.planetDisplayMode === 'symbol' ? '☉☽♂' : (theme.planetDisplayMode === 'both' ? '☉Sun' : 'Names')}
                        icon={Eye}
                    >
                        <div className="space-y-4">
                            
                            {/* ═══════════════════════════════════════════════════════════
                                PLANET LABELS - Most important for astrologers
                            ═══════════════════════════════════════════════════════════ */}
                            <div className="bg-surface-warm/30 rounded-xl p-3 border border-[#E6D5B8]/20">
                                <label className="text-[10px] font-bold text-gold-dark mb-2 block uppercase tracking-wider">
                                    Planet Labels
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'name', label: 'Names', example: 'Sun' },
                                        { key: 'symbol', label: 'Symbols', example: '☉☽♂' },
                                        { key: 'both', label: 'Both', example: '☉ Sun' },
                                    ].map((mode) => (
                                        <button
                                            key={mode.key}
                                            onClick={() => updateTheme({ planetDisplayMode: mode.key as any })}
                                            className={cn(
                                                "py-2.5 px-1 rounded-xl border-2 transition-all text-center active:scale-95",
                                                theme.planetDisplayMode === mode.key
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-white border-transparent text-ink/60 hover:border-[#E6D5B8]"
                                            )}
                                        >
                                            <span className="text-[10px] font-bold block">{mode.label}</span>
                                            <span className={cn(
                                                "text-[11px] mt-1 block",
                                                theme.planetDisplayMode === mode.key ? "text-primary" : "text-ink/40"
                                            )}>
                                                {mode.example}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Planet Text Size */}
                            <NumberStepper
                                label="Planet Text Size"
                                value={theme.planetFontSize || 14}
                                min={10}
                                max={24}
                                onChange={(s) => updateTheme({ planetFontSize: s })}
                                unit="px"
                            />

                            {/* ═══════════════════════════════════════════════════════════
                                DEGREES - Important for precise readings
                            ═══════════════════════════════════════════════════════════ */}
                            <div className="bg-surface-warm/30 rounded-xl p-3 border border-[#E6D5B8]/20">
                                <ToggleSwitch
                                    label="Show Planet Degrees"
                                    checked={theme.showDegrees !== false}
                                    onChange={() => updateTheme({ showDegrees: !(theme.showDegrees !== false) })}
                                    icon={Sparkles}
                                />

                                {theme.showDegrees !== false && (
                                    <div className="mt-3 pl-3 border-l-2 border-primary/20">
                                        <NumberStepper
                                            label="Degree Text Size"
                                            value={theme.degreeFontSize || 9}
                                            min={6}
                                            max={14}
                                            onChange={(s) => updateTheme({ degreeFontSize: s })}
                                            unit="px"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════════════════════
                                VISUAL ELEMENTS - Grid & House Numbers
                            ═══════════════════════════════════════════════════════════ */}
                            <div className="space-y-3">
                                <ToggleSwitch
                                    label="Show House Numbers"
                                    checked={theme.showHouseNumbers !== false}
                                    onChange={() => updateTheme({ showHouseNumbers: !(theme.showHouseNumbers !== false) })}
                                    icon={Grid3X3}
                                />

                                <ToggleSwitch
                                    label="Show Grid Lines"
                                    checked={theme.showGridLines !== false}
                                    onChange={() => updateTheme({ showGridLines: !(theme.showGridLines !== false) })}
                                    icon={() => <div className="w-3.5 h-3.5 border border-current" />}
                                />

                                {/* Grid Color - Only show if grid is enabled */}
                                {theme.showGridLines !== false && (
                                    <div className="flex items-center justify-between pl-6">
                                        <span className="text-[10px] text-ink/50">Grid Color</span>
                                        <input
                                            type="color"
                                            value={theme.gridLineColor || '#D4C4A8'}
                                            onChange={(e) => updateTheme({ gridLineColor: e.target.value })}
                                            className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════════════════════
                                RETROGRADE - For karmic analysis
                            ═══════════════════════════════════════════════════════════ */}
                            <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/30">
                                <ToggleSwitch
                                    label="Show Retrograde Marks"
                                    checked={theme.showRetrogradeIndicator !== false}
                                    onChange={() => updateTheme({ showRetrogradeIndicator: !(theme.showRetrogradeIndicator !== false) })}
                                    icon={() => <span className="text-red-500 font-bold text-[10px]">R</span>}
                                />

                                {theme.showRetrogradeIndicator !== false && (
                                    <div className="mt-3 flex gap-2 pl-3 border-l-2 border-amber-300/30">
                                        {['R', 'R%', 'circle-R'].map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => updateTheme({ retrogradeStyle: style as any })}
                                                className={cn(
                                                    "flex-1 py-1.5 rounded-lg border text-[12px] font-bold transition-all",
                                                    theme.retrogradeStyle === style
                                                        ? "bg-red-500 text-white border-red-500"
                                                        : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-red-300"
                                                )}
                                            >
                                                {style === 'circle-R' ? 'Ⓡ' : style}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════════════════════
                                SPACING - For crowded charts
                            ═══════════════════════════════════════════════════════════ */}
                            <div>
                                <label className="text-[10px] text-ink/40 mb-1.5 block">Planet Spacing</label>
                                <div className="flex gap-1">
                                    {[
                                        { key: 'compact', label: 'Compact', desc: 'Closer' },
                                        { key: 'normal', label: 'Normal', desc: 'Balanced' },
                                        { key: 'spacious', label: 'Spacious', desc: 'More room' },
                                    ].map((spacing) => (
                                        <button
                                            key={spacing.key}
                                            onClick={() => updateTheme({ planetSpacing: spacing.key as any })}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg border text-center transition-all active:scale-95",
                                                (theme.planetSpacing || 'normal') === spacing.key
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
                                            )}
                                            title={spacing.desc}
                                        >
                                            <span className="text-[10px] font-bold block">{spacing.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════════════
                        COLORS SECTION
                    ═══════════════════════════════════════════════════════════════════ */}
                    <Section 
                        title="Colors" 
                        isOpen={openSections.colors} 
                        onToggle={() => toggleSection('colors')}
                        icon={Palette}
                    >
                        <div className="space-y-3">
                            {/* Quick Themes */}
                            <div className="grid grid-cols-4 gap-1.5">
                                {Object.entries(PRESET_THEMES).slice(0, 8).map(([key, presetTheme]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            onApplyThemePreset(key);
                                            setLocalTheme(presetTheme);
                                        }}
                                        className={cn(
                                            "h-10 rounded-xl border-2 transition-all active:scale-95",
                                            theme.backgroundColor === presetTheme.backgroundColor
                                                ? "border-primary ring-1 ring-primary/30"
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
                                                onChange={(e) => updateTheme({ [color.key]: e.target.value })}
                                                className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* ═══════════════════════════════════════════════════════════════════
                        STYLE SECTION
                    ═══════════════════════════════════════════════════════════════════ */}
                    <Section 
                        title="Style" 
                        isOpen={openSections.style} 
                        onToggle={() => toggleSection('style')}
                        icon={Settings}
                    >
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Show Border"
                                checked={showBorder}
                                onChange={onToggleBorder}
                            />

                            {showBorder && (
                                <NumberStepper
                                    label="Border Width"
                                    value={theme.borderWidth || 1}
                                    min={0}
                                    max={5}
                                    onChange={(w) => updateTheme({ borderWidth: w })}
                                    unit="px"
                                />
                            )}

                            <NumberStepper
                                label="Corner Radius"
                                value={theme.borderRadius || 12}
                                min={0}
                                max={24}
                                onChange={(r) => updateTheme({ borderRadius: r })}
                                unit="px"
                            />

                            {/* Shadow */}
                            <div>
                                <label className="text-[10px] text-ink/40 mb-1.5 block">Shadow</label>
                                <div className="flex gap-1">
                                    {(['none', 'light', 'medium', 'heavy'] as const).map((shadow) => (
                                        <button
                                            key={shadow}
                                            onClick={() => updateTheme({ shadowIntensity: shadow })}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-lg border text-[9px] font-bold capitalize transition-all active:scale-95",
                                                theme.shadowIntensity === shadow
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white border-[#E6D5B8]/30 text-ink/60 hover:border-primary/50"
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

                {/* Footer with Done button */}
                <div className="p-3 border-t border-[#E6D5B8]/30 bg-surface-warm/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Check className="w-4 h-4" />
                        Done
                    </button>
                </div>
            </div>
        </>
    );
}
