"use client";

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  LayoutGrid,
  Table2,
  List,
  Circle,
  FileText,
  Grid3x3,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Check,
  Info,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { CustomizeChartItem } from '@/hooks/useCustomizeCharts';
import { CHART_CATALOG } from '@/hooks/useCustomizeCharts';
import {
  WIDGET_CONTENT_PROFILES,
  type ContentCategory,
} from '@/hooks/useContentAwareDimensions';
import AyanamsaSelect from './AyanamsaSelect';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ContentAwareChartSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  availableCharts: CustomizeChartItem[];
  selectedCharts: string[];
  onSelect: (chart: CustomizeChartItem, ayanamsa: string) => void;
  currentAyanamsa: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CATEGORY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

interface CategoryConfig {
  key: ContentCategory;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  priority: number;
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    key: 'chart',
    label: 'Divisional Charts',
    icon: LayoutGrid,
    description: 'Planetary charts with square format for accurate representation',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    priority: 1,
  },
  {
    key: 'table_wide',
    label: 'Wide Tables',
    icon: Table2,
    description: 'Landscape format for tabular data like Ashtakavarga',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    priority: 2,
  },
  {
    key: 'table_tall',
    label: 'Dasha & Lists',
    icon: List,
    description: 'Portrait format for scrollable time periods',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    priority: 3,
  },
  {
    key: 'circular',
    label: 'Circular Visualizations',
    icon: Circle,
    description: 'Perfect square for radial symmetry (Sudarshan Chakra)',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    priority: 4,
  },
  {
    key: 'analysis_card',
    label: 'Analysis Widgets',
    icon: FileText,
    description: 'Balanced format for Yoga, Dosha, Shadbala analysis',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    priority: 5,
  },
  {
    key: 'data_grid',
    label: 'KP System',
    icon: Grid3x3,
    description: 'Grid format for KP planetary and house data',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    priority: 6,
  },
  {
    key: 'compact_card',
    label: 'Quick Info',
    icon: CreditCard,
    description: 'Compact cards for Ruling Planets, Fortuna',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    priority: 7,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY BADGE
// ═══════════════════════════════════════════════════════════════════════════════

function CategoryBadge({ category }: { category: ContentCategory }) {
  const config = CATEGORY_CONFIG.find(c => c.key === category);
  if (!config) return null;
  
  const Icon = config.icon;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
      config.bgColor,
      config.color,
    )}>
      <Icon className="w-3 h-3" />
      {config.label.split(' ')[0]}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHART CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface ChartCardProps {
  chart: CustomizeChartItem;
  isSelected: boolean;
  onClick: () => void;
  contentCategory: ContentCategory;
}

