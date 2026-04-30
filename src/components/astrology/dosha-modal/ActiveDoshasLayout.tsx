"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import NorthIndianChart, { Planet } from '@/components/astrology/NorthIndianChart/NorthIndianChart';
import { ChartWithPopup } from "@/components/astrology/NorthIndianChart";
import { DoshaModal } from '@/components/astrology/dosha-modal/DoshaModal';
import { KnowledgeTooltip } from '@/components/knowledge';
import { DoshaItem } from '@/types/yoga-ui.types';

interface ActiveDoshasLayoutProps {
    clientId: string;
    planets: Planet[];
    ascendantSign: number;
    allDoshas: DoshaItem[];
    ayanamsa?: string;
    className?: string;
}

export default function ActiveDoshasLayout({
    clientId,
    planets,
    ascendantSign,
    allDoshas,
    ayanamsa = 'lahiri',
    className
}: ActiveDoshasLayoutProps) {
    const [selectedDoshaId, setSelectedDoshaId] = useState<string>(() => allDoshas[0]?.id || "");
    const [zoomedChart, setZoomedChart] = useState<{ varga: string, label: string } | null>(null);

    useEffect(() => {
        if (!zoomedChart) return;
        const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomedChart(null); };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [zoomedChart]);

    const activeDosha = allDoshas.find(d => d.id === selectedDoshaId);

    return (
        <div className={cn("flex flex-col lg:flex-row gap-4 p-4 bg-amber-50/60 min-h-screen font-sans", className)}>
            {/* LEFT: Birth Chart - Fixed Width */}
            <div className="flex flex-col gap-2 min-h-[360px] h-[60vh] max-h-[600px] w-full lg:w-[440px] shrink-0">
                <div className="border border-red-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-amber-50/60 max-w-[440px]">
                    <div className="bg-red-50 px-3 py-1.5 border-b border-red-100 flex justify-between items-center shrink-0">
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] text-red-900 leading-tight tracking-wide")}>Birth chart (D1)</h3>
                        <button
                            onClick={() => setZoomedChart({ varga: "D1", label: "Birth chart (D1)" })}
                            className="text-red-900 hover:text-red-600 transition-colors"
                        >
                            <Maximize2 className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-start p-0 pb-0 bg-transparent">
                        <ChartWithPopup
                            planets={planets}
                            ascendantSign={ascendantSign}
                            className="bg-transparent border-none aspect-square h-full w-auto"
                            preserveAspectRatio="none"
                            showDegrees={true}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT: Doshas & Details - Flexible Width */}
            <div className="flex-1 flex flex-col gap-2 min-h-[360px] h-[60vh] max-h-[600px] min-w-0">
                <div className="border border-red-200 rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-amber-50/60">
                    <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] text-red-900 leading-tight tracking-wide whitespace-nowrap")}><KnowledgeTooltip term="dosha_system" unstyled>Dosha</KnowledgeTooltip> analysis</h3>

                        {/* Integrated Header Dropdown */}
                        <div className="relative group w-full sm:w-64 shrink-0">
                            <select
                                value={selectedDoshaId}
                                onChange={(e) => setSelectedDoshaId(e.target.value)}
                                className={cn(TYPOGRAPHY.value, "w-full pl-3 pr-8 py-1.5 bg-white/80 border border-red-200 rounded-xl text-red-900 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-300 transition-all shadow-sm group-hover:bg-white")}
                            >
                                <optgroup label="Karmic / ancestral" className="font-serif italic text-red-900">
                                    {allDoshas.filter(d => d.category === 'karmic').map(dosha => (
                                        <option key={dosha.id} value={dosha.id} className="font-sans not-italic font-medium text-amber-900">
                                            {dosha.name} ({dosha.severity.toUpperCase()})
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Planetary afflictions" className="font-serif italic text-red-900">
                                    {allDoshas.filter(d => d.category === 'planetary').map(dosha => (
                                        <option key={dosha.id} value={dosha.id} className="font-sans not-italic font-medium text-amber-900">
                                            {dosha.name} ({dosha.severity.toUpperCase()})
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Periodic / transits" className="font-serif italic text-red-900">
                                    {allDoshas.filter(d => d.category === 'transit').map(dosha => (
                                        <option key={dosha.id} value={dosha.id} className="font-sans not-italic font-medium text-amber-900">
                                            {dosha.name} ({dosha.severity.toUpperCase()})
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none transition-transform group-hover:scale-110">
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-3 flex flex-col gap-4 overflow-hidden">
                        {selectedDoshaId && (
                            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden flex flex-col">
                                <div className="bg-white border border-red-100 rounded-[1.5rem] overflow-hidden shadow-lg relative flex flex-col h-full mt-0">
                                    {/* Detail Content */}
                                    <div className="flex-1 p-0 bg-red-50/5 overflow-y-auto custom-scrollbar">
                                        <DoshaModal
                                            clientId={clientId}
                                            doshaType={selectedDoshaId}
                                            ayanamsa={ayanamsa}
                                            className="bg-transparent border-none p-2 shadow-none"
                                        />
                                    </div>

                                    {/* Detail Footer */}
                                    <div className="bg-red-50/20 px-5 py-3 border-t border-red-100 flex flex-col items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => setSelectedDoshaId("")}
                                            className="text-red-900/60 hover:text-red-900 transition-colors text-[9px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5"
                                        >
                                            Clear selection
                                        </button>
                                        <div className="flex items-center gap-2 text-red-900/40 text-[8px] font-bold uppercase tracking-[0.1em]">
                                            <Shield className="w-2.5 h-2.5" /> Specialized <KnowledgeTooltip term="dosha_system" unstyled>dosha</KnowledgeTooltip> rendering engine
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Zoom */}
            {zoomedChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-ink/40 animate-in fade-in zoom-in-95 duration-300" role="dialog" aria-modal="true" aria-label={zoomedChart.label}>
                    <div className="bg-amber-50/60 border border-amber-200/60 rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl">
                        <button
                            onClick={() => setZoomedChart(null)}
                            aria-label="Close zoomed chart"
                            className="absolute top-4 right-4 p-2 rounded-xl bg-amber-50/60 text-amber-900 hover:bg-amber-100 hover:text-amber-700 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6 text-center">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px]")}>{zoomedChart.label}</h2>
                            <p className={cn(TYPOGRAPHY.label, "mt-2")}>{zoomedChart.varga} divisional chart</p>
                        </div>
                        <div className="aspect-square w-full max-w-md mx-auto rounded-2xl p-6 border border-amber-200/60">
                            <ChartWithPopup
                                ascendantSign={ascendantSign}
                                planets={planets}
                                className="bg-transparent border-none"
                                showDegrees={zoomedChart?.varga === 'D1'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

