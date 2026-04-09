"use client";

import React, { useState, useMemo } from 'react';
import { 
    X, 
    ChevronLeft, 
    ChevronRight,
    Globe,
    Grid3X3,
    Check,
    Search,
    Sparkles,
    Circle,
    BarChart3,
    Table2,
    Layers,
    Star,
    Moon,
    Sun,
    ArrowRight,
    RotateCcw,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { CustomizeChartItem } from '@/hooks/useCustomizeCharts';
import { AYANAMSA_HIERARCHY, AYANAMSA_CONFIGS } from './ayana-types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ChartSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableCharts: CustomizeChartItem[];
    selectedCharts: string[];
    onSelect: (chart: CustomizeChartItem, ayanamsa: string) => void;
    currentAyanamsa: string;
}

type Step = 'ayanamsa' | 'category' | 'widget';

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY ICONS & COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'divisional': Circle,
    'lagna': Star,
    'dasha': BarChart3,
    'ashtakavarga': Table2,
    'rare_shodash': Sparkles,
    'special': Sparkles,
    'widget_shadbala': BarChart3,
    'widget_pushkara': Star,
    'widget_karaka': Circle,
    'widget_chakra': Circle,
    'widget_shodasha': Table2,
    'widget_yoga': Sparkles,
    'widget_dosha': Moon,
    'widget_transit': Sun,
    'widget_remedy': Star,
    'kp_module': Layers,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'divisional': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'lagna': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'dasha': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'ashtakavarga': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'rare_shodash': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'widget_shadbala': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'widget_yoga': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'widget_dosha': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    'kp_module': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

