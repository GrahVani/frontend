"use client";

import React, { useState, useEffect } from 'react';
import {
    Compass,
    Loader2,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Info,
    LayoutDashboard,
    Hexagon,
    Layers
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { useSudarshanChakra } from '@/hooks/queries/useCalculations';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import SudarshanChakraFinal from '@/components/astrology/SudarshanChakraFinal';

export default function ChakrasPage() {
    const { clientDetails, processedCharts, isLoadingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const activeSystem = settings.ayanamsa.toLowerCase();

    const chartContainerRef = React.useRef<HTMLDivElement>(null);
    const [zoomScale, setZoomScale] = useState(1);

    const handleZoomIn = () => setZoomScale(s => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setZoomScale(s => Math.max(s - 0.2, 0.5));
    const handleFullscreen = () => {
        if (chartContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                chartContainerRef.current.requestFullscreen();
            }
        }
    };

    // Use pre-fetched data from context for instant render
    const { chakraData, loading } = React.useMemo(() => {
        const key = `sudarshana_${activeSystem}`;
        const raw = processedCharts[key]?.chartData;

        return {
            chakraData: raw?.data || raw,
            loading: !raw && isLoadingCharts
        };
    }, [processedCharts, activeSystem, isLoadingCharts]);

    const fetchChakraData = refreshCharts; // Map refetch to the global refresh helper

    /* Removed manual fetchChakraData and useEffect */

    if (!clientDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-10 max-w-md">
                    <Compass className="w-16 h-16 text-amber-600 mb-4 mx-auto animate-spin-slow" />
                    <h2 className="text-[18px] font-bold text-amber-900 mb-2">No Client Selected</h2>
                    <p className="text-[12px] text-amber-700 max-w-md">Please select a client to view their Sudarshan Chakra and other esoteric diagrams.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-12 animate-in fade-in duration-700">
            <div className="space-y-0">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <h1 className="text-[28px] font-bold text-amber-900">
                        Sudarshan Chakra
                    </h1>
                    <p className="text-[16px] text-amber-600">Triple-layered karmic visualization</p>
                </div>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Main Visualization Column */}
                <div className="md:col-span-8 space-y-6">
                    <div
                        ref={chartContainerRef}
                        className="relative w-full bg-amber-50/60 rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden flex items-center justify-center p-2 group"
                    >
                        {/* Parchment Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/textures/parchment.png')]" />

                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/20 via-transparent to-orange-50/20 pointer-events-none" />

                        {loading ? (
                            <div className="flex flex-col items-center gap-6 relative z-10 py-16">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-amber-700 animate-spin" />
                                    <Compass className="w-8 h-8 text-amber-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-amber-900 text-[14px] font-bold animate-pulse">Generating chart...</p>
                                    <p className="text-amber-700 text-[10px] italic">Synchronizing Surya, Chandra, & Birth chart layers</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative z-10 animate-in zoom-in-95 duration-1000 flex items-center justify-center">
                                <div style={{ transform: `scale(${zoomScale})` }} className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out">
                                    <SudarshanChakraFinal
                                        data={chakraData}
                                        className="max-w-[100%] max-h-[100%] scale-100"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Visual Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 z-20">
                            {[
                                { icon: Maximize2, label: 'Fullscreen', onClick: handleFullscreen },
                                { icon: ZoomIn, label: 'Zoom In', onClick: handleZoomIn },
                                { icon: ZoomOut, label: 'Zoom Out', onClick: handleZoomOut }
                            ].map((ctrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={ctrl.onClick}
                                    title={ctrl.label}
                                    className="p-4 bg-white/90 backdrop-blur text-amber-900 rounded-2xl border border-amber-200 shadow-xl hover:bg-amber-800 hover:text-white transition-all transform hover:scale-110"
                                >
                                    <ctrl.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Side Panel Column */}
                <div className="md:col-span-4 space-y-8">
                    {/* Dynamic Legend Card */}
                    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-8 space-y-8 relative overflow-hidden group/legend">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover/legend:bg-amber-500/10" />

                        <div className="flex items-center gap-3 border-b border-amber-200/60 pb-5">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200/60">
                                <Layers className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h3 className={cn(TYPOGRAPHY.label, "mb-0 text-amber-700 uppercase tracking-[0.2em] text-[10px]")}>Technical Layers</h3>
                                <p className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] text-amber-900")}>Chart Legend</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    label: 'Surya Chart',
                                    circle: 'Outer Circle',
                                    color: 'text-amber-700',
                                    bgColor: 'bg-amber-100',
                                    ringIcon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-500">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="opacity-100" />
                                            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />
                                            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" className="opacity-10" />
                                        </svg>
                                    ),
                                    desc: 'Physical destiny & vitality'
                                },
                                {
                                    label: 'Chandra Chart',
                                    circle: 'Middle Circle',
                                    color: 'text-blue-700',
                                    bgColor: 'bg-blue-100',
                                    ringIcon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-500">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />
                                            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2.5" className="opacity-100" />
                                            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" className="opacity-10" />
                                        </svg>
                                    ),
                                    desc: 'Mental landscape & emotional flow'
                                },
                                {
                                    label: 'Birth Chart',
                                    circle: 'Inner Circle',
                                    color: 'text-emerald-700',
                                    bgColor: 'bg-emerald-100',
                                    ringIcon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-500">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="opacity-10" />
                                            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" className="opacity-20" />
                                            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="3" className="opacity-100" />
                                        </svg>
                                    ),
                                    desc: 'The core karmic blueprint (Lagna)'
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-1 group border border-transparent hover:border-amber-200/60">
                                    <div className={cn("mt-1 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all", item.color, item.bgColor)}>
                                        {item.ringIcon}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(TYPOGRAPHY.value, "text-[16px] font-semibold text-amber-900")}>{item.label}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold uppercase tracking-wider">{item.circle}</span>
                                        </div>
                                        <p className={cn(TYPOGRAPHY.subValue, "text-amber-800 font-medium leading-relaxed")}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-amber-200/60">
                            <div className="flex items-center gap-2 text-[11px] text-amber-700 font-semibold">
                                <Info className="w-3 h-3" />
                                <span>Radial synchronization of three vital planes</span>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
            </div>
        </div>
    );
}
