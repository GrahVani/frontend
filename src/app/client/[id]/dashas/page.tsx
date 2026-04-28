"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, Loader2, RefreshCw, ChevronRight, ChevronLeft,
    Calendar, Star, Info, ChevronDown, Clock, MapPin,
    Sun, Moon as MoonIcon, LayoutDashboard, BrainCircuit, User,
    Download, FileText, Printer
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import {
    DashaNode,
    ActiveDashaPath,
    RawDashaPeriod,
    standardizeDashaLevels,
    findActiveDashaPath,
    getSublevels
} from '@/lib/dasha-utils';
import { cn } from '@/lib/utils';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

// ============ UTILS & CONSTANTS ============

function parseDateStr(dateStr: string): Date | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function formatDateShort(dateStr: string): string {
    const date = parseDateStr(dateStr);
    if (!date) return '—';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getDaysRemaining(endDateStr: string): number {
    const end = parseDateStr(endDateStr);
    if (!end) return 0;
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}


// Level configuration for parity
const DASHA_LEVELS = [
    { id: 'mahadasha', name: 'Mahadasha', short: 'Maha' },
    { id: 'antardasha', name: 'Antardasha', short: 'Antar' },
    { id: 'pratyantardasha', name: 'Pratyantardasha', short: 'Pratyantar' },
    { id: 'sookshmadasha', name: 'Sookshma', short: 'Sookshma' },
    { id: 'pranadasha', name: 'Prana', short: 'Prana' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function VedicDashasPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // State
    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaTree, setDashaTree] = useState<Record<string, unknown>[]>([]);
    const [selectedPath, setSelectedPath] = useState<Record<string, unknown>[]>([]);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string>('');
    const isVimshottari = selectedDashaType === 'vimshottari';
    const isChara = selectedDashaType === 'chara';

    // 1. Determine Drill-down Path for Backend Request
    const backendContext = useMemo(() => {
        const pathParam = searchParams.get('p');
        return { drillDownPath: pathParam ? pathParam.split(',') : [] };
    }, [searchParams]);

    // 2. Data Queries
    const { data: treeResponse, isLoading: treeLoading, isFetching: treeFetching } = useDasha(
        clientDetails?.id || '',
        'tree',
        settings.ayanamsa.toLowerCase(),
        backendContext
    );

    const { data: otherData, isLoading: otherLoading, isFetching: otherFetching } = useOtherDasha(
        clientDetails?.id || '',
        selectedDashaType,
        settings.ayanamsa.toLowerCase()
    );

    const isLoading = isVimshottari ? treeLoading : otherLoading;
    const isFetching = isVimshottari ? treeFetching : otherFetching;

    // 3. Pure Functional Projection: Derive EXACT view from URLs and data
    const activeAnalysis = useMemo(() => {
        const response = isVimshottari ? treeResponse : otherData;
        if (!response?.data) return null;
        const backendPath = (response.data as Record<string, unknown>).curr_path;
        if (backendPath && Array.isArray(backendPath) && backendPath.length >= 5) {
            return {
                nodes: backendPath,
                progress: findActiveDashaPath(response.data).progress,
                metadata: findActiveDashaPath(response.data).metadata
            };
        }
        return findActiveDashaPath(response.data);
    }, [treeResponse, otherData, isVimshottari]);

    const { currentPath, viewingPeriods, isPathSatisfied } = useMemo(() => {
        const response = isVimshottari ? treeResponse : otherData;
        const rawMahadashas = (response?.data as Record<string, unknown>)?.mahadashas as Record<string, unknown>[] || (response?.data as Record<string, unknown>)?.periods as Record<string, unknown>[] || [];

        const pathParam = searchParams.get('p') || "";
        const targetPlanets = pathParam ? pathParam.split(',') : [];

        let branch = rawMahadashas;
        let parentStart = "";
        let reconciledPath: (Record<string, unknown> & { planet?: string; lord?: string; raw?: Record<string, unknown>; sign_name?: string })[] = [];
        let viewingBranch = rawMahadashas;
        let satisfiedCount = 0;

        if (rawMahadashas.length > 0) {
            for (const pName of targetPlanets) {
                const match = branch.find((n: Record<string, unknown>) =>
                    ((n.planet as string) || (n.lord as string) || '').toLowerCase() === (pName || '').toLowerCase()
                );
                if (match) {
                    reconciledPath.push(match);
                    parentStart = (match.start_date || match.startDate) as string;
                    satisfiedCount++;
                    const subs = getSublevels(match);
                    // Critical: ONLY transition the viewing branch if children actually exist
                    if (subs && subs.length > 0) {
                        branch = subs;
                        viewingBranch = subs;
                    } else {
                        // If we are looking for more path components but children are missing, 
                        // we stop here. isPathSatisfied will be false.
                        break;
                    }
                } else break;
            }
        }

        return {
            currentPath: reconciledPath,
            viewingPeriods: standardizeDashaLevels(viewingBranch, parentStart),
            isPathSatisfied: targetPlanets.length === 0 || satisfiedCount === targetPlanets.length
        };
    }, [treeResponse, otherData, isVimshottari, searchParams]);

    const currentLevel = currentPath.length;

    // 4. Effects for Peripheral Sync (Analysis, Intel, Storage)
    useEffect(() => {
        const response = isVimshottari ? treeResponse : otherData;
        if (response?.data) {
            const raw = (response.data as Record<string, unknown>).mahadashas as Record<string, unknown>[] || (response.data as Record<string, unknown>).periods as Record<string, unknown>[] || [];
            if (raw.length > 0) setDashaTree(raw);
        }
    }, [treeResponse, otherData, isVimshottari]);

    useEffect(() => {
        if (activeAnalysis?.nodes && activeAnalysis.nodes.length > 0 && !selectedIntelPlanet) {
            setSelectedIntelPlanet(activeAnalysis.nodes[0].planet || activeAnalysis.nodes[0].lord);
        }
    }, [activeAnalysis, selectedIntelPlanet]);

    useEffect(() => {
        if (JSON.stringify(currentPath) !== JSON.stringify(selectedPath)) {
            setSelectedPath(currentPath);
        }
    }, [currentPath, selectedPath]);

    // Navigation Methods (Deterministic & Auto-Drill)
    const handleDrillDown = (period: DashaNode) => {
        // Last stage locking: stop if we are already at Sookshma viewing Prana (level 4)
        if (currentLevel >= 4) return;

        const raw = period.raw;
        if (raw && getSublevels(raw as RawDashaPeriod)) {
            const newPathArr = [...currentPath, raw as RawDashaPeriod];
            const urlPlanets = newPathArr.map(p => p.planet || p.lord).join(',');
            router.replace(`?p=${urlPlanets}`, { scroll: false });
            setSelectedIntelPlanet(period.planet);
        }
    };

    const handleBreadcrumbClick = (targetIdx: number) => {
        if (targetIdx === -1) {
            router.replace('?', { scroll: false });
            if (activeAnalysis?.nodes?.[0]) {
                setSelectedIntelPlanet(activeAnalysis.nodes[0].planet);
            }
            return;
        }

        let newPathArr = [];

        if (targetIdx < currentPath.length) {
            // Moving Back: standard slice
            newPathArr = currentPath.slice(0, targetIdx + 1);
        } else {
            // Jumping Forward: Follow ONLY the active/live path to that depth
            const activeNodes = activeAnalysis?.nodes || [];
            newPathArr = activeNodes.slice(0, targetIdx + 1);
        }

        if (newPathArr.length > 0) {
            const lastNode = newPathArr[newPathArr.length - 1];
            const urlPlanets = newPathArr.map(p => p.planet || p.lord).join(',');
            router.replace(`?p=${urlPlanets}`, { scroll: false });
            setSelectedIntelPlanet(lastNode.planet || lastNode.lord);
        }
    };

    const handleSystemChange = (type: string) => {        setSelectedDashaType(type);
        router.replace('?', { scroll: false });
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="font-serif text-[20px] text-gold-dark">Please select a client to view Dasha details</p>
            </div>
        );
    }

    const activeLords = activeAnalysis?.nodes || [];
    const metadata = activeAnalysis?.metadata;

    return (
        <div className="min-h-screen space-y-4 pt-2">

            {/* HEADER: Client Info & Actions */}
            <div className="prem-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gold-dark" />
                            <div className="font-serif font-black text-ink text-[18px]">
                                {clientDetails.name}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 text-[14px] text-gold-dark border-l border-gold-primary/15 pl-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDateShort(clientDetails.dateOfBirth)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {clientDetails.timeOfBirth}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {clientDetails.placeOfBirth?.city || 'Unknown'}
                            </span>
                            <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-dark text-[12px] font-bold rounded-full">
                                {metadata?.nakshatraAtBirth || 'Vishakha'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-ink text-white text-[12px] font-bold rounded-full uppercase">
                            {ayanamsa}
                        </span>
                        <button className="p-2.5 rounded-lg hover:bg-gold-primary/10 text-gold-dark" title="Print" aria-label="Print dasha chart">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-lg hover:bg-gold-primary/10 text-gold-dark" title="Export PDF" aria-label="Export dasha chart as PDF">
                            <Download className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['dasha'] })}
                            disabled={isFetching}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                isFetching ? "text-gold-dark opacity-50 cursor-wait" : "hover:bg-gold-primary/10 text-gold-dark"
                            )}
                            title="Refresh Data"
                        >
                            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CURRENT PERIOD CARD */}
            <div className="bg-gradient-to-r from-ink to-body rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif font-bold text-[18px]">Current Running Dasha</h2>
                    <span className="ml-auto text-[12px] bg-green-500 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        ● LIVE
                    </span>
                </div>

                {activeLords.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Mahadasha</label>
                            <div className="text-[24px] font-black">{isChara ? String(activeLords[0].raw?.sign_name || activeLords[0].planet) : activeLords[0].planet}</div>
                            <div className="text-[10px] text-white/60 mt-1">{formatDateShort(activeLords[0].startDate)} - {formatDateShort(activeLords[0].endDate)}</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20 transform scale-105 shadow-xl">
                            <label className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold block mb-1 underline decoration-yellow-400/30 underline-offset-4">Antardasha</label>
                            <div className="text-[24px] font-black text-yellow-300">{activeLords[1] ? (isChara ? String(activeLords[1].raw?.sign_name || activeLords[1].planet) : activeLords[1].planet) : '—'}</div>
                            <div className="text-[10px] text-white/60 mt-1">{formatDateShort(activeLords[1]?.startDate)} - {formatDateShort(activeLords[1]?.endDate)}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1">Pratyantardasha</label>
                            <div className="text-[24px] font-black">{activeLords[2] ? (isChara ? String(activeLords[2].raw?.sign_name || activeLords[2].planet) : activeLords[2].planet) : '—'}</div>
                            <div className="text-[10px] text-white/60 mt-1">{formatDateShort(activeLords[2]?.startDate)} - {formatDateShort(activeLords[2]?.endDate)}</div>
                        </div>
                    </div>
                )}

                {activeLords.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-white/60 font-bold tracking-tight">Active Path Summary</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {activeLords.slice(0, 5).map((l, i) => (
                                        <React.Fragment key={i}>
                                            <span className={cn("text-[12px] font-bold", i === 1 ? "text-yellow-400" : "text-white")}>{isChara ? String(l.raw?.sign_name || l.planet) : l.planet}</span>
                                            {i < 4 && <ChevronRight className="w-3 h-3 text-white/20" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[12px]">
                            <span className="text-yellow-300 font-black">
                                {getDaysRemaining(activeLords[0].endDate).toLocaleString()} days remaining
                            </span>
                            <span>Ends: {formatDateShort(activeLords[0].endDate)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="prem-card overflow-hidden">

                        {/* Selector Tray */}
                        <div className="p-4 border-b border-gold-primary/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <label htmlFor="dasha-system-select" className="text-[12px] font-bold text-gold-dark uppercase tracking-wider">System</label>
                                <div className="relative">
                                    <select
                                        id="dasha-system-select"
                                        value={selectedDashaType}
                                        onChange={(e) => handleSystemChange(e.target.value)}
                                        className="appearance-none bg-surface-pure border border-gold-primary/20 rounded-xl px-4 py-2 pr-10 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary/30 cursor-pointer min-w-[200px]"
                                    >
                                        <option value="vimshottari">① Vimshottari (120 yrs)</option>
                                        <option value="chara">② Jaimini Chara Dasha</option>
                                        <option value="yogini">③ Yogini (36 yrs)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                                </div>
                            </div>

                            {isVimshottari && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {DASHA_LEVELS.map((level, idx) => {
                                        const isNavigable = idx <= currentLevel || idx < (activeAnalysis?.nodes?.length || 0);
                                        return (
                                            <button
                                                key={level.id}
                                                onClick={currentLevel === idx ? undefined : () => handleBreadcrumbClick(idx - 1)}
                                                disabled={!isNavigable}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap border",
                                                    currentLevel === idx
                                                        ? "bg-gold-primary text-white border-gold-primary shadow-sm cursor-default"
                                                        : isNavigable
                                                            ? "bg-surface-pure text-gold-dark border-gold-primary/20 hover:bg-gold-primary/10"
                                                            : "bg-surface-warm text-ink/30 border-gold-primary/15 cursor-not-allowed"
                                                )}
                                            >
                                                {level.short}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Breadcrumbs */}
                        <div className="px-4 py-3 bg-surface-pure border-b border-gold-primary/10 flex items-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => handleBreadcrumbClick(-1)}
                                className={cn(
                                    "text-[14px] font-bold",
                                    currentLevel === 0 ? "text-gold-dark" : "text-gold-dark hover:text-gold-dark"
                                )}
                            >
                                Mahadasha
                            </button>
                            {currentPath.map((period, idx) => (
                                <React.Fragment key={idx}>
                                    <ChevronRight className="w-4 h-4 text-gold-dark/40" />
                                    <button
                                        onClick={() => handleBreadcrumbClick(idx)}
                                        className={cn(
                                            "text-[14px] font-bold px-2 py-0.5 rounded border",
                                            PLANET_COLORS[period.planet || period.lord || 'Jupiter'] || "bg-surface-pure border-gold-primary/15"
                                        )}
                                    >
                                        {isChara ? (String(period.raw?.sign_name || period.planet || '')) : (period.planet || period.lord)} {DASHA_LEVELS[idx].short}
                                    </button>
                                </React.Fragment>
                            ))}
                            {currentLevel > 0 && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gold-dark/40" />
                                    <span className="text-[14px] font-bold text-gold-dark">{DASHA_LEVELS[currentLevel]?.name}</span>
                                </>
                            )}
                        </div>

                        {/* Table Area */}
                        <div className="overflow-x-auto min-h-[400px]">
                            {(isLoading || !isPathSatisfied) ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Loader2 className="w-10 h-10 text-gold-dark animate-spin mb-4" />
                                    <p className="font-serif text-[14px] text-gold-dark animate-pulse italic">
                                        {!isPathSatisfied ? `Diving into ${DASHA_LEVELS[currentLevel]?.name}...` : "Quantum Calculating Eras..."}
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-ink/5 text-body/70 font-black uppercase text-[10px] tracking-widest border-b border-gold-primary/10">
                                        <tr>
                                            <th className="px-6 py-4">Planet</th>
                                            <th className="px-6 py-4">Start Date</th>
                                            <th className="px-6 py-4">End Date</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gold-primary/10">
                                        {viewingPeriods.length > 0 ? viewingPeriods.map((period, idx) => (
                                            <tr
                                                key={idx}
                                                className={cn(
                                                    "transition-colors",
                                                    period.isCurrent ? "bg-gold-primary/5" : (currentLevel < 4 ? "hover:bg-surface-pure" : "")
                                                )}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center border font-semibold text-[16px] shadow-sm",
                                                            PLANET_COLORS[period.planet] || "bg-surface-pure border-gold-primary/15"
                                                        )}>
                                                            {isChara ? String(period.raw?.sign_name || period.planet).slice(0, 2) : getPlanetSymbol(period.planet)}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-ink text-[15px]">{isChara ? String(period.raw?.sign_name || period.planet) : <span className="inline-flex items-center gap-1.5">{getPlanetSymbol(period.planet)} {period.planet}</span>}</div>
                                                            {period.isCurrent && (
                                                                <span className="text-[9px] font-black uppercase text-gold-dark bg-gold-primary/10 px-1.5 py-0.5 rounded tracking-tighter">Current Period</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[14px] text-body font-medium">{formatDateShort(period.startDate)}</td>
                                                <td className="px-6 py-4 text-[14px] text-body font-medium">{formatDateShort(period.endDate)}</td>
                                                <td className="px-6 py-4 text-[14px] text-gold-dark/70 font-bold">{period.duration}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={currentLevel < 4 ? () => setSelectedIntelPlanet(period.planet) : undefined}
                                                            className={cn(
                                                                "p-2 rounded-lg border shadow-sm transition-all",
                                                                currentLevel < 4
                                                                    ? "bg-surface-pure border-gold-primary/15 text-gold-dark hover:bg-gold-primary hover:text-white"
                                                                    : "bg-surface-warm border-gold-primary/15 text-ink/25 cursor-default"
                                                            )}
                                                            title={currentLevel < 4 ? "View Intelligence" : "Final Stage"}
                                                        >
                                                            <BrainCircuit className="w-4 h-4" />
                                                        </button>
                                                        {period.raw && getSublevels(period.raw as RawDashaPeriod) && currentLevel < 4 && (
                                                            <button
                                                                onClick={() => handleDrillDown(period)}
                                                                className="p-2 rounded-lg bg-surface-pure text-gold-dark hover:bg-gold-primary hover:text-white transition-all"
                                                                title="Drill Down"
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-20 text-gold-dark/40 italic font-serif">
                                                    No dasha cycles calculated for this level.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Life Timeline Placeholder (For UI Parity with Senior Design) */}
                    {isVimshottari && currentLevel === 0 && (
                        <div className="prem-card p-5">
                            <h4 className="text-[10px] font-black uppercase text-ink tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                LIFE TIMELINE (MAHADASHA)
                            </h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {dashaTree.slice(0, 9).map((d, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl border flex items-center justify-center text-[10px] font-black shadow-sm",
                                            PLANET_COLORS[String(d.planet || d.lord || 'Jupiter')] || "bg-surface-pure border-gold-primary/15"
                                        )}>
                                            {String(d.planet || d.lord || '').slice(0, 2)}
                                        </div>
                                        <span className="text-[9px] font-bold text-gold-dark uppercase">{String(d.planet || d.lord || '')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR: INTEL */}
                <div className="space-y-4">
                    <div className="prem-card p-5 sticky top-4">
                        <div className="flex items-center gap-2 mb-6 border-b border-gold-primary/10 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-dark">
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-serif font-black text-ink">{selectedIntelPlanet || 'Rahu'} Dasha Intel</h3>
                                <p className="text-[10px] text-gold-dark/60 font-bold uppercase tracking-wider">Psychological \u0026 Physical Impacts</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[12px] font-black uppercase text-ink tracking-widest">Key Themes</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Ambition', 'Foreign Influence', 'Sudden Gains', 'Materialism'].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-surface-pure border border-gold-primary/15 text-gold-dark rounded-lg text-[10px] font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-surface-pure to-white rounded-xl border-l-4 border-gold-primary shadow-inner">
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gold-dark mt-1 shrink-0" />
                                    <div>
                                        <div className="text-[12px] font-black text-ink mb-1">Dasha Sentiment</div>
                                        <p className="text-[12px] text-gold-dark leading-relaxed">
                                            This period favors material advancement but may cause internal restlessness. Focus on grounding practices.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-ink text-white rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-ink/20 hover:bg-body transition-all flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" />
                                Generate Full Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}