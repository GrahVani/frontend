"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    Loader2, ChevronRight, ChevronLeft,
    Calendar, ChevronDown, Clock,
    User, MapPin, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { captureException } from '@/lib/monitoring';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';
import { parseChartData } from '@/lib/chart-helpers';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import { useQueryClient } from "@tanstack/react-query";
import dynamic from 'next/dynamic';

const TribhagiDasha = dynamic(() => import('@/components/astrology/TribhagiDasha'), { loading: () => <DashaLoadingSkeleton /> });
const ShodashottariDasha = dynamic(() => import('@/components/astrology/ShodashottariDasha'), { loading: () => <DashaLoadingSkeleton /> });
const DwadashottariDasha = dynamic(() => import('@/components/astrology/DwadashottariDasha'), { loading: () => <DashaLoadingSkeleton /> });
const PanchottariDasha = dynamic(() => import('@/components/astrology/PanchottariDasha'), { loading: () => <DashaLoadingSkeleton /> });
const ChaturshitisamaDasha = dynamic(() => import('@/components/astrology/ChaturshitisamaDasha'), { loading: () => <DashaLoadingSkeleton /> });
const SatabdikaDasha = dynamic(() => import('@/components/astrology/SatabdikaDasha'), { loading: () => <DashaLoadingSkeleton /> });
const DwisaptatiDasha = dynamic(() => import('@/components/astrology/DwisaptatiDasha'), { loading: () => <DashaLoadingSkeleton /> });
const ShasthihayaniDasha = dynamic(() => import('@/components/astrology/ShasthihayaniDasha'), { loading: () => <DashaLoadingSkeleton /> });
const ShattrimshatsamaDasha = dynamic(() => import('@/components/astrology/ShattrimshatsamaDasha'), { loading: () => <DashaLoadingSkeleton /> });
const AshtottariDasha = dynamic(() => import('@/components/astrology/AshtottariDasha'), { loading: () => <DashaLoadingSkeleton /> });

function DashaLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
        </div>
    );
}

