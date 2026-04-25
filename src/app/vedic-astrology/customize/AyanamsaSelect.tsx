"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AYANAMSA_OPTIONS, type AyanamsaSystem } from './ayana-types';

interface AyanamsaSelectProps {
    value: string;
    onChange: (value: AyanamsaSystem) => void;
    className?: string;
    compact?: boolean;
}

/**
 * Premium Ayanamsa Dropdown Component
 * 
 * A custom-styled dropdown that matches the Grahvani astrological UI theme.
 * Features:
 * - Theme-colored active state matching each ayanamsa system
 * - Smooth animations and transitions
 * - Compact mode for widget headers
 * - Accessible keyboard navigation
 * - Premium parchment/gold styling
 */
export function AyanamsaSelect({ 
    value, 
    onChange, 
    className,
    compact = true 
}: AyanamsaSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const selectedOption = AYANAMSA_OPTIONS.find(opt => 
        opt.value.toLowerCase() === value.toLowerCase()
    ) || AYANAMSA_OPTIONS[0];

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

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (optionValue: AyanamsaSystem) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div 
            ref={containerRef}
            className={cn("relative", className)}
        >
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "flex items-center gap-1 rounded-lg transition-all duration-200",
                    "border hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                    compact 
                        ? "px-2 py-1 text-[10px] font-black uppercase tracking-wider" 
                        : "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
                )}
                style={{
                    backgroundColor: 'transparent',
                    borderColor: isOpen ? selectedOption.color : '#E6D5B8',
                    color: isOpen ? selectedOption.color : '#8B7355',
                    ['--focus-ring-color' as string]: selectedOption.color
                }}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="truncate max-w-[70px]">
                    {selectedOption.label}
                </span>
                <ChevronDown 
                    className={cn(
                        "transition-transform duration-200",
                        compact ? "w-3 h-3" : "w-3.5 h-3.5",
                        isOpen && "rotate-180"
                    )}
                    style={{ color: isOpen ? selectedOption.color : '#C9A24D' }}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={cn(
                    "absolute z-[100] mt-1.5 min-w-[140px] rounded-xl overflow-hidden",
                    "bg-white border shadow-xl",
                    "transition-all duration-200 origin-top",
                    isOpen 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
                style={{
                    borderColor: '#E6D5B8',
                    boxShadow: '0 10px 40px -10px rgba(156, 122, 47, 0.25), 0 4px 12px rgba(0,0,0,0.08)'
                }}
                role="listbox"
                aria-label="Select Ayanamsa System"
            >
                {/* Header */}
                <div 
                    className="px-3 py-2 border-b flex items-center"
                    style={{ 
                        background: 'linear-gradient(180deg, #FDFBF7 0%, #F5EFE6 100%)',
                        borderColor: '#E6D5B8' 
                    }}
                >
                    <span className="text-[9px] font-black uppercase tracking-wider text-gold-dark">
                        Select Ayanamsa
                    </span>
                </div>

                {/* Options */}
                <div className="py-1">
                    {AYANAMSA_OPTIONS.map((option) => {
                        const isSelected = option.value === selectedOption.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2",
                                    "text-left transition-all duration-150",
                                    "hover:bg-[#FDFBF7] focus:outline-none focus:bg-[#FDFBF7]",
                                    isSelected && "bg-[#FDFBF7]"
                                )}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <span 
                                    className={cn(
                                        "text-[11px] font-bold uppercase tracking-wide",
                                        isSelected ? "text-ink" : "text-ink/70"
                                    )}
                                >
                                    {option.label}
                                </span>
                                
                                {/* Selection indicator */}
                                <div 
                                    className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200",
                                        isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                                    )}
                                    style={{
                                        background: isSelected ? option.color : 'transparent',
                                        boxShadow: isSelected ? `0 2px 4px ${option.color}40` : 'none'
                                    }}
                                >
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer decoration */}
                <div 
                    className="h-1 w-full"
                    style={{
                        background: `linear-gradient(90deg, 
                            ${AYANAMSA_OPTIONS[0].color} 0%, 
                            ${AYANAMSA_OPTIONS[1].color} 20%, 
                            ${AYANAMSA_OPTIONS[2].color} 40%, 
                            ${AYANAMSA_OPTIONS[3].color} 60%, 
                            ${AYANAMSA_OPTIONS[4].color} 80%,
                            ${AYANAMSA_OPTIONS[5].color} 100%)`
                    }}
                />
            </div>
        </div>
    );
}

export default AyanamsaSelect;
