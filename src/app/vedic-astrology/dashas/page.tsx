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
import {
    findActiveDashaPath,
    processDashaResponse,
    standardizeDashaLevels,
    extractPeriodsArray,
    getSublevels,
    ActiveDashaPath,
    DashaNode,
    standardizeDuration,
    generateVimshottariSubperiods
} from '@/lib/dasha-utils';
import { DASHA_LEVELS, DASHA_SYSTEMS } from '@/lib/dasha-constants';

function parseDateStr(dateStr: string): Date | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
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
// MAIN COMPONENT
// =============================================================================

export default function VedicDashasPage() {
    const queryClient = useQueryClient();
    const { clientDetails, processedCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // D1 Chart Logic for Sidebar
    const activeSystem = settings.ayanamsa.toLowerCase();
    const d1Chart = React.useMemo(() => {
        return processedCharts[`D1_${activeSystem}`];
    }, [activeSystem, processedCharts]);

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

    // Queries
    const { data: treeResponse, isLoading: treeLoading, error: treeError } = useDasha(
        clientDetails?.id || '',
        'mahadasha',
        settings.ayanamsa.toLowerCase()
    );

    const { data: otherData, isLoading: otherLoading, error: otherError } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        settings.ayanamsa.toLowerCase()
    );

    const isVimshottari = selectedDashaType === 'vimshottari';
    const isLoading = isVimshottari ? treeLoading : otherLoading;

    // Derived flags for specialized views
    const isTribhagi = selectedDashaType.includes('tribhagi');
    const isShodashottari = selectedDashaType === 'shodashottari';
    const isDwadashottari = selectedDashaType === 'dwadashottari';
    const isPanchottari = selectedDashaType.includes('panchottari');
    const isChaturshitisama = selectedDashaType === 'chaturshitisama';
    const isSatabdika = selectedDashaType === 'satabdika';
    const isDwisaptati = selectedDashaType === 'dwisaptati';
    const isAshtottari = selectedDashaType === 'ashtottari';
    const isChara = selectedDashaType === 'chara';
    // Fallback detection for Shastihayani via metadata condition
    const hasShasthiMeta = Boolean(((otherData?.data?.mahadashas as Record<string, unknown> | undefined)?.meta as Record<string, unknown> | undefined)?.shastihayani_condition);
    const isShasthihayani = selectedDashaType === 'shastihayani' || hasShasthiMeta;
    const hasShattrimMeta = Boolean(((otherData?.data?.mahadashas as Record<string, unknown> | undefined)?.meta as Record<string, unknown> | undefined)?.shattrimshatsama_condition);
    const isShattrimshatsama = selectedDashaType === 'shattrimshatsama' || hasShattrimMeta;

    const allowMathematicalDrillDown = isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isShasthihayani && !isShattrimshatsama && !isAshtottari;

    // Effect: Reset to Vimshottari if Raman/KP is selected, unless KP is using Chara
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
            // Use the robust processor from utils
            // HARD-LOCK: Specialized systems get maxLevel 1 (Antardasha), Vimshottari gets 4 (Prana)
            // HARD-LOCK: Specialized systems get maxLevel 1 (Antardasha), Vimshottari gets 4 (Prana), Ashtottari gets 2 (Pratyantar)
            const maxLevel = isVimshottari ? 4 : (isAshtottari ? 2 : (isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati || isShasthihayani || isShattrimshatsama ? 1 : 4));
            const processedTree = processDashaResponse(dashaData, maxLevel);

            if (processedTree.length > 0) {
                // Vimshottari has exactly 9 planetary lords per cycle - limit to one cycle
                const finalTree = isVimshottari ? processedTree.slice(0, 9) : processedTree;
                setDashaTree(finalTree);

                // Real-time analysis of the current active sequence
                // We can still use the raw response for this if findActiveDashaPath expects raw
                // Or update findActiveDashaPath to handle processed notes.
                // dasha-utils findActiveDashaPath handles raw. 
                // Let's stick to that for the "Active Analysis" widget.
                const analysis = findActiveDashaPath(dashaData);
                setActiveAnalysis(analysis);

                if (analysis.nodes.length > 0) {
                    setSelectedIntelPlanet(analysis.nodes[0].planet);
                }
            }
        }
    }, [treeResponse, otherData, isVimshottari, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, isShasthihayani, isShattrimshatsama, isAshtottari]);



    // Derived Viewing Periods based on drill-down
    // This allows traversing the full 5-level tree
    useEffect(() => {
        if ((!allowMathematicalDrillDown && !isAshtottari && currentLevel > 1) || (isAshtottari && currentLevel > 2)) {
            setCurrentLevel(0);
            setSelectedPath([]);
        }

        if (!allowMathematicalDrillDown || (isTribhagi && currentLevel >= 1) || (isShodashottari && currentLevel >= 1) || (isDwadashottari && currentLevel >= 1) || (isPanchottari && currentLevel >= 1) || (isChaturshitisama && currentLevel >= 1) || (isSatabdika && currentLevel >= 1) || (isDwisaptati && currentLevel >= 1) || (isAshtottari && currentLevel >= 2)) {
            // Revert: If it's specialized and we are at Antardasha or deeper, don't allow further
            if ((isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati) && currentLevel === 0) {
                setViewingPeriods(dashaTree);
            } else if (!isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari) {
                setViewingPeriods(dashaTree);
            }
            // For other systems, just show the root level (processed via standardizeDashaLevels previously)
            // But now we rely on dashaTree being processed.
            // Actually, the original logic for non-vimshottari was just showing root.
            if (!isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari && !isChara) {
                setViewingPeriods(dashaTree);
                return;
            }
        }

        let currentNodes = dashaTree;

        // Traverse down the path
        for (const p of selectedPath) {
            // p is the raw node in the old code, but let's see. 
            // In handleDrillDown below, we should push the PLANET NAME or ID to path, 
            // like the Demo does.
            // Refactoring path to store IDs/Names is cleaner than storing objects.
            // BUT, to minimize breaking changes, let's see what selectedPath stores.
            // Currently it stores provided objects "raw".

            // If selectedPath stores objects, we find the matching node in currentNodes
            const match = currentNodes.find(n => n.planet === (p.planet || p.lord));
            if (match && match.sublevel) {
                currentNodes = match.sublevel;
            } else {
                currentNodes = [];
                break;
            }
        }

        setViewingPeriods(currentNodes);

    }, [dashaTree, selectedPath, allowMathematicalDrillDown, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, currentLevel, isAshtottari]);


    // Navigation Methods (Refactored for Processed Tree)
    const handleDrillDown = async (period: DashaNode) => {
        if (isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati) return; // Disable global drill-down for specialized views

        // ASHTOTTARI INCREMENTAL FETCH
        if (isAshtottari && currentLevel === 1 && (!period.sublevel || period.sublevel.length === 0)) {
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

        // Hybrid Logic: If API didn't return deeper levels, generate them on fly
        if ((!nextLevelPeriods || nextLevelPeriods.length === 0) && allowMathematicalDrillDown && currentLevel < 4) {
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
                <p className={cn(TYPOGRAPHY.sectionTitle, "!text-[20px] !text-gold-dark !mb-0")}>Please select a client to view Dasha details</p>
            </div>
        );
    }
    const activeLords = activeAnalysis?.nodes || [];
    const metadata = activeAnalysis?.metadata;

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pt-2">
            {/* Page Heading */}
            <div className="mb-2">
                <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-bold")}>Dasha system</h1>
            </div>

            {/* ================================================================= */}
            {/* TOP - HORIZONTAL CURRENT DASHA SUMMARY */}
            {/* ================================================================= */}
            {activeLords[0] && (
                <div className="bg-surface-pure border border-gold-primary/20 rounded-xl p-2 shadow-sm mb-2">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        {/* Status & Title */}
                        <div className="flex items-center gap-3 shrink-0 min-w-[120px]">
                            <div className="w-10 h-10 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-gold-dark" />
                            </div>
                            <div>
                                <h2 className={cn(TYPOGRAPHY.sectionTitle, "!mb-0 text-[16px]")}>Current dasha</h2>
                                <div className="flex items-center gap-2 text-[9px] text-gold-dark font-sans">
                                    <span className={cn(TYPOGRAPHY.label, "text-green-600 !mb-0")}>● Live</span>
                                </div>
                            </div>
                        </div>

                        {/* Mid Section: Date & Levels */}
                        <div className="flex flex-1 flex-wrap items-center justify-around gap-4 px-4 border-x border-gold-primary/10">
                            {/* Dasha Levels */}
                            <div className="flex items-center gap-6">
                                {activeLords.slice(0, 3).map((node, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-wider text-gold-dark/60 font-bold mb-0.5">
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
                                <span className="text-[10px] uppercase tracking-wider text-gold-dark/60 font-bold mb-1">Duration</span>
                                <div className="text-[12px] text-gold-dark font-mono bg-gold-primary/5 px-2 py-1 rounded">
                                    {`${formatDateShort(activeLords[0].startDate)} — ${formatDateShort(activeLords[0].endDate)}`}
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="shrink-0 min-w-[180px] w-full md:w-auto">
                            <div className="flex justify-between text-[9px] mb-1 font-medium tracking-tight">
                                <span className="text-gold-dark uppercase">Maha progress</span>
                                <span className="text-amber-600 font-bold">{activeAnalysis?.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gold-primary/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                                    style={{ width: `${activeAnalysis?.progress || 0}%` }}
                                />
                            </div>
                            <div className="text-[9px] text-right mt-1 text-gold-dark/60 font-mono">
                                {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days left
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================= */}
            {/* MAIN CONTENT - SPLIT LAYOUT */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[500px]">

                {/* LEFT COLUMN - NATAL CHART */}
                <div className="lg:col-span-4 h-full">
                    <div className="prem-card rounded-2xl overflow-hidden bg-surface-pure flex flex-col h-full">
                        <div className={cn("px-4 py-2 border-b border-gold-primary/15 flex justify-between items-center shrink-0", COLORS.wbSectionHeader)}>
                            <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[16px] !mb-0")}>Natal Chart (D1)</h3>
                            <div className="px-2 py-0.5 bg-gold-primary/10 rounded border border-gold-primary/15">
                                <span className={cn(TYPOGRAPHY.label, "text-ink !mb-0 text-[10px]")}>{ayanamsa}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4 bg-surface-pure/50">
                            {displayPlanets.length > 0 ? (
                                <ChartWithPopup
                                    ascendantSign={ascendantSign}
                                    planets={displayPlanets}
                                    className="w-full aspect-square max-h-full"
                                    showDegrees={true}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-6 opacity-40">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                    <p className="text-[14px] font-serif italic text-ink">Quantum mapping natal positions...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - DASHA TABLE */}
                <div className="lg:col-span-8 h-full flex flex-col min-h-0">
                    <div className="prem-card overflow-hidden flex flex-col h-full">
                        {/* Selector Tray - Fixed Top */}
                        <div className="p-4 border-b border-gold-primary/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <label htmlFor="vedic-dasha-system-select" className={cn(TYPOGRAPHY.label, "!mb-0")}>System</label>
                                <div className="relative">
                                    <select
                                        id="vedic-dasha-system-select"
                                        value={selectedDashaType}
                                        onChange={(e) => handleSystemChange(e.target.value)}
                                        className="appearance-none bg-surface-pure border border-gold-primary/20 rounded-xl px-4 py-2 pr-10 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary/30 cursor-pointer min-w-[200px]"
                                    >
                                        {DASHA_SYSTEMS.filter(sys => {
                                            if (settings.ayanamsa === 'KP' || settings.ayanamsa === 'Raman') {
                                                return sys.id === 'vimshottari';
                                            }
                                            // Chara is now primarily a Lahiri/Jaimini feature
                                            return true;
                                        }).map((sys, idx) => (
                                            <option key={sys.id} value={sys.id}>
                                                {idx + 1}. {sys.name} {sys.years > 0 ? `(${sys.years} yrs)` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                                </div>
                            </div>

                            {/* Level Tabs */}
                            {allowMathematicalDrillDown && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isShasthihayani && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.filter((_, idx) => !isTribhagi || idx <= 1).map((level, idx) => (
                                        <button
                                            key={level.id}
                                            onClick={() => handleBreadcrumbClick(idx - 1)}
                                            disabled={idx > selectedPath.length}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap border",
                                                currentLevel === idx
                                                    ? cn(COLORS.wbActiveTab, "border-transparent shadow-sm")
                                                    : idx <= selectedPath.length
                                                        ? "bg-surface-pure text-gold-dark border-gold-primary/20 hover:bg-gold-primary/10"
                                                        : "bg-surface-warm text-ink/30 border-gold-primary/15 cursor-not-allowed"
                                            )}
                                        >
                                            {level.short}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Breadcrumbs - Fixed Top */}
                        {!isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && (
                            <div className="px-4 py-3 bg-surface-pure border-b border-gold-primary/10 flex items-center gap-2 overflow-x-auto shrink-0">
                                <button
                                    onClick={() => handleBreadcrumbClick(-1)}
                                    className={cn(
                                        TYPOGRAPHY.label,
                                        "!text-[14px] !font-bold !mb-0",
                                        currentLevel === 0 ? "!text-gold-dark" : "!text-gold-dark hover:!text-gold-dark"
                                    )}
                                >
                                    Mahadasha
                                </button>
                                {selectedPath.map((period, idx) => (
                                    <React.Fragment key={idx}>
                                        <ChevronRight className="w-4 h-4 text-gold-dark/40" />
                                        <button
                                            onClick={() => handleBreadcrumbClick(idx)}
                                            className={cn(
                                                "text-[14px] font-bold px-2 py-0.5 rounded border",
                                                isChara
                                                    ? (SIGN_COLORS[String(period.raw?.sign_name || period.planet)] || "bg-surface-pure border-gold-primary/15")
                                                    : (PLANET_COLORS[period.planet || period.lord || 'Jupiter'] || "bg-surface-pure border-gold-primary/15")
                                            )}
                                        >
                                            {isChara ? String(period.raw?.sign_name || period.planet) : (period.planet || period.lord)} {DASHA_LEVELS[idx].short}
                                        </button>
                                    </React.Fragment>
                                ))}
                                {currentLevel > 0 && (
                                    <>
                                        <ChevronRight className="w-4 h-4 text-gold-dark/40" />
                                        <span className={cn(TYPOGRAPHY.label, "!text-[14px] !font-bold !text-gold-dark !mb-0")}>{DASHA_LEVELS[currentLevel].name}</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Scrollable Table Area */}
                        <div className="flex-1 overflow-auto min-h-0 bg-white/40 relative custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                                    <Loader2 className="w-10 h-10 text-gold-dark animate-spin mb-4" />
                                    <p className="font-serif text-[14px] text-gold-dark animate-pulse italic">Quantum Calculating Eras...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Specialized views with selected path header */}
                                    {(isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati || isShasthihayani || isShattrimshatsama || isAshtottari) && selectedPath.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 p-4 border-b border-orange-100 bg-orange-50/30 shrink-0">
                                            {selectedPath[0] && (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gold-dark/40 uppercase tracking-widest mb-1">Mahadasha (M)</span>
                                                    <span className="text-[14px] font-black text-body uppercase">{selectedPath[0].planet}</span>
                                                </div>
                                            )}
                                            {selectedPath[1] && (
                                                <div className="flex flex-col">
                                                    <span className={cn(TYPOGRAPHY.label, "!text-[10px] !font-black !text-gold-dark/40 uppercase tracking-widest !mb-1")}>Antardasha (A)</span>
                                                    <span className={cn(TYPOGRAPHY.value, "!text-[14px] !font-black !text-body uppercase !mt-0")}>{selectedPath[1].planet}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Handle Specialized Views */}
                                    {isTribhagi ? (
                                        <TribhagiDasha periods={viewingPeriods} />
                                    ) : isShodashottari ? (
                                        <ShodashottariDasha periods={viewingPeriods} />
                                    ) : isDwadashottari ? (
                                        <DwadashottariDasha periods={viewingPeriods} />
                                    ) : isPanchottari ? (
                                        <PanchottariDasha periods={viewingPeriods} />
                                    ) : isChaturshitisama ? (
                                        <ChaturshitisamaDasha periods={viewingPeriods} />
                                    ) : isSatabdika ? (
                                        <SatabdikaDasha periods={viewingPeriods} />
                                    ) : isDwisaptati ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <DwisaptatiDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} />
                                    ) : isShasthihayani ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <ShasthihayaniDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} />
                                    ) : isShattrimshatsama ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        <ShattrimshatsamaDasha periods={viewingPeriods} isApplicable={((otherData?.data?.mahadashas as any)?.meta)?.is_applicable !== false} />
                                    ) : isAshtottari && currentLevel === 0 ? (
                                        <AshtottariDasha
                                            periods={viewingPeriods}
                                            onFetchPratyantar={async (mahaLord, antarLord) => {
                                                if (!clientDetails?.id) return [];
                                                try {
                                                    const result = await clientApi.generateOtherDasha(clientDetails.id, 'ashtottari', settings.ayanamsa.toLowerCase(), 'pratyantardasha', false, { mahaLord, antarLord });
                                                    const rawPeriods = extractPeriodsArray(result?.data);
                                                    if (rawPeriods.length > 0 && !getSublevels(rawPeriods[0])) return standardizeDashaLevels(rawPeriods);
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    const mahaNode = rawPeriods.find((m: any) => (m.planet || m.lord) === mahaLord);
                                                    if (mahaNode) {
                                                        const antardashas = getSublevels(mahaNode);
                                                        if (antardashas) {
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            const antarNode = antardashas.find((a: any) => (a.planet || a.lord) === antarLord);
                                                            const pratyantardashas = antarNode ? getSublevels(antarNode) : null;
                                                            if (pratyantardashas && pratyantardashas.length > 0) return standardizeDashaLevels(pratyantardashas);
                                                        }
                                                    }
                                                    return [];
                                                } catch (err) { return []; }
                                            }}
                                        />
                                    ) : isChara ? (
                                        <table className="w-full">
                                            <thead className={cn(TYPOGRAPHY.tableHeader, "bg-ink/5 border-b border-gold-primary/10 sticky top-0 z-10")}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Sign</th>
                                                    <th className="px-3 py-2 text-left">Start date</th>
                                                    <th className="px-3 py-2 text-left">End date</th>
                                                    <th className="px-3 py-2 text-left">Duration</th>
                                                    <th className="px-3 py-2 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gold-primary/10 font-medium bg-white/40">
                                                {viewingPeriods.map((period, idx) => (
                                                    <tr key={idx} className={cn("hover:bg-gold-primary/10 transition-colors group", period.isCurrent && "bg-gold-primary/5", (period.canDrillFurther || (allowMathematicalDrillDown && currentLevel < 4)) ? "cursor-pointer" : "cursor-default")} onClick={() => (period.canDrillFurther || (allowMathematicalDrillDown && currentLevel < 4)) && (isSubLevelFetching ? null : handleDrillDown(period))}>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border shadow-sm min-w-[60px] justify-center", SIGN_COLORS[String(period.raw?.sign_name || period.planet)] || "bg-surface-pure")}>{String(period.raw?.sign_name || period.planet)}</span>
                                                                {period.isCurrent && <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">Current</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2"><div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}><Calendar className="w-3 h-3 text-gold-dark/40" />{formatDateShort(period.startDate)}</div></td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateShort(period.endDate)}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{standardizeDuration((period.raw?.duration_years as number) || 0, period.raw?.duration_days as number)}</td>
                                                        <td className="px-3 py-2 text-center">{period.isCurrent ? <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span> : (period.canDrillFurther || (allowMathematicalDrillDown && currentLevel < 4)) ? <ChevronRight className="w-3 h-3 text-gold-dark transition-transform group-hover:scale-125" /> : <span className="text-gold-dark/40 text-[12px]">—</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <table className="w-full">
                                            <thead className={cn(TYPOGRAPHY.tableHeader, "bg-ink/5 border-b border-gold-primary/10 sticky top-0 z-10")}>
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Planet</th>
                                                    <th className="px-3 py-2 text-left">Start date</th>
                                                    <th className="px-3 py-2 text-left">End date</th>
                                                    <th className="px-3 py-2 text-left">Duration</th>
                                                    <th className="px-3 py-2 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gold-primary/10 font-medium bg-white/40">
                                                {viewingPeriods.map((period, idx) => (
                                                    <tr key={idx} className={cn("hover:bg-gold-primary/10 transition-colors group", period.isCurrent && "bg-gold-primary/5", (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) ? "cursor-pointer" : "cursor-default")} onClick={() => (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) && (isSubLevelFetching ? null : handleDrillDown(period))}>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border shadow-sm min-w-[60px] justify-center", PLANET_COLORS[period.planet] || "bg-surface-pure")}>{period.planet}</span>
                                                                {period.isCurrent && <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 animate-pulse uppercase tracking-wider">Current</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2"><div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}><Calendar className="w-3 h-3 text-gold-dark/40" />{formatDateShort(period.startDate)}</div></td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{formatDateShort(period.endDate)}</td>
                                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-3 py-2")}>{standardizeDuration((period.raw?.duration_years as number) || 0, period.raw?.duration_days as number)}</td>
                                                        <td className="px-3 py-2 text-center">{isSubLevelFetching && currentLevel === 1 && period.planet === selectedIntelPlanet ? <Loader2 className="w-3 h-3 text-gold-dark animate-spin" /> : period.isCurrent ? <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shadow-sm">ACTIVE</span> : (period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < 4)) ? <ChevronRight className="w-3 h-3 text-gold-dark transition-transform group-hover:scale-125" /> : <span className="text-gold-dark/40 text-[12px]">—</span>}</td>
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