import { PLANET_COLORS, SIGN_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import {
    findActiveDashaPath,
    processDashaResponse,
    extractPeriodsArray,
    getSublevels,
    ActiveDashaPath,
    DashaNode,
    standardizeDuration,
    generateVimshottariSubperiods,
    parseApiDate
} from '@/lib/dasha-utils';
import { DASHA_LEVELS, DASHA_SYSTEMS } from '@/lib/dasha-constants';

function parseDateStr(dateStr: string): Date | null {
    if (!dateStr) return null;
    const d = parseApiDate(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function formatDateShort(dateStr: string): string {
    const date = parseDateStr(dateStr);
    if (!date) return '\u2014';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDaysRemaining(endDateStr: string): number {
    const end = parseDateStr(endDateStr);
    if (!end) return 0;
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const MiniDashaList = () => {
    const { clientDetails } = useVedicClient();
    const { data: lahiriDasha, isLoading: lahiriLoading } = useDasha(
        clientDetails?.id || '',
        'mahadasha',
        'lahiri'
    );

    if (lahiriLoading) return (
        <div className="flex flex-col items-center justify-center h-full py-10 opacity-50">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mb-2" />
            <p className="text-[10px] text-amber-700 font-serif italic">Syncing Eras...</p>
        </div>
    );

    const periods = processDashaResponse(lahiriDasha?.data || []).slice(0, 9);

    return (
        <div className="space-y-1.5 p-1">
            <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-amber-700 tracking-wider">Lahiri Mahadashas</span>
                <span className="text-[10px] text-amber-400 font-mono">120 year cycle</span>
            </div>
            {periods.map((period, idx) => (
                <div 
                    key={idx} 
                    className={cn(
                        "px-3 py-2 rounded-xl border transition-all flex items-center justify-between",
                        period.isCurrent 
                            ? "bg-amber-100/80 border-amber-300 shadow-sm ring-1 ring-amber-200" 
                            : "bg-white border-amber-100 hover:border-amber-200 hover:bg-amber-50/50"
                    )}
                >
                    <div className="flex items-center gap-2">
                         <span className={cn(
                             "w-7 h-7 rounded-lg flex items-center justify-center text-[14px] font-bold border shadow-sm",
                             PLANET_COLORS[period.planet] || "bg-white border-amber-200 text-amber-800"
                         )}>
                             {getPlanetSymbol(period.planet)}
                         </span>
                         <div className="flex flex-col">
                             <span className="text-[12px] font-bold text-amber-900 leading-none">{period.planet}</span>
                             {period.isCurrent && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-green-600 tracking-tighter">Current</span>
                                </div>
                             )}
                         </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono font-bold text-amber-800 leading-none">{formatDateShort(period.startDate)}</div>
                        <div className="text-[9px] text-amber-500 font-medium mt-0.5">{standardizeDuration((period.raw?.duration_years as number) || 0, period.raw?.duration_days as number)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function VedicDashasPage() {
    const queryClient = useQueryClient();
    const { clientDetails, processedCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // Normalize ayanamsa for API calls: TrueChitra -> true_chitra
    const apiAyanamsa = settings.ayanamsa === 'TrueChitra' ? 'true_chitra' : settings.ayanamsa.toLowerCase();
    const isTrueChitra = settings.ayanamsa === 'TrueChitra';

    // D1 Chart Logic for Sidebar
    // For True Chitra, we default to Lahiri D1 chart as per user request
    const d1Chart = React.useMemo(() => {
        const targetSystem = isTrueChitra ? 'lahiri' : apiAyanamsa;
        return processedCharts[`D1_${targetSystem}`];
    }, [apiAyanamsa, processedCharts, isTrueChitra]);

    const { planets: displayPlanets, ascendant: ascendantSign } = parseChartData(d1Chart?.chartData);

    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length === 0) {
            refreshCharts();
        }
    }, [clientDetails?.id, processedCharts]);

    // State
    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaTree, setDashaTree] = useState<DashaNode[]>([]); // Now stores processed DashaNode[]
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [selectedPath, setSelectedPath] = useState<DashaNode[]>([]); // Array of processed DashaNode objects
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>([]);
    const [activeAnalysis, setActiveAnalysis] = useState<ActiveDashaPath | null>(null);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string | null>(null);

    const [isSubLevelFetching, setIsSubLevelFetching] = useState(false);
    const [leftPanelTab, setLeftPanelTab] = useState<'chart' | 'dashas'>('chart');

    // Queries
    const { data: treeResponse, isLoading: treeLoading, error: treeError } = useDasha(
        clientDetails?.id || '',
        'mahadasha',
        apiAyanamsa
    );

    const { data: otherData, isLoading: otherLoading, error: otherError } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        apiAyanamsa
    );

    const isVimshottari = selectedDashaType === 'vimshottari';
    const isLoading = isVimshottari ? treeLoading : otherLoading;

    // Dasha type flags (used for routing to specialized components & drill-down logic)
    const isAshtottari = selectedDashaType === 'ashtottari';
    const isChara = selectedDashaType === 'chara';
    const isTribhagi = selectedDashaType === 'tribhagi';
    const isShodashottari = selectedDashaType === 'shodashottari';
    const isDwadashottari = selectedDashaType === 'dwadashottari';
    const isPanchottari = selectedDashaType === 'panchottari';
    const isChaturshitisama = selectedDashaType === 'chaturshitisama';
    const isSatabdika = selectedDashaType === 'satabdika';
    const isDwisaptati = selectedDashaType === 'dwisaptati';
    const isShasthihayani = selectedDashaType === 'shastihayani';
    const isShattrimshatsama = selectedDashaType === 'shattrimshatsama';

    // Compute max available levels from the processed tree
    // This is dynamic — each dasha system returns different depths
    const maxAvailableLevel = useMemo(() => {
        if (!dashaTree || dashaTree.length === 0) return 0;
        // Check first maha's children depth
        const firstMaha = dashaTree[0];
        let depth = 0;
        let current = firstMaha;
        while (current?.sublevel && current.sublevel.length > 0 && depth < 4) {
            depth++;
            current = current.sublevel[0];
        }
        return depth;
    }, [dashaTree]);

    // Show drill-down UI only if data has 2+ levels
    const allowMathematicalDrillDown = maxAvailableLevel >= 1;

    // Effect: Reset dasha type when ayanamsa changes
    useEffect(() => {
        if (settings.ayanamsa === 'Raman' && selectedDashaType !== 'vimshottari') {
            setSelectedDashaType('vimshottari');
            setCurrentLevel(0);
            setSelectedPath([]);
            setDashaTree([]);
        } else if (settings.ayanamsa === 'KP' && selectedDashaType !== 'vimshottari') {
            setSelectedDashaType('vimshottari');
            setCurrentLevel(0);
            setSelectedPath([]);
            setDashaTree([]);
        } else if (settings.ayanamsa !== 'Raman' && settings.ayanamsa !== 'KP' && selectedDashaType === 'chara') {
            // Explicitly allow chara for other systems (Lahiri, etc.)
            // No reset needed
        }
    }, [settings.ayanamsa, selectedDashaType]);

    // Effect: Initialize and Analyze Tree
    useEffect(() => {
        const dashaData = isVimshottari ? treeResponse?.data : otherData?.data;
        if (dashaData) {
            // Auto-detect depth from the API response — no hard-coded limits
            // Each dasha system returns its own natural depth (2-5 levels)
            const processedTree = processDashaResponse(dashaData);

            if (processedTree.length > 0) {
                // Vimshottari has exactly 9 planetary lords per cycle - limit to one cycle
                const finalTree = isVimshottari ? processedTree.slice(0, 9) : processedTree;
                setDashaTree(finalTree);

                // Real-time analysis of the current active sequence
                const analysis = findActiveDashaPath(dashaData);
                setActiveAnalysis(analysis);

                if (analysis.nodes.length > 0) {
                    setSelectedIntelPlanet(analysis.nodes[0].planet);
                }
            }
        }
    }, [treeResponse, otherData, isVimshottari]);



    // Derived Viewing Periods based on drill-down
    useEffect(() => {
        if ((!allowMathematicalDrillDown && !isAshtottari && currentLevel > 1) || (isAshtottari && currentLevel > 2)) {
            setCurrentLevel(0);
            setSelectedPath([]);
        }

        if (!allowMathematicalDrillDown) {
            if (!isAshtottari) {
                setViewingPeriods(dashaTree);
            }
            if (!isVimshottari && !isAshtottari && !isChara) {
                setViewingPeriods(dashaTree);
                return;
            }
        }

        let currentNodes = dashaTree;
        for (const p of selectedPath) {
            const match = currentNodes.find(n => n.planet === (p.planet || p.lord));
            if (match && match.sublevel) {
                currentNodes = match.sublevel;
            } else {
                currentNodes = [];
                break;
            }
        }
        setViewingPeriods(currentNodes);
    }, [dashaTree, selectedPath, allowMathematicalDrillDown, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, currentLevel, isAshtottari, isVimshottari, isChara]);


    // Navigation Methods (Refactored for Processed Tree)
    const handleDrillDown = async (period: DashaNode) => {
        // All specialized dashas now use global drill-down

        // ASHTOTTARI INCREMENTAL FETCH (only for non-TrueChitra — True Chitra JSON already has all levels)
        if (isAshtottari && !isTrueChitra && currentLevel === 1 && (!period.sublevel || period.sublevel.length === 0)) {
            if (!clientDetails?.id) return;
            setIsSubLevelFetching(true);
            try {
                const mahaLord = selectedPath[0].planet;
                const antarLord = period.planet;

                const result = await clientApi.generateOtherDasha(
                    clientDetails.id,
                    'ashtottari',
                    settings.ayanamsa.toLowerCase(),
                    'pratyantardasha',
                    false,
                    { mahaLord, antarLord }
                );

                // Process the result to find the specific sublevels
                const fullProcessed = processDashaResponse(result.data, 2);
                // Find matching branch in fullProcessed using path
                const mahaNode = fullProcessed.find(m => m.planet === mahaLord);
                if (mahaNode) {
                    const antarNode = mahaNode.sublevel?.find(a => a.planet === antarLord);
                    if (antarNode && antarNode.sublevel && antarNode.sublevel.length > 0) {
                        period.sublevel = antarNode.sublevel;
                    }
                }
            } catch (err) {
                captureException(err, { tags: { section: 'dashas', action: 'fetch-sublevel' } });
            } finally {
                setIsSubLevelFetching(false);
            }
        }

        let nextLevelPeriods = period.sublevel || [];

        // Hybrid Logic: If API didn't return deeper levels, generate them on fly (Vimshottari only)
        if ((!nextLevelPeriods || nextLevelPeriods.length === 0) && allowMathematicalDrillDown && currentLevel < 4 && isVimshottari) {
            nextLevelPeriods = generateVimshottariSubperiods(period);
            period.sublevel = nextLevelPeriods; // Cache it
        }

        if (nextLevelPeriods && nextLevelPeriods.length > 0) {
            // We push the period object itself to path to maintain breadcrumb context
            const newPath = [...selectedPath, period];
            setSelectedPath(newPath);
            setCurrentLevel(currentLevel + 1);
            setSelectedIntelPlanet(period.planet);

            // Note: UseEffect will update viewingPeriods based on new path.
            // But we must ensure the UseEffect finds this 'generated' sublevel.
            // Since we mutated period.sublevel above, and 'period' is reference from dashaTree (or viewingPeriods derived from it),
            // the UseEffect traversal SHOULD see it.
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setSelectedPath([]);
            setCurrentLevel(0);
            setSelectedIntelPlanet(dashaTree.length > 0 ? dashaTree[0].planet : null); // Reset to first or current?
        } else {
            const newPath = selectedPath.slice(0, index + 1);
            setSelectedPath(newPath);
            setCurrentLevel(index + 1);

            const lastParent = newPath[newPath.length - 1];
            setSelectedIntelPlanet(lastParent.planet);
        }
    };

    const handleSystemChange = (type: string) => {
        setSelectedDashaType(type);
        setCurrentLevel(0);
        setSelectedPath([]);
        setDashaTree([]);
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className={cn(TYPOGRAPHY.sectionTitle, "!text-[20px] !text-amber-700 !mb-0")}>Please select a client to view Dasha details</p>
            </div>
        );
    }
    const activeLords = activeAnalysis?.nodes || [];
    const metadata = activeAnalysis?.metadata;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 -mx-4 -mt-4 px-4 py-6">
            {/* Page Heading */}
            <div className="mb-4">
                <h1 className="text-[28px] font-bold text-amber-900">Dasha System</h1>
                <p className="text-[16px] text-amber-600 mt-1">Explore planetary time periods and their influences</p>
            </div>

            {/* ================================================================= */}
            {/* TOP - HORIZONTAL CURRENT DASHA SUMMARY */}
            {/* ================================================================= */}
            {activeLords[0] && (
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        {/* Status & Title */}
                        <div className="flex items-center gap-3 shrink-0 min-w-[120px]">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-bold text-amber-900 !mb-0">Current Dasha</h2>
                                <div className="flex items-center gap-2 text-[11px] text-amber-600 font-sans">
                                    <span className="text-green-600 font-semibold tracking-wider">● Live</span>
                                </div>
                            </div>
                        </div>

                        {/* Mid Section: Date & Levels */}
                        <div className="flex flex-1 flex-wrap items-center justify-around gap-4 px-4 border-x border-amber-200/60">
                            {/* Dasha Levels */}
                            <div className="flex items-center gap-6">
                                {activeLords.slice(0, 3).map((node, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[11px] tracking-wider text-amber-500 font-bold mb-0.5">
                                            {i === 0 ? 'Mahadasha' : i === 1 ? 'Antardasha' : 'Pratyantar'}
                                        </span>
                                        <span className={cn(
                                            "font-bold text-[18px]",
                                            i === 0 ? "text-amber-600" : i === 1 ? "text-orange-700" : "text-pink-700"
                                        )}>
                                            {isChara ? String(node.raw?.sign_name || node.planet) : node.planet}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Date Range */}
                            <div className="flex flex-col text-center">
                                <span className="text-[12px] tracking-wide text-amber-500 font-bold mb-1">Duration</span>
                                <div className="text-[14px] text-amber-800 font-mono bg-amber-50 px-2 py-1 rounded border border-amber-200/50">
                                    {`${formatDateShort(activeLords[0].startDate)} — ${formatDateShort(activeLords[0].endDate)}`}
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="shrink-0 min-w-[200px] w-full md:w-auto">
                            <div className="flex justify-between text-[13px] mb-1 font-medium tracking-tight">
                                <span className="text-amber-600">Maha progress</span>
                                <span className="text-amber-700 font-bold">{activeAnalysis?.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                    style={{ width: `${activeAnalysis?.progress || 0}%` }}
                                />
                            </div>
                            <div className="text-[12px] text-right mt-1 text-amber-500 font-mono">
                                {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days left
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================= */}
            {/* MAIN CONTENT - SPLIT LAYOUT */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:h-[600px]">

                {/* LEFT COLUMN - NATAL CHART / MINI DASHAS */}
                <div className="lg:col-span-5 h-full">
                    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-3 py-2 border-b border-amber-200/50 flex justify-between items-center shrink-0 bg-amber-50/50">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setLeftPanelTab('chart')}
                                    className={cn(
                                        "px-2 py-1 text-[13px] font-bold rounded-lg transition-all",
                                        leftPanelTab === 'chart' ? "bg-amber-100 text-amber-900 border border-amber-200" : "text-amber-500 hover:text-amber-700"
                                    )}
                                >
                                    D1 Chart
                                </button>
                                <button
                                    onClick={() => setLeftPanelTab('dashas')}
                                    className={cn(
                                        "px-2 py-1 text-[13px] font-bold rounded-lg transition-all",
                                        leftPanelTab === 'dashas' ? "bg-amber-100 text-amber-900 border border-amber-200" : "text-amber-500 hover:text-amber-700"
                                    )}
                                >
                                    Dashas
                                </button>
                            </div>
                            <div className="px-2 py-0.5 bg-amber-100 rounded border border-amber-200">
                                <span className="text-amber-800 font-semibold !mb-0 text-[11px]">{isTrueChitra && leftPanelTab === 'chart' ? 'Lahiri' : (leftPanelTab === 'dashas' ? 'Lahiri' : ayanamsa)}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col overflow-hidden bg-amber-50/30">
                            {leftPanelTab === 'chart' ? (
                                <div className="flex-1 flex items-start justify-center p-0">
                                    {displayPlanets.length > 0 ? (
                                        <ChartWithPopup
                                            ascendantSign={ascendantSign}
                                            planets={displayPlanets}
                                            className="h-full aspect-square max-w-full"
                                            showDegrees={true}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-6 opacity-40">
                                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                            <p className="text-[14px] font-serif italic text-amber-700">Quantum mapping natal positions...</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                                    {/* Mini Dasha List for Lahiri */}
                                    <MiniDashaList />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - DASHA TABLE */}
                <div className="lg:col-span-7 h-full flex flex-col min-h-0">
                    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden flex flex-col h-full">
                        {/* Selector Tray - Fixed Top */}
                        <div className="p-4 border-b border-amber-200/50 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-amber-50/30">
                            <div className="flex items-center gap-3">
                                <label htmlFor="vedic-dasha-system-select" className="text-[14px] font-bold text-amber-700 tracking-wide !mb-0">System</label>
                                <div className="relative">
                                    <select
                                        id="vedic-dasha-system-select"
                                        value={selectedDashaType}
                                        onChange={(e) => handleSystemChange(e.target.value)}
                                        className="appearance-none bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-2 pr-10 text-amber-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer min-w-[200px]"
                                    >
                                        {DASHA_SYSTEMS.filter(sys => {
                                            if (settings.ayanamsa === 'KP' || settings.ayanamsa === 'Raman') {
                                                return sys.id === 'vimshottari';
                                            }
                                            if (settings.ayanamsa === 'TrueChitra') {
                                                // True Chitra supports all dashas including vimshottari (prana_dasha endpoint)
                                                // Chara is sign-based and not applicable to True Chitra
                                                return sys.id !== 'chara';
                                            }
                                            // Chara is now primarily a Lahiri/Jaimini feature
                                            return true;
                                        }).map((sys, idx) => (
                                            <option key={sys.id} value={sys.id}>
                                                {idx + 1}. {sys.name} {sys.years > 0 ? `(${sys.years} yrs)` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 pointer-events-none" />
                                </div>
                            </div>

                            {/* Level Tabs — show only levels that exist in the data */}
                            {allowMathematicalDrillDown && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.filter((_, idx) => idx <= maxAvailableLevel).map((level, idx) => (
                                        <button
                                            key={level.id}
                                            onClick={() => handleBreadcrumbClick(idx - 1)}
                                            disabled={idx > selectedPath.length}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap border",
                                                currentLevel === idx
                                                    ? "bg-amber-600 text-white border-transparent shadow-sm"
                                                    : idx <= selectedPath.length
                                                        ? "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                                                        : "bg-amber-50/50 text-amber-400/50 border-amber-100 cursor-not-allowed"
                                            )}
                                        >
                                            {level.short}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Breadcrumbs - Fixed Top */}
                        {maxAvailableLevel >= 1 && (
                            <div className="px-4 py-3 bg-amber-50/30 border-b border-amber-200/50 flex items-center gap-2 overflow-x-auto shrink-0">
                                <button
                                    onClick={() => handleBreadcrumbClick(-1)}
                                    className={cn(
                                        "text-[15px] font-bold !mb-0",
                                        currentLevel === 0 ? "text-amber-800" : "text-amber-700 hover:text-amber-900"
                                    )}
                                >
                                    Mahadasha
                                </button>
                                {selectedPath.map((period, idx) => (
                                    <React.Fragment key={idx}>
                                        <ChevronRight className="w-4 h-4 text-amber-400" />
                                        <button
                                            onClick={() => handleBreadcrumbClick(idx)}
                                            className={cn(
                                                "text-[15px] font-bold px-2 py-0.5 rounded border",
                                                isChara
                                                    ? (SIGN_COLORS[String(period.raw?.sign_name || period.planet)] || "bg-white border-amber-200")
                                                    : (PLANET_COLORS[period.planet || period.lord || 'Jupiter'] || "bg-white border-amber-200")
                                            )}
                                        >
                                            {isChara ? String(period.raw?.sign_name || period.planet) : (period.planet || period.lord)} {DASHA_LEVELS[idx].short}
                                        </button>
                                    </React.Fragment>
                                ))}
                                {currentLevel > 0 && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-amber-400" />
                                        <span className="text-[15px] font-bold text-amber-800 !mb-0">{DASHA_LEVELS[currentLevel].name}</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Table Area */}
                        <div className="flex-1 overflow-auto min-h-0 bg-amber-50/30 relative custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-2" />
                                    <p className="font-serif text-[12px] text-amber-700 animate-pulse italic">Quantum Calculating Eras...</p>
                                </div>
                            ) :(
                                <>
                                    {/* Handle Specialized Views */}
                                    {isTribhagi && currentLevel === 0 ? (
                                        <TribhagiDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isShodashottari && currentLevel === 0 ? (
                                        <ShodashottariDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isDwadashottari && currentLevel === 0 ? (
                                        <DwadashottariDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isPanchottari && currentLevel === 0 ? (
                                        <PanchottariDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isChaturshitisama && currentLevel === 0 ? (
                                        <ChaturshitisamaDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isSatabdika && currentLevel === 0 ? (
                                        <SatabdikaDasha periods={viewingPeriods} onDrillDown={handleDrillDown} />
                                    ) : isDwisaptati && currentLevel === 0 ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <DwisaptatiDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} onDrillDown={handleDrillDown} />
                                    ) : isShasthihayani && currentLevel === 0 ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <ShasthihayaniDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} onDrillDown={handleDrillDown} />
                                    ) : isShattrimshatsama && currentLevel === 0 ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <ShattrimshatsamaDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} onDrillDown={handleDrillDown} />
                                    ) : isAshtottari && !isTrueChitra && currentLevel === 0 ? (
                                        <AshtottariDasha
                                            periods={viewingPeriods}
                                            onDrillDown={handleDrillDown}
                                        />
                                    ) : isChara ? (
                                        <table className="w-full">
                                            <thead className={cn(TYPOGRAPHY.tableHeader, "bg-white border-b border-amber-200/60 sticky top-0 z-30 shadow-sm")}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-amber-800">Sign</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">Start date</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">End date</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">Duration</th>
                                                    <th className="px-3 py-2 text-center text-amber-800">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-200/40 font-medium bg-white/60">
                                                {viewingPeriods.map((period, idx) => (
                                                    <tr key={idx} className={cn("hover:bg-amber-50/60 transition-colors group", period.isCurrent && "bg-amber-50/40", (period.canDrillFurther || (isVimshottari && currentLevel < 4)) ? "cursor-pointer" : "cursor-default")} onClick={() => (period.canDrillFurther || (isVimshottari && currentLevel < 4)) && (isSubLevelFetching ? null : handleDrillDown(period))}>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-[14px] font-semibold border shadow-sm min-w-[72px] justify-center", SIGN_COLORS[String(period.raw?.sign_name || period.planet)] || "bg-white border-amber-200 text-amber-800")}>{String(period.raw?.sign_name || period.planet)}</span>
                                                                {period.isCurrent && <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse tracking-wide">Current</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2"><div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5 text-amber-700")}><Calendar className="w-3 h-3 text-amber-400" />{formatDateShort(period.startDate)}</div></td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>{formatDateShort(period.endDate)}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>{standardizeDuration((period.raw?.duration_years as number) || 0, period.raw?.duration_days as number)}</td>
                                                        <td className="px-3 py-2 text-center">{period.isCurrent ? <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">Active</span> : (period.canDrillFurther || (isVimshottari && currentLevel < 4)) ? <ChevronRight className="w-3 h-3 text-amber-600 transition-transform group-hover:scale-125" /> : <span className="text-amber-400 text-[12px]">—</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="w-full">
                                            <thead className={cn(TYPOGRAPHY.tableHeader, "bg-white border-b border-amber-200/60 sticky top-0 z-30 shadow-sm")}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-amber-800">Planet</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">Start date</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">End date</th>
                                                    <th className="px-3 py-2 text-left text-amber-800">Duration</th>
                                                    <th className="px-3 py-2 text-center text-amber-800">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-200/40 font-medium bg-white/60">
                                                {viewingPeriods.map((period, idx) => (
                                                    <tr key={idx} className={cn("hover:bg-amber-50/60 transition-colors group", period.isCurrent && "bg-amber-50/40", (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (isVimshottari && currentLevel < 4)) ? "cursor-pointer" : "cursor-default")} onClick={() => (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (isVimshottari && currentLevel < 4)) && (isSubLevelFetching ? null : handleDrillDown(period))}>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[14px] font-semibold border shadow-sm min-w-[72px] justify-center", PLANET_COLORS[period.planet] || "bg-white border-amber-200 text-amber-800")}><span className="opacity-90 text-[14px]">{getPlanetSymbol(period.planet)}</span>{period.planet}</span>
                                                                {period.isCurrent && <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">Current</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2"><div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5 text-amber-700")}><Calendar className="w-3 h-3 text-amber-400" />{formatDateShort(period.startDate)}</div></td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>{formatDateShort(period.endDate)}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2 text-amber-700")}>{standardizeDuration((period.raw?.duration_years as number) || 0, period.raw?.duration_days as number)}</td>
                                                        <td className="px-3 py-2 text-center">{isSubLevelFetching && currentLevel === 1 && period.planet === selectedIntelPlanet ? <Loader2 className="w-3 h-3 text-amber-600 animate-spin" /> : period.isCurrent ? <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">Active</span> : (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (isVimshottari && currentLevel < 4)) ? <ChevronRight className="w-3 h-3 text-amber-600 transition-transform group-hover:scale-125" /> : <span className="text-amber-400 text-[12px]">—</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* End Main Content */}

            {/* End Grid Layout */}

        </div >
    );
}