function ChartCard({ chart, isSelected, onClick, contentCategory }: ChartCardProps) {
  const config = CATEGORY_CONFIG.find(c => c.key === contentCategory);
  const Icon = config?.icon || LayoutGrid;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-3 rounded-xl border-2 transition-all group",
        isSelected 
          ? cn("border-primary bg-primary/5", config?.bgColor)
          : cn("border-transparent hover:border-[#E6D5B8]/50 bg-white", config?.bgColor.replace('50', '30'))
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
        config?.bgColor,
        config?.color,
      )}>
        <Icon className="w-4 h-4" />
      </div>
      
      {/* Name */}
      <h4 className="text-[12px] font-black text-ink leading-tight mb-1">
        {chart.name}
      </h4>
      
      {/* Description */}
      <p className="text-[9px] text-ink/50 line-clamp-2 leading-relaxed">
        {chart.description}
      </p>
      
      {/* Category badge */}
      <div className="mt-2">
        <CategoryBadge category={contentCategory} />
      </div>
      
      {/* Size preview */}
      {chart.defaultDimensions && (
        <div className="mt-2 flex items-center gap-1 text-[8px] text-ink/40">
          <span>{chart.defaultDimensions.width}×{chart.defaultDimensions.height}px</span>
        </div>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY SECTION
// ═══════════════════════════════════════════════════════════════════════════════

interface CategorySectionProps {
  config: CategoryConfig;
  charts: CustomizeChartItem[];
  selectedCharts: string[];
  onSelect: (chart: CustomizeChartItem) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function CategorySection({ 
  config, 
  charts, 
  selectedCharts, 
  onSelect,
  isExpanded,
  onToggle,
}: CategorySectionProps) {
  const Icon = config.icon;
  const selectedCount = charts.filter(c => selectedCharts.includes(c.id)).length;
  
  if (charts.length === 0) return null;
  
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden mb-4",
      config.borderColor,
      config.bgColor.replace('50', '30'),
    )}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-colors",
          isExpanded ? config.bgColor : "hover:bg-white/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-white shadow-sm",
            config.color,
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={cn("text-[14px] font-black", config.color)}>
              {config.label}
            </h3>
            <p className="text-[10px] text-ink/50">
              {config.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <span className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold",
              config.bgColor.replace('50', '100'),
              config.color,
            )}>
              {selectedCount} selected
            </span>
          )}
          <span className="text-[11px] font-bold text-ink/40">
            {charts.length}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-ink/40" />
          ) : (
            <ChevronRight className="w-5 h-5 text-ink/40" />
          )}
        </div>
      </button>
      
      {/* Charts Grid */}
      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-3">
            {charts.map((chart) => (
              <ChartCard
                key={chart.id}
                chart={chart}
                isSelected={selectedCharts.includes(chart.id)}
                onClick={() => onSelect(chart)}
                contentCategory={config.key}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ContentAwareChartSelector({
  isOpen,
  onClose,
  availableCharts,
  selectedCharts,
  onSelect,
  currentAyanamsa,
}: ContentAwareChartSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localAyanamsa, setLocalAyanamsa] = useState(currentAyanamsa);
  const [expandedCategories, setExpandedCategories] = useState<ContentCategory[]>(['chart']);
  
  // Group charts by content category
  const groupedCharts = useMemo(() => {
    const groups: Record<ContentCategory, CustomizeChartItem[]> = {
      chart: [],
      table_wide: [],
      table_tall: [],
      circular: [],
      analysis_card: [],
      data_grid: [],
      compact_card: [],
    };
    
    availableCharts.forEach(chart => {
      const category = WIDGET_CONTENT_PROFILES[chart.id] || 'analysis_card';
      if (!groups[category]) groups[category] = [];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          chart.name.toLowerCase().includes(query) ||
          chart.description.toLowerCase().includes(query) ||
          chart.id.toLowerCase().includes(query);
        if (!matches) return;
      }
      
      groups[category].push(chart);
    });
    
    return groups;
  }, [availableCharts, searchQuery]);
  
  const toggleCategory = (category: ContentCategory) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSelect = (chart: CustomizeChartItem) => {
    onSelect(chart, localAyanamsa);
  };
  
  // Count total visible charts
  const totalVisible = useMemo(() => 
    Object.values(groupedCharts).flat().length,
    [groupedCharts]
  );
  
  // Count total selected
  const totalSelected = selectedCharts.length;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6D5B8]/30 bg-surface-warm shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[20px] font-black text-ink leading-tight">Add Widget</h2>
                <p className="text-[12px] text-gold-dark font-bold mt-0.5">
                  {totalVisible} available • {totalSelected} selected
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gold-primary/20 rounded-xl transition-colors text-ink/40 hover:text-ink"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search & Ayanamsa */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
              <input
                type="text"
                placeholder="Search charts, tables, analysis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6D5B8]/30 rounded-xl text-[13px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <AyanamsaSelect
              value={localAyanamsa}
              onChange={setLocalAyanamsa}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {totalVisible === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-ink/20 mx-auto mb-4" />
              <p className="text-[14px] font-bold text-ink/50">
                No widgets found for &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-[12px] text-primary font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            CATEGORY_CONFIG
              .sort((a, b) => a.priority - b.priority)
              .map((config) => (
                <CategorySection
                  key={config.key}
                  config={config}
                  charts={groupedCharts[config.key]}
                  selectedCharts={selectedCharts}
                  onSelect={handleSelect}
                  isExpanded={expandedCategories.includes(config.key)}
                  onToggle={() => toggleCategory(config.key)}
                />
              ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6D5B8]/30 bg-surface-warm shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] text-ink/50">
                <Info className="w-4 h-4" />
                <span>Each widget type has optimal dimensions for its content</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
