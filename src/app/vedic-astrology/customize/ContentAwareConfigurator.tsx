"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  RotateCcw,
  LayoutGrid,
  Table2,
  List,
  Circle,
  FileText,
  Grid3x3,
  CreditCard,
  Info,
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
  getContentTypeInfo,
  CONTENT_PROFILES,
  type ContentCategory,
} from '@/hooks/useContentAwareDimensions';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ContentAwareConfiguratorProps {
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

// Content type icons mapping
const CONTENT_ICONS: Record<ContentCategory, React.ElementType> = {
  chart: LayoutGrid,
  table_wide: Table2,
  table_tall: List,
  circular: Circle,
  analysis_card: FileText,
  data_grid: Grid3x3,
  compact_card: CreditCard,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TYPE BADGE
// ═══════════════════════════════════════════════════════════════════════════════

function ContentTypeBadge({ category }: { category: ContentCategory }) {
  const Icon = CONTENT_ICONS[category];
  const info = getContentTypeInfo(category);
  
  const colors: Record<ContentCategory, string> = {
    chart: 'bg-amber-100 text-amber-700 border-amber-200',
    table_wide: 'bg-blue-100 text-blue-700 border-blue-200',
    table_tall: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    circular: 'bg-violet-100 text-violet-700 border-violet-200',
    analysis_card: 'bg-rose-100 text-rose-700 border-rose-200',
    data_grid: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    compact_card: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
      colors[category]
    )}>
      <Icon className="w-3 h-3" />
      {info.label}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIMENSION CONTROL - FREE RESIZE (No Locking)
// ═══════════════════════════════════════════════════════════════════════════════

function DimensionControl({ 
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
  return (
    <div className="bg-amber-50/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-[12px] font-bold text-amber-900/70 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-amber-700" />
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={Math.round(value / step) * step}
            onChange={(e) => {
              const val = parseInt(e.target.value) || min;
              onChange(Math.max(min, Math.min(max, val)));
            }}
            className="w-20 px-2 py-1.5 text-right text-[14px] font-bold text-primary bg-white border border-amber-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-[11px] text-amber-900/40">px</span>
        </div>
      </div>
      
      {/* Slider with buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-10 h-10 rounded-lg bg-white border border-amber-200/60 flex items-center justify-center transition-all hover:border-primary hover:text-primary active:scale-95"
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
          className="w-10 h-10 rounded-lg bg-white border border-amber-200/60 flex items-center justify-center transition-all hover:border-primary hover:text-primary active:scale-95"
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
                : "bg-white border border-amber-200/60 text-amber-900/60 hover:border-primary/50"
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
// WIDGET PREVIEW - Shows actual pixel size with content indicator
// ═══════════════════════════════════════════════════════════════════════════════

function WidgetPreview({ 
  chart, 
  config,
  contentCategory,
}: { 
  chart: CustomizeChartItem; 
  config: {
    dimensions: WidgetDimensions;
    theme: WidgetTheme;
    customTitle?: string;
    showHeader: boolean;
    showBorder: boolean;
  };
  contentCategory: ContentCategory;
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
  
  // Aspect ratio indicator
  const aspectRatio = (dimensions.width / dimensions.height).toFixed(2);

  return (
    <div className="bg-[#F5F3EF] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-wider">Preview</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-primary">
            {dimensions.width} × {dimensions.height}px
          </span>
          <span className="text-[9px] text-amber-900/40">
            ({aspectRatio}:1)
          </span>
        </div>
      </div>
      
      {/* Preview Container */}
      <div 
        className="bg-white rounded-lg border-2 border-dashed border-[#D08C60] flex items-center justify-center overflow-hidden"
        style={{ 
          width: maxPreviewWidth, 
          height: maxPreviewHeight 
        }}
      >
        {/* Scaled Widget */}
        <div
          className={cn(
            "transition-all duration-200 flex flex-col overflow-hidden relative",
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
          
          {/* Content placeholder with content type indicator */}
          <div 
            className="flex-1 flex items-center justify-center p-2 relative"
            style={{ color: theme.textColor }}
          >
            <div 
              className="w-full h-full rounded opacity-20 flex items-center justify-center"
              style={{ backgroundColor: theme.accentColor }}
            >
              {/* Content type icon overlay */}
              <div className="text-center">
                {(() => {
                  const Icon = CONTENT_ICONS[contentCategory];
                  return <Icon className="w-8 h-8 mx-auto mb-1 opacity-50" />;
                })()}
                <span className="text-[8px] uppercase tracking-wider opacity-60">
                  {contentCategory.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size info with content type */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="text-[10px] text-amber-900/40 block">Width</span>
            <span className="text-[13px] font-bold text-amber-900">{dimensions.width}px</span>
          </div>
          <span className="text-amber-900/20">×</span>
          <div className="text-center">
            <span className="text-[10px] text-amber-900/40 block">Height</span>
            <span className="text-[13px] font-bold text-amber-900">{dimensions.height}px</span>
          </div>
        </div>
        
        <ContentTypeBadge category={contentCategory} />
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

  const THEME_PREVIEWS = [
    { key: 'default', name: 'Classic', desc: 'Traditional warm' },
    { key: 'vedic', name: 'Vedic Gold', desc: 'Sacred gold' },
    { key: 'dark', name: 'Night', desc: 'Dark mode' },
    { key: 'spiritual', name: 'Sage', desc: 'Calm green' },
    { key: 'royal', name: 'Royal', desc: 'Purple' },
    { key: 'ocean', name: 'Ocean', desc: 'Blue' },
  ];

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
                isSelected ? "border-primary ring-1 ring-primary/20" : "border-transparent hover:border-amber-200/60"
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
        className="w-full flex items-center justify-between p-3 bg-amber-50/50 rounded-xl text-[12px] font-bold text-amber-900/70 hover:bg-amber-50 transition-colors"
      >
        <span>Custom Colors</span>
        {showCustom ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {showCustom && (
        <div className="space-y-2 p-3 bg-amber-50/30 rounded-xl">
          {[
            { key: 'backgroundColor', label: 'Background' },
            { key: 'accentColor', label: 'Accent' },
            { key: 'borderColor', label: 'Border' },
            { key: 'headerTextColor', label: 'Header Text' },
          ].map((color) => (
            <div key={color.key} className="flex items-center justify-between">
              <span className="text-[11px] text-amber-900/70">{color.label}</span>
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
          <label className="text-[10px] font-bold text-amber-900/50 mb-1.5 block">Shadow</label>
          <div className="flex gap-1">
            {(['none', 'light', 'medium', 'heavy'] as const).map((shadow) => (
              <button
                key={shadow}
                onClick={() => onChange({ shadowIntensity: shadow })}
                className={cn(
                  "flex-1 py-2 rounded-lg border text-[10px] font-bold capitalize transition-all",
                  value.shadowIntensity === shadow
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-amber-200/60 text-amber-900/60 hover:border-primary/50"
                )}
              >
                {shadow}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-amber-900/50 mb-1.5 block">Corner Radius</label>
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

export default function ContentAwareConfigurator({ 
  isOpen, 
  onClose, 
  chart, 
  currentAyanamsa,
  onAdd 
}: ContentAwareConfiguratorProps) {
  const [activeTab, setActiveTab] = useState<'size' | 'theme' | 'advanced'>('size');
  
  // State
  const [dimensions, setDimensions] = useState<WidgetDimensions>(DEFAULT_DIMENSIONS);
  const [theme, setTheme] = useState<WidgetTheme>(DEFAULT_WIDGET_THEME);
  const [customTitle, setCustomTitle] = useState('');
  const [showHeader, setShowHeader] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  
  // Content-aware dimensions hook
  const contentAware = useContentAwareDimensions(chart?.id || '', {
    width: dimensions.width,
    height: dimensions.height,
  });

  // Reset when chart changes
  useEffect(() => {
    if (chart) {
      const baseDims = chart.defaultDimensions || contentAware.dimensions;
      setDimensions({ ...baseDims });
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
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/60 bg-amber-50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-amber-900 leading-tight">Configure Widget</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] text-amber-700 font-bold">{chart.name}</span>
                  <span className="text-amber-900/20">•</span>
                  <ContentTypeBadge category={contentAware.profile.category} />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-amber-50 rounded-xl transition-colors text-amber-900/40 hover:text-amber-900">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'size', label: 'Size & Layout', icon: Maximize2 },
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
                    : "bg-white border border-amber-200/60 text-amber-900/60 hover:border-primary/50"
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
          <div className="w-[400px] border-r border-amber-200/60 overflow-y-auto custom-scrollbar">
            <div className="p-5">
              {activeTab === 'size' && (
                <div className="space-y-4">
                  {/* Content Type Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[12px] font-bold text-blue-800">
                          {contentAware.contentInfo.description}
                        </p>
                        <p className="text-[10px] text-blue-600 mt-1">
                          Recommended for: {contentAware.contentInfo.recommendedFor.join(', ')}
                        </p>
                        <p className="text-[10px] text-blue-500 mt-1">
                          Default size: {contentAware.contentInfo.defaultSize} (Free resize)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Size Presets */}
                  <div>
                    <label className="text-[10px] font-bold text-amber-900/50 mb-2 block uppercase tracking-wider">
                      Recommended Sizes
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {contentAware.recommendedPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setDimensions(prev => ({ 
                            ...prev, 
                            width: preset.width, 
                            height: preset.height 
                          }))}
                          className={cn(
                            "p-2 rounded-xl border text-center transition-all",
                            dimensions.width === preset.width && dimensions.height === preset.height
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-amber-200/60 text-amber-900/60 hover:border-primary/50"
                          )}
                        >
                          <span className="text-[14px] font-black block">{preset.icon}</span>
                          <span className="text-[9px] font-bold block mt-0.5">{preset.name}</span>
                          <span className="text-[8px] opacity-70">{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Width Control */}
                  <DimensionControl
                    label="Width"
                    value={dimensions.width}
                    min={dimensions.minWidth}
                    max={dimensions.maxWidth}
                    onChange={(width) => setDimensions(prev => ({ ...prev, width }))}
                    step={contentAware.resizeStep}
                  />

                  {/* Height Control */}
                  <DimensionControl
                    label="Height"
                    value={dimensions.height}
                    min={dimensions.minHeight}
                    max={dimensions.maxHeight}
                    onChange={(height) => setDimensions(prev => ({ ...prev, height }))}
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
                    <label className="text-[11px] font-bold text-amber-900/50 mb-2 block">Custom Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder={chart.name}
                      className="w-full px-4 py-3 bg-white border border-amber-200/60 rounded-xl text-[13px] text-amber-900 placeholder:text-amber-900/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <p className="mt-1.5 text-[10px] text-amber-900/40">
                      Leave empty to use default: <span className="font-medium">{chart.name}</span>
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowHeader(!showHeader)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        showHeader ? "bg-primary/5 border-primary/20" : "bg-white border-amber-200/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <TypeIcon className={cn("w-5 h-5", showHeader ? "text-primary" : "text-amber-900/30")} />
                        <span className="text-[13px] font-bold text-amber-900">Show Header</span>
                      </div>
                      <div className={cn("w-11 h-5 rounded-full relative transition-colors", showHeader ? "bg-primary" : "bg-ink/20")}>
                        <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", showHeader ? "translate-x-6" : "")} />
                      </div>
                    </button>

                    <button
                      onClick={() => setShowBorder(!showBorder)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        showBorder ? "bg-primary/5 border-primary/20" : "bg-white border-amber-200/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Square className={cn("w-5 h-5", showBorder ? "text-primary" : "text-amber-900/30")} />
                        <span className="text-[13px] font-bold text-amber-900">Show Border</span>
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
              contentCategory={contentAware.profile.category}
            />
            
            {/* Info */}
            <div className="mt-4 space-y-2">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  <strong>Tip:</strong> You can resize widgets freely on the dashboard using the resize handles or quick buttons. 
                  Each widget type has recommended dimensions but supports full customization.
                </p>
              </div>
              
              {/* Content behavior info */}
              <div className="p-3 bg-amber-50/50 rounded-xl">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-900/50">Scaling Behavior</span>
                  <span className="font-bold text-amber-900 capitalize">{contentAware.profile.scalingBehavior}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-amber-900/50">Recommended Ratio</span>
                  <span className="font-bold text-amber-900">{contentAware.profile.recommendedRatio}:1</span>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-amber-900/50">Resize</span>
                  <span className="font-bold text-green-600">Free (No Lock)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-amber-200/60 bg-amber-50 shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const baseDims = chart.defaultDimensions || contentAware.dimensions;
                setDimensions({ ...baseDims });
                setTheme({ ...DEFAULT_WIDGET_THEME, ...chart.defaultTheme });
                setCustomTitle('');
                setShowHeader(true);
                setShowBorder(true);
              }}
              className="flex items-center gap-2 text-[12px] font-bold text-amber-900/50 hover:text-amber-900/70 px-3 py-2 rounded-lg hover:bg-amber-900/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/5 transition-colors"
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
