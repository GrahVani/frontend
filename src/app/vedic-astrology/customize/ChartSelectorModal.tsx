"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    X, 
    Plus,
    Globe,
    Filter,
    LayoutGrid,
    ChevronDown,
    Check,
    ArrowRight,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { CustomizeChartItem } from '@/hooks/useCustomizeCharts';
import { AYANAMSA_HIERARCHY, AYANAMSA_OPTIONS, type AyanamsaSystem } from './ayana-types';

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

interface DropdownProps {
    label: string;
    icon: React.ElementType;
    value: string;
    options: { value: string; label: string; count?: number }[];
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM DROPDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function CustomDropdown({ label, icon: Icon, value, options, onChange, placeholder, disabled = false }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption 
        ? `${selectedOption.label}${selectedOption.count !== undefined ? ` (${selectedOption.count})` : ''}`
        : placeholder;

    return (
        <div ref={containerRef} className="relative flex-1 min-w-0">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gold-dark mb-1.5">
                {label}
            </label>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-all",
                    disabled 
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60" 
                        : "bg-white border-[#E6D5B8]/50 hover:border-primary/40 hover:shadow-sm cursor-pointer"
                )}
            >
                <Icon className={cn(
                    "w-4 h-4 shrink-0",
                    disabled ? "text-gray-400" : "text-gold-dark"
                )} />
                <span className={cn(
                    "flex-1 text-[13px] font-medium truncate",
                    selectedOption ? "text-ink" : "text-ink/50"
                )}>
                    {displayText}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-180" : "",
                    disabled ? "text-gray-400" : "text-gold-dark"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E6D5B8]/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        const displayLabel = `${option.label}${option.count !== undefined ? ` (${option.count})` : ''}`;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 text-left transition-all",
                                    isSelected 
                                        ? "bg-primary/5 text-primary" 
                                        : "hover:bg-surface-warm/50 text-ink"
                                )}
                            >
                                <span className="text-[13px] font-medium">
                                    {displayLabel}
                                </span>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-primary shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

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
    const [selectedAyanamsa, setSelectedAyanamsa] = useState<AyanamsaSystem>(currentAyanamsa as AyanamsaSystem || 'Lahiri');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedWidget, setSelectedWidget] = useState<string>('');

    // Get hierarchy for selected ayanamsa
    const activeHierarchy = useMemo(() => {
        return AYANAMSA_HIERARCHY.find(h => h.value === selectedAyanamsa);
    }, [selectedAyanamsa]);

    // Ayanamsa dropdown options
    const ayanamsaOptions = useMemo(() => {
        return AYANAMSA_OPTIONS.map(opt => ({
            value: opt.value,
            label: opt.label,
        }));
    }, []);

    // Category dropdown options
    const categoryOptions = useMemo(() => {
        if (!activeHierarchy) return [];
        return activeHierarchy.categories
            .filter(cat => {
                // Check if category has any available widgets
                return cat.widgets.some(w => {
                    const chart = availableCharts.find(c => c.id === w.id);
                    return chart && !selectedCharts.includes(`${w.id}_${selectedAyanamsa.toLowerCase()}`);
                });
            })
            .map(cat => ({
                value: cat.id,
                label: cat.name,
                count: cat.widgets.filter(w => {
                    const chart = availableCharts.find(c => c.id === w.id);
                    return chart && !selectedCharts.includes(`${w.id}_${selectedAyanamsa.toLowerCase()}`);
                }).length,
            }));
    }, [activeHierarchy, availableCharts, selectedCharts, selectedAyanamsa]);

    // Widget dropdown options
    const widgetOptions = useMemo(() => {
        if (!selectedCategory || !activeHierarchy) return [];
        const cat = activeHierarchy.categories.find(c => c.id === selectedCategory);
        if (!cat) return [];
        
        return cat.widgets
            .map(w => availableCharts.find(c => c.id === w.id))
            .filter((c): c is CustomizeChartItem => !!c)
            .filter(c => !selectedCharts.includes(`${c.id}_${selectedAyanamsa.toLowerCase()}`))
            .map(c => ({
                value: c.id,
                label: c.name,
            }));
    }, [selectedCategory, activeHierarchy, availableCharts, selectedCharts, selectedAyanamsa]);

    // Reset category and widget when ayanamsa changes
    const handleAyanamsaChange = (value: string) => {
        setSelectedAyanamsa(value as AyanamsaSystem);
        setSelectedCategory('');
        setSelectedWidget('');
    };

    // Reset widget when category changes
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setSelectedWidget('');
    };

    // Handle widget selection - add the widget
    const handleAddWidget = () => {
        if (!selectedWidget) return;
        const widget = availableCharts.find(c => c.id === selectedWidget);
        if (widget) {
            onSelect(widget, selectedAyanamsa);
            // Reset widget selection after adding
            setSelectedWidget('');
            onClose();
        }
    };

    // Reset when opening
    React.useEffect(() => {
        if (isOpen) {
            setSelectedAyanamsa(currentAyanamsa as AyanamsaSystem || 'Lahiri');
            setSelectedCategory('');
            setSelectedWidget('');
        }
    }, [isOpen, currentAyanamsa]);

    // Auto-select "All Items" equivalent or first category when ayanamsa changes
    React.useEffect(() => {
        if (selectedAyanamsa && categoryOptions.length > 0 && !selectedCategory) {
            // Find "All Items" option or use first category
            const allItemsOption = categoryOptions.find(c => 
                c.label.toLowerCase().includes('all') || c.label.toLowerCase().includes('divisional')
            );
            if (allItemsOption) {
                setSelectedCategory(allItemsOption.value);
            } else {
                setSelectedCategory(categoryOptions[0].value);
            }
        }
    }, [categoryOptions, selectedAyanamsa, selectedCategory]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-3xl mx-4 bg-[#F5EFE6] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="px-6 py-5 bg-[#FDFBF7] border-b border-[#E6D5B8]/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#3D2314] flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-black text-ink tracking-tight">
                                    ADD WIDGETS
                                </h2>
                                <p className="text-[11px] font-bold text-gold-dark tracking-wide">
                                    SELECT CHARTS, WIDGETS & TOOLS
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gold-primary/20 rounded-xl transition-colors text-ink/40 hover:text-ink"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dropdowns Row */}
                <div className="px-6 py-5 bg-[#E6D5B8]/20">
                    <div className="flex items-start gap-4">
                        <CustomDropdown
                            label="Ayanamsa"
                            icon={Globe}
                            value={selectedAyanamsa}
                            options={ayanamsaOptions}
                            onChange={handleAyanamsaChange}
                            placeholder="Select ayanamsa"
                        />
                        <CustomDropdown
                            label="Category"
                            icon={Filter}
                            value={selectedCategory}
                            options={categoryOptions}
                            onChange={handleCategoryChange}
                            placeholder={categoryOptions.length > 0 ? `${categoryOptions.length} categories` : "No categories"}
                            disabled={categoryOptions.length === 0}
                        />
                        <CustomDropdown
                            label="Widget"
                            icon={LayoutGrid}
                            value={selectedWidget}
                            options={widgetOptions}
                            onChange={setSelectedWidget}
                            placeholder={widgetOptions.length > 0 ? `Choose widget (${widgetOptions.length})` : "No widgets"}
                            disabled={widgetOptions.length === 0}
                        />
                    </div>
                </div>

                {/* Selected Widget Preview */}
                {selectedWidget && (
                    <div className="px-6 py-4 bg-white border-t border-[#E6D5B8]/30">
                        {(() => {
                            const widget = availableCharts.find(c => c.id === selectedWidget);
                            if (!widget) return null;
                            return (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <LayoutGrid className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[14px] font-bold text-ink">{widget.name}</h3>
                                        <p className="text-[12px] text-ink/50">{widget.description}</p>
                                    </div>
                                    <button
                                        onClick={handleAddWidget}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#3D2314] hover:bg-[#3D2314]/90 transition-colors shadow-sm"
                                    >
                                        Add Widget
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