const CATEGORY_LABELS: Record<string, string> = {
    'divisional': 'Divisional Charts',
    'lagna': 'Lagna Charts',
    'dasha': 'Dasha Systems',
    'ashtakavarga': 'Ashtakavarga',
    'rare_shodash': 'Rare Shodash Varga',
    'special': 'Special Charts',
    'widget_shadbala': 'Shadbala Analysis',
    'widget_pushkara': 'Pushkara',
    'widget_karaka': 'Chara Karaka',
    'widget_chakra': 'Sudarshan Chakra',
    'widget_shodasha': 'Shodashvarga',
    'widget_yoga': 'Yoga Analysis',
    'widget_dosha': 'Dosha Analysis',
    'widget_transit': 'Daily Transit',
    'widget_remedy': 'Remedies',
    'kp_module': 'KP System',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ChartSelectorModal({
    isOpen,
    onClose,
    availableCharts,
    selectedCharts,
    onSelect,
    currentAyanamsa,
}: ChartSelectorModalProps) {
    const [step, setStep] = useState<Step>('ayanamsa');
    const [selectedAyanamsa, setSelectedAyanamsa] = useState(currentAyanamsa);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    // Get hierarchy for selected ayanamsa
    const activeHierarchy = useMemo(() => {
        return AYANAMSA_HIERARCHY.find(h => h.value === selectedAyanamsa);
    }, [selectedAyanamsa]);

    // Get categories for selected ayanamsa
    const availableCategories = useMemo(() => {
        if (!activeHierarchy) return [];
        return activeHierarchy.categories.filter(cat => {
            // Check if category has any available widgets
            return cat.widgets.some(w => {
                const chart = availableCharts.find(c => c.id === w.id);
                return chart && !selectedCharts.includes(`${w.id}_${selectedAyanamsa.toLowerCase()}`);
            });
        });
    }, [activeHierarchy, availableCharts, selectedCharts, selectedAyanamsa]);

    // Get widgets for selected category
    const categoryWidgets = useMemo(() => {
        if (!selectedCategory || !activeHierarchy) return [];
        const cat = activeHierarchy.categories.find(c => c.id === selectedCategory);
        if (!cat) return [];
        
        return cat.widgets
            .map(w => availableCharts.find(c => c.id === w.id))
            .filter((c): c is CustomizeChartItem => !!c)
            .filter(c => !selectedCharts.includes(`${c.id}_${selectedAyanamsa.toLowerCase()}`))
            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [selectedCategory, activeHierarchy, availableCharts, selectedCharts, selectedAyanamsa, searchQuery]);

    // Reset when opening
    React.useEffect(() => {
        if (isOpen) {
            setStep('ayanamsa');
            setSelectedAyanamsa(currentAyanamsa);
            setSelectedCategory('');
            setSearchQuery('');
        }
    }, [isOpen, currentAyanamsa]);

    const handleAyanamsaSelect = (ayanamsa: string) => {
        setSelectedAyanamsa(ayanamsa);
        setStep('category');
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setStep('widget');
    };

    const handleWidgetSelect = (widget: CustomizeChartItem) => {
        onSelect(widget, selectedAyanamsa);
    };

    const handleBack = () => {
        if (step === 'widget') {
            setStep('category');
            setSearchQuery('');
        } else if (step === 'category') {
            setStep('ayanamsa');
            setSelectedCategory('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/50 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E6D5B8]/30 bg-surface-warm shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {step !== 'ayanamsa' && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 hover:bg-gold-primary/20 rounded-xl transition-colors text-ink/60 hover:text-ink"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-[18px] font-black text-ink tracking-tight">
                                    {step === 'ayanamsa' && 'Select Ayanamsa'}
                                    {step === 'category' && 'Select Category'}
                                    {step === 'widget' && CATEGORY_LABELS[selectedCategory] || 'Select Widget'}
                                </h2>
                                {step !== 'ayanamsa' && (
                                    <p className="text-[11px] text-gold-dark font-bold mt-0.5">
                                        {selectedAyanamsa} {step === 'widget' && `• ${categoryWidgets.length} available`}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gold-primary/20 rounded-xl transition-colors text-ink/40 hover:text-ink"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mt-4">
                        {[
                            { id: 'ayanamsa', label: 'Ayanamsa', icon: Globe },
                            { id: 'category', label: 'Category', icon: Grid3X3 },
                            { id: 'widget', label: 'Widget', icon: Check },
                        ].map((s, idx) => {
                            const isActive = step === s.id;
                            const isPast = 
                                (step === 'category' && s.id === 'ayanamsa') ||
                                (step === 'widget' && (s.id === 'ayanamsa' || s.id === 'category'));
                            
                            return (
                                <React.Fragment key={s.id}>
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all",
                                        isActive 
                                            ? "bg-primary text-white shadow-sm" 
                                            : isPast
                                                ? "bg-primary/10 text-primary"
                                                : "bg-white border border-[#E6D5B8]/30 text-ink/40"
                                    )}>
                                        <s.icon className="w-3.5 h-3.5" />
                                        {s.label}
                                    </div>
                                    {idx < 2 && (
                                        <ChevronRight className="w-4 h-4 text-ink/20" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    {/* STEP 1: AYANAMSA SELECTION */}
                    {step === 'ayanamsa' && (
                        <div className="space-y-3">
                            <p className="text-[13px] text-ink/60 mb-4">
                                Choose the ayanamsa system for your calculations. Different systems support different charts.
                            </p>
                            
                            {AYANAMSA_HIERARCHY.map((ayanamsa) => {
                                const config = AYANAMSA_CONFIGS[ayanamsa.value as keyof typeof AYANAMSA_CONFIGS];
                                const isSelected = selectedAyanamsa === ayanamsa.value;
                                
                                return (
                                    <button
                                        key={ayanamsa.value}
                                        onClick={() => handleAyanamsaSelect(ayanamsa.value)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-[#E6D5B8]/30 bg-white hover:border-primary/30 hover:bg-surface-warm/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            isSelected ? "bg-primary text-white" : "bg-surface-warm text-gold-dark"
                                        )}>
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[15px] font-bold text-ink">{ayanamsa.label}</span>
                                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                                            </div>
                                            <p className="text-[11px] text-ink/50 mt-0.5">
                                                {`${ayanamsa.categories.length} categories available`}
                                            </p>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-5 h-5 transition-colors",
                                            isSelected ? "text-primary" : "text-ink/20"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* STEP 2: CATEGORY SELECTION */}
                    {step === 'category' && (
                        <div className="space-y-3">
                            <p className="text-[13px] text-ink/60 mb-4">
                                Select a category to browse available widgets for <span className="font-bold text-ink">{selectedAyanamsa}</span>.
                            </p>

                            {availableCategories.length === 0 ? (
                                <div className="text-center py-8 text-ink/50">
                                    <p>No categories available for this ayanamsa.</p>
                                    <button
                                        onClick={handleBack}
                                        className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-[12px] font-bold"
                                    >
                                        Select Different Ayanamsa
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {availableCategories.map((category) => {
                                        const Icon = CATEGORY_ICONS[category.id] || Grid3X3;
                                        const colors = CATEGORY_COLORS[category.id] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                                        const label = CATEGORY_LABELS[category.id] || category.name;
                                        
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategorySelect(category.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm",
                                                    "border-[#E6D5B8]/30 bg-white hover:border-primary/30"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                                    colors.bg, colors.text
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[15px] font-bold text-ink block">{label}</span>
                                                    <p className="text-[11px] text-ink/50 mt-0.5">
                                                        {category.widgets.length} widgets available
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-ink/20" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: WIDGET SELECTION */}
                    {step === 'widget' && (
                        <div className="space-y-3">
                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search widgets..."
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E6D5B8]/30 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            {categoryWidgets.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-ink/50">
                                        {searchQuery ? 'No widgets match your search.' : 'No widgets available in this category.'}
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-[12px] font-bold"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {categoryWidgets.map((widget) => {
                                        const Icon = CATEGORY_ICONS[widget.category] || Grid3X3;
                                        const colors = CATEGORY_COLORS[widget.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                                        
                                        return (
                                            <button
                                                key={widget.id}
                                                onClick={() => handleWidgetSelect(widget)}
                                                className="w-full flex items-start gap-4 p-4 rounded-xl border border-[#E6D5B8]/30 bg-white hover:border-primary hover:shadow-md transition-all text-left group"
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                                    colors.bg, colors.text
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-bold text-ink group-hover:text-primary transition-colors">
                                                            {widget.name}
                                                        </span>
                                                        {widget.defaultDimensions && (
                                                            <span className="text-[9px] text-ink/30 bg-ink/5 px-1.5 py-0.5 rounded">
                                                                {widget.defaultDimensions.width}×{widget.defaultDimensions.height}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[12px] text-ink/50 mt-0.5 line-clamp-2">
                                                        {widget.description}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg border-2 border-[#E6D5B8]/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#E6D5B8]/30 bg-surface-warm shrink-0">
                    <div className="flex items-center justify-between">
                        {step === 'ayanamsa' ? (
                            <button
                                onClick={onClose}
                                className="text-[13px] font-bold text-ink/50 hover:text-ink/70 px-4 py-2"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-[13px] font-bold text-ink/60 hover:text-ink px-4 py-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                        
                        {step === 'ayanamsa' && (
                            <button
                                onClick={() => setStep('category')}
                                disabled={!selectedAyanamsa}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
